'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const quickNav = [
  { label: 'Pemasukan', href: '/dashboard/pemasukan', color: 'from-cyan-500 to-cyan-400', textColor: 'text-cyan-400', glow: '0 0 20px rgba(34,211,238,0.2)', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  )},
  { label: 'Pengeluaran', href: '/dashboard/pengeluaran', color: 'from-pink-500 to-rose-500', textColor: 'text-pink-400', glow: '0 0 20px rgba(244,114,182,0.2)', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
    </svg>
  )},
  { label: 'Tabungan', href: '/dashboard/tabungan', color: 'from-purple-500 to-purple-400', textColor: 'text-purple-400', glow: '0 0 20px rgba(168,85,247,0.2)', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  )},
  { label: 'Saran', href: '/dashboard/saran', color: 'from-yellow-500 to-yellow-400', textColor: 'text-yellow-400', glow: '0 0 20px rgba(234,179,8,0.2)', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  )},
];

export default function DashboardHome() {
  const [username, setUsername] = useState('Adventurer');
  const [totalPemasukan, setTotalPemasukan] = useState(0);
  const [totalPengeluaran, setTotalPengeluaran] = useState(0);
  const [totalTabungan, setTotalTabungan] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const uid = session.user.id;

      const [profileRes, pemasukanRes, pengeluaranRes, tabunganRes] = await Promise.all([
        supabase.from('profiles').select('username').eq('id', uid).single(),
        supabase.from('pemasukan').select('amount').eq('user_id', uid),
        supabase.from('pengeluaran').select('amount').eq('user_id', uid),
        supabase.from('tabungan').select('saved').eq('user_id', uid),
      ]);

      if (profileRes.data?.username) setUsername(profileRes.data.username);
      if (pemasukanRes.data) setTotalPemasukan(pemasukanRes.data.reduce((s, r) => s + r.amount, 0));
      if (pengeluaranRes.data) setTotalPengeluaran(pengeluaranRes.data.reduce((s, r) => s + r.amount, 0));
      if (tabunganRes.data) setTotalTabungan(tabunganRes.data.reduce((s, r) => s + r.saved, 0));
      setLoading(false);
    };
    fetchData();
  }, []);

  const saldoBersih = totalPemasukan - totalPengeluaran;
  const healthScore = totalPemasukan > 0
    ? Math.min(100, Math.round(((saldoBersih / totalPemasukan) * 50) + (totalTabungan > 0 ? 30 : 0) + 20))
    : 0;

  const getHealthLabel = (score: number) => {
    if (score >= 80) return { label: 'Sangat Baik 🌟', color: 'text-green-400' };
    if (score >= 60) return { label: 'Baik 👍', color: 'text-yellow-400' };
    if (score >= 40) return { label: 'Cukup ⚠️', color: 'text-orange-400' };
    return { label: 'Perlu Perhatian 🔴', color: 'text-red-400' };
  };

  const health = getHealthLabel(healthScore);

  return (
    <div className="space-y-6 sm:space-y-8 animate-slideInUp">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">
          Halo, <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">{username}</span> 🎮
        </h2>
        <p className="text-gray-400 text-sm">Berikut ringkasan keuanganmu.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Net Balance */}
        <div className="sm:col-span-2 xl:col-span-1 relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
          <div className="relative glass-card rounded-2xl p-5 h-full" style={{ boxShadow: '0 0 24px rgba(168,85,247,0.2)' }}>
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${saldoBersih >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {saldoBersih >= 0 ? '▲' : '▼'}
              </span>
            </div>
            <p className="text-gray-400 text-xs font-medium mb-1">Saldo Bersih</p>
            {loading ? (
              <div className="h-6 w-24 bg-slate-700/50 rounded animate-pulse" />
            ) : (
              <p className={`text-xl font-bold ${saldoBersih >= 0 ? 'text-white' : 'text-red-400'}`}>
                Rp {Math.abs(saldoBersih).toLocaleString('id-ID')}
              </p>
            )}
          </div>
        </div>

        {/* Pemasukan */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
          <div className="relative glass-card rounded-2xl p-5" style={{ boxShadow: '0 0 20px rgba(34,211,238,0.15)' }}>
            <p className="text-gray-400 text-xs mb-1">Pemasukan</p>
            {loading ? <div className="h-6 w-20 bg-slate-700/50 rounded animate-pulse" /> : (
              <p className="text-cyan-400 text-xl font-bold">Rp {(totalPemasukan / 1000000).toFixed(2)}jt</p>
            )}
            <p className="text-gray-500 text-xs mt-1">Total semua pemasukan</p>
          </div>
        </div>

        {/* Pengeluaran */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
          <div className="relative glass-card rounded-2xl p-5" style={{ boxShadow: '0 0 20px rgba(244,114,182,0.15)' }}>
            <p className="text-gray-400 text-xs mb-1">Pengeluaran</p>
            {loading ? <div className="h-6 w-20 bg-slate-700/50 rounded animate-pulse" /> : (
              <p className="text-pink-400 text-xl font-bold">Rp {(totalPengeluaran / 1000000).toFixed(2)}jt</p>
            )}
            <p className="text-gray-500 text-xs mt-1">Total semua pengeluaran</p>
          </div>
        </div>

        {/* Tabungan */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-purple-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
          <div className="relative glass-card rounded-2xl p-5" style={{ boxShadow: '0 0 20px rgba(168,85,247,0.15)' }}>
            <p className="text-gray-400 text-xs mb-1">Tabungan</p>
            {loading ? <div className="h-6 w-20 bg-slate-700/50 rounded animate-pulse" /> : (
              <p className="text-purple-400 text-xl font-bold">Rp {(totalTabungan / 1000000).toFixed(2)}jt</p>
            )}
            <p className="text-gray-500 text-xs mt-1">Total dana tersimpan</p>
          </div>
        </div>
      </div>

      {/* Financial Health */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-white font-semibold text-sm">Kesehatan Keuangan</p>
            <p className="text-gray-500 text-xs mt-0.5">Berdasarkan pemasukan, pengeluaran, dan tabungan</p>
          </div>
          {loading ? (
            <div className="h-8 w-16 bg-slate-700/50 rounded animate-pulse" />
          ) : (
            <div className="text-right">
              <span className="text-yellow-400 font-black text-2xl">{healthScore}<span className="text-base text-gray-500">/100</span></span>
              <p className={`text-xs font-medium ${health.color}`}>{health.label}</p>
            </div>
          )}
        </div>
        <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-pink-500 via-yellow-400 to-green-400 transition-all duration-1000" style={{ width: `${healthScore}%` }} />
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>Kritis</span><span>Cukup</span><span>Baik</span><span>Sangat Baik</span>
        </div>
      </div>

      {/* Quick Nav Cards */}
      <div>
        <h3 className="text-white font-bold text-sm mb-4 text-gray-400 uppercase tracking-widest">Menu Utama</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickNav.map((item) => (
            <Link key={item.label} href={item.href} className="relative group block">
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${item.color} rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-300`} />
              <div
                className="relative glass-card rounded-2xl p-5 flex flex-col items-center gap-3 text-center hover:scale-105 transition-transform duration-200"
                style={{ boxShadow: item.glow }}
              >
                <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} shadow-lg`}>
                  <span className="text-slate-900">{item.icon}</span>
                </div>
                <span className={`font-semibold text-sm ${item.textColor}`}>{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4">
        <p className="text-gray-600 text-xs">Finance Quest © 2026 · Built with 💜 for your financial journey</p>
      </footer>
    </div>
  );
}
