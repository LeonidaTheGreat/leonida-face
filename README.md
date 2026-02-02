# Leonida Face 🦁

A 3D avatar system for Leonida with real-time lip sync, expressive animations, and distinctive visual styles.

## Quick Start

```bash
# Start local server
cd /Users/clawdbot/clawd/leonida-face
python3 -m http.server 8083

# Open in Chrome (needs WebGL)
open http://localhost:8083/talkinghead-clawdbot.html
```

## Features

- **Lip Sync** - Real-time mouth animation from ElevenLabs TTS
- **AI Chat** - Connected to Clawdbot Gateway
- **Visual Styles** - Particles, voxels, plexus effects (WIP)
- **Expressions** - Mood-based facial animations

## Project Structure

```
leonida-face/
├── CLAUDE.md              # AI agent context (read this first)
├── README.md              # This file
├── RENDERING_STYLES.md    # Visual styles documentation
├── AVATAR_RESEARCH.md     # Avatar creation options
├── SETUP.md               # Setup guide
│
├── talkinghead-clawdbot.html  # Main avatar hub
├── talkinghead-minimal.html   # Minimal TalkingHead demo
├── stipple-head-gpu.html      # Particle rendering system
│
├── models/                # 3D model files (GLB)
└── .claude/commands/      # Claude Code commands
```

## Documentation

| Document | Purpose |
|----------|---------|
| [CLAUDE.md](CLAUDE.md) | Project context for AI agents |
| [RENDERING_STYLES.md](RENDERING_STYLES.md) | Visual styles (particles, voxels, plexus) |
| [AVATAR_RESEARCH.md](AVATAR_RESEARCH.md) | Avatar creation and model requirements |
| [SETUP.md](SETUP.md) | Detailed setup instructions |

## Tech Stack

- **Three.js** - WebGL 3D rendering
- **TalkingHead.js** - Avatar animation library
- **ElevenLabs** - Text-to-speech with timestamps
- **Clawdbot Gateway** - AI backend

## Current Status

**Branch:** `vrm-talkinghead`

- ✅ TalkingHead + ElevenLabs integration
- ✅ Clawdbot Gateway chat API
- ✅ Particle rendering system
- 🔄 Reconciling rendering styles
- 📋 Custom Leonida avatar

## Requirements

- Chrome/Firefox with WebGL support
- ElevenLabs API key (for voice)
- Clawdbot Gateway running (for AI chat)

## License

Private project for Leonida assistant.
