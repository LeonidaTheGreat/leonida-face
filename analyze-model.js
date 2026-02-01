const { NodeIO } = require('@gltf-transform/core');
const { ALL_EXTENSIONS } = require('@gltf-transform/extensions');
const path = require('path');

async function analyzeModel(filepath) {
    const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
    const doc = await io.read(filepath);
    
    const root = doc.getRoot();
    const name = path.basename(filepath);
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`MODEL: ${name}`);
    console.log('='.repeat(60));
    
    // Meshes
    const meshes = root.listMeshes();
    let totalVertices = 0;
    let totalTriangles = 0;
    meshes.forEach(mesh => {
        mesh.listPrimitives().forEach(prim => {
            const pos = prim.getAttribute('POSITION');
            if (pos) totalVertices += pos.getCount();
            const indices = prim.getIndices();
            if (indices) totalTriangles += indices.getCount() / 3;
        });
    });
    console.log(`\nMeshes: ${meshes.length}`);
    console.log(`Vertices: ${totalVertices.toLocaleString()}`);
    console.log(`Triangles: ${totalTriangles.toLocaleString()}`);
    
    // Skins (rigging)
    const skins = root.listSkins();
    console.log(`\nSkins (rigs): ${skins.length}`);
    if (skins.length > 0) {
        skins.forEach((skin, i) => {
            const joints = skin.listJoints();
            console.log(`  Skin ${i}: ${joints.length} bones`);
            // List first few bone names
            joints.slice(0, 15).forEach(joint => {
                console.log(`    - ${joint.getName()}`);
            });
            if (joints.length > 15) console.log(`    ... and ${joints.length - 15} more`);
        });
    }
    
    // Animations
    const animations = root.listAnimations();
    console.log(`\nAnimations: ${animations.length}`);
    if (animations.length > 0) {
        animations.forEach(anim => {
            const channels = anim.listChannels();
            const samplers = anim.listSamplers();
            let duration = 0;
            samplers.forEach(s => {
                const input = s.getInput();
                if (input) {
                    const times = input.getArray();
                    if (times && times.length > 0) {
                        duration = Math.max(duration, times[times.length - 1]);
                    }
                }
            });
            console.log(`  - "${anim.getName() || 'unnamed'}": ${channels.length} channels, ${duration.toFixed(2)}s`);
        });
    }
    
    // Morph targets (blend shapes)
    let morphTargetCount = 0;
    let morphNames = [];
    meshes.forEach(mesh => {
        mesh.listPrimitives().forEach(prim => {
            const targets = prim.listTargets();
            morphTargetCount += targets.length;
        });
        const names = mesh.getExtras()?.targetNames || [];
        morphNames = morphNames.concat(names);
    });
    console.log(`\nMorph targets (blend shapes): ${morphTargetCount}`);
    if (morphNames.length > 0) {
        console.log('  Names:', morphNames.slice(0, 10).join(', '));
        if (morphNames.length > 10) console.log(`  ... and ${morphNames.length - 10} more`);
    }
    
    // Nodes hierarchy (check for named body parts)
    const nodes = root.listNodes();
    console.log(`\nNodes: ${nodes.length}`);
    const bodyParts = nodes.filter(n => {
        const name = (n.getName() || '').toLowerCase();
        return name.includes('head') || name.includes('neck') || name.includes('spine') || 
               name.includes('arm') || name.includes('hand') || name.includes('leg') ||
               name.includes('foot') || name.includes('hips') || name.includes('eye') ||
               name.includes('jaw') || name.includes('mouth');
    });
    if (bodyParts.length > 0) {
        console.log(`Body part nodes found:`);
        bodyParts.slice(0, 20).forEach(n => console.log(`  - ${n.getName()}`));
        if (bodyParts.length > 20) console.log(`  ... and ${bodyParts.length - 20} more`);
    }
    
    return { name, vertices: totalVertices, skins: skins.length, animations: animations.length, morphTargets: morphTargetCount };
}

async function main() {
    const models = [
        'models/meshy_merged_animations.glb',
        'models/meshy_character.glb'
    ];
    
    console.log('GLTF Model Analysis - New Biped Models');
    console.log('Checking for: meshes, rigging (skins), animations, morph targets\n');
    
    const results = [];
    for (const model of models) {
        try {
            const result = await analyzeModel(model);
            results.push(result);
        } catch (err) {
            console.error(`Error analyzing ${model}: ${err.message}`);
        }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY');
    console.log('='.repeat(60));
    console.log('\nModel                           Vertices    Rigged  Anims  BlendShapes');
    console.log('-'.repeat(75));
    results.forEach(r => {
        console.log(`${r.name.padEnd(30)} ${r.vertices.toLocaleString().padStart(10)}    ${r.skins > 0 ? 'YES' : 'NO '}     ${r.animations.toString().padStart(3)}      ${r.morphTargets}`);
    });
}

main();
