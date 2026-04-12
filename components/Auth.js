'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

const ROYAL = '#3366CC';
const TEAL = '#2AA198';
const TEXT = '#1B2030';
const MUTED = '#8E95A2';
const BORDER = '#E6EAF0';
const BG = '#F4F6F8';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('login');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setError('Check your email to confirm your account, then log in.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontFamily: "'Outfit', sans-serif", padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 28, margin: '0 auto 16px',
            background: `linear-gradient(135deg, ${ROYAL}, ${TEAL})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 18, fontWeight: 600,
          }}>C+C</div>
          <h1 style={{ fontSize: 28, fontFamily: "'Fraunces', serif", fontWeight: 600, color: TEXT, margin: 0 }}>Life OS</h1>
          <p style={{ fontSize: 14, color: MUTED, marginTop: 4 }}>Your life, handled.</p>
        </div>

        <div style={{
          background: '#FFFFFF', borderRadius: 16, padding: 24,
          border: `1px solid ${BORDER}`,
        }}>
          <input
            type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 10,
              border: `1px solid ${BORDER}`, fontSize: 14, marginBottom: 12,
              fontFamily: "'Outfit', sans-serif", color: TEXT, outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <input
            type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 10,
              border: `1px solid ${BORDER}`, fontSize: 14, marginBottom: 16,
              fontFamily: "'Outfit', sans-serif", color: TEXT, outline: 'none',
              boxSizing: 'border-box',
            }}
          />

          {error && (
            <p style={{ fontSize: 13, color: error.includes('Check your email') ? TEAL : '#E06856', marginBottom: 12, lineHeight: 1.4 }}>{error}</p>
          )}

          <button
            onClick={handleSubmit} disabled={loading}
            style={{
              width: '100%', padding: '12px 0', borderRadius: 10, border: 'none',
              background: `linear-gradient(135deg, ${ROYAL}, ${TEAL})`,
              color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              fontFamily: "'Outfit', sans-serif", opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Loading...' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>

          <p style={{ textAlign: 'center', fontSize: 13, color: MUTED, marginTop: 16 }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <span
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
              style={{ color: ROYAL, cursor: 'pointer', fontWeight: 500 }}
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
