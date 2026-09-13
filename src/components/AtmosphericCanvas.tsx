import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, Eye, Orbit, Wind, Zap } from 'lucide-react';

export type FluxMode = 'flux' | 'boundary' | 'electrification';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  type: 'emission' | 'sink' | 'clean';
  angle: number;
  orbitRadius: number;
  speed: number;
  oscillation: number;
}

export const AtmosphericCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fluxMode, setFluxMode] = useState<FluxMode>('flux');
  const [isHovered, setIsHovered] = useState(false);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    // Responsive canvas resizing
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = entry.contentRect.width;
        height = entry.contentRect.height;
        dpr = window.devicePixelRatio || 1;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);
      }
    });

    resizeObserver.observe(container);

    // Generate particles
    const particleCount = 85;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const type: 'emission' | 'sink' | 'clean' =
        i % 3 === 0 ? 'emission' : i % 3 === 1 ? 'sink' : 'clean';
      particles.push({
        x: Math.random() * 800,
        y: Math.random() * 500,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2.2 + 1.2,
        alpha: Math.random() * 0.7 + 0.3,
        type,
        angle: Math.random() * Math.PI * 2,
        orbitRadius: Math.random() * 180 + 70,
        speed: (Math.random() * 0.008 + 0.004) * (Math.random() > 0.5 ? 1 : -1),
        oscillation: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const earthRadius = Math.min(width, height) * 0.22;

      // 1. Planetary Glow & Atmospheric Horizon
      const atmosGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        earthRadius * 0.8,
        centerX,
        centerY,
        earthRadius * 2.1
      );

      if (fluxMode === 'boundary') {
        atmosGradient.addColorStop(0, 'rgba(140, 120, 81, 0.28)');
        atmosGradient.addColorStop(0.5, 'rgba(74, 103, 65, 0.16)');
        atmosGradient.addColorStop(1, 'rgba(29, 43, 23, 0)');
      } else if (fluxMode === 'electrification') {
        atmosGradient.addColorStop(0, 'rgba(80, 150, 110, 0.32)');
        atmosGradient.addColorStop(0.6, 'rgba(120, 177, 105, 0.15)');
        atmosGradient.addColorStop(1, 'rgba(29, 43, 23, 0)');
      } else {
        atmosGradient.addColorStop(0, 'rgba(74, 103, 65, 0.35)');
        atmosGradient.addColorStop(0.5, 'rgba(217, 228, 209, 0.12)');
        atmosGradient.addColorStop(1, 'rgba(29, 43, 23, 0)');
      }

      ctx.fillStyle = atmosGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadius * 2.1, 0, Math.PI * 2);
      ctx.fill();

      // 2. Orbital Boundary Rings
      const ringCount = fluxMode === 'boundary' ? 4 : 3;
      for (let r = 1; r <= ringCount; r++) {
        const ringRadius = earthRadius + r * 38 + Math.sin(time + r) * 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle =
          fluxMode === 'boundary' && r === 3
            ? 'rgba(195, 80, 60, 0.35)' // 1.5C overshoot boundary
            : 'rgba(217, 228, 209, 0.18)';
        ctx.lineWidth = fluxMode === 'boundary' && r === 3 ? 1.8 : 1;
        ctx.setLineDash(r % 2 === 0 ? [4, 6] : [2, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Boundary annotation tag
        if (fluxMode === 'boundary' && r === 3) {
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillStyle = 'rgba(220, 100, 80, 0.85)';
          ctx.fillText('CRITICAL 1.5°C BOUNDARY [430 ppm]', centerX + ringRadius - 10, centerY - 12);
        }
      }

      // 3. Central Earth Sphere (Minimalist Botanical Wireframe & Core)
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadius, 0, Math.PI * 2);
      const earthGrad = ctx.createRadialGradient(
        centerX - earthRadius * 0.3,
        centerY - earthRadius * 0.3,
        earthRadius * 0.1,
        centerX,
        centerY,
        earthRadius
      );
      earthGrad.addColorStop(0, '#2D4428');
      earthGrad.addColorStop(0.7, '#182414');
      earthGrad.addColorStop(1, '#0F180D');
      ctx.fillStyle = earthGrad;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(120, 177, 105, 0.4)';
      ctx.stroke();

      // Latitude / Longitude lines across the globe
      for (let lat = -2; lat <= 2; lat++) {
        if (lat === 0) continue;
        const latY = centerY + (lat * earthRadius) / 3.2;
        const chordW = Math.sqrt(Math.max(0, earthRadius * earthRadius - Math.pow(latY - centerY, 2)));
        ctx.beginPath();
        ctx.ellipse(centerX, latY, chordW, earthRadius * 0.18, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(217, 228, 209, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 4. Draw & Animate Carbon Flux Particles
      particles.forEach((p, idx) => {
        p.angle += p.speed;
        p.oscillation += 0.02;

        let targetX = centerX + Math.cos(p.angle) * p.orbitRadius;
        let targetY = centerY + Math.sin(p.angle) * (p.orbitRadius * 0.72) + Math.sin(p.oscillation) * 12;

        // Interactive mouse gravity deflection
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - targetX;
          const dy = mouseRef.current.y - targetY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const force = (140 - dist) / 140;
            targetX -= (dx / dist) * force * 24;
            targetY -= (dy / dist) * force * 24;
          }
        }

        p.x += (targetX - p.x) * 0.08;
        p.y += (targetY - p.y) * 0.08;

        // Choose color based on flux mode and particle type
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (fluxMode === 'electrification') {
          ctx.fillStyle =
            p.type === 'clean'
              ? `rgba(120, 220, 140, ${p.alpha})`
              : `rgba(200, 230, 180, ${p.alpha * 0.6})`;
        } else if (fluxMode === 'boundary') {
          ctx.fillStyle =
            p.type === 'emission'
              ? `rgba(235, 120, 90, ${p.alpha})`
              : `rgba(197, 168, 128, ${p.alpha * 0.8})`;
        } else {
          // Standard Flux: green for biological sinks, gold for energy, coral for industrial
          ctx.fillStyle =
            p.type === 'sink'
              ? `rgba(120, 177, 105, ${p.alpha})`
              : p.type === 'clean'
              ? `rgba(197, 168, 128, ${p.alpha})`
              : `rgba(230, 130, 100, ${p.alpha * 0.75})`;
        }
        ctx.fill();

        // Connect nearby particles with delicate synaptic energy threads
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 60) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(217, 228, 209, ${(1 - dist / 60) * 0.15})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      });

      // 5. Scientific Telemetry Overlay inside canvas
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(217, 228, 209, 0.75)';
      ctx.fillText(`FLUX: ${fluxMode.toUpperCase()} DYNAMICS`, 24, height - 24);
      ctx.fillText(`PPM DENSITY: 426.8 ± 0.3`, 24, height - 40);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [fluxMode]);

  // Mouse interaction handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
    setIsHovered(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      className="relative w-full h-[380px] sm:h-[460px] lg:h-[520px] rounded-[36px] bg-[#0E170C] border border-[#263820] overflow-hidden shadow-2xl flex items-center justify-center select-none"
    >
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full cursor-crosshair"
      />

      {/* Mode Switcher HUD in Top Right */}
      <div className="absolute top-5 right-5 flex items-center gap-1.5 bg-[#182414]/90 backdrop-blur-md p-1.5 rounded-full border border-[#2B3E24] shadow-lg text-xs">
        <button
          onClick={() => setFluxMode('flux')}
          className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 font-mono text-[11px] transition-all ${
            fluxMode === 'flux'
              ? 'bg-[#4A6741] text-white font-bold shadow-xs'
              : 'text-[#9CB395] hover:text-white'
          }`}
        >
          <Orbit className="w-3.5 h-3.5" />
          <span>Carbon Flux</span>
        </button>

        <button
          onClick={() => setFluxMode('boundary')}
          className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 font-mono text-[11px] transition-all ${
            fluxMode === 'boundary'
              ? 'bg-[#8C7851] text-white font-bold shadow-xs'
              : 'text-[#9CB395] hover:text-white'
          }`}
        >
          <Wind className="w-3.5 h-3.5" />
          <span>1.5°C Boundary</span>
        </button>

        <button
          onClick={() => setFluxMode('electrification')}
          className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 font-mono text-[11px] transition-all ${
            fluxMode === 'electrification'
              ? 'bg-[#2E543B] text-white font-bold shadow-xs'
              : 'text-[#9CB395] hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Electrification</span>
        </button>
      </div>

      {/* Telemetry Badge in Bottom Left */}
      <div className="absolute bottom-5 left-5 hidden sm:flex items-center gap-3 bg-[#182414]/85 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#2B3E24] text-[11px] font-mono text-[#D9E4D1]">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#78B169] animate-pulse" />
          <span>REAL-TIME ORBITAL MESH</span>
        </div>
        <span className="text-[#4A6741]">•</span>
        <span className="text-[#A3ADA0]">Hover to deflect particle currents</span>
      </div>

      {/* Subtle coordinate badge in Top Left */}
      <div className="absolute top-5 left-5 font-mono text-[10px] text-[#737C70] tracking-wider uppercase">
        MODEL: IPCC AR6 WGIII / CARBON FLUX HARMONIC
      </div>
    </div>
  );
};
