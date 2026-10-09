import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Botanical Silk Bloom Transition
 * 
 * Concept:
 * Inspired by luxury fashion campaigns, perfume editorial films, and high-end botanical aesthetics.
 * - Single magnificent central botanical flower blooms organically from an elegant bud.
 * - Petals gently unfold and expand outward, forming a soft silk curtain across the viewport.
 * - At peak coverage (~3.8s - 4.0s), the landing page switches to the main birthday page underneath.
 * - The silk petals gracefully part like luxury curtains (~4.0s - 5.2s), letting sunlight sweep across
 *   and unveiling the main birthday experience.
 * 
 * Total Duration: ~5.0 - 5.2 seconds
 */

export default function FlowerTransition({ onCover, onComplete, name = "Gaurii" }) {
  // Phase sequence:
  // 1: Button response & initial atmospheric silk veil (0.0s - 0.8s)
  // 2: Bud emerges & hero flower blooms (0.8s - 2.5s)
  // 3: Petals expand into full silk curtain cover (2.5s - 3.8s)
  // 4: Exact Page Switch moment (3.8s - 4.0s)
  // 5: Silk curtain parts, sunlight sweeps, reveal (4.0s - 5.2s)
  const [stage, setStage] = useState(1);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const coverTriggeredRef = useRef(false);

  // Check prefers-reduced-motion
  const isReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (isReducedMotion) {
      // Elegant reduced-motion fallback: soft silk cross-fade (~1.5s total)
      const tCover = setTimeout(() => {
        if (!coverTriggeredRef.current) {
          coverTriggeredRef.current = true;
          onCover();
        }
      }, 700);

      const tDone = setTimeout(() => {
        onComplete();
      }, 1500);

      return () => {
        clearTimeout(tCover);
        clearTimeout(tDone);
      };
    }

    // Stage 1 -> 2: Bloom begins (at 800ms)
    const t1 = setTimeout(() => setStage(2), 800);

    // Stage 2 -> 3: Petal curtain expansion (at 2400ms)
    const t2 = setTimeout(() => setStage(3), 2400);

    // Stage 3 -> 4: Full silk cover & Page Switch (at 3850ms)
    const tCover = setTimeout(() => {
      setStage(4);
      if (!coverTriggeredRef.current) {
        coverTriggeredRef.current = true;
        onCover();
      }
    }, 3850);

    // Stage 4 -> 5: Curtain parting & reveal (at 4100ms)
    const t3 = setTimeout(() => setStage(5), 4100);

    // Complete & cleanup (at 5200ms)
    const tDone = setTimeout(() => {
      onComplete();
    }, 5200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(tCover);
      clearTimeout(t3);
      clearTimeout(tDone);
    };
  }, [onCover, onComplete, isReducedMotion]);

  // Subtle Botanical Pollen & Floating Silk Petals Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const isMobile = width < 768;
    const pollenCount = isMobile ? 18 : 32;
    const petalCount = isMobile ? 6 : 12;

    // Soft botanical pollen particles
    const pollen = Array.from({ length: pollenCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 1,
      speedY: -(Math.random() * 0.8 + 0.3),
      speedX: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI
    }));

    // Soft silk floating petals
    const petals = Array.from({ length: petalCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.5 - 50,
      size: Math.random() * (isMobile ? 14 : 20) + 12,
      speedY: Math.random() * 1.4 + 0.8,
      speedX: Math.random() * 1 - 0.5,
      angle: Math.random() * Math.PI * 2,
      angularSpeed: (Math.random() - 0.5) * 0.02,
      flip: Math.random() * Math.PI,
      flipSpeed: Math.random() * 0.02 + 0.01,
      opacity: Math.random() * 0.5 + 0.35
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render Pollen
      pollen.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.pulse += 0.03;
        const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(254, 240, 138, ${currentAlpha})`;
        ctx.shadowColor = 'rgba(253, 224, 71, 0.5)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      });

      // Render Silk Petals
      petals.forEach((pt) => {
        pt.y += pt.speedY;
        pt.x += pt.speedX;
        pt.angle += pt.angularSpeed;
        pt.flip += pt.flipSpeed;

        if (pt.y > height + 40) {
          pt.y = -30;
          pt.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate(pt.angle);
        ctx.scale(1, Math.cos(pt.flip));
        ctx.fillStyle = 'rgba(254, 205, 211, 0.7)';
        ctx.globalAlpha = pt.opacity;

        ctx.beginPath();
        ctx.moveTo(0, -pt.size);
        ctx.bezierCurveTo(pt.size * 0.7, -pt.size * 0.5, pt.size * 0.8, pt.size * 0.4, 0, pt.size);
        ctx.bezierCurveTo(-pt.size * 0.8, pt.size * 0.4, -pt.size * 0.7, -pt.size * 0.5, 0, -pt.size);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      id="botanical-transition-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999, // Absolute priority overlay
        pointerEvents: 'auto',
        overflow: 'hidden',
        background: stage >= 4
          ? 'radial-gradient(ellipse at 50% 50%, #fff6f8 0%, #fde4eb 50%, #fbcfe8 100%)'
          : 'radial-gradient(ellipse at 50% 50%, rgba(255, 248, 250, 0.94) 0%, rgba(254, 230, 237, 0.96) 60%, rgba(243, 232, 255, 0.98) 100%)',
        opacity: stage === 5 ? 0 : 1,
        transition: 'opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1), background 0.8s ease'
      }}
    >
      {/* 1. CINEMATIC SUNLIGHT LIGHT SWEEP BEAM */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          bottom: '-20%',
          width: '60vw',
          left: 0,
          background: 'linear-gradient(115deg, transparent 15%, rgba(255, 255, 255, 0.6) 45%, rgba(254, 240, 138, 0.4) 55%, transparent 85%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          transform: stage >= 5
            ? 'translateX(220vw)'
            : stage >= 2
            ? 'translateX(40vw)'
            : 'translateX(-60vw)',
          transition: stage >= 5
            ? 'transform 1.4s cubic-bezier(0.16, 1, 0.3, 1)'
            : 'transform 2.2s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      />

      {/* 2. ATMOSPHERIC AMBIENT GLOW */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: stage >= 3 ? '130vw' : '75vw',
          height: stage >= 3 ? '130vh' : '75vh',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(254, 205, 211, 0.6) 0%, rgba(244, 114, 182, 0.25) 45%, rgba(233, 213, 255, 0.2) 70%, transparent 100%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          transition: 'all 1.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      />

      {/* 3. PROCEDURAL CANVAS PARTICLES & PETALS */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 2,
          opacity: stage === 5 ? 0.3 : 1,
          transition: 'opacity 0.8s ease'
        }}
      />

      {/* 4. THE HERO BOTANICAL SILK BLOOM FLOWER (CENTERPIECE) */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
          pointerEvents: 'none',
          // Flow: Bud (stage 1) -> Majestic Bloom (stage 2) -> Expands into Curtain (stage 3-4) -> Parts outwards (stage 5)
          transformOrigin: 'center center'
        }}
      >
        <div
          style={{
            transform: stage === 5
              ? 'scale(3.2) rotate(35deg)'
              : stage >= 4
              ? 'scale(2.6) rotate(20deg)'
              : stage >= 3
              ? 'scale(1.75) rotate(12deg)'
              : stage >= 2
              ? 'scale(1.1) rotate(0deg)'
              : 'scale(0.38) rotate(-15deg)',
            opacity: stage === 5 ? 0 : 1,
            transition: stage === 5
              ? 'transform 1.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1)'
              : 'transform 1.8s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.8s ease',
            filter: 'drop-shadow(0 20px 45px rgba(225, 29, 72, 0.18))'
          }}
        >
          <HeroBotanicalFlower stage={stage} />
        </div>
      </div>

      {/* 5. ORGANIC SILK PETAL CURTAIN VEILS (Forming Full Screen Cover during Stage 3 & 4) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 4,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Left Silk Petal Drape */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            bottom: '-20%',
            left: 0,
            width: '75vw',
            background: 'radial-gradient(ellipse at 20% 50%, #fff1f4 0%, #fecdd3 50%, rgba(251, 113, 133, 0.85) 100%)',
            borderTopRightRadius: '50% 100%',
            borderBottomRightRadius: '50% 100%',
            boxShadow: '20px 0 60px rgba(190, 18, 60, 0.15)',
            transform: stage === 5
              ? 'translateX(-120%) rotate(-12deg)' // Gracefully parts to the left
              : stage >= 3
              ? 'translateX(0%) rotate(0deg)'     // Seamlessly closes over the left half
              : 'translateX(-110%) rotate(-15deg)', // Stays hidden in stage 1 & 2
            opacity: stage >= 3 ? 1 : 0,
            transition: stage === 5
              ? 'all 1.3s cubic-bezier(0.16, 1, 0.3, 1)'
              : 'all 1.5s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        />

        {/* Right Silk Petal Drape */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            bottom: '-20%',
            right: 0,
            width: '75vw',
            background: 'radial-gradient(ellipse at 80% 50%, #fff1f4 0%, #fed7aa 40%, #fda4af 75%, rgba(244, 63, 94, 0.85) 100%)',
            borderTopLeftRadius: '50% 100%',
            borderBottomLeftRadius: '50% 100%',
            boxShadow: '-20px 0 60px rgba(190, 18, 60, 0.15)',
            transform: stage === 5
              ? 'translateX(120%) rotate(12deg)'  // Gracefully parts to the right
              : stage >= 3
              ? 'translateX(0%) rotate(0deg)'     // Seamlessly closes over the right half
              : 'translateX(110%) rotate(15deg)',  // Stays hidden in stage 1 & 2
            opacity: stage >= 3 ? 1 : 0,
            transition: stage === 5
              ? 'all 1.3s cubic-bezier(0.16, 1, 0.3, 1)'
              : 'all 1.5s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        />
      </div>

      {/* 6. EDITORIAL POETIC WHISPER */}
      <div
        style={{
          position: 'absolute',
          bottom: '12%',
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 10,
          pointerEvents: 'none',
          padding: '0 1.5rem'
        }}
      >
        <AnimatePresence>
          {stage >= 2 && stage < 4 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.15rem, 3.2vw, 1.85rem)',
                  color: '#831843',
                  letterSpacing: '0.04em',
                  margin: 0,
                  textShadow: '0 2px 14px rgba(255, 255, 255, 0.9)'
                }}
              >
                A beautiful birthday world unfolds for {name}... ✨
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// =====================================================================
// VECTOR COMPONENT: Hero Botanical Flower (Silk Rose / Camellia Bloom)
// =====================================================================
function HeroBotanicalFlower({ stage }) {
  const isBloom = stage >= 2;
  const isCurtain = stage >= 3;

  return (
    <div
      style={{
        width: 'min(420px, 90vw)',
        height: 'min(420px, 90vw)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <svg
        viewBox="0 0 500 500"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          {/* Subtle Silk Shading Gradients (Cream, Blush Pink, Soft Peach, Soft Lavender) */}
          <radialGradient id="silkCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#fff1f4" />
            <stop offset="70%" stopColor="#fbcfe8" />
            <stop offset="100%" stopColor="#f472b6" />
          </radialGradient>

          <linearGradient id="petalSilkOuter" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#fff5f7" />
            <stop offset="65%" stopColor="#fda4af" />
            <stop offset="100%" stopColor="#fb7185" />
          </linearGradient>

          <linearGradient id="petalSilkMid" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fff0f3" />
            <stop offset="45%" stopColor="#fed7aa" />
            <stop offset="85%" stopColor="#fda4af" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>

          <linearGradient id="petalSilkInner" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#fce7ec" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>

          <radialGradient id="stamenGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="60%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </radialGradient>
        </defs>

        {/* =============================================================
            TIER 1: OUTER SILK PETALS (8 Flowing Broad Petals)
            ============================================================= */}
        <g
          style={{
            transformOrigin: '250px 250px',
            transform: isCurtain
              ? 'scale(1.5) rotate(22deg)'
              : isBloom
              ? 'scale(1.1) rotate(8deg)'
              : 'scale(0.5) rotate(-20deg)',
            opacity: isBloom ? 0.96 : 0.4,
            transition: 'all 1.7s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        >
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
            <path
              key={`outer-${i}`}
              d="M 250 250 C 150 110, 350 110, 250 50 C 150 110, 350 110, 250 250 Z"
              fill="url(#petalSilkOuter)"
              style={{
                transformOrigin: '250px 250px',
                transform: `rotate(${deg}deg) ${isCurtain ? 'scale(1.35)' : isBloom ? 'scale(1.15)' : 'scale(0.6)'}`,
                transition: `transform 1.6s cubic-bezier(0.22, 1, 0.36, 1) ${i * 35}ms`,
                filter: 'drop-shadow(0 6px 14px rgba(225, 29, 72, 0.08))'
              }}
            />
          ))}
        </g>

        {/* =============================================================
            TIER 2: MIDDLE VELVET PETALS (6 Sculpted Petals)
            ============================================================= */}
        <g
          style={{
            transformOrigin: '250px 250px',
            transform: isCurtain
              ? 'scale(1.35) rotate(-16deg)'
              : isBloom
              ? 'scale(1.05) rotate(-6deg)'
              : 'scale(0.55) rotate(15deg)',
            opacity: isBloom ? 0.98 : 0.6,
            transition: 'all 1.6s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        >
          {[22.5, 82.5, 142.5, 202.5, 262.5, 322.5].map((deg, i) => (
            <path
              key={`mid-${i}`}
              d="M 250 250 C 180 140, 320 140, 250 100 C 180 140, 320 140, 250 250 Z"
              fill="url(#petalSilkMid)"
              style={{
                transformOrigin: '250px 250px',
                transform: `rotate(${deg}deg) ${isCurtain ? 'scale(1.25)' : isBloom ? 'scale(1.1)' : 'scale(0.7)'}`,
                transition: `transform 1.5s cubic-bezier(0.22, 1, 0.36, 1) ${i * 40}ms`,
                filter: 'drop-shadow(0 4px 10px rgba(225, 29, 72, 0.1))'
              }}
            />
          ))}
        </g>

        {/* =============================================================
            TIER 3: INNER PETAL BUD (5 Delicate Petals Unfurling)
            ============================================================= */}
        <g
          style={{
            transformOrigin: '250px 250px',
            transform: isCurtain
              ? 'scale(1.2) rotate(28deg)'
              : isBloom
              ? 'scale(1) rotate(14deg)'
              : 'scale(0.7) rotate(-10deg)',
            transition: 'all 1.5s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        >
          {[0, 72, 144, 216, 288].map((deg, i) => (
            <path
              key={`inner-${i}`}
              d="M 250 250 C 205 170, 295 170, 250 145 C 205 170, 295 170, 250 250 Z"
              fill="url(#petalSilkInner)"
              style={{
                transformOrigin: '250px 250px',
                transform: `rotate(${deg}deg) ${isBloom ? 'scale(1.08)' : 'scale(0.8)'}`,
                transition: `transform 1.4s cubic-bezier(0.22, 1, 0.36, 1) ${i * 30}ms`
              }}
            />
          ))}
        </g>

        {/* =============================================================
            CENTER STAMEN & GOLDEN DEWDROPS
            ============================================================= */}
        <circle
          cx="250"
          cy="250"
          r={isBloom ? "18" : "10"}
          fill="url(#stamenGlow)"
          style={{
            filter: 'drop-shadow(0 0 10px rgba(250, 204, 21, 0.6))',
            transition: 'r 1.2s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        />
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <circle
            key={`stamen-${i}`}
            cx={250 + Math.cos((deg * Math.PI) / 180) * (isBloom ? 14 : 7)}
            cy={250 + Math.sin((deg * Math.PI) / 180) * (isBloom ? 14 : 7)}
            r="2.5"
            fill="#d97706"
            style={{
              transition: 'all 1.2s cubic-bezier(0.22, 1, 0.36, 1)'
            }}
          />
        ))}
      </svg>
    </div>
  );
}
