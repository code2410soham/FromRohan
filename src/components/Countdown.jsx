import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { triggerBirthdayConfetti } from '../utils/confetti';

/**
 * Landing Page Birthday Countdown
 * 
 * - Target: 11 October 2026 (Asia/Kolkata / Local IST)
 * - Displays: "Counting down the magical moments ✨"
 * - Live dynamic Days, Hours, Minutes, Seconds with zero padding
 * - No negative values
 * - Replaces with "IT'S HER DAY! 🎂✨" on birthday date
 * - Luxurious frosted glass card with subtle pink/lavender gradients & animated sparkle
 */

export default function Countdown({ birthdayDate = "2026-10-11T00:00:00+05:30", name = "Gaurii" }) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeRemaining(birthdayDate));
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);

  function calculateTimeRemaining(targetStr) {
    try {
      const now = new Date().getTime();
      const target = new Date(targetStr).getTime();
      const diff = target - now;

      if (isNaN(target) || diff <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isBirthday: true
        };
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      return {
        days: Math.max(0, days),
        hours: Math.max(0, hours),
        minutes: Math.max(0, minutes),
        seconds: Math.max(0, seconds),
        isBirthday: false
      };
    } catch {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isBirthday: true
      };
    }
  }

  useEffect(() => {
    const updateCountdown = () => {
      const updated = calculateTimeRemaining(birthdayDate);
      setTimeLeft(updated);

      if (updated.isBirthday && !hasTriggeredConfetti) {
        setHasTriggeredConfetti(true);
        triggerBirthdayConfetti('gentle');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [birthdayDate, hasTriggeredConfetti]);

  return (
    <div
      className="landing-countdown-container"
      style={{
        maxWidth: '520px',
        margin: '0 auto 2.2rem auto',
        position: 'relative'
      }}
    >
      {/* Subtle Ambient Glow Behind Card */}
      <div
        style={{
          position: 'absolute',
          inset: '-6px',
          borderRadius: '24px',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(251, 113, 133, 0.28) 0%, rgba(233, 213, 255, 0.15) 50%, transparent 80%)',
          filter: 'blur(14px)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />

      {/* Main Glass/Cream Card */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(254, 205, 211, 0.35)',
          borderRadius: '22px',
          padding: 'clamp(1rem, 3vw, 1.25rem) clamp(0.75rem, 3vw, 1.6rem)',
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.25), 0 0 20px rgba(251, 113, 133, 0.12)',
          textAlign: 'center'
        }}
      >
        {/* Animated Corner Sparkles */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: '-8px', right: '-8px', color: '#fef08a', pointerEvents: 'none' }}
        >
          <Sparkles size={18} />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          style={{ position: 'absolute', bottom: '-6px', left: '-6px', color: '#fda4af', pointerEvents: 'none' }}
        >
          <Sparkles size={15} />
        </motion.div>

        {timeLeft.isBirthday ? (
          /* Birthday Has Arrived / Is Today */
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ padding: '0.4rem 0' }}
          >
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.5rem, 4vw, 2.1rem)',
                fontWeight: 700,
                color: '#fff1f2',
                textShadow: '0 0 20px rgba(244, 63, 94, 0.8), 0 2px 10px rgba(0,0,0,0.5)',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>IT'S HER DAY! 🎂✨</span>
            </div>
            <p
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: '1.25rem',
                color: '#fecdd3',
                margin: 0
              }}
            >
              The celebrations are officially here for {name}!
            </p>
          </motion.div>
        ) : (
          /* Live Dynamic Countdown */
          <div>
            {/* Header Text */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.84rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                color: '#fed7aa',
                textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                marginBottom: '1rem'
              }}
            >
              <Sparkles size={13} color="#fef08a" />
              <span>Counting down the magical moments ✨</span>
            </div>

            {/* 4 Unit Blocks (Days, Hours, Minutes, Seconds) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 'clamp(6px, 1.8vw, 10px)',
                maxWidth: '440px',
                margin: '0 auto'
              }}
            >
              {[
                { label: 'Days', val: timeLeft.days },
                { label: 'Hours', val: timeLeft.hours },
                { label: 'Minutes', val: timeLeft.minutes },
                { label: 'Seconds', val: timeLeft.seconds }
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.07)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '14px',
                    padding: '8px 4px 7px 4px',
                    boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 4px 12px rgba(0,0,0,0.15)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Subtle Top Highlight */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '1px',
                      background: 'linear-gradient(90deg, transparent, rgba(254, 205, 211, 0.6), transparent)'
                    }}
                  />

                  {/* Digit */}
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 'clamp(1.45rem, 3.8vw, 1.95rem)',
                      fontWeight: 700,
                      color: '#ffffff',
                      lineHeight: 1.1,
                      textShadow: '0 2px 10px rgba(225, 29, 72, 0.4)'
                    }}
                  >
                    {String(item.val).padStart(2, '0')}
                  </div>

                  {/* Label */}
                  <div
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: '#fecdd3',
                      marginTop: '3px'
                    }}
                  >
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
