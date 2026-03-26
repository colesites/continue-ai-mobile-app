import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { Chip } from "@/components/ui/chip";
import { AVAILABLE_MODELS, getProviderColor } from "@/lib/models";

type ModelSelectorSheetProps = {
  open: boolean;
  selectedModelId: string;
  onClose: () => void;
  onSelect: (modelId: string) => void;
};

export function ModelSelectorSheet({ open, selectedModelId, onClose, onSelect }: ModelSelectorSheetProps) {
  return (
    <Modal animationType="slide" transparent visible={open} onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <View className="max-h-[78%] rounded-t-3xl border border-slate-700 bg-[#090d17] p-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-base font-semibold text-slate-50">Choose model</Text>
            <Pressable onPress={onClose}>
              <Text className="text-sm font-semibold text-fuchsia-300">Done</Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="pb-2">
            <View className="flex-row flex-wrap gap-2">
              {AVAILABLE_MODELS.map((model) => (
                <Chip
                  key={model.id}
                  label={model.name}
                  selected={model.id === selectedModelId}
                  dotColor={getProviderColor(model.provider)}
                  onPress={() => {
                    onSelect(model.id);
                    onClose();
                  }}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
