import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { birthdayConfig } from './config/birthdayConfig';
import BirthdayGate from './components/BirthdayGate';
import CinematicIntro from './components/CinematicIntro';
import FlowerTransition from './components/FlowerTransition';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import SpecialReasons from './components/SpecialReasons';
import PersonalLetter from './components/PersonalLetter';
import InteractiveSurprises from './components/InteractiveSurprises';
import FutureWishes from './components/FutureWishes';
import FinalSurprise from './components/FinalSurprise';
import SongDedication from './components/SongDedication';
import MusicPlayer from './components/MusicPlayer';
import EasterEggs from './components/EasterEggs';
import Footer from './components/Footer';
import { triggerBirthdayConfetti } from './utils/confetti';
import { fetchProtectedPhotos, setCachedPhotos } from './utils/photoLoader';

export default function App() {
  // Gate authentication & deadline status from server
  const [gateStatus, setGateStatus] = useState({
    checking: true,
    unlocked: false,
    authenticated: false,
    remainingMs: 0,
    targetTime: birthdayConfig.birthdayDate || '2026-10-11T00:00:00+05:30'
  });

  const [photos, setPhotos] = useState([]);
  const [showIntro, setShowIntro] = useState(true);
  const [isFlowerTransitioning, setIsFlowerTransitioning] = useState(false);

  // Background music starts automatically on website open, remembers session preference
  const [isPlayingMusic, setIsPlayingMusic] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('music_enabled');
      return saved !== 'false';
    }
    return true;
  });

  // Verify server-side deadline and session on initial load
  const checkServerStatus = async () => {
    try {
      const res = await fetch('/api/status', {
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        credentials: 'same-origin'
      });

      if (res.ok) {
        const data = await res.json();
        setGateStatus({
          checking: false,
          unlocked: Boolean(data.unlocked),
          authenticated: Boolean(data.authenticated),
          remainingMs: data.remainingMs,
          targetTime: data.targetTime
        });

        if (data.authenticated) {
          loadAuthenticatedPhotos();
        }
      } else {
        setGateStatus(prev => ({ ...prev, checking: false }));
      }
    } catch {
      setGateStatus(prev => ({ ...prev, checking: false }));
    }
  };

  const loadAuthenticatedPhotos = async () => {
    const loaded = await fetchProtectedPhotos();
    if (Array.isArray(loaded) && loaded.length > 0) {
      setPhotos(loaded);
      setCachedPhotos(loaded);
    }
  };

  useEffect(() => {
    checkServerStatus();
  }, []);

  const handleUnlocked = async () => {
    await checkServerStatus();
    await loadAuthenticatedPhotos();
  };

  const handleLockWebsite = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        credentials: 'same-origin'
      });
    } catch {
      // fallback
    }
    setGateStatus(prev => ({ ...prev, authenticated: false }));
    setPhotos([]);
    setShowIntro(true);
  };

  // Called when "Open Your Surprise ❤️" is clicked
  const handleStartFlowerTransition = () => {
    setIsFlowerTransitioning(true);
  };

  // Called at exact 100% cover moment (flower wipe) to swap pages seamlessly
  const handleTransitionCover = () => {
    setShowIntro(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Called when floral reveal ends
  const handleTransitionComplete = () => {
    setIsFlowerTransitioning(false);
    triggerBirthdayConfetti('gentle');
  };

  // Fast skip if "Skip Intro →" is clicked
  const handleSkipIntro = () => {
    setIsFlowerTransitioning(false);
    setShowIntro(false);
    triggerBirthdayConfetti('celebration');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleToggleMusic = () => {
    setIsPlayingMusic(prev => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('music_enabled', next ? 'true' : 'false');
      }
      return next;
    });
  };

  const handleReplayJourney = () => {
    setIsFlowerTransitioning(false);
    setShowIntro(true);
    triggerBirthdayConfetti('burst');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Initial Loading State while verifying server clock & session
  if (gateStatus.checking) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: '#161014',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fecdd3'
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fb7185, #e11d48)',
            marginBottom: '1rem'
          }}
        />
        <p style={{ fontFamily: "'Caveat', cursive", fontSize: '1.4rem', color: '#fda4af' }}>
          Preparing your magical surprise... ✨
        </p>
      </div>
    );
  }

  // 2. Birthday Countdown / PIN Lock Gate
  // When locked or unauthenticated, DO NOT render the protected website content!
  if (!gateStatus.authenticated) {
    return (
      <BirthdayGate
        status={gateStatus}
        name={birthdayConfig.name}
        onUnlocked={handleUnlocked}
        onRefreshStatus={checkServerStatus}
      />
    );
  }

  // Dynamic config with authenticated decrypted photos
  const effectiveConfig = {
    ...birthdayConfig,
    photos: photos.length > 0 ? photos : birthdayConfig.photos,
    hero: {
      ...birthdayConfig.hero,
      heroImage: photos[0]?.src || birthdayConfig.hero.heroImage
    }
  };

  // 3. Fully Authenticated Experience (All Existing Website Features Preserved)
  return (
    <div className="app-wrapper">
      {/* GLOBAL BACKGROUND MUSIC (STARTS AUTOMATICALLY & PERSISTS CONTINUOUSLY) */}
      <MusicPlayer
        config={effectiveConfig}
        isPlaying={isPlayingMusic}
        onTogglePlay={handleToggleMusic}
      />

      {/* 1. CINEMATIC INTRO EXPERIENCE */}
      <AnimatePresence>
        {showIntro && (
          <CinematicIntro
            config={effectiveConfig}
            onComplete={handleSkipIntro}
            onStartTransition={handleStartFlowerTransition}
            isTransitioning={isFlowerTransitioning}
          />
        )}
      </AnimatePresence>

      {/* FULL-SCREEN 3D FLOWER TRANSITION OVERLAY */}
      {isFlowerTransitioning && (
        <FlowerTransition
          name={effectiveConfig.name}
          onCover={handleTransitionCover}
          onComplete={handleTransitionComplete}
        />
      )}

      {/* 2. MAIN WEBSITE CONTENT */}
      {!showIntro && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Floating Navigation Bar */}
          <Navbar
            config={effectiveConfig}
            isPlaying={isPlayingMusic}
            onToggleMusic={handleToggleMusic}
            onLock={handleLockWebsite}
          />

          <main>
            {/* Hero Section */}
            <Hero config={effectiveConfig} />

            {/* Photo Memory Gallery (Collage, Masonry & Lightbox with Fairy Lights) */}
            <Gallery
              photos={photos}
              name={effectiveConfig.name}
            />

            {/* Why You're Special (8 Luxury Cards) */}
            <SpecialReasons
              reasons={effectiveConfig.specialReasons}
              name={effectiveConfig.name}
            />

            {/* Personal Birthday Letter (Stationery & Envelope) */}
            <PersonalLetter
              letterData={effectiveConfig.letter}
              name={effectiveConfig.name}
            />

            {/* Interactive Bestie Playground (Vertical Stack: Cake -> Compliment -> Reasons -> Game -> Open-When) */}
            <InteractiveSurprises
              config={effectiveConfig}
            />

            {/* Future Wishes ("Here's to everything that's still ahead...") */}
            <FutureWishes
              wishes={effectiveConfig.futureWishes}
              name={effectiveConfig.name}
            />

            {/* Final Surprise Climax */}
            <FinalSurprise
              config={effectiveConfig}
              onReplay={handleReplayJourney}
            />

            {/* Dedicated Spotify Song */}
            <SongDedication
              name={effectiveConfig.name}
              songConfig={effectiveConfig.dedicatedSong}
            />
          </main>

          {/* Hidden Interactive Easter Eggs */}
          <EasterEggs easterEggs={effectiveConfig.easterEggs} />

          {/* Footer */}
          <Footer name={effectiveConfig.name} onLock={handleLockWebsite} />
        </motion.div>
      )}
    </div>
  );
}
