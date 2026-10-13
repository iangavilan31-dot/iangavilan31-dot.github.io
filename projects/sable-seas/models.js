import * as T from './vendor/three.module.js';
import {GLTFLoader} from './vendor/addons/loaders/GLTFLoader.js';
import {clone} from './vendor/addons/utils/SkeletonUtils.js';
const loader=new GLTFLoader();
export const assets={ship:null,ships:{},pirates:[],skeleton:null,ready:false};
export const assetsReady=Promise.all([
 loader.loadAsync('assets/ships/pinnace/ship_pinnace_sails_separated.gltf').then(g=>assets.ship=g),
 loader.loadAsync('assets/pirates/Ship_Sloop_playable.gltf').then(g=>assets.ships.sloop=g),
 loader.loadAsync('assets/pirates/Ship_Brig_playable.gltf').then(g=>assets.ships.brig=g),
 loader.loadAsync('assets/pirates/Characters_Anne.gltf').then(g=>assets.pirates[0]=g),
 loader.loadAsync('assets/pirates/Characters_Captain_Barbarossa.gltf').then(g=>assets.pirates[1]=g),
 loader.loadAsync('assets/pirates/Characters_Skeleton.gltf').then(g=>assets.skeleton=g)
]).then(()=>{assets.ready=true;}).catch(e=>{console.error('Model load failed',e);throw e;});
export function character(index=0,skeleton=false){
 const asset=skeleton?assets.skeleton:assets.pirates[index%2];if(!asset)return null;
 const root=new T.Group(),model=clone(asset.scene),bounds=new T.Box3().setFromObject(model),size=bounds.getSize(new T.Vector3());
 const factor=1.82/size.y;model.scale.setScalar(factor);model.position.y=-bounds.min.y*factor;model.rotation.y=Math.PI;root.add(model);
 model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
 const mixer=new T.AnimationMixer(model),actions={};for(const clip of asset.animations){const name=clip.name.split('|').at(-1).toLowerCase();actions[name]=mixer.clipAction(clip.name.toLowerCase().includes('jump')?new T.AnimationClip(clip.name,clip.duration,clip.tracks.filter(track=>!track.name.endsWith('.position'))):clip);}
 return {root,arms:[],mixer,actions,current:null,last:null,actionTime:-1};
}
export function animateCharacter(obj,item,time,dt,localPosition){
 if(!obj.mixer)return;if(obj.currentTool!==item.tool){obj.root.traverse(o=>{if(o.name.startsWith('Weapon_'))o.visible=item.tool===0?(o.name.includes('Cutlass')||o.name.includes('DoubleAxe')):item.tool===1?o.name.includes('Pistol'):false;});obj.currentTool=item.tool;}
 const movement=obj.last?Math.hypot(localPosition.x-obj.last.x,localPosition.z-obj.last.z)/Math.max(.001,dt):0;
 obj.last={x:localPosition.x,z:localPosition.z};
 let wanted=item.jump>.05?'jump_idle':movement>4.8?'run':movement>.35?'walk':'idle';
 if(item.action&&time-item.action.time<.6)wanted=item.action.name==='sword'?'sword':item.action.name==='pistol'?'punch':wanted;
 let action=obj.actions[wanted]||Object.entries(obj.actions).find(([n])=>n.includes(wanted))?.[1]||obj.actions.idle;
 if(action&&obj.current!==action){obj.current?.fadeOut(.14);action.reset().fadeIn(.14).play();obj.current=action;}
 obj.mixer.update(dt);
}
