import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

export default function MusicPlayer({ config, isPlaying, onTogglePlay }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(0.65);
  const [isMuted, setIsMuted] = useState(false);
  const [useSynth, setUseSynth] = useState(true); // Default to gentle ambient chimes if MP3 isn't provided
  
  const audioRef = useRef(null);
  const synthTimerRef = useRef(null);
  const audioCtxRef = useRef(null);
  const userInteractedRef = useRef(false);

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Web Audio Gentle Chime Synthesizer
  const startAmbientSynth = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }

      // Gentle kalimba / music box chimes chord progression (Cmaj7, Am7, Fmaj7, G7)
      const chords = [
        [261.63, 329.63, 392.00, 493.88], // C, E, G, B
        [220.00, 261.63, 329.63, 392.00], // A, C, E, G
        [174.61, 261.63, 329.63, 349.23], // F, C, E, F
        [196.00, 246.94, 293.66, 392.00]  // G, B, D, G
      ];
      let chordIndex = 0;

      const playChimeNote = (freq, delay = 0) => {
        if (!audioCtxRef.current || isMuted || audioCtxRef.current.state !== 'running') return;
        setTimeout(() => {
          try {
            const ctx = audioCtxRef.current;
            if (!ctx || ctx.state !== 'running') return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            // Gentle soft bell envelope
            const noteVol = volume * 0.14;
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(noteVol, ctx.currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.4);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 2.5);
          } catch {
            // ignore
          }
        }, delay);
      };

      const loop = () => {
        if (!isPlaying || synthTimerRef.current === null) return;
        const chord = chords[chordIndex % chords.length];
        chord.forEach((freq, idx) => {
          playChimeNote(freq, idx * 320);
        });
        chordIndex++;
        synthTimerRef.current = setTimeout(loop, 2700);
      };

      if (!synthTimerRef.current) {
        synthTimerRef.current = true;
        loop();
      }
    } catch {
      // Audio context unsupported
    }
  };

  const stopAmbientSynth = () => {
    if (synthTimerRef.current) {
      clearTimeout(synthTimerRef.current);
      synthTimerRef.current = null;
    }
  };

  // Attempt autoplay immediately on mount and setup fallback unlock on user interaction
  useEffect(() => {
    const playAudio = () => {
      if (!isPlaying) return;

      if (audioRef.current && config.music?.audioSrc) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setUseSynth(false);
              userInteractedRef.current = true;
            })
            .catch(() => {
              // MP3 blocked or missing, switch to synth chimes
              setUseSynth(true);
              startAmbientSynth();
            });
        }
      } else {
        setUseSynth(true);
        startAmbientSynth();
      }
    };

    // Attempt autoplay immediately
    playAudio();

    // Browser autoplay policy fallback: unlock on first click/touch/keydown
    const handleFirstGesture = () => {
      if (!userInteractedRef.current && isPlaying) {
        userInteractedRef.current = true;
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume().catch(() => {});
        }
        playAudio();
      }
    };

    window.addEventListener('pointerdown', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true, passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, []);

  // Sync state changes with audio/synth
  useEffect(() => {
    if (isPlaying) {
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }
      if (!useSynth && audioRef.current) {
        audioRef.current.play().catch(() => {
          setUseSynth(true);
          startAmbientSynth();
        });
      } else {
        startAmbientSynth();
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopAmbientSynth();
    }
  }, [isPlaying, useSynth]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <>
      {/* Hidden Audio Element for MP3 file if present */}
      <audio
        ref={audioRef}
        src={config.music?.audioSrc || "/music/birthday.mp3"}
        loop
        preload="auto"
        onError={() => {
          setUseSynth(true);
        }}
      />

      {/* Floating Mini Player Widget in bottom-right */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        style={{
          position: 'fixed',
          bottom: 'calc(20px + var(--safe-bottom, 0px))',
          right: 'calc(16px + var(--safe-right, 0px))',
          zIndex: 900,
          maxWidth: 'calc(100vw - 32px)'
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(254, 205, 211, 0.8)',
            borderRadius: isExpanded ? '20px' : '999px',
            boxShadow: '0 10px 30px rgba(94, 60, 70, 0.12)',
            padding: isExpanded ? '16px 20px' : '8px 16px',
            width: isExpanded ? 'min(300px, calc(100vw - 32px))' : 'auto',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Collapsed Pill */}
          {!isExpanded ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={onTogglePlay}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isPlaying
                    ? 'linear-gradient(135deg, #fb7185, #e11d48)'
                    : '#f3e8ff',
                  color: isPlaying ? '#ffffff' : '#7e22ce',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: isPlaying ? '0 4px 12px rgba(225, 29, 72, 0.25)' : 'none'
                }}
                aria-label={isPlaying ? "Mute music" : "Play music"}
              >
                {isPlaying ? <Volume2 size={15} /> : <VolumeX size={15} />}
              </button>

              <div
                onClick={() => setIsExpanded(true)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {/* Visualizer soundwave bars */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '16px' }}>
                  {[12, 16, 10, 14].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={isPlaying ? { height: [4, h, 6, h * 0.8, 4] } : { height: 4 }}
                      transition={{ duration: 0.8 + i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        width: '3px',
                        background: '#e11d48',
                        borderRadius: '2px'
                      }}
                    />
                  ))}
                </div>

                <span className="music-pill-label" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2b2226' }}>
                  {isPlaying ? "Music On" : "Music Off"}
                </span>

                <ChevronUp size={15} color="#8a7880" />
              </div>
            </div>
          ) : (
            /* Expanded Controls Panel */
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Music size={15} color="#e11d48" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#be123c' }}>
                    BACKGROUND AUDIO
                  </span>
                </div>

                <button
                  onClick={() => setIsExpanded(false)}
                  style={{ color: '#8a7880', cursor: 'pointer' }}
                  aria-label="Collapse music player"
                >
                  <ChevronDown size={16} />
                </button>
              </div>

              {/* Track Name */}
              <div style={{ marginBottom: '12px' }}>
                <div
                  style={{
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    color: '#2b2226',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {useSynth ? "Soft Ambient Piano Chimes" : config.music?.songTitle || "Birthday Melody"}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#8a7880' }}>
                  {useSynth ? "Interactive Soundscape" : "Custom Track (/public/music/birthday.mp3)"}
                </div>
              </div>

              {/* Controls Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <button
                  onClick={onTogglePlay}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    background: 'linear-gradient(135deg, #fb7185, #e11d48)',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  {isPlaying ? <VolumeX size={13} /> : <Volume2 size={13} />}
                  <span>{isPlaying ? "Mute" : "Play"}</span>
                </button>

                {/* Volume & Mute */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button onClick={toggleMute} style={{ color: '#5e4f55', cursor: 'pointer' }}>
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      if (isMuted) setIsMuted(false);
                    }}
                    style={{
                      width: '70px',
                      accentColor: '#e11d48',
                      cursor: 'pointer'
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
      <style>{`
        @media (max-width: 520px) {
          .music-pill-label {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
