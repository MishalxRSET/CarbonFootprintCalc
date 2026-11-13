import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Sparkles,
  Orbit,
  Wind,
  Zap,
  RotateCw,
  Plus,
  Compass,
  Layers,
  Info,
  Maximize2,
  Minimize2,
  Flame,
  TreePine,
  Sun,
  ShieldAlert,
  X,
} from 'lucide-react';

export type FluxMode = 'flux' | 'boundary' | 'electrification' | 'sinks';

interface Hotspot {
  id: string;
  name: string;
  region: string;
  lat: number; // degrees -90 to +90
  lon: number; // degrees -180 to +180
  category: 'sink' | 'emission' | 'renewable' | 'tipping_point';
  co2Impact: string;
  metric: string;
  description: string;
  actionTip: string;
}

const BIOSIGNAL_HOTSPOTS: Hotspot[] = [
  {
    id: 'amazon',
    name: 'Amazon Rainforest Basin',
    region: 'South America (-3.4°, -62.2°)',
    lat: -3.4,
    lon: -62.2,
    category: 'sink',
    co2Impact: '-1.5 Gt CO₂e/yr',
    metric: 'Terrestrial Carbon Buffer: 123 Gt stored in biomass',
    description: 'Vital planetary biomass carbon sink vulnerable to prolonged droughts and agricultural deforestation.',
    actionTip: 'High-priority native reforestation & zero-deforestation supply chain enforcement required.',
  },
  {
    id: 'congo',
    name: 'Congo Peatland Forests',
    region: 'Central Africa (0.5°, 22.0°)',
    lat: 0.5,
    lon: 22.0,
    category: 'sink',
    co2Impact: '-0.7 Gt CO₂e/yr',
    metric: 'Peatland Reservoir: 30 Gt carbon in moist soils',
    description: 'The Cuvette Centrale peat complex locks carbon equivalent to 3 years of global fossil fuel burning.',
    actionTip: 'Hydrological preservation prevents irreversible peat oxidation into methane & carbon dioxide.',
  },
  {
    id: 'nordic',
    name: 'North Sea Offshore Wind Corridor',
    region: 'Northern Europe (55.0°, 4.5°)',
    lat: 55.0,
    lon: 4.5,
    category: 'renewable',
    co2Impact: '-180 Mt CO₂e/yr avoided',
    metric: 'Wind Density: 35 GW operational, 300 GW target by 2050',
    description: 'World-leading high-capacity offshore wind farms displacing coal and combined-cycle gas turbine grids.',
    actionTip: 'HVDC interconnector mesh across surrounding nations eliminates localized curtailment.',
  },
  {
    id: 'chur',
    name: 'Direct Air Capture & Geostorage',
    region: 'Southern Iceland (64.0°, -21.4°)',
    lat: 64.0,
    lon: -21.4,
    category: 'sink',
    co2Impact: '-36,000 t CO₂/yr permanent mineralization',
    metric: 'Carbfix Basaltic Reaction: 95% turns into solid rock within 2 yrs',
    description: 'Geothermally powered DAC facilities stripping ambient CO₂ from air and dissolving it into basalt strata.',
    actionTip: 'Scales with high-temperature geothermal wells and accessible reactive mafic basalt formations.',
  },
  {
    id: 'gobi',
    name: 'Gobi Desert Ultra-Solar Array',
    region: 'East Asia (40.2°, 105.5°)',
    lat: 40.2,
    lon: 105.5,
    category: 'renewable',
    co2Impact: '-320 Mt CO₂e/yr avoided',
    metric: 'Solar Irradiance: 100 GW Mega-Base grid',
    description: 'Massive gigawatt-scale desert photovoltaic installations feeding high-voltage direct current grid lines.',
    actionTip: 'Pairing desert PV with agrivoltaics and sand-stabilizing drought vegetation rehabilitates local soil.',
  },
  {
    id: 'permian',
    name: 'Permian Hydrocarbon Basin',
    region: 'North America (31.8°, -102.3°)',
    lat: 31.8,
    lon: -102.3,
    category: 'emission',
    co2Impact: '+520 Mt CO₂e/yr Scope 1-3',
    metric: 'Super-Emitter Volatility: Fugitive CH₄ plume density',
    description: 'Dense oil and gas extraction zone exhibiting extensive flaring and fugitive methane leaks.',
    actionTip: 'Continuous optical gas imaging (OGI), satellite leak detection, and vapor recovery systems eliminate >80% fugitive venting.',
  },
  {
    id: 'thwaites',
    name: 'Thwaites Ice Shelf Marine Boundary',
    region: 'West Antarctica (-75.5°, -106.7°)',
    lat: -75.5,
    lon: -106.7,
    category: 'tipping_point',
    co2Impact: 'Global Sea-Level Exposure: +65cm direct risk',
    metric: 'Circumpolar Deep Water intrusion warming under ice tongue',
    description: 'Critical Antarctic grounding line susceptible to irreversible collapse if atmospheric warming surpasses 1.5°C.',
    actionTip: 'Immediate global net-zero emissions trajectory needed to halt warm circumpolar ocean currents.',
  },
];

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  alpha: number;
  type: 'emission' | 'sink' | 'clean';
  orbitRadius: number;
  angle: number;
  speed: number;
  inclination: number;
  isUserAdded?: boolean;
}

export const AtmosphericCanvas: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // States
  const [fluxMode, setFluxMode] = useState<FluxMode>('flux');
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<Hotspot | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1.0); // 0.7x to 1.8x
  const [showMeshGrid, setShowMeshGrid] = useState(true);
  const [showAtmosphereRings, setShowAtmosphereRings] = useState(true);
  const [userInjectedCount, setUserInjectedCount] = useState(0);

  // Rotation angles (Euler angles for 3D globe)
  const rotationRef = useRef<{ yaw: number; pitch: number }>({ yaw: 0.35, pitch: 0.22 });
  const targetRotationRef = useRef<{ yaw: number; pitch: number }>({ yaw: 0.35, pitch: 0.22 });
  const zoomRef = useRef(1.0);
  zoomRef.current = zoomLevel;

  // Interaction tracking
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouseScreenRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const particlesRef = useRef<Particle[]>([]);
  const hotspotScreenCoordsRef = useRef<Array<{ hotspot: Hotspot; x: number; y: number; visible: boolean; radius: number }>>([]);
  const pulseRipplesRef = useRef<Array<{ x: number; y: number; maxRadius: number; currentRadius: number; color: string; alpha: number }>>([]);

  // Initialize particles
  useEffect(() => {
    const pList: Particle[] = [];
    const count = 110;

    for (let i = 0; i < count; i++) {
      const type: 'emission' | 'sink' | 'clean' =
        i % 3 === 0 ? 'emission' : i % 3 === 1 ? 'sink' : 'clean';
      const orbitRadius = 120 + Math.random() * 150;
      const angle = Math.random() * Math.PI * 2;
      const inclination = (Math.random() - 0.5) * Math.PI * 0.7;

      pList.push({
        x: 0,
        y: 0,
        z: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        radius: Math.random() * 2.2 + 1.2,
        alpha: Math.random() * 0.65 + 0.35,
        type,
        orbitRadius,
        angle,
        speed: (Math.random() * 0.007 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
        inclination,
      });
    }

    particlesRef.current = pList;
  }, []);

  // Inject a clean carbon-sink particle burst at cursor
  const handleInjectSink = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = mouseScreenRef.current.active ? mouseScreenRef.current.x : rect.width / 2;
    const cy = mouseScreenRef.current.active ? mouseScreenRef.current.y : rect.height / 2;

    pulseRipplesRef.current.push({
      x: cx,
      y: cy,
      maxRadius: 130,
      currentRadius: 5,
      color: 'rgba(82, 227, 91, 0.75)',
      alpha: 1,
    });

    for (let k = 0; k < 12; k++) {
      const angle = Math.random() * Math.PI * 2;
      const inclination = (Math.random() - 0.5) * Math.PI * 0.9;
      particlesRef.current.push({
        x: 0,
        y: 0,
        z: 0,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        vz: (Math.random() - 0.5) * 2,
        radius: Math.random() * 2.6 + 1.8,
        alpha: 0.95,
        type: 'sink',
        orbitRadius: 90 + Math.random() * 130,
        angle,
        speed: (Math.random() * 0.015 + 0.008) * (Math.random() > 0.5 ? 1 : -1),
        inclination,
        isUserAdded: true,
      });
    }
    setUserInjectedCount((prev) => prev + 12);
  }, []);

  // Main canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = entry.contentRect.width;
        height = entry.contentRect.height;
        dpr = window.devicePixelRatio || 1;

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
    });

    resizeObserver.observe(stage);

    let time = 0;

    const project3D = (
      latRad: number,
      lonRad: number,
      radius: number,
      yaw: number,
      pitch: number,
      centerX: number,
      centerY: number
    ) => {
      // 3D Cartesian on unit sphere
      let x = radius * Math.cos(latRad) * Math.sin(lonRad);
      let y = -radius * Math.sin(latRad);
      let z = radius * Math.cos(latRad) * Math.cos(lonRad);

      // Rotate Pitch (X axis)
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      const y1 = y * cosP - z * sinP;
      const z1 = y * sinP + z * cosP;

      // Rotate Yaw (Y axis)
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const x2 = x * cosY + z1 * sinY;
      const z2 = -x * sinY + z1 * cosY;

      // Perspective scale factor
      const fov = 650;
      const scale = fov / (fov + z2 * 0.7);

      return {
        screenX: centerX + x2 * scale,
        screenY: centerY + y1 * scale,
        z: z2,
        scale,
        visible: z2 > -radius * 0.15, // Front half of globe
      };
    };

    const render = () => {
      time += 0.015;

      if (!width || !height) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Smooth rotation interpolation
      if (isAutoRotating && !isDraggingRef.current) {
        targetRotationRef.current.yaw += 0.003;
      }
      rotationRef.current.yaw += (targetRotationRef.current.yaw - rotationRef.current.yaw) * 0.08;
      rotationRef.current.pitch += (targetRotationRef.current.pitch - rotationRef.current.pitch) * 0.08;

      // Clamp pitch to prevent pole inversion
      rotationRef.current.pitch = Math.max(-1.1, Math.min(1.1, rotationRef.current.pitch));

      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const baseEarthRadius = Math.min(width, height) * 0.23;
      const earthRadius = baseEarthRadius * zoomRef.current;

      const yaw = rotationRef.current.yaw;
      const pitch = rotationRef.current.pitch;

      // 1. Planetary Atmospheric Horizon & Ambient Glow
      const atmosGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        earthRadius * 0.8,
        centerX,
        centerY,
        earthRadius * 2.3
      );

      if (fluxMode === 'boundary') {
        atmosGradient.addColorStop(0, 'rgba(180, 80, 50, 0.35)');
        atmosGradient.addColorStop(0.5, 'rgba(140, 120, 81, 0.18)');
        atmosGradient.addColorStop(1, 'rgba(14, 23, 12, 0)');
      } else if (fluxMode === 'electrification') {
        atmosGradient.addColorStop(0, 'rgba(60, 180, 140, 0.38)');
        atmosGradient.addColorStop(0.5, 'rgba(90, 210, 160, 0.16)');
        atmosGradient.addColorStop(1, 'rgba(14, 23, 12, 0)');
      } else if (fluxMode === 'sinks') {
        atmosGradient.addColorStop(0, 'rgba(82, 227, 91, 0.42)');
        atmosGradient.addColorStop(0.5, 'rgba(74, 103, 65, 0.22)');
        atmosGradient.addColorStop(1, 'rgba(14, 23, 12, 0)');
      } else {
        atmosGradient.addColorStop(0, 'rgba(74, 103, 65, 0.38)');
        atmosGradient.addColorStop(0.5, 'rgba(120, 177, 105, 0.16)');
        atmosGradient.addColorStop(1, 'rgba(14, 23, 12, 0)');
      }

      ctx.fillStyle = atmosGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadius * 2.3, 0, Math.PI * 2);
      ctx.fill();

      // 2. Interactive Orbital Boundary Rings
      if (showAtmosphereRings) {
        const ringCount = fluxMode === 'boundary' ? 4 : 3;
        for (let r = 1; r <= ringCount; r++) {
          const ringRad = earthRadius + r * 34 * zoomRef.current + Math.sin(time * 1.5 + r) * 2;
          ctx.beginPath();
          ctx.arc(centerX, centerY, ringRad, 0, Math.PI * 2);
          ctx.strokeStyle =
            fluxMode === 'boundary' && r === 3
              ? 'rgba(235, 95, 75, 0.55)'
              : 'rgba(217, 228, 209, 0.18)';
          ctx.lineWidth = fluxMode === 'boundary' && r === 3 ? 1.8 : 1;
          ctx.setLineDash(r % 2 === 0 ? [5, 7] : [3, 5]);
          ctx.stroke();
          ctx.setLineDash([]);

          if (fluxMode === 'boundary' && r === 3) {
            ctx.font = '10px "JetBrains Mono", monospace';
            ctx.fillStyle = 'rgba(240, 110, 90, 0.9)';
            const text = '1.5°C CRITICAL OVERSHOOT [430 PPM]';
            ctx.fillText(text, centerX + ringRad - 60, centerY - 10);
          }
        }
      }

      // 3. Central 3D Globe Core (Spherical Shader & Depth)
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadius, 0, Math.PI * 2);
      const earthGrad = ctx.createRadialGradient(
        centerX - earthRadius * 0.35,
        centerY - earthRadius * 0.35,
        earthRadius * 0.15,
        centerX,
        centerY,
        earthRadius
      );
      earthGrad.addColorStop(0, '#263D22');
      earthGrad.addColorStop(0.65, '#142012');
      earthGrad.addColorStop(1, '#091008');
      ctx.fillStyle = earthGrad;
      ctx.fill();

      // Globe Outer Rim
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = 'rgba(120, 177, 105, 0.45)';
      ctx.stroke();

      // 4. Realistic 3D Orbital Latitude & Longitude Wireframe Grid
      if (showMeshGrid) {
        ctx.lineWidth = 0.8;

        // Latitude circles (-75° to +75° in 15° increments)
        for (let latDeg = -75; latDeg <= 75; latDeg += 25) {
          const latRad = (latDeg * Math.PI) / 180;
          ctx.beginPath();
          let started = false;
          for (let lonDeg = -180; lonDeg <= 180; lonDeg += 10) {
            const lonRad = (lonDeg * Math.PI) / 180;
            const p = project3D(latRad, lonRad, earthRadius, yaw, pitch, centerX, centerY);
            if (p.visible) {
              if (!started) {
                ctx.moveTo(p.screenX, p.screenY);
                started = true;
              } else {
                ctx.lineTo(p.screenX, p.screenY);
              }
            } else {
              started = false;
            }
          }
          ctx.strokeStyle =
            latDeg === 0 ? 'rgba(120, 220, 140, 0.35)' : 'rgba(217, 228, 209, 0.12)';
          ctx.stroke();
        }

        // Longitude meridians (every 30°)
        for (let lonDeg = -180; lonDeg < 180; lonDeg += 30) {
          const lonRad = (lonDeg * Math.PI) / 180;
          ctx.beginPath();
          let started = false;
          for (let latDeg = -90; latDeg <= 90; latDeg += 8) {
            const latRad = (latDeg * Math.PI) / 180;
            const p = project3D(latRad, lonRad, earthRadius, yaw, pitch, centerX, centerY);
            if (p.visible) {
              if (!started) {
                ctx.moveTo(p.screenX, p.screenY);
                started = true;
              } else {
                ctx.lineTo(p.screenX, p.screenY);
              }
            } else {
              started = false;
            }
          }
          ctx.strokeStyle = 'rgba(217, 228, 209, 0.1)';
          ctx.stroke();
        }
      }

      // 5. Interactive Biosphere Hotspots in 3D Space
      const newScreenCoords: Array<{ hotspot: Hotspot; x: number; y: number; visible: boolean; radius: number }> = [];

      BIOSIGNAL_HOTSPOTS.forEach((spot) => {
        const latRad = (spot.lat * Math.PI) / 180;
        const lonRad = (spot.lon * Math.PI) / 180;
        const proj = project3D(latRad, lonRad, earthRadius * 1.01, yaw, pitch, centerX, centerY);

        const isSelected = selectedHotspot?.id === spot.id;
        const isHovered = hoveredHotspot?.id === spot.id;
        const spotRadius = isSelected ? 8 : isHovered ? 6.5 : 5;

        newScreenCoords.push({
          hotspot: spot,
          x: proj.screenX,
          y: proj.screenY,
          visible: proj.visible,
          radius: spotRadius + 8, // hit area
        });

        if (proj.visible) {
          // Color based on category
          let color = '#52e35b';
          let pulseColor = 'rgba(82, 227, 91, ';
          if (spot.category === 'emission') {
            color = '#ff6b4a';
            pulseColor = 'rgba(255, 107, 74, ';
          } else if (spot.category === 'renewable') {
            color = '#4fd1c5';
            pulseColor = 'rgba(79, 209, 197, ';
          } else if (spot.category === 'tipping_point') {
            color = '#f6ad55';
            pulseColor = 'rgba(246, 173, 85, ';
          }

          // Pulsing halo
          const pulse = (Math.sin(time * 3 + spot.lat) + 1) * 0.5;
          ctx.beginPath();
          ctx.arc(proj.screenX, proj.screenY, spotRadius + pulse * 6, 0, Math.PI * 2);
          ctx.fillStyle = `${pulseColor}${0.2 + pulse * 0.3})`;
          ctx.fill();

          // Center pin
          ctx.beginPath();
          ctx.arc(proj.screenX, proj.screenY, spotRadius, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Spot Label Tag (visible if selected, hovered, or in large screens)
          if (isSelected || isHovered) {
            ctx.font = 'bold 11px "JetBrains Mono", monospace';
            const nameWidth = ctx.measureText(spot.name).width;
            ctx.fillStyle = 'rgba(12, 22, 11, 0.9)';
            ctx.fillRect(proj.screenX + 10, proj.screenY - 18, nameWidth + 14, 22);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.strokeRect(proj.screenX + 10, proj.screenY - 18, nameWidth + 14, 22);

            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(spot.name, proj.screenX + 17, proj.screenY - 3);
          }
        }
      });

      hotspotScreenCoordsRef.current = newScreenCoords;

      // 6. User Click Ripple Effects
      for (let i = pulseRipplesRef.current.length - 1; i >= 0; i--) {
        const ripple = pulseRipplesRef.current[i];
        ripple.currentRadius += 2.5;
        ripple.alpha -= 0.02;

        if (ripple.alpha <= 0) {
          pulseRipplesRef.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.currentRadius, 0, Math.PI * 2);
        ctx.strokeStyle = ripple.color.replace(/[\d\.]+\)$/, `${ripple.alpha})`);
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // 7. 3D Particle Cloud (Carbon Flux & Kinetic Dynamics)
      const particles = particlesRef.current;
      particles.forEach((p, idx) => {
        p.angle += p.speed;

        // Spherical 3D orbit around the globe
        const orbRad = p.orbitRadius * zoomRef.current;
        const latRad = p.inclination + Math.sin(p.angle * 1.5 + idx) * 0.15;
        const lonRad = p.angle;

        const proj = project3D(latRad, lonRad, orbRad, yaw, pitch, centerX, centerY);

        // Mouse interactive force field: particles gravitate or scatter near pointer
        if (mouseScreenRef.current.active) {
          const dx = mouseScreenRef.current.x - proj.screenX;
          const dy = mouseScreenRef.current.y - proj.screenY;
          const dist = Math.hypot(dx, dy);
          if (dist < 120 && dist > 1) {
            const force = (120 - dist) / 120;
            // Mode-dependent interaction: sinks pull in, emissions scatter
            const sign = fluxMode === 'sinks' || p.type === 'sink' ? 1 : -1;
            proj.screenX += (dx / dist) * force * 20 * sign;
            proj.screenY += (dy / dist) * force * 20 * sign;
          }
        }

        // Depth dimming (particles behind globe are fainter)
        const depthAlpha = proj.z < 0 ? p.alpha * 0.35 : p.alpha;
        const renderRadius = p.radius * Math.max(0.6, proj.scale);

        ctx.beginPath();
        ctx.arc(proj.screenX, proj.screenY, renderRadius, 0, Math.PI * 2);

        if (fluxMode === 'electrification') {
          ctx.fillStyle =
            p.type === 'clean'
              ? `rgba(79, 209, 197, ${depthAlpha})`
              : `rgba(180, 240, 200, ${depthAlpha * 0.6})`;
        } else if (fluxMode === 'boundary') {
          ctx.fillStyle =
            p.type === 'emission'
              ? `rgba(245, 105, 80, ${depthAlpha})`
              : `rgba(215, 180, 130, ${depthAlpha * 0.75})`;
        } else if (fluxMode === 'sinks') {
          ctx.fillStyle =
            p.type === 'sink' || p.isUserAdded
              ? `rgba(82, 227, 91, ${depthAlpha * 1.2})`
              : `rgba(150, 210, 140, ${depthAlpha * 0.5})`;
        } else {
          ctx.fillStyle =
            p.type === 'sink'
              ? `rgba(120, 177, 105, ${depthAlpha})`
              : p.type === 'clean'
              ? `rgba(197, 168, 128, ${depthAlpha})`
              : `rgba(235, 120, 90, ${depthAlpha * 0.75})`;
        }
        ctx.fill();

        // Delicate energy filaments connecting nearby front-facing particles
        if (proj.z > 0 && idx % 2 === 0) {
          for (let j = idx + 1; j < Math.min(idx + 12, particles.length); j++) {
            const p2 = particles[j];
            const proj2 = project3D(
              p2.inclination,
              p2.angle,
              p2.orbitRadius * zoomRef.current,
              yaw,
              pitch,
              centerX,
              centerY
            );
            if (proj2.z > 0) {
              const d = Math.hypot(proj.screenX - proj2.screenX, proj.screenY - proj2.screenY);
              if (d < 50) {
                ctx.beginPath();
                ctx.moveTo(proj.screenX, proj.screenY);
                ctx.lineTo(proj2.screenX, proj2.screenY);
                ctx.strokeStyle = `rgba(217, 228, 209, ${(1 - d / 50) * 0.16})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
              }
            }
          }
        }
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [fluxMode, isAutoRotating, showMeshGrid, showAtmosphereRings, selectedHotspot, hoveredHotspot]);

  // Mouse & Touch Controls: Free Drag Rotation, Hover, and Click-to-Select
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    mouseScreenRef.current = { x: clientX, y: clientY, active: true };

    if (isDraggingRef.current) {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      targetRotationRef.current.yaw += dx * 0.007;
      targetRotationRef.current.pitch += dy * 0.007;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    } else {
      // Check hover over hotspots
      const hovered = hotspotScreenCoordsRef.current.find(
        (item) => item.visible && Math.hypot(item.x - clientX, item.y - clientY) <= item.radius
      );
      setHoveredHotspot(hovered ? hovered.hotspot : null);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDraggingRef.current) {
      const totalMoved = Math.hypot(
        e.clientX - lastMousePosRef.current.x,
        e.clientY - lastMousePosRef.current.y
      );
      isDraggingRef.current = false;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }

      // If it was a clean click without significant drag, check hotspot selection
      if (totalMoved < 5) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          const clientX = e.clientX - rect.left;
          const clientY = e.clientY - rect.top;

          const clicked = hotspotScreenCoordsRef.current.find(
            (item) => item.visible && Math.hypot(item.x - clientX, item.y - clientY) <= item.radius
          );

          if (clicked) {
            setSelectedHotspot((prev) => (prev?.id === clicked.hotspot.id ? null : clicked.hotspot));
          } else {
            // Ripple click on empty space
            pulseRipplesRef.current.push({
              x: clientX,
              y: clientY,
              maxRadius: 80,
              currentRadius: 5,
              color: 'rgba(120, 177, 105, 0.7)',
              alpha: 0.9,
            });
          }
        }
      }
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    setZoomLevel((prev) => Math.max(0.7, Math.min(1.7, prev + delta)));
  };

  const handleResetOrientation = () => {
    targetRotationRef.current = { yaw: 0.35, pitch: 0.22 };
    setZoomLevel(1.0);
  };

  return (
    <div className="relative w-full rounded-[36px] bg-[#0E170C] border border-[#263820] overflow-hidden shadow-2xl select-none">
      {/* 3D Canvas Stage */}
      <div ref={stageRef} className="relative w-full h-[400px] sm:h-[480px] lg:h-[540px] overflow-hidden">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onWheel={handleWheel}
          className={`w-full h-full touch-none ${
            isDraggingRef.current
              ? 'cursor-grabbing'
              : hoveredHotspot
              ? 'cursor-pointer'
              : 'cursor-grab'
          }`}
        />

        {/* Top Control Bar (Mode Switcher & Interactive Actions) */}
        <div className="absolute top-3 left-3 right-3 sm:top-5 sm:left-5 sm:right-5 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Left: Scientific Telemetry Identifier */}
          <div className="pointer-events-auto flex items-center gap-2 bg-[#142212]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#2A3F25] text-[10px] sm:text-xs font-mono text-[#D4E3D1] shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#52e35b] animate-pulse" />
            <span className="font-bold">ORBITAL CARBON MESH</span>
            <span className="text-[#657F61] hidden sm:inline">•</span>
            <span className="text-[#8EA689] hidden sm:inline">Drag to Rotate • Scroll to Zoom</span>
          </div>

          {/* Right: Dynamic Mode Switcher */}
          <div className="pointer-events-auto flex items-center gap-1 sm:gap-1.5 bg-[#142212]/90 backdrop-blur-md p-1 sm:p-1.5 rounded-full border border-[#2A3F25] shadow-lg text-[10px] sm:text-xs overflow-x-auto no-scrollbar">
            <button
              onClick={() => setFluxMode('flux')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center gap-1 sm:gap-1.5 font-mono transition-all whitespace-nowrap cursor-pointer ${
                fluxMode === 'flux'
                  ? 'bg-[#4A6741] text-white font-bold shadow-xs'
                  : 'text-[#9CB395] hover:text-white'
              }`}
            >
              <Orbit className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Carbon Flux</span>
            </button>

            <button
              onClick={() => setFluxMode('sinks')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center gap-1 sm:gap-1.5 font-mono transition-all whitespace-nowrap cursor-pointer ${
                fluxMode === 'sinks'
                  ? 'bg-[#2E6B38] text-[#E8FFE9] font-bold shadow-xs'
                  : 'text-[#9CB395] hover:text-white'
              }`}
            >
              <TreePine className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#52e35b]" />
              <span>Biosphere Sinks</span>
            </button>

            <button
              onClick={() => setFluxMode('boundary')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center gap-1 sm:gap-1.5 font-mono transition-all whitespace-nowrap cursor-pointer ${
                fluxMode === 'boundary'
                  ? 'bg-[#8C7851] text-white font-bold shadow-xs'
                  : 'text-[#9CB395] hover:text-white'
              }`}
            >
              <Wind className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">1.5°C Boundary</span>
              <span className="sm:hidden">1.5°C</span>
            </button>

            <button
              onClick={() => setFluxMode('electrification')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center gap-1 sm:gap-1.5 font-mono transition-all whitespace-nowrap cursor-pointer ${
                fluxMode === 'electrification'
                  ? 'bg-[#1C523D] text-white font-bold shadow-xs'
                  : 'text-[#9CB395] hover:text-white'
              }`}
            >
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#4fd1c5]" />
              <span className="hidden sm:inline">Electrification</span>
              <span className="sm:hidden">Electric</span>
            </button>
          </div>
        </div>

        {/* Floating Quick Action Toolbar (Right vertical) */}
        <div className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 bg-[#142212]/85 backdrop-blur-md p-1.5 rounded-2xl border border-[#2A3F25] shadow-xl z-10">
          <button
            onClick={() => setIsAutoRotating((prev) => !prev)}
            title={isAutoRotating ? 'Pause Auto-Spin' : 'Resume Auto-Spin'}
            className={`p-2 rounded-xl text-xs transition-colors cursor-pointer ${
              isAutoRotating
                ? 'bg-[#4A6741] text-white'
                : 'text-[#8EA689] hover:text-white hover:bg-[#1C3219]'
            }`}
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleInjectSink}
            title="Inject Biospheric Carbon Sink Wave (+12 Sinks)"
            className="p-2 rounded-xl text-xs text-[#52e35b] hover:text-white hover:bg-[#204422] transition-colors cursor-pointer group"
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={() => setShowMeshGrid((prev) => !prev)}
            title="Toggle Longitude / Latitude Mesh"
            className={`p-2 rounded-xl text-xs transition-colors cursor-pointer ${
              showMeshGrid
                ? 'bg-[#2A4325] text-white'
                : 'text-[#8EA689] hover:text-white hover:bg-[#1C3219]'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            onClick={() => setZoomLevel((prev) => Math.min(1.6, prev + 0.15))}
            title="Zoom In"
            className="p-2 rounded-xl text-xs text-[#8EA689] hover:text-white hover:bg-[#1C3219] transition-colors cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setZoomLevel((prev) => Math.max(0.75, prev - 0.15))}
            title="Zoom Out"
            className="p-2 rounded-xl text-xs text-[#8EA689] hover:text-white hover:bg-[#1C3219] transition-colors cursor-pointer"
          >
            <Minimize2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleResetOrientation}
            title="Reset Globe Orientation"
            className="p-2 rounded-xl text-xs text-[#8EA689] hover:text-white hover:bg-[#1C3219] transition-colors cursor-pointer"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>

        {/* Hotspot Minimal Legend (Bottom Left) - shown when no hotspot is being inspected */}
        {!selectedHotspot && (
          <div className="absolute bottom-3.5 left-3.5 sm:bottom-4 sm:left-4 hidden sm:flex items-center gap-3 bg-[#111C10]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#23381E] text-[10px] font-mono text-[#98AE92] shadow-lg pointer-events-none">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#52e35b]" />
              <span>Sink</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4fd1c5]" />
              <span>Renewable</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b4a]" />
              <span>Emission</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f6ad55]" />
              <span>Tipping Point</span>
            </div>
            {userInjectedCount > 0 && (
              <span className="text-[#52e35b] font-semibold border-l border-[#2B4025] pl-2">+{userInjectedCount}</span>
            )}
          </div>
        )}

        {/* Selected Hotspot Sleek Floating Dossier Card */}
        {selectedHotspot && (
          <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md bg-[#0D170C]/95 backdrop-blur-xl border border-[#2B4025] rounded-2xl p-3.5 sm:p-4 shadow-2xl z-20 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      selectedHotspot.category === 'sink'
                        ? 'bg-[#1C421F] text-[#52e35b] border border-[#2E6833]'
                        : selectedHotspot.category === 'renewable'
                        ? 'bg-[#143B38] text-[#4fd1c5] border border-[#235E59]'
                        : selectedHotspot.category === 'emission'
                        ? 'bg-[#421C16] text-[#ff7d61] border border-[#682B21]'
                        : 'bg-[#423116] text-[#f6ad55] border border-[#684D23]'
                    }`}
                  >
                    {selectedHotspot.category.replace('_', ' ')}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                    {selectedHotspot.name}
                  </h4>
                </div>
                <p className="text-[10px] font-mono text-[#8EA689]">{selectedHotspot.region}</p>
              </div>

              <button
                onClick={() => setSelectedHotspot(null)}
                className="p-1 rounded-lg text-[#8EA689] hover:text-white hover:bg-[#1E301B] transition-colors cursor-pointer shrink-0"
                title="Dismiss dossier"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-[#CBD8C9] leading-relaxed mt-2 line-clamp-2">
              {selectedHotspot.description}
            </p>

            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[10px] font-mono">
              <span className="text-[#E8FFE9] font-semibold bg-[#1C3219] px-2 py-0.5 rounded border border-[#2E5229]">
                {selectedHotspot.co2Impact}
              </span>
              <span className="text-[#8EA689] truncate max-w-[210px]" title={selectedHotspot.metric}>
                {selectedHotspot.metric}
              </span>
            </div>

            <div className="mt-2 pt-2 border-t border-[#1C2C19] text-[11px] text-[#A3D9A5] leading-snug">
              <span className="text-[#8EA689] font-medium">Mitigation: </span>
              {selectedHotspot.actionTip}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

