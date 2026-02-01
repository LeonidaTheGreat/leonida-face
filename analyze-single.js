import { NodeIO } from '@gltf-transform/core';

const io = new NodeIO();
const doc = await io.read(process.argv[2]);
const root = doc.getRoot();

console.log('\n=== MODEL:', process.argv[2], '===');
console.log('Meshes:', root.listMeshes().length);
console.log('Skins:', root.listSkins().length);
console.log('Animations:', root.listAnimations().length);

root.listAnimations().forEach(a => {
    console.log(' -', a.getName());
});

const skin = root.listSkins()[0];
if (skin) {
    console.log('\nBones:', skin.listJoints().length);
    skin.listJoints().slice(0, 10).forEach(j => console.log(' -', j.getName()));
}
