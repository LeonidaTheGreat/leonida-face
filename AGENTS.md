# AGENTS.md - Leonida Face Project

When working on this project, read these files first:
1. `CLAUDE.md` — Project architecture and status
2. `RENDERING_STYLES.md` — Visual styles documentation
3. `AVATAR_RESEARCH.md` — Model requirements

## Project Goal

Build a 3D avatar for Leonida with:
- Real-time lip sync (ElevenLabs TTS)
- Distinctive visual style (particles/voxels/plexus)
- Connected to Clawdbot Gateway for AI chat

## Current Branch

**`vrm-talkinghead`** — TalkingHead integration branch

## Key Files to Know

| File | What it does |
|------|--------------|
| `stipple-head-gpu.html` | Particle rendering system (192KB, most complex) |
| `talkinghead-clawdbot.html` | Main avatar hub with Gateway integration |
| `talkinghead-minimal.html` | Simple TalkingHead demo |

## Development Server

```bash
cd /Users/clawdbot/clawd/leonida-face
python3 -m http.server 8083
```

Then open: http://localhost:8083/

## Working Discipline

### Before Making Changes
1. Read `CLAUDE.md` for current status
2. Check which file you're modifying
3. Understand the existing code structure

### When Modifying stipple-head-gpu.html
- It's 192KB — large and complex
- Uses GPU shaders for particle rendering
- Has many interconnected settings
- Test after every significant change

### When Modifying TalkingHead files
- They depend on CDN imports (Three.js, TalkingHead)
- Need WebGL (won't work in sandboxed browser)
- Test in Chrome with GPU enabled

### After Changes
1. Test in browser (localhost:8083)
2. Check browser console for errors
3. Commit with descriptive message
4. Update CLAUDE.md status if significant

## Git Workflow

```bash
# We're on vrm-talkinghead branch
git add -A
git commit -m "Description of change"
git push origin vrm-talkinghead
```

## Dependencies

All loaded via CDN (no npm install needed):
- Three.js (0.180.0 for TalkingHead, 0.169.0 for stipple)
- TalkingHead.js (1.7)
- ElevenLabs WebSocket API

## Common Tasks

### Test lip sync
1. Open talkinghead-minimal.html
2. Enter ElevenLabs API key
3. Type text and click Speak

### Test particle rendering
1. Open stipple-head-gpu.html
2. Adjust sliders
3. Try different models from dropdown

### Test full integration
1. Open talkinghead-clawdbot.html
2. Configure Gateway URL and ElevenLabs key
3. Send chat message

## Known Issues

- Clawd managed browser has WebGL disabled (use regular Chrome)
- Ready Player Me shutting down Jan 31, 2026 (need alternative avatar)
- Particle system not yet connected to blend shapes
