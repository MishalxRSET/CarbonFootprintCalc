import * as THREE from 'three';
import React, { Component, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { MotionValue } from 'motion/react';

const DEG = Math.PI / 180;
const HOME = { lat: 9.93, lon: 76.26 }; // Kochi, Kerala

const CITIES: { lat: number; lon: number; tone: 'home' | 'emit' }[] = [
  { lat: HOME.lat, lon: HOME.lon, tone: 'home' },
  { lat: 28.61, lon: 77.21, tone: 'emit' }, // Delhi
  { lat: 39.9, lon: 116.4, tone: 'emit' }, // Beijing
  { lat: 40.71, lon: -74.0, tone: 'emit' }, // New York
  { lat: 51.5, lon: -0.12, tone: 'emit' }, // London
  { lat: -23.55, lon: -46.63, tone: 'emit' }, // Sao Paulo
  { lat: 6.52, lon: 3.37, tone: 'emit' }, // Lagos
  { lat: 35.68, lon: 139.69, tone: 'emit' }, // Tokyo
  { lat: -33.87, lon: 151.2, tone: 'emit' }, // Sydney
  { lat: 25.2, lon: 55.27, tone: 'emit' }, // Dubai
  { lat: 1.35, lon: 103.82, tone: 'emit' }, // Singapore
];

/** lat/lon in degrees → unit sphere position with lon 0 facing +Z. */
const toVec = (lat: number, lon: number, r = 1) => {
  const la = lat * DEG;
  const lo = lon * DEG;
  return new THREE.Vector3(Math.cos(la) * Math.sin(lo) * r, Math.sin(la) * r, Math.cos(la) * Math.cos(lo) * r);
};

interface PointCloud {
  positions: Float32Array;
  randoms: Float32Array;
  land: Float32Array;
}

function buildCloud(mask: Uint8ClampedArray | null, w: number, h: number): PointCloud {
  const N = 110000;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const pos: number[] = [];
  const rnd: number[] = [];
  const land: number[] = [];

  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    const lat = Math.asin(y);
    const lon = Math.atan2(x, z);

    let isLand = false;
    if (mask) {
      const u = Math.min(w - 1, Math.floor(((lon + Math.PI) / (2 * Math.PI)) * w));
      const v = Math.min(h - 1, Math.floor(((Math.PI / 2 - lat) / Math.PI) * h));
      isLand = mask[(v * w + u) * 4] > 128;
    }

    if (isLand || Math.random() < (mask ? 0.035 : 0.3)) {
      pos.push(x, y, z);
      rnd.push(Math.random());
      land.push(isLand ? 1 : 0);
    }
  }

  return { positions: new Float32Array(pos), randoms: new Float32Array(rnd), land: new Float32Array(land) };
}

function useLandCloud() {
  const [cloud, setCloud] = useState<PointCloud | null>(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      if (cancelled) return;
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) throw new Error('no 2d context');
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        setCloud(buildCloud(data, canvas.width, canvas.height));
      } catch {
        setCloud(buildCloud(null, 0, 0));
      }
    };
    img.onerror = () => !cancelled && setCloud(buildCloud(null, 0, 0));
    img.src = '/textures/land-mask.png';
    return () => {
      cancelled = true;
    };
  }, []);

  return cloud;
}

const pointVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uIntro;
  attribute float aRandom;
  attribute float aLand;
  varying float vAlpha;
  varying float vRandom;
  varying float vLand;
  void main() {
    vec3 p = position;
    // points rise out of the surface during the intro reveal
    float reveal = smoothstep(aRandom * 0.6, aRandom * 0.6 + 0.4, uIntro);
    p *= mix(1.35, 1.0, reveal);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec3 n = normalize(normalMatrix * position);
    float facing = dot(n, normalize(-mv.xyz));
    float twinkle = 0.7 + 0.3 * sin(uTime * (0.5 + aRandom * 1.6) + aRandom * 40.0);
    vAlpha = mix(0.025, 1.0, smoothstep(-0.05, 0.5, facing)) * twinkle * reveal;
    vRandom = aRandom;
    vLand = aLand;
    float size = aLand > 0.5 ? (0.7 + aRandom * 0.55) : 0.6;
    gl_PointSize = uSize * size / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const pointFragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorOcean;
  varying float vAlpha;
  varying float vRandom;
  varying float vLand;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.05, d);
    vec3 col = vLand > 0.5 ? mix(uColorA, uColorB, vRandom * vRandom) : uColorOcean;
    float a = vAlpha * soft * (vLand > 0.5 ? 0.9 : 0.3);
    gl_FragColor = vec4(col, a);
  }
`;

const rimVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const rimFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uStrength;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float fresnel = pow(1.0 - max(dot(vNormal, vView), 0.0), 3.2);
    gl_FragColor = vec4(uColor * fresnel * uStrength, fresnel * uStrength);
  }
`;

const arcVertex = /* glsl */ `
  attribute float aT;
  attribute float aOffset;
  varying float vT;
  varying float vOffset;
  void main() {
    vT = aT;
    vOffset = aOffset;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const arcFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  varying float vT;
  varying float vOffset;
  void main() {
    float head = fract(uTime * 0.18 + vOffset) * 1.6 - 0.3;
    float d = head - vT;
    float trail = d >= 0.0 && d < 0.3 ? pow(1.0 - d / 0.3, 2.0) : 0.0;
    float a = 0.07 + trail * 0.95;
    gl_FragColor = vec4(uColor, a);
  }
`;

const pulseVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  attribute float aPhase;
  attribute vec3 aColor;
  varying float vPhase;
  varying vec3 vColor;
  varying float vFacing;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec3 n = normalize(normalMatrix * position);
    vFacing = smoothstep(0.0, 0.35, dot(n, normalize(-mv.xyz)));
    vPhase = fract(uTime * 0.45 + aPhase);
    vColor = aColor;
    gl_PointSize = uSize / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const pulseFragment = /* glsl */ `
  varying float vPhase;
  varying vec3 vColor;
  varying float vFacing;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float ring = smoothstep(0.08, 0.0, abs(d - vPhase)) * (1.0 - vPhase);
    float core = smoothstep(0.16, 0.0, d);
    float a = (ring * 0.9 + core) * vFacing;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a);
  }
`;

const dustVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  attribute float aRandom;
  varying float vAlpha;
  varying float vRandom;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vAlpha = (0.3 + 0.7 * (sin(uTime * (0.4 + aRandom) + aRandom * 30.0) * 0.5 + 0.5)) * 0.5;
    vRandom = aRandom;
    gl_PointSize = uSize * (0.4 + aRandom) / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const dustFragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vAlpha;
  varying float vRandom;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    vec3 col = mix(uColorA, uColorB, step(0.72, vRandom));
    gl_FragColor = vec4(col, vAlpha * smoothstep(0.5, 0.0, d));
  }
`;

interface GlobeProps {
  scrollProgress?: MotionValue<number>;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}

const Globe: React.FC<GlobeProps> = ({ scrollProgress, pointer }) => {
  const cloud = useLandCloud();
  const group = useRef<THREE.Group>(null);
  const dust = useRef<THREE.Points>(null);
  const introStart = useRef<number | null>(null);

  const pointMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: pointVertex,
        fragmentShader: pointFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: 10.5 * Math.min(window.devicePixelRatio || 1, 1.75) },
          uIntro: { value: 0 },
          uColorA: { value: new THREE.Color('#65e66d') },
          uColorB: { value: new THREE.Color('#d8ffb0') },
          uColorOcean: { value: new THREE.Color('#2f6b45') },
        },
      }),
    []
  );

  const rimMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: rimVertex,
        fragmentShader: rimFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uColor: { value: new THREE.Color('#5fe08a') }, uStrength: { value: 0.75 } },
      }),
    []
  );

  const arcMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: arcVertex,
        fragmentShader: arcFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color('#ffb36b') } },
      }),
    []
  );

  const pulseMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: pulseVertex,
        fragmentShader: pulseFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uSize: { value: 150 * Math.min(window.devicePixelRatio || 1, 1.75) } },
      }),
    []
  );

  const dustMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: dustVertex,
        fragmentShader: dustFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: 9 * Math.min(window.devicePixelRatio || 1, 1.75) },
          uColorA: { value: new THREE.Color('#9fe8a8') },
          uColorB: { value: new THREE.Color('#ff8a5c') },
        },
      }),
    []
  );

  const pointGeometry = useMemo(() => {
    if (!cloud) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(cloud.positions, 3));
    g.setAttribute('aRandom', new THREE.BufferAttribute(cloud.randoms, 1));
    g.setAttribute('aLand', new THREE.BufferAttribute(cloud.land, 1));
    return g;
  }, [cloud]);

  // Great-circle carbon flows from Kochi to major emitters, as line segments
  const arcGeometry = useMemo(() => {
    const SEG = 72;
    const pos: number[] = [];
    const ts: number[] = [];
    const offs: number[] = [];
    const home = toVec(HOME.lat, HOME.lon);
    CITIES.filter((c) => c.tone === 'emit').forEach((c, idx) => {
      const end = toVec(c.lat, c.lon);
      const lift = 1 + home.distanceTo(end) * 0.32;
      const angle = home.angleTo(end);
      const axis = new THREE.Vector3().crossVectors(home, end).normalize();
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= SEG; i++) {
        const t = i / SEG;
        const p = home.clone().applyAxisAngle(axis, angle * t);
        const h = 1 + Math.sin(Math.PI * t) * (lift - 1);
        pts.push(p.multiplyScalar(h * 1.002));
      }
      for (let i = 0; i < SEG; i++) {
        pos.push(pts[i].x, pts[i].y, pts[i].z, pts[i + 1].x, pts[i + 1].y, pts[i + 1].z);
        ts.push(i / SEG, (i + 1) / SEG);
        offs.push(idx * 0.137, idx * 0.137);
      }
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('aT', new THREE.Float32BufferAttribute(ts, 1));
    g.setAttribute('aOffset', new THREE.Float32BufferAttribute(offs, 1));
    return g;
  }, []);

  const pulseGeometry = useMemo(() => {
    const pos: number[] = [];
    const phase: number[] = [];
    const color: number[] = [];
    const green = new THREE.Color('#65e66d');
    const amber = new THREE.Color('#ff9a5c');
    CITIES.forEach((c, i) => {
      const v = toVec(c.lat, c.lon, 1.006);
      pos.push(v.x, v.y, v.z);
      phase.push((i * 0.29) % 1);
      const col = c.tone === 'home' ? green : amber;
      color.push(col.r, col.g, col.b);
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('aPhase', new THREE.Float32BufferAttribute(phase, 1));
    g.setAttribute('aColor', new THREE.Float32BufferAttribute(color, 3));
    return g;
  }, []);

  // Tilted orbital band of atmospheric carbon dust
  const dustGeometry = useMemo(() => {
    const COUNT = 2600;
    const pos = new Float32Array(COUNT * 3);
    const rnd = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.32 + Math.pow(Math.random(), 1.6) * 0.62;
      const spread = (Math.random() - 0.5) * (Math.random() * 0.12);
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = spread;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
      rnd[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aRandom', new THREE.BufferAttribute(rnd, 1));
    return g;
  }, []);

  useEffect(
    () => () => {
      [pointMaterial, rimMaterial, arcMaterial, pulseMaterial, dustMaterial].forEach((m) => m.dispose());
      [arcGeometry, pulseGeometry, dustGeometry].forEach((g) => g.dispose());
    },
    [pointMaterial, rimMaterial, arcMaterial, pulseMaterial, dustMaterial, arcGeometry, pulseGeometry, dustGeometry]
  );

  useEffect(() => () => pointGeometry?.dispose(), [pointGeometry]);

  const spin = useRef(0);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    pointMaterial.uniforms.uTime.value = t;
    arcMaterial.uniforms.uTime.value = t;
    pulseMaterial.uniforms.uTime.value = t;
    dustMaterial.uniforms.uTime.value = t;

    if (pointGeometry) {
      if (introStart.current === null) introStart.current = t;
      pointMaterial.uniforms.uIntro.value = Math.min(1, (t - introStart.current) / 2.4);
    }

    spin.current += dt * 0.055;
    const scroll = scrollProgress ? scrollProgress.get() : 0;
    if (group.current) {
      const targetY = -HOME.lon * DEG + 0.35 + spin.current + scroll * 1.6 + pointer.current.x * 0.35;
      const targetX = 0.32 + pointer.current.y * 0.18 + scroll * 0.25;
      group.current.rotation.y += (targetY - group.current.rotation.y) * Math.min(1, dt * 3);
      group.current.rotation.x += (targetX - group.current.rotation.x) * Math.min(1, dt * 3);
    }
    if (dust.current) dust.current.rotation.y -= dt * 0.04;
  });

  return (
    <>
      <group ref={group} rotation={[0.32, -HOME.lon * DEG + 0.35, 0]}>
        {pointGeometry && <points geometry={pointGeometry} material={pointMaterial} />}
        <lineSegments geometry={arcGeometry} material={arcMaterial} />
        <points geometry={pulseGeometry} material={pulseMaterial} />
        <mesh material={rimMaterial}>
          <sphereGeometry args={[1.015, 64, 64]} />
        </mesh>
      </group>
      <group rotation={[0.42, 0, -0.32]}>
        <points ref={dust} geometry={dustGeometry} material={dustMaterial} />
      </group>
    </>
  );
};

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
};

class GlobeBoundary extends Component<{ fallback: React.ReactNode; children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    console.warn('Globe rendering disabled:', err);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

const Fallback = () => (
  <div className="absolute inset-[14%] rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(101,230,109,0.35),rgba(8,30,16,0.2)_55%,transparent_70%)] border border-[#65e66d]/20" />
);

interface PointGlobeProps {
  scrollProgress?: MotionValue<number>;
  className?: string;
}

/** Interactive point-cloud Earth used as the landing hero's signature visual. */
export const PointGlobe: React.FC<PointGlobeProps> = ({ scrollProgress, className = '' }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const [supported] = useState(hasWebGL);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div ref={wrapRef} className={className || 'relative'} aria-hidden="true">
      {supported ? (
        <GlobeBoundary fallback={<Fallback />}>
          <Canvas
            frameloop={visible ? 'always' : 'never'}
            dpr={[1, 1.75]}
            camera={{ position: [0, 0, 3.6], fov: 38 }}
            gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <Globe scrollProgress={scrollProgress} pointer={pointer} />
          </Canvas>
        </GlobeBoundary>
      ) : (
        <Fallback />
      )}
    </div>
  );
};
