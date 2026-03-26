import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, View, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AuthBackground } from "@/components/auth/auth-background";
import { AuthGradientButton } from "@/components/auth/auth-gradient-button";

const HERO_IMAGE = require("../../../assets/images/kontinueai-icon.png");

export default function AuthWelcomeScreen() {
  const router = useRouter();
  const isDarkScheme = useColorScheme() !== "light";

  return (
    <SafeAreaView className="flex-1 bg-background">
      <AuthBackground isDarkScheme={isDarkScheme} />

      <View className="flex-1 px-6 pb-8 pt-2">
        <View className="w-full max-w-[460px] flex-1 self-center">
          <View className="mt-2 items-center">
            <View className="h-[340px] w-full items-center justify-center">
              <Image source={HERO_IMAGE} style={{ width: 210, height: 210 }} contentFit="contain" />
            </View>

            <Text className="text-center text-4xl font-semibold leading-[30px] text-foreground">
              Never start from{"\n"}scratch again
            </Text>
            <Text className="mt-4 px-1 text-center text-base leading-7 text-muted-foreground">
              Hit a limit? Import your chat and keep going. Kontinue AI brings your conversations,
              context, and favourite models into one seamless workspace.
            </Text>
          </View>

          <View className="mt-auto gap-4">
            <AuthGradientButton
              label="Sign Up"
              className="w-full bg-primary"
              textClassName="text-2xl font-semibold"
              onPress={() => router.push("/sign-up")}
            />
            <AuthGradientButton
              label="Log In"
              className="w-full"
              textClassName="text-2xl font-semibold"
              onPress={() => router.push("/sign-in")}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
