import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Star } from 'lucide-react';

export default function SpecialReasons({ reasons = [], name }) {
  return (
    <section id="special" className="section-wrapper" style={{ position: 'relative' }}>
      {/* Background soft glowing blur */}
      <div
        className="glowing-orb"
        style={{
          top: '20%',
          right: '5%',
          width: '380px',
          height: '380px',
          background: 'rgba(243, 232, 255, 0.45)'
        }}
      />

      <div className="site-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Sparkles size={14} />
            <span>The Rare Qualities</span>
          </div>
          <h2 className="section-title">
            Why <span className="handwritten-accent">{name}</span> Is One of a Kind
          </h2>
          <p className="section-subtitle">
            Not just because it's your birthday, but because these things make you who you are every single day.
          </p>
        </div>

        {/* 8 Luxury Animated Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 250px), 1fr))',
            gap: 'clamp(1.1rem, 3vw, 1.75rem)'
          }}
        >
          {reasons.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              style={{
                background: 'rgba(255, 255, 255, 0.78)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                borderRadius: '24px',
                padding: 'clamp(1.5rem, 3.5vw, 2rem) clamp(1.1rem, 3vw, 1.6rem)',
                boxShadow: '0 10px 30px rgba(94, 60, 70, 0.06)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div>
                {/* Icon bubble */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.25rem'
                  }}
                >
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #fff1f2, #ffe4e6)',
                      border: '1px solid #fecdd3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.6rem',
                      boxShadow: '0 4px 12px rgba(225, 29, 72, 0.08)'
                    }}
                  >
                    {item.icon}
                  </div>

                  {/* Badge */}
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      color: '#b76e79',
                      background: 'rgba(255, 241, 242, 0.8)',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      border: '1px solid #ffe4e6'
                    }}
                  >
                    {item.tag}
                  </span>
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.3rem',
                    color: '#2b2226',
                    marginBottom: '0.6rem',
                    fontWeight: 600
                  }}
                >
                  {item.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: '0.92rem',
                    lineHeight: 1.6,
                    color: '#5e4f55'
                  }}
                >
                  {item.description}
                </p>
              </div>

              {/* Card Footer accent */}
              <div
                style={{
                  marginTop: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#fb7185',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                <Heart size={13} fill="#fb7185" />
                <span>Endlessly appreciated</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
