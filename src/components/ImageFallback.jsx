import React, { useState } from 'react';
import { Image as ImageIcon, Heart } from 'lucide-react';

/**
 * ImageFallback Component
 * Gracefully displays images with lazy loading and elegant fallback if file is missing.
 */
export default function ImageFallback({
  src,
  alt = "Memory photograph",
  className = "",
  style = {},
  fallbackTitle = "Cherished Memory",
  ...props
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`fallback-img-container ${className}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fff0f3 0%, #fdf2f8 50%, #f5f3ff 100%)',
          color: '#b76e79',
          padding: '2rem',
          minHeight: '220px',
          textAlign: 'center',
          border: '1px dashed #fbcfe8',
          borderRadius: '8px',
          ...style
        }}
        {...props}
      >
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '0.75rem',
          boxShadow: '0 4px 12px rgba(225, 29, 72, 0.1)'
        }}>
          <Heart size={24} color="#f43f5e" fill="#ffe4e6" />
        </div>
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.05rem',
          fontWeight: 600,
          color: '#4a3b40',
          margin: 0
        }}>
          {fallbackTitle}
        </p>
        <span style={{
          fontSize: '0.8rem',
          color: '#9f8890',
          marginTop: '0.35rem'
        }}>
          Place photo in /public/images/
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#f8f2ee'
      }}
      className={className}
    >
      {!isLoaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #fce7ec 0%, #fff1f4 50%, #fce7ec 100%)',
            backgroundSize: '200% 100%',
            animation: 'pulseGlow 2s infinite',
            zIndex: 1
          }}
        />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.4s ease-in-out',
          ...style
        }}
        {...props}
      />
    </div>
  );
}
