'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  PenTool,
  Monitor,
  Film,
  Code2,
} from 'lucide-react';

interface HeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  heroImageUrl?: string;
  whatsappUrl?: string;
  onSelectCategory?: (category: string) => void;
}

interface ParticleStage {
  id: string;
  label: string;
  files: string[];
  category?: string;
}

const PARTICLE_STAGES: ParticleStage[] = [
  {
    id: 'cerebro',
    label: '1. Cérebro',
    files: ['/particles/cerebro.png', '/particles/cérebro.png'],
  },
  {
    id: 'caneta',
    label: '2. Caneta',
    files: ['/particles/caneta.png'],
    category: 'design_grafico',
  },
  {
    id: 'monitor',
    label: '3. Monitor',
    files: ['/particles/monitor.png'],
    category: 'webdesign',
  },
  {
    id: 'editvid',
    label: '4. EditVid',
    files: ['/particles/editvid.png'],
    category: 'audiovisual',
  },
  {
    id: 'artcodigo',
    label: '5. ArtCódigo',
    files: ['/particles/artcodigo.png'],
    category: 'dev_web',
  },
  {
    id: 'jesus',
    label: '6. Jesus',
    files: ['/particles/jesus.png'],
  },
];

const DALA_PALETTE = [
  '#8052ff', // Electric Iris
  '#ffb829', // Saffron Spark
  '#15846e', // Deep Verdant
  '#13C8F5', // Ciano Neon
  '#ff2a85', // Magenta Neon
];

interface TargetPoint {
  x: number;
  y: number;
  color: string;
}

interface TriangleParticle {
  x: number;
  y: number;
  tx: number;
  ty: number;
  color: string;
  size: number;
  angle: number;
  spin: number;
  speed: number;
}

export default function Hero({
  onSelectCategory,
}: HeroProps) {
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [autoPlay] = useState<boolean>(true);

  const mainCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const ambientCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<TriangleParticle[]>([]);
  const shapeTargetsRef = useRef<TargetPoint[][]>([[], [], [], [], [], []]);
  const currentStageRef = useRef<number>(0);

  const specialties = [
    {
      id: 'design_grafico',
      stageIndex: 1, 
      title: 'Design Gráfico',
      description: 'Identidade visual, peças publicitárias, materiais impressos e tratamento de imagens.',
      icon: PenTool,
    },
    {
      id: 'webdesign',
      stageIndex: 2, 
      title: 'Webdesign',
      description: 'Interfaces modernas, sites responsivos e experiências digitais.',
      icon: Monitor,
    },
    {
      id: 'audiovisual',
      stageIndex: 3, 
      title: 'Criação e Edição de Vídeos',
      description: 'Conteúdo para redes sociais, edição, animações e produção audiovisual.',
      icon: Film,
    },
    {
      id: 'dev_web',
      stageIndex: 4, 
      title: 'DEV',
      description: 'Desenvolvimento web, interfaces e soluções digitais.',
      icon: Code2,
    },
  ];

  const handleStageChange = (index: number) => {
    setCurrentStage(index);
    currentStageRef.current = index;
    const targets = shapeTargetsRef.current[index];
    const pts = particlesRef.current;
    if (!targets || targets.length === 0 || pts.length === 0) return;

    for (let i = 0; i < pts.length; i++) {
      const t = targets[i % targets.length];
      pts[i].tx = t.x;
      pts[i].ty = t.y;
      pts[i].color = t.color;
    }
  };

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      const next = (currentStageRef.current + 1) % PARTICLE_STAGES.length;
      handleStageChange(next);
    }, 5500);
    return () => clearInterval(timer);
  }, [autoPlay]);

  useEffect(() => {
    const mainCanvas = mainCanvasRef.current;
    const ambientCanvas = ambientCanvasRef.current;
    if (!mainCanvas || !ambientCanvas) return;

    const ctx = mainCanvas.getContext('2d');
    const ambientCtx = ambientCanvas.getContext('2d');
    if (!ctx || !ambientCtx) return;

    let animationFrameId: number;
    let isMounted = true;
    const PARTICLE_COUNT = 1800; 
    const mouse = { x: -9999, y: -9999, radius: 110 };

    let ambientParticles: {
      x: number;
      y: number;
      size: number;
      angle: number;
      spin: number;
      vx: number;
      vy: number;
      color: string;
      alpha: number;
    }[] = [];

    const initAmbient = () => {
      ambientCanvas.width = window.innerWidth;
      ambientCanvas.height = window.innerHeight;
      ambientParticles = [];
      for (let i = 0; i < 75; i++) {
        ambientParticles.push({
          x: Math.random() * ambientCanvas.width,
          y: Math.random() * ambientCanvas.height,
          size: 3 + Math.random() * 4.5,
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.01,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          color: DALA_PALETTE[Math.floor(Math.random() * DALA_PALETTE.length)],
          alpha: 0.14 + Math.random() * 0.25,
        });
      }
    };

    const loadImage = (urls: string[]): Promise<HTMLImageElement | null> => {
      return new Promise((resolve) => {
        let idx = 0;
        const tryNext = () => {
          if (idx >= urls.length) {
            resolve(null);
            return;
          }
          const img = new window.Image();
          img.crossOrigin = 'Anonymous';
          img.onload = () => resolve(img);
          img.onerror = () => {
            idx++;
            tryNext();
          };
          img.src = urls[idx];
        };
        tryNext();
      });
    };

    const extractImagePoints = (img: HTMLImageElement, width: number, height: number): TargetPoint[] => {
      const offCanvas = document.createElement('canvas');
      const offCtx = offCanvas.getContext('2d');
      offCanvas.width = width;
      offCanvas.height = height;
      if (!offCtx) return [];

      const scale = Math.min((width * 0.88) / img.width, (height * 0.88) / img.height);
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      const offsetX = (width - drawW) / 2;
      const offsetY = (height - drawH) / 2;

      offCtx.drawImage(img, offsetX, offsetY, drawW, drawH);
      const data = offCtx.getImageData(0, 0, width, height).data;
      const validPoints: TargetPoint[] = [];
      const step = 3;

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const i = (y * width + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          const isWhiteBg = r > 245 && g > 245 && b > 245;
          if (a > 28 && !isWhiteBg) {
            validPoints.push({
              x,
              y,
              color: `rgb(${r}, ${g}, ${b})`,
            });
          }
        }
      }
      return validPoints;
    };

    const generateFallback = (stageId: string, width: number, height: number): TargetPoint[] => {
      const offCanvas = document.createElement('canvas');
      const offCtx = offCanvas.getContext('2d');
      offCanvas.width = width;
      offCanvas.height = height;
      if (!offCtx) return [];

      const cx = width / 2;
      const cy = height / 2;
      offCtx.lineWidth = 5;
      offCtx.strokeStyle = '#8052ff';

      if (stageId === 'cerebro') {
        offCtx.beginPath();
        offCtx.ellipse(cx - 70, cy, 110, 140, -0.15, 0, Math.PI * 2);
        offCtx.ellipse(cx + 70, cy, 110, 140, 0.15, 0, Math.PI * 2);
        offCtx.stroke();
      } else {
        offCtx.strokeRect(cx - 140, cy - 110, 280, 220);
      }

      const data = offCtx.getImageData(0, 0, width, height).data;
      const pts: TargetPoint[] = [];
      for (let y = 0; y < height; y += 3) {
        for (let x = 0; x < width; x += 3) {
          if (data[(y * width + x) * 4 + 3] > 30) {
            pts.push({
              x,
              y,
              color: DALA_PALETTE[Math.floor(Math.random() * DALA_PALETTE.length)],
            });
          }
        }
      }
      return pts;
    };

    const prepareShapes = async () => {
      const rect = mainCanvas.parentElement?.getBoundingClientRect();
      const w = Math.max(rect?.width || window.innerWidth, 360);
      const h = Math.max(rect?.height || 640, 420);
      mainCanvas.width = w;
      mainCanvas.height = h;

      for (let s = 0; s < PARTICLE_STAGES.length; s++) {
        const stage = PARTICLE_STAGES[s];
        const img = await loadImage(stage.files);
        if (!isMounted) return;

        let rawPoints = img ? extractImagePoints(img, w, h) : [];
        if (rawPoints.length < 50) {
          rawPoints = generateFallback(stage.id, w, h);
        }

        const stageTargets: TargetPoint[] = [];
        for (let p = 0; p < PARTICLE_COUNT; p++) {
          
          // SE FOR O ESTÁGIO "JESUS", AS PARTÍCULAS SE ESPALHAM COMO ESTRELAS NO FUNDO
          if (stage.id === 'jesus') {
            stageTargets.push({
              x: Math.random() * w,
              y: Math.random() * h,
              color: DALA_PALETTE[Math.floor(Math.random() * DALA_PALETTE.length)],
            });
          } else {
            // SE FOREM AS OUTRAS 5 IMAGENS, ELAS FORMAM O DESENHO
            const sample = rawPoints[Math.floor(Math.random() * rawPoints.length)] || {
              x: Math.random() * w,
              y: Math.random() * h,
              color: DALA_PALETTE[p % DALA_PALETTE.length],
            };
            stageTargets.push({
              x: sample.x + (Math.random() - 0.5) * 1.2,
              y: sample.y + (Math.random() - 0.5) * 1.2,
              color:
                Math.random() < 0.16
                  ? DALA_PALETTE[Math.floor(Math.random() * DALA_PALETTE.length)]
                  : sample.color,
            });
          }
        }
        shapeTargetsRef.current[s] = stageTargets;
      }

      const activeIdx = currentStageRef.current;
      const startTargets = shapeTargetsRef.current[activeIdx];
      const newParticles: TriangleParticle[] = [];

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const t = startTargets[i] || { x: w / 2, y: h / 2, color: '#8052ff' };
        newParticles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          tx: t.x,
          ty: t.y,
          color: t.color,
          size: 1.8 + Math.random() * 1.8,
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.04,
          speed: 0.045 + Math.random() * 0.05,
        });
      }
      particlesRef.current = newParticles;
    };

    const render = () => {
      ambientCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
      for (const ap of ambientParticles) {
        ap.x += ap.vx;
        ap.y += ap.vy;
        ap.angle += ap.spin;
        if (ap.x < 0) ap.x = ambientCanvas.width;
        if (ap.x > ambientCanvas.width) ap.x = 0;
        if (ap.y < 0) ap.y = ambientCanvas.height;
        if (ap.y > ambientCanvas.height) ap.y = 0;

        ambientCtx.save();
        ambientCtx.translate(ap.x, ap.y);
        ambientCtx.rotate(ap.angle);
        ambientCtx.strokeStyle = ap.color;
        ambientCtx.globalAlpha = ap.alpha;
        ambientCtx.lineWidth = 1;
        ambientCtx.beginPath();
        ambientCtx.moveTo(0, -ap.size);
        ambientCtx.lineTo(ap.size * 0.866, ap.size * 0.5);
        ambientCtx.lineTo(-ap.size * 0.866, ap.size * 0.5);
        ambientCtx.closePath();
        ambientCtx.stroke();
        ambientCtx.restore();
      }

      ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
      const pts = particlesRef.current;
      const now = Date.now() * 0.002;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += (p.tx - p.x) * p.speed;
        p.y += (p.ty - p.y) * p.speed;
        p.angle += p.spin;

        p.x += Math.sin(now + i) * 0.32;
        p.y += Math.cos(now + i) * 0.32;

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius && dist > 0) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x += (dx / dist) * force * 8.5;
          p.y += (dy / dist) * force * 8.5;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.lineTo(p.size * 0.866, p.size * 0.5);
        ctx.lineTo(-p.size * 0.866, p.size * 0.5);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = mainCanvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const onResize = () => {
      initAmbient();
      prepareShapes();
    };

    mainCanvas.addEventListener('mousemove', onMouseMove);
    mainCanvas.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', onResize);

    initAmbient();
    prepareShapes().then(() => {
      if (isMounted) render();
    });

    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
      mainCanvas.removeEventListener('mousemove', onMouseMove);
      mainCanvas.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section
      id="inicio"
      className="relative min-h-[calc(100vh-80px)] flex flex-col justify-between overflow-hidden bg-[#000000] text-[#ffffff] border-b border-white/10 isolate font-dala"
    >
      <canvas
        ref={ambientCanvasRef}
        className="fixed inset-0 pointer-events-none z-0"
      />

      <div className="relative z-30 w-full bg-gradient-to-b from-[#000000] to-transparent pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4 pointer-events-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-0 lg:divide-x lg:divide-white/10">
            {specialties.map((item) => {
              const Icon = item.icon;
              const isSelectedStage = currentStage === item.stageIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => handleStageChange(item.stageIndex)}
                  onClick={() => {
                    handleStageChange(item.stageIndex);
                    if (onSelectCategory) onSelectCategory(item.id);
                  }}
                  className={`flex items-center gap-3.5 lg:px-5 first:lg:pl-0 last:lg:pr-0 text-left group hover:bg-white/[0.04] p-2.5 sm:p-3 rounded-2xl transition-all cursor-pointer ${
                    isSelectedStage ? 'bg-white/[0.04]' : ''
                  }`}
                >
                  <div
                    className={`p-2 sm:p-2.5 rounded-xl border transition-all shrink-0 ${
                      isSelectedStage
                        ? 'bg-[#8052ff] border-[#8052ff] text-white shadow-[0_0_16px_rgba(128,82,255,0.6)] scale-105'
                        : 'bg-[#0a0a0f] border-[#8052ff]/40 text-[#ffb829] group-hover:border-[#8052ff] group-hover:scale-105'
                    }`}
                  >
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-semibold text-[#ffffff] group-hover:text-[#ffb829] transition-colors leading-tight mb-0.5 truncate">
                      {item.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[#9a9a9a] leading-relaxed line-clamp-2 font-light">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative z-20 flex-1 w-full flex items-center justify-center overflow-hidden">
        <div className="w-full h-[64vh] sm:h-[70vh] lg:h-[74vh] relative flex items-center justify-center">
          
          <canvas
            ref={mainCanvasRef}
            className="w-full h-full block cursor-crosshair absolute inset-0 z-10"
            title="Passe o mouse para interagir com as partículas"
          />

          {/* IMAGEM REAL DE JESUS SOBREPOSTA ÀS PARTÍCULAS ESPALHADAS */}
          <img
            src="/particles/jesus.png"
            alt="Essência e Propósito"
            className={`absolute z-20 max-w-[85%] max-h-[85%] object-contain transition-all duration-1000 ease-in-out pointer-events-none ${
              currentStage === 5 ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 blur-sm'
            }`}
          />

        </div>
      </div>
    </section>
  );
}