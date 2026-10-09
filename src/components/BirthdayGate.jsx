import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles, Heart, KeyRound, AlertCircle, Clock } from 'lucide-react';
import { triggerBirthdayConfetti } from '../utils/confetti';

export default function BirthdayGate({
  status,
  name = "Gaurii",
  onUnlocked,
  onRefreshStatus
}) {
  const [pinDigits, setPinDigits] = useState(['', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Live countdown state for locked_countdown mode
  const [countdownTime, setCountdownTime] = useState(() => {
    return calculateTimeRemaining(status?.targetTime || '2026-10-11T00:00:00+05:30');
  });

  function calculateTimeRemaining(targetStr) {
    try {
      const target = new Date(targetStr).getTime();
      const now = Date.now();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      return {
        days,
        hours,
        minutes,
        seconds,
        isZero: diff <= 0
      };
    } catch {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isZero: true };
    }
  }

  // Update countdown every second if not yet unlocked
  useEffect(() => {
    if (status?.unlocked) return;

    const interval = setInterval(() => {
      const updated = calculateTimeRemaining(status?.targetTime || '2026-10-11T00:00:00+05:30');
      setCountdownTime(updated);

      if (updated.isZero && onRefreshStatus) {
        onRefreshStatus();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [status?.unlocked, status?.targetTime, onRefreshStatus]);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds(prev => {
        if (prev <= 1) {
          setErrorMsg('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  // Handle individual PIN digit change
  const handleDigitChange = (index, value) => {
    const cleanVal = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...pinDigits];
    newDigits[index] = cleanVal;
    setPinDigits(newDigits);
    setErrorMsg('');

    // Advance to next input
    if (cleanVal && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pinDigits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (e.key === 'Enter') {
      handleSubmitPin();
    }
  };

  // Handle paste full PIN
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pasteData) {
      const newDigits = ['', '', '', ''];
      for (let i = 0; i < pasteData.length; i++) {
        newDigits[i] = pasteData[i];
      }
      setPinDigits(newDigits);
      if (pasteData.length === 4) {
        inputRefs[3].current?.focus();
      } else {
        inputRefs[pasteData.length]?.current?.focus();
      }
    }
  };

  // Submit PIN to secure server API
  const handleSubmitPin = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting || lockoutSeconds > 0) return;

    const fullPin = pinDigits.join('');
    if (fullPin.length !== 4) {
      setErrorMsg('Please enter all 4 digits of your secret code.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/unlock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'same-origin',
        body: JSON.stringify({ pin: fullPin })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        triggerBirthdayConfetti('celebration');
        onUnlocked();
      } else {
        // Authentication failed
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        setPinDigits(['', '', '', '']);
        inputRefs[0].current?.focus();

        if (res.status === 429) {
          setLockoutSeconds(data.remainingSeconds || 900);
          setErrorMsg(data.error || 'Too many attempts. Please wait before trying again.');
        } else {
          setErrorMsg(data.error || 'Not quite right, try again 💗');
        }
      }
    } catch {
      setErrorMsg('Network error. Please verify your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isUnlockedOnServer = Boolean(status?.unlocked);

  return (
    <div
      className="birthday-gate-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        minHeight: '100dvh',
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#161014',
        backgroundImage: `
          radial-gradient(at 15% 15%, rgba(225, 29, 72, 0.28) 0px, transparent 60%),
          radial-gradient(at 85% 85%, rgba(147, 51, 234, 0.28) 0px, transparent 60%),
          radial-gradient(at 50% 50%, rgba(251, 146, 60, 0.16) 0px, transparent 70%)
        `,
        padding: 'max(1rem, env(safe-area-inset-top, 16px)) max(0.85rem, env(safe-area-inset-right, 12px)) max(1rem, env(safe-area-inset-bottom, 16px)) max(0.85rem, env(safe-area-inset-left, 12px))',
        color: '#ffffff',
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {/* Radiant Floating Glow Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: 'clamp(200px, 40vw, 320px)',
          height: 'clamp(200px, 40vw, 320px)',
          borderRadius: '50%',
          background: 'rgba(251, 113, 133, 0.2)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: 'clamp(200px, 40vw, 320px)',
          height: 'clamp(200px, 40vw, 320px)',
          borderRadius: '50%',
          background: 'rgba(192, 132, 252, 0.2)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          maxWidth: '560px',
          width: '100%',
          position: 'relative',
          zIndex: 1,
          margin: 'auto 0'
        }}
      >
        <AnimatePresence mode="wait">
          {!isUnlockedOnServer ? (
            /* -------------------------------------------------------------
               VIEW 1: SERVER-ENFORCED COUNTDOWN ONLY
               Shown exclusively before October 11, 2026, 12:00 AM IST
               ------------------------------------------------------------- */
            <motion.div
              key="countdown-view"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5 }}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(254, 205, 211, 0.3)',
                borderRadius: 'clamp(20px, 5vw, 30px)',
                padding: 'clamp(1.75rem, 5vw, 3rem) clamp(1rem, 4vw, 2.25rem)',
                textAlign: 'center',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45), 0 0 30px rgba(251, 113, 133, 0.15)',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              {/* Top Lock Badge */}
              <div
                style={{
                  width: 'clamp(48px, 12vw, 60px)',
                  height: 'clamp(48px, 12vw, 60px)',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(251, 113, 133, 0.35), rgba(225, 29, 72, 0.45))',
                  border: '1px solid rgba(254, 205, 211, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto clamp(1rem, 3vw, 1.5rem) auto',
                  color: '#fecdd3'
                }}
              >
                <Lock size={24} />
              </div>

              {/* Exact Tag: Counting down the magical moments ✨ */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 14px',
                  borderRadius: '999px',
                  background: 'rgba(251, 113, 133, 0.15)',
                  border: '1px solid rgba(251, 113, 133, 0.35)',
                  color: '#fecdd3',
                  fontSize: 'clamp(0.75rem, 2.2vw, 0.84rem)',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  marginBottom: '1rem',
                  maxWidth: '100%'
                }}
              >
                <Sparkles size={13} color="#fef08a" />
                <span>Counting down the magical moments ✨</span>
              </div>

              {/* Main Heading */}
              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(1.65rem, 5.2vw, 2.75rem)',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '0.65rem',
                  lineHeight: 1.2
                }}
              >
                A Magical Surprise for <span style={{ color: '#fda4af', fontStyle: 'italic' }}>{name}</span> 🌸
              </h1>

              <p
                style={{
                  fontSize: 'clamp(0.88rem, 2.4vw, 1rem)',
                  color: '#e5d8df',
                  maxWidth: '440px',
                  margin: '0 auto clamp(1.5rem, 4vw, 2.25rem) auto',
                  lineHeight: 1.6
                }}
              >
                Something beautiful is being prepared with all the love in the universe. The gates unlock promptly on your special day!
              </p>

              {/* 4 Unit Countdown Blocks (Fluid down to 320px) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 'clamp(6px, 1.8vw, 12px)',
                  maxWidth: '460px',
                  margin: '0 auto clamp(1.5rem, 4vw, 2.25rem) auto',
                  width: '100%'
                }}
              >
                {[
                  { label: 'Days', val: countdownTime.days },
                  { label: 'Hours', val: countdownTime.hours },
                  { label: 'Minutes', val: countdownTime.minutes },
                  { label: 'Seconds', val: countdownTime.seconds }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.18)',
                      borderRadius: 'clamp(10px, 2.5vw, 16px)',
                      padding: 'clamp(8px, 2vw, 14px) clamp(2px, 1vw, 6px)',
                      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.25), 0 4px 15px rgba(0,0,0,0.2)',
                      minWidth: 0
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(1.35rem, 4.5vw, 2.1rem)',
                        fontWeight: 700,
                        color: '#ffffff',
                        lineHeight: 1.1,
                        textShadow: '0 2px 12px rgba(225, 29, 72, 0.5)'
                      }}
                    >
                      {String(item.val).padStart(2, '0')}
                    </div>
                    <div
                      style={{
                        fontSize: 'clamp(0.6rem, 1.8vw, 0.72rem)',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: '#fecdd3',
                        marginTop: '3px'
                      }}
                    >
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Server Authority Note */}
              <div
                style={{
                  fontSize: 'clamp(0.72rem, 2vw, 0.82rem)',
                  color: 'rgba(255, 255, 255, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  flexWrap: 'wrap'
                }}
              >
                <Clock size={13} color="#fef08a" />
                <span>Target: October 11, 2026, 12:00 AM IST (Asia/Kolkata)</span>
              </div>
            </motion.div>
          ) : (
            /* -------------------------------------------------------------
               VIEW 2: SERVER CONFIRMED DEADLINE PASSED -> PIN ENTRY GATE
               Shown once server clock verifies October 11, 2026 has arrived
               ------------------------------------------------------------- */
            <motion.div
              key="pin-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isShaking ? { x: [-8, 8, -6, 6, -3, 3, 0] } : { opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.45 }}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(254, 205, 211, 0.35)',
                borderRadius: 'clamp(20px, 5vw, 32px)',
                padding: 'clamp(1.75rem, 5vw, 3rem) clamp(1rem, 4vw, 2.25rem)',
                textAlign: 'center',
                boxShadow: '0 30px 70px rgba(0, 0, 0, 0.45), 0 0 40px rgba(251, 113, 133, 0.2)',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              {/* Heart Key Badge */}
              <div
                style={{
                  width: 'clamp(52px, 12vw, 64px)',
                  height: 'clamp(52px, 12vw, 64px)',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #fb7185, #e11d48)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto clamp(1rem, 3vw, 1.5rem) auto',
                  boxShadow: '0 8px 24px rgba(225, 29, 72, 0.45)',
                  color: '#ffffff'
                }}
              >
                <KeyRound size={26} />
              </div>

              {/* Tag */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 14px',
                  borderRadius: '999px',
                  background: 'rgba(251, 113, 133, 0.15)',
                  border: '1px solid rgba(251, 113, 133, 0.35)',
                  color: '#fecdd3',
                  fontSize: 'clamp(0.75rem, 2.2vw, 0.84rem)',
                  fontWeight: 600,
                  marginBottom: '0.85rem'
                }}
              >
                <Sparkles size={13} color="#fef08a" />
                <span>The Special Moment Has Arrived!</span>
              </div>

              {/* Heading */}
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(1.65rem, 4.8vw, 2.4rem)',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '0.5rem'
                }}
              >
                Unlock Your Surprise 🎂
              </h2>

              <p
                style={{
                  fontSize: 'clamp(0.85rem, 2.4vw, 0.96rem)',
                  color: '#e5d8df',
                  maxWidth: '420px',
                  margin: '0 auto clamp(1.25rem, 3.5vw, 1.85rem) auto',
                  lineHeight: 1.5
                }}
              >
                Enter your secret 4-digit birthday code to open your personalized journey.
              </p>

              {/* 4 Digit PIN Inputs (Fluid down to 320px) */}
              <form onSubmit={handleSubmitPin} style={{ width: '100%' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 'clamp(6px, 2.2vw, 12px)',
                    marginBottom: '1.5rem',
                    width: '100%'
                  }}
                  onPaste={handlePaste}
                >
                  {pinDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={inputRefs[idx]}
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      autoFocus={idx === 0}
                      disabled={isSubmitting || lockoutSeconds > 0}
                      aria-label={`PIN digit ${idx + 1}`}
                      style={{
                        width: 'clamp(44px, 12vw, 58px)',
                        height: 'clamp(52px, 14vw, 64px)',
                        borderRadius: 'clamp(12px, 2.5vw, 16px)',
                        background: 'rgba(255, 255, 255, 0.12)',
                        border: digit
                          ? '2px solid #fb7185'
                          : '1px solid rgba(255, 255, 255, 0.25)',
                        color: '#ffffff',
                        fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
                        fontWeight: 700,
                        textAlign: 'center',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        boxShadow: digit ? '0 0 16px rgba(251, 113, 133, 0.4)' : 'none',
                        WebkitAppearance: 'none'
                      }}
                    />
                  ))}
                </div>

                {/* Error Message */}
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      color: '#fca5a5',
                      fontSize: 'clamp(0.8rem, 2.2vw, 0.88rem)',
                      fontWeight: 500,
                      marginBottom: '1.25rem',
                      padding: '0 8px'
                    }}
                  >
                    <AlertCircle size={15} style={{ flexShrink: 0 }} />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}

                {/* Lockout Notice */}
                {lockoutSeconds > 0 && (
                  <div
                    style={{
                      color: '#fca5a5',
                      fontSize: '0.82rem',
                      marginBottom: '1.25rem'
                    }}
                  >
                    Please wait {lockoutSeconds}s before retrying.
                  </div>
                )}

                {/* Submit Unlock Button with exact prompt label "Unlock Your Surprise ❤️" */}
                <button
                  type="submit"
                  disabled={isSubmitting || lockoutSeconds > 0}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    maxWidth: '320px',
                    padding: 'clamp(12px, 3vw, 15px) 24px',
                    borderRadius: '999px',
                    background: 'linear-gradient(135deg, #fb7185 0%, #e11d48 100%)',
                    color: '#ffffff',
                    fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)',
                    fontWeight: 600,
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    boxShadow: '0 8px 25px rgba(225, 29, 72, 0.4)',
                    cursor: isSubmitting || lockoutSeconds > 0 ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting || lockoutSeconds > 0 ? 0.6 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Heart size={18} fill="#ffffff" />
                  <span>{isSubmitting ? 'Unlocking...' : 'Unlock Your Surprise ❤️'}</span>
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
