import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type RegisterProps = {
  onRegister?: () => void;
};

export default function Register({ onRegister }: RegisterProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const handleRegister = async () => {
  if (password !== repeatPassword) {
    Alert.alert("Passwords do not match.");
    return;
  }

  try {
    const response = await fetch("https://y9zs5ybm1l.execute-api.ap-southeast-5.amazonaws.com/UserRegister", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (response.status === 201) {
      Alert.alert("Registration successful!");
      if (onRegister) onRegister();
    } else if (response.status === 409) {
      Alert.alert("Error", "This email is already registered.");
    } else {
      Alert.alert("Error", data.message || "Registration failed.");
    }
  } catch (err) {
    Alert.alert("Error", "Something went wrong.");
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Create Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Repeat Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={repeatPassword}
        onChangeText={setRepeatPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
    color: "#222",
  },
  input: {
    height: 48,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 18,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#2e7dff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
