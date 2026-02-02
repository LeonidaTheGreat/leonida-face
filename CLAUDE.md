# Leonida Face - AI Avatar Project

This project creates a 3D avatar for Leonida (AI assistant) with real-time lip sync and expressive animations.

## Project Goal

Build a web-based 3D avatar that:
- Speaks with accurate lip sync (driven by ElevenLabs TTS)
- Has natural idle animations (breathing, blinking, looking around)
- Uses a distinctive visual style (particles, voxels, or plexus effects)
- Connects to Clawdbot Gateway for real AI conversations

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Avatar Hub (Browser)                      │
│                                                              │
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │  Rendering      │    │  Animation Driver               │ │
│  │  ├─ Particles   │    │  ├─ TalkingHead.js (lip sync)   │ │
│  │  ├─ Voxels      │◄───│  ├─ Blend shapes (visemes)     │ │
│  │  └─ Plexus      │    │  └─ Idle animations             │ │
│  └─────────────────┘    └─────────────────────────────────┘ │
│           │                          ▲                       │
│           │                          │                       │
│           ▼                          │                       │
│  ┌─────────────────┐    ┌────────────┴────────────────────┐ │
│  │  Three.js       │    │  ElevenLabs WebSocket API       │ │
│  │  (WebGL)        │    │  (TTS + word timestamps)        │ │
│  └─────────────────┘    └─────────────────────────────────┘ │
│                                      ▲                       │
│                                      │                       │
│                         ┌────────────┴────────────────────┐ │
│                         │  Clawdbot Gateway               │ │
│                         │  POST /v1/chat/completions      │ │
│                         └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Key Files

### Active Development (vrm-talkinghead branch)

| File | Purpose |
|------|---------|
| `talkinghead-clawdbot.html` | Main avatar hub with Gateway integration |
| `talkinghead-minimal.html` | Minimal TalkingHead demo for testing |
| `stipple-head-gpu.html` | Particle rendering system (to be integrated) |

### Documentation

| File | Purpose |
|------|---------|
| `CLAUDE.md` | This file - project context for AI agents |
| `RENDERING_STYLES.md` | Visual styles analysis (particles, voxels, plexus) |
| `AVATAR_RESEARCH.md` | Avatar creation options and requirements |
| `SETUP.md` | Quick start guide |

### Legacy/Exploration (may be useful for reference)

| File | Purpose |
|------|---------|
| `vrm-avatar-v2.html` | VRM avatar with Genshin-style animations |
| `particle-face-controls.html` | Early particle system with controls |
| `voxel-head.html` | Voxel rendering experiment |

## Tech Stack

- **Three.js** - 3D rendering (WebGL)
- **TalkingHead.js** - Avatar animation + lip sync library
- **ElevenLabs** - Text-to-speech with word timestamps
- **Clawdbot Gateway** - AI backend (OpenAI-compatible API)

## Model Requirements

For lip sync to work, the 3D model needs:

| Requirement | Count | Purpose |
|-------------|-------|---------|
| Oculus Visemes | 15 | Lip positions for speech |
| ARKit Blend Shapes | 52 | Facial expressions |
| Mixamo Rig | - | Body animation compatibility |
| GLB Format | - | Web-compatible 3D format |

See `AVATAR_RESEARCH.md` for avatar creation options.

## Rendering Styles

The project supports multiple visual styles (see `RENDERING_STYLES.md`):

1. **Particles** - Point sprites on mesh surface
2. **Voxels** - Grid-aligned cubes
3. **Plexus** - Connecting lines between elements
4. **Combinations** - Voxels+Plexus, Particles+Plexus

## Development Workflow

### Running Locally

```bash
cd /Users/clawdbot/clawd/leonida-face
python3 -m http.server 8083
# Open http://localhost:8083/talkinghead-clawdbot.html
```

### Testing Lip Sync

1. Open the avatar page in Chrome (needs WebGL)
2. Go to Settings tab → enter ElevenLabs API key
3. Go to Chat tab → type message → Send
4. Avatar speaks with lip sync

### Git Workflow

```bash
# Current branch
git checkout vrm-talkinghead

# After changes
git add -A
git commit -m "Description"
git push origin vrm-talkinghead
```

## Current Status

### ✅ Done
- TalkingHead integration with ElevenLabs
- Clawdbot Gateway HTTP API connection
- Basic avatar loading and display
- Particle rendering system (stipple-head)
- Documentation structure

### 🔄 In Progress
- Reconciling particle rendering with TalkingHead
- Style dropdown (particles vs voxels vs plexus)

### 📋 TODO
- [ ] Add style dropdown to UI
- [ ] Implement voxel rendering mode
- [ ] Implement plexus line connections
- [ ] Connect blend shapes to particle positions
- [ ] Create custom Leonida avatar (lion-themed)
- [ ] Optimize for mobile/low-end devices

## Design Decisions

### Why TalkingHead?
- Built-in lip sync with word-level timestamps
- Supports ElevenLabs WebSocket API
- Handles blend shape interpolation
- Active maintenance

### Why Particles/Voxels instead of textured mesh?
- Distinctive "AI" aesthetic
- Easier to animate (dissolution, assembly effects)
- Lower asset requirements (no textures)
- Matches Leonida's digital nature

### Why Clawdbot Gateway HTTP API?
- Simpler than WebSocket protocol
- OpenAI-compatible format
- Stateless (no session management needed in browser)
- Works with any AI backend

## References

- [TalkingHead](https://github.com/met4citizen/TalkingHead) - Avatar library
- [Three.js](https://threejs.org/) - 3D engine
- [ElevenLabs](https://elevenlabs.io/) - TTS API
- [Clawdbot Docs](https://docs.clawd.bot/) - Gateway API
