import React, { useState } from 'react';
import { Server, Shield, Sparkles, Check } from 'lucide-react';

export default function Settings({ settings, onSaveSettings }) {
  const [provider, setProvider] = useState(settings.provider || 'gemini');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    onSaveSettings({
      provider
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div style={{ padding: '2rem', height: '100%', overflowY: 'auto' }}>
      <div style={{ maxWidth: '650px', margin: '0 auto' }}>
        
        {/* Header Block */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Server size={32} className="text-glow-purple" />
            <h1 style={{ fontSize: '2.2rem', fontWeight: '800' }}>AI Configuration</h1>
          </div>
          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '1rem', lineHeight: '1.6' }}>
            Select your preferred AI provider. API keys are now securely managed by the server backend environment variables.
          </p>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSave} className="glass-panel glass-panel-glow-purple" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Provider Selection */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: '600', marginBottom: '12px' }}>
              <Sparkles size={18} className="text-glow-teal" />
              Active LLM Provider
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div 
                onClick={() => setProvider('gemini')}
                style={{
                  padding: '1.2rem',
                  borderRadius: 'var(--radius-md)',
                  background: provider === 'gemini' ? 'rgba(168, 85, 247, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  border: provider === 'gemini' ? '2px solid hsl(var(--accent-purple))' : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <div style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px', color: provider === 'gemini' ? 'hsl(var(--text-primary))' : 'hsl(var(--text-secondary))' }}>Google Gemini</div>
                <div style={{ fontSize: '0.8rem', color: 'hsl(var(--text-tertiary))' }}>Fast, precise & cost-efficient</div>
              </div>

              <div 
                onClick={() => setProvider('openai')}
                style={{
                  padding: '1.2rem',
                  borderRadius: 'var(--radius-md)',
                  background: provider === 'openai' ? 'rgba(168, 85, 247, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  border: provider === 'openai' ? '2px solid hsl(var(--accent-purple))' : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <div style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px', color: provider === 'openai' ? 'hsl(var(--text-primary))' : 'hsl(var(--text-secondary))' }}>OpenAI (GPT)</div>
                <div style={{ fontSize: '0.8rem', color: 'hsl(var(--text-tertiary))' }}>Industry standard performance</div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div style={{
            display: 'flex',
            gap: '12px',
            padding: '1rem',
            background: 'rgba(6, 182, 212, 0.05)',
            border: '1px solid rgba(6, 182, 212, 0.15)',
            borderRadius: 'var(--radius-md)'
          }}>
            <Shield size={20} style={{ color: 'hsl(var(--accent-teal))', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.85rem', lineHeight: '1.5', color: 'hsl(var(--text-secondary))' }}>
              <strong style={{ color: 'white' }}>Backend Configured:</strong> The application is now configured to read your secure API keys directly from the backend environment file (.env).
            </div>
          </div>

          {/* Submit Block */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
            {saveSuccess ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'hsl(var(--accent-teal))', fontSize: '0.95rem', fontWeight: '600' }}>
                <Check size={18} /> Provider Saved Successfully!
              </div>
            ) : (
              <div />
            )}
            <button 
              type="submit" 
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 32px' }}
            >
              Save Configuration
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
