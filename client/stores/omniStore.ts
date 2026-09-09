import { create } from "zustand";
import type { OmniCommandResponse, OmniCommandContext, ReasoningStep } from "@shared/orchestration";

interface OmniState {
  command: string;
  isProcessing: boolean;
  payload: OmniCommandResponse | null;
  liveTrace: ReasoningStep[];
  context: OmniCommandContext;
  history: string[];
  setCommand: (cmd: string) => void;
  setProcessing: (v: boolean) => void;
  setPayload: (p: OmniCommandResponse | null) => void;
  appendTrace: (s: ReasoningStep) => void;
  clearTrace: () => void;
  setContext: (ctx: Partial<OmniCommandContext>) => void;
  pushHistory: (cmd: string) => void;
  reset: () => void;
}

export const useOmniStore = create<OmniState>((set) => ({
  command: "",
  isProcessing: false,
  payload: null,
  liveTrace: [],
  context: {},
  history: [],
  setCommand: (command) => set({ command }),
  setProcessing: (isProcessing) => set({ isProcessing }),
  setPayload: (payload) => set({ payload }),
  appendTrace: (s) => set((st) => ({ liveTrace: [...st.liveTrace, s] })),
  clearTrace: () => set({ liveTrace: [] }),
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
      liveTrace: [],
      context: {},
    }),
}));
