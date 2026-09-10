/**
 * Browser voice navigation for Omni-Command.
 * Uses the Web Speech API (SpeechRecognition / webkitSpeechRecognition).
 * No server round-trip — transcript is filled into the command bar.
 */

import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  return (w.SpeechRecognition || w.webkitSpeechRecognition || null) as SpeechRecognitionCtor | null;
}

export type VoiceStatus =
  | "idle"
  | "listening"
  | "processing"
  | "unsupported"
  | "denied"
  | "error";

export interface UseSpeechNavigationOptions {
  lang?: string;
  /** When true, call onFinalTranscript when recognition ends with a final result */
  autoSubmit?: boolean;
  onFinalTranscript?: (text: string) => void;
  onInterimTranscript?: (text: string) => void;
}

export function useSpeechNavigation(options: UseSpeechNavigationOptions = {}) {
  const {
    lang = "en-US",
    autoSubmit = true,
    onFinalTranscript,
    onInterimTranscript,
  } = options;

  const [supported, setSupported] = useState(false);
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [transcript, setTranscript] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalRef = useRef("");
  const intentionalStop = useRef(false);

  // Stable callbacks
  const onFinalRef = useRef(onFinalTranscript);
  const onInterimRef = useRef(onInterimTranscript);
  useEffect(() => {
    onFinalRef.current = onFinalTranscript;
    onInterimRef.current = onInterimTranscript;
  }, [onFinalTranscript, onInterimTranscript]);

  useEffect(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setSupported(false);
      setStatus("unsupported");
      return;
    }
    setSupported(true);

    const recognition = new Ctor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = lang;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setStatus("listening");
      setErrorMessage(null);
      finalRef.current = "";
    };

    recognition.onresult = (event: any) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0]?.transcript || "";
        if (result.isFinal) final += text;
        else interim += text;
      }
      if (final) {
        finalRef.current = (finalRef.current + " " + final).trim();
        setTranscript(finalRef.current);
        onInterimRef.current?.(finalRef.current);
      } else if (interim) {
        const display = (finalRef.current + " " + interim).trim();
        setTranscript(display);
        onInterimRef.current?.(display);
      }
    };

    recognition.onerror = (event: any) => {
      const code = event?.error || "unknown";
      if (code === "not-allowed" || code === "service-not-allowed") {
        setStatus("denied");
        setErrorMessage("Microphone permission denied");
      } else if (code === "no-speech") {
        setStatus("idle");
        setErrorMessage("No speech detected");
      } else if (code === "aborted") {
        setStatus("idle");
      } else {
        setStatus("error");
        setErrorMessage(`Speech error: ${code}`);
      }
    };

    recognition.onend = () => {
      const text = finalRef.current.trim();
      if (text && autoSubmit && !intentionalStop.current) {
        setStatus("processing");
        onFinalRef.current?.(text);
      }
      intentionalStop.current = false;
      setStatus((s) => (s === "denied" || s === "unsupported" ? s : "idle"));
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.abort();
      } catch {
        /* ignore */
      }
      recognitionRef.current = null;
    };
  }, [lang, autoSubmit]);

  const start = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    setTranscript("");
    finalRef.current = "";
    setErrorMessage(null);
    try {
      recognition.start();
    } catch {
      // Already started
      try {
        recognition.stop();
        recognition.start();
      } catch (e) {
        setStatus("error");
        setErrorMessage(e instanceof Error ? e.message : "Could not start recognition");
      }
    }
  }, []);

  const stop = useCallback(() => {
    intentionalStop.current = true;
    try {
      recognitionRef.current?.stop();
    } catch {
      /* ignore */
    }
    setStatus("idle");
  }, []);

  const toggle = useCallback(() => {
    if (status === "listening") stop();
    else start();
  }, [status, start, stop]);

  return {
    supported,
    status,
    isListening: status === "listening",
    transcript,
    errorMessage,
    start,
    stop,
    toggle,
  };
}
