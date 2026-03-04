'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

/* ── Quick nav config ──────────────────────────────────────── */
const quickNav = [
  {
    label: 'Pemasukan',
    href: '/dashboard/pemasukan',
    gradient: 'from-cyan-500 to-teal-400',
    glow: 'rgba(34,211,238,0.35)',
    textColor: 'text-cyan-400',
    desc: 'Catat & lihat semua pemasukan',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    label: 'Pengeluaran',
    href: '/dashboard/pengeluaran',
    gradient: 'from-pink-500 to-rose-500',
    glow: 'rgba(244,114,182,0.35)',
    textColor: 'text-pink-400',
    desc: 'Pantau semua pengeluaranmu',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
      </svg>
    ),
  },
  {
    label: 'Tabungan',
    href: '/dashboard/tabungan',
    gradient: 'from-purple-500 to-violet-500',
    glow: 'rgba(168,85,247,0.35)',
    textColor: 'text-purple-400',
    desc: 'Goals & progres tabungan',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    label: 'Saran',
    href: '/dashboard/saran',
    gradient: 'from-amber-500 to-yellow-400',
    glow: 'rgba(234,179,8,0.35)',
    textColor: 'text-yellow-400',
    desc: 'Tips & rekomendasi AI untukmu',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
];

/* ── Animated number counter hook ─────────────────────────── */
function useCountUp(target: number, duration = 1200, active = true) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    if (!active || target === 0) { setValue(target); return; }
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, active]);
  return value;
}

/* ── Format helpers ───────────────────────────────────────── */
function fmtJuta(n: number) {
  return (n / 1_000_000).toFixed(2) + ' jt';
}
function fmtRp(n: number) {
  return 'Rp ' + Math.abs(n).toLocaleString('id-ID');
}

/* ── Health bar width animated ────────────────────────────── */
function AnimatedHealthBar({ score }: { score: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 300);
    return () => clearTimeout(t);
  }, [score]);
  return (
    <div className="h-3 bg-slate-800/80 rounded-full overflow-hidden relative">
      {/* Track shimmer */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.04)_50%,transparent_100%)] animate-shimmer" />
      <div
        className="h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-400 progress-fill relative"
        style={{ width: `${width}%` }}
      >
        {/* Glow tip */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white/70 blur-sm" />
      </div>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────── */
export default function DashboardHome() {
  const [username, setUsername] = useState('Adventurer');
  const [totalPemasukan, setTotalPemasukan] = useState(0);
  const [totalPengeluaran, setTotalPengeluaran] = useState(0);
  const [totalTabungan, setTotalTabungan] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

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
      // Small delay so animations trigger after data arrives
      setTimeout(() => setMounted(true), 80);
    };
    fetchData();
  }, []);

  const saldoBersih = totalPemasukan - totalPengeluaran;
  const healthScore = totalPemasukan > 0
    ? Math.min(100, Math.round(((saldoBersih / totalPemasukan) * 50) + (totalTabungan > 0 ? 30 : 0) + 20))
    : 0;

  const getHealthLabel = (score: number) => {
    if (score >= 80) return { label: 'Sangat Baik', emoji: '🌟', color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' };
    if (score >= 60) return { label: 'Baik', emoji: '👍', color: 'text-yellow-400', bg: 'bg-yellow-500/15 border-yellow-500/30' };
    if (score >= 40) return { label: 'Cukup', emoji: '⚠️', color: 'text-orange-400', bg: 'bg-orange-500/15 border-orange-500/30' };
    return { label: 'Perlu Perhatian', emoji: '🔴', color: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30' };
  };

  const health = getHealthLabel(healthScore);

  // Animated counters (only run after data loads + mounted)
  const animPemasukan    = useCountUp(totalPemasukan, 1400, mounted);
  const animPengeluaran  = useCountUp(totalPengeluaran, 1400, mounted);
  const animTabungan     = useCountUp(totalTabungan, 1400, mounted);
  const animSaldo        = useCountUp(Math.abs(saldoBersih), 1400, mounted);
  const animHealthScore  = useCountUp(healthScore, 1000, mounted);

  return (
    <div className="space-y-7 pb-4">

      {/* ── Greeting ───────────────────────────────────────── */}
      <div className="anim-hidden animate-slideInUp animation-delay-100"
        style={{ animationFillMode: 'forwards' }}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Halo,{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                {username}
              </span>{' '}
              <span className="inline-block animate-floatY">🎮</span>
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Berikut ringkasan keuanganmu hari ini.
            </p>
          </div>
          {/* Decorative badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card border border-cyan-500/20 text-xs text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Live
          </div>
        </div>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Saldo Bersih */}
        <div
          className="sm:col-span-2 xl:col-span-1 anim-hidden animate-slideInUp animation-delay-200 stat-card"
          style={{ animationFillMode: 'forwards' }}
        >
          <div className="relative group h-full">
            {/* Background glow */}
            <div className="absolute -inset-px bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl blur-sm opacity-25 group-hover:opacity-50 transition-opacity duration-500" />
            <div className="relative glass-card rounded-2xl p-5 h-full flex flex-col gap-4"
              style={{ boxShadow: '0 8px 32px rgba(168,85,247,0.15)' }}>
              {/* Header row */}
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 shadow-lg shadow-purple-500/30 animate-pulse-glow-purple">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${saldoBersih >= 0
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-red-500/15 text-red-400 border-red-500/30'}`}>
                  {saldoBersih >= 0 ? '▲ Surplus' : '▼ Defisit'}
                </span>
              </div>
              {/* Value */}
              <div>
                <p className="text-gray-400 text-xs font-medium mb-1">Saldo Bersih</p>
                {loading
                  ? <div className="h-7 w-32 bg-slate-700/50 rounded-lg animate-pulse" />
                  : <p className={`text-2xl font-black tracking-tight ${saldoBersih >= 0 ? 'text-white' : 'text-red-400'}`}>
                      {fmtRp(animSaldo)}
                    </p>
                }
              </div>
            </div>
          </div>
        </div>

        {/* Pemasukan */}
        <StatCard
          label="Pemasukan"
          sub="Total semua pemasukan"
          value={loading ? null : fmtJuta(animPemasukan)}
          valueColor="text-cyan-400"
          gradient="from-cyan-500 to-teal-400"
          glow="rgba(34,211,238,0.2)"
          delay="animation-delay-300"
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />}
          iconBg="from-cyan-500 to-teal-400"
          trend="+12% bulan ini"
          trendUp
        />

        {/* Pengeluaran */}
        <StatCard
          label="Pengeluaran"
          sub="Total semua pengeluaran"
          value={loading ? null : fmtJuta(animPengeluaran)}
          valueColor="text-pink-400"
          gradient="from-pink-500 to-rose-500"
          glow="rgba(244,114,182,0.2)"
          delay="animation-delay-400"
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />}
          iconBg="from-pink-500 to-rose-500"
          trend="-5% vs bulan lalu"
          trendUp={false}
        />

        {/* Tabungan */}
        <StatCard
          label="Tabungan"
          sub="Total dana tersimpan"
          value={loading ? null : fmtJuta(animTabungan)}
          valueColor="text-purple-400"
          gradient="from-purple-500 to-violet-500"
          glow="rgba(168,85,247,0.2)"
          delay="animation-delay-500"
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />}
          iconBg="from-purple-500 to-violet-500"
          trend="Goals tercapai 2/4"
          trendUp
        />
      </div>

      {/* ── Financial Health ────────────────────────────────── */}
      <div
        className="anim-hidden animate-slideInUp animation-delay-600 relative group"
        style={{ animationFillMode: 'forwards' }}
      >
        <div className="absolute -inset-px bg-gradient-to-r from-purple-500/30 via-cyan-500/10 to-pink-500/30 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative glass-card rounded-2xl p-5 sm:p-6" style={{ boxShadow: '0 4px 24px rgba(15,23,42,0.5)' }}>
          <div className="flex items-start justify-between mb-5 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-white font-bold text-sm">Kesehatan Keuangan</p>
                <span className="text-base">💰</span>
              </div>
              <p className="text-gray-500 text-xs">Berdasarkan pemasukan, pengeluaran &amp; tabungan</p>
            </div>
            {loading
              ? <div className="h-10 w-20 bg-slate-700/50 rounded-xl animate-pulse" />
              : (
                <div className="text-right flex-shrink-0">
                  <p className="text-yellow-400 font-black text-3xl leading-none">
                    {animHealthScore}
                    <span className="text-gray-500 text-base font-normal">/100</span>
                  </p>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border mt-1.5 ${health.bg} ${health.color}`}>
                    {health.emoji} {health.label}
                  </span>
                </div>
              )
            }
          </div>

          {/* Progress bar */}
          <AnimatedHealthBar score={loading ? 0 : healthScore} />

          {/* Labels */}
          <div className="flex justify-between text-xs text-gray-600 mt-2 select-none">
            {['Kritis', 'Perlu Usaha', 'Cukup', 'Baik', 'Sangat Baik'].map(l => (
              <span key={l}>{l}</span>
            ))}
          </div>

          {/* Mini stat row */}
          {!loading && (
            <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-700/50">
              <MiniStat label="Rasio Hemat" value={`${totalPemasukan > 0 ? Math.round((saldoBersih / totalPemasukan) * 100) : 0}%`} color="text-cyan-400" />
              <MiniStat label="Tabungan" value={`Rp ${(totalTabungan / 1_000).toFixed(0)}k`} color="text-purple-400" />
              <MiniStat label="Pengeluaran" value={`${totalPemasukan > 0 ? Math.round((totalPengeluaran / totalPemasukan) * 100) : 0}% income`} color="text-pink-400" />
            </div>
          )}
        </div>
      </div>

      {/* ── Quick Nav ───────────────────────────────────────── */}
      <div className="anim-hidden animate-slideInUp animation-delay-700" style={{ animationFillMode: 'forwards' }}>
        <div className="flex items-center gap-3 mb-4">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Menu Utama</p>
          <div className="flex-1 h-px bg-slate-700/50" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickNav.map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              className={`group relative block anim-hidden animate-scaleIn`}
              style={{ animationDelay: `${0.65 + i * 0.08}s`, animationFillMode: 'forwards' }}
            >
              {/* Glow halo on hover */}
              <div
                className={`absolute -inset-px bg-gradient-to-br ${item.gradient} rounded-2xl blur opacity-0 group-hover:opacity-40 transition-all duration-400`}
              />
              <div
                className="relative glass-card rounded-2xl p-5 flex flex-col items-center gap-3 text-center overflow-hidden btn-ripple cursor-pointer"
                style={{ boxShadow: `0 0 0 0 ${item.glow}`, transition: 'transform 0.2s ease, box-shadow 0.3s ease' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px) scale(1.03)';
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px ${item.glow}`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = '';
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 0 ${item.glow}`;
                }}
              >
                {/* Decorative background circle */}
                <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br ${item.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />

                {/* Icon */}
                <div className={`relative p-3.5 rounded-2xl bg-gradient-to-br ${item.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  style={{ boxShadow: `0 4px 20px ${item.glow}` }}>
                  <span className="text-slate-900">{item.icon}</span>
                </div>

                {/* Label + desc */}
                <div>
                  <p className={`font-bold text-sm ${item.textColor}`}>{item.label}</p>
                  <p className="text-gray-600 text-xs mt-0.5 leading-snug">{item.desc}</p>
                </div>

                {/* Arrow indicator */}
                <div className={`absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0`}>
                  <svg className={`w-4 h-4 ${item.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="anim-hidden animate-fadeIn animation-delay-1000 text-center py-4"
        style={{ animationFillMode: 'forwards' }}>
        <div className="flex items-center justify-center gap-2">
          <div className="h-px flex-1 bg-slate-800/80" />
          <p className="text-gray-700 text-xs">Finance Quest © 2026 · by abnibsth</p>
          <div className="h-px flex-1 bg-slate-800/80" />
        </div>
      </footer>
    </div>
  );
}

/* ── Reusable Stat Card ───────────────────────────────────── */
function StatCard({
  label, sub, value, valueColor, gradient, glow, delay, icon, iconBg, trend, trendUp,
}: {
  label: string; sub: string; value: string | null;
  valueColor: string; gradient: string; glow: string; delay: string;
  icon: React.ReactNode; iconBg: string; trend: string; trendUp: boolean;
}) {
  return (
    <div className={`anim-hidden animate-slideInUp ${delay} stat-card`}
      style={{ animationFillMode: 'forwards' }}>
      <div className="relative group h-full">
        <div className={`absolute -inset-px bg-gradient-to-r ${gradient} rounded-2xl blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
        <div className="relative glass-card rounded-2xl p-5 h-full flex flex-col gap-3"
          style={{ boxShadow: `0 4px 24px ${glow}` }}>
          {/* Icon */}
          <div className="flex items-center justify-between">
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${iconBg} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <svg className="w-4.5 h-4.5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {icon}
              </svg>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${trendUp
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-pink-500/10 text-pink-400'}`}>
              {trend}
            </span>
          </div>
          {/* Value */}
          <div>
            <p className="text-gray-400 text-xs mb-1">{label}</p>
            {value === null
              ? <div className="h-6 w-20 bg-slate-700/50 rounded animate-pulse" />
              : <p className={`text-xl font-black ${valueColor}`}>{value}</p>
            }
            <p className="text-gray-600 text-xs mt-1">{sub}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Mini Stat ────────────────────────────────────────────── */
function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="text-center">
      <p className={`font-bold text-sm ${color}`}>{value}</p>
      <p className="text-gray-600 text-xs mt-0.5">{label}</p>
    </div>
  );
}
