import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

import { ChatComposer } from "@/components/chat/chat-composer";
import { HomeIntro } from "@/components/home/home-intro";
import { ImportModal } from "@/components/home/import-modal";
import { InfoModal } from "@/components/home/info-modal";
import { MainHeader } from "@/components/nav/MainHeader";
import { ScreenBackground } from "@/components/ui/screen";
import { useHomeActions } from "@/features/home/use-home-actions";

export default function HomeScreen() {
  const {
    selectedModel,
    setSelectedModel,
    prompt,
    setPrompt,
    importUrl,
    setImportUrl,
    importProvider,
    isCreatingChat,
    isImporting,
    isInfoModalOpen,
    setIsInfoModalOpen,
    isImportModalOpen,
    setIsImportModalOpen,
    startChatFromPrompt,
    handleImport,
  } = useHomeActions();

  return (
    <ScreenBackground>
      <MainHeader />

      <InfoModal
        open={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />

      <ImportModal
        open={isImportModalOpen}
        value={importUrl}
        onChangeValue={setImportUrl}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
        isImporting={isImporting}
        detectedProvider={importProvider}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-6 px-6 pb-32 pt-16"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <HomeIntro
            onOpenInfo={() => setIsInfoModalOpen(true)}
            onOpenImport={() => setIsImportModalOpen(true)}
          />
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 px-6 pb-8 bg-transparent">
          <ChatComposer
            value={prompt}
            onChangeValue={setPrompt}
            onSend={() => {
              if (!prompt.trim()) {
                Alert.alert(
                  "Prompt required",
                  "Type a prompt to start a chat.",
                );
                return;
              }
              void startChatFromPrompt();
            }}
            isSending={isCreatingChat}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}
