import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Heart, Sparkles, X, Check } from 'lucide-react';
import { triggerBirthdayConfetti } from '../utils/confetti';

export default function PersonalLetter({ letterData, name }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenLetter = () => {
    setIsOpen(true);
    triggerBirthdayConfetti('hearts');
  };

  return (
    <section id="letter" className="section-wrapper" style={{ position: 'relative' }}>
      <div className="site-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Mail size={14} />
            <span>Special Delivery</span>
          </div>
          <h2 className="section-title">
            A Letter for <span className="handwritten-accent">{name}</span>
          </h2>
          <p className="section-subtitle">
            Some words are meant to be written down on paper and kept close forever.
          </p>
        </div>

        {/* Envelope Interactive Box */}
        <div
          style={{
            maxWidth: '780px',
            margin: '0 auto',
            position: 'relative'
          }}
        >
          {!isOpen ? (
            /* Closed Envelope Card */
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              onClick={handleOpenLetter}
              style={{
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #fff5f7 0%, #fffbf0 50%, #fdf4ff 100%)',
                border: '2px dashed #fbcfe8',
                borderRadius: '28px',
                padding: 'clamp(2.5rem, 6vw, 4rem) clamp(1rem, 4vw, 2rem)',
                textAlign: 'center',
                boxShadow: '0 16px 40px rgba(94, 60, 70, 0.09)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Envelope Flap Accent */}
              <div
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #fb7185, #e11d48)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem auto',
                  color: '#ffffff',
                  boxShadow: '0 8px 24px rgba(225, 29, 72, 0.35)',
                  position: 'relative'
                }}
              >
                <Mail size={38} />
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#fbbf24',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#78350f',
                    border: '2px solid #ffffff'
                  }}
                >
                  1
                </span>
              </div>

              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)',
                  color: '#2b2226',
                  marginBottom: '0.75rem'
                }}
              >
                {letterData.envelopePrompt || "💌 You have one unopened letter"}
              </h3>

              <p
                style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: '1.4rem',
                  color: '#b76e79',
                  marginBottom: '2rem'
                }}
              >
                Wax-sealed and addressed to the best friend in the world.
              </p>

              <button
                className="btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenLetter();
                }}
                style={{ padding: '0.9rem 2.2rem' }}
              >
                <Sparkles size={18} />
                <span>Open & Read Letter</span>
              </button>
            </motion.div>
          ) : (
            /* Unfolded Premium Stationery Letter */
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: '#fffdfa',
                border: '1px solid #eadad3',
                borderRadius: '16px',
                padding: 'clamp(1.4rem, 4.5vw, 3.5rem) clamp(1rem, 3.5vw, 2.5rem)',
                boxShadow: '0 25px 60px rgba(94, 60, 70, 0.12)',
                position: 'relative'
              }}
            >
              {/* Washi Tape at top of letter */}
              <div className="washi-tape tape-rose" style={{ top: '-14px', width: '130px' }} />

              {/* Close / Fold letter button */}
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(254, 205, 211, 0.25)',
                  border: '1px solid #fecdd3',
                  color: '#be123c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title="Fold Letter back"
              >
                <X size={18} />
              </button>

              {/* Letter Header */}
              <div
                style={{
                  borderBottom: '2px solid #f5ebe6',
                  paddingBottom: '1.5rem',
                  marginBottom: '2rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontStyle: 'italic',
                      fontSize: '1.8rem',
                      color: '#b76e79'
                    }}
                  >
                    {letterData.salutation}
                  </div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: '#a8949b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginTop: '0.2rem'
                    }}
                  >
                    From your best friend • Handcrafted With Love
                  </div>
                </div>

                {/* Wax seal aesthetic stamp */}
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #c88a75, #b76e79)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 3px 10px rgba(183, 110, 121, 0.35)',
                    border: '2px solid #ffffff'
                  }}
                >
                  <Heart size={20} fill="#ffffff" color="#ffffff" />
                </div>
              </div>

              {/* Letter Body Paragraphs */}
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 'clamp(0.92rem, 2.6vw, 1.05rem)',
                  lineHeight: 1.85,
                  color: '#3d3135'
                }}
              >
                {letterData.paragraphs.map((para, idx) => (
                  <p key={idx} style={{ marginBottom: '1.5rem', color: '#3d3135' }}>
                    {para}
                  </p>
                ))}
              </div>

              {/* Signoff & Signature */}
              <div
                style={{
                  marginTop: '2.5rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid #f5ebe6',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{ fontSize: '0.95rem', color: '#6e5d62', fontStyle: 'italic' }}>
                  {letterData.closing}
                </div>
                <div
                  style={{
                    fontFamily: "'Dancing Script', cursive",
                    fontSize: '2.2rem',
                    color: '#e11d48',
                    marginTop: '0.35rem'
                  }}
                >
                  {letterData.signature}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
