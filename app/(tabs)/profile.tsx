// app/(tabs)/profile.tsx
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
} from "react-native";

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

  // Birthday
  const [showPicker, setShowPicker] = useState(false);
  const [birthday, setBirthday] = useState<Date>(new Date("2002-12-13"));

  // Address state
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const toggleEdit = () => {
    if (isEditing) {
      console.log("Saved:", {
        name,
        email,
        number,
        gender,
        birthday: birthday.toDateString(),
        address,
        postalCode,
        city,
        state,
      });
    }
    setIsEditing(!isEditing);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: BG }} contentContainerStyle={styles.container}>
      {/* Profile Picture */}
      <View style={styles.avatarWrapper}>
        <Ionicons name="person-circle-outline" size={100} color={PRIMARY} />
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

        {/* Gender */}
        <View style={styles.row}>
          <Ionicons name="male-female-outline" size={20} color={PRIMARY} style={{ width: 24 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Gender</Text>
            {isEditing ? (
              <View style={styles.genderRow}>
                <Pressable
                  style={[styles.genderOption, gender === "Male" && styles.genderSelected]}
                  onPress={() => setGender("Male")}
                >
                  <Text style={[styles.genderText, gender === "Male" && styles.genderTextSelected]}>
                    Male
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.genderOption, gender === "Female" && styles.genderSelected]}
                  onPress={() => setGender("Female")}
                >
                  <Text
                    style={[styles.genderText, gender === "Female" && styles.genderTextSelected]}
                  >
                    Female
                  </Text>
                </Pressable>
              </View>
            ) : (
              <Text style={styles.value}>{gender}</Text>
            )}
          </View>
        </View>

        {/* Birthday */}
        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={20} color={PRIMARY} style={{ width: 24 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Birthday</Text>
            {isEditing ? (
              <>
                <Pressable
                  style={styles.dateButton}
                  onPress={() => setShowPicker(true)}
                >
                  <Text style={styles.value}>{birthday.toDateString()}</Text>
                </Pressable>

                {showPicker && (
                  <DateTimePicker
                    value={birthday}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selectedDate) => {
                      if (Platform.OS === "android") {
                        // Android closes picker automatically
                        setShowPicker(false);
                      }
                      if (selectedDate) {
                        setBirthday(selectedDate);
                      }
                    }}
                  />
                )}
              </>
            ) : (
              <Text style={styles.value}>{birthday.toDateString()}</Text>
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
    </ScrollView>
  );
}

// Reusable Row Component
function DetailRow({
  icon,
  label,
  value,
  editable,
  onChangeText,
}: {
  icon: any;
  label: string;
  value: string;
  editable: boolean;
  onChangeText: (text: string) => void;
}) {
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

const styles = StyleSheet.create({
  container: { paddingTop: 30, paddingHorizontal: 20, paddingBottom: 40, gap: 20 },
  avatarWrapper: { alignItems: "center", marginBottom: 20 },

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

  buttonRow: { marginTop: 30, alignItems: "center" },
  button: { paddingVertical: 12, paddingHorizontal: 40, borderRadius: 999, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
