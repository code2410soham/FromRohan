import React, { useState, useEffect, useRef } from 'react';
import { Heart, Menu, X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({
  config,
  isPlaying,
  onToggleMusic,
  onLock
}) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0;
      setScrollProgress(progress);
      setIsScrolled(currentScroll > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on click outside or escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: "Journey", href: "#hero" },
    { label: "Memories", href: "#gallery" },
    { label: "Special", href: "#special" },
    { label: "Letter", href: "#letter" },
    { label: "Surprises", href: "#surprises" },
    { label: "Dedication 🎵", href: "#song-dedication" }
  ];

  const handleLinkClick = (e, href) => {
    setMobileMenuOpen(false);
    const targetEl = document.querySelector(href);
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Delicate reading progress bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          zIndex: 1001,
          background: 'rgba(251, 113, 133, 0.15)'
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${scrollProgress}%`,
            background: 'linear-gradient(90deg, #f43f5e, #fb7185, #c084fc)',
            transition: 'width 0.1s ease-out'
          }}
        />
      </div>

      {/* Floating navigation pill */}
      <header
        ref={menuRef}
        style={{
          position: 'fixed',
          top: 'max(12px, env(safe-area-inset-top, 12px))',
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 1000,
          padding: '0 max(12px, env(safe-area-inset-right, 12px)) 0 max(12px, env(safe-area-inset-left, 12px))',
          pointerEvents: 'none'
        }}
      >
        <nav
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'clamp(8px, 2vw, 1.25rem)',
            padding: '8px clamp(12px, 3vw, 20px)',
            borderRadius: '999px',
            background: isScrolled
              ? 'rgba(255, 255, 255, 0.92)'
              : 'rgba(255, 255, 255, 0.82)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.85)',
            boxShadow: isScrolled
              ? '0 10px 30px rgba(94, 60, 70, 0.12)'
              : '0 4px 16px rgba(94, 60, 70, 0.06)',
            transition: 'all 0.3s ease',
            maxWidth: '920px',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          {/* Logo / Brand with Friend's Name */}
          <a
            href="#hero"
            onClick={(e) => handleLinkClick(e, '#hero')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)',
              color: '#2b2226',
              flexShrink: 0
            }}
          >
            <span
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #fecdd3, #fda4af)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Heart size={14} color="#e11d48" fill="#e11d48" />
            </span>
            <span>{config?.name || "Gaurii"}</span>
            <span style={{ fontSize: '0.75rem', color: '#c88a75', fontStyle: 'italic', marginLeft: '-2px' }}>
              ’s Day
            </span>
          </a>

          {/* Desktop Nav links (hidden on <= 768px, replaced by hamburger) */}
          <div
            className="navbar-desktop-links"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(8px, 1.5vw, 1.25rem)'
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                style={{
                  fontSize: '0.86rem',
                  fontWeight: 500,
                  color: '#5e4f55',
                  transition: 'color 0.2s ease',
                  padding: '4px 6px',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#e11d48')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#5e4f55')}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Actions: Music Quick Toggle + Mobile Menu Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Music Toggle */}
            <button
              onClick={onToggleMusic}
              title={isPlaying ? "Mute / Pause Music" : "Play Gentle Background Music"}
              aria-label="Toggle background music"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '999px',
                background: isPlaying
                  ? 'rgba(254, 205, 211, 0.55)'
                  : 'rgba(243, 232, 255, 0.65)',
                border: '1px solid rgba(251, 113, 133, 0.3)',
                color: isPlaying ? '#e11d48' : '#7e22ce',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <span style={{ fontSize: '0.85rem' }}>{isPlaying ? "🔊" : "🔇"}</span>
              <span className="navbar-music-label">{isPlaying ? "Music On" : "Music Off"}</span>
            </button>

            {/* Mobile Menu Hamburger (Visible on <= 768px) */}
            <button
              className="navbar-mobile-toggle"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              style={{
                display: 'none', // Overridden in CSS media query below
                alignItems: 'center',
                justifyContent: 'center',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #fecdd3',
                color: '#be123c',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              style={{
                pointerEvents: 'auto',
                marginTop: '8px',
                width: '100%',
                maxWidth: '360px',
                background: 'rgba(255, 255, 255, 0.96)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1px solid rgba(254, 205, 211, 0.8)',
                boxShadow: '0 16px 40px rgba(94, 60, 70, 0.16)',
                padding: '12px 8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  style={{
                    padding: '12px 18px',
                    borderRadius: '16px',
                    color: '#2b2226',
                    fontSize: '0.94rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(254, 205, 211, 0.35)';
                    e.currentTarget.style.color = '#e11d48';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#2b2226';
                  }}
                >
                  <span>{link.label}</span>
                  <span style={{ fontSize: '0.8rem', color: '#c88a75' }}>→</span>
                </a>
              ))}

              {onLock && (
                <div style={{ borderTop: '1px solid #fce7ec', marginTop: '6px', paddingTop: '6px' }}>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLock();
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 18px',
                      borderRadius: '16px',
                      color: '#be123c',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(255, 241, 244, 0.6)',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <Lock size={15} /> Lock Website & End Session
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Responsive Breakpoint CSS */}
      <style>{`
        @media (max-width: 768px) {
          .navbar-desktop-links {
            display: none !important;
          }
          .navbar-mobile-toggle {
            display: flex !important;
          }
        }
        @media (max-width: 420px) {
          .navbar-music-label {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
