import React from 'react';
import { Heart, ArrowUp, Sparkles } from 'lucide-react';

export default function Footer({ name, onLock }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        padding: '4rem 1.5rem 6rem 1.5rem',
        borderTop: '1px solid rgba(230, 200, 205, 0.4)',
        background: 'rgba(255, 253, 249, 0.8)',
        textAlign: 'center',
        position: 'relative'
      }}
    >
      <div className="site-container">
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {/* Heart icon */}
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#ffe4e6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}
          >
            <Heart size={20} color="#e11d48" fill="#e11d48" />
          </div>

          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.25rem',
              color: '#2b2226',
              marginBottom: '0.5rem'
            }}
          >
            Crafted with all the love in the universe for {name}.
          </p>

          <p
            style={{
              fontSize: '0.86rem',
              color: '#8a7880',
              marginBottom: '2rem'
            }}
          >
            Because true best friends are the rarest and sweetest gifts life ever gives us.
          </p>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={scrollToTop}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #fecdd3',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#be123c',
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
              <ArrowUp size={14} /> Back to Beginning
            </button>

            {onLock && (
              <button
                onClick={onLock}
                title="Lock the website and end your session"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#64748b',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.color = '#e11d48';
                  e.currentTarget.style.borderColor = '#fecdd6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.color = '#64748b';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                🔒 Lock Website
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
