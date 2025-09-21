// app/points-history.tsx
import { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { usePoints } from "@/context/points";

const MATCHA_DEEP = "#0B4F3F";
const STRAWB = "#FF6B8B";
const GREEN = "#0FA958";
const MUTED = "#475569";

// Fake history – swap with your API later
type Entry = {
  id: string;
  type: "earned" | "used";
  amount: number;     // positive numbers
  dateISO: string;    // ISO date
};

const HISTORY: Entry[] = [
  { id: "h1", type: "used",   amount: 1200, dateISO: "2025-07-15" },
  { id: "h2", type: "earned", amount: 97,   dateISO: "2025-07-06" },
  { id: "h3", type: "earned", amount: 121,  dateISO: "2025-06-28" },
  { id: "h4", type: "earned", amount: 142,  dateISO: "2025-04-11" },
  { id: "h5", type: "earned", amount: 255,  dateISO: "2025-02-10" },
];

export default function PointsHistoryScreen() {
  const { points } = usePoints();
  const totalText = useMemo(() => `${points.toLocaleString()} points`, [points]);

  return (
    <>
      {/* Native/top header for this screen */}
      <Stack.Screen
        options={{
          title: "My Points",
          // headerBackTitleVisible: false, // iOS: hide "Back" text
        }}
      />

      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 28 }}
        >
          {/* Total */}
          <Text style={styles.total}>{totalText}</Text>
          <Text style={styles.expiry}>
            Points expire 12 months after they were earned
          </Text>

          {/* Section head */}
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Points history</Text>
            <Pressable style={styles.viewAllBtn}>
              <Text style={styles.viewAllText}>View all</Text>
              <Ionicons name="chevron-forward" size={16} color={MATCHA_DEEP} />
            </Pressable>
          </View>

          {/* History list */}
          <View style={styles.list}>
            {HISTORY.map((e, idx) => (
              <View
                key={e.id}
                style={[styles.row, idx !== HISTORY.length - 1 && styles.rowDivider]}
              >
                <View style={styles.leftGroup}>
                  <View
                    style={[
                      styles.bullet,
                      { backgroundColor: e.type === "earned" ? GREEN : STRAWB },
                    ]}
                  />
                  <View>
                    <Text style={styles.rowTitle}>
                      {e.type === "earned" ? "Earned" : "Used"}
                    </Text>
                    <Text style={styles.rowSub}>
                      {new Date(e.dateISO).toISOString().slice(0, 10)}
                    </Text>
                  </View>
                </View>

                <View style={styles.rightGroup}>
                  <Text
                    style={[
                      styles.amount,
                      { color: e.type === "earned" ? MATCHA_DEEP : STRAWB },
                    ]}
                  >
                    {e.type === "earned" ? e.amount : `-${e.amount}`}
                  </Text>
                  <Ionicons name="cash-outline" size={18} color={STRAWB} />
                </View>
              </View>
            ))}
          </View>

          {/* Promo / info card (optional) */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>CSa Rewards</Text>
            <Text style={styles.infoBody}>
              Points will automatically be added when you scan the QR during
              recycling or join campaigns in the app.
            </Text>
            <Pressable style={styles.learnBtn}>
              <Text style={styles.learnTxt}>Learn more</Text>
              <Ionicons name="arrow-forward" size={14} color={MATCHA_DEEP} />
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  total: { fontSize: 34, fontWeight: "900", color: "#0F172A", marginTop: 16 },
  expiry: { color: MUTED, marginTop: 6, marginBottom: 18 },

  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 22, fontWeight: "900", color: MATCHA_DEEP },
  viewAllBtn: { marginLeft: "auto", flexDirection: "row", alignItems: "center", gap: 4 },
  viewAllText: { color: MATCHA_DEEP, fontWeight: "700" },

  list: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#E5E7EB" },
  row: {
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#E5E7EB" },
  leftGroup: { flexDirection: "row", alignItems: "center", gap: 10 },
  bullet: { width: 14, height: 14, borderRadius: 7 },
  rowTitle: { fontWeight: "800", color: "#0F172A" },
  rowSub: { color: MUTED, marginTop: 2, fontSize: 12 },

  rightGroup: { flexDirection: "row", alignItems: "center", gap: 8 },
  amount: { fontSize: 16, fontWeight: "900" },

  infoCard: {
    marginTop: 18,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
    padding: 14,
    backgroundColor: "#FFF",
  },
  infoTitle: { fontWeight: "900", color: MATCHA_DEEP, marginBottom: 6 },
  infoBody: { color: MUTED, marginBottom: 10 },
  learnBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  learnTxt: { color: MATCHA_DEEP, fontWeight: "800" },
});
