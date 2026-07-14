import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, BookOpen } from 'lucide-react';

export default function Auth({ settings, onAuth }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (isSignUp && !name.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    // Simulate auth delay for polish
    setTimeout(() => {
      if (isSignUp) {
        // Save new user to localStorage
        const users = JSON.parse(localStorage.getItem('classmate_users') || '[]');
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
          setError('An account with this email already exists.');
          setIsLoading(false);
          return;
        }
        const newUser = { name: name.trim(), email: email.trim(), password, createdAt: new Date().toISOString() };
        users.push(newUser);
        localStorage.setItem('classmate_users', JSON.stringify(users));
        localStorage.setItem('classmate_current_user', JSON.stringify({ name: newUser.name, email: newUser.email }));
        onAuth({ name: newUser.name, email: newUser.email });
      } else {
        // Sign in: check credentials
        const users = JSON.parse(localStorage.getItem('classmate_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
          setError('Invalid email or password.');
          setIsLoading(false);
          return;
        }
        localStorage.setItem('classmate_current_user', JSON.stringify({ name: user.name, email: user.email }));
        onAuth({ name: user.name, email: user.email });
      }
    }, 800);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="auth-page">
      {/* Animated background orbs */}
      <div className="auth-bg-orb auth-bg-orb-1" />
      <div className="auth-bg-orb auth-bg-orb-2" />
      <div className="auth-bg-orb auth-bg-orb-3" />

      <div className="auth-container">
        {/* Left: Branding Panel */}
        <div className="auth-branding">
          <div className="auth-branding-content">
            <div className="auth-logo-group">
              <svg width="64" height="64" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M82 28C82 28 68 16 50 16C28 16 14 34 14 60C14 86 28 104 50 104C68 104 82 92 82 92" stroke="#185FA5" strokeWidth="14" strokeLinecap="round" fill="none" />
                <rect x="52" y="40" width="46" height="8" rx="4" fill="#85B7EB" />
                <rect x="52" y="56" width="46" height="8" rx="4" fill="#85B7EB" />
                <rect x="52" y="72" width="46" height="8" rx="4" fill="#85B7EB" />
              </svg>
              <h1 className="auth-brand-title">ClassMate</h1>
            </div>
            <p className="auth-brand-tagline">Your AI-powered study companion that never skips a lecture</p>

            <div className="auth-features">
              <div className="auth-feature-item">
                <div className="auth-feature-icon">
                  <BookOpen size={18} />
                </div>
                <div>
                  <span className="auth-feature-title">Chat with your notes</span>
                  <span className="auth-feature-desc">Upload PDFs, DOCX & more — ask anything</span>
                </div>
              </div>
              <div className="auth-feature-item">
                <div className="auth-feature-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', borderColor: 'rgba(236, 72, 153, 0.25)' }}>
                  <span style={{ color: '#EC4899' }}>✦</span>
                </div>
                <div>
                  <span className="auth-feature-title">AI Study Buddy</span>
                  <span className="auth-feature-desc">Flashcards, quizzes & smart summaries</span>
                </div>
              </div>
              <div className="auth-feature-item">
                <div className="auth-feature-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', borderColor: 'rgba(6, 182, 212, 0.25)' }}>
                  <span style={{ color: '#06B6D4' }}>⚡</span>
                </div>
                <div>
                  <span className="auth-feature-title">Powered by AI</span>
                  <span className="auth-feature-desc">Gemini & OpenAI at your fingertips</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Auth Form */}
        <div className="auth-form-panel">
          <div className="auth-form-wrapper">
            <div className="auth-form-header">
              <h2 className="auth-form-title">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
              <p className="auth-form-subtitle">
                {isSignUp ? 'Join ClassMate and start studying smarter' : 'Sign in to continue your study sessions'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Name field (sign up only) */}
              {isSignUp && (
                <div className="auth-input-group" style={{ animation: 'authFieldIn 0.3s ease forwards' }}>
                  <label className="auth-label">Full Name</label>
                  <div className="auth-input-wrapper">
                    <User size={16} className="auth-input-icon" />
                    <input
                      type="text"
                      className="auth-input"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                </div>
              )}

              <div className="auth-input-group">
                <label className="auth-label">Email Address</label>
                <div className="auth-input-wrapper">
                  <Mail size={16} className="auth-input-icon" />
                  <input
                    type="email"
                    className="auth-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrapper">
                  <Lock size={16} className="auth-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="auth-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm password (sign up only) */}
              {isSignUp && (
                <div className="auth-input-group" style={{ animation: 'authFieldIn 0.3s ease forwards' }}>
                  <label className="auth-label">Confirm Password</label>
                  <div className="auth-input-wrapper">
                    <Lock size={16} className="auth-input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="auth-input"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="auth-error">
                  <span>⚠</span> {error}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className="auth-submit-btn"
                disabled={isLoading}
                style={{ marginTop: '1rem' }}
              >
                {isLoading ? (
                  <div className="auth-spinner" />
                ) : (
                  <>
                    {isSignUp ? 'Create Account' : 'Sign In'}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Toggle sign in / sign up */}
            <div className="auth-toggle">
              <span className="auth-toggle-text">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </span>
              <button
                type="button"
                className="auth-toggle-btn"
                onClick={toggleMode}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
