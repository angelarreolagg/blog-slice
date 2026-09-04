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
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setIsCopied(false), FEEDBACK_MS);
  }, []);

  return { isCopied, copy };
}
