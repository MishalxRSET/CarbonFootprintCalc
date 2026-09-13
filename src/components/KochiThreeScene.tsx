import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { KOCHI_LOCATIONS, KochiLocation } from '../data/kochiLocations';

export type KochiTimeOfDay = 'golden_hour' | 'monsoon_mist' | 'midnight_glow';

interface KochiThreeSceneProps {
  activeLocation: KochiLocation;
  onSelectLocation: (loc: KochiLocation) => void;
  isGuidedMode: boolean;
  timeOfDay: KochiTimeOfDay;
  isReducedMotion?: boolean;
  scrollProgress?: number; // 0 to 1 smooth scroll progression
}

export const KochiThreeScene: React.FC<KochiThreeSceneProps> = ({
  activeLocation,
  onSelectLocation,
  isGuidedMode,
  timeOfDay,
  isReducedMotion = false,
  scrollProgress = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameIdRef = useRef<number>(0);

  // Dynamic animated entities
  const waterMeshRef = useRef<THREE.Mesh | null>(null);
  const electricBoatRef = useRef<THREE.Group | null>(null);
  const cialRadarRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const pinMeshesRef = useRef<{ id: string; group: THREE.Group; mesh: THREE.Mesh }[]>([]);

  // Smooth camera tracking targets
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(11, 8, 7));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(16, 2.2, -4));
  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(16, 2.2, -4));

  // Lights refs for time-of-day transitions
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);

  // Mouse interaction for free orbit & raycasting
  const isDragging = useRef<boolean>(false);
  const prevMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const orbitSpherical = useRef<THREE.Spherical>(new THREE.Spherical(20, Math.PI / 3, Math.PI / 4));
  const raycaster = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseVec = useRef<THREE.Vector2>(new THREE.Vector2());

  // Update target camera when activeLocation changes in guided mode
  useEffect(() => {
    if (activeLocation && isGuidedMode) {
      targetCamPos.current.set(
        activeLocation.cameraPosition.x,
        activeLocation.cameraPosition.y,
        activeLocation.cameraPosition.z
      );
      targetLookAt.current.set(
        activeLocation.cameraTarget.x,
        activeLocation.cameraTarget.y,
        activeLocation.cameraTarget.z
      );
    }
  }, [activeLocation, isGuidedMode]);

  // Adjust lighting on timeOfDay change
  useEffect(() => {
    if (!sceneRef.current || !sunLightRef.current || !hemiLightRef.current || !ambientLightRef.current) return;

    if (timeOfDay === 'golden_hour') {
      // Warm Kerala Sunset over Arabian Sea
      sceneRef.current.fog = new THREE.FogExp2(0x281c12, 0.016);
      sceneRef.current.background = new THREE.Color(0x1a120c);
      sunLightRef.current.color.setHex(0xffaa44);
      sunLightRef.current.intensity = 2.4;
      sunLightRef.current.position.set(-35, 14, -10); // Low western sun
      hemiLightRef.current.color.setHex(0xffcc88);
      hemiLightRef.current.groundColor.setHex(0x1f2e1b);
      hemiLightRef.current.intensity = 1.0;
      ambientLightRef.current.color.setHex(0x38281a);
      ambientLightRef.current.intensity = 1.2;
    } else if (timeOfDay === 'monsoon_mist') {
      // Lush tropical monsoon mist & cool greenery
      sceneRef.current.fog = new THREE.FogExp2(0x132318, 0.02);
      sceneRef.current.background = new THREE.Color(0x0e1911);
      sunLightRef.current.color.setHex(0x9bd4a0);
      sunLightRef.current.intensity = 1.5;
      sunLightRef.current.position.set(10, 30, 10);
      hemiLightRef.current.color.setHex(0xa3e635);
      hemiLightRef.current.groundColor.setHex(0x064e3b);
      hemiLightRef.current.intensity = 1.2;
      ambientLightRef.current.color.setHex(0x152e1f);
      ambientLightRef.current.intensity = 1.5;
    } else {
      // Midnight sapphire & city starlight
      sceneRef.current.fog = new THREE.FogExp2(0x070c14, 0.018);
      sceneRef.current.background = new THREE.Color(0x04080e);
      sunLightRef.current.color.setHex(0x38bdf8);
      sunLightRef.current.intensity = 0.6;
      sunLightRef.current.position.set(-10, 25, -20);
      hemiLightRef.current.color.setHex(0x1e3a8a);
      hemiLightRef.current.groundColor.setHex(0x020617);
      hemiLightRef.current.intensity = 0.7;
      ambientLightRef.current.color.setHex(0x0f172a);
      ambientLightRef.current.intensity = 1.0;
    }
  }, [timeOfDay]);

  // Main Three.js Initialization & Scene Graph Assembly
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x281c12, 0.016);
    scene.background = new THREE.Color(0x1a120c);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 300);
    camera.position.set(11, 8, 7);
    camera.lookAt(16, 2.2, -4);
    cameraRef.current = camera;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // =========================================================================
    // LIGHTING RIG
    // =========================================================================
    const ambientLight = new THREE.AmbientLight(0x38281a, 1.2);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const hemiLight = new THREE.HemisphereLight(0xffcc88, 0x1f2e1b, 1.0);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const sunLight = new THREE.DirectionalLight(0xffaa44, 2.4);
    sunLight.position.set(-35, 14, -10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 120;
    sunLight.shadow.camera.left = -35;
    sunLight.shadow.camera.right = 35;
    sunLight.shadow.camera.top = 35;
    sunLight.shadow.camera.bottom = -35;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // =========================================================================
    // GEOGRAPHY: ARABIAN SEA, VEMBANAD BACKWATERS & KERALA COASTLINE TERRAIN
    // =========================================================================
    // 1. Water Plane (Arabian Sea on West + Vembanad Channels)
    const waterGeo = new THREE.PlaneGeometry(120, 120, 48, 48);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0a3344,
      roughness: 0.15,
      metalness: 0.85,
      transparent: true,
      opacity: 0.88,
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.set(-15, 0.05, 0);
    water.receiveShadow = true;
    scene.add(water);
    waterMeshRef.current = water;

    // 2. Mainland Kerala & Kakkanad Valley Terrain (Undulating green landscape)
    const landGeo = new THREE.PlaneGeometry(80, 100, 32, 32);
    const landPos = landGeo.attributes.position;
    // Elevate the eastern region (Kakkanad hills) and lower the coastal west
    for (let i = 0; i < landPos.count; i++) {
      const x = landPos.getX(i);
      const y = landPos.getY(i);
      // As x increases toward east, elevate up to 3.5m
      const elevation = Math.max(0, (x + 10) * 0.08) + Math.sin(x * 0.15) * Math.cos(y * 0.12) * 0.6;
      landPos.setZ(i, elevation);
    }
    landGeo.computeVertexNormals();

    const landMat = new THREE.MeshStandardMaterial({
      color: 0x1b2e1c, // Lush Kerala tropical green
      roughness: 0.85,
      metalness: 0.1,
    });
    const land = new THREE.Mesh(landGeo, landMat);
    land.rotation.x = -Math.PI / 2;
    land.position.set(15, 0, 0);
    land.receiveShadow = true;
    scene.add(land);

    // 3. Sandy Coastline strip (Fort Kochi & Vypeen sandbanks)
    const sandGeo = new THREE.BoxGeometry(4, 0.4, 30);
    const sandMat = new THREE.MeshStandardMaterial({ color: 0xd4b886, roughness: 0.9 });
    const sand = new THREE.Mesh(sandGeo, sandMat);
    sand.position.set(-19, 0.2, 5);
    sand.receiveShadow = true;
    scene.add(sand);

    // 4. Backwater Islands (Willingdon Island & Vallarpadam)
    const islandGeo = new THREE.BoxGeometry(10, 0.5, 14);
    const islandMat = new THREE.MeshStandardMaterial({ color: 0x1f3622, roughness: 0.8 });
    const portIsland = new THREE.Mesh(islandGeo, islandMat);
    portIsland.position.set(-8, 0.25, 2);
    portIsland.receiveShadow = true;
    scene.add(portIsland);

    // =========================================================================
    // PROCEDURAL VEGETATION: KERALA PALM TREES & MANGROVES
    // =========================================================================
    const palmTrunkMat = new THREE.MeshStandardMaterial({ color: 0x5a3e28, roughness: 0.9 });
    const palmFrondMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.6 });

    const createPalmTree = (x: number, z: number, scale = 1, yOffset = 0) => {
      const tree = new THREE.Group();
      // Curved trunk
      const trunkGeo = new THREE.CylinderGeometry(0.12 * scale, 0.18 * scale, 2.5 * scale, 6);
      const trunk = new THREE.Mesh(trunkGeo, palmTrunkMat);
      trunk.position.y = (2.5 * scale) / 2;
      trunk.rotation.z = (Math.random() - 0.5) * 0.15;
      trunk.castShadow = true;
      tree.add(trunk);

      // Fronds canopy
      for (let i = 0; i < 7; i++) {
        const angle = (i / 7) * Math.PI * 2;
        const frondGeo = new THREE.ConeGeometry(0.8 * scale, 0.2 * scale, 4);
        const frond = new THREE.Mesh(frondGeo, palmFrondMat);
        frond.position.set(Math.cos(angle) * 0.7 * scale, 2.4 * scale, Math.sin(angle) * 0.7 * scale);
        frond.rotation.z = Math.cos(angle) * 0.4;
        frond.rotation.x = Math.sin(angle) * 0.4;
        frond.castShadow = true;
        tree.add(frond);
      }
      tree.position.set(x, yOffset, z);
      return tree;
    };

    // Plant trees across Rajagiri Valley, Fort Kochi, and coastal roads
    const treeGroup = new THREE.Group();
    // Around RSET Kakkanad (Lush academic valley)
    for (let i = 0; i < 28; i++) {
      const rx = 16 + (Math.random() - 0.5) * 10;
      const rz = -4 + (Math.random() - 0.5) * 8;
      treeGroup.add(createPalmTree(rx, rz, 0.7 + Math.random() * 0.5, 2.0));
    }
    // Around Fort Kochi (Coastal palms & mangroves)
    for (let i = 0; i < 18; i++) {
      const rx = -18 + (Math.random() - 0.5) * 5;
      const rz = 6 + (Math.random() - 0.5) * 8;
      treeGroup.add(createPalmTree(rx, rz, 0.8 + Math.random() * 0.4, 0.4));
    }
    scene.add(treeGroup);

    // =========================================================================
    // 3D LANDMARK 1: RAJAGIRI SCHOOL OF ENGINEERING & TECHNOLOGY (RSET)
    // =========================================================================
    const rsetGroup = new THREE.Group();
    rsetGroup.position.set(16, 2.2, -4);

    // Main Academic Administrative Block (Terracotta tile accents & ivory walls)
    const rsetBaseMat = new THREE.MeshStandardMaterial({ color: 0xf3eee5, roughness: 0.5 });
    const rsetRoofMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.6 }); // Terracotta tile roof
    const solarPanelMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.2, metalness: 0.8 }); // Monocrystalline blue

    // Central Quad Block
    const rsetMain = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.8, 2.8), rsetBaseMat);
    rsetMain.position.y = 0.9;
    rsetMain.castShadow = true;
    rsetMain.receiveShadow = true;
    rsetGroup.add(rsetMain);

    // Roof of Main Block
    const rsetRoof = new THREE.Mesh(new THREE.ConeGeometry(3.5, 0.8, 4), rsetRoofMat);
    rsetRoof.rotation.y = Math.PI / 4;
    rsetRoof.position.y = 2.1;
    rsetRoof.castShadow = true;
    rsetGroup.add(rsetRoof);

    // Rajagiri Academic Clock Tower / Spire
    const tower = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.8, 0.8), rsetBaseMat);
    tower.position.set(-1.8, 1.9, 0.8);
    tower.castShadow = true;
    rsetGroup.add(tower);

    const towerSpire = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.2, 4), rsetRoofMat);
    towerSpire.position.set(-1.8, 4.2, 0.8);
    towerSpire.rotation.y = Math.PI / 4;
    rsetGroup.add(towerSpire);

    // Rooftop Solar Canopy Arrays on Academic Wings (Simulation showcase)
    for (let r = -1; r <= 1; r++) {
      const panelWing = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.08, 0.6), solarPanelMat);
      panelWing.position.set(0, 1.85, r * 0.8);
      panelWing.rotation.x = -0.15; // Tilted toward tropical sun
      panelWing.castShadow = true;
      rsetGroup.add(panelWing);
    }

    // Canteen Bio-Digester Dome (Closed-loop food waste to methane)
    const digesterMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.4 });
    const digester = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), digesterMat);
    digester.position.set(2.4, 0, -1.8);
    digester.castShadow = true;
    rsetGroup.add(digester);

    // Campus EV Charging Hub & Solar Portico
    const evPortico = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.1, 1.2), solarPanelMat);
    evPortico.position.set(0, 0.9, 2.4);
    rsetGroup.add(evPortico);

    const evPillars = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.9, 8), rsetBaseMat);
    evPillars.position.set(-0.8, 0.45, 2.4);
    rsetGroup.add(evPillars);
    const evPillars2 = evPillars.clone();
    evPillars2.position.x = 0.8;
    rsetGroup.add(evPillars2);

    scene.add(rsetGroup);

    // =========================================================================
    // 3D LANDMARK 2: COCHIN INTERNATIONAL AIRPORT (CIAL)
    // =========================================================================
    const cialGroup = new THREE.Group();
    cialGroup.position.set(14, 1.2, -26);

    // Illuminated Airport Runway
    const runwayGeo = new THREE.BoxGeometry(2.8, 0.1, 24);
    const runwayMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.7 });
    const runway = new THREE.Mesh(runwayGeo, runwayMat);
    runway.receiveShadow = true;
    cialGroup.add(runway);

    // Runway Centerline markings
    for (let c = -10; c <= 10; c += 2) {
      const stripe = new THREE.Mesh(
        new THREE.PlaneGeometry(0.18, 1.2),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(0, 0.06, c);
      cialGroup.add(stripe);
    }

    // Terminal Building (Curved Aerodynamic Wing with Glass)
    const terminalMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3, metalness: 0.6 });
    const terminal = new THREE.Mesh(new THREE.BoxGeometry(5.0, 1.4, 3.2), terminalMat);
    terminal.position.set(-4.5, 0.7, 0);
    terminal.castShadow = true;
    cialGroup.add(terminal);

    // Air Traffic Control Tower
    const atcShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 4.0, 12), terminalMat);
    atcShaft.position.set(-4.5, 2.0, 3.0);
    atcShaft.castShadow = true;
    cialGroup.add(atcShaft);

    const atcCab = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.6, 0.8, 12),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, transparent: true, opacity: 0.85 })
    );
    atcCab.position.set(-4.5, 4.0, 3.0);
    cialGroup.add(atcCab);

    // Rotating Radar Beacon atop CIAL tower
    const radar = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.15, 0.1), new THREE.MeshBasicMaterial({ color: 0xeab308 }));
    radar.position.set(-4.5, 4.6, 3.0);
    cialGroup.add(radar);
    cialRadarRef.current = radar;

    // Vast Agrivoltaic Solar Panel Farm (Grid of 50 MW arrays)
    const solarFarmGroup = new THREE.Group();
    solarFarmGroup.position.set(3.8, 0, -4);
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 5; col++) {
        const panel = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.05, 0.6), solarPanelMat);
        panel.position.set(col * 1.1, 0.25, row * 0.9);
        panel.rotation.x = -0.2;
        panel.castShadow = true;
        solarFarmGroup.add(panel);

        // Agrivoltaic green vegetable crops beneath panels
        const crop = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 6, 6),
          new THREE.MeshStandardMaterial({ color: 0x4ade80 })
        );
        crop.position.set(col * 1.1, 0.08, row * 0.9);
        solarFarmGroup.add(crop);
      }
    }
    cialGroup.add(solarFarmGroup);

    scene.add(cialGroup);

    // =========================================================================
    // 3D LANDMARK 3: KOCHI WATER METRO & MARINE DRIVE
    // =========================================================================
    const waterMetroGroup = new THREE.Group();
    waterMetroGroup.position.set(-1, 1.0, -1);

    // Marine Drive Promenade Walkway & Seawall
    const promGeo = new THREE.BoxGeometry(2.0, 0.4, 16);
    const promMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.6 });
    const promenade = new THREE.Mesh(promGeo, promMat);
    promenade.position.set(0.8, -0.1, 0);
    promenade.receiveShadow = true;
    waterMetroGroup.add(promenade);

    // Floating Pontoon Ferry Terminal Station
    const pontoonGeo = new THREE.BoxGeometry(3.2, 0.35, 1.8);
    const pontoonMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4, metalness: 0.3 });
    const pontoon = new THREE.Mesh(pontoonGeo, pontoonMat);
    pontoon.position.set(-1.4, -0.1, 0);
    pontoon.castShadow = true;
    waterMetroGroup.add(pontoon);

    // Canopy of Water Metro Terminal
    const canopy = new THREE.Mesh(new THREE.ConeGeometry(2.2, 0.6, 4), solarPanelMat);
    canopy.rotation.y = Math.PI / 4;
    canopy.position.set(-1.4, 1.0, 0);
    waterMetroGroup.add(canopy);

    // Electric Hybrid Catamaran Ferry Boat (Animated)
    const boat = new THREE.Group();
    boat.position.set(-3.8, -0.2, 0);

    // Catamaran twin hulls
    const hullMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const hullL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.4, 2.4), hullMat);
    hullL.position.x = -0.5;
    const hullR = hullL.clone();
    hullR.position.x = 0.5;
    boat.add(hullL);
    boat.add(hullR);

    // Cabin superstructure (Teal water metro branding)
    const cabinMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.2 });
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 1.6), cabinMat);
    cabin.position.y = 0.35;
    boat.add(cabin);

    // Rooftop Solar on Boat
    const boatSolar = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.05, 1.2), solarPanelMat);
    boatSolar.position.y = 0.65;
    boat.add(boatSolar);

    waterMetroGroup.add(boat);
    electricBoatRef.current = boat;

    scene.add(waterMetroGroup);

    // =========================================================================
    // 3D LANDMARK 4: INFOPARK & SMARTCITY IT TECH CORRIDOR
    // =========================================================================
    const infoParkGroup = new THREE.Group();
    infoParkGroup.position.set(18, 2.8, -9);

    const itGlassMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      roughness: 0.15,
      metalness: 0.85,
    });
    const itFrameMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.5 });

    // Cluster of 4 Modern IT Skyscraper Towers
    const towerHeights = [5.5, 4.2, 6.2, 3.8];
    const towerOffsets = [
      { x: -1.2, z: -1.2 },
      { x: 1.4, z: -0.8 },
      { x: 0.2, z: 1.4 },
      { x: -1.6, z: 1.6 },
    ];

    towerHeights.forEach((h, idx) => {
      const pos = towerOffsets[idx];
      const towerBody = new THREE.Mesh(new THREE.BoxGeometry(1.6, h, 1.6), itGlassMat);
      towerBody.position.set(pos.x, h / 2, pos.z);
      towerBody.castShadow = true;
      towerBody.receiveShadow = true;
      infoParkGroup.add(towerBody);

      // Rooftop solar & chiller cooling plant
      const roofChiller = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.4, 8), itFrameMat);
      roofChiller.position.set(pos.x, h + 0.2, pos.z);
      infoParkGroup.add(roofChiller);

      // Window luminescent bands
      for (let y = 0.8; y < h - 0.5; y += 0.9) {
        const band = new THREE.Mesh(new THREE.BoxGeometry(1.64, 0.1, 1.64), new THREE.MeshBasicMaterial({ color: 0xc4b5fd }));
        band.position.set(pos.x, y, pos.z);
        infoParkGroup.add(band);
      }
    });

    scene.add(infoParkGroup);

    // =========================================================================
    // 3D LANDMARK 5: COCHIN PORT & VALLARPADAM ICTT
    // =========================================================================
    const portGroup = new THREE.Group();
    portGroup.position.set(-8, 1.2, 2);

    // Dock Wharf Quayside
    const wharfGeo = new THREE.BoxGeometry(12, 0.4, 4);
    const wharfMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
    const wharf = new THREE.Mesh(wharfGeo, wharfMat);
    wharf.receiveShadow = true;
    portGroup.add(wharf);

    // Container Gantry RMG Cranes (Orange & White Rail-Mounted)
    const craneMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.4 });
    for (let c = -3.5; c <= 3.5; c += 3.5) {
      const crane = new THREE.Group();
      crane.position.set(c, 0, -1.2);

      // Crane legs
      const legL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 3.8, 0.15), craneMat);
      legL.position.set(-0.8, 1.9, 0);
      const legR = legL.clone();
      legR.position.x = 0.8;
      crane.add(legL);
      crane.add(legR);

      // Top boom cantilever
      const boom = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.25, 0.4), craneMat);
      boom.position.set(0, 3.8, 0);
      crane.add(boom);

      portGroup.add(crane);
    }

    // Container Ship Berthed at Wharf
    const ship = new THREE.Group();
    ship.position.set(0, -0.6, -3.2);

    const shipHullMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
    const shipHull = new THREE.Mesh(new THREE.BoxGeometry(8.5, 1.2, 2.2), shipHullMat);
    ship.add(shipHull);

    // Stacked colorful shipping containers on deck
    const containerColors = [0xef4444, 0x3b82f6, 0x10b981, 0xf59e0b];
    for (let cx = -2.8; cx <= 2.8; cx += 1.4) {
      for (let cz = -0.5; cz <= 0.5; cz += 1.0) {
        const box = new THREE.Mesh(
          new THREE.BoxGeometry(1.2, 0.5, 0.8),
          new THREE.MeshStandardMaterial({ color: containerColors[Math.floor(Math.random() * containerColors.length)] })
        );
        box.position.set(cx, 0.85, cz);
        ship.add(box);
      }
    }

    // High-Voltage Shore Connection (HVSC Cold-Ironing Power Conduit)
    const cableMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const shoreCable = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2), cableMat);
    shoreCable.rotation.x = Math.PI / 4;
    shoreCable.position.set(0, 0.4, -1.8);
    portGroup.add(shoreCable);

    portGroup.add(ship);
    scene.add(portGroup);

    // =========================================================================
    // 3D LANDMARK 6: FORT KOCHI & CHINESE FISHING NETS (CHEENA VALA)
    // =========================================================================
    const fortKochiGroup = new THREE.Group();
    fortKochiGroup.position.set(-18, 1.0, 6);

    // Traditional Cantilever Wooden Chinese Fishing Nets (Cheena Vala) along water edge
    const timberMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    const netMeshMat = new THREE.MeshBasicMaterial({ color: 0xfef08a, wireframe: true, transparent: true, opacity: 0.6 });

    for (let n = -2; n <= 2; n += 2) {
      const netGroup = new THREE.Group();
      netGroup.position.set(-1.8, 0, n * 2.2);

      // Cantilever wooden fulcrum arms reaching out over water
      const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 3.2), timberMat);
      arm1.rotation.z = -Math.PI / 3;
      arm1.position.set(-1.2, 1.3, 0);
      netGroup.add(arm1);

      // Spider-web mesh net dipping into the water
      const netMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.6, 6, 6), netMeshMat);
      netMesh.rotation.x = -Math.PI / 3;
      netMesh.position.set(-2.5, 0.3, 0);
      netGroup.add(netMesh);

      // Counterweight stones (solar mechanized in modern present)
      const stoneMat = new THREE.MeshStandardMaterial({ color: 0x57534e });
      const stone = new THREE.Mesh(new THREE.DodecahedronGeometry(0.25), stoneMat);
      stone.position.set(0.4, 0.6, 0);
      netGroup.add(stone);

      fortKochiGroup.add(netGroup);
    }

    // Colonial Heritage Cottages (Terracotta roofs & whitewashed walls)
    for (let h = -1.5; h <= 1.5; h += 1.5) {
      const cottage = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.1, 1.6), rsetBaseMat);
      cottage.position.set(1.4, 0.55, h * 2.2);
      cottage.castShadow = true;
      fortKochiGroup.add(cottage);

      const cottageRoof = new THREE.Mesh(new THREE.ConeGeometry(1.6, 0.6, 4), rsetRoofMat);
      cottageRoof.rotation.y = Math.PI / 4;
      cottageRoof.position.set(1.4, 1.4, h * 2.2);
      fortKochiGroup.add(cottageRoof);
    }

    scene.add(fortKochiGroup);

    // =========================================================================
    // 3D LOCATION BEACON PINS (Clickable Hotspots for all 6 Locations)
    // =========================================================================
    const pins: { id: string; group: THREE.Group; mesh: THREE.Mesh }[] = [];

    KOCHI_LOCATIONS.forEach((loc) => {
      const pinGroup = new THREE.Group();
      pinGroup.position.set(loc.position3D[0], loc.position3D[1] + 3.0, loc.position3D[2]);

      // Glowing Diamond Marker
      const pinMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(loc.color),
        emissive: new THREE.Color(loc.color),
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.8,
      });

      const pinMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.55), pinMat);
      pinMesh.castShadow = true;
      pinGroup.add(pinMesh);

      // Glowing vertical beacon beam downward to ground
      const beamGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.0);
      const beamMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(loc.color),
        transparent: true,
        opacity: 0.45,
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.y = -1.5;
      pinGroup.add(beam);

      // Concentric pulsing ground radar rings
      const ringGeo = new THREE.RingGeometry(0.4, 0.9, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(loc.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = -2.95;
      pinGroup.add(ring);

      scene.add(pinGroup);
      pins.push({ id: loc.id, group: pinGroup, mesh: pinMesh });
    });
    pinMeshesRef.current = pins;

    // =========================================================================
    // AMBIENT ATMOSPHERIC PARTICLES (Dust motes & ocean mist)
    // =========================================================================
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let p = 0; p < particleCount; p++) {
      particlePositions[p * 3] = (Math.random() - 0.5) * 60;
      particlePositions[p * 3 + 1] = Math.random() * 15 + 0.5;
      particlePositions[p * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xffd580,
      size: 0.25,
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // =========================================================================
    // MOUSE & TOUCH CONTROLS FOR INTERACTIVITY
    // =========================================================================
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      prevMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseVec.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVec.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (!isDragging.current || isGuidedMode) return;

      const deltaX = e.clientX - prevMousePos.current.x;
      const deltaY = e.clientY - prevMousePos.current.y;
      prevMousePos.current = { x: e.clientX, y: e.clientY };

      // Orbit camera around currentLookAt
      orbitSpherical.current.theta -= deltaX * 0.005;
      orbitSpherical.current.phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, orbitSpherical.current.phi - deltaY * 0.005));

      const offset = new THREE.Vector3().setFromSpherical(orbitSpherical.current);
      camera.position.copy(currentLookAt.current).add(offset);
      camera.lookAt(currentLookAt.current);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    // Raycast click detection on 3D pin beacons
    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clickX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const clickY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(new THREE.Vector2(clickX, clickY), camera);
      const meshesToTest = pinMeshesRef.current.map((p) => p.mesh);
      const intersects = raycaster.current.intersectObjects(meshesToTest);

      if (intersects.length > 0) {
        const hit = pinMeshesRef.current.find((p) => p.mesh === intersects[0].object);
        if (hit) {
          const loc = KOCHI_LOCATIONS.find((l) => l.id === hit.id);
          if (loc) onSelectLocation(loc);
        }
      }
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('click', handleClick);

    // Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // =========================================================================
    // RENDER ANIMATION LOOP
    // =========================================================================
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Animate water subtle wave motion
      if (waterMeshRef.current && !isReducedMotion) {
        waterMeshRef.current.position.y = 0.05 + Math.sin(elapsed * 1.2) * 0.03;
      }

      // Animate Electric Water Metro Catamaran ferry cruising back and forth
      if (electricBoatRef.current && !isReducedMotion) {
        const boatCycle = Math.sin(elapsed * 0.4);
        electricBoatRef.current.position.z = boatCycle * 3.5;
        electricBoatRef.current.rotation.y = boatCycle > 0 ? 0 : Math.PI;
      }

      // Animate CIAL Radar rotation
      if (cialRadarRef.current) {
        cialRadarRef.current.rotation.y += 0.04;
      }

      // Animate 3D Pin Beacon hovering and pulsing
      pinMeshesRef.current.forEach((pin, idx) => {
        pin.mesh.rotation.y += 0.02;
        pin.mesh.position.y = Math.sin(elapsed * 2 + idx) * 0.2;
      });

      // Camera Smooth Interpolation in Guided Odyssey Mode
      if (isGuidedMode) {
        const lerpFactor = isReducedMotion ? 0.08 : 0.045;
        camera.position.lerp(targetCamPos.current, lerpFactor);
        currentLookAt.current.lerp(targetLookAt.current, lerpFactor);
        camera.lookAt(currentLookAt.current);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);

      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [isGuidedMode, isReducedMotion]);

  return <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing select-none" />;
};
