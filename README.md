# Leonida Face/Voice/GUI Prototype

A prototype exploring visual and audio presence for Leonida beyond Telegram text chat.

## Quick Start

```bash
# Simple HTTP server
cd /Users/clawdbot/clawd/projects/leonida-face
python3 -m http.server 8080

# Then open http://localhost:8080
```

## Features (Prototype v0.1)

- **Simple Animated Avatar**: CSS-based lion face with expressions
- **Voice Output**: Web Speech API fallback, ElevenLabs ready
- **Lip Sync Simulation**: Mouth animates during speech
- **Mood System**: Happy, thinking expressions
- **Chat Interface**: Basic message display

## Architecture Options Researched

### 1. 🏆 RECOMMENDED: TalkingHead + Web Dashboard
**Best balance of effort vs results**

- **TalkingHead library**: JavaScript class for Ready Player Me avatars
- **Features**: Real-time lip-sync, expressions, moods, poses
- **ElevenLabs**: Already integrated, supports word-level timestamps
- **Deployment**: Web app accessible from any device

```
Clawdbot Backend ──► WebSocket ──► Web Dashboard
                                      │
                                      ▼
                               TalkingHead.js
                                      │
                                      ▼
                          Ready Player Me Avatar
                            + ElevenLabs TTS
```

### 2. Open-LLM-VTuber
**Most feature-complete but heavier**

- Full Live2D VTuber setup
- Voice interruption, visual perception
- Desktop pet mode
- More setup overhead

### 3. Tauri Menu Bar App
**Native macOS integration**

- Lightweight, native performance
- Good for quick-access floating window
- Can embed web view for avatar

### 4. Electron Desktop App
**Cross-platform but heavy**

- LLM-Live2D-Desktop-Assistant uses this
- ~100MB+ bundle size
- Full window/transparency control

## Implementation Roadmap

### Phase 1: Web Dashboard (1-2 days)
1. Integrate TalkingHead library
2. Create/import Ready Player Me avatar
3. Connect to Clawdbot via WebSocket
4. Add ElevenLabs TTS with lip-sync

### Phase 2: Desktop Presence (3-5 days)
1. Tauri wrapper for menu bar access
2. Floating window mode
3. Global hotkey activation
4. System tray integration

### Phase 3: Full Integration (1-2 weeks)
1. Two-way voice (Talk mode)
2. Screen awareness (optional)
3. Animated expressions from mood
4. Persistent chat context

## Files

- `index.html` - Prototype web UI with simple animated avatar
- `README.md` - This file

## Next Steps

1. Create Ready Player Me avatar for Leonida
2. Set up TalkingHead integration
3. Add WebSocket connection to Clawdbot
4. Build Tauri wrapper for macOS

## Resources

- [TalkingHead](https://github.com/met4citizen/TalkingHead) - 3D avatar with lip-sync
- [Ready Player Me](https://readyplayer.me/) - Avatar creation
- [Open-LLM-VTuber](https://github.com/Open-LLM-VTuber/Open-LLM-VTuber) - Full VTuber setup
- [Tauri](https://tauri.app/) - Lightweight desktop apps
- [pixi-live2d-display](https://github.com/guansss/pixi-live2d-display) - Web Live2D
