// Shared displacement for rendering, buoyancy and swimmers. Metres and seconds.
export const WAVES = [
  [120,1.1,.68,.20], [102,.65,2.15,4.7], [72,.85,1.05,1.7], [43,.65,.44,3.1],
  [26,.45,.9,4.2], [15,.24,1.3,.9], [9,.12,.58,2.6],
  [5.5,.04,1.15,5.0], [3.1,.018,.25,1.3]
].map(([length,amplitude,direction,phase])=>({
  length,amplitude,x:Math.sin(direction),z:Math.cos(direction),
  k:Math.PI*2/length,speed:Math.sqrt(9.81*Math.PI*2/length),phase,q:1.1
}));
export function oceanDisplacement(x,z,time,storm=0,shore=1){
  let dx=0,dz=0,y=0;const scale=(1+storm*.8)*shore;let xx=1,xz=0,zz=1;
  for(const w of WAVES){let a=w.amplitude*scale,phase=w.k*(w.x*x+w.z*z)-w.speed*time+w.phase;
    dx+=w.q*w.amplitude*shore*w.x*Math.cos(phase);
    dz+=w.q*w.amplitude*shore*w.z*Math.cos(phase);y+=a*Math.sin(phase);const slope=-w.q*w.amplitude*shore*w.k*Math.sin(phase);xx+=slope*w.x*w.x;xz+=slope*w.x*w.z;zz+=slope*w.z*w.z;}
  return {x:dx,y,z:dz,xx,xz,zz};
}
export function oceanHeight(x,z,time,storm=0,shore=1){
  let qx=x,qz=z;const attenuation=typeof shore==='function'?shore:()=>shore;for(let i=0;i<4;i++){const d=oceanDisplacement(qx,qz,time,storm,attenuation(qx,qz)),fx=qx+d.x-x,fz=qz+d.z-z,det=d.xx*d.zz-d.xz*d.xz;qx-=(d.zz*fx-d.xz*fz)/det;qz-=(-d.xz*fx+d.xx*fz)/det;}
  return oceanDisplacement(qx,qz,time,storm,attenuation(qx,qz)).y;
}
export function waveGLSL(){return WAVES.map((w,i)=>`applyWave(p, dx, dz, compression, vec2(${w.x.toFixed(8)},${w.z.toFixed(8)}), ${w.k.toFixed(8)}, ${w.amplitude.toFixed(8)}, ${w.speed.toFixed(8)}, ${w.phase.toFixed(8)}, resolution);`).join('\n');}
