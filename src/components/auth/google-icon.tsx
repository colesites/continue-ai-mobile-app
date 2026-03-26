import GoogleIconSvg from "@/assets/images/google-logo.png";
import { Image } from "expo-image";

type GoogleIconProps = {
  size?: number;
};

export function GoogleIcon({ size = 20 }: GoogleIconProps) {
  return (
    <Image
      source={GoogleIconSvg}
      style={{ width: size, height: size }}
      contentFit="contain"
      transition={200}
    />
  );
}
