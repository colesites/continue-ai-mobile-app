const memoryStore = new Map<string, string>();

function hasWebStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function getStoredValue(key: string): string | null {
  if (hasWebStorage()) {
    return window.localStorage.getItem(key);
  }

  return memoryStore.get(key) ?? null;
}

export function setStoredValue(key: string, value: string): void {
  if (hasWebStorage()) {
    window.localStorage.setItem(key, value);
    return;
  }

  memoryStore.set(key, value);
}
