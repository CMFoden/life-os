'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Auth from '../components/Auth';
import LifeOS from '../components/LifeOS';

export default function Home() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
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
