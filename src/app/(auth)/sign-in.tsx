import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useOAuth, useSignIn } from "@clerk/clerk-expo";

import { AuthBackground } from "@/components/auth/auth-background";
import { AuthButton } from "@/components/auth/auth-button";
import { AuthGradientButton } from "@/components/auth/auth-gradient-button";
import { AuthInput } from "@/components/auth/auth-input";
import { GoogleIcon } from "@/components/auth/google-icon";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { getClerkErrorMessage } from "@/lib/clerk-error";

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const isDarkScheme = useColorScheme() !== "light";
  const iconColor = "#ffffff";
  const mutedIconColor = "#ffffff";
  const placeholderColor = "#ffffff";

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onGoogleSignIn = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { createdSessionId, setActive: setOAuthActive } =
        await startOAuthFlow();

      if (createdSessionId && setOAuthActive) {
        await setOAuthActive({ session: createdSessionId });
        router.replace("/");
        return;
      }

      Alert.alert("Google sign in canceled", "Please try again to continue.");
    } catch (error) {
      Alert.alert(
        "Google sign in failed",
        getClerkErrorMessage(error, "Unable to sign in with Google."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEmailSignIn = async () => {
    if (isSubmitting || !isLoaded || !signIn || !setActive) return;

    const identifier = emailAddress.trim();
    if (!identifier || !password.trim()) {
      Alert.alert("Missing credentials", "Enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const attempt = await signIn.create({
        identifier,
        password,
      });

      if (attempt.status === "complete" && attempt.createdSessionId) {
        await setActive({ session: attempt.createdSessionId });
        router.replace("/");
        return;
      }

      Alert.alert(
        "Additional verification required",
        "Please complete your sign-in challenge in Clerk.",
      );
    } catch (error) {
      Alert.alert(
        "Sign in failed",
        getClerkErrorMessage(
          error,
          "Unable to sign in. Check your credentials.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onForgotPassword = () => {
    Alert.alert("Forgot password", "Password reset flow will be added next.");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <AuthBackground isDarkScheme={isDarkScheme} />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="flex-grow px-6 pb-8 pt-1"
        >
          <View className="w-full max-w-[460px] flex-1 self-center">
            <View className="flex-row items-center justify-between">
              <AuthButton size="circle" onPress={() => router.back()}>
                <Feather name="arrow-left" size={18} color={iconColor} />
              </AuthButton>

              <Text className="text-2xl font-medium text-foreground">
                Log in
              </Text>

              <AuthButton size="circle">
                <Feather name="more-vertical" size={18} color={iconColor} />
              </AuthButton>
            </View>

            <View className="flex-1 justify-center">
              <View className="items-center gap-5">
                <View className="items-center gap-2">
                  <Text className="text-center text-4xl font-semibold leading-[42px] text-foreground">
                    Log in to your account
                  </Text>
                  <Text className="text-center text-base text-muted-foreground">
                    Welcome back! please enter your details
                  </Text>
                </View>

                <AuthButton
                  className="w-full"
                  disabled={isSubmitting}
                  onPress={() => void onGoogleSignIn()}
                  icon={<GoogleIcon />}
                  label={isSubmitting ? "Connecting..." : "Google"}
                />

                <Separator
                  label="Or continue with email"
                  className="w-full"
                  labelClassName="text-base font-normal text-muted-foreground"
                />

                <AuthInput
                  className="w-full"
                  value={emailAddress}
                  onChangeText={setEmailAddress}
                  keyboardType="email-address"
                  keyboardAppearance={isDarkScheme ? "dark" : "light"}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  placeholder="enter your email"
                  placeholderTextColor={placeholderColor}
                  leftIcon={
                    <Feather name="mail" size={20} color={mutedIconColor} />
                  }
                />

                <AuthInput
                  className="w-full"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  keyboardAppearance={isDarkScheme ? "dark" : "light"}
                  autoComplete="password"
                  placeholder="........"
                  placeholderTextColor={placeholderColor}
                  leftIcon={
                    <Feather name="lock" size={20} color={mutedIconColor} />
                  }
                />

                <View className="w-full flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <Checkbox
                      checked={rememberMe}
                      onCheckedChange={setRememberMe}
                    />
                    <Text className="text-base text-muted-foreground">
                      Remember me
                    </Text>
                  </View>
                  <Pressable onPress={onForgotPassword}>
                    <Text className="text-base font-medium text-primary">
                      Forgot password
                    </Text>
                  </Pressable>
                </View>

                <AuthGradientButton
                  label={isSubmitting ? "Signing in..." : "Log In"}
                  className="mt-2 w-full"
                  onPress={() => void onEmailSignIn()}
                  disabled={isSubmitting}
                  textClassName="text-2xl font-semibold"
                />
              </View>
            </View>

            <View className="items-center mt-auto pt-10">
              <Pressable
                onPress={() => router.push("/sign-up")}
                className="py-2"
              >
                <Text className="text-base text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Text className="font-medium text-foreground underline">
                    Sign Up
                  </Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
