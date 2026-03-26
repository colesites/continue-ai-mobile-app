import { tokenCache } from "@/lib/auth";
import { ClerkProvider as ClerkProviderBase } from "@clerk/clerk-expo";

const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!clerkPublishableKey) {
  throw new Error(
    "Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in environment variables"
  );
}

interface ClerkProviderProps {
  children: React.ReactNode;
}

export function ClerkProvider({ children }: ClerkProviderProps) {
  return (
    <ClerkProviderBase
      publishableKey={clerkPublishableKey}
      tokenCache={tokenCache}
    >
      {children}
    </ClerkProviderBase>
  );
}
