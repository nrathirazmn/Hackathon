// app/(tabs)/points.tsx
import { usePoints } from "@/context/points";
import { getUserId } from "@/lib/userId";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

const MATCHA_DEEP = "#0B4F3F";
const STRAWB = "#FF6B8B";
const CHIP_BG = "#EAF7ED";

type Reward = {
  id: string;
  title: string;
  pts: number;
  img?: any; // require("@/assets/foo.png")
};

// Diverse rewards list
const REWARDS: Reward[] = [
  { id: "r1", title: "Movie Ticket", pts: 800, img: require("../../assets/images/movie-ticket.jpg") },
  { id: "r2", title: "Reusable Water Bottle", pts: 500, img: require("../../assets/images/water-bottle.jpg") },
  { id: "r3", title: "Vegan Snack Box", pts: 900, img: require("../../assets/images/snack-box.jpg") },
  { id: "r4", title: "Eco Tote Bag", pts: 400, img: require("../../assets/images/tote-bag.jpg") },
  { id: "r5", title: "Coffee Voucher", pts: 700, img: require("../../assets/images/coffee.jpg") },
  { id: "r6", title: "Wireless Earbuds", pts: 950, img: require("../../assets/images/earbuds.jpg") },
  { id: "r7", title: "Humidifier", pts: 1100, img: require("../../assets/images/humidifier.jpg") },
  { id: "r8", title: "Theme Park Tickets", pts: 1500, img: require("../../assets/images/theme-park.jpg") },
];

const { width } = Dimensions.get("window");
const GUTTER = 14;
const COL_W = (width - (20 * 2) - GUTTER) / 2;

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
      {/* QR card */}
      <View style={styles.qrCardShadow}>
        <View style={styles.qrCard}>
          <View style={styles.qrInner}>
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
            <View style={styles.imgWrap}>
              {r.img ? (
                <Image source={r.img} style={styles.img} resizeMode="contain" />
              ) : (
                <Ionicons name="gift-outline" size={60} color="#D1D5DB" />
              )}
            </View>

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
