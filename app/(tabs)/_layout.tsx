// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import TopBar from "@/components/TopBar";

const MATCHA_BG   = "#CFEAC7";
const MATCHA_DEEP = "#0B4F3F";
const STRAWB      = "#FF6B8B";
const STRAWB_SOFT = "#FF90A8";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        // ✅ custom top bar
        header: () => <TopBar />,
        headerShown: true,

        tabBarActiveTintColor: STRAWB,
        tabBarInactiveTintColor: MATCHA_DEEP,
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
          borderTopWidth: 0,
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          backgroundColor: "transparent",
        },
        tabBarBackground: () => (
          <View
            style={{
              flex: 1,
              backgroundColor: MATCHA_BG,
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
            }}
          />
        ),
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="location"
        options={{
          title: "Location",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="location-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Floating center Scan button */}
      <Tabs.Screen
        name="scanner"
        options={{
          title: "Scan",
          tabBarButton: (props: BottomTabBarButtonProps) => (
            <Pressable
              onPress={props.onPress}
              onLongPress={props.onLongPress}
              accessibilityRole={props.accessibilityRole}
              accessibilityState={props.accessibilityState}
              accessibilityLabel={props.accessibilityLabel}
              testID={props.testID}
              style={[
                { top: -22, alignItems: "center", justifyContent: "center" },
                props.style as any,
              ]}
            >
              <View
                style={{
                  width: 66,
                  height: 66,
                  borderRadius: 9999,
                  backgroundColor: MATCHA_DEEP, // inner button
                  borderWidth: 4,
                  borderColor: STRAWB_SOFT,     // soft strawberry ring
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#000",
                  shadowOpacity: 0.25,
                  shadowOffset: { width: 0, height: 6 },
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Ionicons name="scan-outline" size={28} color="#FFFFFF" />
              </View>
            </Pressable>
          ),
          tabBarIcon: () => null,
        }}
      />

      <Tabs.Screen
        name="points"
        options={{
          title: "Points",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
