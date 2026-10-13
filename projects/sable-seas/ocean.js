import * as T from './vendor/three.module.js';
import {ISLANDS} from './data.js';
import {waveGLSL} from './ocean-math.js';
export const SKY_GLSL=`
float hash(vec3 p){p=fract(p*.3183099+vec3(.1,.2,.3));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
vec3 skyColor(vec3 d){float h=max(d.y,0.);vec3 horizon=mix(vec3(.025,.04,.085),vec3(.38,.67,.83),day);vec3 zenith=mix(vec3(.004,.01,.035),vec3(.025,.21,.51),day);vec3 c=mix(horizon,zenith,pow(h,.42));float sun=max(dot(d,sunDir),0.);float dusk=(1.-smoothstep(.05,.4,abs(sunDir.y)))*day;c+=vec3(.65,.17,.03)*pow(sun,6.)*dusk;c+=vec3(1.,.75,.43)*pow(sun,42.)*.15*day;c+=vec3(1.,.86,.60)*pow(sun,1800.)*4.*day;return mix(c,vec3(.13,.21,.26),storm*.7);}
`;
export function makeSky(){let m=new T.ShaderMaterial({side:T.BackSide,depthWrite:false,uniforms:{time:{value:0},sunDir:{value:new T.Vector3(-.5,.65,-.6).normalize()},day:{value:1},storm:{value:0}},vertexShader:`varying vec3 vPos;void main(){vPos=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec3 vPos;uniform float time,day,storm;uniform vec3 sunDir;${SKY_GLSL}
void main(){vec3 d=normalize(vPos);vec3 c=skyColor(d);float stars=step(.9995,hash(floor(d*950.)))*(1.-day)*smoothstep(.1,.3,d.y);c+=stars;gl_FragColor=vec4(c,1.);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`});let o=new T.Mesh(new T.SphereGeometry(2200,32,24),m);o.frustumCulled=false;return o;}
export function makeClouds(){
  const root=new T.Group();const geometry=new T.IcosahedronGeometry(1,2);
  const material=new T.MeshStandardMaterial({color:'#f3f0e7',roughness:1,emissive:'#a0b4bd',emissiveIntensity:.38});
  // Designed banks with broad slate undersides and irregular sunlit lobes.
  let seed=93;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const instances=new T.InstancedMesh(geometry,material,18*14),matrix=new T.Matrix4(),position=new T.Vector3(),quaternion=new T.Quaternion(),scale=new T.Vector3();let index=0;
  for(let b=0;b<18;b++){const a=b/18*Math.PI*2,r=650+rand()*850,bx=Math.sin(a)*r,by=155+rand()*145,bz=Math.cos(a)*r;
    for(let j=0;j<14;j++){position.set(bx+(rand()-.5)*155,by+rand()*22,bz+(rand()-.5)*60);scale.set(24+rand()*42,14+rand()*24,20+rand()*33);matrix.compose(position,quaternion,scale);instances.setMatrixAt(index++,matrix);}}
  instances.instanceMatrix.needsUpdate=true;instances.frustumCulled=false;root.add(instances);
  return root;
}
export function makeOcean(){
 const uniforms={time:{value:0},storm:{value:0},day:{value:1},sunDir:{value:new T.Vector3(-.5,.65,-.6).normalize()},islands:{value:ISLANDS.map(i=>new T.Vector4(i.x,i.z,i.r,i.seed))},ship:{value:new T.Vector4()},shipScale:{value:1},shipDirection:{value:new T.Vector2()},reflectionSampler:{value:null},reflectionMatrix:{value:new T.Matrix4()}};
 const vertexShader=`uniform float time,storm;uniform vec4 islands[9];uniform mat4 reflectionMatrix;
 varying vec3 vWorld,vNormal;varying vec2 vBase;varying vec4 vReflect;varying float vCompression,vShore;
 float shoreFactor(vec2 q){float shore=10000.;for(int i=0;i<9;i++){vec2 d=q-islands[i].xy;float a=atan(d.y,d.x);float r=islands[i].z*(.88+.10*sin(a*3.+islands[i].w)+.07*cos(a*5.-islands[i].w));shore=min(shore,length(d)-r);}vShore=shore;return mix(.25,1.,smoothstep(0.,38.,shore));}
 vec2 base;float attenuation;
 void applyWave(inout vec3 p,inout vec3 dx,inout vec3 dz,inout float compression,vec2 dir,float k,float a,float speed,float phase,float resolution){
  float lod=1.-smoothstep(1.3,3.5,k*resolution);a*=attenuation*lod;float theta=k*dot(dir,base)-speed*time+phase;float s=sin(theta),c=cos(theta),qa=1.1*a;
  p.xz+=qa*dir*c;p.y+=a*(1.+storm*.8)*s;
  dx+=vec3(-qa*k*dir.x*dir.x*s,a*(1.+storm*.8)*k*dir.x*c,-qa*k*dir.x*dir.y*s);
  dz+=vec3(-qa*k*dir.x*dir.y*s,a*(1.+storm*.8)*k*dir.y*c,-qa*k*dir.y*dir.y*s);compression+=qa*k*s;
 }
 void main(){vec3 p=(modelMatrix*vec4(position,1.)).xyz;base=p.xz;vBase=base;attenuation=shoreFactor(base);float resolution=.53*exp(5.*max(abs(uv.x-.5)*2.,abs(uv.y-.5)*2.));vec3 dx=vec3(1.,0.,0.),dz=vec3(0.,0.,1.);float compression=0.;
 ${waveGLSL()}
 vWorld=p;vNormal=normalize(cross(dz,dx));vCompression=1.-(dx.x*dz.z-dx.z*dz.x);vReflect=reflectionMatrix*vec4(p,1.);gl_Position=projectionMatrix*viewMatrix*vec4(p,1.);}`;
 const fragmentShader=`uniform float time,storm,day;uniform vec3 sunDir;uniform vec4 ship;uniform float shipScale;uniform vec2 shipDirection;uniform sampler2D reflectionSampler;varying vec3 vWorld,vNormal;varying vec2 vBase;varying vec4 vReflect;varying float vCompression,vShore;${SKY_GLSL}
 void ripple(inout vec3 n,vec2 dir,float k,float a,float speed){float phase=k*dot(dir,vBase)-speed*time+noise(vec3(vBase*.18,time*.035))*3.8;float fade=1.-smoothstep(.8,3.,fwidth(phase));n.xz+=dir*cos(phase)*a*fade;}
 void main(){vec2 d=vWorld.xz-ship.xy;vec2 local=vec2(cos(ship.w)*d.x-sin(ship.w)*d.y,sin(ship.w)*d.x+cos(ship.w)*d.y)/shipScale;if(abs(local.x)<2.15&&local.y> -6.25&&local.y<5.25)discard;vec3 N=vNormal;ripple(N,vec2(.82,.57),3.,.045,3.4);ripple(N,vec2(-.34,.94),4.83,.025,4.8);ripple(N,vec2(.96,-.28),7.85,.015,6.1);ripple(N,vec2(.64,.77),13.96,.008,7.5);N=normalize(N);vec3 V=normalize(cameraPosition-vWorld);
 float shallow=1.-smoothstep(4.,65.,vShore);float trough=clamp(vWorld.y*.16+.46,0.,1.);vec3 water=mix(vec3(.005,.047,.12),vec3(.012,.19,.29),trough);water=mix(water,vec3(.015,.34,.32),shallow*.8);water*=.12+.88*day;
 float crestLight=max(0.,vCompression)*max(0.,dot(-V,sunDir)*.6+.5);water+=vec3(.015,.28,.29)*crestLight*day;
 float F=.0204+.9796*pow(1.-max(dot(N,V),0.),5.);vec3 reflected=skyColor(reflect(-V,N));vec2 uv=vReflect.xy/vReflect.w+N.xz*.028;float valid=step(0.,uv.x)*step(0.,uv.y)*step(uv.x,1.)*step(uv.y,1.);reflected=mix(reflected,texture2D(reflectionSampler,clamp(uv,0.,1.)).rgb,valid*.66);
 vec3 c=mix(water,reflected,clamp(F*.76,0.,.83));float spec=pow(max(dot(reflect(-sunDir,N),V),0.),95.);c+=vec3(1.,.81,.49)*spec*day*1.6;
 float broken=noise(vec3(vBase*.56,time*.18))*.65+noise(vec3(vBase*1.3,0.))*.35;float foam=smoothstep(.14,.27,vCompression)*(smoothstep(.4,.65,broken))*(.28+storm*.8);
 float beach=(1.-smoothstep(0.,7.,abs(vShore-1.5)))*smoothstep(.48,.7,broken+sin(vShore*.85-time*1.9)*.18);foam=max(foam,beach*.65);
 vec2 offset=vBase-ship.xy;float behind=dot(offset,shipDirection);float side=abs(dot(offset,vec2(-shipDirection.y,shipDirection.x)));float wakeWidth=2.3+max(behind,0.)*.12;float wake=(1.-smoothstep(wakeWidth,wakeWidth+2.,side))*smoothstep(2.,8.,behind)*(1.-smoothstep(10.,80.,behind));wake*=clamp(ship.z/10.,0.,1.)*smoothstep(.4,.66,broken);foam=max(foam,wake*.75);
 c=mix(c,vec3(.73,.87,.82)*(.18+.82*day),clamp(foam,0.,.85));float fog=1.-exp(-length(cameraPosition-vWorld)*.00055);c=mix(c,skyColor(vec3(0.,.02,1.)),fog);gl_FragColor=vec4(c,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 }`;
 let geo=new T.PlaneGeometry(2,2,256,256);geo.rotateX(-Math.PI/2);let p=geo.attributes.position;
 const remap=u=>Math.sign(u)*(Math.exp(5*Math.abs(u))-1)/(Math.exp(5)-1)*2000;
 for(let i=0;i<p.count;i++){p.setX(i,remap(p.getX(i)));p.setZ(i,remap(p.getZ(i)));}p.needsUpdate=true;
 const ocean=new T.Mesh(geo,new T.ShaderMaterial({uniforms,vertexShader,fragmentShader,side:T.DoubleSide}));ocean.frustumCulled=false;return ocean;
}
