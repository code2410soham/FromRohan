import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Gift,
  Heart,
  Smile,
  RefreshCw,
  Flame,
  Wind,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Award,
  Star,
  Shuffle
} from 'lucide-react';
import { getAllPhotos } from '../utils/photoLoader';
import { triggerBirthdayConfetti } from '../utils/confetti';

export default function InteractiveSurprises({ config }) {
  // ===================================================================
  // 1. BLOW THE CANDLES STATE
  // ===================================================================
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [wishState, setWishState] = useState('idle'); // 'idle' -> 'blowing' -> 'made'

  const handleBlowCandles = () => {
    if (candlesBlown) return;
    setWishState('blowing');
    setCandlesBlown(true);

    setTimeout(() => {
      setWishState('made');
      triggerBirthdayConfetti('celebration');
    }, 400);
  };

  const handleRelightCandles = () => {
    setCandlesBlown(false);
    setWishState('idle');
  };

  // ===================================================================
  // 2. DAILY COMPLIMENT STATE
  // ===================================================================
  const complimentsList = config.compliments || [
    "Your laugh is literally the best soundtrack to any day! ✨",
    "You are the main character and everyone else is just background cast! 👑",
    "The world is undeniably 100x softer and sweeter because you exist in it. 🌸",
    "Your kindness, humor, and heart are completely unmatched! 💖"
  ];

  const [currentComplimentIdx, setCurrentComplimentIdx] = useState(0);
  const [complimentKey, setComplimentKey] = useState(0);

  const handleNextCompliment = () => {
    let nextIdx = Math.floor(Math.random() * complimentsList.length);
    if (nextIdx === currentComplimentIdx) {
      nextIdx = (currentComplimentIdx + 1) % complimentsList.length;
    }
    setCurrentComplimentIdx(nextIdx);
    setComplimentKey(prev => prev + 1);
    triggerBirthdayConfetti('stars');
  };

  // ===================================================================
  // 3. REASONS YOU'RE AMAZING (25) STATE
  // ===================================================================
  const reasonsList = config.reasonsList || [];
  const [currentReasonIdx, setCurrentReasonIdx] = useState(0);
  const [lovedReasons, setLovedReasons] = useState({});
  const [showAllReasons, setShowAllReasons] = useState(false);

  const handleNextReason = () => {
    if (currentReasonIdx < reasonsList.length - 1) {
      const next = currentReasonIdx + 1;
      setCurrentReasonIdx(next);
      if (next === reasonsList.length - 1) {
        triggerBirthdayConfetti('celebration');
      }
    } else {
      setCurrentReasonIdx(0);
    }
  };

  const handlePrevReason = () => {
    if (currentReasonIdx > 0) {
      setCurrentReasonIdx(prev => prev - 1);
    } else {
      setCurrentReasonIdx(reasonsList.length - 1);
    }
  };

  const toggleLoveCurrentReason = () => {
    setLovedReasons(prev => ({
      ...prev,
      [currentReasonIdx]: !prev[currentReasonIdx]
    }));
    triggerBirthdayConfetti('hearts');
  };

  // ===================================================================
  // 4. MEMORY PHOTO MATCHING GAME STATE (USES REAL PHOTOS)
  // ===================================================================
  const allAvailablePhotos = (config.photos && config.photos.length > 0) ? config.photos : getAllPhotos();

  // Pick 6 photos (or loop through available ones if fewer)
  const getGamePhotos = () => {
    const list = allAvailablePhotos.length > 0
      ? allAvailablePhotos.map(p => p.src)
      : ['/images/hero.jpg'];

    const chosen = [];
    for (let i = 0; i < 6; i++) {
      chosen.push(list[i % list.length]);
    }
    return chosen;
  };

  const createShuffledCards = () => {
    const photoList = getGamePhotos();
    const deck = [];
    photoList.forEach((src, idx) => {
      deck.push({ id: `card-${idx}-a`, photoSrc: src, pairId: idx, matched: false });
      deck.push({ id: `card-${idx}-b`, photoSrc: src, pairId: idx, matched: false });
    });
    return deck.sort(() => Math.random() - 0.5);
  };

  const [cards, setCards] = useState(createShuffledCards);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCount, setMatchedCount] = useState(0);

  const handleCardClick = (index) => {
    if (flippedCards.length === 2 || cards[index].matched || flippedCards.includes(index)) {
      return;
    }

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].pairId === cards[second].pairId) {
        // MATCH!
        setTimeout(() => {
          setCards(prev =>
            prev.map((c, i) => (i === first || i === second ? { ...c, matched: true } : c))
          );
          setFlippedCards([]);
          setMatchedCount(prev => {
            const next = prev + 1;
            if (next === 6) {
              triggerBirthdayConfetti('celebration');
            } else {
              triggerBirthdayConfetti('gentle');
            }
            return next;
          });
        }, 400);
      } else {
        // NO MATCH
        setTimeout(() => {
          setFlippedCards([]);
        }, 750);
      }
    }
  };

  const handleResetGame = () => {
    setCards(createShuffledCards());
    setFlippedCards([]);
    setMatchedCount(0);
  };

  // ===================================================================
  // 5. "OPEN WHEN..." NOTES STATE
  // ===================================================================
  const openWhenNotes = config.openWhenNotes || [];
  const [openNotes, setOpenNotes] = useState({});

  const toggleNote = (id) => {
    const nextState = !openNotes[id];
    setOpenNotes(prev => ({
      ...prev,
      [id]: nextState
    }));
    if (nextState) {
      triggerBirthdayConfetti('hearts');
    }
  };

  return (
    <section id="surprises" className="section-wrapper" style={{ position: 'relative' }}>
      {/* Background soft glowing blur */}
      <div
        className="glowing-orb"
        style={{
          top: '20%',
          right: '8%',
          width: '380px',
          height: '380px',
          background: 'rgba(254, 215, 170, 0.35)'
        }}
      />
      <div
        className="glowing-orb"
        style={{
          bottom: '25%',
          left: '5%',
          width: '420px',
          height: '420px',
          background: 'rgba(254, 205, 211, 0.35)'
        }}
      />

      <div className="site-container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Main Section Header */}
        <div className="section-header" style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
          <div className="section-tag">
            <Gift size={14} />
            <span>Interactive Fun</span>
          </div>
          <h2 className="section-title">
            The Bestie <span className="handwritten-accent">Playground</span>
          </h2>
          <p className="section-subtitle">
            A guided interactive journey of birthday wishes, compliments, games, and warm memories for {config.name}.
          </p>
        </div>

        {/* ============================================================
            VERTICAL STACKED FEATURES (ONE BELOW ANOTHER)
            ============================================================ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', maxWidth: '860px', margin: '0 auto' }}>

          {/* ----------------------------------------------------------
              FEATURE 1: 🎂 BLOW THE CANDLES
              ---------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="playground-card"
          >
            <div className="playground-card-header">
              <h3 className="playground-card-title">Make a Birthday Wish 🎂</h3>
              <p className="playground-card-subtitle">
                {candlesBlown ? "Wish made! 🎂💖" : "Make a wish... ✨"}
              </p>
            </div>

            {/* Virtual Cake Visual */}
            <div
              style={{
                width: 'min(260px, 100%)',
                height: '210px',
                margin: '1.5rem auto 2rem auto',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end'
              }}
            >
              {/* 3 Lit Candles */}
              <div
                style={{
                  display: 'flex',
                  gap: 'clamp(14px, 4vw, 26px)',
                  position: 'absolute',
                  top: '16px',
                  zIndex: 2
                }}
              >
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Flame */}
                    {!candlesBlown ? (
                      <motion.div
                        animate={{
                          scale: [1, 1.15, 0.95, 1],
                          rotate: [-3, 3, -1, 0]
                        }}
                        transition={{
                          duration: 0.8 + i * 0.25,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                        style={{
                          width: '16px',
                          height: '24px',
                          borderRadius: '50% 50% 35% 35%',
                          background: 'radial-gradient(ellipse at 50% 70%, #ffffff 0%, #fef08a 35%, #f97316 75%, #ef4444 100%)',
                          boxShadow: '0 0 16px #f97316, 0 0 30px rgba(249, 115, 22, 0.4)',
                          marginBottom: '2px'
                        }}
                      />
                    ) : (
                      /* Smoke Puff */
                      <motion.div
                        initial={{ opacity: 0.8, y: 0, scale: 0.8 }}
                        animate={{ opacity: 0, y: -28, scale: 1.5 }}
                        transition={{ duration: 1.6 }}
                        style={{
                          width: '12px',
                          height: '18px',
                          borderRadius: '50%',
                          background: 'rgba(180, 170, 175, 0.5)',
                          filter: 'blur(3px)',
                          marginBottom: '2px'
                        }}
                      />
                    )}

                    {/* Candle Body */}
                    <div
                      style={{
                        width: '12px',
                        height: '42px',
                        borderRadius: '4px',
                        background: 'linear-gradient(to bottom, #fbcfe8, #f472b6)',
                        border: '1px solid #f43f5e',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Cake Tier Top */}
              <div
                style={{
                  width: 'min(190px, 76%)',
                  height: '52px',
                  borderRadius: '16px 16px 8px 8px',
                  background: 'linear-gradient(135deg, #fff0f3, #ffe4e6)',
                  border: '2px solid #fda4af',
                  boxShadow: '0 4px 12px rgba(225, 29, 72, 0.08)',
                  position: 'relative',
                  zIndex: 1
                }}
              />

              {/* Cake Tier Base */}
              <div
                style={{
                  width: 'min(245px, 96%)',
                  height: '70px',
                  borderRadius: '8px 8px 18px 18px',
                  background: 'linear-gradient(135deg, #fed7aa, #fecdd3)',
                  border: '2px solid #fda4af',
                  boxShadow: '0 10px 24px rgba(94, 60, 70, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 8px'
                }}
              >
                <span style={{ fontSize: 'clamp(0.66rem, 2.3vw, 0.85rem)', fontWeight: 700, color: '#be123c', letterSpacing: '0.05em', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  HAPPY BIRTHDAY {config.name.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Candle Controls */}
            <div style={{ textAlign: 'center' }}>
              {!candlesBlown ? (
                <button
                  onClick={handleBlowCandles}
                  className="btn-primary"
                  style={{ padding: '0.9rem 2.2rem', fontSize: '1rem' }}
                >
                  <Wind size={18} /> Blow Out the Candles 💨
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
                  <div
                    style={{
                      fontFamily: "'Caveat', cursive",
                      fontSize: '1.7rem',
                      color: '#e11d48',
                      maxWidth: '480px',
                      lineHeight: 1.35
                    }}
                  >
                    🎉 Your wish is on its way to the universe! May every dream come true! ✨
                  </div>
                  <button onClick={handleRelightCandles} className="btn-secondary" style={{ padding: '0.65rem 1.6rem' }}>
                    <RefreshCw size={14} /> Relight Candles
                  </button>
                </div>
              )}
            </div>
          </motion.div>


          {/* ----------------------------------------------------------
              FEATURE 2: ✨ DAILY COMPLIMENT
              ---------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="playground-card"
          >
            <div className="playground-card-header">
              <h3 className="playground-card-title">Instant Bestie Boost ✨</h3>
              <p className="playground-card-subtitle">
                A daily reminder of how genuinely wonderful, funny, and bright you are.
              </p>
            </div>

            {/* Animated Compliment Card */}
            <div style={{ minHeight: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '1.5rem 0' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={complimentKey}
                  initial={{ opacity: 0, scale: 0.92, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #fffbf8 100%)',
                    border: '1px solid #fbcfe8',
                    borderRadius: '20px',
                    padding: 'clamp(1.4rem, 4vw, 2.2rem) clamp(1rem, 3.5vw, 2.4rem)',
                    boxShadow: '0 8px 30px rgba(225, 29, 72, 0.08), 0 2px 6px rgba(0,0,0,0.02)',
                    maxWidth: '620px',
                    width: '100%',
                    textAlign: 'center',
                    position: 'relative'
                  }}
                >
                  <Sparkles
                    size={20}
                    color="#f43f5e"
                    style={{ position: 'absolute', top: '16px', right: '20px', opacity: 0.6 }}
                  />
                  <p
                    style={{
                      fontFamily: "'Caveat', cursive",
                      fontSize: 'clamp(1.3rem, 4.5vw, 1.85rem)',
                      color: '#be123c',
                      lineHeight: 1.4,
                      margin: 0
                    }}
                  >
                    "{complimentsList[currentComplimentIdx]}"
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button onClick={handleNextCompliment} className="btn-primary" style={{ padding: '0.85rem 2rem' }}>
                <Sparkles size={18} /> Give Me Another Compliment!
              </button>
            </div>
          </motion.div>


          {/* ----------------------------------------------------------
              FEATURE 3: 💖 REASONS YOU'RE AMAZING (25)
              ---------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="playground-card"
          >
            <div className="playground-card-header">
              <h3 className="playground-card-title">Reasons You're Amazing 💖</h3>
              <p className="playground-card-subtitle">
                25 handwritten reasons why life is 1000x better with you in it.
              </p>
            </div>

            {/* Single Interactive Card View */}
            {!showAllReasons ? (
              <div style={{ maxWidth: '640px', margin: '1.5rem auto' }}>
                {/* Progress bar & indicator */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', padding: '0 4px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e11d48', letterSpacing: '0.04em' }}>
                    Reason {String(currentReasonIdx + 1).padStart(2, '0')} / {reasonsList.length}
                  </span>
                  <button
                    onClick={toggleLoveCurrentReason}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: lovedReasons[currentReasonIdx] ? '#e11d48' : '#8a7880',
                      cursor: 'pointer'
                    }}
                  >
                    <Heart
                      size={18}
                      color="#e11d48"
                      fill={lovedReasons[currentReasonIdx] ? "#e11d48" : "none"}
                    />
                    <span>{lovedReasons[currentReasonIdx] ? 'Saved' : 'Favorite'}</span>
                  </button>
                </div>

                {/* Progress track */}
                <div style={{ width: '100%', height: '5px', background: '#fce7ec', borderRadius: '999px', overflow: 'hidden', marginBottom: '1.8rem' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${((currentReasonIdx + 1) / reasonsList.length) * 100}%`,
                      background: 'linear-gradient(90deg, #fb7185, #e11d48)',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>

                {/* Main Reason Card */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentReasonIdx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      background: lovedReasons[currentReasonIdx]
                        ? 'linear-gradient(135deg, #fff1f4 0%, #fffdf9 100%)'
                        : '#ffffff',
                      border: '1px solid #fecdd3',
                      borderRadius: '20px',
                      padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 3.5vw, 2rem)',
                      boxShadow: '0 10px 30px rgba(94, 60, 70, 0.08)',
                      minHeight: '160px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      marginBottom: '1.5rem'
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(1.1rem, 3.6vw, 1.35rem)',
                        lineHeight: 1.5,
                        color: '#2b2226',
                        margin: 0
                      }}
                    >
                      "{reasonsList[currentReasonIdx]}"
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={handlePrevReason}
                    className="btn-secondary"
                    style={{ padding: '0.7rem 1.4rem' }}
                    aria-label="Previous reason"
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>

                  <button
                    onClick={handleNextReason}
                    className="btn-primary"
                    style={{ padding: '0.75rem 1.8rem' }}
                  >
                    <span>Next Reason</span>
                    <ChevronRight size={16} />
                  </button>

                  <button
                    onClick={() => setShowAllReasons(true)}
                    className="btn-secondary"
                    style={{ padding: '0.7rem 1.2rem', fontSize: '0.82rem' }}
                  >
                    View All 25 📜
                  </button>
                </div>
              </div>
            ) : (
              /* All 25 Grid View */
              <div>
                <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                  <button
                    onClick={() => setShowAllReasons(false)}
                    className="btn-secondary"
                    style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}
                  >
                    ← Back to Step-by-Step View
                  </button>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '1rem',
                    maxHeight: '440px',
                    overflowY: 'auto',
                    padding: '0.5rem'
                  }}
                >
                  {reasonsList.map((reason, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setCurrentReasonIdx(idx);
                        setShowAllReasons(false);
                      }}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #fecdd3',
                        borderRadius: '14px',
                        padding: '1rem 1.2rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.8rem',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                        transition: 'transform 0.2s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e11d48' }}>
                        #{idx + 1}
                      </span>
                      <span style={{ fontSize: '0.9rem', color: '#2b2226', lineHeight: 1.4 }}>
                        {reason}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>


          {/* ----------------------------------------------------------
              FEATURE 4: 🎮 MEMORY MINI GAME (REAL PHOTOS FROM /public/images/)
              ---------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="playground-card"
          >
            <div className="playground-card-header">
              <h3 className="playground-card-title">Memory Photo Match 🎮</h3>
              <p className="playground-card-subtitle">
                Flip and pair matching memories of {config.name}! Pairs matched: <strong>{matchedCount} / 6</strong>
              </p>
            </div>

            {/* 12 Memory Cards Grid (4 cols x 3 rows) */}
            <div
              className="memory-cards-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 'clamp(6px, 1.8vw, 12px)',
                maxWidth: '520px',
                margin: '1.5rem auto 2rem auto'
              }}
            >
              {cards.map((card, idx) => {
                const isFlipped = flippedCards.includes(idx) || card.matched;
                return (
                  <motion.div
                    key={card.id}
                    className="memory-card-item"
                    whileHover={{ scale: card.matched ? 1 : 1.04 }}
                    whileTap={{ scale: card.matched ? 1 : 0.96 }}
                    onClick={() => handleCardClick(idx)}
                    style={{
                      perspective: '1000px',
                      cursor: card.matched ? 'default' : 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        borderRadius: '12px',
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        boxShadow: card.matched
                          ? '0 0 15px rgba(225, 29, 72, 0.35), 0 4px 12px rgba(0,0,0,0.08)'
                          : '0 4px 12px rgba(94, 60, 70, 0.08)'
                      }}
                    >
                      {/* CARD BACK (BEFORE FLIP) */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backfaceVisibility: 'hidden',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #fff0f3 0%, #fed7aa 100%)',
                          border: '2px solid rgba(251, 113, 133, 0.5)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <Heart size={20} color="#e11d48" fill="#fda4af" />
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#be123c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Gaurii ✨
                        </span>
                      </div>

                      {/* CARD FRONT (REVEALED REAL PHOTO) */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          background: '#ffffff',
                          border: card.matched ? '2px solid #e11d48' : '2px solid #fed7aa'
                        }}
                      >
                        <img
                          src={card.photoSrc}
                          alt="Memory Card"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                        />
                        {card.matched && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '4px',
                              right: '4px',
                              background: '#e11d48',
                              color: '#ffffff',
                              borderRadius: '50%',
                              width: '18px',
                              height: '18px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '10px'
                            }}
                          >
                            ✓
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Victory or Reset Controls */}
            <div style={{ textAlign: 'center' }}>
              {matchedCount === 6 ? (
                <div>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.85rem',
                        fontWeight: 700,
                        color: '#be123c',
                        marginBottom: '4px'
                      }}
                    >
                      Memory Master! 💖
                    </div>
                    <div
                      style={{
                        fontFamily: "'Caveat', cursive",
                        fontSize: '1.5rem',
                        color: '#e11d48'
                      }}
                    >
                      You remembered them all! ✨
                    </div>
                  </div>
                  <button onClick={handleResetGame} className="btn-primary" style={{ padding: '0.75rem 2rem' }}>
                    <RefreshCw size={16} /> Play Again ↻
                  </button>
                </div>
              ) : (
                <button onClick={handleResetGame} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
                  <RefreshCw size={14} /> Reshuffle Game
                </button>
              )}
            </div>
          </motion.div>


          {/* ----------------------------------------------------------
              FEATURE 5: 💌 "OPEN WHEN..." NOTES
              ---------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="playground-card"
          >
            <div className="playground-card-header">
              <h3 className="playground-card-title">"Open When..." Envelopes 💌</h3>
              <p className="playground-card-subtitle">
                Personal letters saved for whenever you need a smile, a laugh, or a reminder that you're never alone.
              </p>
            </div>

            {/* Vertical Envelope Sequence */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', margin: '1.5rem 0' }}>
              {openWhenNotes.map((note) => {
                const isOpen = !!openNotes[note.id];
                return (
                  <motion.div
                    key={note.id}
                    layout
                    onClick={() => toggleNote(note.id)}
                    style={{
                      background: isOpen
                        ? 'linear-gradient(135deg, #fffdfa 0%, #fff1f4 100%)'
                        : '#ffffff',
                      border: isOpen ? '1.5px solid #fb7185' : '1px solid #fce7ec',
                      borderRadius: '18px',
                      padding: 'clamp(1.1rem, 3.5vw, 1.6rem) clamp(1rem, 3.5vw, 2rem)',
                      cursor: 'pointer',
                      boxShadow: isOpen
                        ? '0 10px 30px rgba(225, 29, 72, 0.1)'
                        : '0 4px 14px rgba(94, 60, 70, 0.05)',
                      transition: 'border 0.25s ease, box-shadow 0.25s ease'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem'
                      }}
                    >
                      <h4
                        style={{
                          fontSize: '1.15rem',
                          fontFamily: "'Playfair Display', serif",
                          color: '#2b2226',
                          margin: 0,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}
                      >
                        <span>💌</span>
                        <span>{note.title}</span>
                      </h4>

                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: isOpen ? '#ffe4e6' : '#fdf2f8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'transform 0.3s ease',
                          transform: isOpen ? 'rotate(90deg)' : 'none',
                          color: '#e11d48'
                        }}
                      >
                        <ChevronRight size={18} />
                      </div>
                    </div>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <p
                            style={{
                              fontFamily: "'Caveat', cursive",
                              fontSize: '1.45rem',
                              lineHeight: 1.5,
                              color: '#be123c',
                              marginTop: '1.25rem',
                              paddingTop: '1.25rem',
                              borderTop: '1px dashed #fbcfe8',
                              marginBottom: 0
                            }}
                          >
                            "{note.content}"
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {!isOpen && (
                      <div style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: '#c88a75', fontStyle: 'italic' }}>
                        Tap to unseal envelope →
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

        </div>
      </div>

      {/* Embedded CSS for Playground Cards */}
      <style>{`
        .playground-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 28px;
          padding: 3rem 2.5rem;
          box-shadow: 0 16px 40px rgba(94, 60, 70, 0.08), 0 2px 6px rgba(0,0,0,0.02);
          position: relative;
        }

        @media (max-width: 640px) {
          .playground-card {
            padding: 2rem 1.25rem;
            border-radius: 20px;
          }
        }

        .playground-card-header {
          text-align: center;
          margin-bottom: 1rem;
        }

        .playground-step-pill {
          display: inline-block;
          font-size: 0.76rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #c88a75;
          background: #fff1f4;
          padding: 4px 14px;
          border-radius: 999px;
          border: 1px solid #fecdd3;
          margin-bottom: 0.75rem;
        }

        .playground-card-title {
          font-family: var(--font-serif);
          font-size: clamp(1.6rem, 3.5vw, 2.1rem);
          color: #2b2226;
          margin-bottom: 0.5rem;
        }

        .playground-card-subtitle {
          font-size: 0.95rem;
          color: #5e4f55;
          max-width: 540px;
          margin: 0 auto;
        }

        .memory-card-item {
          aspect-ratio: 1 / 1.15;
          width: 100%;
          min-height: 70px;
        }

        @media (max-width: 520px) {
          .memory-cards-grid {
            gap: 6px !important;
          }
          .memory-card-item {
            min-height: 60px !important;
          }
        }
        @media (max-width: 360px) {
          .memory-cards-grid {
            gap: 4px !important;
          }
        }
      `}</style>
    </section>
  );
}
