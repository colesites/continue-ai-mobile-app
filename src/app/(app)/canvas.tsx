import { CanvasGallery } from "@/components/canvas/canvas-gallery";
import { CanvasInputBar } from "@/components/canvas/canvas-input-bar";
import { MainHeader } from "@/components/nav/MainHeader";
import { ScreenBackground } from "@/components/ui/screen";
import { useCanvasScreen } from "@/features/canvas/use-canvas-screen";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

export default function CanvasScreen() {
  const {
    tab,
    setTab,
    prompt,
    setPrompt,
    mode,
    handleModeChange,
    modelId,
    isGenerating,
    handleGenerate,
    displayCreations,
    toggleCanvasLike,
    toggleCanvasPublish,
  } = useCanvasScreen();

  return (
    <ScreenBackground>
      <MainHeader
        canvasMenu={{
          tab,
          onSelectTab: setTab,
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="flex-grow px-4 pb-40 pt-16"
          showsVerticalScrollIndicator={false}
        >
          <CanvasGallery
            creations={displayCreations}
            onLike={toggleCanvasLike}
            onPublish={toggleCanvasPublish}
            showPublish={tab === "mine"}
          />
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 px-4 pb-8 bg-transparent">
          <CanvasInputBar
            prompt={prompt}
            onChangePrompt={setPrompt}
            mode={mode}
            onChangeMode={handleModeChange}
            modelId={modelId}
            isGenerating={isGenerating}
            onGenerate={() => void handleGenerate()}
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}
