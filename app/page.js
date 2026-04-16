'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Auth from '../components/Auth';
import LifeOS from '../components/LifeOS';

export default function Home() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Session error, clearing:', error.message);
          await supabase.auth.signOut();
          setSession(null);
        } else {
          setSession(session);
        }
      } catch (err) {
        console.warn('Auth init error, clearing session:', err);
        try { await supabase.auth.signOut(); } catch (e) { /* ignore */ }
        setSession(null);
      }
      setLoading(false);
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setSession(null);
      } else if (event === 'TOKEN_REFRESHED' && !newSession) {
        // Refresh failed - clear session
        setSession(null);
      } else {
        setSession(newSession);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#F4F6F8', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Outfit', sans-serif", color: '#8E95A2',
      }}>
        Loading...
      </div>
    );
  }

  if (!session) return <Auth />;
  return <LifeOS session={session} />;
}
