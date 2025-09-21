// app/(tabs)/profile.tsx
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const PRIMARY = "#74A12E";
const SECONDARY = "#FA5053";
const BG = "#EEEEEE";

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);

  // User state
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@email.com");
  const [number, setNumber] = useState("+6012-3456789");
  const [gender, setGender] = useState("Male");

  // Profile picture
  const [profilePic, setProfilePic] = useState<string | null>(null);

  // Birthday
  const [showPicker, setShowPicker] = useState(false);
  const [birthday, setBirthday] = useState<Date>(new Date("2002-12-13"));

  // Address state
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const pickImage = async () => {
    // Ask for permission first
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // square image
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: BG }}
      contentContainerStyle={styles.container}
    >
      {/* Profile Picture */}
      <View style={styles.avatarWrapper}>
        <Pressable onPress={isEditing ? pickImage : undefined}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.avatar} />
          ) : (
            <Ionicons name="person-circle-outline" size={100} color={PRIMARY} />
          )}
          {isEditing && (
            <View style={styles.editIconWrapper}>
              <Ionicons name="pencil-outline" size={20} color="#fff" />
            </View>
          )}
        </Pressable>
      </View>

      {/* User Details */}
      <View style={styles.card}>
        <DetailRow
          icon="person-outline"
          label="Name"
          value={name}
          editable={isEditing}
          onChangeText={setName}
        />
        <DetailRow
          icon="mail-outline"
          label="Email"
          value={email}
          editable={isEditing}
          onChangeText={setEmail}
        />
        <DetailRow
          icon="call-outline"
          label="Number"
          value={number}
          editable={isEditing}
          onChangeText={setNumber}
        />

        {/* Show additional details only if editing */}
        {isEditing && (
          <>
            {/* Gender */}
            <View style={styles.row}>
              <Ionicons
                name="male-female-outline"
                size={20}
                color={PRIMARY}
                style={{ width: 24 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderRow}>
                  <Pressable
                    style={[styles.genderOption, gender === "Male" && styles.genderSelected]}
                    onPress={() => setGender("Male")}
                  >
                    <Text
                      style={[
                        styles.genderText,
                        gender === "Male" && styles.genderTextSelected,
                      ]}
                    >
                      Male
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[styles.genderOption, gender === "Female" && styles.genderSelected]}
                    onPress={() => setGender("Female")}
                  >
                    <Text
                      style={[
                        styles.genderText,
                        gender === "Female" && styles.genderTextSelected,
                      ]}
                    >
                      Female
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Birthday */}
            <View style={styles.row}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={PRIMARY}
                style={{ width: 24 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Birthday</Text>
                <Pressable style={styles.dateButton} onPress={() => setShowPicker(true)}>
                  <Text style={styles.value}>{birthday.toDateString()}</Text>
                </Pressable>

                {showPicker && (
                  <DateTimePicker
                    value={birthday}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selectedDate) => {
                      if (Platform.OS === "android") {
                        setShowPicker(false);
                      }
                      if (selectedDate) {
                        setBirthday(selectedDate);
                      }
                    }}
                  />
                )}
              </View>
            </View>

            {/* Address */}
            <DetailRow
              icon="home-outline"
              label="Address"
              value={address}
              editable={isEditing}
              onChangeText={setAddress}
            />
            <DetailRow
              icon="location-outline"
              label="Postal Code"
              value={postalCode}
              editable={isEditing}
              onChangeText={setPostalCode}
            />
            <DetailRow
              icon="business-outline"
              label="City"
              value={city}
              editable={isEditing}
              onChangeText={setCity}
            />
            <DetailRow
              icon="flag-outline"
              label="State"
              value={state}
              editable={isEditing}
              onChangeText={setState}
            />
          </>
        )}
      </View>

      {/* Action Button */}
      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.button, { backgroundColor: isEditing ? SECONDARY : PRIMARY }]}
          onPress={toggleEdit}
        >
          <Text style={styles.buttonText}>{isEditing ? "Save" : "Edit Profile"}</Text>
        </Pressable>
      </View>

      {/* Eco Stats */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🌱 Eco Stats</Text>
        <View style={styles.statsRow}>
          <StatBox icon="leaf-outline" label="CO₂ Saved" value="120kg" />
          <StatBox icon="water-outline" label="Water Saved" value="250L" />
          <StatBox icon="trash-outline" label="Items Recycled" value="45" />
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🏆 Achievements</Text>
        <View style={styles.badgeRow}>
          <Badge title="Recycler" icon="recycle-outline" />
          <Badge title="Eco Hero" icon="earth-outline" />
          <Badge title="Streak 7 Days" icon="flame-outline" />
        </View>
      </View>
    </ScrollView>
  );
}

// Reusable Row Component
function DetailRow({ icon, label, value, editable, onChangeText }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={20} color={PRIMARY} style={{ width: 24 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>
        {editable ? (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={label}
          />
        ) : (
          <Text style={styles.value}>{value}</Text>
        )}
      </View>
    </View>
  );
}

// Eco Stat Box
function StatBox({ icon, label, value }) {
  return (
    <View style={styles.statBox}>
      <Ionicons name={icon} size={22} color={PRIMARY} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// Achievement Badge
function Badge({ title, icon }) {
  return (
    <View style={styles.badge}>
      <Ionicons name={icon} size={22} color="#fff" />
      <Text style={styles.badgeText}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 30, paddingHorizontal: 20, paddingBottom: 40, gap: 20 },
  avatarWrapper: { alignItems: "center", marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  editIconWrapper: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: PRIMARY,
    borderRadius: 12,
    padding: 4,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },

  row: { flexDirection: "row", alignItems: "flex-start", gap: 12 },

  label: { fontSize: 13, color: "#6b7280" },
  value: { fontSize: 15, fontWeight: "600", color: "#0F172A" },

  input: {
    fontSize: 15,
    fontWeight: "600",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 2,
    color: "#0F172A",
  },

  genderRow: { flexDirection: "row", gap: 12, marginTop: 4 },
  genderOption: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  genderSelected: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  genderText: { fontSize: 14, color: "#374151", fontWeight: "500" },
  genderTextSelected: { color: "#fff", fontWeight: "700" },

  dateButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    marginTop: 4,
  },

  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  statsRow: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  statBox: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
  },
  statValue: { fontSize: 16, fontWeight: "700", color: PRIMARY },
  statLabel: { fontSize: 12, color: "#6b7280", marginTop: 2 },

  badgeRow: { flexDirection: "row", gap: 12, flexWrap: "wrap" },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: PRIMARY,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  badgeText: { color: "#fff", fontSize: 13, fontWeight: "600" },

  buttonRow: { marginTop: 10, alignItems: "center" },
  button: { paddingVertical: 12, paddingHorizontal: 40, borderRadius: 999, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
