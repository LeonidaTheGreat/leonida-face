# TOOLS.md - Project-Specific Notes

## Local Server

```bash
# Start server
python3 -m http.server 8083

# Server URLs
http://localhost:8083/                        # File listing
http://localhost:8083/talkinghead-clawdbot.html  # Main avatar
http://localhost:8083/stipple-head-gpu.html      # Particle system
```

## ElevenLabs TTS

- **Voice:** Josh (voiceId: `TxGEqnHWrfWFTfGW9XjX`)
- **Model:** eleven_multilingual_v2
- **API:** WebSocket streaming with word timestamps
- Configured in Clawdbot: `messages.tts.elevenlabs`

## Clawdbot Gateway

- **URL:** `http://127.0.0.1:18789`
- **Chat API:** `POST /v1/chat/completions` (OpenAI-compatible)
- **Agent:** main
- Enabled via: `gateway.http.endpoints.chatCompletions.enabled: true`

## Browser Testing

**Use regular Chrome** (not clawd managed browser)
- Clawd browser runs sandboxed without GPU
- WebGL required for Three.js rendering

To test with clawd browser anyway:
```bash
clawdbot browser --browser-profile clawd start
clawdbot browser open http://localhost:8083/talkinghead-clawdbot.html
```

## 3D Models

Located in `models/` directory:

| Model | Size | Notes |
|-------|------|-------|
| meshy_character.glb | 11.6MB | Generic character |
| gothic.glb | 22MB | Gothic style |
| explorer.glb | 19MB | Explorer character |
| head.obj | 1MB | Simple head (OBJ format) |

**For TalkingHead lip sync**, model needs:
- GLB format
- 52 ARKit blend shapes
- 15 Oculus visemes
- Mixamo-compatible rig

Current models do NOT have blend shapes.

## CDN Dependencies

TalkingHead files use:
```javascript
{
  "three": "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js/+esm",
  "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/",
  "talkinghead": "https://cdn.jsdelivr.net/gh/met4citizen/TalkingHead@1.7/modules/talkinghead.mjs"
}
```

Stipple-head uses:
```javascript
{
  "three": "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js",
  "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/"
}
```

## Avatar Creation

### Quick Option: Avaturn
- URL: https://avaturn.me/
- Free for non-commercial
- Has ARKit + Oculus blend shapes
- Export as GLB

### Long-term Option: MPFB (Blender)
- Free, open source
- Full control
- Requires Blender knowledge

See `AVATAR_RESEARCH.md` for details.
