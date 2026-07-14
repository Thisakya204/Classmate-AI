import React, { useState, useEffect } from 'react';
import { Sun, Moon, Camera, Save, Check } from 'lucide-react';

export default function Profile({ theme, setTheme }) {
  const [profileName, setProfileName] = useState(localStorage.getItem('profileName') || '');
  const [bio, setBio] = useState(localStorage.getItem('profileBio') || '');
  const [avatarUrl, setAvatarUrl] = useState(localStorage.getItem('avatarUrl') || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Compute study stats from localStorage
  const [stats, setStats] = useState({ sessions: 0, totalMinutes: 0, streak: 0 });
  useEffect(() => {
    try {
      const raw = localStorage.getItem('study_stats');
      if (raw) setStats(JSON.parse(raw));
    } catch (_) {}
  }, []);

  const handleSave = () => {
    localStorage.setItem('profileName', profileName);
    localStorage.setItem('profileBio', bio);
    localStorage.setItem('avatarUrl', avatarUrl);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const initials = profileName
    ? profileName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div style={{ padding: '2rem', height: '100%', overflowY: 'auto' }}>
      <div style={{ maxWidth: '650px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '8px' }}>Profile</h1>
          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '1rem', lineHeight: '1.6' }}>
            Personalize your ClassMate experience. Your data is stored locally.
          </p>
        </div>

        {/* Avatar + Name Card */}
        <div className="glass-panel glass-panel-glow-purple" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Avatar */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: avatarUrl
                ? `url(${avatarUrl}) center/cover no-repeat`
                : 'linear-gradient(135deg, #185FA5, #85B7EB)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: '3px solid rgba(255,255,255,0.15)',
              boxShadow: '0 0 25px rgba(24, 95, 165, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {!avatarUrl && (
                <span style={{ fontSize: '1.6rem', fontWeight: '800', color: 'white', fontFamily: 'var(--font-header)' }}>
                  {initials}
                </span>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '4px' }}>
                {profileName || 'Your Name'}
              </h2>
              <p style={{ color: 'hsl(var(--text-tertiary))', fontSize: '0.85rem' }}>
                {bio || 'No bio yet — tell us about yourself!'}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '6px' }}>Display Name</label>
              <input
                type="text"
                placeholder="e.g. Nethis"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="form-input"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '6px' }}>Bio</label>
              <textarea
                placeholder="A short description about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="form-input"
                rows={3}
                style={{ resize: 'vertical', fontFamily: 'var(--font-body)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '6px' }}>
                <Camera size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Avatar URL
              </label>
              <input
                type="url"
                placeholder="https://example.com/your-photo.png"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Theme Toggle Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>Appearance</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {/* Dark Button */}
            <button
              type="button"
              onClick={() => setTheme('dark')}
              style={{
                flex: 1,
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: theme === 'dark' ? 'rgba(168, 85, 247, 0.12)' : 'rgba(255,255,255,0.04)',
                border: theme === 'dark' ? '2px solid hsl(var(--accent-purple))' : '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                transition: 'var(--transition-smooth)',
                color: 'hsl(var(--text-primary))'
              }}
            >
              <Moon size={24} />
              <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Dark</span>
            </button>
            {/* Light Button */}
            <button
              type="button"
              onClick={() => setTheme('light')}
              style={{
                flex: 1,
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: theme === 'light' ? 'rgba(168, 85, 247, 0.12)' : 'rgba(255,255,255,0.04)',
                border: theme === 'light' ? '2px solid hsl(var(--accent-purple))' : '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                transition: 'var(--transition-smooth)',
                color: 'hsl(var(--text-primary))'
              }}
            >
              <Sun size={24} />
              <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Light</span>
            </button>
          </div>
        </div>

        {/* Study Stats Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>Study Stats</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', background: 'linear-gradient(135deg, #185FA5, #85B7EB)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {stats.sessions}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'hsl(var(--text-tertiary))', fontWeight: '500' }}>Sessions</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', background: 'linear-gradient(135deg, #185FA5, #85B7EB)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {stats.totalMinutes}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'hsl(var(--text-tertiary))', fontWeight: '500' }}>Minutes</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', background: 'linear-gradient(135deg, #185FA5, #85B7EB)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {stats.streak}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'hsl(var(--text-tertiary))', fontWeight: '500' }}>Day Streak</div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
          {saveSuccess && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'hsl(var(--accent-teal))', fontSize: '0.9rem', fontWeight: '600' }}>
              <Check size={16} /> Saved!
            </div>
          )}
          <button onClick={handleSave} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 28px' }}>
            <Save size={16} />
            Save Profile
          </button>
        </div>

      </div>
    </div>
  );
}
