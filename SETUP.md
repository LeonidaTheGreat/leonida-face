# Leonida Face - Setup Guide

## Quick Start

### 1. Start the server
```bash
cd /Users/clawdbot/clawd/leonida-face
python3 -m http.server 8083
```

### 2. Open in browser (needs WebGL/GPU)
- **Minimal version:** http://localhost:8083/talkinghead-minimal.html
- **Full Clawdbot integration:** http://localhost:8083/talkinghead-clawdbot.html

> ⚠️ **Note:** The clawd managed browser runs sandboxed without GPU, so WebGL fails.
> Use your regular Chrome browser instead.

### 3. Configure
1. Go to the **Settings** tab
2. Enter your **ElevenLabs API key** (get one at elevenlabs.io)
3. Return to **Chat** tab and type a message

## Files

| File | Description |
|------|-------------|
| `talkinghead-minimal.html` | Simple TalkingHead demo with ElevenLabs TTS |
| `talkinghead-clawdbot.html` | Full integration with Clawdbot Gateway WebSocket |
| `stipple-head-gpu.html` | Particle/stipple rendering (separate approach) |
| `AVATAR_RESEARCH.md` | Research on avatar creation options |

## Current Avatar

Using Ready Player Me avatar (temporary - RPM shutting down Jan 31, 2026).

## Next Steps

1. **Test lip sync** - Enter ElevenLabs key and verify speech + lip sync works
2. **Create custom avatar** - Use Avaturn or MPFB (see AVATAR_RESEARCH.md)
3. **Connect to Clawdbot** - Wire up Gateway WebSocket for real chat
4. **Apply particle rendering** - Combine TalkingHead with stipple effect

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser (WebGL)                         │
│  ┌─────────────────┐    ┌────────────────────────────────┐  │
│  │  TalkingHead.js │◄───│  ElevenLabs WebSocket API      │  │
│  │  (3D Avatar)    │    │  (TTS + word timestamps)       │  │
│  └────────┬────────┘    └────────────────────────────────┘  │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────┐                                        │
│  │  Three.js       │                                        │
│  │  (WebGL render) │                                        │
│  └─────────────────┘                                        │
│           ▲                                                  │
│           │                                                  │
│  ┌────────┴────────┐                                        │
│  │ Clawdbot Gateway│◄──── ws://127.0.0.1:18789              │
│  │ (Chat/Events)   │                                        │
│  └─────────────────┘                                        │
└─────────────────────────────────────────────────────────────┘
```

## Troubleshooting

### "WebGL context could not be created"
- Use a browser with GPU support (not sandboxed)
- Try Chrome/Firefox with hardware acceleration enabled

### Avatar not loading
- Check browser console (F12) for errors
- Verify Ready Player Me URL is still valid
- Network issues? Try refreshing

### No speech
- Enter ElevenLabs API key in Settings
- Check console for WebSocket errors
- Verify API key has remaining quota
