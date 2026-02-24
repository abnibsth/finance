'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

  useEffect(() => {
    const session = localStorage.getItem('fq_session');
    if (session) {
      try {
        const parsed = JSON.parse(session) as { username: string };
        if (parsed.username) setUsername(parsed.username);
      } catch {}
    }
  }, []);

  return (
    <div className="space-y-8 animate-slideInUp">
      {/* Greeting */}
      <div>
        <h2 className="text-3xl font-black text-white mb-1">
          Halo, <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">{username}</span> 🎮
        </h2>
        <p className="text-gray-400 text-sm">Berikut ringkasan keuanganmu bulan Februari 2026.</p>
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
              <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                +5%
              </div>
            </div>
            <p className="text-gray-400 text-xs font-medium mb-1">Saldo Bersih</p>
            <p className="text-white text-xl font-bold">Rp 7.500.000</p>
          </div>
        </div>

        {/* Pemasukan quick */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
          <div className="relative glass-card rounded-2xl p-5" style={{ boxShadow: '0 0 20px rgba(34,211,238,0.15)' }}>
            <p className="text-gray-400 text-xs mb-1">Pemasukan</p>
            <p className="text-cyan-400 text-xl font-bold">Rp 12,35jt</p>
            <p className="text-gray-500 text-xs mt-1">↑ 12% vs bulan lalu</p>
          </div>
        </div>

        {/* Pengeluaran quick */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
          <div className="relative glass-card rounded-2xl p-5" style={{ boxShadow: '0 0 20px rgba(244,114,182,0.15)' }}>
            <p className="text-gray-400 text-xs mb-1">Pengeluaran</p>
            <p className="text-pink-400 text-xl font-bold">Rp 4,85jt</p>
            <p className="text-gray-500 text-xs mt-1">↓ 8% vs bulan lalu</p>
          </div>
        </div>

        {/* Tabungan quick */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-purple-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
          <div className="relative glass-card rounded-2xl p-5" style={{ boxShadow: '0 0 20px rgba(168,85,247,0.15)' }}>
            <p className="text-gray-400 text-xs mb-1">Tabungan</p>
            <p className="text-purple-400 text-xl font-bold">Rp 37,7jt</p>
            <p className="text-gray-500 text-xs mt-1">61% menuju target</p>
          </div>
        </div>
      </div>

      {/* Financial Health */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-white font-semibold text-sm">Kesehatan Keuangan Bulan Ini</p>
            <p className="text-gray-500 text-xs mt-0.5">Berdasarkan pemasukan, pengeluaran, dan tabungan</p>
          </div>
          <span className="text-yellow-400 font-black text-2xl">72<span className="text-base text-gray-500">/100</span></span>
        </div>
        <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-pink-500 via-yellow-400 to-green-400 transition-all duration-1000" style={{ width: '72%' }} />
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
            <Link
              key={item.label}
              href={item.href}
              className="relative group block"
            >
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
