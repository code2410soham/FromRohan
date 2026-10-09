import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import Countdown from './Countdown';

export default function CinematicIntro({ config, onComplete, onStartTransition, isTransitioning }) {
  const [step, setStep] = useState(1);
  const [clicked, setClicked] = useState(false);

  // Progressive text revelation
  useEffect(() => {
    const timer1 = setTimeout(() => setStep(2), 2200);
    const timer2 = setTimeout(() => setStep(3), 4400);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleOpenSurprise = () => {
    if (clicked || isTransitioning) return;
    setClicked(true);

    if (onStartTransition) {
      onStartTransition();
    } else {
      onComplete();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a1317',
        backgroundImage: `
          radial-gradient(at 20% 20%, rgba(225, 29, 72, 0.25) 0px, transparent 60%),
          radial-gradient(at 80% 80%, rgba(147, 51, 234, 0.25) 0px, transparent 60%),
          radial-gradient(at 50% 50%, rgba(251, 146, 60, 0.15) 0px, transparent 70%)
        `,
        padding: 'clamp(2rem, 5vw, 3rem) clamp(1rem, 4vw, 2rem)',
        textAlign: 'center',
        color: '#ffffff',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {/* Background Floating Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'rgba(251, 113, 133, 0.18)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'rgba(192, 132, 252, 0.18)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }}
      />

      {/* Skip Button in upper right corner */}
      <button
        onClick={onComplete}
        style={{
          position: 'absolute',
          top: 'calc(16px + var(--safe-top, 0px))',
          right: 'calc(16px + var(--safe-right, 0px))',
          padding: '8px 18px',
          borderRadius: '999px',
          fontSize: '0.85rem',
          color: 'rgba(255, 255, 255, 0.75)',
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.2s ease',
          zIndex: 10
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#ffffff';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
        }}
        aria-label="Skip introduction"
      >
        Skip Intro →
      </button>

      {/* Main Cinematic Text & Sequence */}
      <div style={{ maxWidth: '640px', zIndex: 2 }}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.8 }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#fda4af',
                  fontSize: '0.9rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '1.2rem'
                }}
              >
                <Sparkles size={16} /> Whisper from the universe <Sparkles size={16} />
              </div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)',
                  fontWeight: 500,
                  lineHeight: 1.3,
                  color: '#fff1f2'
                }}
              >
                Someone very special has a birthday today...
              </h2>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.8 }}
            >
              <div
                style={{
                  fontSize: '2rem',
                  marginBottom: '1rem'
                }}
              >
                ✨ 🌸 🎂
              </div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                  fontWeight: 600,
                  lineHeight: 1.25,
                  color: '#ffe4e6'
                }}
              >
                And this little corner of the internet is just for her.
              </h2>
            </motion.div>
          )}

          {step >= 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 16px',
                  borderRadius: '999px',
                  background: 'rgba(251, 113, 133, 0.15)',
                  border: '1px solid rgba(251, 113, 133, 0.35)',
                  color: '#fecdd3',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  marginBottom: '1.2rem'
                }}
              >
                <Gift size={14} /> Specially handcrafted with love
              </div>

              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(2.5rem, 6vw, 4.2rem)',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '1rem',
                  textShadow: '0 4px 20px rgba(225, 29, 72, 0.35)'
                }}
              >
                Happy Birthday, <span style={{ color: '#fda4af', fontStyle: 'italic' }}>{config.name}</span> 🎂
              </h1>

              <p
                style={{
                  fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                  color: '#e5d8df',
                  fontFamily: "'Caveat', cursive",
                  fontSize: '1.45rem',
                  marginBottom: '1.4rem'
                }}
              >
                Ready for your little surprise journey?
              </p>

              {/* Live Birthday Countdown on Landing Page */}
              <Countdown
                birthdayDate={config.birthdayDate}
                name={config.name}
              />

              <div>
                <motion.button
                  id="open-surprise-btn"
                  whileHover={clicked || isTransitioning ? {} : { scale: 1.05 }}
                  whileTap={clicked || isTransitioning ? {} : { scale: 0.96 }}
                  animate={clicked ? { scale: 0.94, boxShadow: '0 0 50px rgba(251, 113, 133, 0.8)' } : { scale: 1 }}
                  onClick={handleOpenSurprise}
                  disabled={clicked || isTransitioning}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '16px 36px',
                    borderRadius: '999px',
                    background: 'linear-gradient(135deg, #fb7185 0%, #e11d48 100%)',
                    color: '#ffffff',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    boxShadow: '0 10px 30px rgba(225, 29, 72, 0.45)',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    cursor: clicked || isTransitioning ? 'default' : 'pointer',
                    opacity: isTransitioning ? 0.85 : 1,
                    transition: 'opacity 0.3s ease'
                  }}
                  aria-label="Open Your Surprise"
                >
                  <Heart size={18} fill="#ffffff" /> Open Your Surprise ❤️
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delicate bottom copyright / whisper */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          fontSize: '0.8rem',
          color: 'rgba(255, 255, 255, 0.4)',
          letterSpacing: '0.05em'
        }}
      >
        A personalized gift from your best friend • Turn audio on for full magic ✨
      </div>
    </motion.div>
  );
}
