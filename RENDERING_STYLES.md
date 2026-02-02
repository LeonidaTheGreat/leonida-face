# Rendering Styles Analysis & Implementation Plan

## Reference Image Analysis

The image shows two distinct visual elements:

### Right Side: Voxelized Head
- **Grid-aligned cubes** placed on the mesh surface
- Cubes are axis-aligned (not rotated with surface normal)
- Dense packing with slight gaps
- Uniform size cubes
- Color gradient (darker blue → lighter blue)

### Left Side: Plexus Dissolution
- Cubes break apart from the solid form
- **Connecting lines** (edges) between nearby cubes
- Lines have varying opacity (fade with distance)
- Cubes drift outward while maintaining some connections
- Creates "data/digital" aesthetic

---

## Current Stipple-Head Implementation

### What It Does

```
Mesh Vertices → Edge Map → Particle Positions
         ↓
    Particles placed:
    - ON mesh edges (constellation mode, scatter=0)
    - OR randomly on surface (scatter=100)
```

### Key Functions

| Function | Purpose |
|----------|---------|
| `processVertices()` | Extract vertices and edge adjacency |
| `initParticles()` | Generate particle positions from vertices |
| `createMesh()` | Build THREE.Points geometry with shader |

### How "Constellation" Works Currently

```javascript
// For each vertex, find neighbors (connected by mesh edges)
vertexEdges[i] = [neighborIdx1, neighborIdx2, ...]

// Particle position = interpolated point along edge
const neighbor = allVertices[neighborIdx];
const t = Math.random(); // 0-1 along edge
cx = v.x + (neighbor.x - v.x) * t;
cy = v.y + (neighbor.y - v.y) * t;
```

**Result:** Particles sit ON mesh edges, but there are NO VISIBLE LINES connecting them.

---

## What's Missing for Reference Image Effect

| Feature | Current Status | Needed |
|---------|----------------|--------|
| Voxel/cube rendering | ❌ Only point sprites | ✅ Instanced cubes |
| Grid alignment | ❌ N/A | ✅ Snap to 3D grid |
| Connecting lines | ❌ None | ✅ Line geometry |
| Line opacity by distance | ❌ N/A | ✅ Shader uniform |
| Dissolution animation | ✅ Have disassemble | ✅ Need line breaking |

---

## Proposed Style Dropdown Options

```
┌─────────────────────────────────────┐
│ Render Style: [▼]                   │
│  • Particles (current)              │
│  • Voxels                           │
│  • Voxels + Plexus Lines            │
│  • Particles + Plexus Lines         │
└─────────────────────────────────────┘
```

---

## Implementation Details

### Style 1: Particles (Current)
- **Geometry:** `THREE.Points` with custom shader
- **Shape:** Circle/square sprite per particle
- **Position:** Surface sampling or edge interpolation
- **Lines:** None

### Style 2: Voxels (Grid-Aligned Cubes)

**Approach:** Instanced mesh rendering

```javascript
// 1. Define voxel grid resolution
const VOXEL_SIZE = 0.05; // World units

// 2. For each mesh vertex, snap to nearest grid cell
function snapToGrid(pos) {
    return {
        x: Math.round(pos.x / VOXEL_SIZE) * VOXEL_SIZE,
        y: Math.round(pos.y / VOXEL_SIZE) * VOXEL_SIZE,
        z: Math.round(pos.z / VOXEL_SIZE) * VOXEL_SIZE
    };
}

// 3. Deduplicate (multiple vertices may snap to same cell)
const occupiedCells = new Set();
allVertices.forEach(v => {
    const snapped = snapToGrid(v);
    const key = `${snapped.x},${snapped.y},${snapped.z}`;
    occupiedCells.add(key);
});

// 4. Create instanced cubes
const cubeGeo = new THREE.BoxGeometry(VOXEL_SIZE * 0.9, VOXEL_SIZE * 0.9, VOXEL_SIZE * 0.9);
const cubeMat = new THREE.MeshStandardMaterial({ color: 0x4488ff });
const instancedMesh = new THREE.InstancedMesh(cubeGeo, cubeMat, occupiedCells.size);

// 5. Position each instance
let i = 0;
const matrix = new THREE.Matrix4();
occupiedCells.forEach(key => {
    const [x, y, z] = key.split(',').map(Number);
    matrix.setPosition(x, y, z);
    instancedMesh.setMatrixAt(i++, matrix);
});
```

**For lip sync:** Each voxel stores which mesh vertex it came from. When blend shapes deform the mesh, recalculate the vertex position and re-snap to grid.

### Style 3: Plexus Lines (Connections)

**Approach:** Dynamic line geometry updated each frame

```javascript
// 1. For each particle/voxel, find neighbors within threshold distance
const MAX_LINK_DISTANCE = 0.15;
const connections = [];

for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
        const dist = particles[i].distanceTo(particles[j]);
        if (dist < MAX_LINK_DISTANCE) {
            connections.push({ from: i, to: j, dist });
        }
    }
}

// 2. Build line geometry
const linePositions = new Float32Array(connections.length * 6); // 2 vertices per line
const lineAlphas = new Float32Array(connections.length * 2);

connections.forEach((conn, idx) => {
    const p1 = particles[conn.from];
    const p2 = particles[conn.to];
    
    linePositions[idx * 6 + 0] = p1.x;
    linePositions[idx * 6 + 1] = p1.y;
    linePositions[idx * 6 + 2] = p1.z;
    linePositions[idx * 6 + 3] = p2.x;
    linePositions[idx * 6 + 4] = p2.y;
    linePositions[idx * 6 + 5] = p2.z;
    
    // Alpha fades with distance
    const alpha = 1.0 - (conn.dist / MAX_LINK_DISTANCE);
    lineAlphas[idx * 2 + 0] = alpha;
    lineAlphas[idx * 2 + 1] = alpha;
});

// 3. Create line material with vertex colors/alpha
const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending
});

const lineGeometry = new THREE.BufferGeometry();
lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
```

**Optimization:** Don't check all pairs (O(n²)). Use spatial hash or octree:

```javascript
// Spatial hash for O(n) neighbor lookup
const CELL_SIZE = MAX_LINK_DISTANCE;
const spatialHash = new Map();

particles.forEach((p, i) => {
    const cellX = Math.floor(p.x / CELL_SIZE);
    const cellY = Math.floor(p.y / CELL_SIZE);
    const cellZ = Math.floor(p.z / CELL_SIZE);
    const key = `${cellX},${cellY},${cellZ}`;
    if (!spatialHash.has(key)) spatialHash.set(key, []);
    spatialHash.get(key).push(i);
});

// Only check neighboring cells
function getNeighborCells(x, y, z) {
    const cells = [];
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            for (let dz = -1; dz <= 1; dz++) {
                cells.push(`${x+dx},${y+dy},${z+dz}`);
            }
        }
    }
    return cells;
}
```

---

## Model Requirements for Lip Sync

For ANY rendering style to support lip sync, the source model needs:

| Requirement | Why |
|-------------|-----|
| **Blend shapes / Morph targets** | Deform mesh vertices for visemes |
| **Oculus Visemes (15)** | Standard lip positions for TTS |
| **ARKit Blend Shapes (52)** | Optional, for full face expressions |

### How Blend Shapes Work

```
Base Mesh Vertices: [v0, v1, v2, ...]
                          ↓
Viseme "AA" deltas:  [Δv0, Δv1, Δv2, ...]
                          ↓
Final Position = base + (delta * weight)
```

When `viseme_aa` has weight 0.8:
```javascript
mesh.morphTargetInfluences[visemeIndex.aa] = 0.8;
// Three.js automatically computes: finalPos = base + delta * 0.8
```

### Connecting Blend Shapes to Particles/Voxels

**Option A: CPU Update (Simple, Slower)**
```javascript
function updateParticlesFromMesh() {
    // 1. Force mesh to compute morph target positions
    mesh.updateMorphTargets();
    
    // 2. Read deformed vertex positions
    const posAttr = mesh.geometry.attributes.position;
    
    // 3. Update particle positions
    particles.forEach((p, i) => {
        p.x = posAttr.getX(p.vertexIndex);
        p.y = posAttr.getY(p.vertexIndex);
        p.z = posAttr.getZ(p.vertexIndex);
    });
}
```

**Option B: GPU Update (Complex, Faster)**
- Pass morph target textures to particle shader
- Compute deformed position in vertex shader
- Current stipple-head already does this for skeletal animation

---

## Reconciliation with Current Code

### Changes Needed to stipple-head-gpu.html

1. **Add style dropdown to UI**
```html
<div class="slider-row">
    <label>Render Style</label>
    <select id="renderStyle">
        <option value="particles">Particles</option>
        <option value="voxels">Voxels</option>
        <option value="voxels-plexus">Voxels + Lines</option>
        <option value="particles-plexus">Particles + Lines</option>
    </select>
</div>
```

2. **Add voxel grid settings**
```html
<div class="slider-row" id="voxelSettings" style="display:none">
    <label>Voxel Size</label>
    <input type="range" id="voxelSize" min="1" max="20" value="5">
</div>
```

3. **Add plexus line settings**
```html
<div class="slider-row" id="plexusSettings" style="display:none">
    <label>Max Link Distance</label>
    <input type="range" id="maxLinkDist" min="1" max="50" value="15">
    <label>Line Opacity</label>
    <input type="range" id="lineOpacity" min="0" max="100" value="50">
</div>
```

4. **Modify createMesh() to branch by style**
```javascript
function createMesh() {
    const style = document.getElementById('renderStyle').value;
    
    switch (style) {
        case 'particles':
            createParticleMesh(); // Current code
            break;
        case 'voxels':
            createVoxelMesh();
            break;
        case 'voxels-plexus':
            createVoxelMesh();
            createPlexusLines();
            break;
        case 'particles-plexus':
            createParticleMesh();
            createPlexusLines();
            break;
    }
}
```

5. **Add line update to animation loop**
```javascript
function animate() {
    // ... existing particle update ...
    
    if (plexusLines && settings.renderStyle.includes('plexus')) {
        updatePlexusLines();
    }
}
```

---

## Performance Considerations

| Style | Particles | Draw Calls | GPU Load |
|-------|-----------|------------|----------|
| Particles | 50k points | 1 | Low |
| Voxels | 10k instances | 1 | Medium |
| + Plexus Lines | +50k line segments | 2 | High |

**Recommendations:**
- Limit voxel count (grid snapping naturally reduces)
- Limit max connections per particle (e.g., 6 nearest)
- Use LOD: fewer lines when camera far
- Consider GPU line shader instead of CPU updates

---

## Summary: What to Build

### Phase 1: Voxel Style
1. Add voxel grid snapping
2. Create instanced cube mesh
3. Add size/gap controls
4. Test with existing model

### Phase 2: Plexus Lines  
1. Implement spatial hash for neighbor finding
2. Create line segment geometry
3. Add distance-based alpha
4. Update lines each frame

### Phase 3: Lip Sync Integration
1. Store vertex→voxel mapping
2. On blend shape change, recompute positions
3. Re-snap to grid / update particle positions
4. Update plexus line endpoints

### Phase 4: TalkingHead Integration
1. Load TalkingHead-compatible model (with blend shapes)
2. Drive blend shapes from TalkingHead viseme system
3. Render with chosen style (voxel/particle + lines)
