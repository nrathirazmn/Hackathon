import { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function ScannerScreen() {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!permission || !permission.granted) requestPermission();
  }, [permission]);

  if (!permission) return <View style={styles.center}><ActivityIndicator /></View>;

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

  const takePhoto = async () => {
    if (busy) return;
    try {
      setBusy(true);
      const photo = await cameraRef.current?.takePictureAsync({ quality: 0.6, base64: true });
      // TODO: send photo?.base64 to your API (SageMaker) for classification
      setTimeout(() => {
        setBusy(false);
        alert("Scanned!\n\nExample result:\nBody: Paper → Blue bin\nCap: Plastic → Yellow bin");
      }, 900);
    } catch {
      setBusy(false);
      alert("Failed to capture. Try again.");
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
});
