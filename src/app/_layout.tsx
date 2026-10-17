import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#F8F7FC" },
        headerTintColor: "#5A54E8",
        headerTitleStyle: { fontWeight: "700" },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: "#F8F7FC" },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Konekta", headerShown: false }}
      />

      <Stack.Screen
        name="add-contact"
        options={{ title: "Tambah Kontak" }}
      />

      <Stack.Screen
        name="contact-detail"
        options={{ title: "Detail Kontak" }}
      />
    </Stack>
  );
}