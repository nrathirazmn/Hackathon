import { Stack } from "expo-router";
import { useRef, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { sendChatMessage } from "../aws/bedrock";

const MATCHA_DEEP = "#0B4F3F";
const STRAWB = "#FF6B8B";
const CHIP_BG = "#EAF7ED";

export default function ChatbotScreen() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { sender: "user" | "bot"; text?: string; isLoading?: boolean }[]
  >([]);
  const scrollRef = useRef<ScrollView>(null);

  const handlePress = async () => {
    if (!message.trim()) return;

    setChatHistory((prev) => [...prev, { sender: "user", text: message }]);
    setMessage("");

    const loadingMessage: {
      sender: "user" | "bot";
      text?: string;
      isLoading?: boolean;
    } = { sender: "bot", isLoading: true };
    setChatHistory((prev) => [...prev, loadingMessage]);

    try {
      const res = await sendChatMessage(message);
      setChatHistory((prev) => {
        const updated = [...prev];
        const loadingIndex = updated.findIndex((m) => m.isLoading);
        if (loadingIndex !== -1) {
          updated[loadingIndex] = { sender: "bot", text: res };
        }
        return updated;
      });
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err) {
      console.error("Bot error", err);

      setChatHistory((prev) => {
        const updated = [...prev];
        const loadingIndex = updated.findIndex((m) => m.isLoading);
        if (loadingIndex !== -1) {
          updated[loadingIndex] = {
            sender: "bot",
            text: "Oops, something went wrong :(",
          };
        }
        return updated;
      });
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Recycling AI Assistant",
        }}
      />
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: CHIP_BG }}>
          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
          >
            <ScrollView
              ref={scrollRef}
              style={styles.chatContainer}
              contentContainerStyle={{
                paddingVertical: 10,
                flexGrow: 1,
                justifyContent: "flex-start",
                paddingBottom: 100,
              }}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.botBubble}>
                <Text style={styles.botText}>
                  Hey there! I'm your friendly Recycling AI Assistant, how can I
                  help you today?
                </Text>
              </View>
              {chatHistory.map((entry, index) => (
                <View key={index} style={styles.chatEntry}>
                  <View
                    key={index}
                    style={[
                      entry.sender === "user"
                        ? styles.userBubble
                        : styles.botBubble,
                    ]}
                  >
                    {entry.isLoading ? (
                      <ActivityIndicator size="small" color={MATCHA_DEEP} />
                    ) : (
                      <Text
                        style={
                          entry.sender === "user"
                            ? styles.userText
                            : styles.botText
                        }
                      >
                        {entry.text}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                placeholder="Type something here..."
              />
              <Pressable
                style={styles.btn}
                onPress={() => handlePress(message)}
              >
                <Text style={styles.btnText}>Send</Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: CHIP_BG,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
  },
  chatContainer: {
    flex: 1,
    marginBottom: 12,
  },
  chatEntry: {
    marginBottom: 10,
  },
  userText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  botText: {
    fontSize: 16,
    color: "#333",
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  btn: {
    marginLeft: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: STRAWB,
    borderRadius: 6,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: STRAWB,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 6,
    maxWidth: "80%",
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#e5e5ea",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 6,
    maxWidth: "80%",
  },
});
