/**
 * ====================================================================
 * BIRTHDAY CONFIGURATION - MASTER PERSONALIZATION FILE
 * ====================================================================
 * Personalization settings for Gaurii!
 * All photos in /public/images/ are auto-loaded.
 * Music can be placed in /public/music/birthday.mp3
 */

import { getAllPhotos } from '../utils/photoLoader';

const allPhotos = getAllPhotos();

export const birthdayConfig = {
  // ------------------------------------------------------------------
  // 1. BEST FRIEND DETAILS
  // ------------------------------------------------------------------
  name: "Gaurii",
  nickname: "Sunshine / Partner in Crime",

  // Birthday date in format "YYYY-MM-DDTHH:mm:ss+05:30" (Indian Standard Time)
  birthdayDate: "2026-10-11T00:00:00+05:30",

  // Instagram profile
  instagramHandle: "@Gaurii.vibes",
  instagramUrl: "",

  // ------------------------------------------------------------------
  // 2. HERO SECTION
  // ------------------------------------------------------------------
  hero: {
    badge: "✨ Special Day for a Special Soul",
    headline: "Happy Birthday,",
    subtitle: "Today isn't just another day on the calendar... it's the day the world got a whole lot brighter, kinder, and infinitely more fun.",
    heroImage: allPhotos[0]?.src || "/images/hero.jpg",
    heroImageCaption: "The brightest smile in the universe 🌸",
    floatingBadges: [
      { text: "My Constant 💫", position: "top-left" },
      { text: "Certified Legend 🎀", position: "bottom-right" },
      { text: "Always Bringing Sunshine ☀️", position: "bottom-left" }
    ]
  },

  // ------------------------------------------------------------------
  // 3. BACKGROUND MUSIC
  // ------------------------------------------------------------------
  music: {
    audioSrc: "/music/birthday.mp3",
    songTitle: "Cozy Memories — Soft Acoustic Piano",
    artist: "Dedicated with love",
    autoPlayPrompt: "Play gentle background music for the experience"
  },

  // ------------------------------------------------------------------
  // 4. PHOTO MEMORY GALLERY (Auto-loaded from /public/images/)
  // ------------------------------------------------------------------
  photos: allPhotos,

  // ------------------------------------------------------------------
  // 5. WHY YOU'RE SPECIAL (Animated Cards)
  // ------------------------------------------------------------------
  specialReasons: [
    {
      icon: "❤️",
      title: "Always There",
      description: "No matter how busy life gets, you always find time to check in, support, and show up when it matters most.",
      tag: "Pure Loyalty"
    },
    {
      icon: "😂",
      title: "Professional Troublemaker",
      description: "You turn the dullest grocery store run or quiet library visit into an iconic sitcom episode full of giggles.",
      tag: "Humor Level 100"
    },
    {
      icon: "✨",
      title: "One of a Kind",
      description: "Your unique perspective, your quirky habits, and your unapologetic authenticity make you completely irreplaceable.",
      tag: "Rare Gem"
    },
    {
      icon: "🌸",
      title: "Kind Heart",
      description: "The gentle empathy you show toward everyone and the warmth you radiate whenever you enter a room.",
      tag: "Pure Soul"
    },
    {
      icon: "🤝",
      title: "My Constant",
      description: "Trends change, seasons change, people come and go, but having you as my best friend has been the most stabilizing gift.",
      tag: "Rock Solid"
    },
    {
      icon: "🎀",
      title: "Effortlessly Graceful",
      description: "The way you carry yourself through tough times with poise, kindness, and quiet inner resilience is inspiring.",
      tag: "Inner Strength"
    },
    {
      icon: "🌎",
      title: "Makes Days Better",
      description: "Even when everything is going wrong, a 5-minute phone call with you puts the universe back into perspective.",
      tag: "Instant Antidote"
    },
    {
      icon: "🥹",
      title: "Worth Keeping Forever",
      description: "They say true best friends are chosen family. I could not have chosen anyone better to walk through this life with.",
      tag: "Forever Bond"
    }
  ],

  // ------------------------------------------------------------------
  // 6. PERSONAL BIRTHDAY LETTER (Stationery Paper Envelope)
  // ------------------------------------------------------------------
  letter: {
    envelopePrompt: "💌 You have one unopened letter from Rohan",
    salutation: "Dearest Gaurii,",
    paragraphs: [
      "Happy, happy birthday! Writing this makes me reflect on how lucky I am to have you as my girl best friend. Life moves fast, but having you alongside me has made every single year richer, warmer, and so much funnier.",
      "Thank you for being the person who never lets me down. Thank you for the spontaneous midnight FaceTime calls, the completely irrational laughter over things nobody else understands, and the quiet comfort of knowing I never have to pretend when I'm around you.",
      "You have such a rare and gentle light inside you. You make people feel seen, heard, and cherished. I hope this new year brings you all the blessings you so generously pour out into the world. May your goals turn into triumphs, your dreams into reality, and your days be packed with peace and happiness.",
      "Never forget how truly special, talented, and deeply loved you are. I'll always be right here cheering for you in the front row, through every high, every low, and every ridiculous adventure ahead.",
      "Here is to another chapter of laughter, dreams, and memories that will last a lifetime."
    ],
    closing: "With all my Love",
    signature: "Your's Rohan 🤍"
  },

  // ------------------------------------------------------------------
  // 7. FUN COMPLIMENTS GENERATOR
  // ------------------------------------------------------------------
  compliments: [
    "Your laugh is literally the best soundtrack to any bad day! ✨",
    "You are the main character and everyone else is just background cast! 👑",
    "If friendships were traded on Wall Street, you'd be a multi-trillion dollar asset! 📈",
    "You have an elite sense of humor that is criminally underrated! 😂",
    "The world is undeniably 100x softer and sweeter because you exist in it. 🌸",
    "Your taste in music, aesthetics, and best friends is genuinely unmatched! 💅",
    "You give the warmest, most restorative hugs in the entire galaxy! 🫂",
    "You are capable of doing anything you put your mind to, and don't you forget it! 🚀",
    "Thank you for existing and being the brightest star in my circle! ⭐"
  ],

  // ------------------------------------------------------------------
  // 8. REASONS YOU'RE AMAZING (25 Curated Items)
  // ------------------------------------------------------------------
  reasonsList: [
    "You remember the tiniest details about things I mentioned weeks ago.",
    "Your outfit coordination is always effortlessly on point.",
    "You know exactly what drink order I need when I'm stressed.",
    "You never judge my questionable life choices, you just help me fix them.",
    "You're fiercely loyal and will defend your friends unconditionally.",
    "Your facial expressions when someone is talking nonsense are pure art.",
    "You have the most infectious energy when you're genuinely excited.",
    "You give the best, most practical advice without sugarcoating.",
    "You're always down for impromptu late-night food runs.",
    "You forgive quickly and love generously.",
    "You make even sitting in silent traffic feel comfortable and fun.",
    "You always send the funniest memes at the exact right moment.",
    "You're not afraid to be your authentic, goofy self.",
    "You celebrate my small wins like I just won the Nobel Prize.",
    "Your kindness to strangers and animals reveals your pure soul.",
    "You have an incredible superpower of reading my mood in 2 seconds.",
    "You never let me talk down about myself.",
    "You're resilient and brave, even when things are frightening.",
    "You keep every single secret locked away forever.",
    "You inspire me to be a kinder, more thoughtful human being.",
    "Your singing in the car is horribly off-pitch and utterly beautiful.",
    "You bring out the most playful, joyful side of my personality.",
    "You listen with your whole heart.",
    "You have an undeniable spark that makes people naturally love you.",
    "Because simply being your best friend is one of my greatest life blessings."
  ],

  // ------------------------------------------------------------------
  // 9. "OPEN WHEN..." ENVELOPES
  // ------------------------------------------------------------------
  openWhenNotes: [
    {
      id: "ow-1",
      title: "Open when you're having a bad day 🌧️",
      content: "Take a deep breath and drop your shoulders. Bad days are just 24-hour chapters, not the whole book. You have survived 100% of your worst days so far, and you're stronger than you think. Eat something sweet, drink warm tea, and call me immediately."
    },
    {
      id: "ow-2",
      title: "Open when you miss me 🫂",
      content: "I'm probably thinking about you or laughing at a meme I want to send you right this second! Distance or busy days don't change a single thing. You're permanently in my heart. Text me 'I need attention' right now and see how fast I reply!"
    },
    {
      id: "ow-3",
      title: "Open when you doubt yourself ⚡",
      content: "Stop that thought in its tracks! You are intelligent, capable, beautiful, and resilient. If you could see yourself through my eyes for just ten seconds, you'd never doubt yourself again for the rest of your life."
    },
    {
      id: "ow-4",
      title: "Open when you need a good laugh 😂",
      content: "Remember that time we were trying to act completely normal and mature in public, and one look sent us both into silent wheezing tears? Yeah. Never forget how completely ridiculous we are together."
    }
  ],

  // ------------------------------------------------------------------
  // 10. FUTURE WISHES
  // ------------------------------------------------------------------
  futureWishes: [
    { icon: "✈️", title: "More Adventures", desc: "Trips to dreamy coastal towns, mountain getaways, and stamping passports together." },
    { icon: "☕", title: "More Quiet Cafés", desc: "Long, unhurried chats with warm matcha lattes and zero sense of urgency." },
    { icon: "😂", title: "More Ridiculous Memories", desc: "Inside jokes that make zero sense to anyone else and stories we'll tell at 80." },
    { icon: "📸", title: "More Photo Dumps", desc: "Thousands of candid blurry pictures documenting every beautiful milestone." },
    { icon: "🎂", title: "More Birthdays", desc: "Decades of celebrating this exact day and watching you grow into even more magic." },
    { icon: "❤️", title: "More Reasons to Smile", desc: "Peace in your heart, joy in your mornings, and love surrounding you always." }
  ],

  // ------------------------------------------------------------------
  // 11. HIDDEN EASTER EGGS
  // ------------------------------------------------------------------
  easterEggs: [
    { id: "egg-1", message: "✨ Secret Found: You are officially the favorite human of the day!" },
    { id: "egg-2", message: "💖 Secret Found: Voucher for 1 free ice cream & emergency gossip session, redeemable anytime!" },
    { id: "egg-3", message: "🎂 Secret Found: A virtual birthday hug delivered straight to your heart!" }
  ],

  // ------------------------------------------------------------------
  // 12. FINAL SURPRISE / CLIMAX
  // ------------------------------------------------------------------
  finalSurprise: {
    title: "Happy Birthday, Beautiful Soul ❤️",
    message: "Thank you for being one of the most beautiful, constant, and unforgettable parts of my life.",
    subtext: "May this year return to you all the kindness, laughter, and light that you give to the world every single day.",
    replayPrompt: "Replay the Journey ↻",
    wishNote: "Make a wish... it already came true when I got you as a best friend."
  },

  // ------------------------------------------------------------------
  // 13. DEDICATED SPOTIFY SONG
  // ------------------------------------------------------------------
  dedicatedSong: {
    title: "Ishq Wala Love",
    artists: "Vishal-Shekhar, Shekhar Ravjiani, Salim Merchant, Neeti Mohan",
    spotifyUrl: "https://open.spotify.com/track/1hQia6rxgfM1ly2hE3StWp?si=0f1d97e4d0db4ac1",
    trackId: "1hQia6rxgfM1ly2hE3StWp",
    dedicationNote: "Because every unforgettable memory with you feels like poetry set to music. Dedicated to you with all my heart. 🎵💖",
    subtitle: "A special melody chosen just for you on your birthday"
  }
};
