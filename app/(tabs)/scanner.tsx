// C:\Users\Veshal\Desktop\AI Hackkathon\Hackathon\app\(tabs)\scanner.tsx
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";


// ✅ Your deployed API Gateway URL (no /prod). Endpoint path is /classify.
const API_URL = "https://6yfvzbarza.execute-api.ap-southeast-1.amazonaws.com/classify";

type Guidance = {
  recyclable?: boolean | "depends";
  note?: string;
};

type ApiResponse = {
  classes: string[];
  probs: number[];
  top_class: "glass" | "metal" | "paper" | "plastic";
  top_prob: number;
  guidance?: Guidance; // <- matches Lambda output
};

export default function ScannerScreen() {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!permission || !permission.granted) requestPermission();
  }, [permission]);

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Camera permission needed</Text>
        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant permission</Text>
        </Pressable>
      </View>
    );
  }

  const classify = async (base64: string) => {
    const r = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_base64: base64 }),
    });
    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      throw new Error(`HTTP ${r.status} ${txt}`);
    }
    const data: ApiResponse = await r.json();
    return data;
  };

  const takePhoto = async () => {
    if (busy) return;
    try {
      setBusy(true);
      const photo = await cameraRef.current?.takePictureAsync({
        quality: 0.7,
        base64: true,
        skipProcessing: true,
      });
      if (!photo?.base64) throw new Error("No base64 from camera");

      const data = await classify(photo.base64);
      setResult(data);

      const conf = Math.round((data.top_prob ?? 0) * 100);
      const rec = data.guidance?.recyclable;
      const badge =
        rec === true ? "♻️ Recyclable" :
          rec === false ? "🚫 Not recyclable" :
            "ℹ️ Check locally";
      const note = data.guidance?.note ? `\n${data.guidance.note}` : "";

      Alert.alert(
        "Scan Result",
        `${data.top_class.toUpperCase()} (${conf}%)\n${badge}${note}`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Go to Chatbot",
            onPress: () => router.push("/chatbot"), // navigate on button press
          },
        ]
      );
    } catch (e: any) {
      console.error(e);
      Alert.alert("Oops", "Failed to classify. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" />
      <View style={styles.captureBar}>
        <Pressable onPress={takePhoto} style={[styles.shutter, busy && { opacity: 0.6 }]}>
          {busy ? <ActivityIndicator /> : <View style={styles.shutterInner} />}
        </Pressable>
      </View>

      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>
            {result.top_class.toUpperCase()}  {(result.top_prob * 100).toFixed(0)}%
          </Text>
          {result.guidance?.note ? (
            <Text style={styles.resultNote}>{result.guidance.note}</Text>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  button: { backgroundColor: "#16a34a", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10 },
  buttonText: { color: "#fff", fontWeight: "700" },
  captureBar: { position: "absolute", bottom: 28, width: "100%", alignItems: "center", justifyContent: "center" },
  shutter: { width: 74, height: 74, borderRadius: 9999, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  shutterInner: { width: 60, height: 60, borderRadius: 9999, backgroundColor: "#e5e7eb" },
  resultCard: { position: "absolute", top: 48, alignSelf: "center", backgroundColor: "rgba(17,24,39,0.9)", padding: 12, borderRadius: 12, maxWidth: "90%" },
  resultTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },
  resultNote: { color: "#e5e7eb", marginTop: 4 },
});
