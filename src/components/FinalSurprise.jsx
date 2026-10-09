import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, RotateCcw, PartyPopper } from 'lucide-react';
import { triggerBirthdayConfetti } from '../utils/confetti';
import confetti from 'canvas-confetti';

export default function FinalSurprise({ config, onReplay }) {
  const triggerGrandConfetti = () => {
    triggerBirthdayConfetti('celebration');
    try {
      // Elegant multi-stage fireworks confetti
      const count = 200;
      const defaults = {
        origin: { y: 0.7 }
      };

      function fire(particleRatio, opts) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
        colors: ['#f43f5e', '#fb7185', '#ffffff']
      });
      fire(0.2, {
        spread: 60,
        colors: ['#fed7aa', '#fecdd3', '#c084fc']
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
        colors: ['#fda4af', '#f43f5e', '#d4af37']
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45
      });
    } catch {
      // safe fallback
    }
  };

  return (
    <section
      id="climax"
      className="section-wrapper"
      style={{
        position: 'relative',
        padding: 'clamp(4rem, 8vw, 7rem) 0 clamp(3rem, 6vw, 5rem) 0',
        overflow: 'hidden',
        textAlign: 'center'
      }}
    >
      {/* Background Soft Radiant Lights */}
      <div
        className="glowing-orb"
        style={{
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(254, 205, 211, 0.6) 0%, rgba(243, 232, 255, 0.3) 50%, transparent 70%)'
        }}
      />

      <div className="site-container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-card"
          style={{
            maxWidth: '820px',
            margin: '0 auto',
            padding: 'clamp(2.5rem, 5vw, 4.5rem) clamp(1rem, 4vw, 2rem)',
            border: '2px solid rgba(254, 205, 211, 0.8)',
            boxShadow: '0 25px 60px rgba(94, 60, 70, 0.12)'
          }}
        >
          {/* Top Heart Badge */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fb7185, #e11d48)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.75rem auto',
              boxShadow: '0 10px 28px rgba(225, 29, 72, 0.35)',
              color: '#ffffff'
            }}
          >
            <Heart size={32} fill="#ffffff" />
          </div>

          {/* Heading */}
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              color: '#2b2226',
              marginBottom: '1rem',
              lineHeight: 1.2
            }}
          >
            Happy Birthday, <span style={{ color: '#e11d48', fontStyle: 'italic' }}>{config.name}</span> ❤️
          </h2>

          {/* Emotional Subtext */}
          <p
            style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)',
              color: '#5e4f55',
              maxWidth: '620px',
              margin: '0 auto 1.5rem auto',
              lineHeight: 1.6
            }}
          >
            "{config.finalSurprise.message}"
          </p>

          <p
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: '1.75rem',
              color: '#b76e79',
              marginBottom: '2.5rem'
            }}
          >
            {config.finalSurprise.subtext}
          </p>

          {/* Buttons: Confetti burst & Replay */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1rem',
              alignItems: 'center'
            }}
          >
            <button
              onClick={triggerGrandConfetti}
              className="btn-primary"
              style={{ padding: '0.95rem 2.2rem', fontSize: '1rem' }}
            >
              <PartyPopper size={18} /> Celebrate with Confetti! 🎊
            </button>

            <button
              onClick={onReplay}
              className="btn-secondary"
              style={{ padding: '0.9rem 2rem' }}
            >
              <RotateCcw size={16} /> Replay the Journey ↻
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
