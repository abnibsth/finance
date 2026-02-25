'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestPage() {
  const [result, setResult] = useState('Testing...');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  useEffect(() => {
    supabase.auth.getSession()
      .then(() => setResult('✅ Supabase connected!'))
      .catch(e => setResult('❌ Error: ' + e.message));
  }, []);

  return (
    <div style={{ padding: 40, fontFamily: 'monospace', background: '#111', color: '#fff', minHeight: '100vh' }}>
      <h1>Supabase Debug</h1>
      <p><b>URL:</b> {url}</p>
      <p><b>Key starts:</b> {key?.substring(0, 30)}...</p>
      <p><b>Status:</b> {result}</p>
      <hr/>
      <p style={{color:'#aaa', fontSize:12}}>Copy the URL above and check if it matches your Supabase project Settings → API → Project URL</p>
    </div>
  );
}
