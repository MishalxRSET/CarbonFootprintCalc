import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'motion/react';
import { PageTab } from '../types';
import { AtmosphericCanvas } from './AtmosphericCanvas';
import { ScenarioSimulator } from './ScenarioSimulator';
import { Magnet } from './reactbits';
import { PointGlobe } from './hero/PointGlobe';
import {
  EASE_OUT_EXPO,
  FadeUp,
  InViewCount,
  MaskLine,
  RollText,
  RotatingBadge,
  ScrollWords,
  UNDERLINE_WIPE,
  VelocityMarquee,
} from './fx/Kinetic';
import { ArrowDown, ArrowRight, ArrowUpRight, Building2, Car, Trees, Utensils, Zap } from 'lucide-react';

const img = (id: string, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const SHELL = 'mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12';
const INK = 'text-[#0B140C] dark:text-[#EEF5ED]';
const MUTED = 'text-[#4F5A4C] dark:text-[#9DB099]';
const RULE = 'border-[#0B140C]/12 dark:border-white/10';

const impactPanels = [
  {
    image: img('1615092296061-e2ccfeb2f3d6'),
    title: 'Rising temperatures',
    stat: '+1.48°C',
    statLabel: 'Global mean anomaly vs. pre-industrial',
    copy: 'Atmospheric CO₂ past 426 ppm amplifies global mean temperatures and triggers severe heatwaves and climate volatility.',
  },
  {
    image: img('1534274988757-a28bf1a57c17'),
    title: 'Climate & oceans',
    stat: '≈30%',
    statLabel: 'Rise in ocean acidity since 1750',
    copy: 'Thermal expansion and ocean acidification destabilize marine ecosystems and increase coastal vulnerability.',
  },
  {
    image: img('1473448912268-2022ce9509d8'),
    title: 'Ecosystem loss',
    stat: '10M ha',
    statLabel: 'Forest lost every year (FAO)',
    copy: "Loss of natural vegetative carbon sinks diminishes Earth's innate capacity to buffer surplus atmospheric carbon.",
  },
];

const pathway: { index: string; title: string; copy: string; cta: string; tab: PageTab; image: string }[] = [
  {
    index: '01',
    title: 'Measure',
    copy: 'Input domestic power, vehicle fuel, LPG and transit. Instant Scope 1, 2 & 3 breakdown using Indian CEA factors.',
    cta: 'Launch calculator',
    tab: 'calculator',
    image: img('1473341304170-971dccb5ac1e', 700),
  },
  {
    index: '02',
    title: 'Explore',
    copy: 'Solar PV, heat pumps, EVs, plant-rich diets and urban afforestation — with payback data for each.',
    cta: 'Browse 5 solutions',
    tab: 'solutions',
    image: img('1466611653911-95081537e5b7', 700),
  },
  {
    index: '03',
    title: 'Plan & save',
    copy: 'Simulate 5–10 year reduction curves, estimate ₹ savings, and save your plan to Google Drive as a Doc.',
    cta: 'Build your plan',
    tab: 'planner',
    image: img('1542601906990-b4d3fb778b09', 700),
  },
];

const solutions = [
  { title: 'Rooftop Solar PV', copy: 'Clean micro-generation displacing coal grid peak demand.', kg: 1850, Icon: Zap, tint: '#F5A524' },
  { title: 'Inverter Heat Pump', copy: '300%+ thermodynamic efficiency replacing gas and oil heating.', kg: 1450, Icon: Building2, tint: '#4C9AFF' },
  { title: 'Electric Vehicles', copy: 'Zero tailpipe emissions and 70% cheaper operating costs.', kg: 2200, Icon: Car, tint: '#65E66D' },
  { title: 'Plant-Rich Diet', copy: 'Cuts livestock enteric methane and spares land for rewilding.', kg: 1100, Icon: Utensils, tint: '#FF8A5C' },
  { title: 'Urban Afforestation', copy: 'Living carbon biosequestration via native canopy micro-forests.', kg: 650, Icon: Trees, tint: '#3DDC97' },
];

const pillars = [
  { title: 'Carbon accounting', copy: 'Scopes 1, 2 and 3 modelling with verified Central Electricity Authority (0.716 kg CO₂/kWh) factors.' },
  { title: '5 flagship solutions', copy: 'Synthesized from our presentation research: Solar PV, Heat Pumps, EVs, Diets and Afforestation.' },
  { title: 'Decarbonization engine', copy: 'Real-time calculation engine, dynamic roadmap generation and financial savings projections.' },
  { title: 'Google Drive sync', copy: 'Direct cloud integration that exports structured plans straight into your Google Drive.' },
];

const sources = [
  { name: 'IPCC AR6 (2023)', org: 'WG III — Climate Mitigation', href: 'https://www.ipcc.ch/assessment-report/ar6/' },
  { name: 'GHG Protocol Standard', org: 'WRI & WBCSD', href: 'https://ghgprotocol.org/corporate-standard' },
  { name: 'CEA India & BEE', org: '0.716 kg CO₂/kWh grid factor', href: 'https://cea.nic.in/' },
  {
    name: 'IEA Net Zero 2050',
    org: 'Technology roadmaps',
    href: 'https://www.iea.org/reports/net-zero-roadmap-a-global-pathway-to-keep-the-15-0c-goal-in-reach',
  },
];

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

const SectionLabel: React.FC<{ index: string; children: React.ReactNode; className?: string }> = ({ index, children, className = '' }) => (
  <span className={`type-label inline-flex items-center gap-3 ${className}`}>
    <span className="opacity-60">({index})</span>
    <span className="h-px w-8 bg-current opacity-40" />
    <span>{children}</span>
  </span>
);

const LocalClock: React.FC = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="tabular-nums">
      {now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour12: false })} IST
    </span>
  );
};

/* ------------------------------------------------------------------------- */
/* 1. Hero                                                                     */
/* ------------------------------------------------------------------------- */

interface HeroProps {
  ready: boolean;
  onVisualReady?: () => void;
  onNavigate: (tab: PageTab) => void;
  onOpenDesignDoc: () => void;
  onOpenGuidedTour?: () => void;
}

const Hero: React.FC<HeroProps> = ({ ready, onVisualReady, onNavigate, onOpenDesignDoc, onOpenGuidedTour }) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const globeScale = useTransform(scrollYProgress, [0, 1], [1, 1.28]);
  const globeY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-35%']);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const stats = [
    { label: 'CO₂ · Mauna Loa', value: 426.8, decimals: 1, unit: 'ppm', delta: '+2.4 / yr' },
    { label: 'Temp. anomaly', value: 1.48, decimals: 2, unit: '°C', delta: 'vs 1850–1900', prefix: '+' },
    { label: '1.5°C budget left', value: 215, decimals: 0, unit: 'GtCO₂e', delta: 'at today’s rate ≈ 5 yrs' },
  ];

  const links: { label: string; onClick: () => void }[] = [
    { label: 'Reduction planner', onClick: () => onNavigate('planner') },
    { label: 'Save to Drive', onClick: () => onNavigate('drive_save') },
    ...(onOpenGuidedTour ? [{ label: 'Quick tour', onClick: onOpenGuidedTour }] : []),
    { label: 'Design doc', onClick: onOpenDesignDoc },
  ];

  return (
    <section
      ref={ref}
      id="home"
      data-nav-theme="dark"
      className="dark relative -mt-[var(--header-h,0px)] min-h-[100svh] overflow-hidden bg-[#040805] text-white"
    >
      {/* editorial column grid */}
      <div className="pointer-events-none absolute inset-0 hidden lg:grid grid-cols-12 px-12 opacity-[0.06]">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="border-l border-white last:border-r" />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,rgba(40,120,60,0.28),transparent_60%)]" />

      {/* Globe */}
      <div className="pointer-events-none absolute left-1/2 top-[34%] w-[150vw] max-w-[900px] -translate-x-1/2 -translate-y-1/2 aspect-square opacity-75 sm:top-[40%] sm:w-[110vw] lg:left-auto lg:right-[-7vw] lg:top-[50%] lg:w-[min(58vw,112vh)] lg:max-w-none lg:translate-x-0 lg:opacity-100">
        <motion.div
          className="relative h-full w-full"
          style={{ scale: globeScale, y: globeY }}
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
        >
          <div className="absolute inset-[22%] rounded-full bg-[#2fae4b]/25 blur-[90px]" />
          <PointGlobe scrollProgress={scrollYProgress} play={ready} onReady={onVisualReady} className="absolute inset-0" />
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-[#040805] via-[#040805]/55 via-35% to-transparent to-60% lg:block" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-[#040805] via-[#040805]/70 to-transparent" />

      <motion.div
        style={{ y: copyY, opacity: copyOpacity }}
        className={`${SHELL} relative z-10 flex min-h-[100svh] flex-col pt-[calc(var(--header-h,96px)_+_1.5rem)] pb-8`}
      >
        {/* meta row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          className="type-label flex items-center justify-between gap-4 text-white/55"
        >
          <span className="hidden sm:inline">( N° 001 ) — Science-backed decarbonization</span>
          <span className="sm:hidden">( N° 001 )</span>
          <span className="flex items-center gap-3">
            <span className="hidden md:inline">Kochi, IN · 09°55′N 76°15′E</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#65e66d] animate-pulse" />
              <LocalClock />
            </span>
          </span>
        </motion.div>

        <div className="mt-auto pt-[38vh] sm:pt-[30vh] lg:pt-16">
          <h1 className="type-mega text-[13vw] sm:text-[clamp(2.5rem,10.4vw,11rem)]">
            <MaskLine show={ready} delay={0.15}>
              Our planet.
            </MaskLine>
            <MaskLine show={ready} delay={0.28}>
              Our{' '}
              <span className="font-editorial text-[#65e66d] text-[1.08em] leading-[0.8]">responsibility.</span>
            </MaskLine>
          </h1>

          <div className="mt-8 grid gap-10 lg:mt-12 lg:grid-cols-12 lg:items-end">
            <motion.div
              className="lg:col-span-5 space-y-7"
              initial={{ opacity: 0, y: 24 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.55 }}
            >
              <p className="max-w-md text-[15px] leading-relaxed text-white/70 sm:text-lg">
                Measure your greenhouse gas emissions across Scopes 1, 2 and 3, explore five proven interventions, and
                build a verified decarbonization plan you can export to Google Drive.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Magnet padding={24} magnetStrength={4}>
                  <button
                    id="hero-launch-calculator-btn"
                    type="button"
                    onClick={() => onNavigate('calculator')}
                    className="group inline-flex items-center gap-3 rounded-full bg-[#65e66d] py-2 pl-6 pr-2 text-sm font-bold text-[#04110a] transition-colors hover:bg-[#8af08f] cursor-pointer"
                  >
                    <RollText>Calculate your footprint</RollText>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#04110a] text-[#65e66d] transition-transform duration-500 group-hover:-rotate-45">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </button>
                </Magnet>
                <button
                  id="hero-explore-solutions-btn"
                  type="button"
                  onClick={() => onNavigate('solutions')}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-[#f5f7f2] hover:bg-[#f5f7f2] hover:text-[#04110a] cursor-pointer"
                >
                  <RollText>Explore 5 solutions</RollText>
                </button>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-white/60">
                {links.map((l) => (
                  <button key={l.label} type="button" onClick={l.onClick} className={`${UNDERLINE_WIPE} hover:text-white transition-colors cursor-pointer`}>
                    {l.label}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.dl
              className="lg:col-span-6 lg:col-start-7 grid grid-cols-3 border-t border-white/15"
              initial={{ opacity: 0 }}
              animate={ready ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.8 }}
            >
              {stats.map((s, i) => (
                <div key={s.label} className={`pt-4 pr-3 ${i > 0 ? 'pl-3 sm:pl-5 border-l border-white/15' : ''}`}>
                  <dt className="type-label text-[9.5px] sm:text-[10.5px] text-white/50">{s.label}</dt>
                  <dd className="mt-2 font-display text-[clamp(1.35rem,3.2vw,2.6rem)] font-semibold leading-none tracking-tight">
                    {s.prefix}
                    <InViewCount to={s.value} decimals={s.decimals} start={ready} />
                    <span className="ml-1 text-[0.45em] font-medium text-white/50">{s.unit}</span>
                  </dd>
                  <dd className="mt-2 hidden font-mono text-[10.5px] text-[#ffb36b]/90 sm:block">{s.delta}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          <div className="mt-10 hidden items-center justify-between text-white/40 sm:flex">
            <span className="type-label flex items-center gap-3">
              <span className="relative block h-8 w-px overflow-hidden bg-white/15">
                <span className="absolute inset-x-0 top-0 h-1/2 bg-[#65e66d] animate-scroll-cue" />
              </span>
              Scroll to explore
            </span>

          </div>
        </div>
      </motion.div>
    </section>
  );
};

/* ------------------------------------------------------------------------- */
/* 2. Marquee                                                                  */
/* ------------------------------------------------------------------------- */

const MarqueeBand: React.FC = () => (
  <section className={`relative border-y ${RULE} py-6 sm:py-10 ${INK}`} aria-label="Measure, reduce, restore, sustain">
    <VelocityMarquee baseVelocity={-1.6} className="type-mega text-[clamp(3.5rem,11vw,11rem)] leading-[1]">
      {['Measure', 'Reduce', 'Restore', 'Sustain'].map((w, i) => (
        <span key={w} className="flex items-center">
          <span className={i % 2 ? 'text-outline-strong' : ''}>{w}</span>
          <span className="mx-[0.25em] font-editorial text-[0.7em] text-[#2E7D32] dark:text-[#65e66d]">✳</span>
        </span>
      ))}
    </VelocityMarquee>
    <VelocityMarquee baseVelocity={1.2} className={`mt-4 type-label ${MUTED}`}>
      {[
        '426.8 ppm CO₂',
        '+1.48°C anomaly',
        '215 GtCO₂e budget left',
        'GHG Protocol scopes 1 · 2 · 3',
        'CEA grid factor 0.716 kg/kWh',
        'IPCC AR6 aligned',
      ].map((t) => (
        <span key={t} className="flex items-center">
          <span>{t}</span>
          <span className="mx-6 h-1 w-1 rounded-full bg-current" />
        </span>
      ))}
    </VelocityMarquee>
  </section>
);

/* ------------------------------------------------------------------------- */
/* 3. Manifesto                                                                */
/* ------------------------------------------------------------------------- */

const Manifesto: React.FC = () => {
  const figures = [
    { to: 3, label: 'Emission scopes measured', note: 'GHG Protocol' },
    { to: 5, label: 'Flagship climate solutions', note: 'From our research' },
    { to: 0.716, decimals: 3, label: 'kg CO₂ per kWh', note: 'CEA India grid factor' },
    { to: 10, label: 'Year reduction horizon', note: 'Planner simulation' },
  ];
  return (
    <section className={`${SHELL} py-28 sm:py-36 lg:py-48 ${INK}`}>
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <SectionLabel index="01" className={MUTED}>
            Manifesto
          </SectionLabel>
        </div>
        <div className="lg:col-span-9">
          <ScrollWords
            className="font-display font-medium text-[clamp(1.85rem,4.3vw,4.5rem)] leading-[1.04] tracking-[-0.035em]"
            text="Every tonne of carbon we don't emit is a fraction of a degree we keep. CarbonZero turns the *quiet* math of daily life — power, travel, food — into a *clear*, science-backed plan to cut it."
          />
          <div className={`mt-20 grid grid-cols-2 border-t ${RULE} lg:grid-cols-4`}>
            {figures.map((f, i) => (
              <FadeUp key={f.label} delay={i * 0.08} className={`pt-6 pb-8 pr-4 ${i % 2 ? `pl-4 border-l ${RULE}` : ''} ${i === 2 ? `lg:pl-4 lg:border-l ${RULE}` : ''}`}>
                <div className="font-display text-[clamp(2.75rem,6vw,5.5rem)] font-semibold leading-none tracking-[-0.05em]">
                  <InViewCount to={f.to} decimals={f.decimals ?? 0} />
                </div>
                <div className="mt-4 text-sm font-semibold">{f.label}</div>
                <div className={`mt-1 font-mono text-[11px] ${MUTED}`}>{f.note}</div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------------- */
/* 4. Zoom-reveal image                                                       */
/* ------------------------------------------------------------------------- */

const ZoomReveal: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const clipPath = useTransform(
    scrollYProgress,
    [0.05, 0.5],
    ['inset(16% 20% 16% 20% round 40px)', 'inset(0% 0% 0% 0% round 0px)']
  );
  const scale = useTransform(scrollYProgress, [0, 1], [1.3, 1]);
  const textY = useTransform(scrollYProgress, [0.2, 0.8], ['12%', '-12%']);

  return (
    <section ref={ref} className="relative h-[85vh] sm:h-[110vh]" aria-label="Measure, reduce, restore">
      <motion.div style={{ clipPath }} className="absolute inset-0 overflow-hidden bg-[#0b1a0e]">
        <motion.img
          style={{ scale }}
          src={img('1497436072909-60f360e1d4b1', 2200)}
          alt="Aerial view of a dense forest meeting turquoise water"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60" />
        <motion.div style={{ y: textY }} className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <span className="type-label text-white/70">The goal</span>
          <p className="type-mega mt-4 text-[clamp(3rem,11vw,12rem)]">
            Net <span className="font-editorial text-[#b8ffbc]">zero.</span>
          </p>
          <p className="mt-6 max-w-sm px-6 text-sm text-white/80 sm:text-base">
            Carbon in balance with what forests, soils and oceans can absorb.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ------------------------------------------------------------------------- */
/* 5. Pathway (hover-preview list)                                            */
/* ------------------------------------------------------------------------- */

const Pathway: React.FC<{ onNavigate: (tab: PageTab) => void }> = ({ onNavigate }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 26, mass: 0.6 });
  const y = useSpring(my, { stiffness: 220, damping: 26, mass: 0.6 });
  const xVelocity = useVelocity(x);
  const tilt = useTransform(xVelocity, [-1500, 1500], [-14, 14]);
  const rotate = useSpring(tilt, { stiffness: 200, damping: 30 });

  const onMove = (e: React.PointerEvent) => {
    const rect = listRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };

  return (
    <section className={`${SHELL} py-28 sm:py-36 lg:py-44 ${INK}`}>
      <div className="mb-14 grid gap-8 lg:mb-20 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-3">
          <SectionLabel index="02" className={MUTED}>
            Recommended pathway
          </SectionLabel>
        </div>
        <h2 className="type-mega text-[clamp(2.75rem,7vw,7.5rem)] lg:col-span-9">
          <MaskLine>Three steps</MaskLine>
          <MaskLine delay={0.08}>
            to carbon <span className="font-editorial text-[#2E7D32] dark:text-[#65e66d]">zero.</span>
          </MaskLine>
        </h2>
      </div>

      <div ref={listRef} className="relative" onPointerMove={onMove} onPointerLeave={() => setActive(null)}>
        {/* cursor-following image preview (desktop) */}
        <motion.div
          className="pointer-events-none absolute left-0 top-0 z-20 hidden h-[340px] w-[260px] -ml-[130px] -mt-[170px] overflow-hidden rounded-2xl lg:block"
          style={{ x, y, rotate }}
          animate={{ opacity: active === null ? 0 : 1, scale: active === null ? 0.6 : 1 }}
          transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
        >
          {pathway.map((p, i) => (
            <motion.img
              key={p.index}
              src={p.image}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1 : 1.15 }}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            />
          ))}
        </motion.div>

        {pathway.map((p, i) => (
          <button
            key={p.index}
            type="button"
            data-cursor-label="Open"
            onClick={() => onNavigate(p.tab)}
            onPointerEnter={() => setActive(i)}
            className={`group relative grid w-full grid-cols-12 items-center gap-4 overflow-hidden border-t ${RULE} py-8 text-left last:border-b sm:py-10 lg:py-12 cursor-pointer`}
          >
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-[#65e66d] transition-transform duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
            <span className={`relative col-span-2 font-mono text-xs ${MUTED} group-hover:text-[#04110a] transition-colors sm:col-span-1`}>
              {p.index}
            </span>
            <span className="relative col-span-10 font-display text-[clamp(2.4rem,7vw,7rem)] font-semibold leading-[0.95] tracking-[-0.05em] transition-[transform,color] duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-4 group-hover:text-[#04110a] sm:col-span-6">
              {p.title}
            </span>
            <span className={`relative col-span-10 col-start-3 text-sm leading-relaxed ${MUTED} group-hover:text-[#04110a]/80 transition-colors sm:col-span-4 sm:col-start-auto`}>
              {p.copy}
              <span className={`mt-3 block font-semibold ${INK} group-hover:text-[#04110a]`}>{p.cta} →</span>
            </span>
            <span className="relative col-span-1 hidden justify-end sm:flex">
              <span className={`flex h-12 w-12 items-center justify-center rounded-full border ${RULE} transition-all duration-500 group-hover:rotate-45 group-hover:border-[#04110a] group-hover:bg-[#04110a] group-hover:text-[#65e66d]`}>
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------------- */
/* 6. Impact — horizontal scroll                                              */
/* ------------------------------------------------------------------------- */

const ImpactPanel: React.FC<{ panel: (typeof impactPanels)[number]; i: number; horizontal: boolean }> = ({ panel, i, horizontal }) => (
  <article
    className={`group relative shrink-0 overflow-hidden rounded-[28px] bg-[#0b1a0e] ${
      horizontal ? 'h-[74vh] w-[min(62vw,980px)]' : 'h-[78vh] max-h-[640px] w-full'
    }`}
  >
    <img
      src={panel.image}
      alt=""
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover grayscale-[65%] transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:grayscale-0"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#040805] via-[#040805]/45 to-[#040805]/10" />
    <div className="relative flex h-full flex-col justify-between p-6 sm:p-10">
      <div className="type-label flex justify-between text-white/70">
        <span>Diagnostic</span>
        <span>
          0{i + 1} / 0{impactPanels.length}
        </span>
      </div>
      <div className="grid gap-6 sm:grid-cols-5 sm:items-end">
        <div className="sm:col-span-3">
          <h3 className="font-display text-[clamp(2.2rem,4.6vw,4.75rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-white">
            {panel.title}
          </h3>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">{panel.copy}</p>
        </div>
        <div className="sm:col-span-2 sm:text-right">
          <div className="font-editorial text-[clamp(3rem,6vw,6rem)] leading-none text-[#ffb36b]">{panel.stat}</div>
          <div className="type-label mt-2 text-[10px] text-white/60">{panel.statLabel}</div>
        </div>
      </div>
    </div>
  </article>
);

const Impact: React.FC<{ onNavigate: (tab: PageTab) => void }> = ({ onNavigate }) => {
  const horizontal = useMediaQuery('(min-width: 1024px)');
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useLayoutEffect(() => {
    if (!horizontal) return;
    const measure = () => {
      const track = trackRef.current;
      if (track) setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [horizontal]);

  const intro = (
    <div className={`shrink-0 ${horizontal ? 'w-[min(40vw,640px)] pr-8' : 'mb-10'}`}>
      <SectionLabel index="03" className="text-white/60">
        Planetary diagnostics
      </SectionLabel>
      <h2 className="type-mega mt-8 text-[clamp(3rem,6.5vw,7rem)] text-white">
        The <span className="font-editorial text-[#ffb36b]">cost</span>
        <br />
        of carbon.
      </h2>
      <p className="mt-8 max-w-sm text-white/65">
        Understanding systemic emissions drivers is the first step toward targeted interventions.
      </p>
      {horizontal && (
        <span className="type-label mt-10 inline-flex items-center gap-3 text-white/50">
          Keep scrolling <ArrowRight className="h-3.5 w-3.5" />
        </span>
      )}
    </div>
  );

  const outro = (
    <div className={`flex shrink-0 flex-col justify-center ${horizontal ? 'w-[min(38vw,600px)] pl-8' : 'mt-10'}`}>
      <p className="type-mega text-[clamp(2.5rem,5vw,5.5rem)] text-white">
        So what can <span className="font-editorial text-[#65e66d]">we</span> do?
      </p>
      <button
        type="button"
        onClick={() => onNavigate('solutions')}
        className="group mt-10 inline-flex w-fit items-center gap-3 rounded-full bg-[#f5f7f2] py-2 pl-6 pr-2 text-sm font-bold text-[#04110a] cursor-pointer"
      >
        <RollText>See the solutions</RollText>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#04110a] text-white transition-transform duration-500 group-hover:-rotate-45">
          <ArrowRight className="h-4 w-4" />
        </span>
      </button>
    </div>
  );

  if (!horizontal) {
    return (
      <section id="effects" data-nav-theme="dark" className="dark bg-[#040805] px-5 py-24 sm:px-8">
        {intro}
        <div className="space-y-5">
          {impactPanels.map((p, i) => (
            <FadeUp key={p.title}>
              <ImpactPanel panel={p} i={i} horizontal={false} />
            </FadeUp>
          ))}
        </div>
        {outro}
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="effects" data-nav-theme="dark" className="dark relative bg-[#040805]" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div ref={trackRef} style={{ x }} className="flex items-center gap-6 px-12">
          {intro}
          {impactPanels.map((p, i) => (
            <ImpactPanel key={p.title} panel={p} i={i} horizontal />
          ))}
          {outro}
        </motion.div>
        <div className="absolute bottom-8 left-12 right-12 h-px bg-white/10">
          <motion.div style={{ scaleX: progressScale }} className="h-full origin-left bg-[#ffb36b]" />
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------------- */
/* 7. Carbon flux canvas                                                      */
/* ------------------------------------------------------------------------- */

const Flux: React.FC = () => (
  <section className={`${SHELL} pt-28 sm:pt-36 lg:pt-44 ${INK}`}>
    <div className="mb-12 grid gap-8 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-3">
        <SectionLabel index="04" className={MUTED}>
          Atmospheric dynamics
        </SectionLabel>
      </div>
      <h2 className="type-mega text-[clamp(2.6rem,6.2vw,6.5rem)] lg:col-span-6">
        <MaskLine>Carbon flux &</MaskLine>
        <MaskLine delay={0.08}>
          <span className="font-editorial text-[#2E7D32] dark:text-[#65e66d]">biospheric</span> sinks.
        </MaskLine>
      </h2>
      <p className={`font-mono text-xs leading-relaxed ${MUTED} lg:col-span-3 lg:text-right`}>
        Drag to rotate the 3D globe · click hotspots · scroll to zoom · + to inject sinks
      </p>
    </div>
    <FadeUp>
      <AtmosphericCanvas />
    </FadeUp>
  </section>
);

/* ------------------------------------------------------------------------- */
/* 8. Five solutions                                                          */
/* ------------------------------------------------------------------------- */

const SolutionCard: React.FC<{ s: (typeof solutions)[number]; i: number; onClick: () => void }> = ({ s, i, onClick }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r || !ref.current) return;
    ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`);
    ref.current.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  const { Icon } = s;
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      onPointerMove={onMove}
      data-cursor-label="Explore"
      className={`group relative flex h-full min-h-[340px] w-full flex-col overflow-hidden rounded-[28px] border ${RULE} bg-white/70 p-6 text-left backdrop-blur-sm transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 dark:bg-[#0A140B]/80 sm:p-8 cursor-pointer ${
        i < 2 ? 'lg:min-h-[420px]' : ''
      }`}
      style={{ '--tint': s.tint } as React.CSSProperties}
    >
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), ${s.tint}33, transparent 65%)` }}
      />
      <span className="relative flex items-start justify-between">
        <span className={`font-mono text-xs ${MUTED}`}>0{i + 1}</span>
        <span
          className="flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-700 group-hover:rotate-[360deg]"
          style={{ backgroundColor: `${s.tint}22`, color: s.tint }}
        >
          <Icon className="h-5 w-5" />
        </span>
      </span>
      <span className="relative mt-auto block pt-14">
        <span className={`block font-display text-[clamp(1.6rem,2.4vw,2.4rem)] font-semibold leading-[1] tracking-[-0.035em] ${INK}`}>
          {s.title}
        </span>
        <span className={`mt-3 block max-w-xs text-sm leading-relaxed ${MUTED}`}>{s.copy}</span>
        <span className={`mt-6 flex items-end justify-between border-t ${RULE} pt-5`}>
          <span className={INK}>
            <span className="font-display text-[clamp(2.4rem,4vw,3.75rem)] font-semibold leading-none tracking-[-0.05em]">
              −<InViewCount to={s.kg} />
            </span>
            <span className={`ml-2 font-mono text-[11px] ${MUTED}`}>kg CO₂e / yr</span>
          </span>
          <ArrowUpRight className={`h-5 w-5 ${MUTED} transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1`} />
        </span>
      </span>
    </button>
  );
};

const Solutions: React.FC<{ onNavigate: (tab: PageTab) => void }> = ({ onNavigate }) => (
  <section className={`${SHELL} py-28 sm:py-36 lg:py-44 ${INK}`}>
    <div className="mb-14 grid gap-8 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-3">
        <SectionLabel index="05" className={MUTED}>
          Core interventions
        </SectionLabel>
      </div>
      <h2 className="type-mega text-[clamp(2.75rem,7vw,7.5rem)] lg:col-span-6">
        <MaskLine>Five moves</MaskLine>
        <MaskLine delay={0.08}>
          that <span className="font-editorial text-[#2E7D32] dark:text-[#65e66d]">matter.</span>
        </MaskLine>
      </h2>
      <div className="lg:col-span-3 lg:flex lg:justify-end">
        <button
          type="button"
          onClick={() => onNavigate('solutions')}
          className="group inline-flex items-center gap-3 rounded-full bg-[#0B140C] py-2 pl-6 pr-2 text-sm font-bold text-white dark:bg-[#65e66d] dark:text-[#04110a] cursor-pointer"
        >
          <RollText>Solutions hub</RollText>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f7f2] text-[#0B140C] transition-transform duration-500 group-hover:-rotate-45 dark:bg-[#04110a] dark:text-[#65e66d]">
            <ArrowRight className="h-4 w-4" />
          </span>
        </button>
      </div>
    </div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
      {solutions.map((s, i) => (
        <FadeUp key={s.title} delay={(i % 3) * 0.08} className={i < 2 ? 'lg:col-span-3' : 'lg:col-span-2'}>
          <SolutionCard s={s} i={i} onClick={() => onNavigate('solutions')} />
        </FadeUp>
      ))}
    </div>
  </section>
);

/* ------------------------------------------------------------------------- */
/* 9. Simulator                                                               */
/* ------------------------------------------------------------------------- */

const Simulator: React.FC<{ onNavigate: (tab: PageTab) => void }> = ({ onNavigate }) => (
  <section className={`${SHELL} pb-28 sm:pb-36 lg:pb-44 ${INK}`}>
    <div className="mb-12 grid gap-8 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-3">
        <SectionLabel index="06" className={MUTED}>
          Simulate
        </SectionLabel>
      </div>
      <h2 className="type-mega text-[clamp(2.75rem,7vw,7.5rem)] lg:col-span-6">
        <MaskLine>
          Turn the <span className="font-editorial text-[#2E7D32] dark:text-[#65e66d]">dials.</span>
        </MaskLine>
      </h2>
      <p className={`text-sm leading-relaxed ${MUTED} lg:col-span-3`}>
        Scale five decarbonization levers and watch projected warming, CO₂ concentration and avoided damages respond in real
        time.
      </p>
    </div>
    <FadeUp>
      <ScenarioSimulator onNavigate={onNavigate} />
    </FadeUp>
  </section>
);

/* ------------------------------------------------------------------------- */
/* 10. Methodology                                                            */
/* ------------------------------------------------------------------------- */

const Methodology: React.FC = () => (
  <section className={`border-t ${RULE} ${INK}`}>
    <div className={`${SHELL} py-28 sm:py-36 lg:py-44`}>
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionLabel index="07" className={MUTED}>
            Accounting framework
          </SectionLabel>
          <h2 className="type-mega mt-8 text-[clamp(2.6rem,5.6vw,6rem)]">
            <MaskLine>Built on the</MaskLine>
            <MaskLine delay={0.08}>
              <span className="font-editorial text-[#2E7D32] dark:text-[#65e66d]">science.</span>
            </MaskLine>
          </h2>
          <div className="mt-8 flex flex-wrap gap-2">
            <span className={`rounded-full border ${RULE} px-4 py-1.5 text-xs font-semibold`}>Standard: GHG Protocol</span>
            <span className="rounded-full bg-[#65e66d] px-4 py-1.5 font-mono text-xs font-bold text-[#04110a]">Scopes 1, 2 & 3</span>
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          {pillars.map((p, i) => (
            <FadeUp key={p.title} delay={i * 0.06} className={`grid grid-cols-12 gap-4 border-t ${RULE} py-7`}>
              <span className={`col-span-2 font-mono text-xs ${MUTED}`}>0{i + 1}</span>
              <div className="col-span-10">
                <h3 className="font-display text-2xl font-semibold tracking-[-0.03em]">{p.title}</h3>
                <p className={`mt-2 text-sm leading-relaxed ${MUTED}`}>{p.copy}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>

      <div className="mt-24">
        <span className={`type-label ${MUTED}`}>Peer-reviewed scientific data sources</span>
        <div className="mt-6">
          {sources.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group grid grid-cols-12 items-center gap-4 border-t ${RULE} py-6 last:border-b`}
            >
              <span className="col-span-12 font-display text-[clamp(1.5rem,3vw,2.75rem)] font-semibold tracking-[-0.04em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 sm:col-span-6">
                {s.name}
              </span>
              <span className={`col-span-10 font-mono text-xs ${MUTED} sm:col-span-5`}>{s.org}</span>
              <span className="col-span-2 flex justify-end sm:col-span-1">
                <ArrowUpRight className="h-6 w-6 transition-transform duration-500 group-hover:rotate-45 group-hover:text-[#2E7D32] dark:group-hover:text-[#65e66d]" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------------- */
/* 11. Closing call to action                                                 */
/* ------------------------------------------------------------------------- */

const FinalCta: React.FC<{
  onNavigate: (tab: PageTab) => void;
  onOpenGuidedTour?: () => void;
  onOpenCommandPalette?: () => void;
}> = ({ onNavigate, onOpenGuidedTour, onOpenCommandPalette }) => (
  <section data-nav-theme="dark" className="dark relative overflow-hidden bg-[#040805] text-white">
    <div className="pointer-events-none absolute -right-[20vw] -top-[30vw] h-[70vw] w-[70vw] rounded-full bg-[#1f7a35]/25 blur-[140px]" />
    <div className={`${SHELL} relative grid gap-14 py-28 sm:py-40 lg:grid-cols-12 lg:items-end lg:py-52`}>
      <div className="lg:col-span-9">
        <SectionLabel index="08" className="text-white/50">
          Begin
        </SectionLabel>
        <h2 className="type-mega mt-10 text-[clamp(3.6rem,13vw,14rem)]">
          <MaskLine>Know your</MaskLine>
          <MaskLine delay={0.1}>
            <span className="font-editorial text-[#65e66d]">number.</span>
          </MaskLine>
        </h2>
        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/60">
          {onOpenGuidedTour && (
            <button type="button" onClick={onOpenGuidedTour} className={`${UNDERLINE_WIPE} hover:text-white cursor-pointer`}>
              Take the guided tour
            </button>
          )}
          <button type="button" onClick={() => onNavigate('planner')} className={`${UNDERLINE_WIPE} hover:text-white cursor-pointer`}>
            Open the planner
          </button>
          {onOpenCommandPalette && (
            <button type="button" onClick={onOpenCommandPalette} className={`${UNDERLINE_WIPE} hover:text-white cursor-pointer`}>
              Jump anywhere · ⌘K
            </button>
          )}
        </div>
      </div>
      <div className="flex lg:col-span-3 lg:justify-end">
        <Magnet padding={40} magnetStrength={3}>
          <button
            type="button"
            onClick={() => onNavigate('calculator')}
            aria-label="Start calculating your footprint"
            className="group relative flex h-44 w-44 items-center justify-center rounded-full text-white sm:h-52 sm:w-52 cursor-pointer"
          >
            <RotatingBadge text="CALCULATE • YOUR • FOOTPRINT • NOW • " className="absolute inset-0 text-white/70" />
            <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#65e66d] text-[#04110a] transition-transform duration-500 group-hover:scale-110 sm:h-28 sm:w-28">
              <ArrowDown className="h-7 w-7 -rotate-[135deg] transition-transform duration-500 group-hover:-rotate-90" />
            </span>
          </button>
        </Magnet>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------------- */

interface OverviewViewProps {
  onNavigate: (tab: PageTab) => void;
  onOpenDesignDoc: () => void;
  onOpenCommandPalette?: () => void;
  onOpenGuidedTour?: () => void;
  /** False while the intro loader still covers the page; hero animations wait for it. */
  ready?: boolean;
  /** Fired once the hero globe has finished its heavy first render. */
  onHeroVisualReady?: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onNavigate,
  onOpenDesignDoc,
  onOpenCommandPalette,
  onOpenGuidedTour,
  ready = true,
  onHeroVisualReady,
}) => (
  <div className="relative">
    <Hero ready={ready} onVisualReady={onHeroVisualReady} onNavigate={onNavigate} onOpenDesignDoc={onOpenDesignDoc} onOpenGuidedTour={onOpenGuidedTour} />
    <MarqueeBand />
    <Manifesto />
    <ZoomReveal />
    <Pathway onNavigate={onNavigate} />
    <Impact onNavigate={onNavigate} />
    <Flux />
    <Solutions onNavigate={onNavigate} />
    <Simulator onNavigate={onNavigate} />
    <Methodology />
    <FinalCta onNavigate={onNavigate} onOpenGuidedTour={onOpenGuidedTour} onOpenCommandPalette={onOpenCommandPalette} />
  </div>
);
