import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assets = path.join(root, 'public/projects/impossible-lab/assets');
let source = await readFile(path.join(assets, 'index-CeHXbKWO.js'), 'utf8');
function replaceOnce(before, after) {
  if (source.split(before).length !== 2) throw new Error(`The preserved lab runtime changed at: ${before.slice(0, 70)}`);
  source = source.replace(before, after);
}

// Keep the shipped game intact. This repeatable adapter touches presentation only.
source = 'import { upgradeLabRoom as notebookUpgradeRoom } from "./lab-art-direction.js";\n' + source;
replaceOnce('oi={sphere:new br(1,24,16),soft:new br(1,32,20),box:new wa(1,1,1),cylinder:new is(1,1,1,40)}', 'oi={sphere:new br(1,32,24),soft:new br(1,40,28),box:new Zd(1,1,1,1,.026),cylinder:new is(1,1,1,48)}');
replaceOnce('e.obstacles.push(...e.fieldInstrument.obstacles)),Rd.set(r,e)', 'e.obstacles.push(...e.fieldInstrument.obstacles)),notebookUpgradeRoom(e,r,{Group:We,Mesh:Wt,Vector3:X,MeshStandardMaterial:un,RoundedBoxGeometry:Zd,CylinderGeometry:is,TorusGeometry:Zr,TubeGeometry:$r,CatmullRomCurve3:Oc,CanvasTexture:Xs,RepeatWrapping:ns,mergeScenery:Kd}),Rd.set(r,e)');
await writeFile(path.join(assets, 'lab-runtime-v2.js'), source);
console.log('Prepared Impossible Lab presentation adapter; original game bundle retained.');
