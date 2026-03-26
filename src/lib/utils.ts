type ClassValue = string | null | false | undefined;

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(" ");
}
