// components/TopBar.tsx
import { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet, Modal, Platform, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import { getUserId } from "@/lib/userId";
import { usePoints } from "@/context/points";
import { useRouter } from "expo-router";

const MATCHA_BG = "#FFFFFF";
const MATCHA_DEEP = "#0B4F3F";
const STRAWB = "#FF6B8B";

export default function TopBar() {
  const router = useRouter();
  const { points } = usePoints();
  const [qrOpen, setQrOpen] = useState(false);
  const [uid, setUid] = useState<string>("");

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

  return (
    <View style={styles.wrap}>
      {/* left: logo / app name */}
      <View style={styles.left}>
        <Ionicons name="leaf-outline" size={24} color={MATCHA_DEEP} />
        <Text style={styles.brand}>CSa</Text>
      </View>

      {/* QR button – manually nudged a bit to the left */}
      <Pressable onPress={() => setQrOpen(true)} style={styles.qrBtn} hitSlop={10}>
        <View style={styles.qrInner}>
          <Ionicons name="qr-code-outline" size={22} color="#fff" />
        </View>
      </Pressable>

      {/* right: points pill */}
      <Pressable
        onPress={() => router.push("/(tabs)/points")}
        style={[styles.pointsPill, points === 0 && { backgroundColor: "#FFE6EC" }]}
        hitSlop={10}
      >
        {points === 0 ? (
          <>
            <Ionicons name="star" size={16} color={STRAWB} />
            <Text style={[styles.pointsText, { color: STRAWB }]}>0 pts</Text>
          </>
        ) : (
          <>
            <Text style={styles.pointsText}>{points.toLocaleString()} pts</Text>
            <Ionicons name="chevron-forward" size={16} color={MATCHA_DEEP} />
          </>
        )}
      </Pressable>

      {/* QR modal */}
      <Modal visible={qrOpen} transparent animationType="fade" onRequestClose={() => setQrOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setQrOpen(false)} />
        <View style={styles.modalCenter}>
          <View style={styles.sheet}>
            <Text style={styles.qrTitle}>Your QR</Text>
            <View style={styles.qrBox}>
              {uid ? <QRCode value={qrPayload} size={220} color={STRAWB} /> : null}
            </View>
            <Text style={styles.qrHint}>Scan to earn / redeem points</Text>
            <Pressable style={styles.closeBtn} onPress={() => setQrOpen(false)}>
              <Ionicons name="close" size={18} color="#fff" />
              <Text style={styles.closeTxt}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 70, // a bit taller for breathing room
    backgroundColor: MATCHA_BG,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight ?? 10 : 20, // safe top padding
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },

  // left cluster
  left: { flexDirection: "row", alignItems: "center", gap: 6 },
  brand: { fontSize: 18, fontWeight: "800", color: MATCHA_DEEP },

  // QR button: manually placed a bit to the left (no auto-centering)
  qrBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 69, // ← tweak this value to move it more/less left
  },
  qrInner: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: STRAWB,
    alignItems: "center",
    justifyContent: "center",
  },

  // points on the far right
  pointsPill: {
    marginLeft: "auto",
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#EAF7ED",
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pointsText: { fontWeight: "800", color: MATCHA_DEEP },

  // modal styles
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "#00000055" },
  modalCenter: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  sheet: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
    width: "100%",
    maxWidth: 340,
  },
  qrTitle: { fontWeight: "800", color: MATCHA_DEEP, marginBottom: 16, fontSize: 18 },
  qrBox: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#FCE7EF",
  },
  qrHint: { color: "#6B7280", marginTop: 14, marginBottom: 16 },
  closeBtn: {
    backgroundColor: STRAWB,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  closeTxt: { color: "#fff", fontWeight: "800" },
});
