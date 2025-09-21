// components/TopBar.tsx
import { usePoints } from "@/context/points";
import { getUserId } from "@/lib/userId";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Image,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

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
      {/* Left: logo */}
      <View style={styles.left}>
        <Image
          source={require("@/assets/images/Final_Logo_Transparent.png")}
          style={styles.logo}
        />
      </View>

      {/* Center: QR button */}
      <Pressable onPress={() => setQrOpen(true)} style={styles.qrBtn} hitSlop={10}>
        <View style={styles.qrInner}>
          <Ionicons name="qr-code-outline" size={22} color="#fff" />
        </View>
      </Pressable>

      {/* Right: actions (History + Rewards) */}
      <View style={styles.rightCluster}>
        {/* 👉 Points History pill (this is the one you tap) */}
        <Pressable
          onPress={() => router.push("/points_history")}
          style={[styles.pointsPill, { backgroundColor: "#F3F4F6" }]}
          hitSlop={10}
          accessibilityLabel="Open points history"
        >
          <Text style={styles.pointsText}>{points.toLocaleString()} pts</Text>
          <Ionicons name="gift-outline" size={16} color={MATCHA_DEEP} />
        </Pressable>
      </View>

      {/* QR modal */}
      <Modal
        visible={qrOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setQrOpen(false)}
      >
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
    height: 90,
    backgroundColor: MATCHA_BG,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight ?? 10 : 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  left: { flexDirection: "row", alignItems: "center", gap: 6 },
  logo: { width: 100, height: 80, resizeMode: "contain" },

  qrBtn: { paddingHorizontal: 10, paddingVertical: 6, marginLeft: 42 },
  qrInner: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: STRAWB,
    alignItems: "center",
    justifyContent: "center",
  },

  rightCluster: { flexDirection: "row", alignItems: "center", marginLeft: "auto" },

  pointsPill: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#EAF7ED",
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pointsText: { fontWeight: "800", color: MATCHA_DEEP },

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
