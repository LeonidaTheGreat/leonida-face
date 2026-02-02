# Avatar Research for Leonida TalkingHead Implementation

**Research Date:** 2026-02-02
**Status:** Complete

---

## 🚨 CRITICAL: Ready Player Me Shutdown

**Ready Player Me is shutting down on January 31, 2026** after being acquired by Netflix. This was the primary avatar platform recommended by TalkingHead.

Source: [TechCrunch - Netflix acquires Ready Player Me](https://techcrunch.com/2025/12/19/netflix-acquires-gaming-avatar-maker-ready-player-me/)

**Impact:** We need alternative avatar creation solutions. The good news: TalkingHead supports multiple avatar sources, not just RPM.

---

## TalkingHead Avatar Requirements

For an avatar to work with TalkingHead.js, it needs:

### Mandatory Requirements
| Requirement | Details |
|-------------|---------|
| **Format** | GLB (glTF Binary) |
| **Rig** | Mixamo-compatible skeleton |
| **ARKit Blend Shapes** | 52 facial expressions for face tracking |
| **Oculus Visemes** | 15 lip-sync mouth positions |

### ARKit Blend Shapes (52 total)
```
eyeBlinkLeft, eyeBlinkRight, eyeLookDownLeft, eyeLookDownRight,
eyeLookInLeft, eyeLookInRight, eyeLookOutLeft, eyeLookOutRight,
eyeLookUpLeft, eyeLookUpRight, eyeSquintLeft, eyeSquintRight,
eyeWideLeft, eyeWideRight, jawForward, jawLeft, jawRight, jawOpen,
mouthClose, mouthFunnel, mouthPucker, mouthLeft, mouthRight,
mouthSmileLeft, mouthSmileRight, mouthFrownLeft, mouthFrownRight,
mouthDimpleLeft, mouthDimpleRight, mouthStretchLeft, mouthStretchRight,
mouthRollLower, mouthRollUpper, mouthShrugLower, mouthShrugUpper,
mouthPressLeft, mouthPressRight, mouthLowerDownLeft, mouthLowerDownRight,
mouthUpperUpLeft, mouthUpperUpRight, browDownLeft, browDownRight,
browInnerUp, browOuterUpLeft, browOuterUpRight,
cheekPuff, cheekSquintLeft, cheekSquintRight,
noseSneerLeft, noseSneerRight, tongueOut
```

### Oculus Visemes (15 total)
```
viseme_sil, viseme_PP, viseme_FF, viseme_TH, viseme_DD,
viseme_kk, viseme_CH, viseme_SS, viseme_nn, viseme_RR,
viseme_aa, viseme_E, viseme_I, viseme_O, viseme_U
```

### Additional Blend Shapes (auto-generated if missing)
```
mouthOpen, mouthSmile, eyesClosed, eyesLookUp, eyesLookDown
```

---

## Existing Models Analysis

**Location:** `/Users/clawdbot/clawd/leonida-face/models/`

### Models Present
- meshy_character.glb (11.6 MB)
- gothic.glb (22 MB)
- explorer.glb (19 MB)
- Several Biped characters with animations
- timeless_wanderer.glb (25 MB)
- post_apocalyptic.glb (16 MB)

### ❌ Assessment: NOT Compatible
**All existing models have NO blend shapes.** They are rigged for body animations only — no facial animation capability.

**To use these models with TalkingHead, you would need to:**
1. Import into Blender
2. Manually create all 52 ARKit blend shapes
3. Create all 15 Oculus visemes
4. Re-export as GLB

**Effort estimate:** 20-40+ hours per model with Blender expertise.

**Recommendation:** Start fresh with a platform that generates these automatically.

---

## Avatar Creation Options

### Option 1: MPFB (MakeHuman for Blender) ⭐ RECOMMENDED
**Cost:** Free & Open Source

**Pros:**
- Free, open source, no vendor lock-in
- TalkingHead has dedicated add-on and documentation
- Parametric control (age, gender, body shape)
- Large asset library (skins, clothes, hair)
- Permanent solution — won't shut down

**Cons:**
- Requires Blender knowledge
- More manual setup than cloud services
- Human-only (no anthropomorphic animals)

**Resources:**
- [MPFB Official Site](https://static.makehumancommunity.org/mpfb.html)
- [MPFB Blender Extension](https://extensions.blender.org/add-ons/mpfb/)
- [TalkingHead MPFB Guide](https://github.com/met4citizen/TalkingHead/blob/main/blender/MPFB/MPFB.md)

**Installation:**
```
1. Install Blender (free)
2. Edit → Preferences → Get Extensions → Install "MPFB"
3. Download TalkingHead add-on files from GitHub
4. Install TalkingHead add-on via Edit → Preferences → Add-ons → Install from Disk
```

---

### Option 2: Avaturn ⭐ GOOD ALTERNATIVE
**Cost:** Free for non-commercial use

**Pros:**
- Creates realistic avatars from photos
- Has ARKit blend shapes AND visemes built-in
- Mixamo-compatible rig
- Web-based — no software to install
- TalkingHead compatible (T2 avatars)
- Export as GLB

**Cons:**
- Commercial use requires notification/terms
- Human appearance only
- Depends on cloud service availability

**URL:** https://avaturn.me/

**Export Settings:**
- Use "T2" avatar type (supports face animation)
- Export as GLB with blend shapes enabled

---

### Option 3: Ready Player Me (DEPRECATED)
**Status:** ⚠️ Shutting down January 31, 2026

If you create an avatar before shutdown, save the GLB URL:
```
https://models.readyplayer.me/[YOUR_AVATAR_ID].glb?morphTargets=ARKit,Oculus+Visemes,mouthOpen,mouthSmile,eyesClosed,eyesLookUp,eyesLookDown&textureSizeLimit=1024&textureFormat=png
```

**Not recommended for new projects.**

---

### Option 4: Avatar SDK (MetaPerson Creator)
**Cost:** Commercial (paid plans)

**Pros:**
- Photo-to-avatar with high realism
- Has blend shapes

**Cons:**
- Paid service
- Human appearance only
- Requires Blender scripts for TalkingHead compatibility

**URL:** https://avatarsdk.com

---

### Option 5: Custom Blender + Faceit
**Cost:** Free (Blender) + ~$45 (Faceit add-on)

**Pros:**
- Total creative freedom
- Can create non-human characters (lion!)
- One-time purchase

**Cons:**
- Requires significant Blender expertise
- Time-intensive
- Manual rig setup

**Resources:**
- [Faceit Add-on](https://superhivemarket.com/products/faceit)
- [ARKitBlendshapeHelper (free)](https://github.com/elijah-atkins/ARKitBlendshapeHelper)
- [TalkingHead Faceit Guide](https://github.com/met4citizen/TalkingHead/blob/main/blender/Faceit/FACEIT.md)

---

## 🦁 Lion Theme Options

### Challenge
No pre-made lion avatar exists with TalkingHead-compatible blend shapes. Options:

### Option A: Stylized Human Avatar
**Approach:** Create a distinctive human avatar that evokes lion qualities
- Golden/amber color scheme
- Mane-like hairstyle
- Strong jawline
- Warm, confident expression

**Platforms:** MPFB, Avaturn

**Effort:** Low (1-2 hours)

### Option B: Anthropomorphic Lion Character
**Approach:** Full lion-headed humanoid character

**Would require:**
1. Find or create lion head 3D model
2. Model or adapt to humanoid body
3. Create Mixamo-compatible rig manually
4. Generate 52 ARKit + 15 Oculus blend shapes with Faceit
5. Export as GLB

**Resources:**
- [Sketchfab Lion Models](https://sketchfab.com/tags/lion) (various licenses)
- [RigModels Lion Search](https://rigmodels.com/?searchkeyword=lions)
- Faceit for blend shape generation

**Effort:** High (40-80+ hours, requires Blender expertise)

### Option C: AI-Generated Custom Character
**Approach:** Use AI tools to generate a unique lion character, then rig

**Tools:**
- Meshy (AI 3D generation) - for base model
- Blender + Faceit - for rigging and blend shapes

**Effort:** Medium-High (20-40 hours)

---

## Recommendations for Leonida

### 🏆 Recommended Path: Start Simple, Iterate

**Phase 1: Quick Start (This Week)**
1. Create avatar with **Avaturn** (T2 type)
   - Fast, free, works immediately
   - Use distinctive styling (golden tones, confident look)
2. Download GLB with blend shapes
3. Test with TalkingHead integration

**Phase 2: Custom Avatar (Later)**
1. Learn MPFB in Blender
2. Create personalized Leonida character
3. Full control, no service dependencies

**Phase 3: Lion Character (If Desired)**
1. Commission or create anthropomorphic lion model
2. Use Faceit for blend shapes
3. This is a significant project — only if lion appearance is critical

### Character Concept for Leonida
| Attribute | Suggestion |
|-----------|------------|
| **Style** | Professional, approachable |
| **Colors** | Golden/amber skin tones, warm palette |
| **Hair** | Mane-inspired — thick, styled, dignified |
| **Expression** | Confident, friendly, intelligent |
| **Clothing** | Smart casual or professional |
| **Age** | Mid-30s appearance |
| **Gender** | Male |

---

## Resources & Links

### TalkingHead
- [GitHub Repository](https://github.com/met4citizen/TalkingHead)
- [HeadTTS (Free TTS)](https://github.com/met4citizen/HeadTTS)
- [HeadAudio (Audio lip-sync)](https://github.com/met4citizen/HeadAudio)

### Avatar Creation
- [MPFB (Blender)](https://static.makehumancommunity.org/mpfb.html)
- [Avaturn](https://avaturn.me/)
- [Faceit (Blender Add-on)](https://superhivemarket.com/products/faceit)
- [ARKit Blendshapes Reference](https://arkit-face-blendshapes.com/)

### 3D Models
- [Sketchfab](https://sketchfab.com/) — 3D model marketplace
- [Mixamo](https://www.mixamo.com/) — Free animations (Adobe)
- [Microsoft Rocketbox](https://github.com/microsoft/Microsoft-Rocketbox) — Free characters (MIT)

### Blender Learning
- [Blender Official](https://www.blender.org/)
- [Blender Manual](https://docs.blender.org/manual/en/latest/)

---

## Next Steps

1. **Immediate:** Create Avaturn avatar for testing
2. **This week:** Integrate with TalkingHead in leonida-face project
3. **Later:** Explore MPFB for permanent, customizable avatar
4. **Optional:** If lion character is priority, plan Blender/Faceit workflow

---

*Document created by research subagent for Leonida Face project.*
