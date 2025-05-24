import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FileProvider } from "@/src/properties/fileContext";

export default function TabLayout() {
  return (
    <FileProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#7394e2",
          headerStyle: {
            backgroundColor: "#25292e",
          },
          headerShadowVisible: false,
          headerTintColor: "#fff",
          tabBarStyle: {
            backgroundColor: "#25292e",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Debts",
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "home-sharp" : "home-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="totals"
          options={{
            title: "Totals",
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "add-circle-sharp" : "add-circle-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="about"
          options={{
            title: "About",
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={
                  focused
                    ? "information-circle-sharp"
                    : "information-circle-outline"
                }
                color={color}
                size={24}
              />
            ),
          }}
        />
      </Tabs>
    </FileProvider>
  );
}
