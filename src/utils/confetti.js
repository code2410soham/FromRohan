import confetti from 'canvas-confetti';

/**
 * Site-wide Birthday Confetti System
 * Reusable, elegant, and performance-friendly.
 */
export const triggerBirthdayConfetti = (variant = 'burst', customOptions = {}) => {
  // Check user preference for reduced motion
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const pastelColors = ['#f43f5e', '#fb7185', '#fda4af', '#fecdd3', '#fed7aa', '#e9d5ff', '#c084fc', '#fef08a'];

  try {
    switch (variant) {
      case 'hearts': {
        // Heart & star shaped confetti burst
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#e11d48', '#fb7185', '#f43f5e', '#fbcfe8', '#fed7aa'],
          scalar: 1.1,
          shapes: ['circle'],
          ticks: 180,
          ...customOptions
        });
        break;
      }

      case 'celebration': {
        // High-energy celebration burst from both sides (Cake blown, Game won, Final surprise)
        const count = 50;
        const defaults = {
          origin: { y: 0.7 },
          colors: pastelColors,
          ticks: 200
        };

        confetti({
          ...defaults,
          particleCount: count,
          angle: 60,
          spread: 55,
          origin: { x: 0.2, y: 0.65 },
          ...customOptions
        });
        confetti({
          ...defaults,
          particleCount: count,
          angle: 120,
          spread: 55,
          origin: { x: 0.8, y: 0.65 },
          ...customOptions
        });
        break;
      }

      case 'stars': {
        // Twinkling delicate confetti
        confetti({
          particleCount: 28,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#fbbf24', '#f59e0b', '#fda4af', '#e9d5ff', '#ffffff'],
          scalar: 0.9,
          ticks: 140,
          ...customOptions
        });
        break;
      }

      case 'gentle': {
        // Soft subtle sprinkle
        confetti({
          particleCount: 20,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#fda4af', '#fecdd3', '#fed7aa', '#f3e8ff'],
          scalar: 0.8,
          ticks: 120,
          ...customOptions
        });
        break;
      }

      case 'burst':
      default: {
        // Balanced joyful burst
        confetti({
          particleCount: 40,
          spread: 70,
          origin: { y: 0.6 },
          colors: pastelColors,
          ticks: 160,
          ...customOptions
        });
        break;
      }
    }
  } catch (err) {
    // Graceful fallback if canvas is restricted
    console.debug('Confetti triggered (canvas unavailable):', err);
  }
};
