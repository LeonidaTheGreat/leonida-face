/**
 * GPU Skinning v2 - Using Three.js Bone Texture
 * 
 * Instead of Transform Feedback, we leverage Three.js's existing GPU skinning:
 * 1. SkinnedMesh already has boneTexture with bone matrices
 * 2. We pass skinIndex/skinWeight to particles
 * 3. Particle vertex shader does skinning calculation on GPU
 * 
 * This means: ZERO CPU skinning calls per frame!
 */

// ============================================================
// STEP 1: When creating particles, copy skinning data from mesh
// ============================================================

function createGPUSkinnedParticleAttributes(skinnedMesh, particleBaseData, geometry) {
    const meshGeom = skinnedMesh.geometry;
    
    // Check if mesh has skinning data
    if (!meshGeom.attributes.skinIndex || !meshGeom.attributes.skinWeight) {
        console.warn('Mesh has no skinning attributes - GPU skinning disabled');
        return false;
    }
    
    const meshSkinIndex = meshGeom.attributes.skinIndex;
    const meshSkinWeight = meshGeom.attributes.skinWeight;
    const meshPositions = meshGeom.attributes.position;
    
    const particleCount = particleBaseData.length;
    
    // Create arrays for particle skinning data
    // skinIndex: 4 bone indices per particle (vec4)
    // skinWeight: 4 bone weights per particle (vec4)
    // restPosition: original mesh vertex position (vec3)
    const skinIndices = new Float32Array(particleCount * 4);
    const skinWeights = new Float32Array(particleCount * 4);
    const restPositions = new Float32Array(particleCount * 3);
    
    // For edge particles, we also need neighbor data
    const neighborSkinIndices = new Float32Array(particleCount * 4);
    const neighborSkinWeights = new Float32Array(particleCount * 4);
    const neighborRestPositions = new Float32Array(particleCount * 3);
    const edgeFactors = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
        const p = particleBaseData[i];
        const vi = p.vertexIndex;
        
        // Copy skin index (4 values)
        skinIndices[i * 4 + 0] = meshSkinIndex.getX(vi);
        skinIndices[i * 4 + 1] = meshSkinIndex.getY(vi);
        skinIndices[i * 4 + 2] = meshSkinIndex.getZ(vi);
        skinIndices[i * 4 + 3] = meshSkinIndex.getW(vi);
        
        // Copy skin weight (4 values)
        skinWeights[i * 4 + 0] = meshSkinWeight.getX(vi);
        skinWeights[i * 4 + 1] = meshSkinWeight.getY(vi);
        skinWeights[i * 4 + 2] = meshSkinWeight.getZ(vi);
        skinWeights[i * 4 + 3] = meshSkinWeight.getW(vi);
        
        // Copy rest position
        restPositions[i * 3 + 0] = meshPositions.getX(vi);
        restPositions[i * 3 + 1] = meshPositions.getY(vi);
        restPositions[i * 3 + 2] = meshPositions.getZ(vi);
        
        // Handle edge interpolation
        const ni = p.neighborIndex >= 0 ? p.neighborIndex : vi;
        edgeFactors[i] = p.edgeT || 0;
        
        neighborSkinIndices[i * 4 + 0] = meshSkinIndex.getX(ni);
        neighborSkinIndices[i * 4 + 1] = meshSkinIndex.getY(ni);
        neighborSkinIndices[i * 4 + 2] = meshSkinIndex.getZ(ni);
        neighborSkinIndices[i * 4 + 3] = meshSkinIndex.getW(ni);
        
        neighborSkinWeights[i * 4 + 0] = meshSkinWeight.getX(ni);
        neighborSkinWeights[i * 4 + 1] = meshSkinWeight.getY(ni);
        neighborSkinWeights[i * 4 + 2] = meshSkinWeight.getZ(ni);
        neighborSkinWeights[i * 4 + 3] = meshSkinWeight.getW(ni);
        
        neighborRestPositions[i * 3 + 0] = meshPositions.getX(ni);
        neighborRestPositions[i * 3 + 1] = meshPositions.getY(ni);
        neighborRestPositions[i * 3 + 2] = meshPositions.getZ(ni);
    }
    
    // Add attributes to geometry
    geometry.setAttribute('skinIndex', new THREE.BufferAttribute(skinIndices, 4));
    geometry.setAttribute('skinWeight', new THREE.BufferAttribute(skinWeights, 4));
    geometry.setAttribute('restPosition', new THREE.BufferAttribute(restPositions, 3));
    geometry.setAttribute('neighborSkinIndex', new THREE.BufferAttribute(neighborSkinIndices, 4));
    geometry.setAttribute('neighborSkinWeight', new THREE.BufferAttribute(neighborSkinWeights, 4));
    geometry.setAttribute('neighborRestPosition', new THREE.BufferAttribute(neighborRestPositions, 3));
    geometry.setAttribute('edgeFactor', new THREE.BufferAttribute(edgeFactors, 1));
    
    console.log(`GPU Skinning: Added skinning attributes for ${particleCount} particles`);
    return true;
}

// ============================================================
// STEP 2: Vertex shader with GPU skinning
// ============================================================

const GPU_SKINNING_VERTEX_SHADER = `
    // Particle attributes
    attribute float size;
    attribute vec3 scatteredPosition;
    attribute vec4 seeds;
    attribute vec3 drift;
    
    // GPU Skinning attributes (per-particle copy of mesh skinning data)
    attribute vec4 skinIndex;
    attribute vec4 skinWeight;
    attribute vec3 restPosition;
    attribute vec4 neighborSkinIndex;
    attribute vec4 neighborSkinWeight;
    attribute vec3 neighborRestPosition;
    attribute float edgeFactor;
    
    // Bone matrices from SkinnedMesh
    uniform sampler2D boneTexture;
    uniform int boneCount;
    uniform mat4 bindMatrix;
    uniform mat4 bindMatrixInverse;
    
    // Normalization params
    uniform vec3 normCenter;
    uniform float normScale;
    
    // Animation control
    uniform bool useGPUSkinning;
    uniform vec3 constellationPositionFallback; // For non-skinned models
    
    // Original uniforms (copy all from existing shader)
    uniform float time;
    uniform float scatter;
    uniform float effectStart;
    uniform float dissipation;
    uniform float floatAway;
    uniform float floatDir;
    uniform int falloffCurve;
    uniform int reference;
    uniform vec3 cameraDir;
    uniform vec3 cameraPos;
    uniform vec2 modelBoundsZ;
    uniform float surfaceFloat;
    uniform float surfaceSpeed;
    uniform float assemblyProgress;
    uniform int assemblyDirection;
    uniform float assemblySpread;
    uniform float assemblyDirRandom;
    uniform float assemblyTurbulence;
    uniform float assemblyBackDelay;
    uniform float assemblyFrontDelay;
    uniform float assemblyRandomTime;
    uniform float assemblyFalloff;
    uniform int assemblyFadeEasing;
    uniform float assemblyDistance;
    uniform float assemblyDurationSpread;
    uniform int assemblyEasing;
    uniform float assemblyBouncePercent;
    uniform float assemblyBounceStrength;
    uniform float isDisassembling;
    
    varying float vAlpha;
    
    // Read bone matrix from texture (same as Three.js internal)
    mat4 getBoneMatrix(float boneIndex) {
        float size = float(textureSize(boneTexture, 0).x);
        float j = boneIndex * 4.0;
        float x = mod(j, size);
        float y = floor(j / size);
        
        float dx = 1.0 / size;
        float dy = 1.0 / size;
        
        y = dy * (y + 0.5);
        
        vec4 v1 = texture2D(boneTexture, vec2(dx * (x + 0.5), y));
        vec4 v2 = texture2D(boneTexture, vec2(dx * (x + 1.5), y));
        vec4 v3 = texture2D(boneTexture, vec2(dx * (x + 2.5), y));
        vec4 v4 = texture2D(boneTexture, vec2(dx * (x + 3.5), y));
        
        return mat4(v1, v2, v3, v4);
    }
    
    // Apply bone transformation to a vertex
    vec3 applyBoneTransformGPU(vec3 pos, vec4 skinIdx, vec4 skinWgt) {
        mat4 boneMatX = getBoneMatrix(skinIdx.x);
        mat4 boneMatY = getBoneMatrix(skinIdx.y);
        mat4 boneMatZ = getBoneMatrix(skinIdx.z);
        mat4 boneMatW = getBoneMatrix(skinIdx.w);
        
        vec4 skinVertex = bindMatrix * vec4(pos, 1.0);
        
        vec4 skinned = vec4(0.0);
        skinned += boneMatX * skinVertex * skinWgt.x;
        skinned += boneMatY * skinVertex * skinWgt.y;
        skinned += boneMatZ * skinVertex * skinWgt.z;
        skinned += boneMatW * skinVertex * skinWgt.w;
        
        skinned = bindMatrixInverse * skinned;
        
        return skinned.xyz;
    }
    
    float applyFalloff(float t, int curve) {
        if (curve == 0) return t;
        if (curve == 1) return t * t;
        if (curve == 2) return t * t * t;
        if (curve == 3) return 1.0 - exp(-t * 3.0);
        if (curve == 4) return log(1.0 + t * 9.0) / log(10.0);
        return t;
    }
    
    void main() {
        vec3 constellationPosition;
        
        if (useGPUSkinning) {
            // GPU skinning: transform rest position using bone matrices
            vec3 pos1 = applyBoneTransformGPU(restPosition, skinIndex, skinWeight);
            vec3 pos2 = applyBoneTransformGPU(neighborRestPosition, neighborSkinIndex, neighborSkinWeight);
            
            // Interpolate for edge particles
            vec3 skinnedPos = mix(pos1, pos2, edgeFactor);
            
            // Apply normalization
            constellationPosition = (skinnedPos - normCenter) * normScale;
        } else {
            // Fallback: use constellationPosition attribute (set by CPU)
            constellationPosition = position;
        }
        
        // Blend with scattered position
        float scatterAmount = scatter * 0.5;
        vec3 basePosition = mix(constellationPosition, scatteredPosition, scatterAmount);
        vec3 pos = basePosition;
        
        // === Surface floating ===
        float t1 = time * surfaceSpeed + seeds.x;
        float t2 = time * surfaceSpeed * 0.7 + seeds.y;
        float t3 = time * surfaceSpeed * 0.5 + seeds.x * 2.0;
        
        vec3 radial = normalize(basePosition);
        vec3 tangent1 = normalize(cross(radial, vec3(0.0, 1.0, 0.0)));
        vec3 tangent2 = normalize(cross(radial, tangent1));
        
        float floatX = sin(t1) * surfaceFloat * 0.05;
        float floatY = sin(t2) * surfaceFloat * 0.03;
        float floatZ = sin(t3) * surfaceFloat * 0.02;
        
        pos += tangent1 * floatX + tangent2 * floatY;
        pos += radial * floatZ * 0.3;
        
        // === Depth calculation ===
        vec3 worldBasePos = (modelMatrix * vec4(basePosition, 1.0)).xyz;
        
        float depth;
        if (reference == 1) {
            vec3 toPoint = normalize(worldBasePos);
            depth = -dot(toPoint, cameraDir);
            depth = (depth + 1.0) / 2.0;
        } else {
            depth = (basePosition.z + 1.0) / 2.0;
        }
        
        float safeThreshold = 1.0 - effectStart;
        float normalizedBack = 0.0;
        
        if (depth < safeThreshold) {
            normalizedBack = (safeThreshold - depth) / safeThreshold;
            normalizedBack = clamp(normalizedBack, 0.0, 1.0);
        }
        
        float falloff = applyFalloff(normalizedBack, falloffCurve);
        
        // Float away
        float floatAmount = falloff * floatAway;
        float anim = sin(time * seeds.z + seeds.x) * 0.5 + 0.5;
        
        mat3 normalMat = mat3(modelMatrix);
        mat3 invNormalMat = inverse(normalMat);
        vec3 localCameraDir = normalize(invNormalMat * cameraDir);
        vec3 awayDir = localCameraDir;
        
        vec3 filteredDrift = drift;
        vec3 towardCamera = -localCameraDir;
        float towardComponent = dot(drift, towardCamera);
        if (towardComponent > 0.0) {
            filteredDrift -= towardCamera * towardComponent;
        }
        
        float driftMag = length(drift);
        vec3 floatDirection = mix(filteredDrift, awayDir * driftMag, floatDir);
        
        pos += floatDirection * floatAmount * (0.5 + anim * 0.5);
        pos.y += sin(time * 0.5 + seeds.y) * 0.03 * falloff;
        
        // Dissipation alpha
        float dissipationFactor = clamp(normalizedBack * dissipation / 100.0, 0.0, 1.0);
        vAlpha = 1.0 - dissipationFactor;
        
        // Output
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = size * (300.0 / -mvPosition.z);
    }
`;

// ============================================================
// STEP 3: Setup function to connect bone texture
// ============================================================

function setupGPUSkinning(pointsMesh, skinnedMesh, skeletonNormParams) {
    if (!skinnedMesh || !skinnedMesh.skeleton) {
        console.warn('No skeleton found - GPU skinning disabled');
        return false;
    }
    
    const skeleton = skinnedMesh.skeleton;
    
    // Ensure bone texture exists
    if (!skeleton.boneTexture) {
        skeleton.computeBoneTexture();
    }
    
    const material = pointsMesh.material;
    
    // Add GPU skinning uniforms
    material.uniforms.boneTexture = { value: skeleton.boneTexture };
    material.uniforms.boneCount = { value: skeleton.bones.length };
    material.uniforms.bindMatrix = { value: skinnedMesh.bindMatrix };
    material.uniforms.bindMatrixInverse = { value: skinnedMesh.bindMatrixInverse };
    material.uniforms.normCenter = { value: new THREE.Vector3(skeletonNormParams.cx, skeletonNormParams.cy, skeletonNormParams.cz) };
    material.uniforms.normScale = { value: skeletonNormParams.scale };
    material.uniforms.useGPUSkinning = { value: true };
    
    console.log('GPU Skinning setup complete:', {
        boneCount: skeleton.bones.length,
        boneTextureSize: skeleton.boneTexture.image.width
    });
    
    return true;
}

// ============================================================
// STEP 4: Updated animate() - just update skeleton, no CPU loop!
// ============================================================

/*
In animate(), replace the particle update with:

if (mixer) {
    mixer.update(delta);
    
    // Just update skeleton - GPU does the rest!
    if (skinnedMesh && skinnedMesh.skeleton) {
        skinnedMesh.skeleton.update();
        // Bone texture is automatically updated by Three.js
    }
}

// Remove the call to updateParticlesFromSkeleton() entirely!
*/

// ============================================================
// INTEGRATION CHECKLIST
// ============================================================

/*
1. Replace vertexShader string with GPU_SKINNING_VERTEX_SHADER

2. In particle creation (after creating geometry), call:
   createGPUSkinnedParticleAttributes(skinnedMesh, particleBaseData, geometry);

3. After creating pointsMesh and loading model:
   setupGPUSkinning(pointsMesh, skinnedMesh, skeletonNormParams);

4. In animate():
   - Keep: mixer.update(delta)
   - Add: skinnedMesh.skeleton.update()
   - REMOVE: updateParticlesFromSkeleton() call

5. Add new uniforms to ShaderMaterial:
   boneTexture: { value: null },
   boneCount: { value: 0 },
   bindMatrix: { value: new THREE.Matrix4() },
   bindMatrixInverse: { value: new THREE.Matrix4() },
   normCenter: { value: new THREE.Vector3() },
   normScale: { value: 1.0 },
   useGPUSkinning: { value: false },

PERFORMANCE:
- OLD: 70,000 CPU applyBoneTransform() calls per frame
- NEW: 0 CPU calls, all skinning on GPU
- Expected: 10-20x faster for skeleton animation
*/

console.log('GPU Skinning v2 loaded - see integration checklist');
