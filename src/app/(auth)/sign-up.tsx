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

import { useOAuth, useSignUp } from "@clerk/clerk-expo";

import { AuthBackground } from "@/components/auth/auth-background";
import { AuthButton } from "@/components/auth/auth-button";
import { AuthGradientButton } from "@/components/auth/auth-gradient-button";
import { AuthInput } from "@/components/auth/auth-input";
import { GoogleIcon } from "@/components/auth/google-icon";
import { Separator } from "@/components/ui/separator";
import { getClerkErrorMessage } from "@/lib/clerk-error";

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const isDarkScheme = useColorScheme() !== "light";
  const iconColor = "#ffffff";
  const mutedIconColor = "#ffffff";
  const placeholderColor = "#ffffff";

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onGoogleSignUp = async () => {
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

      Alert.alert("Google sign up canceled", "Please try again to continue.");
    } catch (error) {
      Alert.alert(
        "Google sign up failed",
        getClerkErrorMessage(error, "Unable to sign up with Google."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEmailSignUp = async () => {
    if (isSubmitting || !isLoaded || !signUp) return;

    const email = emailAddress.trim();
    if (!email || !password.trim()) {
      Alert.alert("Missing details", "Enter an email address and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
      Alert.alert(
        "Verification code sent",
        "Check your inbox for the code to finish sign up.",
      );
    } catch (error) {
      Alert.alert(
        "Sign up failed",
        getClerkErrorMessage(error, "Unable to create account."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onResendCode = async () => {
    if (isSubmitting || !isLoaded || !signUp) return;

    setIsSubmitting(true);
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      Alert.alert(
        "Code resent",
        "We sent a fresh verification code to your email.",
      );
    } catch (error) {
      Alert.alert(
        "Resend failed",
        getClerkErrorMessage(error, "Unable to send another code right now."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onVerifyCode = async () => {
    if (isSubmitting || !isLoaded || !signUp || !setActive) return;

    const code = verificationCode.trim();
    if (!code) {
      Alert.alert("Code required", "Enter the email verification code.");
      return;
    }

    setIsSubmitting(true);
    try {
      const attempt = await signUp.attemptEmailAddressVerification({ code });

      if (attempt.status === "complete" && attempt.createdSessionId) {
        await setActive({ session: attempt.createdSessionId });
        router.replace("/");
        return;
      }

      Alert.alert(
        "Verification incomplete",
        "Please try again with a valid code.",
      );
    } catch (error) {
      Alert.alert(
        "Verification failed",
        getClerkErrorMessage(error, "Unable to verify this code."),
      );
    } finally {
      setIsSubmitting(false);
    }
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
                Sign up
              </Text>

              <AuthButton size="circle">
                <Feather name="more-vertical" size={18} color={iconColor} />
              </AuthButton>
            </View>

            <View className="flex-1 justify-center">
              {!pendingVerification ? (
                <View className="items-center gap-5">
                  <View className="items-center gap-2">
                    <Text className="text-center text-4xl font-semibold leading-[42px] text-foreground">
                      Create your account
                    </Text>
                    <Text className="text-center text-base text-muted-foreground">
                      Get started with Google
                    </Text>
                  </View>

                  <AuthButton
                    className="w-full"
                    disabled={isSubmitting}
                    onPress={() => void onGoogleSignUp()}
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
                    autoComplete="new-password"
                    placeholder="Create a strong password"
                    placeholderTextColor={placeholderColor}
                    leftIcon={
                      <Feather name="lock" size={20} color={mutedIconColor} />
                    }
                  />

                  <AuthGradientButton
                    label={
                      isSubmitting ? "Creating account..." : "Create account"
                    }
                    className="mt-2 w-full"
                    onPress={() => void onEmailSignUp()}
                    disabled={isSubmitting}
                    textClassName="text-xl font-semibold"
                  />
                </View>
              ) : (
                <View className="items-center gap-5">
                  <View className="items-center gap-2">
                    <Text className="text-center text-4xl font-semibold leading-[42px] text-foreground">
                      Verify your email
                    </Text>
                    <Text className="text-center text-base text-muted-foreground">
                      Enter the code we sent to complete your account setup
                    </Text>
                  </View>

                  <View className="w-full rounded-2xl border border-primary/30 bg-primary/10 p-4">
                    <Text className="text-center text-sm font-medium text-foreground">
                      We sent a verification code to{" "}
                      {emailAddress.trim() || "your email"}.
                    </Text>
                  </View>

                  <AuthInput
                    className="w-full"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    keyboardType="number-pad"
                    keyboardAppearance={isDarkScheme ? "dark" : "light"}
                    placeholder="Enter 6-digit code"
                    placeholderTextColor={placeholderColor}
                    leftIcon={
                      <Feather name="shield" size={20} color={mutedIconColor} />
                    }
                  />

                  <AuthGradientButton
                    label={
                      isSubmitting ? "Verifying..." : "Verify and continue"
                    }
                    className="w-full"
                    onPress={() => void onVerifyCode()}
                    disabled={isSubmitting}
                    textClassName="text-xl font-semibold"
                  />

                  <View className="w-full flex-row items-center justify-between">
                    <Pressable
                      onPress={() => {
                        setPendingVerification(false);
                        setVerificationCode("");
                      }}
                      className="py-1"
                    >
                      <Text className="text-sm font-medium text-muted-foreground">
                        Change email
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => void onResendCode()}
                      className="py-1"
                    >
                      <Text className="text-sm font-semibold text-foreground">
                        Resend code
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>

            <View className="mt-auto items-center pt-10">
              <Pressable
                onPress={() => router.push("/sign-in")}
                className="py-2"
              >
                <Text className="text-base text-muted-foreground">
                  Already have an account?{" "}
                  <Text className="font-medium text-foreground underline">
                    Log In
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
