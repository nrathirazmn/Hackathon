// app/(tabs)/location.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Alert,
  Animated,
  Dimensions,
  PanResponder,
  Linking,
  Share,
} from "react-native";
import MapView, { Marker, UrlTile, Region, PROVIDER_DEFAULT } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const STRAWB = "#FF6B8B";
const MATCHA_DEEP = "#0B4F3F";
const MAPTILER_URL = `https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}.png?key=${process.env.EXPO_PUBLIC_MAPTILER_KEY}`;

type NominatimPlace = {
  place_id: number;
  osm_type: "node" | "way" | "relation";
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type?: string;
  class?: string;
  address?: Record<string, string>;
  name?: string;
};

type MarkerItem = {
  id: string;
  lat: number;
  lon: number;
  name: string;
  address?: string;
};

const INITIAL_DELTA: Pick<Region, "latitudeDelta" | "longitudeDelta"> = {
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

function regionToBBox(r: Region) {
  const south = r.latitude - r.latitudeDelta / 2;
  const north = r.latitude + r.latitudeDelta / 2;
  const west = r.longitude - r.longitudeDelta / 2;
  const east = r.longitude + r.longitudeDelta / 2;
  return { south, west, north, east };
}

// Nominatim viewbox: left,top,right,bottom
function bboxToViewbox(b: { south: number; west: number; north: number; east: number }) {
  return `${b.west},${b.north},${b.east},${b.south}`;
}

function buildNominatimUrl(query: string, r: Region) {
  const vb = bboxToViewbox(regionToBBox(r));
  const params = new URLSearchParams({
    format: "jsonv2",
    q: query,
    viewbox: vb,
    bounded: "1",
    addressdetails: "1",
    namedetails: "1",
    extratags: "0",
    limit: "50",
  });
  return `https://nominatim.openstreetmap.org/search?${params.toString()}`;
}

export default function LocationScreen() {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [places, setPlaces] = useState<MarkerItem[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // bottom sheet
  const [selected, setSelected] = useState<MarkerItem | null>(null);
  const sheetH = Math.min(380, Math.round(Dimensions.get("window").height * 0.46));
  const translateY = useRef(new Animated.Value(sheetH + 40)).current;
  const openSheet = () =>
    Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 6 }).start();
  const closeSheet = () =>
    Animated.timing(translateY, { toValue: sheetH + 40, duration: 160, useNativeDriver: true }).start(() =>
      setSelected(null)
    );
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 6,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(Math.min(g.dy, sheetH));
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 80) closeSheet();
        else openSheet();
      },
    })
  ).current;

  // initial location + fetch
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Location needed", "Please enable location permission.");
          setLoading(false);
          return;
        }
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const r: Region = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          ...INITIAL_DELTA,
        };
        setRegion(r);
        setLoading(false);
        fetchNominatim(r);
      } catch (e) {
        console.log(e);
        setLoading(false);
        Alert.alert("Error", "Could not get your location.");
      }
    })();
  }, []);

  // keywords to include (English + Malay)
  const KEYWORDS = [
    "recycle",
    "recycling centre",
    "recycling center",
    "kitar semula",
    "pusat kitar semula",
  ];
  const kwRegex = useRef(new RegExp(KEYWORDS.join("|"), "i")).current;

  const fetchNominatim = useCallback(async (r: Region) => {
    try {
      setFetching(true);

      const headers = {
        // REQUIRED by Nominatim usage policy — put your app/email
        "User-Agent": "CSaRecyclingApp/1.0 (youremail@example.com)",
        "Accept-Language": "en",
      };

      // Query each keyword separately, then merge
      const urls = KEYWORDS.map((kw) => buildNominatimUrl(kw, r));
      const responses = await Promise.all(
        urls.map((u) => fetch(u, { headers }).then((res) => res.json()).catch(() => []))
      );
      const merged = ([] as NominatimPlace[]).concat(...responses);

      // Dedup by osm_type/osm_id and filter by keywords present in name/display_name
      const seen = new Set<string>();
      const deduped: MarkerItem[] = [];
      for (const p of merged) {
        if (!p.lat || !p.lon) continue;
        const id = `${p.osm_type}/${p.osm_id}`;
        if (seen.has(id)) continue;

        const dn = p.display_name ?? "";
        const nm = p.name ?? "";
        const addrObj = p.address ?? {};
        const addr = [addrObj.road, addrObj.neighbourhood || addrObj.suburb, addrObj.city || addrObj.town || addrObj.village, addrObj.state]
          .filter(Boolean)
          .join(", ");

        // keep only if keyword appears in name or display_name (safer)
        if (!(kwRegex.test(nm) || kwRegex.test(dn))) continue;

        seen.add(id);
        deduped.push({
          id,
          lat: parseFloat(p.lat),
          lon: parseFloat(p.lon),
          name: nm || dn.split(",")[0] || "Recycling Centre",
          address: addr || dn,
        });
      }

      setPlaces(deduped);
    } catch (e) {
      console.log("Nominatim error", e);
      Alert.alert("Network", "Failed to load recycling centres.");
    } finally {
      setFetching(false);
    }
  }, []);

  const onRegionChangeDone = (r: Region) => {
    setRegion(r);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchNominatim(r), 700);
  };

  const recenter = () => {
    if (region && mapRef.current) mapRef.current.animateToRegion(region, 600);
  };

  function openInExternalMaps(m: MarkerItem) {
    const lat = m.lat.toFixed(6);
    const lon = m.lon.toFixed(6);
    Linking.openURL(`https://maps.google.com/?q=${lat},${lon}`).catch(() =>
      Linking.openURL(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=17/${lat}/${lon}`)
    );
  }

  async function sharePlace(m: MarkerItem) {
    const lat = m.lat.toFixed(6);
    const lon = m.lon.toFixed(6);
    await Share.share({
      message: `${m.name}\n${m.address ?? ""}\nhttps://maps.google.com/?q=${lat},${lon}`,
    });
  }

  if (loading || !region) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8, color: "#4b5563" }}>Finding your location…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* status pill */}
      <View style={styles.topBadge}>
        <MaterialCommunityIcons name="recycle" size={14} color={MATCHA_DEEP} />
        <Text style={styles.badgeText}>
          {fetching ? "Loading centres…" : `${places.length} centre(s) in view`}
        </Text>
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={region}
        onRegionChangeComplete={onRegionChangeDone}
        showsUserLocation
        showsMyLocationButton={false}
        toolbarEnabled={false}
      >
        <UrlTile urlTemplate={MAPTILER_URL} maximumZ={19} zIndex={-1} />

        {places.map((p) => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.lat, longitude: p.lon }}
            title={p.name}
            description={p.address}
            onPress={() => {
              setSelected(p);
              openSheet();
            }}
          />
        ))}
      </MapView>

      {/* recenter */}
      <Pressable style={styles.fab} onPress={recenter}>
        <Ionicons name="locate" size={22} color="#fff" />
      </Pressable>

      {/* manual refresh */}
      <Pressable
        style={[styles.fab, { right: 76, backgroundColor: MATCHA_DEEP }]}
        onPress={() => region && fetchNominatim(region)}
      >
        <Ionicons name="refresh" size={20} color="#fff" />
      </Pressable>

      {/* attribution */}
      <View style={styles.attribution}>
        <Text style={styles.attributionText}>Search: Nominatim | © OpenStreetMap contributors | © MapTiler</Text>
      </View>

      {/* backdrop */}
      {selected ? <Pressable style={styles.backdrop} onPress={closeSheet} /> : null}

      {/* compact bottom sheet */}
      {selected ? (
        <Animated.View
          style={[styles.sheet, { height: sheetH, transform: [{ translateY }] }]}
          {...panResponder.panHandlers}
        >
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle} numberOfLines={1}>{selected.name}</Text>
          {selected.address ? <Text style={styles.sheetSub} numberOfLines={2}>{selected.address}</Text> : null}

          <View style={styles.sheetButtons}>
            <Pressable style={[styles.sheetBtn, { backgroundColor: MATCHA_DEEP }]} onPress={() => openInExternalMaps(selected)}>
              <Ionicons name="navigate" size={18} color="#fff" />
              <Text style={styles.sheetBtnText}>Navigate</Text>
            </Pressable>
            <Pressable style={[styles.sheetBtn, { backgroundColor: STRAWB }]} onPress={() => sharePlace(selected)}>
              <Ionicons name="share-social" size={18} color="#fff" />
              <Text style={styles.sheetBtnText}>Share</Text>
            </Pressable>
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  map: { flex: 1 },

  fab: {
    position: "absolute",
    right: 16,
    bottom: 24 + 70,
    backgroundColor: STRAWB,
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },

  topBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    zIndex: 2,
    backgroundColor: "#FFFFFFEE",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  badgeText: { color: MATCHA_DEEP, fontWeight: "800" },

  attribution: {
    position: "absolute",
    left: 12,
    bottom: 8 + 70,
    backgroundColor: "#FFFFFFCC",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  attributionText: { fontSize: 10, color: "#334155" },

  // backdrop + compact sheet
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "#00000055" },
  sheet: {
    position: "absolute",
    left: 0, right: 0, bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 12 + 70, // tighter
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
    elevation: 16,
    gap: 6, // small natural spacing
  },
  sheetHandle: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E2E8F0",
    marginBottom: 6,
  },
  sheetTitle: { fontSize: 16, fontWeight: "800", color: "#0F172A" },
  sheetSub: { fontSize: 13, color: "#475569", marginBottom: 8 },

  sheetButtons: { flexDirection: "row", gap: 12, marginTop: 4 },
  sheetBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10, // smaller
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  sheetBtnText: { color: "#fff", fontWeight: "800" },
});
