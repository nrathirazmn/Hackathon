// app/(tabs)/index.tsx
import { usePoints } from "@/context/points";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useRef } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

const PRIMARY = "#74A12E";
const SECONDARY = "#FA5053";
const BG = "#F9FAFB";

const { width } = Dimensions.get("window");
const SLIDE_W = width * 0.85; 
const SQUARE_W = (width - 60) / 2; 

export default function HomeScreen() {
  const { points, setPoints } = usePoints();
  const scrollRef = useRef<ScrollView>(null);
  const currentIndex = useRef(0);

  const fetchLatestPoints = useCallback(async () => {
    setPoints(points); // mock, replace later
  }, [points, setPoints]);

  useEffect(() => {
    fetchLatestPoints();
  }, [fetchLatestPoints]);

  useFocusEffect(
    useCallback(() => {
      fetchLatestPoints();
    }, [fetchLatestPoints])
  );

  // Data
const slides = [
  { id: "s1", title: "Earn 2x points this week!", color: "#FDECF2", image: require("../../assets/images/2Xpoints.png") },
  { id: "s2", title: "Scan to learn sorting tips", color: "#EAF7ED", image: require("../../assets/images/tips.jpg") },
  { id: "s3", title: "Leaderboard: Top Recyclers", color: "#EAF2FD", image: require("../../assets/images/leaderboard.jpg") },
];

const campaigns = [
  { id: "c1", title: "Petaling Clean-Up", sub: "Sep 28 – Oct 5", color: "#FFF5E6", image: require("../../assets/images/cleanup.jpg") },
  { id: "c2", title: "Plastic Free Week", sub: "Partner: 1 Utama", color: "#F1FFF4", image: require("../../assets/images/noplastic.jpg") },
  { id: "c3", title: "Recycle Fest", sub: "Nov 1 – Nov 10", color: "#E6F7FF", image: require("../../assets/images/festival.jpg") },
];


  const facts = [
    { id: "f1", title: "Aluminum can be recycled forever." },
    { id: "f2", title: "Recycling 1 bottle saves enough energy for hours." },
    { id: "f3", title: "Clean & dry items increase recyclability." },
    { id: "f4", title: "Glass is 100% recyclable with no loss of quality." },
  ];

  // Auto-play effect for promotions
  useEffect(() => {
    const interval = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % slides.length;
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          x: currentIndex.current * (SLIDE_W + 16),
          animated: true,
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: BG }} contentContainerStyle={styles.container}>
      {/* Promotions Slider */}
      <Text style={styles.sectionTitle}>Promotions</Text>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SLIDE_W + 16}
        decelerationRate="fast"
        scrollEventThrottle={16}
      >
        {slides.map((s, idx) => (
          <View
            key={s.id}
            style={[
              styles.slide,
              { backgroundColor: s.color, width: SLIDE_W, marginLeft: idx === 0 ? 0 : 16 },
            ]}
          >
            <Image source={s.image} style={styles.slideImage} />
            <Text style={styles.slideTitle}>{s.title}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Featured Campaigns */}
      <Text style={styles.sectionTitle}>Featured Campaigns</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SQUARE_W + 16}
        decelerationRate="fast"
        contentContainerStyle={{ paddingRight: 20 }}
      >
        {campaigns.map((c, idx) => (
          <View
            key={c.id}
            style={[
              styles.square,
              { backgroundColor: c.color, marginLeft: idx === 0 ? 0 : 16 },
            ]}
          >
            <Image source={c.image} style={styles.campaignImage} />
            <Text style={styles.squareTitle}>{c.title}</Text>
            <Text style={styles.squareSub}>{c.sub}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Fun Facts */}
      <Text style={styles.sectionTitle}>Did You Know?</Text>
      <View style={styles.grid}>
        {facts.map((f) => (
          <View key={f.id} style={[styles.square, { backgroundColor: "#fff" }]}>
            <Ionicons name="leaf-outline" size={22} color={SECONDARY} />
            <Text style={styles.squareTitle}>{f.title}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 30, paddingHorizontal: 20, paddingBottom: 40, gap: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#0F172A", marginBottom: 12 },
  slide: {
    borderRadius: 16,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  slideImage: {
    width: "100%",
    height: 140,
    borderRadius: 12,
    marginBottom: 10,
  },
  slideTitle: { fontSize: 16, fontWeight: "700", color: "#0F172A", textAlign: "center" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 28,
  },
  square: {
    width: SQUARE_W,
    borderRadius: 16,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  campaignImage: {
    width: "100%",
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
  },
  squareTitle: { fontSize: 14, fontWeight: "700", color: "#0F172A", textAlign: "center" },
  squareSub: { fontSize: 12, color: "#475569", marginTop: 2, textAlign: "center" },
});
