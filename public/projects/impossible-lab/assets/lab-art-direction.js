// A presentation layer over the preserved game: no puzzle, collision, save or input changes.
export function upgradeLabRoom(room, id, T) {
  if (room.scene.userData.artDirection) return;
  const scene = room.scene;
  const palette = {
    hub: { metal: 0x536e70, edge: 0xc2a572, light: 0xa3dbd7, rim: 0x87c4d6, fill: .47, key: 3.05, back: 2.1 },
    ink: { metal: 0x343444, edge: 0xb5a782, light: 0xbfe7df, rim: 0x9cc6d2, fill: .4, key: 3.05, back: 1.35 },
    rogue: { metal: 0x333d45, edge: 0xa59b88, light: 0xb4d7da, rim: 0x8dbbd1, fill: .39, key: 3.1, back: 1.45 },
    bio: { metal: 0x244c50, edge: 0xa3beaf, light: 0xa9eddf, rim: 0x8ebae5, fill: .38, key: 3.0, back: 1.65 },
    clay: { metal: 0x8d8a92, edge: 0xddc4a2, light: 0xf5dfb8, rim: 0xa9c1d5, fill: .5, key: 2.9, back: 1.4 },
  }[id];
  if (!palette) return;
  const ownedTextures = [];
  const materialSet = new Set();
  let directionalIndex = 0;
  scene.environmentIntensity = id === 'bio' ? .37 : .32;
  scene.traverse(node => {
    if (node.isHemisphereLight) node.intensity = node.intensity > .4 ? palette.fill : node.intensity * .8;
    if (node.isDirectionalLight) {
      if (directionalIndex++ === 0) {
        node.intensity = palette.key;
        node.position.set(id === 'clay' ? -8 : -6, 10, 6);
        node.shadow.normalBias = .022;
        node.shadow.bias = -.00025;
        node.shadow.radius = 3;
      } else {
        node.color.set(palette.rim);
        node.intensity = palette.back;
        node.position.set(5, 6, -8);
      }
    }
    if (node.isPointLight) node.intensity *= id === 'clay' ? .9 : .8;
    for (const material of node.material ? Array.isArray(node.material) ? node.material : [node.material] : []) materialSet.add(material);
  });

  // Roughness is data, so this texture deliberately has no sRGB conversion.
  const brushedCanvas = document.createElement('canvas');
  brushedCanvas.width = brushedCanvas.height = 128;
  const brush = brushedCanvas.getContext('2d');
  brush.fillStyle = '#ececec'; brush.fillRect(0, 0, 128, 128);
  for (let y = 0; y < 128; y++) {
    const value = 208 + ((y * 37 + 13) % 35);
    brush.fillStyle = `rgb(${value},${value},${value})`;
    brush.fillRect(0, y, 128, 1);
  }
  const brushed = new T.CanvasTexture(brushedCanvas);
  brushed.wrapS = brushed.wrapT = T.RepeatWrapping;
  brushed.repeat.set(3, 3); brushed.anisotropy = 4;
  ownedTextures.push(brushed);
  for (const material of materialSet) {
    if (!material.isMeshStandardMaterial) continue;
    if (material.transparent) {
      if (material.isMeshPhysicalMaterial) {
        material.clearcoat = Math.max(material.clearcoat, .65);
        material.clearcoatRoughness = .16;
        material.envMapIntensity = 1.15;
      }
    } else if (material.metalness >= .45) {
      material.roughness = Math.max(.23, Math.min(.43, material.roughness * .84));
      if (!material.roughnessMap) material.roughnessMap = brushed;
      material.envMapIntensity = 1.3;
    } else if (material.isMeshPhysicalMaterial) {
      material.clearcoat = Math.max(material.clearcoat, .42);
      material.clearcoatRoughness = .27;
      material.envMapIntensity = .95;
    }
    material.needsUpdate = true;
  }

  const detail = new T.Group(); detail.name = 'notebook-art-direction'; scene.add(detail);
  const metal = new T.MeshStandardMaterial({ color: palette.metal, metalness: id === 'clay' ? .12 : .78, roughness: id === 'clay' ? .76 : .32, roughnessMap: id === 'clay' ? null : brushed });
  const trim = new T.MeshStandardMaterial({ color: palette.edge, metalness: id === 'clay' ? .04 : .7, roughness: id === 'clay' ? .86 : .3 });
  const diffuser = new T.MeshStandardMaterial({ color: palette.light, emissive: palette.light, emissiveIntensity: .62, roughness: .35, metalness: .08 });
  const inset = new T.MeshStandardMaterial({ color: id === 'clay' ? 0x72717e : 0x172e35, roughness: .64, metalness: .38 });
  const unitBox = new T.RoundedBoxGeometry(1, 1, 1, 2, .055);
  const bolt = new T.CylinderGeometry(.035, .035, .018, 8);
  function mesh(geometry, material, position, scale = [1, 1, 1], rotation = [0, 0, 0]) {
    const item = new T.Mesh(geometry, material);
    item.position.set(...position); item.scale.set(...scale); item.rotation.set(...rotation);
    item.castShadow = !material.transparent; item.receiveShadow = true;
    detail.add(item); return item;
  }
  const box = (material, position, scale, rotation) => mesh(unitBox, material, position, scale, rotation);
  const ring = (radius, width, material, position, rotation = [Math.PI / 2, 0, 0]) => mesh(new T.TorusGeometry(radius, width, 8, 64), material, position, [1, 1, 1], rotation);

  // Layered mounting rails and recessed practical lights sit above all walking paths.
  for (const side of [-1, 1]) {
    box(metal, [side * 11.6, 5.5, -.6], [.18, .26, 19]);
    box(trim, [side * 11.48, 5.57, -.6], [.045, .045, 18.5]);
    for (const z of [-7, 0, 7]) {
      box(metal, [side * 11.4, 5.52, z], [.56, .68, .46]);
      box(inset, [side * 11.07, 5.52, z], [.08, .44, .28]);
    }
    for (const z of [-5.5, 4.5]) {
      box(metal, [side * 7.5, 7.6, z], [3, .22, .58]);
      box(inset, [side * 7.5, 7.47, z], [2.68, .055, .36]);
      box(diffuser, [side * 7.5, 7.43, z], [2.43, .035, .21]);
      for (const x of [-1.25, 1.25]) box(trim, [side * 7.5 + x, 7.5, z], [.06, .1, .42]);
    }
  }

  if (id === 'hub' || id === 'bio' || id === 'clay') {
    const radius = id === 'hub' ? 3.27 : id === 'bio' ? 4.08 : 5.07;
    const y = id === 'hub' ? .18 : .265;
    ring(radius, id === 'clay' ? .055 : .035, trim, [0, y, 0]);
    if (id !== 'clay') ring(radius - .12, .018, metal, [0, y + .012, 0]);
    if (id !== 'clay') for (let i = 0; i < 24; i++) {
      const angle = i * Math.PI / 12;
      mesh(bolt, trim, [Math.sin(angle) * (radius - .2), y + .018, Math.cos(angle) * (radius - .2)]);
    }
  }

  // Mechanical backplates have real edge depth, recesses and collars, not flat decals.
  if (id === 'rogue' || id === 'ink' || id === 'bio') for (const side of [-1, 1]) {
    const x = side * 8.8;
    box(metal, [x, 4.8, -11.65], [2.2, 2.8, .16]);
    box(inset, [x, 4.8, -11.53], [1.95, 2.55, .08]);
    for (let j = 0; j < 8; j++) box(trim, [x, 3.78 + j * .29, -11.42], [1.68, .055, .14], [.12, 0, 0]);
    for (const dx of [-1, 1]) {
      const pipe = new T.CatmullRomCurve3([
        new T.Vector3(x + dx * 1.1, 3.6, -11.3),
        new T.Vector3(x + dx * 1.3, 4.7, -11.3),
        new T.Vector3(x + dx * 1.1, 6, -11.3),
      ]);
      mesh(new T.TubeGeometry(pipe, 24, .045, 8, false), metal, [0, 0, 0]);
      ring(.085, .024, trim, [x + dx * 1.1, 3.6, -11.3]);
    }
  }

  // Static opaque detail is batched using the game's own scenery merger.
  T.mergeScenery(detail);
  const dispose = room.dispose;
  room.dispose = function (...args) {
    dispose?.apply(this, args);
    for (const texture of ownedTextures) texture.dispose();
  };
  scene.userData.artDirection = 'notebook-material-study-1';
}
