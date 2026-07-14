import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Server, User, LogOut, Menu, X } from 'lucide-react';
import PDFChat from './components/PDFChat';
import StudyBuddy from './components/StudyBuddy';
import Settings from './components/Settings';
import Profile from './components/Profile';
import Auth from './components/Auth';

const TAGLINES = [
  "Your AI classmate, always ready to study",
  "Study smarter, together",
  "The classmate who never skips a lecture",
  "Notes, chats, and a study buddy — all in one",
  "Like having a genius classmate, 24/7",
];

export default function App() {
  // Navigation Tab State
  const [activeTab, setActiveTab] = useState('pdf-chat');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  // Auth state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('classmate_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  });

  const handleAuth = (userData) => {
    setUser(userData);
  };

  const handleSignOut = () => {
    localStorage.removeItem('classmate_current_user');
    setUser(null);
  };

  // Rotating tagline state
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [taglineFade, setTaglineFade] = useState(true); // true = visible

  // Splash screen state
  const [showSplash, setShowSplash] = useState(true);
  const [splashExit, setSplashExit] = useState(false);
  const [splashTagline] = useState(() => TAGLINES[Math.floor(Math.random() * TAGLINES.length)]);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setSplashExit(true); // trigger fade-out animation
    }, 2800);
    const removeTimer = setTimeout(() => {
      setShowSplash(false); // unmount splash after fade completes
    }, 3400);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setTaglineFade(false);
      // After fade-out completes, swap text and fade in
      setTimeout(() => {
        setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
        setTaglineFade(true);
      }, 500); // matches CSS transition duration
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  // Apply theme class to document root
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Shared state: Document indexes
  const [documents, setDocuments] = useState([]);
  const [activeDoc, setActiveDoc] = useState(null);

  // Mobile state — must be declared before any early returns to follow React Hook rules
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Global settings state
  const [settings, setSettings] = useState({
    provider: 'gemini',
    geminiKey: '',
    openaiKey: '',
    googleClientId: ''
  });

  // Sync settings and docs from localStorage on load
  useEffect(() => {
    const savedSettings = localStorage.getItem('study_assistant_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Corrupted settings in storage, resetting.");
      }
    }

    const savedActiveDoc = localStorage.getItem('study_assistant_active_doc');
    if (savedActiveDoc) {
      setActiveDoc(savedActiveDoc);
    }
  }, []);

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('study_assistant_settings', JSON.stringify(newSettings));
  };

  const handleSetActiveDoc = (docId) => {
    setActiveDoc(docId);
    if (docId) {
      localStorage.setItem('study_assistant_active_doc', docId);
    } else {
      localStorage.removeItem('study_assistant_active_doc');
    }
  };

  // If not authenticated and splash is done, show auth page
  if (!user && !showSplash) {
    return <Auth settings={settings} onAuth={handleAuth} />;
  }

  return (
    <div className="app-container">

      {/* Splash Screen Overlay */}
      {showSplash && (
        <div className={`splash-screen${splashExit ? ' splash-exit' : ''}`}>
          <div className="splash-logo">
            <svg width="100" height="100" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M82 28C82 28 68 16 50 16C28 16 14 34 14 60C14 86 28 104 50 104C68 104 82 92 82 92" stroke="#185FA5" strokeWidth="14" strokeLinecap="round" fill="none" />
              <rect x="52" y="40" width="46" height="8" rx="4" fill="#85B7EB" />
              <rect x="52" y="56" width="46" height="8" rx="4" fill="#85B7EB" />
              <rect x="52" y="72" width="46" height="8" rx="4" fill="#85B7EB" />
            </svg>
          </div>
          <h1 className="splash-title">ClassMate</h1>
          <p className="splash-tagline">{splashTagline}</p>
          <div className="splash-loader">
            <div className="splash-loader-bar" />
          </div>
        </div>
      )}

      {/* Mobile Header Bar */}
      <div className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="28" height="28" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M82 28C82 28 68 16 50 16C28 16 14 34 14 60C14 86 28 104 50 104C68 104 82 92 82 92" stroke="#185FA5" strokeWidth="14" strokeLinecap="round" fill="none" />
            <rect x="52" y="40" width="46" height="8" rx="4" fill="#85B7EB" />
            <rect x="52" y="56" width="46" height="8" rx="4" fill="#85B7EB" />
            <rect x="52" y="72" width="46" height="8" rx="4" fill="#85B7EB" />
          </svg>
          <span style={{ fontFamily: 'var(--font-header)', fontWeight: '800', fontSize: '1.1rem', background: 'linear-gradient(135deg, #185FA5, #85B7EB)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ClassMate</span>
        </div>
        {user && (
          <button onClick={handleSignOut} style={{ background: 'none', border: 'none', color: 'hsl(var(--text-tertiary))', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center' }}>
            <LogOut size={18} />
          </button>
        )}
      </div>
      
      {/* Desktop Sidebar */}
      <div className="desktop-sidebar">
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Logo Group */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="40" height="40" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* C lettermark */}
              <path d="M82 28C82 28 68 16 50 16C28 16 14 34 14 60C14 86 28 104 50 104C68 104 82 92 82 92" stroke="#185FA5" strokeWidth="14" strokeLinecap="round" fill="none" />
              {/* Note lines */}
              <rect x="52" y="40" width="46" height="8" rx="4" fill="#85B7EB" />
              <rect x="52" y="56" width="46" height="8" rx="4" fill="#85B7EB" />
              <rect x="52" y="72" width="46" height="8" rx="4" fill="#85B7EB" />
            </svg>
            <div>
              <h1 style={{ fontSize: '1.2rem', fontWeight: '800', fontFamily: 'var(--font-header)', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #185FA5, #85B7EB)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ClassMate
              </h1>
              <span className="badge badge-purple" style={{ fontSize: '0.55rem', padding: '1px 6px', marginTop: '2px' }}>AI-Powered</span>
            </div>
          </div>

          {/* Navigation Options */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            
            <button
              onClick={() => setActiveTab('pdf-chat')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: activeTab === 'pdf-chat' ? 'rgba(168, 85, 247, 0.12)' : 'transparent',
                border: activeTab === 'pdf-chat' ? '1px solid rgba(168, 85, 247, 0.25)' : '1px solid transparent',
                color: activeTab === 'pdf-chat' ? 'white' : 'hsl(var(--text-secondary))',
                cursor: 'pointer',
                fontFamily: 'var(--font-header)',
                fontWeight: activeTab === 'pdf-chat' ? '600' : '500',
                fontSize: '0.95rem',
                textAlign: 'left',
                transition: 'var(--transition-smooth)'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'pdf-chat') e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'pdf-chat') e.currentTarget.style.background = 'transparent';
              }}
            >
              <BookOpen size={18} style={{ color: activeTab === 'pdf-chat' ? 'hsl(var(--accent-purple))' : 'inherit' }} />
              Chat with Notes
            </button>

            <button
              onClick={() => setActiveTab('study-buddy')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: activeTab === 'study-buddy' ? 'rgba(168, 85, 247, 0.12)' : 'transparent',
                border: activeTab === 'study-buddy' ? '1px solid rgba(168, 85, 247, 0.25)' : '1px solid transparent',
                color: activeTab === 'study-buddy' ? 'white' : 'hsl(var(--text-secondary))',
                cursor: 'pointer',
                fontFamily: 'var(--font-header)',
                fontWeight: activeTab === 'study-buddy' ? '600' : '500',
                fontSize: '0.95rem',
                textAlign: 'left',
                transition: 'var(--transition-smooth)'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'study-buddy') e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'study-buddy') e.currentTarget.style.background = 'transparent';
              }}
            >
              <Sparkles size={18} style={{ color: activeTab === 'study-buddy' ? 'hsl(var(--accent-pink))' : 'inherit' }} />
              Study Session Buddy
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: activeTab === 'profile' ? 'rgba(168, 85, 247, 0.12)' : 'transparent',
                border: activeTab === 'profile' ? '1px solid rgba(168, 85, 247, 0.25)' : '1px solid transparent',
                color: activeTab === 'profile' ? 'white' : 'hsl(var(--text-secondary))',
                cursor: 'pointer',
                fontFamily: 'var(--font-header)',
                fontWeight: activeTab === 'profile' ? '600' : '500',
                fontSize: '0.95rem',
                textAlign: 'left',
                transition: 'var(--transition-smooth)'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'profile') e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'profile') e.currentTarget.style.background = 'transparent';
              }}
            >
              <User size={18} style={{ color: activeTab === 'profile' ? 'hsl(var(--accent-purple))' : 'inherit' }} />
              Profile
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: activeTab === 'settings' ? 'rgba(168, 85, 247, 0.12)' : 'transparent',
                border: activeTab === 'settings' ? '1px solid rgba(168, 85, 247, 0.25)' : '1px solid transparent',
                color: activeTab === 'settings' ? 'white' : 'hsl(var(--text-secondary))',
                cursor: 'pointer',
                fontFamily: 'var(--font-header)',
                fontWeight: activeTab === 'settings' ? '600' : '500',
                fontSize: '0.95rem',
                textAlign: 'left',
                transition: 'var(--transition-smooth)'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'settings') e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'settings') e.currentTarget.style.background = 'transparent';
              }}
            >
              <Server size={18} style={{ color: activeTab === 'settings' ? 'hsl(var(--accent-teal))' : 'inherit' }} />
              AI Settings
            </button>

          </nav>

        </div>

        {/* Footer Area with active status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* User info + Sign Out */}
          {user && (
            <div className="glass-panel" style={{
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.02)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #185FA5, #A855F7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: '700',
                color: 'white',
                flexShrink: 0,
              }}>
                {user.name ? user.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'hsl(var(--text-primary))', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name}
                </span>
                <span style={{ fontSize: '0.62rem', color: 'hsl(var(--text-tertiary))', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                title="Sign Out"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'hsl(var(--text-tertiary))',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.2s ease',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#F87171'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--text-tertiary))'}
              >
                <LogOut size={15} />
              </button>
            </div>
          )}

          <div className="glass-panel" style={{
            padding: '12px 16px',
            background: 'rgba(255,255,255,0.02)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10B981',
              boxShadow: '0 0 8px #10B981'
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'white' }}>Backend Online</span>
              <span style={{ fontSize: '0.65rem', color: 'hsl(var(--text-tertiary))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Mode: {settings.provider.toUpperCase()}
              </span>
            </div>
          </div>

          <div style={{
            fontSize: '0.7rem',
            textAlign: 'center',
            color: 'hsl(var(--text-tertiary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}>
            <span style={{
              transition: 'opacity 0.5s ease, transform 0.5s ease',
              opacity: taglineFade ? 1 : 0,
              transform: taglineFade ? 'translateY(0)' : 'translateY(6px)',
              display: 'inline-block',
            }}>
              ClassMate — {TAGLINES[taglineIndex]}
            </span>
          </div>

        </div>

      </div>

      {/* Main Panel Viewport */}
      <main className="main-content">
        
        {activeTab === 'pdf-chat' && (
          <PDFChat 
            settings={settings}
            activeDoc={activeDoc}
            setActiveDoc={handleSetActiveDoc}
            documents={documents}
            setDocuments={setDocuments}
          />
        )}

        {activeTab === 'study-buddy' && (
          <StudyBuddy 
            settings={settings}
            activeDoc={activeDoc}
          />
        )}

        {activeTab === 'profile' && (
          <Profile theme={theme} setTheme={setTheme} />
        )}

        {activeTab === 'settings' && (
          <Settings settings={settings} onSaveSettings={handleSaveSettings} theme={theme} setTheme={setTheme} />
        )}

      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        <button
          className={`mobile-nav-btn${activeTab === 'pdf-chat' ? ' active' : ''}`}
          onClick={() => setActiveTab('pdf-chat')}
        >
          <BookOpen size={22} />
          <span>Notes</span>
        </button>
        <button
          className={`mobile-nav-btn${activeTab === 'study-buddy' ? ' active' : ''}`}
          onClick={() => setActiveTab('study-buddy')}
        >
          <Sparkles size={22} />
          <span>Buddy</span>
        </button>
        <button
          className={`mobile-nav-btn${activeTab === 'profile' ? ' active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={22} />
          <span>Profile</span>
        </button>
        <button
          className={`mobile-nav-btn${activeTab === 'settings' ? ' active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Server size={22} />
          <span>Settings</span>
        </button>
      </nav>

    </div>
  );
}
