import { useCallback, useSyncExternalStore } from "react";
import {
  applyTheme,
  isTheme,
  THEME_STORAGE_KEY,
  type Theme,
} from "../model/theme";

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getSnapshot(): Theme {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

// Prerendered HTML cannot know the stored choice; the pre-paint script applies it.
function getServerSnapshot(): Theme {
  return "system";
}

export function useTheme(): {
  theme: Theme;
  setTheme: (next: Theme) => void;
} {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // A blocked storage still switches the theme for this page view.
    }
    applyTheme(next);
    emit();
  }, []);

  return { theme, setTheme };
}
