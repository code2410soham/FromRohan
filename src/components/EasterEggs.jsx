import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Star, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function EasterEggs({ easterEggs = [] }) {
  const [activeToast, setActiveToast] = useState(null);

  const handleTriggerEgg = (egg) => {
    setActiveToast(egg.message);
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#f43f5e', '#fb7185', '#fed7aa', '#c084fc']
      });
    } catch {
      // safe
    }

    // Auto dismiss toast after 5s
    setTimeout(() => {
      setActiveToast(null);
    }, 5500);
  };

  return (
    <>
      {/* Floating Hidden Easter Egg 1: Top-Right Area */}
      <motion.button
        whileHover={{ scale: 1.3, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleTriggerEgg(easterEggs[0] || { message: "✨ Secret Found: You are loved more than you know!" })}
        title="✨ A little secret..."
        style={{
          position: 'fixed',
          top: 'calc(80px + var(--safe-top, 0px))',
          right: 'calc(16px + var(--safe-right, 0px))',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.45)',
          border: '1px solid rgba(251, 113, 133, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fb7185',
          cursor: 'pointer',
          zIndex: 800,
          opacity: 0.6,
          transition: 'opacity 0.2s ease',
          backdropFilter: 'blur(4px)'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
        aria-label="Secret Easter Egg 1"
      >
        <Sparkles size={14} />
      </motion.button>

      {/* Floating Hidden Easter Egg 2: Bottom-Left Area */}
      <motion.button
        whileHover={{ scale: 1.3, rotate: -15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleTriggerEgg(easterEggs[1] || { message: "💖 Secret Found: Voucher for 1 free ice cream & emergency gossip session!" })}
        title="💖 A little secret..."
        style={{
          position: 'fixed',
          bottom: 'calc(24px + var(--safe-bottom, 0px))',
          left: 'calc(16px + var(--safe-left, 0px))',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.45)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f43f5e',
          cursor: 'pointer',
          zIndex: 800,
          opacity: 0.6,
          transition: 'opacity 0.2s ease',
          backdropFilter: 'blur(4px)'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
        aria-label="Secret Easter Egg 2"
      >
        <Heart size={14} fill="#fda4af" />
      </motion.button>

      {/* Secret Toast Alert */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: 'fixed',
              bottom: 'calc(85px + var(--safe-bottom, 0px))',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#2b2226',
              color: '#ffffff',
              padding: '12px 18px',
              borderRadius: '999px',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              zIndex: 9999,
              maxWidth: 'min(92vw, 420px)',
              border: '1px solid rgba(254, 205, 211, 0.3)'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>🎉</span>
            <span style={{ fontSize: '0.92rem', fontWeight: 500 }}>
              {activeToast}
            </span>
            <button
              onClick={() => setActiveToast(null)}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '50%',
                width: '22px',
                height: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <X size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
