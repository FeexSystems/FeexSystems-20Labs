# Voice Navigation

## Purpose

Hands-free Omni-Command input using the browser **Web Speech API**. Spoken commands are transcribed into the command bar and can auto-submit into the same Orchestration Contract pipeline as typed queries.

Voice is a **client-side projection** — no speech audio is sent to FEEXSYSTEMS servers. Recognition runs in the browser (Chrome, Edge, Safari).

## User experience

| Control | Behavior |
|---------|----------|
| Mic button on `/omni` command bar | Toggle listening |
| Interim results | Fill the input as you speak |
| Final result | Auto-submit to Omni-Command (same as pressing Enter) |
| Rose border + pulse | Active listening |
| Unsupported / denied | Status line; typed input still works |

Example utterances:

```text
Show me the backend architecture
Which projects use PostgreSQL?
Run a health check on the platform
Show evidence for the knowledge graph
```

## Implementation

| File | Role |
|------|------|
| `client/hooks/useSpeechNavigation.ts` | `SpeechRecognition` / `webkitSpeechRecognition` wrapper |
| `client/components/omni/OmniCommandBar.tsx` | Mic UI + wire to `onSubmit` |

### Hook API

```ts
const { supported, status, isListening, transcript, errorMessage, start, stop, toggle } =
  useSpeechNavigation({
    lang: "en-US",
    autoSubmit: true,
    onFinalTranscript: (text) => { /* submit */ },
    onInterimTranscript: (text) => { /* setCommand */ },
  });
```

`status`: `idle` | `listening` | `processing` | `unsupported` | `denied` | `error`

## Browser support

- **Supported:** Chromium (Chrome, Edge, Brave), Safari (webkit prefix)
- **Not supported:** Firefox (as of 2026 — no standard SpeechRecognition)

Requires **HTTPS** (or `localhost`) and microphone permission.

## Privacy

- Audio is processed by the **browser / OS speech service** (e.g. Google on Chrome, Apple on Safari), not by the FEEXSYSTEMS API.
- Only the resulting **text transcript** is sent to `/api/world-model/omni-command` when the user (or auto-submit) issues a command.
- Users can revoke mic permission in browser site settings at any time.

## Relationship to roadmap

Voice navigation completes the Phase III item that wires speech into the Omni Stage. It does not change World Model authority: spoken queries are still grounded via hybrid retrieval and the Orchestration Contract.

## Future

- Continuous mode for multi-command sessions
- Language selector (beyond `en-US`)
- Optional wake phrase (“Hey Omni”)
- Server-side STT fallback for unsupported browsers
