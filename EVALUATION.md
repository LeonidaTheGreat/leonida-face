# Avatar Quality Evaluation Framework

## Reference Standard
- **Target:** Genshin Impact / Final Fantasy idle animation quality
- **Reference clips to study:**
  - Genshin character idle animations
  - FF16 character close-ups
  - High-quality VTuber avatars

## Acceptance Criteria

### 1. Animation Smoothness (Weight: HIGH)
| Score | Description |
|-------|-------------|
| 1 | Jerky, robotic, obvious keyframes |
| 2 | Stiff but not broken |
| 3 | Acceptable, some unnatural moments |
| 4 | Smooth, natural flow |
| 5 | Indistinguishable from commercial quality |

**Test:** Watch 10 seconds of idle. Any jerky motion = fail.

### 2. Pose & Posture (Weight: HIGH)
| Score | Description |
|-------|-------------|
| 1 | T-pose or broken |
| 2 | Arms stiff/unnatural |
| 3 | Basic pose, lacks personality |
| 4 | Natural relaxed pose |
| 5 | Dynamic pose with character |

**Test:** Screenshot. Does it look like a character at rest or a mannequin?

### 3. Breathing (Weight: MEDIUM)
| Score | Description |
|-------|-------------|
| 1 | None visible |
| 2 | Barely perceptible |
| 3 | Visible but mechanical |
| 4 | Natural rhythm |
| 5 | Subtle, affects whole body naturally |

**Test:** Watch chest/shoulder area for 5 seconds.

### 4. Weight & Momentum (Weight: HIGH)
| Score | Description |
|-------|-------------|
| 1 | Static, no weight shift |
| 2 | Minimal movement |
| 3 | Some sway, feels floaty |
| 4 | Proper weight, grounded feel |
| 5 | Realistic momentum, follow-through |

**Test:** Does the character feel like they have mass?

### 5. Head & Eye Movement (Weight: MEDIUM)
| Score | Description |
|-------|-------------|
| 1 | Frozen stare |
| 2 | Mechanical movement |
| 3 | Moves but predictable |
| 4 | Natural looking around |
| 5 | Expressive, personality in gaze |

**Test:** Does the character seem aware of their environment?

### 6. Expressions (Weight: MEDIUM)
| Score | Description |
|-------|-------------|
| 1 | No expressions |
| 2 | Expressions exist but robotic |
| 3 | Basic mood changes work |
| 4 | Smooth transitions, contextual |
| 5 | Subtle micro-expressions, lifelike |

**Test:** Trigger happy/sad/angry. Do transitions feel natural?

### 7. Visual Polish (Weight: MEDIUM)
| Score | Description |
|-------|-------------|
| 1 | Broken/ugly |
| 2 | Basic, no effects |
| 3 | Decent lighting |
| 4 | Good lighting, some effects |
| 5 | Particle effects, rim lighting, polished |

**Test:** Does it look like a finished product or a prototype?

### 8. Voice & Lip Sync (Weight: HIGH)
| Score | Description |
|-------|-------------|
| 1 | No voice or broken |
| 2 | Robotic browser TTS |
| 3 | Better TTS, basic lip sync |
| 4 | Natural voice, good lip sync |
| 5 | Perfect sync, expressive delivery |

**Test:** Play test voice. Does mouth match audio?

### 9. Performance (Weight: LOW)
| Score | Description |
|-------|-------------|
| 1 | <30 FPS, laggy |
| 2 | 30-40 FPS |
| 3 | 40-50 FPS |
| 4 | 50-60 FPS |
| 5 | Solid 60 FPS |

**Test:** Check browser dev tools performance tab.

---

## Minimum Passing Scores
- **HIGH weight items:** Must be ≥ 4
- **MEDIUM weight items:** Must be ≥ 3
- **LOW weight items:** Must be ≥ 2

## Evaluation Log Template

```markdown
### Evaluation [DATE TIME]
Commit: [hash]
URL: [live url]

| Criterion | Score | Notes |
|-----------|-------|-------|
| Animation Smoothness | /5 | |
| Pose & Posture | /5 | |
| Breathing | /5 | |
| Weight & Momentum | /5 | |
| Head & Eye Movement | /5 | |
| Expressions | /5 | |
| Visual Polish | /5 | |
| Voice & Lip Sync | /5 | |
| Performance | /5 | |

**Highest Priority Fix:** [what to fix next]
**Action:** [what will be changed]
```

---

## Self-Iteration Loop

```
while not all_criteria_pass:
    1. Build/modify code
    2. Deploy (git push)
    3. Wait for GitHub Pages (30s)
    4. Screenshot with browser tool
    5. Score each criterion
    6. Log evaluation
    7. Identify lowest HIGH-weight score
    8. Research fix (web search if needed)
    9. Implement fix
    10. Repeat
```
