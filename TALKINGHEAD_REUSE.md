# TalkingHead Reuse Analysis

Analysis of https://github.com/met4citizen/TalkingHead for Leonida Face project.

## Key Reusable Components

### 1. ✅ ElevenLabs Integration (Already Using)
We already implemented this in `talkinghead-minimal.html`:
- WebSocket streaming API
- Word-level timestamps for lip sync
- PCM audio chunks

### 2. ✅ Lip Sync System
TalkingHead handles the complex viseme-to-blend-shape mapping:
- 15 Oculus visemes (PP, FF, TH, DD, kk, CH, SS, nn, RR, aa, E, I, O, U, sil)
- Word timing → viseme interpolation
- Language modules for phoneme mapping

### 3. 🔑 `avatarOnly` Mode (KEY FOR US!)
```javascript
const head = new TalkingHead(null, {
  avatarOnly: true,           // No scene/renderer created
  avatarOnlyCamera: camera,   // Use our camera
  avatarOnlyScene: scene      // Add to our scene
});
```

**This lets us:**
- Use TalkingHead's animation system
- Keep our own Three.js scene/renderer
- Add particles/effects on top of the avatar
- Access the mesh for vertex positions

### 4. ✅ Mood System
8 moods with automatic facial expressions:
- neutral, happy, angry, sad, fear, disgust, love, sleep
- Each mood has baseline blend shapes + animations

### 5. ✅ Idle Animations
Built-in natural movements:
- Eye contact (configurable proportion)
- Head movement
- Blinking
- Breathing
- Weight shifting

### 6. ✅ Mixamo Animation Support
Can play FBX animations from Mixamo:
```javascript
head.playAnimation('./animations/walking.fbx', null, 10);
head.playPose('./animations/dance.fbx', null, 5);
```

### 7. 🔑 Custom Callback Hook
```javascript
const head = new TalkingHead(container, {
  update: (deltaTime) => {
    // Called every frame BEFORE rendering
    // Perfect for reading mesh positions → updating particles
  }
});
```

### 8. ✅ Gesture System
Hand gestures: handup, index, ok, thumbup, thumbdown, side, shrug
Animated emojis: 😀, 😢, 😠, etc.

---

## What We Can Reuse Directly

| Component | How to Use |
|-----------|------------|
| **Lip sync engine** | `head.speakAudio(audio)` with ElevenLabs data |
| **Blend shape driver** | Automatic from TalkingHead |
| **Mood/expressions** | `head.setMood('happy')` |
| **Idle animations** | Built-in, configurable |
| **Dynamic bones** | Hair physics (if we have rigged hair) |

---

## Integration Strategy for Particle Rendering

### Option A: avatarOnly + Particle Overlay

```javascript
// 1. Create our own scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(...);
const renderer = new THREE.WebGLRenderer();

// 2. Create TalkingHead in avatarOnly mode
const head = new TalkingHead(null, {
  avatarOnly: true,
  avatarOnlyCamera: camera,
  avatarOnlyScene: scene,
  update: onUpdate  // Our callback
});

// 3. Load avatar (mesh added to our scene)
await head.showAvatar({ url: './avatar.glb', ... });

// 4. Get the mesh for particle binding
const avatarMesh = scene.getObjectByName('Wolf3D_Head'); // or similar

// 5. Create particles bound to mesh vertices
createParticlesFromMesh(avatarMesh);

// 6. In update callback, sync particles to deformed vertices
function onUpdate(dt) {
  updateParticlePositionsFromMesh(avatarMesh);
}
```

### Option B: Use TalkingHead for Animation Only, Hide Mesh

```javascript
// Same as above, but:
avatarMesh.visible = false;  // Hide textured mesh
// Only show our particle system
```

---

## HeadAudio - Audio-Driven Lip Sync

https://github.com/met4citizen/HeadAudio

**What it does:** Real-time viseme detection from audio waveform
**Why useful:** No need for word timestamps - works with ANY audio

```javascript
// Audio worklet for lip sync from audio alone
const headAudio = new HeadAudio();
headAudio.on('viseme', (visemeId, weight) => {
  // Drive blend shapes directly
});
```

Could be useful if we want to support audio sources other than ElevenLabs.

---

## HeadTTS - Free TTS

https://github.com/met4citizen/HeadTTS

**What it does:** Browser-based TTS with Kokoro voices + viseme IDs
**Why useful:** No API costs, runs locally

If we want a free option that doesn't require ElevenLabs API key.

---

## Avatar Creation Notes (from TalkingHead docs)

### Avaturn (Recommended for Now)
- Free for non-commercial
- Has ARKit + Oculus blend shapes
- Type T2 avatars are TalkingHead-compatible
- Export as GLB

### MPFB (Blender)
- Free, open source
- Parametric control
- TalkingHead has dedicated add-on + docs
- https://github.com/met4citizen/TalkingHead/blob/main/blender/MPFB/MPFB.md

### Ready Player Me (Deprecated)
- Shutting down Jan 31, 2026
- Don't use for new development

---

## Example: Minimal Integration

```html
<script type="importmap">
{ "imports": {
  "three": "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js/+esm",
  "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/",
  "talkinghead": "https://cdn.jsdelivr.net/gh/met4citizen/TalkingHead@1.7/modules/talkinghead.mjs"
}}
</script>

<script type="module">
import { TalkingHead } from "talkinghead";
import * as THREE from "three";

// Our scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer();

// TalkingHead in avatarOnly mode
const head = new TalkingHead(null, {
  avatarOnly: true,
  avatarOnlyCamera: camera,
  avatarOnlyScene: scene,
  lipsyncModules: ['en'],
  update: (dt) => {
    // Access blend shape values here
    // Update particles
  }
});

// Load avatar
await head.showAvatar({
  url: './avatars/avaturn.glb',
  body: 'M',
  lipsyncLang: 'en'
});

// Speak with ElevenLabs audio
head.speakAudio({
  audio: pcmChunks,
  words: ['Hello', 'world'],
  wtimes: [0, 500],
  wdurations: [400, 500]
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
</script>
```

---

## Summary: What to Reuse

| Use | Don't Build |
|-----|-------------|
| TalkingHead lip sync | Own viseme interpolation |
| TalkingHead mood system | Own expression animations |
| TalkingHead idle animations | Own breathing/blinking |
| ElevenLabs integration | Different TTS integration |
| avatarOnly mode | Separate animation + render |

**Build ourselves:**
- Particle/voxel rendering (we have this)
- Plexus line connections
- Style switching UI
- Blend shape → particle position binding
