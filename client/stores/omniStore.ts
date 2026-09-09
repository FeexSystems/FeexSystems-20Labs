import { create } from "zustand";
import type { OmniCommandResponse, OmniCommandContext } from "../../shared/orchestration";

interface OmniState {
  command: string;
  isProcessing: boolean;
  payload: OmniCommandResponse | null;
  context: OmniCommandContext;
  history: string[];
  setCommand: (cmd: string) => void;
  setProcessing: (v: boolean) => void;
  setPayload: (p: OmniCommandResponse | null) => void;
  setContext: (ctx: Partial<OmniCommandContext>) => void;
  pushHistory: (cmd: string) => void;
  reset: () => void;
}

export const useOmniStore = create<OmniState>((set) => ({
  command: "",
  isProcessing: false,
  payload: null,
  context: {},
  history: [],
  setCommand: (command) => set({ command }),
  setProcessing: (isProcessing) => set({ isProcessing }),
  setPayload: (payload) => set({ payload }),
  setContext: (ctx) => set((s) => ({ context: { ...s.context, ...ctx } })),
  pushHistory: (cmd) =>
    set((s) => ({
      history: [cmd, ...s.history.filter((h) => h !== cmd)].slice(0, 12),
    })),
  reset: () =>
    set({
      command: "",
      isProcessing: false,
      payload: null,
      context: {},
    }),
}));
