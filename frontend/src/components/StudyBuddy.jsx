import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Send, HelpCircle, GraduationCap, Loader2 } from 'lucide-react';
import API_BASE_URL from '../config';

const CHARACTERS = [
  {
    id: 'hana',
    name: 'Hana',
    role: 'Anime Physics Scholar',
    description: 'Bubbly, enthusiastic, and obsessed with science! Will cheer you on with massive energy and star sparkles.',
    avatar: '🌸',
    color: 'hsl(var(--accent-purple))',
    glow: 'rgba(168, 85, 247, 0.3)',
    tag: 'Academic Cheerleader'
  },
  {
    id: 'cybercat',
    name: 'CyberCat',
    role: 'Neon Robo-Feline',
    description: 'Purrs in raw code and prints witty computer science jokes. Speaks in mechanical puns and code blocks.',
    avatar: '🐱',
    color: 'hsl(var(--accent-teal))',
    glow: 'rgba(6, 182, 212, 0.3)',
    tag: 'Code & Puns'
  },
  {
    id: 'zenmaster',
    name: 'ZenMaster',
    role: 'Meditative Sage Panda',
    description: 'A wise old panda who promotes quiet posture, deep breathing, tea-drinking, and anxiety-free study paths.',
    avatar: '🧘',
    color: '#10B981',
    glow: 'rgba(16, 185, 129, 0.3)',
    tag: 'Mindfulness Coach'
  },
  {
    id: 'rusty',
    name: 'Rusty',
    role: 'Clunky Retro Robot',
    description: 'An anxious but extremely loyal 1980s brass robot. Beeps, clanks, and spins his gears to keep you on track.',
    avatar: '🤖',
    color: 'hsl(var(--accent-pink))',
    glow: 'rgba(236, 72, 153, 0.3)',
    tag: 'Sweet Retro Buddy'
  }
];

const getStudyingThoughts = (charId, topic) => {
  if (charId === 'hana') {
    return `Formulating physics vectors for ${topic || 'study'}... E=mc² is so beautiful! 🌌🌸`;
  } else if (charId === 'cybercat') {
    return `Compiling ${topic || 'study'}_notes.bin... laser tracking activated! 🐾💻`;
  } else if (charId === 'zenmaster') {
    return `Deep breaths... absorbing the quiet forest wisdom of ${topic || 'study'}... 🎋🧘`;
  } else {
    return `*beep-whirrr* Indexing ${topic || 'study'} databases... gears spinning perfectly! ⚙️🤖`;
  }
};

const getRestingThoughts = (charId) => {
  if (charId === 'hana') {
    return `Ah, strawberry milk is so refreshing! Let's take a quick stretch! 🌸🍓`;
  } else if (charId === 'cybercat') {
    return `Executing sleep_mode.sh... purrrr. Neon dreams loading... 💤🐱`;
  } else if (charId === 'zenmaster') {
    return `Sipping a quiet cup of green tea... relax your shoulders, student. 🎋🍵`;
  } else {
    return `*bzzt* Coolant levels normal. Recharging retro capacitor... 🔋clank`;
  }
};

const renderAnimatedCharacter = (charId, isRunning) => {
  if (charId === 'hana') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g className="book-stack">
          <path d="M 25 180 L 155 180 L 150 192 L 20 192 Z" fill="#1E3A8A" stroke="#2563EB" strokeWidth="1.5"/>
          <path d="M 20 192 L 150 192 L 150 195 L 20 195 Z" fill="#ffffff" opacity="0.8"/>
          <path d="M 32 165 L 148 165 L 142 178 L 26 178 Z" fill="#B91C1C" stroke="#EF4444" strokeWidth="1.5"/>
          <path d="M 26 178 L 142 178 L 142 181 L 26 181 Z" fill="#ffffff" opacity="0.8"/>
          <path d="M 130 178 L 134 178 L 132 188 Z" fill="#F59E0B"/>
          <g transform="rotate(2 90 155)">
            <path d="M 38 150 L 142 150 L 138 163 L 34 163 Z" fill="#78350F" stroke="#92400E" strokeWidth="1.5"/>
            <path d="M 34 163 L 138 163 L 138 166 L 34 166 Z" fill="#ffffff" opacity="0.8"/>
          </g>
          <path d="M 40 137 L 140 137 L 135 149 L 35 149 Z" fill="#0F766E" stroke="#14B8A6" strokeWidth="1.5"/>
          <path d="M 35 149 L 135 149 L 135 152 L 35 152 Z" fill="#ffffff" opacity="0.8"/>
        </g>
        <g className="hana-body" style={{ animation: isRunning ? 'hana-bob 2.4s ease-in-out infinite' : 'none', transformOrigin: '90px 137px' }}>
          <rect x="65" y="127" width="50" height="12" rx="6" fill="#4B5563" />
          <ellipse cx="68" cy="138" rx="6" ry="4" fill="#E5E7EB" />
          <ellipse cx="112" cy="138" rx="6" ry="4" fill="#E5E7EB" />
          <path d="M 62 100 L 118 100 L 112 129 L 68 129 Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1"/>
          <path d="M 80 100 L 90 108 L 100 100 Z" fill="#ffffff"/>
          <path d="M 105 85 Q 120 100 115 118 Q 110 125 115 130" stroke="#FBBF24" strokeWidth="8" strokeLinecap="round" fill="none"/>
          <circle cx="115" cy="130" r="3" fill="#EC4899"/>
          <circle cx="90" cy="75" r="28" fill="#FDE047" opacity="0.15" />
          <circle cx="90" cy="76" r="24" fill="#FEE2E2" />
          <path d="M 64 72 C 60 48, 120 48, 116 72 Z" fill="#F59E0B" />
          <g className="eyes" style={{ animation: 'blink 4s infinite', transformOrigin: '90px 76px' }}>
            <circle cx="80" cy="74" r="5" fill="#1F2937" />
            <circle cx="78.5" cy="72.5" r="2" fill="#ffffff" />
            <circle cx="100" cy="74" r="5" fill="#1F2937" />
            <circle cx="98.5" cy="72.5" r="2" fill="#ffffff" />
          </g>
          <circle cx="73" cy="79" r="3" fill="#F43F5E" opacity="0.4" />
          <circle cx="107" cy="79" r="3" fill="#F43F5E" opacity="0.4" />
          <path d="M 87 81 Q 90 84 93 81" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          <rect x="71" y="66" width="18" height="15" rx="6" stroke="#3B82F6" strokeWidth="2" fill="rgba(6, 182, 212, 0.1)"/>
          <rect x="91" y="66" width="18" height="15" rx="6" stroke="#3B82F6" stroke-width="2" fill="rgba(6, 182, 212, 0.1)"/>
          <path d="M 89 71 L 91 71" stroke="#3B82F6" stroke-width="2"/>
          <path d="M 64 68 C 66 52, 114 52, 116 68 C 108 58, 72 58, 64 68 Z" fill="#FBBF24" />
          <path d="M 75 56 Q 90 44 105 56" fill="none" stroke="#F59E0B" strokeWidth="2"/>
          <g className="laptop">
            <path d="M 68 120 L 112 120 L 118 128 L 62 128 Z" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="1"/>
            <path d="M 64 128 L 116 128" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M 70 120 L 110 120 L 106 100 L 74 100 Z" fill="#1F2937" stroke="#9CA3AF" strokeWidth="1"/>
            <path d="M 72 118 L 108 118 L 104 102 L 76 102 Z" fill="url(#hana-screen-grad)" />
            <ellipse cx="90" cy="95" rx="25" ry="12" fill="url(#hana-screen-glow)" style={{ animation: 'screen-pulse 2s infinite' }} />
          </g>
          <circle cx="76" cy="119" r="3.5" fill="#FEE2E2" stroke="#FCA5A5" strokeWidth="1" style={{ animation: isRunning ? 'typing-left 0.25s infinite' : 'none', transformOrigin: '76px 119px' }}/>
          <circle cx="104" cy="119" r="3.5" fill="#FEE2E2" stroke="#FCA5A5" strokeWidth="1" style={{ animation: isRunning ? 'typing-right 0.25s infinite' : 'none', transformOrigin: '104px 119px' }}/>
        </g>
        <defs>
          <linearGradient id="hana-screen-grad" x1="90" y1="102" x2="90" y2="118" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
          <radialGradient id="hana-screen-glow" cx="90" cy="105" r="25" fx="90" fy="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C084FC" stopOpacity="0.35"/>
            <stop offset="100%" stopColor="#C084FC" stopOpacity="0"/>
          </radialGradient>
        </defs>
        {isRunning && (
          <g className="sparkles">
            <circle cx="45" cy="90" r="2" fill="#FDE047" style={{ animation: 'sparkle-float 1.8s infinite', animationDelay: '0s' }}/>
            <path d="M 135 85 L 137 89 L 141 89 L 138 92 L 139 96 L 135 94 L 131 96 L 132 92 L 129 89 L 133 89 Z" fill="#EC4899" transform="scale(0.8)" style={{ animation: 'sparkle-float 2.2s infinite', animationDelay: '0.4s', transformOrigin: '135px 85px' }}/>
            <circle cx="145" cy="110" r="1.5" fill="#22D3EE" style={{ animation: 'sparkle-float 2.5s infinite', animationDelay: '0.8s' }}/>
          </g>
        )}
      </svg>
    );
  }
  if (charId === 'cybercat') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g className="cyber-books">
          <path d="M 25 180 L 155 180 L 150 192 L 20 192 Z" fill="#1E1B4B" stroke="#A855F7" strokeWidth="1.5"/>
          <rect x="35" y="184" width="100" height="3" fill="#06B6D4" opacity="0.6"/>
          <path d="M 32 165 L 148 165 L 142 178 L 26 178 Z" fill="#0F172A" stroke="#EC4899" strokeWidth="1.5"/>
          <rect x="42" y="169" width="85" height="3" fill="#EC4899" opacity="0.6"/>
          <path d="M 40 148 L 140 148 L 135 160 L 35 160 Z" fill="#022C22" stroke="#10B981" strokeWidth="1.5"/>
        </g>
        <g className="cybercat-body" style={{ animation: isRunning ? 'hana-bob 2.0s ease-in-out infinite' : 'none', transformOrigin: '90px 148px' }}>
          <path d="M 58 135 C 40 135, 30 115, 35 95 C 37 90, 42 90, 40 95 C 37 110, 45 125, 58 125" fill="none" stroke="#A855F7" strokeWidth="6" strokeLinecap="round" style={{ animation: isRunning ? 'tail-wag 1.5s ease-in-out infinite' : 'none', transformOrigin: '58px 125px' }}/>
          <ellipse cx="90" cy="120" rx="30" ry="24" fill="#312E81" stroke="#6366F1" strokeWidth="1.5"/>
          <circle cx="90" cy="122" r="5" fill="#06B6D4" style={{ animation: 'screen-pulse 1.5s infinite' }}/>
          <ellipse cx="90" cy="88" rx="26" ry="22" fill="#312E81" stroke="#6366F1" strokeWidth="1.5"/>
          <path d="M 68 76 L 55 50 L 78 68 Z" fill="#312E81" stroke="#6366F1" strokeWidth="1.5"/>
          <path d="M 70 72 L 62 55 L 75 66 Z" fill="#EC4899"/>
          <path d="M 112 76 L 125 50 L 102 68 Z" fill="#312E81" stroke="#6366F1" strokeWidth="1.5"/>
          <path d="M 110 72 L 118 55 L 105 66 Z" fill="#EC4899"/>
          <rect x="70" y="76" width="40" height="15" rx="6" fill="#030712" stroke="#06B6D4" strokeWidth="2"/>
          <line x1="72" y1="83" x2="108" y2="83" stroke="#22D3EE" strokeWidth="2" style={{ animation: 'screen-pulse 0.8s infinite' }}/>
          <path d="M 62 90 L 52 88 M 62 94 L 50 94" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M 118 90 L 128 88 M 118 94 L 130 94" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round"/>
          <g className="holo-laptop">
            <path d="M 72 124 L 108 124 L 114 132 L 66 132 Z" fill="rgba(6, 182, 212, 0.15)" stroke="#06B6D4" strokeWidth="1.5"/>
            <line x1="74" y1="128" x2="106" y2="128" stroke="#22D3EE" strokedasharray="2 2" strokeWidth="1"/>
            <path d="M 74 124 L 106 124 L 102 108 L 78 108 Z" fill="rgba(168, 85, 247, 0.2)" stroke="#A855F7" strokeWidth="1.5"/>
            <circle cx="90" cy="116" r="3" fill="#EC4899" opacity="0.8"/>
          </g>
          <circle cx="76" cy="123" r="3.5" fill="#06B6D4" stroke="#22D3EE" strokeWidth="1" style={{ animation: isRunning ? 'typing-left 0.2s infinite' : 'none', transformOrigin: '76px 123px' }}/>
          <circle cx="104" cy="123" r="3.5" fill="#06B6D4" stroke="#22D3EE" strokeWidth="1" style={{ animation: isRunning ? 'typing-right 0.2s infinite' : 'none', transformOrigin: '104px 123px' }}/>
        </g>
        {isRunning && (
          <g className="matrix-bits">
            <text x="35" y="100" fill="#06B6D4" fontSize="8" fontFamily="monospace" opacity="0.7" style={{ animation: 'sparkle-float 2s infinite' }}>01</text>
            <text x="145" y="90" fill="#A855F7" fontSize="8" fontFamily="monospace" opacity="0.7" style={{ animation: 'sparkle-float 2.5s infinite', animationDelay: '0.5s' }}>10</text>
            <circle cx="45" cy="70" r="1.5" fill="#EC4899" style={{ animation: 'sparkle-float 1.8s infinite', animationDelay: '0.2s' }}/>
          </g>
        )}
      </svg>
    );
  }
  if (charId === 'zenmaster') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g className="zen-books">
          <path d="M 25 180 L 155 180 L 150 192 L 20 192 Z" fill="#064E3B" stroke="#047857" strokeWidth="1.5"/>
          <path d="M 20 192 L 150 192 L 150 195 L 20 195 Z" fill="#f8fafc" opacity="0.8"/>
          <path d="M 30 165 L 150 165 L 144 178 L 24 178 Z" fill="#78350F" stroke="#92400E" strokeWidth="1.5"/>
          <path d="M 24 178 L 144 178 L 144 181 L 24 181 Z" fill="#f8fafc" opacity="0.8"/>
          <path d="M 45 178 L 48 178 L 47 186 Z" fill="#047857"/>
        </g>
        <g className="tea-cup" transform="translate(142, 155)">
          <ellipse cx="12" cy="14" rx="10" ry="2" fill="#94A3B8"/>
          <path d="M 4 4 L 20 4 L 18 12 C 18 14, 6 14, 6 12 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1"/>
          <path d="M 20 6 Q 23 8 20 10" stroke="#CBD5E1" strokeWidth="1" fill="none"/>
          <ellipse cx="12" cy="4" rx="6" ry="1.5" fill="#10B981" opacity="0.7"/>
          {isRunning && (
            <>
              <path d="M 10 -2 Q 8 -8 12 -12 T 10 -20" stroke="#E2E8F0" strokeWidth="1.2" strokeLinecap="round" fill="none" style={{ animation: 'steam-rise 2s infinite', transformOrigin: '12px -2px' }}/>
              <path d="M 14 -2 Q 16 -7 12 -10 T 14 -18" stroke="#E2E8F0" strokeWidth="1.2" strokeLinecap="round" fill="none" style={{ animation: 'steam-rise 2s infinite', animationDelay: '0.7s', transformOrigin: '12px -2px' }}/>
            </>
          )}
        </g>
        <g className="panda-body" style={{ animation: isRunning ? 'hana-bob 4s ease-in-out infinite' : 'none', transformOrigin: '90px 165px' }}>
          <ellipse cx="90" cy="158" rx="42" ry="12" fill="#1F2937" stroke="#111827" strokeWidth="1.5"/>
          <ellipse cx="90" cy="132" rx="34" ry="26" fill="#065F46" stroke="#047857" strokeWidth="1.5"/>
          <path d="M 90 106 L 90 142" stroke="#047857" strokeWidth="2"/>
          <path d="M 80 106 L 90 120 L 100 106" stroke="#D1D5DB" strokeWidth="2" fill="none"/>
          <ellipse cx="90" cy="92" rx="28" ry="24" fill="#ffffff" stroke="#E2E8F0" strokeWidth="1.5"/>
          <circle cx="68" cy="74" r="8" fill="#1F2937" stroke="#111827" strokeWidth="1.5"/>
          <circle cx="112" cy="74" r="8" fill="#1F2937" stroke="#111827" strokeWidth="1.5"/>
          <ellipse cx="78" cy="92" rx="7" ry="9" fill="#1F2937" transform="rotate(-15 78 92)"/>
          <circle cx="79" cy="92" r="2.5" fill="#ffffff" style={{ animation: 'blink 5s infinite', transformOrigin: '79px 92px' }}/>
          <ellipse cx="102" cy="92" rx="7" ry="9" fill="#1F2937" transform="rotate(15 102 92)"/>
          <circle cx="101" cy="92" r="2.5" fill="#ffffff" style={{ animation: 'blink 5s infinite', transformOrigin: '101px 92px' }}/>
          <ellipse cx="90" cy="98" rx="6" ry="4" fill="#F3F4F6"/>
          <polygon points="88 97, 92 97, 90 99" fill="#111827"/>
          <path d="M 88 101 Q 90 103 92 101" stroke="#111827" strokeWidth="1.2" fill="none"/>
          <circle cx="78" cy="92" r="9" stroke="#F59E0B" strokeWidth="1.5" fill="none"/>
          <circle cx="102" cy="92" r="9" stroke="#F59E0B" strokeWidth="1.5" fill="none"/>
          <line x1="87" y1="92" x2="93" y2="92" stroke="#F59E0B" strokeWidth="1.5"/>
          <g className="bamboo-laptop">
            <rect x="65" y="142" width="50" height="4" rx="2" fill="#F59E0B" stroke="#D97706" strokeWidth="1"/>
            <path d="M 68 138 L 112 138 L 116 142 L 64 142 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1"/>
            <path d="M 72 138 L 108 138 L 104 124 L 76 124 Z" fill="#1F2937" stroke="#94A3B8" strokeWidth="1"/>
            <path d="M 74 136 L 106 136 L 102 126 L 78 126 Z" fill="#064E3B" />
            <circle cx="90" cy="131" r="2" fill="#10B981" />
          </g>
          <circle cx="74" cy="140" r="4.5" fill="#1F2937"/>
          <circle cx="106" cy="140" r="4.5" fill="#1F2937"/>
        </g>
        {isRunning && (
          <g className="falling-leaves">
            <path d="M 40 40 Q 30 50 35 55 T 45 60" fill="#10B981" style={{ animation: 'leaf-fall 3.5s infinite', transformOrigin: '40px 40px' }}/>
            <path d="M 130 30 Q 140 45 135 50 T 125 58" fill="#10B981" style={{ animation: 'leaf-fall 4s infinite', animationDelay: '1.5s', transformOrigin: '130px 30px' }}/>
          </g>
        )}
      </svg>
    );
  }
  return (
    <svg width="100%" height="100%" viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g className="metal-books">
        <path d="M 25 180 L 155 180 L 150 192 L 20 192 Z" fill="#374151" stroke="#4B5563" strokeWidth="1.5"/>
        <circle cx="35" cy="186" r="1.5" fill="#9CA3AF"/>
        <circle cx="140" cy="186" r="1.5" fill="#9CA3AF"/>
        <path d="M 30 165 L 150 165 L 144 178 L 24 178 Z" fill="#7C2D12" stroke="#9A3412" strokeWidth="1.5"/>
        <circle cx="40" cy="171" r="1" fill="#EA580C"/>
      </g>
      <g className="gear-decor" transform="translate(142, 160)">
        <circle cx="10" cy="10" r="8" fill="none" stroke="#D97706" strokeWidth="3" strokeDasharray="4 2" style={{ animation: isRunning ? 'gear-rotate 4s linear infinite' : 'none', transformOrigin: '10px 10px' }}/>
        <circle cx="10" cy="10" r="3" fill="#D97706"/>
      </g>
      <g className="rusty-body" style={{ animation: isRunning ? 'hana-bob 1.8s ease-in-out infinite' : 'none', transformOrigin: '90px 165px' }}>
        <rect x="64" y="112" width="52" height="38" rx="6" fill="#B45309" stroke="#92400E" strokeWidth="1.5"/>
        <rect x="74" y="118" width="32" height="15" rx="3" fill="#1F2937" stroke="#F59E0B" strokeWidth="1"/>
        <line x1="90" y1="130" x2="84" y2="122" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" style={{ animation: isRunning ? 'typing-left 0.15s infinite' : 'none', transformOrigin: '90px 130px' }}/>
        <circle cx="90" cy="130" r="2" fill="#EF4444"/>
        <rect x="84" y="105" width="12" height="8" fill="#4B5563" stroke="#374151" strokeWidth="1"/>
        <rect x="68" y="70" width="44" height="36" rx="8" fill="#D97706" stroke="#B45309" strokeWidth="1.5"/>
        <line x1="90" y1="70" x2="90" y2="58" stroke="#4B5563" strokeWidth="2"/>
        <circle cx="90" cy="54" r="4" fill="#EF4444" style={{ animation: isRunning ? 'antenna-blink 1s infinite' : 'none' }}/>
        <circle cx="80" cy="86" r="6" fill="#FDE047" stroke="#CA8A04" strokeWidth="1"/>
        <circle cx="80" cy="86" r="2" fill="#ffffff"/>
        <circle cx="100" cy="86" r="6" fill="#FDE047" stroke="#CA8A04" strokeWidth="1"/>
        <circle cx="100" cy="86" r="2" fill="#ffffff"/>
        <line x1="82" y1="98" x2="98" y2="98" stroke="#F59E0B" strokeWidth="2" strokeDasharray="2 1"/>
        <g className="retro-laptop">
          <path d="M 68 142 L 112 142 L 116 148 L 64 148 Z" fill="#4B5563" stroke="#374151" strokeWidth="1"/>
          <path d="M 70 142 L 110 142 L 106 128 L 74 128 Z" fill="#1F2937" stroke="#374151" strokeWidth="1"/>
          <path d="M 72 140 L 108 140 L 104 130 L 76 130 Z" fill="#FDE047" opacity="0.3"/>
          <line x1="78" y1="133" x2="102" y2="133" stroke="#F59E0B" strokeWidth="1"/>
          <line x1="78" y1="136" x2="94" y2="136" stroke="#F59E0B" strokeWidth="1"/>
        </g>
        <g className="arms">
          <path d="M 64 122 L 54 132 L 72 143" stroke="#B45309" strokeWidth="4" strokeLinecap="round" fill="none" style={{ animation: isRunning ? 'typing-left 0.18s infinite' : 'none', transformOrigin: '64px 122px' }}/>
          <path d="M 116 122 L 126 132 L 108 143" stroke="#B45309" strokeWidth="4" strokeLinecap="round" fill="none" style={{ animation: isRunning ? 'typing-right 0.18s infinite' : 'none', transformOrigin: '116px 122px' }}/>
        </g>
      </g>
    </svg>
  );
};

export default function StudyBuddy({ settings, activeDoc }) {
  // Visual Companion Study States
  const [buddyStamina, setBuddyStamina] = useState(85);
  const [buddyReaction, setBuddyReaction] = useState('');
  const [pokeCount, setPokeCount] = useState(0);

  // Timer State
  const [preset, setPreset] = useState(25); // minutes
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('45');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timeUpMessage, setTimeUpMessage] = useState('');
  const [studyTopic, setStudyTopic] = useState('Machine Learning & AI');

  // Character Selection State
  const [selectedChar, setSelectedChar] = useState(CHARACTERS[0]);
  const [chatHistory, setChatHistory] = useState([
    { role: 'system', content: 'Greeting initialized.' },
    { role: 'ai', content: "Hana here! ✨ Ready to dive into physics, equations, or whatever you are studying today? Let's power through this study session together! You've got this! 🌸🚀" }
  ]);
  const [message, setMessage] = useState('');
  const [loadingReply, setLoadingReply] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('chat');

  // Quiz Modal State
  const [quizActive, setQuizActive] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [quizQuestion, setQuizQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);

  const timerRef = useRef(null);
  const chatEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loadingReply]);

  // Synchronize companion greetings upon change
  const handleSelectChar = (char) => {
    setSelectedChar(char);
    let greeting = "";
    if (char.id === 'hana') greeting = "Hana here! ✨ Ready to dive into physics, equations, or whatever you are studying today? Let's power through this study session together! You've got this! 🌸🚀";
    else if (char.id === 'cybercat') greeting = "CyberCat.exe successfully compiled! 🐾 System loaded, lasers online, terminal purrs: READY! Let's hack some knowledge, Admin. Code is poetry, study is hacking! 💻🐱";
    else if (char.id === 'zenmaster') greeting = "Greetings, friend. 🎋 Sit straight, relax your shoulders, and take a deep, slow breath. Focus is a silent forest, and we shall tread it together. Tea is poured. Let us begin. 🧘🍵";
    else if (char.id === 'rusty') greeting = "*beep-whirrr* CLANK! Rusty is online! 🤖 Gears are fully oiled, batteries charged to 100% capacity! I am ready to study next to you. Let's do a great job... I don't want to let you down! *bzzt* ⚙️";
    
    setChatHistory([
      { role: 'system', content: 'System updated' },
      { role: 'ai', content: greeting }
    ]);
  };

  const playAlert = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4 note
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      
      osc.start();
      setTimeout(() => {
        osc.stop();
        ctx.close();
      }, 1200);
    } catch (e) {
      console.warn("Audio context not allowed by browser permissions until user interaction.", e);
    }
  }, [soundEnabled]);

  function notifyUser(title, body) {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      new Notification(title, { body });
    } else if (Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(title, { body });
        }
      });
    }
  }

  const triggerSessionEndCompanionChat = useCallback(async () => {
    const activeKey = settings.provider === 'openai' ? settings.openaiKey : settings.geminiKey;
    try {
      const res = await fetch('http://localhost:8000/api/buddy/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': activeKey || '',
          'X-Provider': settings.provider
        },
        body: JSON.stringify({
          message: "TIMER FINISHED! We did it! Praise the student and congratulate them on a successful study session!",
          character: selectedChar.id,
          timer_remaining: "00:00 (TIMER COMPLETE)",
          study_topic: studyTopic,
          chat_history: chatHistory.filter(m => m.role !== 'system')
        })
      });
      if (res.ok) {
        const data = await res.json();
        setChatHistory(prev => [...prev, { role: 'ai', content: data.reply }]);
      }
    } catch (err) {
      console.error(err);
    }
  }, [settings.provider, settings.openaiKey, settings.geminiKey, selectedChar.id, studyTopic, chatHistory]);

  // Timer interval countdown hook
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            setTimeUpMessage(`⏰ Time's up! Great job completing your ${preset}-minute study session.`);
            playAlert();
            notifyUser('Study session complete', `Your ${preset}-minute focus time is finished.`);
            triggerSessionEndCompanionChat();
            return 0;
          }
          // Gamified stamina decline: decrease stamina by 1 every 60 seconds of focus
          if (prev % 60 === 0) {
            setBuddyStamina(st => Math.max(15, st - 1));
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, preset, playAlert, triggerSessionEndCompanionChat]);

  const handleStartPause = () => {
    if (!isRunning && Notification && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    setTimeUpMessage('');
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(preset * 60);
    setTimeUpMessage('');
  };

  const selectPreset = (minutes) => {
    setIsRunning(false);
    setPreset(minutes);
    setSecondsLeft(minutes * 60);
    setTimeUpMessage('');
  };

  const handleCustomTimeSubmit = (e) => {
    e.preventDefault();
    const mins = parseInt(customMinutes);
    if (!isNaN(mins) && mins > 0 && mins <= 180) {
      selectPreset(mins);
    }
  };

  // Format timer text (e.g. 25:00)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // SVG Circular math properties
  const totalSeconds = preset * 60;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (secondsLeft / totalSeconds) * circumference;

  // Send interactive message to study buddy
  const handleSendBuddyMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || loadingReply) return;

    const userMsg = { role: 'user', content: message };
    setChatHistory(prev => [...prev, userMsg]);
    setMessage('');
    setLoadingReply(true);

    const activeKey = settings.provider === 'openai' ? settings.openaiKey : settings.geminiKey;

    try {
      const res = await fetch('http://localhost:8000/api/buddy/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': activeKey || '',
          'X-Provider': settings.provider
        },
        body: JSON.stringify({
          message: userMsg.content,
          character: selectedChar.id,
          timer_remaining: formatTime(secondsLeft),
          study_topic: studyTopic,
          chat_history: chatHistory.filter(m => m.role !== 'system')
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to chat with buddy');
      }

      const data = await res.json();
      setChatHistory(prev => [...prev, { role: 'ai', content: data.reply }]);
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, {
        role: 'ai',
        content: `*beep-boop* Technical glitch! ⚠️ Error speaking with ${selectedChar.name}. Make sure your API Key is set in Settings!`
      }]);
    } finally {
      setLoadingReply(false);
    }
  };

  // Quiz generation via RAG pipeline
  const handleTriggerQuiz = async () => {
    if (!activeDoc) return;
    setQuizActive(true);
    setLoadingQuiz(true);
    setSelectedAnswer(null);
    setAnswered(false);

    const activeKey = settings.provider === 'openai' ? settings.openaiKey : settings.geminiKey;

    try {
      const res = await fetch(`${API_BASE_URL}/api/buddy/quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': activeKey || '',
          'X-Provider': settings.provider
        },
        body: JSON.stringify({
          doc_id: activeDoc,
          character: selectedChar.id
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to generate quiz');
      }

      const data = await res.json();
      setQuizQuestion(data);
    } catch (err) {
      console.error(err);
      alert(`Could not fetch quiz: ${err.message}. Make sure API keys are fully verified!`);
      setQuizActive(false);
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleSelectAnswer = (optionIndex) => {
    if (answered) return;
    const optionLetter = ['A', 'B', 'C', 'D'][optionIndex];
    setSelectedAnswer(optionLetter);
    setAnswered(true);

    // Append quiz result to companion chat log in character
    const isCorrect = optionLetter === quizQuestion.answer;
    const feedback = isCorrect 
      ? `🎉 **CORRECT!** You answered **${optionLetter}**! ${quizQuestion.explanation}`
      : `❌ **OOPS!** You picked **${optionLetter}**, but the correct answer was **${quizQuestion.answer}**. ${quizQuestion.explanation}`;
    
    setChatHistory(prev => [...prev, {
      role: 'system',
      content: 'Quiz completed'
    }, {
      role: 'ai',
      content: feedback
    }]);
  };

  const handlePokeBuddy = () => {
    setPokeCount(prev => prev + 1);
    let rx;
    if (selectedChar.id === 'hana') {
      const responses = [
        "Kyaa! That tickles! Hehe, what's up? 🌸✨",
        "Hehe! Hana is fully awake and physics-ready! 🚀✨",
        "Poking active vectors? Let's double our focus! 💪🌸"
      ];
      rx = responses[pokeCount % responses.length];
    } else if (selectedChar.id === 'cybercat') {
      const responses = [
        "Meow! Poke command executed. 🐾",
        "System warning: User is touching neon cat sensors! 🐱⚡",
        "purrr.exe activated. Compile focus now! 💻🐱"
      ];
      rx = responses[pokeCount % responses.length];
    } else if (selectedChar.id === 'zenmaster') {
      const responses = [
        "Ah... gentle touch, my friend. Breathe in deeply... 🧘🎋",
        "Bamboo shoots grow tall with gentle care. Sip some tea. 🍵🎋",
        "Stillness inside, silence outside. We are focusing well. ⛰️"
      ];
      rx = responses[pokeCount % responses.length];
    } else {
      const responses = [
        "*beep-whirrr* Clank! Rusty detected touch input! 🤖⚙️",
        "My sensors are spinning with joy! Thanks for checking! 🔧🤖",
        "*bzzt* Capacitors fully charged by friendly poke! 🔋clank"
      ];
      rx = responses[pokeCount % responses.length];
    }
    setBuddyReaction(rx);
    setTimeout(() => setBuddyReaction(''), 4000);
  };

  const handleFeedBuddy = () => {
    setBuddyStamina(prev => Math.min(100, prev + 15));
    let rx;
    if (selectedChar.id === 'hana') {
      rx = "Yay! Strawberry milk! Focus vectors increased by 15%! 🍓🌸";
    } else if (selectedChar.id === 'cybercat') {
      rx = "Energy core charged to full capacity! Performance boosted! 🔋⚡";
    } else if (selectedChar.id === 'zenmaster') {
      rx = "Sipping hot matcha tea... Refreshing the spirit. Focus flows. 🍵🎋";
    } else {
      rx = "*beep-boop* Gears freshly oiled! Friction reduced to 0%! 🔧🤖";
    }
    setBuddyReaction(rx);
    setTimeout(() => setBuddyReaction(''), 4000);
  };


  return (
    <div className={`studybuddy-layout show-${activeSubTab}`}>
      <style>{`
        @keyframes hana-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes typing-left {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes typing-right {
          0%, 100% { transform: translateY(-3px); }
          50% { transform: translateY(0); }
        }
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        @keyframes screen-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        @keyframes tail-wag {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }
        @keyframes antenna-blink {
          0%, 100% { fill: #ef4444; filter: drop-shadow(0 0 2px #ef4444); }
          50% { fill: #fecaca; filter: drop-shadow(0 0 8px #ef4444); }
        }
        @keyframes gear-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes steam-rise {
          0% { transform: translateY(0) scaleX(1); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(-15px) scaleX(1.3); opacity: 0; }
        }
        @keyframes leaf-fall {
          0% { transform: translate(0, -10px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.7; }
          100% { transform: translate(-30px, 80px) rotate(180deg); opacity: 0; }
        }
        @keyframes sparkle-float {
          0% { transform: translate(0, 0) scale(0); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translate(15px, -30px) scale(1); opacity: 0; }
        }
      `}</style>

      {/* Mobile Sub-Navigation */}
      <div className="studybuddy-mobile-subnav">
        <button 
          onClick={() => setActiveSubTab('setup')} 
          className={`studybuddy-subnav-btn${activeSubTab === 'setup' ? ' active' : ''}`}
        >
          ⏱️ Setup & Timer
        </button>
        <button 
          onClick={() => setActiveSubTab('chat')} 
          className={`studybuddy-subnav-btn${activeSubTab === 'chat' ? ' active' : ''}`}
        >
          💬 Buddy Chat
        </button>
      </div>
      
      {/* Left Pane - Animated SVG Timer & Selector */}
      <div className="studybuddy-sidebar">
        <div style={{ width: '100%' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '4px' }}>Study Buddy Timer</h2>
          <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-tertiary))' }}>Set your Pomodoro clock and pick a companion.</p>
        </div>

        {/* Circular SVG Timer Card */}
        <div className="glass-panel" style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '1.5rem 1rem',
          position: 'relative'
        }}>
          {/* Audio toggle */}
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Side-by-side Row Layout for Timer & Character */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            gap: '8px',
            marginBottom: '1rem'
          }}>
            {/* SVG Animated Circle */}
            <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyItems: 'center', flexShrink: 0 }}>
              <svg style={{ transform: 'rotate(-90deg)', width: '200px', height: '200px' }}>
                {/* Background ring */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Pulsing neon depletion ring */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke={selectedChar.color}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{
                    transition: isRunning ? 'stroke-dashoffset 1s linear' : 'stroke-dashoffset 0.3s ease',
                    filter: `drop-shadow(0 0 6px ${selectedChar.color})`
                  }}
                />
              </svg>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '2.2rem', fontWeight: '800', fontFamily: 'var(--font-header)', letterSpacing: '-0.02em', textShadow: `0 0 10px ${selectedChar.color}60` }}>
                  {formatTime(secondsLeft)}
                </span>
                <span className="badge badge-gray" style={{ fontSize: '0.6rem', marginTop: '4px', padding: '2px 6px' }}>
                  {isRunning ? 'FOCUS SESSION' : 'PAUSED'}
                </span>
              </div>
            </div>

            {/* Visual Character Render Area */}
            <div style={{
              width: '170px',
              height: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              background: 'rgba(255, 255, 255, 0.01)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.03)',
              overflow: 'hidden'
            }}>
              {renderAnimatedCharacter(selectedChar.id, isRunning)}
            </div>
          </div>

          {/* Core Controls */}
          <div style={{ display: 'flex', gap: '1rem', width: '100%', padding: '0 0.5rem' }}>
            <button 
              onClick={handleStartPause}
              className="btn-primary" 
              style={{
                flex: 1,
                background: isRunning ? 'rgba(255, 255, 255, 0.05)' : `linear-gradient(135deg, ${selectedChar.color}, #EE46B5)`,
                border: isRunning ? '1px solid rgba(255,255,255,0.1)' : 'none',
                boxShadow: isRunning ? 'none' : `0 4px 15px ${selectedChar.color}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isRunning ? <Pause size={16} /> : <Play size={16} />}
              {isRunning ? 'Pause Focus' : 'Start Focus'}
            </button>
            
            <button 
              onClick={handleReset}
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <RotateCcw size={16} />
            </button>
          </div>

          {/* Quick-Preset Selectors */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', width: '100%', marginTop: '1.2rem' }}>
            <button 
              onClick={() => selectPreset(25)}
              className="badge"
              style={{
                cursor: 'pointer',
                background: preset === 25 ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: '1px solid rgba(255,255,255,0.08)',
                justifyContent: 'center'
              }}
            >
              25m Focus
            </button>
            <button 
              onClick={() => selectPreset(45)}
              className="badge"
              style={{
                cursor: 'pointer',
                background: preset === 45 ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: '1px solid rgba(255,255,255,0.08)',
                justifyContent: 'center'
              }}
            >
              45m Focus
            </button>
            <button 
              onClick={() => selectPreset(5)}
              className="badge"
              style={{
                cursor: 'pointer',
                background: preset === 5 ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: '1px solid rgba(255,255,255,0.08)',
                justifyContent: 'center',
                color: 'hsl(var(--accent-teal))'
              }}
            >
              5m Break
            </button>
          </div>

          {/* Custom Duration Setter */}
          <form onSubmit={handleCustomTimeSubmit} style={{ width: '100%', marginTop: '1rem', display: 'grid', gap: '8px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'hsl(var(--text-tertiary))' }}>Custom duration</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
              <input
                type="number"
                min="1"
                max="180"
                className="form-input"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                placeholder="Minutes (1-180)"
                style={{ width: '100%' }}
              />
              <button type="submit" className="btn-secondary" style={{ minWidth: '88px' }}>Set</button>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'hsl(var(--text-tertiary))' }}>Use your own study duration and hit Set. Timer will reset automatically.</p>
          </form>

          {timeUpMessage && (
            <div style={{ marginTop: '1rem', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#A5F3FC', fontSize: '0.85rem' }}>
              {timeUpMessage}
            </div>
          )}
        </div>

        {/* Study Subject Config */}
        <div style={{ width: '100%' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'hsl(var(--text-tertiary))', marginBottom: '8px' }}>Active Study Topic</label>
          <input
            type="text"
            className="form-input"
            value={studyTopic}
            onChange={(e) => setStudyTopic(e.target.value)}
            placeholder="e.g. Computer Architecture, Physics 101"
          />
        </div>

        {/* Character Card Picker */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'hsl(var(--text-tertiary))', marginBottom: '4px' }}>Choose Companion</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {CHARACTERS.map((char) => (
              <div
                key={char.id}
                onClick={() => handleSelectChar(char)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  background: selectedChar.id === char.id ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
                  border: selectedChar.id === char.id ? `1px solid ${char.color}` : '1px solid rgba(255, 255, 255, 0.05)',
                  cursor: 'pointer',
                  boxShadow: selectedChar.id === char.id ? `0 0 15px ${char.glow}` : 'none',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <span style={{ fontSize: '2rem' }}>{char.avatar}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{char.name}</span>
                    <span className="badge" style={{ fontSize: '0.6rem', padding: '2px 6px', background: 'rgba(255,255,255,0.05)', color: char.color }}>{char.tag}</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{char.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right Pane - Chat Window with Companion & Quiz Me Trigger */}
      <div className="studybuddy-main">
        {/* Companion Chat Header Panel */}
        <div style={{
          padding: '1.2rem 2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(11,11,15,0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '2rem' }} className="animate-float">{selectedChar.avatar}</span>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: '700' }}>Study Buddy: {selectedChar.name}</h2>
              <p style={{ fontSize: '0.75rem', color: selectedChar.color }}>{selectedChar.role}</p>
            </div>
          </div>

          {/* Connect RAG "Quiz Me" Trigger */}
          {activeDoc ? (
            <button
              onClick={handleTriggerQuiz}
              className="btn-primary animate-float"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                fontSize: '0.85rem',
                background: `linear-gradient(135deg, ${selectedChar.color}, #10B981)`,
                boxShadow: `0 4px 10px ${selectedChar.color}30`
              }}
            >
              <GraduationCap size={16} />
              Quiz Me on Notes!
            </button>
          ) : (
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-tertiary))', fontStyle: 'italic' }}>
              Upload a document to unlock RAG Quizzes
            </span>
          )}
        </div>


        {/* Visual Companion Study Panel */}
        <div className="glass-panel" style={{
          margin: '1.2rem 2rem 0 2rem',
          padding: '1rem 1.5rem',
          background: 'rgba(255, 255, 255, 0.02)',
          border: `1px solid ${selectedChar.color}25`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Left: Levitating avatar book stack stage & thought bubble */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            
            {/* Dynamic React CSS Book Stack Stage */}
            {(() => {
              // Calculate focus progress
              const total = preset * 60;
              const progress = (total - secondsLeft) / total;
              
              let numBooks = 1;
              if (secondsLeft === 0) numBooks = 5;
              else if (progress > 0.75) numBooks = 4;
              else if (progress > 0.5) numBooks = 3;
              else if (progress > 0.25) numBooks = 2;

              return (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column-reverse',
                  alignItems: 'center',
                  width: '90px',
                  minHeight: '100px',
                  justifyContent: 'flex-start',
                  position: 'relative',
                  paddingBottom: '6px'
                }}>
                  
                  {/* Tapered Book Stack Layout */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    alignItems: 'center',
                    gap: '2px',
                    width: '100%',
                    zIndex: 10
                  }}>
                    {Array.from({ length: numBooks }).map((_, bIdx) => {
                      const bookColors = [
                        '#1E3A8A', // 1st Book: Royal Blue (Bottom)
                        '#B91C1C', // 2nd Book: Crimson Red
                        '#78350F', // 3rd Book: Leather Brown
                        '#0F766E', // 4th Book: Pine Teal
                        '#D97706'  // 5th Book: Glowing Golden (Victory textbook!)
                      ];
                      const bookWidths = [84, 78, 72, 66, 60]; // Tapered look
                      
                      return (
                        <div 
                          key={bIdx}
                          style={{
                            width: `${bookWidths[bIdx]}px`,
                            height: '11px',
                            background: bookColors[bIdx],
                            borderRadius: '3px',
                            border: '1px solid rgba(255,255,255,0.12)',
                            position: 'relative',
                            boxShadow: bIdx === 4 ? '0 0 12px rgba(245,158,11,0.7)' : '0 2px 4px rgba(0,0,0,0.3)',
                            animation: 'messagePop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {/* Pages edge layer */}
                          <div style={{
                            position: 'absolute',
                            left: '3px',
                            right: '3px',
                            bottom: '1.5px',
                            height: '2px',
                            background: 'rgba(255, 255, 255, 0.35)',
                            borderRadius: '1px'
                          }} />
                          {/* Cute spine-bookmark ribbon on the red book */}
                          {bIdx === 1 && (
                            <div style={{
                              position: 'absolute',
                              right: '10px',
                              top: '9px',
                              width: '5px',
                              height: '9px',
                              background: '#F59E0B',
                              borderRadius: '1px',
                              zIndex: 15
                            }} />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Character levitating on top of books */}
                  <div style={{
                    fontSize: '2.2rem',
                    marginBottom: '3px',
                    animation: isRunning ? 'float 2s ease-in-out infinite' : 'none',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 20,
                    transition: 'all 0.3s ease'
                  }}>
                    {selectedChar.avatar}
                    
                    {/* Crown for study completion */}
                    {numBooks === 5 && (
                      <span style={{
                        position: 'absolute',
                        top: '-18px',
                        fontSize: '1.1rem',
                        animation: 'float 1s ease-in-out infinite'
                      }}>👑</span>
                    )}
                    
                    {/* Tiny active study bubbles */}
                    {isRunning && (
                      <span style={{
                        position: 'absolute',
                        right: '-10px',
                        top: '-5px',
                        fontSize: '0.85rem',
                        animation: 'float 1.5s ease-in-out infinite'
                      }}>
                        {selectedChar.id === 'hana' ? '📝' : selectedChar.id === 'cybercat' ? '💻' : selectedChar.id === 'zenmaster' ? '🍃' : '⚙️'}
                      </span>
                    )}
                  </div>

                </div>
              );
            })()}


            {/* Active Character Bio & Thought Text */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: '700', fontSize: '0.95rem', color: 'white' }}>{selectedChar.name}</span>
                <span className="badge" style={{
                  fontSize: '0.55rem',
                  padding: '1px 8px',
                  background: isRunning ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: isRunning ? '#10B981' : '#F59E0B'
                }}>
                  {isRunning ? 'STUDYING' : 'PAUSED'}
                </span>
              </div>
              
              {/* Responsive Thought bubble */}
              <p style={{
                fontSize: '0.8rem',
                color: 'hsl(var(--text-secondary))',
                fontStyle: 'italic',
                lineHeight: '1.4',
                maxWidth: '320px',
                minHeight: '2.4em',
                display: 'flex',
                alignItems: 'center'
              }}>
                {buddyReaction 
                  ? buddyReaction 
                  : (isRunning 
                      ? getStudyingThoughts(selectedChar.id, studyTopic)
                      : getRestingThoughts(selectedChar.id))
                }
              </p>
            </div>
            
          </div>

          {/* Right: Gamified Stats & Interaction Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
            
            {/* Stamina bar widget */}
            <div style={{ width: '120px' }}>
              <div style={{ display: 'flex', justifyItems: 'space-between', justifyContent: 'space-between', fontSize: '0.6rem', color: 'hsl(var(--text-tertiary))', marginBottom: '2px', fontWeight: '700' }}>
                <span>BUDDY STAMINA</span>
                <span>{buddyStamina}%</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${buddyStamina}%`,
                  background: `linear-gradient(90deg, ${selectedChar.color}, #EC4899)`,
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>

            {/* Quick Touch Badges */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button 
                onClick={handlePokeBuddy}
                className="badge"
                style={{
                  cursor: 'pointer',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontSize: '0.65rem',
                  padding: '3px 8px',
                  color: 'white',
                  fontFamily: 'var(--font-header)'
                }}
              >
                👋 Poke
              </button>
              <button 
                onClick={handleFeedBuddy}
                className="badge"
                style={{
                  cursor: 'pointer',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontSize: '0.65rem',
                  padding: '3px 8px',
                  color: selectedChar.color,
                  fontFamily: 'var(--font-header)'
                }}
              >
                {selectedChar.id === 'cybercat' ? '⚡ Charge' : '🍵 Feed'}
              </button>
            </div>

          </div>

        </div>

        {/* Companion Chat History Area */}

        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {chatHistory.filter(msg => msg.role !== 'system').map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '12px',
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                maxWidth: '80%'
              }}
            >
              {msg.role === 'ai' && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${selectedChar.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  flexShrink: 0
                }}>
                  {selectedChar.avatar}
                </div>
              )}
              
              <div 
                className={msg.role === 'user' ? 'chat-bubble chat-bubble-user' : 'chat-bubble chat-bubble-ai'}
                style={{
                  borderLeft: msg.role === 'ai' ? `3px solid ${selectedChar.color}` : 'none'
                }}
              >
                {/* Parse Markdown highlights */}
                {msg.content.split('**').map((t, i) => i % 2 === 1 ? <strong key={i}>{t}</strong> : t)}
              </div>
            </div>
          ))}

          {loadingReply && (
            <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px', color: 'hsl(var(--text-tertiary))', fontSize: '0.85rem', marginLeft: '44px' }}>
              <span className="animate-float" style={{ fontSize: '1.2rem' }}>{selectedChar.avatar}</span> {selectedChar.name} is typing...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Interactive suggestions quick buttons */}
        <div style={{
          padding: '0 2rem',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '10px'
        }}>
          <button 
            onClick={() => setMessage("I'm feeling a bit tired and losing focus...")}
            className="badge badge-gray" 
            style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            🥱 I'm tired
          </button>
          <button 
            onClick={() => setMessage("Could you test me or give me a quick focus riddle?")}
            className="badge badge-gray" 
            style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            ❓ Give me a riddle
          </button>
          <button 
            onClick={() => setMessage("Give me a quick 1-sentence motivation boost!")}
            className="badge badge-gray" 
            style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            ⚡ Boost me!
          </button>
        </div>

        {/* Buddy Chat Form Input */}
        <form onSubmit={handleSendBuddyMessage} style={{
          padding: '1.5rem 2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(11,11,15,0.3)',
          display: 'flex',
          gap: '12px'
        }}>
          <input
            type="text"
            placeholder={`Say something to ${selectedChar.name}... (e.g. "I'm working on Chapter 2 now!")`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loadingReply}
            className="form-input"
            style={{ flex: 1 }}
          />
          <button
            type="submit"
            disabled={!message.trim() || loadingReply}
            className="btn-primary"
            style={{ padding: '0 24px', background: `linear-gradient(135deg, ${selectedChar.color}, #EC4899)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Send size={16} />
          </button>
        </form>

      </div>

      {/* QUIZ ME MODAL OVERLAY */}
      {quizActive && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 5, 8, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div className="glass-panel glass-panel-glow-purple" style={{
            maxWidth: '650px',
            width: '100%',
            padding: '2.5rem',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
              <span style={{ fontSize: '2.2rem' }}>{selectedChar.avatar}</span>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>{selectedChar.name}'s RAG Quiz</h3>
                <span className="badge badge-teal">Verifying your Lecture Notes</span>
              </div>
            </div>

            {/* Quiz Body loading / loaded */}
            {loadingQuiz ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <Loader2 className="animate-spin text-glow-purple" size={32} style={{ color: 'hsl(var(--accent-purple))' }} />
                <div style={{ fontSize: '1rem', fontWeight: '600' }}>Reading PDF, selecting study topics...</div>
                <div style={{ fontSize: '0.8rem', color: 'hsl(var(--text-tertiary))' }}>{selectedChar.name} is formulating a custom in-character question.</div>
              </div>
            ) : quizQuestion ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                
                {/* Question Bubble */}
                <div style={{
                  padding: '1.2rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: `1px solid ${selectedChar.color}30`,
                  borderLeft: `4px solid ${selectedChar.color}`,
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1rem',
                  lineHeight: '1.5',
                  fontWeight: '500'
                }}>
                  {quizQuestion.question}
                </div>

                {/* Citation page hint */}
                <div style={{ fontSize: '0.8rem', color: 'hsl(var(--text-tertiary))', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <HelpCircle size={14} /> Topic Source Location: <strong>Lecture Slides Page {quizQuestion.page}</strong>
                </div>

                {/* Multiple Choices */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '0.5rem' }}>
                  {quizQuestion.options.map((opt, oIdx) => {
                    const letter = ['A', 'B', 'C', 'D'][oIdx];
                    let cardBg = 'rgba(255, 255, 255, 0.03)';
                    let cardBorder = '1px solid rgba(255, 255, 255, 0.08)';

                    if (answered) {
                      if (letter === quizQuestion.answer) {
                        cardBg = 'rgba(16, 185, 129, 0.15)'; // Green for correct
                        cardBorder = '2px solid #10B981';
                      } else if (selectedAnswer === letter) {
                        cardBg = 'rgba(239, 68, 68, 0.15)'; // Red for selected wrong
                        cardBorder = '2px solid #EF4444';
                      }
                    } else if (selectedAnswer === letter) {
                      cardBg = 'rgba(168, 85, 247, 0.1)';
                      cardBorder = `2px solid ${selectedChar.color}`;
                    }

                    return (
                      <div
                        key={letter}
                        onClick={() => handleSelectAnswer(oIdx)}
                        style={{
                          padding: '12px 16px',
                          borderRadius: 'var(--radius-md)',
                          background: cardBg,
                          border: cardBorder,
                          cursor: answered ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          fontWeight: '500',
                          fontSize: '0.9rem',
                          transition: 'var(--transition-smooth)'
                        }}
                      >
                        <span style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          border: '1px solid rgba(255,255,255,0.1)'
                        }}>{letter}</span>
                        <span>{opt}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation text */}
                {answered && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    background: selectedAnswer === quizQuestion.answer ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                    border: selectedAnswer === quizQuestion.answer ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
                    fontSize: '0.85rem',
                    lineHeight: '1.5'
                  }}>
                    <strong style={{ color: selectedAnswer === quizQuestion.answer ? '#10B981' : '#EF4444', display: 'block', marginBottom: '4px' }}>
                      {selectedAnswer === quizQuestion.answer ? 'Excellent Work!' : 'Incorrect Answer'}
                    </strong>
                    {quizQuestion.explanation}
                  </div>
                )}

              </div>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>Error loading question data.</div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', justifyItems: 'flex-end', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.2rem', marginTop: '1rem' }}>
              {answered && (
                <button onClick={handleTriggerQuiz} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RotateCcw size={16} /> Next Question
                </button>
              )}
              <button 
                onClick={() => setQuizActive(false)} 
                className="btn-primary" 
                style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', boxShadow: 'none' }}
              >
                Close Quiz
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
