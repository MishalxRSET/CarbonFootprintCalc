import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { CITADEL_MONUMENTS, CitadelMonument } from '../data/citadelMonuments';
import { ambientSound } from '../utils/ambientAudio';

export type TimeOfDay = 'golden_hour' | 'dawn' | 'night';

interface CitadelThreeSceneProps {
  activeMonument: CitadelMonument | null;
  onSelectMonument: (monument: CitadelMonument) => void;
  isGuidedMode: boolean;
  timeOfDay: TimeOfDay;
  isReducedMotion: boolean;
}

export const CitadelThreeScene: React.FC<CitadelThreeSceneProps> = ({
  activeMonument,
  onSelectMonument,
  isGuidedMode,
  timeOfDay,
  isReducedMotion,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Camera interpolation state
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 24, 34));
  const targetCamLook = useRef<THREE.Vector3>(new THREE.Vector3(0, 2, 0));
  const currentCamLook = useRef<THREE.Vector3>(new THREE.Vector3(0, 2, 0));

  // Raycaster for clicking 3D monuments
  const raycaster = useRef(new THREE.Raycaster());
  const mousePos = useRef(new THREE.Vector2());
  const interactiveMeshes = useRef<{ mesh: THREE.Object3D; monument: CitadelMonument }[]>([]);

  // Orbit control state for Free Exploration
  const isDragging = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });
  const sphericalCoords = useRef({ radius: 38, theta: 0.2, phi: 1.1 });

  // Floating waypoint 2D screen coordinates for DOM tags
  const [screenWaypoints, setScreenWaypoints] = useState<
    { id: string; x: number; y: number; visible: boolean; monument: CitadelMonument }[]
  >([]);

  // Lighting & Atmospheric Colors by TimeOfDay
  const atmosphericSettings = {
    golden_hour: {
      sky: 0x211710,
      fog: 0x281c14,
      fogDensity: 0.015,
      sunLight: 0xffdfa8,
      ambient: 0x4a3a2d,
      groundColor: 0x826a4e,
    },
    dawn: {
      sky: 0x121c19,
      fog: 0x15221e,
      fogDensity: 0.018,
      sunLight: 0xfff0d4,
      ambient: 0x2d433b,
      groundColor: 0x5a6d59,
    },
    night: {
      sky: 0x080c09,
      fog: 0x0c120e,
      fogDensity: 0.016,
      sunLight: 0x6495ed,
      ambient: 0x17231c,
      groundColor: 0x223023,
    },
  };

  // Setup Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const currentAtmosphere = atmosphericSettings[timeOfDay];
    scene.background = new THREE.Color(currentAtmosphere.sky);
    scene.fog = new THREE.FogExp2(currentAtmosphere.fog, currentAtmosphere.fogDensity);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 300);
    camera.position.set(0, 24, 36);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(currentAtmosphere.ambient, 1.8);
    ambientLight.name = 'ambientLight';
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(currentAtmosphere.sunLight, 2.5);
    dirLight.name = 'sunLight';
    dirLight.position.set(30, 45, 25);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 120;
    dirLight.shadow.camera.left = -40;
    dirLight.shadow.camera.right = 40;
    dirLight.shadow.camera.top = 40;
    dirLight.shadow.camera.bottom = -40;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    // Ground Plane (Desert / Stone Plateau)
    const groundGeo = new THREE.PlaneGeometry(240, 240, 40, 40);
    // Add subtle procedural dunes / elevation to the perimeter
    const posAttr = groundGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const distFromCenter = Math.sqrt(x * x + y * y);
      if (distFromCenter > 35) {
        const elevation = Math.sin(x * 0.05) * Math.cos(y * 0.05) * 3 + (distFromCenter - 35) * 0.08;
        posAttr.setZ(i, elevation);
      }
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      color: currentAtmosphere.groundColor,
      roughness: 0.9,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.2;
    ground.receiveShadow = true;
    ground.name = 'groundMesh';
    scene.add(ground);

    // ==========================================
    // PERSEPOLIS-STYLE MONUMENTAL ARCHITECTURE
    // ==========================================

    // 1. Central Monumental Terrace (Stepped Stone Citadel Platform)
    const terraceGroup = new THREE.Group();

    // Base Tier
    const baseGeo = new THREE.BoxGeometry(64, 1.2, 54);
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0xd9cbb5,
      roughness: 0.85,
      metalness: 0.05,
    });
    const baseMesh = new THREE.Mesh(baseGeo, stoneMat);
    baseMesh.position.y = 0.6;
    baseMesh.receiveShadow = true;
    baseMesh.castShadow = true;
    terraceGroup.add(baseMesh);

    // Upper Tier with paved paver pattern
    const upperGeo = new THREE.BoxGeometry(56, 1.0, 46);
    const upperMat = new THREE.MeshStandardMaterial({
      color: 0xecdcc5,
      roughness: 0.78,
      metalness: 0.08,
    });
    const upperMesh = new THREE.Mesh(upperGeo, upperMat);
    upperMesh.position.y = 1.6;
    upperMesh.receiveShadow = true;
    upperMesh.castShadow = true;
    terraceGroup.add(upperMesh);

    // Grand Persepolis-style dual-flight ceremonial staircase at the front (+Z)
    for (let step = 0; step < 8; step++) {
      const stepGeo = new THREE.BoxGeometry(14, 0.2, 0.8);
      const stepMesh = new THREE.Mesh(stepGeo, stoneMat);
      stepMesh.position.set(0, 0.1 + step * 0.2, 27 + (7 - step) * 0.8);
      stepMesh.receiveShadow = true;
      stepMesh.castShadow = true;
      terraceGroup.add(stepMesh);
    }

    // 2. Colonnade of Planetary Balance (Fluted Classical Columns reminiscent of Apadana)
    const columnPositions: [number, number][] = [
      [-22, -18],
      [-22, -6],
      [-22, 6],
      [-22, 18],
      [22, -18],
      [22, -6],
      [22, 6],
      [22, 18],
      [-10, -18],
      [0, -18],
      [10, -18],
      [-10, 18],
      [0, 18],
      [10, 18],
    ];

    const columnMat = new THREE.MeshStandardMaterial({
      color: 0xe5d7c3,
      roughness: 0.75,
      metalness: 0.15,
    });

    const capitalGoldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.35,
      metalness: 0.7,
    });

    columnPositions.forEach(([cx, cz]) => {
      const colGroup = new THREE.Group();
      colGroup.position.set(cx, 2.1, cz);

      // Fluted column shaft
      const shaftGeo = new THREE.CylinderGeometry(0.55, 0.65, 7.5, 16);
      const shaft = new THREE.Mesh(shaftGeo, columnMat);
      shaft.position.y = 3.75;
      shaft.castShadow = true;
      shaft.receiveShadow = true;
      colGroup.add(shaft);

      // Base pedestal
      const pedGeo = new THREE.BoxGeometry(1.6, 0.6, 1.6);
      const ped = new THREE.Mesh(pedGeo, stoneMat);
      ped.position.y = 0.3;
      ped.castShadow = true;
      ped.receiveShadow = true;
      colGroup.add(ped);

      // Persepolis Double-Bull Capital & Golden Crown
      const capGeo = new THREE.BoxGeometry(1.8, 0.8, 1.8);
      const cap = new THREE.Mesh(capGeo, capitalGoldMat);
      cap.position.y = 7.7;
      cap.castShadow = true;
      colGroup.add(cap);

      terraceGroup.add(colGroup);
    });

    scene.add(terraceGroup);

    // ==========================================
    // 6 DEDICATED ARCHITECTURAL MONUMENTS
    // ==========================================
    interactiveMeshes.current = [];

    CITADEL_MONUMENTS.forEach((mon) => {
      const group = new THREE.Group();
      group.position.set(mon.position3D[0], mon.position3D[1], mon.position3D[2]);

      // Foundation Plinth for each monument
      const plinthGeo = new THREE.CylinderGeometry(3.8, 4.2, 0.8, 16);
      const plinthMat = new THREE.MeshStandardMaterial({
        color: 0xcfc0aa,
        roughness: 0.8,
      });
      const plinth = new THREE.Mesh(plinthGeo, plinthMat);
      plinth.receiveShadow = true;
      plinth.castShadow = true;
      group.add(plinth);

      // Custom visual geometry per monument
      if (mon.id === 'bhadla-solar') {
        // Photovoltaic Solar Arrays
        const solarMat = new THREE.MeshStandardMaterial({
          color: 0x1a3350,
          roughness: 0.15,
          metalness: 0.85,
        });
        const frameMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.6 });

        for (let row = -1; row <= 1; row++) {
          for (let col = -1; col <= 1; col++) {
            const panel = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.1, 1.4), solarMat);
            panel.position.set(col * 2.6, 1.8, row * 2.2);
            panel.rotation.x = -0.45; // Tilted toward celestial sun
            panel.castShadow = true;
            panel.receiveShadow = true;
            group.add(panel);

            const pStand = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.5), frameMat);
            pStand.position.set(col * 2.6, 0.8, row * 2.2);
            pStand.castShadow = true;
            group.add(pStand);
          }
        }
      } else if (mon.id === 'atmospheric-obelisk') {
        // The Keeling Obelisk & Levitating Carbon Sphere
        const obeliskGeo = new THREE.CylinderGeometry(0.8, 1.4, 9, 4);
        const obeliskMat = new THREE.MeshStandardMaterial({
          color: 0x1f2922,
          roughness: 0.4,
          metalness: 0.6,
        });
        const obelisk = new THREE.Mesh(obeliskGeo, obeliskMat);
        obelisk.position.y = 4.5;
        obelisk.rotation.y = Math.PI / 4;
        obelisk.castShadow = true;
        group.add(obelisk);

        // Levitating Atmosphere Sphere
        const sphereGeo = new THREE.IcosahedronGeometry(1.6, 2);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: 0x78b169,
          wireframe: true,
          emissive: 0x22481e,
          emissiveIntensity: 0.6,
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        sphere.position.y = 10.5;
        sphere.name = 'atmosphericSphere';
        group.add(sphere);
      } else if (mon.id === 'transit-gateway') {
        // Monumental Gateway of Clean Velocity
        const archMat = new THREE.MeshStandardMaterial({ color: 0xd9cca9, roughness: 0.7 });
        const trackMat = new THREE.MeshStandardMaterial({
          color: 0x0284c7,
          metalness: 0.8,
          roughness: 0.2,
          emissive: 0x0369a1,
          emissiveIntensity: 0.3,
        });

        // Twin gate towers
        const tower1 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 6.5, 1.8), archMat);
        tower1.position.set(-2.2, 3.2, 0);
        tower1.castShadow = true;
        group.add(tower1);

        const tower2 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 6.5, 1.8), archMat);
        tower2.position.set(2.2, 3.2, 0);
        tower2.castShadow = true;
        group.add(tower2);

        // Lintel arch
        const lintel = new THREE.Mesh(new THREE.BoxGeometry(6.2, 1.2, 2.0), archMat);
        lintel.position.set(0, 6.8, 0);
        lintel.castShadow = true;
        group.add(lintel);

        // Transit Viaduct
        const track = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.4, 0.9), trackMat);
        track.position.set(0, 3.8, 0);
        track.castShadow = true;
        group.add(track);
      } else if (mon.id === 'biosphere-terraces') {
        // Terraced Hanging Garden
        const planterMat = new THREE.MeshStandardMaterial({ color: 0xcab99f, roughness: 0.9 });
        const foliageMat = new THREE.MeshStandardMaterial({ color: 0x3d6b35, roughness: 0.85 });

        for (let t = 0; t < 3; t++) {
          const tier = new THREE.Mesh(new THREE.CylinderGeometry(3.2 - t * 0.8, 3.6 - t * 0.8, 0.7, 12), planterMat);
          tier.position.y = 0.8 + t * 0.8;
          tier.castShadow = true;
          tier.receiveShadow = true;
          group.add(tier);

          // Canopy domes
          for (let f = 0; f < 4; f++) {
            const angle = (f / 4) * Math.PI * 2;
            const foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(0.7 - t * 0.1), foliageMat);
            foliage.position.set(Math.cos(angle) * (2.2 - t * 0.6), 1.6 + t * 0.8, Math.sin(angle) * (2.2 - t * 0.6));
            foliage.castShadow = true;
            group.add(foliage);
          }
        }
      } else if (mon.id === 'circular-foundry') {
        // Domed Rotunda & Kiln
        const kilnMat = new THREE.MeshStandardMaterial({ color: 0xc49b76, roughness: 0.75 });
        const coreMat = new THREE.MeshStandardMaterial({
          color: 0xf97316,
          emissive: 0xea580c,
          emissiveIntensity: 0.8,
          roughness: 0.2,
        });

        const drum = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.9, 3.5, 16), kilnMat);
        drum.position.y = 2.0;
        drum.castShadow = true;
        drum.receiveShadow = true;
        group.add(drum);

        const dome = new THREE.Mesh(new THREE.SphereGeometry(2.4, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), kilnMat);
        dome.position.y = 3.7;
        dome.castShadow = true;
        group.add(dome);

        // Glowing heat core
        const core = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.25, 8, 24), coreMat);
        core.rotation.x = Math.PI / 2;
        core.position.y = 2.2;
        group.add(core);
      } else {
        // Imperial Treasury
        const treasuryMat = new THREE.MeshStandardMaterial({ color: 0xdad0bd, roughness: 0.7 });
        const goldVaultMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.2 });

        const hall = new THREE.Mesh(new THREE.BoxGeometry(5.2, 4.2, 4.4), treasuryMat);
        hall.position.y = 2.4;
        hall.castShadow = true;
        hall.receiveShadow = true;
        group.add(hall);

        const roof = new THREE.Mesh(new THREE.ConeGeometry(3.6, 1.8, 4), treasuryMat);
        roof.rotation.y = Math.PI / 4;
        roof.position.y = 5.2;
        roof.castShadow = true;
        group.add(roof);

        // Golden Cuneiform Tablet Archive
        const tablet = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.8, 0.3), goldVaultMat);
        tablet.position.set(0, 2.2, 2.4);
        tablet.castShadow = true;
        group.add(tablet);
      }

      // Floating Waypoint Beacon (Hovering diamond & ring)
      const beaconGroup = new THREE.Group();
      beaconGroup.position.y = 8.8;
      beaconGroup.name = `beacon_${mon.id}`;

      const ringGeo = new THREE.TorusGeometry(1.1, 0.08, 8, 24);
      const ringMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(mon.color),
        emissive: new THREE.Color(mon.color),
        emissiveIntensity: 0.7,
        roughness: 0.2,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      beaconGroup.add(ring);

      const diamondGeo = new THREE.OctahedronGeometry(0.65, 0);
      const diamond = new THREE.Mesh(diamondGeo, ringMat);
      diamond.position.y = 0;
      beaconGroup.add(diamond);

      group.add(beaconGroup);

      // Register for raycasting clicks
      interactiveMeshes.current.push({ mesh: group, monument: mon });
      scene.add(group);
    });

    // Atmospheric Floating Particle Motes (Dust & Celestial Light)
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    const pVelocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 80;
      pPositions[i * 3 + 1] = Math.random() * 32 + 0.5;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 80;

      pVelocities[i * 3] = (Math.random() - 0.5) * 0.02;
      pVelocities[i * 3 + 1] = Math.random() * 0.015 + 0.005;
      pVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xfef08a,
      size: 0.35,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    particleSystem.name = 'particleDust';
    scene.add(particleSystem);

    // ==========================================
    // RENDER & ANIMATION LOOP
    // ==========================================
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Animate atmospheric dust
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += pVelocities[i * 3 + 1];
        positions[i * 3] += Math.sin(elapsed * 0.5 + i) * 0.01;

        // Wrap around top
        if (positions[i * 3 + 1] > 32) {
          positions[i * 3 + 1] = 0.5;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Animate Beacon diamonds & rings
      CITADEL_MONUMENTS.forEach((mon) => {
        const beacon = scene.getObjectByName(`beacon_${mon.id}`);
        if (beacon) {
          beacon.rotation.y += 0.012;
          beacon.position.y = 8.8 + Math.sin(elapsed * 2 + mon.position3D[0]) * 0.4;
        }
      });

      // Animate levitating sphere
      const sphere = scene.getObjectByName('atmosphericSphere');
      if (sphere) {
        sphere.rotation.y += 0.008;
        sphere.rotation.x += 0.005;
      }

      // Smooth Camera Glide (Persepolis Cinematic Interpolation)
      if (cameraRef.current) {
        const cam = cameraRef.current;
        const lerpFactor = isReducedMotion ? 0.2 : 0.045;

        // Position Lerp
        cam.position.lerp(targetCamPos.current, lerpFactor);

        // Target LookAt Lerp
        currentCamLook.current.lerp(targetCamLook.current, lerpFactor);
        cam.lookAt(currentCamLook.current);

        // Calculate 2D Screen Positions for Interactive Waypoints
        const wpCoordinates = CITADEL_MONUMENTS.map((mon) => {
          const v = new THREE.Vector3(mon.position3D[0], mon.position3D[1] + 9.5, mon.position3D[2]);
          v.project(cam);

          // Check if behind camera
          const isVisible = v.z < 1.0;
          const x = ((v.x + 1) / 2) * width;
          const y = ((-v.y + 1) / 2) * height;

          return {
            id: mon.id,
            x,
            y,
            visible: isVisible,
            monument: mon,
          };
        });

        setScreenWaypoints(wpCoordinates);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Responsive window resize
    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Update atmosphere lighting when timeOfDay changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const currentAtmosphere = atmosphericSettings[timeOfDay];
    scene.background = new THREE.Color(currentAtmosphere.sky);
    if (scene.fog) {
      (scene.fog as THREE.FogExp2).color.set(currentAtmosphere.fog);
    }

    const amb = scene.getObjectByName('ambientLight') as THREE.AmbientLight | undefined;
    if (amb) {
      amb.color.set(currentAtmosphere.ambient);
    }

    const sun = scene.getObjectByName('sunLight') as THREE.DirectionalLight | undefined;
    if (sun) {
      sun.color.set(currentAtmosphere.sunLight);
    }

    const ground = scene.getObjectByName('groundMesh') as THREE.Mesh | undefined;
    if (ground && ground.material) {
      (ground.material as THREE.MeshStandardMaterial).color.set(currentAtmosphere.groundColor);
    }
  }, [timeOfDay]);

  // Update target camera position when activeMonument changes
  useEffect(() => {
    if (activeMonument) {
      targetCamPos.current.set(
        activeMonument.cameraPosition.x,
        activeMonument.cameraPosition.y,
        activeMonument.cameraPosition.z
      );
      targetCamLook.current.set(
        activeMonument.cameraTarget.x,
        activeMonument.cameraTarget.y,
        activeMonument.cameraTarget.z
      );
      ambientSound.playBellStrike(432);
    } else {
      // Default grand panoramic aerial vista of the citadel
      targetCamPos.current.set(0, 24, 38);
      targetCamLook.current.set(0, 2, 0);
    }
  }, [activeMonument]);

  // Mouse drag Orbit Controls for Free Exploration Mode
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isGuidedMode) return;
    isDragging.current = true;
    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || isGuidedMode) return;

    const dx = e.clientX - prevMousePos.current.x;
    const dy = e.clientY - prevMousePos.current.y;
    prevMousePos.current = { x: e.clientX, y: e.clientY };

    sphericalCoords.current.theta -= dx * 0.005;
    sphericalCoords.current.phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, sphericalCoords.current.phi - dy * 0.005));

    const { radius, theta, phi } = sphericalCoords.current;
    targetCamPos.current.x = radius * Math.sin(phi) * Math.sin(theta);
    targetCamPos.current.y = radius * Math.cos(phi);
    targetCamPos.current.z = radius * Math.sin(phi) * Math.cos(theta);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (isGuidedMode) return;
    sphericalCoords.current.radius = Math.max(12, Math.min(65, sphericalCoords.current.radius + e.deltaY * 0.03));

    const { radius, theta, phi } = sphericalCoords.current;
    targetCamPos.current.x = radius * Math.sin(phi) * Math.sin(theta);
    targetCamPos.current.y = radius * Math.cos(phi);
    targetCamPos.current.z = radius * Math.sin(phi) * Math.cos(theta);
  };

  // Click on 3D canvas to Raycast select monuments
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = mountRef.current;
    if (!container || !cameraRef.current) return;

    const rect = container.getBoundingClientRect();
    mousePos.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mousePos.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.current.setFromCamera(mousePos.current, cameraRef.current);

    const meshes = interactiveMeshes.current.map((item) => item.mesh);
    const intersects = raycaster.current.intersectObjects(meshes, true);

    if (intersects.length > 0) {
      // Find matching monument
      let hit = intersects[0].object;
      while (hit.parent && hit.parent !== sceneRef.current) {
        const found = interactiveMeshes.current.find((item) => item.mesh === hit);
        if (found) {
          onSelectMonument(found.monument);
          return;
        }
        hit = hit.parent;
      }
      const foundRoot = interactiveMeshes.current.find((item) => item.mesh === hit);
      if (foundRoot) {
        onSelectMonument(foundRoot.monument);
      }
    }
  };

  return (
    <div
      ref={mountRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onClick={handleCanvasClick}
      className={`relative w-full h-full select-none overflow-hidden ${
        isGuidedMode ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
      }`}
    >
      {/* Floating 2D Waypoint Badges (Hovering in 3D Space like Persepolis Reimagined) */}
      {screenWaypoints.map((wp) => {
        if (!wp.visible) return null;
        const isSelected = activeMonument?.id === wp.id;

        return (
          <button
            key={wp.id}
            id={`waypoint-node-${wp.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectMonument(wp.monument);
            }}
            style={{
              transform: `translate(-50%, -100%) translate3d(${wp.x}px, ${wp.y}px, 0)`,
            }}
            className={`absolute top-0 left-0 transition-transform duration-75 group flex flex-col items-center pointer-events-auto z-20 focus:outline-none`}
          >
            {/* Pulsing Pin Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border backdrop-blur-md transition-all shadow-lg ${
                isSelected
                  ? 'bg-[#1D2B17] text-white border-[#D4AF37] ring-2 ring-[#D4AF37]/50 scale-110'
                  : 'bg-[#121812]/85 text-[#E6EFE3] border-white/20 hover:border-[#D4AF37] hover:scale-105'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full animate-ping"
                style={{ backgroundColor: wp.monument.emblemColor }}
              />
              <span className="font-mono text-[10px] font-bold text-[#D4AF37] tracking-wider">
                {wp.monument.romanNumeral}
              </span>
              <span className="text-xs font-serif font-medium whitespace-nowrap hidden sm:inline">
                {wp.monument.title.split(' ')[2] || wp.monument.title}
              </span>
            </div>

            {/* Glowing stalk line */}
            <div
              className="w-0.5 h-4 opacity-70"
              style={{
                background: `linear-gradient(to bottom, ${wp.monument.color}, transparent)`,
              }}
            />
          </button>
        );
      })}
    </div>
  );
};
