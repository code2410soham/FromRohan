import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, ChevronDown, Star } from 'lucide-react';
import ImageFallback from './ImageFallback';
import { triggerBirthdayConfetti } from '../utils/confetti';

export default function Hero({ config }) {
  const scrollToNext = () => {
    triggerBirthdayConfetti('gentle');
    const el = document.getElementById('gallery');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="section-wrapper"
      style={{
        minHeight: '90vh',
        minHeight: '90dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 'clamp(5.5rem, 10vw, 7.5rem)',
        paddingBottom: 'clamp(2.5rem, 6vw, 4rem)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Soft Ambient Light Blurs */}
      <div
        className="glowing-orb"
        style={{
          top: '10%',
          left: '5%',
          width: 'clamp(220px, 35vw, 350px)',
          height: 'clamp(220px, 35vw, 350px)',
          background: 'rgba(254, 205, 211, 0.45)'
        }}
      />
      <div
        className="glowing-orb"
        style={{
          bottom: '10%',
          right: '5%',
          width: 'clamp(240px, 40vw, 400px)',
          height: 'clamp(240px, 40vw, 400px)',
          background: 'rgba(233, 213, 255, 0.45)',
          animationDelay: '-3s'
        }}
      />

      <div className="site-container" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 'clamp(2rem, 5vw, 3.5rem)',
            alignItems: 'center'
          }}
        >
          {/* Left Column: Heading, Subtitle & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%', boxSizing: 'border-box' }}
          >
            {/* Pill Tag */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid rgba(251, 113, 133, 0.3)',
                boxShadow: '0 4px 14px rgba(225, 29, 72, 0.06)',
                backdropFilter: 'blur(10px)',
                marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
                maxWidth: '100%'
              }}
            >
              <Sparkles size={16} color="#e11d48" style={{ flexShrink: 0 }} />
              <span
                style={{
                  fontSize: 'clamp(0.78rem, 2.2vw, 0.86rem)',
                  fontWeight: 600,
                  color: '#c88a75',
                  letterSpacing: '0.04em'
                }}
              >
                {config.hero.badge}
              </span>
            </div>

            {/* Main Heading */}
            <h1
              style={{
                fontSize: 'clamp(2.2rem, 6vw, 4.4rem)',
                lineHeight: 1.15,
                marginBottom: 'clamp(0.85rem, 2.5vw, 1.25rem)',
                color: '#2b2226'
              }}
            >
              {config.hero.headline} <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #e11d48 0%, #be123c 50%, #9333ea 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontStyle: 'italic',
                  display: 'inline-block'
                }}
              >
                {config.name}
              </span>{' '}
              <span style={{ WebkitTextFillColor: 'initial' }}>🎂</span>
            </h1>

            {/* Emotional Subtitle */}
            <p
              style={{
                fontSize: 'clamp(0.95rem, 2.4vw, 1.25rem)',
                lineHeight: 1.65,
                color: '#5e4f55',
                marginBottom: 'clamp(1.25rem, 3.5vw, 2rem)',
                maxWidth: '520px'
              }}
            >
              "{config.hero.subtitle}"
            </p>

            {/* Handwritten note accent */}
            <div
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                color: '#e11d48',
                marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Heart size={18} fill="#e11d48" color="#e11d48" style={{ flexShrink: 0 }} />
              <span>To my absolute favorite human, happy birthday!</span>
            </div>

            {/* CTAs */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.85rem',
                alignItems: 'center'
              }}
            >
              <button
                onClick={scrollToNext}
                className="btn-primary"
                id="start-journey-btn"
                style={{
                  padding: 'clamp(12px, 2.5vw, 15px) clamp(20px, 4vw, 28px)',
                  fontSize: 'clamp(0.9rem, 2.2vw, 1rem)'
                }}
              >
                <span>Start the Journey</span>
                <ChevronDown size={18} />
              </button>

              <a
                href="#letter"
                className="btn-secondary"
                style={{
                  padding: 'clamp(11px, 2.4vw, 14px) clamp(18px, 3.5vw, 24px)',
                  fontSize: 'clamp(0.88rem, 2.2vw, 0.95rem)'
                }}
              >
                <span>Read Your Letter 💌</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Luxury Framed Hero Photograph with Polaroid Aesthetic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            {/* Elegant Polaroid Frame with Washi Tape */}
            <div
              className="polaroid-card"
              style={{
                width: '100%',
                maxWidth: 'min(420px, 100%)',
                padding: 'clamp(0.75rem, 2.5vw, 1.1rem) clamp(0.75rem, 2.5vw, 1.1rem) clamp(1.2rem, 3.5vw, 1.7rem) clamp(0.75rem, 2.5vw, 1.1rem)',
                transform: 'rotate(-1.2deg)',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                background: '#ffffff',
                boxShadow: '0 20px 45px rgba(94, 60, 70, 0.15), 0 4px 10px rgba(0,0,0,0.03)',
                boxSizing: 'border-box'
              }}
            >
              {/* Washi Tape at Top */}
              <div
                className="washi-tape tape-rose"
                style={{ transform: 'translateX(-50%) rotate(1deg)', maxWidth: '80%' }}
              />

              {/* Photo */}
              <div
                className="polaroid-img-wrapper"
                style={{
                  height: 'clamp(260px, 44vh, 420px)',
                  borderRadius: '4px',
                  border: '1px solid rgba(0, 0, 0, 0.04)',
                  width: '100%'
                }}
              >
                <ImageFallback
                  src={config.hero.heroImage}
                  alt={`Photograph of ${config.name}`}
                  fallbackTitle={`Birthday Girl: ${config.name}`}
                />
              </div>

              {/* Handwritten Caption */}
              <div
                className="polaroid-caption"
                style={{
                  fontSize: 'clamp(1.15rem, 3vw, 1.4rem)',
                  marginTop: '0.85rem',
                  color: '#2b2226'
                }}
              >
                {config.hero.heroImageCaption}
              </div>
              <div className="polaroid-date">
                A True Masterpiece of Joy ✨
              </div>
            </div>

            {/* Floating Decorative Badges (Visible on tablet/desktop, clipped on tiny screens) */}
            <motion.div
              className="hero-floating-badge-top"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              onClick={() => triggerBirthdayConfetti('stars')}
              style={{
                position: 'absolute',
                top: '-12px',
                right: '4%',
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.94)',
                boxShadow: '0 8px 24px rgba(94, 60, 70, 0.12)',
                border: '1px solid #fed7aa',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#c2410c',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                zIndex: 4
              }}
            >
              <Star size={14} fill="#f97316" color="#f97316" />
              <span>Certified Legend 🎀</span>
            </motion.div>

            <motion.div
              className="hero-floating-badge-bottom"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              onClick={() => triggerBirthdayConfetti('hearts')}
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '2%',
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.94)',
                boxShadow: '0 8px 24px rgba(94, 60, 70, 0.12)',
                border: '1px solid #fbcfe8',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#e11d48',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                zIndex: 4
              }}
            >
              <Heart size={14} fill="#e11d48" color="#e11d48" />
              <span>My Constant 💫</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 440px) {
          .hero-floating-badge-top, .hero-floating-badge-bottom {
            padding: 4px 10px !important;
            font-size: 0.72rem !important;
          }
        }
      `}</style>
    </section>
  );
}
