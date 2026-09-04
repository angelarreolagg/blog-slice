import { useCallback, useEffect, useRef, useState } from "react";

const FEEDBACK_MS = 2000;

export function useCopy(): {
  isCopied: boolean;
  copy: (text: string) => Promise<void>;
} {
  const [isCopied, setIsCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timeout.current), []);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Denied or insecure context: the label simply never reports success.
      return;
    }
    setIsCopied(true);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setIsCopied(false), FEEDBACK_MS);
  }, []);

  return { isCopied, copy };
}
