import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { getAllPhotos } from '../utils/photoLoader';
import { triggerBirthdayConfetti } from '../utils/confetti';

export default function Gallery({ photos = [], name = "Gaurii" }) {
  // Use passed photos or auto-load directly
  const displayPhotos = photos && photos.length > 0 ? photos : getAllPhotos();

  const [lightboxIndex, setLightboxIndex] = useState(null);
  const touchStartXRef = useRef(0);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    triggerBirthdayConfetti('gentle');
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextPhoto = useCallback(() => {
    if (lightboxIndex !== null && displayPhotos.length > 0) {
      setLightboxIndex((lightboxIndex + 1) % displayPhotos.length);
    }
  }, [lightboxIndex, displayPhotos.length]);

  const prevPhoto = useCallback(() => {
    if (lightboxIndex !== null && displayPhotos.length > 0) {
      setLightboxIndex((lightboxIndex - 1 + displayPhotos.length) % displayPhotos.length);
    }
  }, [lightboxIndex, displayPhotos.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, nextPhoto, prevPhoto]);

  // Mobile touch gestures for Lightbox
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartXRef.current - touchEndX;
    if (diff > 40) {
      nextPhoto();
    } else if (diff < -40) {
      prevPhoto();
    }
  };

  // Decorative fairy lights strand along top
  const fairyLights = Array.from({ length: 14 }).map((_, i) => ({
    id: i,
    color: i % 3 === 0 ? 'gold' : i % 3 === 1 ? 'rose' : 'pearl',
    delay: (i * 0.35) % 2.5
  }));

  return (
    <section id="gallery" className="section-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background Soft Glow Orbs */}
      <div
        className="glowing-orb"
        style={{
          top: '12%',
          right: '5%',
          width: 'clamp(240px, 40vw, 420px)',
          height: 'clamp(240px, 40vw, 420px)',
          background: 'rgba(254, 205, 211, 0.32)'
        }}
      />
      <div
        className="glowing-orb"
        style={{
          bottom: '10%',
          left: '3%',
          width: 'clamp(220px, 35vw, 380px)',
          height: 'clamp(220px, 35vw, 380px)',
          background: 'rgba(233, 213, 255, 0.32)'
        }}
      />

      <div className="site-container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <div
          className="section-header"
          style={{
            marginBottom: 'clamp(1.75rem, 4vw, 2.75rem)',
            textAlign: 'center',
            position: 'relative'
          }}
        >
          {/* Fairy Lights Strand Over Gallery Header */}
          <div className="fairy-lights-banner" aria-hidden="true">
            {fairyLights.map((l) => (
              <span
                key={l.id}
                className={`fairy-bulb bulb-${l.color}`}
                style={{ animationDelay: `${l.delay}s` }}
              />
            ))}
          </div>

          <div className="section-tag" style={{ marginTop: '0.5rem' }}>
            <Camera size={14} />
            <span>Memories in Frames</span>
          </div>
          <h2 className="section-title">
            The Snapshot <span className="handwritten-accent">Scrapbook</span>
          </h2>
          <p className="section-subtitle">
            A beautiful, scattered collection of candid memories, endless laughter, and irreplaceable moments with {name}.
          </p>
        </div>

        {/* Premium Organic Polaroid Masonry Layout */}
        <div className="polaroid-masonry-wrapper">
          {displayPhotos.map((photo, index) => {
            const rot = photo.rotation || ((index % 5) * 1.1 - 2.2);
            const washi = photo.washiColor || (index % 4 === 0 ? 'tape-rose' : index % 4 === 1 ? 'tape-peach' : index % 4 === 2 ? 'tape-lavender' : 'tape-cream');
            const tapePos = photo.tapePosition || (index % 3 === 0 ? 'center' : index % 3 === 1 ? 'left' : 'right');
            const isLarge = photo.sizeVariant === 'large';
            const isMedium = photo.sizeVariant === 'medium';
            const hasGlow = index % 3 === 0;
            const hasFairyDot = index % 4 === 1;

            const tapeStyle = {
              position: 'absolute',
              top: '-12px',
              zIndex: 3,
              left: tapePos === 'left' ? '18%' : tapePos === 'right' ? 'auto' : '50%',
              right: tapePos === 'right' ? '18%' : 'auto',
              transform: tapePos === 'center'
                ? `translateX(-50%) rotate(${index % 2 === 0 ? -1.5 : 1.5}deg)`
                : `rotate(${tapePos === 'left' ? -3 : 3}deg)`
            };

            return (
              <motion.div
                key={photo.id || index}
                className="polaroid-masonry-item"
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{
                  duration: 0.5,
                  delay: (index % 4) * 0.06,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                <div
                  className={`organic-polaroid-card ${isLarge ? 'polaroid-large' : isMedium ? 'polaroid-medium' : ''}`}
                  style={{
                    '--card-rotation': `${rot}deg`
                  }}
                  onClick={() => openLightbox(index)}
                  role="button"
                  tabIndex={0}
                  aria-label="View photo in fullscreen"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openLightbox(index);
                    }
                  }}
                >
                  {/* Subtle warm ambient glow behind selected polaroids */}
                  {hasGlow && (
                    <div
                      className="polaroid-warm-glow"
                      style={{
                        position: 'absolute',
                        inset: '-10px',
                        borderRadius: '16px',
                        background: index % 2 === 0
                          ? 'radial-gradient(circle, rgba(254, 215, 170, 0.35) 0%, rgba(251, 113, 133, 0.15) 55%, transparent 75%)'
                          : 'radial-gradient(circle, rgba(233, 213, 255, 0.35) 0%, rgba(254, 205, 211, 0.15) 55%, transparent 75%)',
                        filter: 'blur(14px)',
                        zIndex: -1,
                        pointerEvents: 'none'
                      }}
                    />
                  )}

                  {/* Micro Fairy Light Sparkle on selected card corner */}
                  {hasFairyDot && (
                    <div
                      className="polaroid-micro-fairy-light"
                      style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '10px',
                        zIndex: 4,
                        pointerEvents: 'none'
                      }}
                    >
                      <span className="micro-light-dot" />
                    </div>
                  )}

                  {/* Washi Tape Accent */}
                  <div className={`washi-tape ${washi}`} style={tapeStyle} />

                  {/* Photo Frame Container */}
                  <div className="polaroid-inner-frame">
                    <img
                      src={photo.src}
                      alt=""
                      loading="lazy"
                      className="polaroid-photo-image"
                      onError={(e) => {
                        e.target.style.opacity = '0.4';
                      }}
                    />

                    {/* Subtle Hover Heart Overlay */}
                    <div className="polaroid-hover-badge">
                      <Heart size={16} fill="#ffffff" color="#ffffff" />
                    </div>
                  </div>

                  {/* Clean Polaroid Chin with Absolutely NO text */}
                  <div className="polaroid-bottom-chin" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty state hint if photos array is empty */}
        {displayPhotos.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: '#8a7880',
              fontFamily: "'Caveat', cursive",
              fontSize: '1.4rem'
            }}
          >
            <p>Loading personal memory gallery... 🌸</p>
          </div>
        )}
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxIndex !== null && displayPhotos[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 999999,
              background: 'rgba(18, 12, 16, 0.94)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'max(16px, env(safe-area-inset-top, 16px)) max(12px, env(safe-area-inset-right, 12px)) max(16px, env(safe-area-inset-bottom, 16px)) max(12px, env(safe-area-inset-left, 12px))',
              boxSizing: 'border-box'
            }}
            onClick={closeLightbox}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Top Bar with Counter and Close Button */}
            <div
              style={{
                position: 'absolute',
                top: 'max(16px, env(safe-area-inset-top, 16px))',
                left: 'max(16px, env(safe-area-inset-left, 16px))',
                right: 'max(16px, env(safe-area-inset-right, 16px))',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#ffffff',
                zIndex: 100000
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#fecdd3',
                  letterSpacing: '0.04em'
                }}
              >
                <span>{lightboxIndex + 1}</span>
                <span style={{ opacity: 0.5 }}>/</span>
                <span>{displayPhotos.length}</span>
              </div>

              <button
                onClick={closeLightbox}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.14)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)'
                }}
                aria-label="Close photo view"
              >
                <X size={22} />
              </button>
            </div>

            {/* Central Photograph in Lightbox */}
            <div
              style={{
                position: 'relative',
                maxWidth: '92vw',
                maxHeight: 'calc(85dvh - 60px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background: '#ffffff',
                  padding: 'clamp(8px, 2vw, 12px) clamp(8px, 2vw, 12px) clamp(12px, 3vw, 18px) clamp(8px, 2vw, 12px)',
                  borderRadius: '12px',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <img
                  src={displayPhotos[lightboxIndex].src}
                  alt="Photograph view"
                  style={{
                    maxHeight: 'calc(75dvh - 80px)',
                    maxWidth: '85vw',
                    objectFit: 'contain',
                    borderRadius: '6px',
                    display: 'block'
                  }}
                />
              </motion.div>

              {/* Prev / Next Navigation Arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevPhoto();
                }}
                className="lightbox-nav-btn lightbox-prev"
                aria-label="Previous photo"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextPhoto();
                }}
                className="lightbox-nav-btn lightbox-next"
                aria-label="Next photo"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        /* Fairy Lights Strand Banner */
        .fairy-lights-banner {
          display: flex;
          justify-content: center;
          gap: clamp(12px, 3vw, 24px);
          margin-bottom: 0.8rem;
          pointer-events: none;
        }

        .fairy-bulb {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
          animation: fairyTwinkle 2.5s ease-in-out infinite;
        }

        .bulb-gold {
          background: #fde047;
          box-shadow: 0 0 10px #facc15, 0 0 20px rgba(250, 204, 21, 0.6);
        }

        .bulb-rose {
          background: #fda4af;
          box-shadow: 0 0 10px #fb7185, 0 0 20px rgba(251, 113, 133, 0.6);
        }

        .bulb-pearl {
          background: #fdf4ff;
          box-shadow: 0 0 10px #e879f9, 0 0 20px rgba(232, 121, 249, 0.5);
        }

        @keyframes fairyTwinkle {
          0%, 100% {
            opacity: 0.35;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.25);
          }
        }

        /* Micro Fairy Light on Polaroids */
        .micro-light-dot {
          display: block;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #fef08a;
          box-shadow: 0 0 8px #f59e0b, 0 0 18px rgba(245, 158, 11, 0.7);
          animation: fairyTwinkle 2.8s ease-in-out infinite;
        }

        /* Organic Polaroid Masonry */
        .polaroid-masonry-wrapper {
          column-count: 4;
          column-gap: 2rem;
          width: 100%;
        }

        @media (max-width: 1200px) {
          .polaroid-masonry-wrapper {
            column-count: 3;
            column-gap: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .polaroid-masonry-wrapper {
            column-count: 2;
            column-gap: 1rem;
          }
          .organic-polaroid-card {
            transform: rotate(calc(var(--card-rotation, 0deg) * 0.4)) !important;
          }
        }

        @media (max-width: 480px) {
          .polaroid-masonry-wrapper {
            column-count: 1;
            column-gap: 0;
          }
          .organic-polaroid-card {
            transform: none !important;
            margin: 0 auto;
            max-width: 340px;
          }
        }

        .polaroid-masonry-item {
          break-inside: avoid;
          page-break-inside: avoid;
          margin-bottom: clamp(1.25rem, 3vw, 2.25rem);
          display: inline-block;
          width: 100%;
          box-sizing: border-box;
        }

        /* Polaroid Card Design */
        .organic-polaroid-card {
          position: relative;
          background: #ffffff;
          padding: 10px 10px 0 10px;
          border-radius: 4px;
          border: 1px solid rgba(228, 214, 218, 0.7);
          box-shadow: 0 4px 10px -2px rgba(70, 45, 55, 0.08), 0 12px 26px -4px rgba(70, 45, 55, 0.12);
          transform: rotate(var(--card-rotation, 0deg));
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        .organic-polaroid-card.polaroid-large {
          padding: 12px 12px 0 12px;
        }

        .organic-polaroid-card:hover {
          transform: translateY(-6px) scale(1.02) rotate(0deg) !important;
          box-shadow: 0 18px 36px -4px rgba(70, 45, 55, 0.2), 0 0 25px rgba(251, 113, 133, 0.2) !important;
          z-index: 25;
        }

        /* Inner Photo Frame */
        .polaroid-inner-frame {
          position: relative;
          width: 100%;
          border-radius: 2px;
          overflow: hidden;
          background: #f7efe9;
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.04);
        }

        .polaroid-photo-image {
          width: 100%;
          height: auto;
          max-height: 480px;
          object-fit: cover;
          display: block;
          transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .organic-polaroid-card:hover .polaroid-photo-image {
          transform: scale(1.03);
        }

        /* Clean Bottom Chin - NO TEXT */
        .polaroid-bottom-chin {
          height: 28px;
          width: 100%;
          background: transparent;
        }

        .organic-polaroid-card.polaroid-large .polaroid-bottom-chin {
          height: 36px;
        }

        /* Hover Heart Badge */
        .polaroid-hover-badge {
          position: absolute;
          bottom: 8px;
          right: 8px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(225, 29, 72, 0.85);
          display: flex;
          align-items: center;
          justifyContent: center;
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 12px rgba(225, 29, 72, 0.3);
        }

        .organic-polaroid-card:hover .polaroid-hover-badge {
          opacity: 1;
          transform: scale(1);
        }

        /* Lightbox Navigation Buttons */
        .lightbox-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
          display: flex;
          align-items: center;
          justifyContent: center;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.35);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(12px);
          transition: all 0.2s ease;
          z-index: 10;
        }

        .lightbox-prev {
          left: -60px;
        }

        .lightbox-next {
          right: -60px;
        }

        @media (max-width: 900px) {
          .lightbox-prev {
            left: 8px;
          }
          .lightbox-next {
            right: 8px;
          }
        }

        .lightbox-nav-btn:hover {
          background: rgba(255, 255, 255, 0.35);
          transform: translateY(-50%) scale(1.05);
        }

        @media (prefers-reduced-motion: reduce) {
          .organic-polaroid-card {
            transform: none !important;
            transition: none !important;
          }
          .polaroid-photo-image {
            transition: none !important;
          }
          .fairy-bulb, .micro-light-dot {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
