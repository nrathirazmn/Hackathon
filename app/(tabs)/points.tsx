// app/(tabs)/points.tsx
import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import { usePoints } from "@/context/points";
import { getUserId } from "@/lib/userId";

const MATCHA_DEEP = "#0B4F3F";
const STRAWB = "#FF6B8B";
const CHIP_BG = "#EAF7ED";


type Reward = {
  id: string;
  title: string;
  pts: number;
  img?: any; // require("@/assets/foo.png")
};

// Example rewards (swap with real images/points later)
const REWARDS: Reward[] = [
  { id: "r1", title: "V-Cut Fries (M)", pts: 800 },
  { id: "r2", title: "French Fries (S)", pts: 500 },
  { id: "r3", title: "Iced Latte", pts: 900 },
  { id: "r4", title: "Chocolate Cone", pts: 400 },
  { id: "r5", title: "Apple Pie", pts: 700 },
  { id: "r6", title: "Nuggets (4pc)", pts: 950 },
];

const { width } = Dimensions.get("window");
const GUTTER = 14;
const COL_W = (width - (20 * 2) - GUTTER) / 2; // padding=20 on container

export default function PointsScreen() {
  const { points } = usePoints();
  const [uid, setUid] = useState("");

  useEffect(() => {
    getUserId().then(setUid);
  }, []);

  const qrPayload = useMemo(
    () =>
      JSON.stringify({
        type: "csa-user",
        id: uid,
        ts: Date.now(),
      }),
    [uid]
  );

  const shareCode = async () => {
    if (!uid) return;
    await Share.share({ message: `My CSa QR: ${qrPayload}` });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={styles.container}>
      {/* Top row: brand-ish + points summary on the right */}
      {/* <View style={styles.topRow}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons name="leaf-outline" size={22} color={DARK} />
          <Text style={styles.brand}>CSa</Text>
        </View>

        <Pressable style={styles.pointsRow}>
          <Text style={styles.pointsBig}>{points.toLocaleString()} pts</Text>
          <Ionicons name="chevron-forward" size={18} color={DARK} />
        </Pressable>
      </View> */}

      {/* QR card */}
      <View style={styles.qrCardShadow}>
        <View style={styles.qrCard}>
          <View style={styles.qrInner}>
            {/* “info” dot top-right */}
            <Pressable style={styles.infoBtn} onPress={shareCode}>
              <Ionicons name="information" size={18} color={MATCHA_DEEP} />
            </Pressable>

            <View style={styles.qrPad}>
              {uid ? (
                <QRCode value={qrPayload} size={168} backgroundColor="transparent" />
              ) : (
                <View style={{ width: 168, height: 168, backgroundColor: "#fff", borderRadius: 12 }} />
              )}
              <Text style={styles.codeText}>
                {/* Optional membership-like code under QR */}
                {uid ? uid.slice(0, 1).toUpperCase() + " " + uid.slice(-6) : "•••••••"}
              </Text>
            </View>

            <Text style={styles.qrHint}>Scan code to collect points.</Text>
          </View>
        </View>
      </View>

      {/* Rewards heading */}
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Rewards</Text>
        <Pressable style={styles.viewAllBtn}>
          <Text style={styles.viewAllText}>View all</Text>
          <Ionicons name="chevron-forward" size={16} color={MATCHA_DEEP} />
        </Pressable>
      </View>

      {/* Rewards grid */}
      <View style={styles.grid}>
        {REWARDS.map((r) => (
          <Pressable key={r.id} style={[styles.card, { width: COL_W }]}>
            {/* top image area (use your real image later) */}
            <View style={styles.imgWrap}>
              {/* <Image source={r.img} style={styles.img} resizeMode="contain" /> */}
              {/* Placeholder: */}
              <Ionicons name="gift-outline" size={60} color="#D1D5DB" />
            </View>

            {/* badge like “800 pts” */}
            <View style={styles.badgeWrap}>
              <View style={styles.badgeStroke}>
                <View style={styles.badgeFill}>
                  <Text style={styles.badgeText}>{r.pts} pts</Text>
                </View>
              </View>
            </View>

            <Text numberOfLines={2} style={styles.cardTitle}>
              {r.title}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={{ height: 18 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 28 },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  brand: { fontWeight: "800", fontSize: 18, color: MATCHA_DEEP },
  pointsRow: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pointsBig: { fontSize: 18, fontWeight: "900", color: MATCHA_DEEP },

  qrCardShadow: {
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    marginBottom: 20,
  },
  qrCard: {
    borderRadius: 18,
    backgroundColor: CHIP_BG,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ECECEC",
  },
  qrInner: {
    backgroundColor: CHIP_BG,
    paddingVertical: 18,
    paddingHorizontal: 18,
    alignItems: "center",
  },
  infoBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#00000010",
    alignItems: "center",
    justifyContent: "center",
  },
  qrPad: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  codeText: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "800",
    color: MATCHA_DEEP,
  },
  qrHint: {
    marginTop: 10,
    color: "#1F2937",
    fontWeight: "500",
  },

  sectionHead: {
    marginTop: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 22, fontWeight: "900", color: MATCHA_DEEP },
  viewAllBtn: { marginLeft: "auto", flexDirection: "row", alignItems: "center", gap: 4 },
  viewAllText: { color: MATCHA_DEEP, fontWeight: "700" },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GUTTER,
  },
  card: {
    backgroundColor: CHIP_BG,
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  imgWrap: {
    height: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  img: { width: "100%", height: "100%" },

  badgeWrap: { alignItems: "center", marginTop: 6, marginBottom: 8 },
  badgeStroke: {
    borderRadius: 999,
    borderWidth: 2,
    borderColor: STRAWB,
    padding: 2,
  },
  badgeFill: {
    backgroundColor: STRAWB,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: { fontWeight: "900", color: MATCHA_DEEP },

  cardTitle: { fontWeight: "800", color: MATCHA_DEEP },
});
