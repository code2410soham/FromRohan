import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Heart, ExternalLink, Sparkles, Radio } from 'lucide-react';
import { triggerBirthdayConfetti } from '../utils/confetti';

export default function SongDedication({ name, songConfig }) {
  const [isLiked, setIsLiked] = useState(false);
  const [heartsCount, setHeartsCount] = useState(1);

  const song = songConfig || {
    title: "Ishq Wala Love",
    artists: "Vishal-Shekhar, Shekhar Ravjiani, Salim Merchant, Neeti Mohan",
    spotifyUrl: "https://open.spotify.com/track/1hQia6rxgfM1ly2hE3StWp?si=0f1d97e4d0db4ac1",
    trackId: "1hQia6rxgfM1ly2hE3StWp",
    dedicationNote: "Because every unforgettable memory with you feels like poetry set to music. Dedicated to you with all my heart. 🎵💖",
    subtitle: "A special melody chosen just for you on your birthday"
  };

  const handleSendLove = () => {
    setIsLiked(true);
    setHeartsCount(prev => prev + 1);
    triggerBirthdayConfetti('hearts');
  };

  return (
    <section
      id="song-dedication"
      className="section-wrapper"
      style={{
        position: 'relative',
        padding: 'clamp(3.5rem, 6vw, 5rem) 1rem clamp(3.5rem, 6vw, 6rem) 1rem',
        overflow: 'hidden'
      }}
    >
      {/* Soft Ambient Glow in Background */}
      <div
        className="glowing-orb"
        style={{
          top: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '520px',
          height: '520px',
          background: 'radial-gradient(circle, rgba(254, 205, 211, 0.45) 0%, rgba(243, 232, 255, 0.25) 50%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div className="site-container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <div className="section-header" style={{ marginBottom: '3rem' }}>
          <div className="section-tag">
            <Music size={14} />
            <span>Dedicated Melody</span>
          </div>
          <h2 className="section-title">
            A Song Dedicated to <span className="handwritten-accent">{name}</span> 🎶
          </h2>
          <p className="section-subtitle">
            {song.subtitle || "Some songs don't just have music—they carry warmth, laughter, and special memories."}
          </p>
        </div>

        {/* Master Dedication Card */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card"
          style={{
            maxWidth: '820px',
            margin: '0 auto',
            padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1rem, 3.5vw, 2.25rem)',
            border: '2px solid rgba(254, 205, 211, 0.85)',
            boxShadow: '0 20px 50px rgba(94, 60, 70, 0.09)',
            borderRadius: '28px',
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 248, 250, 0.88) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}
        >
          {/* Top Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '2rem'
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 18px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #fff1f4 0%, #fce7ec 100%)',
                border: '1px solid #fecdd6',
                color: '#e11d48',
                fontSize: '0.84rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}
            >
              <Radio size={14} />
              Special Birthday Dedication
            </span>
          </div>

          {/* Interactive Vinyl + Track Presentation Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(180px, 220px) 1fr',
              gap: '2.5rem',
              alignItems: 'center',
              marginBottom: '2.5rem'
            }}
            className="dedication-grid"
          >
            {/* Spinning Vinyl Record Visual */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                whileHover={{ scale: 1.05 }}
                style={{
                  width: 'clamp(130px, 36vw, 180px)',
                  height: 'clamp(130px, 36vw, 180px)',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, #1a1a1a 0%, #2b2b2b 35%, #181818 55%, #333333 70%, #151515 100%)',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.22), inset 0 0 12px rgba(255, 255, 255, 0.1)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '3px solid rgba(225, 29, 72, 0.2)'
                }}
                onClick={handleSendLove}
                title="Click to send love!"
              >
                {/* Vinyl Grooves Rings */}
                <div
                  style={{
                    position: 'absolute',
                    inset: '18px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: '36px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: '54px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                />

                {/* Center Vinyl Label */}
                <div
                  style={{
                    width: 'clamp(52px, 14vw, 68px)',
                    height: 'clamp(52px, 14vw, 68px)',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #fb7185 0%, #e11d48 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(225, 29, 72, 0.4)',
                    color: '#ffffff'
                  }}
                >
                  <Heart size={20} fill="#ffffff" />
                  <span style={{ fontSize: '0.62rem', fontWeight: 700, marginTop: '2px', letterSpacing: '0.04em' }}>
                    FOR YOU
                  </span>
                </div>

                {/* Spindle hole */}
                <div
                  style={{
                    position: 'absolute',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)'
                  }}
                />
              </motion.div>

              {/* Floating Note Tag */}
              <div
                style={{
                  marginTop: '0.9rem',
                  fontSize: '0.78rem',
                  color: '#8a7880',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Sparkles size={13} color="#f43f5e" />
                <span>Tap vinyl for hearts ✨</span>
              </div>
            </div>

            {/* Song Story & Heartfelt Message */}
            <div style={{ textAlign: 'left' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#e11d48',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  marginBottom: '0.4rem'
                }}
              >
                <Music size={15} />
                <span>Dedicated Soundtrack</span>
              </div>

              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(1.6rem, 3vw, 2.1rem)',
                  color: '#2b2226',
                  margin: '0 0 0.35rem 0',
                  lineHeight: 1.2
                }}
              >
                {song.title}
              </h3>

              <p
                style={{
                  fontSize: '0.95rem',
                  color: '#715a63',
                  margin: '0 0 1.25rem 0',
                  fontWeight: 500
                }}
              >
                {song.artists}
              </p>

              {/* Heartfelt Dedication Quote */}
              <div
                style={{
                  position: 'relative',
                  padding: '1.1rem 1.4rem',
                  background: 'rgba(255, 241, 244, 0.65)',
                  borderLeft: '3px solid #fb7185',
                  borderRadius: '0 16px 16px 0',
                  marginBottom: '1.25rem'
                }}
              >
                <p
                  style={{
                    fontFamily: "'Caveat', cursive",
                    fontSize: '1.35rem',
                    color: '#9f1239',
                    margin: 0,
                    lineHeight: 1.5
                  }}
                >
                  "{song.dedicationNote}"
                </p>
              </div>

              {/* Action Buttons Row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                <a
                  href={song.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 18px',
                    borderRadius: '999px',
                    background: '#1DB954',
                    color: '#ffffff',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(29, 185, 84, 0.35)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(29, 185, 84, 0.45)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(29, 185, 84, 0.35)';
                  }}
                >
                  <ExternalLink size={14} /> Open in Spotify
                </a>

                <button
                  onClick={handleSendLove}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '999px',
                    background: '#ffffff',
                    border: '1px solid #fecdd3',
                    color: '#be123c',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(94, 60, 70, 0.05)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = '#fb7185';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = '#fecdd3';
                  }}
                >
                  <Heart size={14} fill={isLiked ? '#e11d48' : 'none'} color="#e11d48" />
                  <span>Send Love {heartsCount > 1 ? `(${heartsCount})` : '💖'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Embedded Spotify Iframe Player */}
          <div
            style={{
              position: 'relative',
              borderRadius: '20px',
              padding: '6px',
              background: 'linear-gradient(135deg, rgba(254, 205, 211, 0.4) 0%, rgba(243, 232, 255, 0.4) 100%)',
              border: '1px solid rgba(251, 113, 133, 0.25)',
              boxShadow: '0 8px 24px rgba(94, 60, 70, 0.06)'
            }}
          >
            <iframe
              style={{
                borderRadius: '16px',
                border: 'none',
                display: 'block',
                background: 'transparent'
              }}
              src={`https://open.spotify.com/embed/track/${song.trackId}?utm_source=generator&theme=0`}
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title={`${song.title} - Dedicated Song for ${name}`}
            />
          </div>

          {/* Audio hint */}
          <div
            style={{
              marginTop: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              color: '#8a7880'
            }}
          >
            <span>🎧</span>
            <span>
              Tip: You can pause the background music using the top-right button to listen to this track undisturbed!
            </span>
          </div>
        </motion.div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 680px) {
          .dedication-grid {
            grid-template-columns: 1fr !important;
            text-align: center !important;
            gap: 1.75rem !important;
          }
          .dedication-grid > div:last-child {
            text-align: center !important;
          }
          .dedication-grid > div:last-child > div:last-child {
            justify-content: center !important;
          }
        }
      `}</style>
    </section>
  );
}
