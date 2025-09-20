// lib/userId.ts
import * as SecureStore from "expo-secure-store";

const KEY = "CSa_USER_ID";

export async function getUserId(): Promise<string> {
  // Try existing
  const existing = await SecureStore.getItemAsync(KEY);
  if (existing) return existing;

  // Make a new one and persist
  const id =
    (global as any).crypto?.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

  await SecureStore.setItemAsync(KEY, id);
  return id;
}
