import { StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.item}>Name: Athira</Text>
      <Text style={styles.item}>Tier: Green Hero</Text>
      <Text style={styles.item}>Badges: 10</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 10 },
  item: { fontSize: 16, color: "#374151", marginBottom: 6 },
});