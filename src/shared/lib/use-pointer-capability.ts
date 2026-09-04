import { useMediaQuery } from "./use-media-query";

const HOVER_QUERY = "(hover: hover) and (pointer: fine)";

// Assumes hover on the server so prerendered HTML matches the resting state.
export function usePointerCapability(): boolean {
  return useMediaQuery(HOVER_QUERY, true);
}
