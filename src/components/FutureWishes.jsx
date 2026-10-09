import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Sparkles, Heart } from 'lucide-react';

export default function FutureWishes({ wishes = [], name }) {
  return (
    <section id="wishes" className="section-wrapper" style={{ position: 'relative' }}>
      <div className="site-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Compass size={14} />
            <span>Looking Ahead</span>
          </div>
          <h2 className="section-title">
            Here's to Everything <span className="handwritten-accent">Still Ahead...</span>
          </h2>
          <p className="section-subtitle">
            The past chapters were wonderful, but the future with you is going to be even more extraordinary.
          </p>
        </div>

        {/* Wishes Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: 'clamp(1rem, 3vw, 1.75rem)',
            maxWidth: '1000px',
            margin: '0 auto'
          }}
        >
          {wishes.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(16px)',
                borderRadius: '20px',
                padding: 'clamp(1.4rem, 3.5vw, 2rem) clamp(1.1rem, 3vw, 1.6rem)',
                border: '1px solid rgba(254, 205, 211, 0.6)',
                boxShadow: '0 8px 24px rgba(94, 60, 70, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease'
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '2rem',
                    marginBottom: '1rem',
                    display: 'inline-block'
                  }}
                >
                  {item.icon}
                </div>

                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.25rem',
                    color: '#2b2226',
                    marginBottom: '0.5rem'
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.92rem',
                    lineHeight: 1.6,
                    color: '#5e4f55'
                  }}
                >
                  {item.desc}
                </p>
              </div>

              <div
                style={{
                  marginTop: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#be123c',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                <Sparkles size={13} />
                <span>Promise to {name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
