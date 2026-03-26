import { Sidebar } from "@/components/nav/Sidebar";
import { Drawer } from "expo-router/drawer";
import { useColorScheme } from "react-native";

export default function AppLayout() {
  const isDark = useColorScheme() === "dark";

  return (
    <Drawer
      drawerContent={(props) => <Sidebar {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: "slide",
        overlayColor: isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.5)",
        drawerStyle: {
          width: "80%",
          backgroundColor: isDark ? "#000000" : "#ffffff",
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Drawer.Screen
        name="canvas"
        options={{
          title: "Canvas",
        }}
      />
      <Drawer.Screen
        name="feedback"
        options={{
          title: "Feedback",
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: "Settings",
        }}
      />
      {/* Hidden screens (not in drawer menu but still in the router) */}
      <Drawer.Screen
        name="chat/[chatId]"
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="pricing"
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="share/[chatId]"
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
    </Drawer>
  );
}
