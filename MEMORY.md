# MEMORY.md - Leonida Face Project

Long-term context for the avatar project. Updated as significant decisions are made.

---

## Project Vision

Create a distinctive 3D avatar for Leonida that:
- Looks unique (not generic VTuber)
- Has accurate lip sync for natural conversation
- Uses particle/voxel aesthetic (digital, AI-like)
- Runs in browser (accessible anywhere)

---

## Architecture Decisions

### Animation Driver: TalkingHead.js
**Why:** Built-in lip sync with ElevenLabs, handles blend shape interpolation, actively maintained.
**Alternative considered:** Custom viseme driver — too much work for MVP.

### Chat Backend: Clawdbot Gateway HTTP API
**Why:** OpenAI-compatible, simple, stateless. No complex WebSocket session management.
**Alternative considered:** Gateway WebSocket protocol — overkill for avatar UI.

### Rendering: Three.js + Custom Shaders
**Why:** stipple-head already works, just needs blend shape integration.
**Alternative considered:** Unity/Unreal — too heavy for web deployment.

### Visual Style: Particles with Plexus Option
**Why:** Distinctive "digital" look, matches AI assistant aesthetic.
**Reference:** See `RENDERING_STYLES.md` for detailed analysis.

---

## Model Requirements

For lip sync, model MUST have:
- **15 Oculus Visemes** (mouth positions)
- **52 ARKit Blend Shapes** (expressions)
- **Mixamo Rig** (body animation)
- **GLB Format** (web compatible)

Current models in `models/` do NOT have blend shapes — cannot use for lip sync.

---

## Key Findings

### Ready Player Me Shutdown (Jan 31, 2026)
Netflix acquired RPM. TalkingHead's default avatar source is going away.
**Action:** Use Avaturn for quick testing, MPFB for custom long-term avatar.

### WebGL in Sandboxed Browser
Clawd managed browser runs without GPU — WebGL fails.
**Action:** Test in regular Chrome browser.

### Blend Shape → Particle Connection
Particles must track mesh vertex positions. When blend shapes deform mesh, particles follow.
**Implementation:** Store vertexIndex per particle, read deformed position each frame.

---

## Lion Theme Options

Stojan wants lion-themed avatar for Leonida 🦁

**Quick path:** Stylized human with lion qualities (golden tones, mane-like hair)
**Hard path:** Full anthropomorphic lion needs 40-80 hours in Blender

Decision pending — start with human avatar, consider lion later.

---

## Version History

| Date | Change |
|------|--------|
| 2026-02-02 | Project setup, TalkingHead integration, documentation |
| 2026-02-01 | Particle system development (stipple-head-gpu.html) |

---

## Links

- [TalkingHead GitHub](https://github.com/met4citizen/TalkingHead)
- [Avaturn](https://avaturn.me/)
- [MPFB](https://static.makehumancommunity.org/mpfb.html)
- [ElevenLabs](https://elevenlabs.io/)
