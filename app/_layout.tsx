import { Stack } from "expo-router";
import { PocketbaseProvider } from "../src/properties/pocketbaseContext";

export default function RootLayout() {
  return (
    <PocketbaseProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </PocketbaseProvider>
  );
}
