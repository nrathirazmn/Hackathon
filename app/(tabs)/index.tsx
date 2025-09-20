// app/(tabs)/index.tsx
import { useEffect, useCallback } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { usePoints } from "@/context/points";
import { useFocusEffect } from "@react-navigation/native";

const MATCHA_DEEP = "#0B4F3F";
const STRAWB = "#FF6B8B";
const CHIP_BG = "#EAF7ED";

const { width } = Dimensions.get("window");
const SLIDE_W = width - 40;

export default function HomeScreen() {
  const { points, setPoints, addPoints } = usePoints();

  // --- mock fetch; replace with your real API call ---
  const fetchLatestPoints = useCallback(async () => {
    // const res = await fetch(`${API}/points/${userId}`, { headers: { Authorization: `Bearer ${token}` }});
    // const json = await res.json();
    // setPoints(json.total);
    setPoints(points); // keep state; replace with real value later
  }, [points, setPoints]);

  useEffect(() => {
    fetchLatestPoints();
  }, [fetchLatestPoints]);

  // Refresh whenever this screen regains focus
  useFocusEffect(
    useCallback(() => {
      fetchLatestPoints();
    }, [fetchLatestPoints])
  );

  const categories = ["Paper", "Plastic", "Glass", "Metal", "E-waste"];

  const slides = [
    { id: "s1", title: "Earn 2x points this week!", color: "#FDECF2" },
    { id: "s2", title: "Scan to learn sorting tips", color: "#EAF7ED" },
    { id: "s3", title: "Leaderboard: Top Recyclers", color: "#EAF2FD" },
  ];

  const campaigns = [
    { id: "c1", title: "Petaling Clean-Up", sub: "Sep 28 – Oct 5", color: "#FFF5E6" },
    { id: "c2", title: "Plastic Free Week", sub: "Partner: 1 Utama", color: "#F1FFF4" },
  ];

  const facts = [
    { id: "f1", title: "Aluminum can be recycled forever." },
    { id: "f2", title: "Recycling 1 bottle saves energy for hours." },
    { id: "f3", title: "Clean & dry items increase recyclability." },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={styles.container}>
      {/* Header: Title + Points
      <View style={styles.headerRow}>
        <Text style={styles.title}>CSa</Text>

        <Pressable onPress={() => router.push("/(tabs)/points")} style={styles.pointsPill} hitSlop={10}>
          <Ionicons name="star" size={18} color="#fff" />
          <Text style={styles.pointsText}>{points.toLocaleString()}</Text>
        </Pressable>
      </View> */}

      {/* (dev) add 10 points
      <Pressable onPress={() => addPoints(10)} style={styles.devBtn}>
        <Text style={{ color: "#fff", fontWeight: "700" }}>+10 test points</Text>
      </Pressable> */}

      {/* Subheading */}
      <Text style={styles.subtitle}>Quick categories</Text>

      {/* Category chips */}
      <View style={styles.grid}>
        {categories.map((c) => (
          <Pressable key={c} style={styles.card}>
            <Text style={styles.cardText}>{c}</Text>
          </Pressable>
        ))}
      </View>

      {/* Slider */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SLIDE_W + 12}
        decelerationRate="fast"
        style={{ marginTop: 18 }}
      >
        {slides.map((s, idx) => (
          <View
            key={s.id}
            style={[
              styles.slide,
              { backgroundColor: s.color, width: SLIDE_W, marginLeft: idx === 0 ? 0 : 12 },
            ]}
          >
            <Text style={styles.slideTitle}>{s.title}</Text>
            <Pressable style={styles.slideCta}>
              <Text style={styles.slideCtaText}>Learn more</Text>
              <Ionicons name="chevron-forward" size={16} color="#fff" />
            </Pressable>
          </View>
        ))}
      </ScrollView>

      {/* Two-column: Campaigns & Fun Facts */}
      <View style={styles.twocol}>
        <View style={styles.col}>
          <Text style={styles.sectionTitle}>Ongoing Campaigns</Text>
          {campaigns.map((c) => (
            <Pressable key={c.id} style={[styles.tile, { backgroundColor: c.color }]}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Ionicons name="megaphone-outline" color={MATCHA_DEEP} size={18} />
                <Text style={styles.tileTitle}>{c.title}</Text>
              </View>
              <Text style={styles.tileSub}>{c.sub}</Text>
              <Pressable style={styles.tileBtn}>
                <Text style={styles.tileBtnText}>View</Text>
              </Pressable>
            </Pressable>
          ))}
        </View>

        <View style={styles.col}>
          <Text style={styles.sectionTitle}>Fun Facts</Text>
          {facts.map((f) => (
            <View key={f.id} style={[styles.tile, { backgroundColor: "#F7F9FF" }]}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Ionicons name="leaf-outline" color={STRAWB} size={18} />
                <Text style={styles.tileTitle}>{f.title}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.hint}>Not sure? Use the Scan tab below.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 24, paddingHorizontal: 20, paddingBottom: 24 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 30,
  },
  title: { fontSize: 28, fontWeight: "800", color: "#0F172A" },

  pointsPill: {
    backgroundColor: STRAWB,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  pointsText: { color: "#fff", fontWeight: "800" },

  devBtn: {
    alignSelf: "flex-start",
    marginTop: 10,
    backgroundColor: "#10B981",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },

  subtitle: { fontSize: 16, color: "#374151", marginTop: 10, marginBottom: 12 },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: { backgroundColor: CHIP_BG, paddingVertical: 16, paddingHorizontal: 18, borderRadius: 12 },
  cardText: { fontSize: 16, fontWeight: "700", color: MATCHA_DEEP },

  slide: { borderRadius: 16, padding: 16, minHeight: 120, justifyContent: "space-between" },
  slideTitle: { fontSize: 16, fontWeight: "800", color: "#0F172A" },
  slideCta: {
    alignSelf: "flex-start",
    backgroundColor: MATCHA_DEEP,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  slideCtaText: { color: "#fff", fontWeight: "700" },

  twocol: { flexDirection: "row", gap: 12, marginTop: 20 },
  col: { flex: 1, gap: 12 },

  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#0F172A", marginBottom: 2 },

  tile: { borderRadius: 14, padding: 14, gap: 8 },
  tileTitle: { fontSize: 14, fontWeight: "700", color: "#0F172A", flexShrink: 1 },
  tileSub: { fontSize: 12, color: "#475569" },

  tileBtn: {
    alignSelf: "flex-start",
    backgroundColor: STRAWB,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 4,
  },
  tileBtnText: { color: "#fff", fontWeight: "700", fontSize: 12 },

  hint: { marginTop: 18, color: "#6b7280" },
});
