'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const navItems = [
  {
    id: 'overview',
    label: 'Home',
    href: '/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'pemasukan',
    label: 'Pemasukan',
    href: '/dashboard/pemasukan',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    id: 'pengeluaran',
    label: 'Pengeluaran',
    href: '/dashboard/pengeluaran',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
      </svg>
    ),
  },
  {
    id: 'tabungan',
    label: 'Tabungan',
    href: '/dashboard/tabungan',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    id: 'saran',
    label: 'Saran',
    href: '/dashboard/saran',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
];

const activeStyle: Record<string, string> = {
  '/dashboard':           'bg-slate-700/60 text-white border-l-2 md:border-l-2 border-white',
  '/dashboard/pemasukan': 'bg-cyan-500/15 text-cyan-400 border-l-2 md:border-l-2 border-cyan-400',
  '/dashboard/pengeluaran': 'bg-pink-500/15 text-pink-400 border-l-2 md:border-l-2 border-pink-400',
  '/dashboard/tabungan':  'bg-purple-500/15 text-purple-400 border-l-2 md:border-l-2 border-purple-400',
  '/dashboard/saran':     'bg-yellow-500/15 text-yellow-400 border-l-2 md:border-l-2 border-yellow-400',
};

const iconStyle: Record<string, string> = {
  '/dashboard':           'text-white',
  '/dashboard/pemasukan': 'text-cyan-400',
  '/dashboard/pengeluaran': 'text-pink-400',
  '/dashboard/tabungan':  'text-purple-400',
  '/dashboard/saran':     'text-yellow-400',
};

const bottomNavColor: Record<string, string> = {
  '/dashboard':           'text-white',
  '/dashboard/pemasukan': 'text-cyan-400',
  '/dashboard/pengeluaran': 'text-pink-400',
  '/dashboard/tabungan':  'text-purple-400',
  '/dashboard/saran':     'text-yellow-400',
};

function useNow() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(t); }, []);
  return now;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState('Adventurer');
  const now = useNow();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', session.user.id)
        .single();
      if (profile?.username) setUsername(profile.username);
    };
    init();
  }, [router]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const dateStr = now.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  // Page title derived from path
  const pageTitles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/dashboard/pemasukan': 'Pemasukan',
    '/dashboard/pengeluaran': 'Pengeluaran',
    '/dashboard/tabungan': 'Tabungan & Goals',
    '/dashboard/saran': 'Saran Keuangan',
  };
  const pageTitle = pageTitles[pathname] ?? 'Dashboard';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950 flex">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f10_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f10_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* ── Mobile Sidebar Overlay ── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed top-0 left-0 h-full z-50 flex flex-col transition-all duration-300 glass-card border-r border-slate-700/50
        ${/* Mobile: slide in/out */''}
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        w-60
        ${/* Desktop: normal sidebar behavior */''}
        md:translate-x-0 md:z-30
        ${sidebarOpen ? 'md:w-60' : 'md:w-16'}
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-700/50 h-16 flex-shrink-0">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 animate-pulse-glow">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          {(sidebarOpen || mobileMenuOpen) && (
            <span className="font-bold text-sm tracking-wide bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Finance Quest
            </span>
          )}
          {/* Close button for mobile */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="ml-auto p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-slate-700/40 transition-all md:hidden"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${isActive ? activeStyle[item.href] : 'text-gray-400 hover:text-gray-200 hover:bg-slate-700/30'}`}
              >
                <span className={`flex-shrink-0 transition-colors ${isActive ? iconStyle[item.href] : 'group-hover:text-gray-200'}`}>
                  {item.icon}
                </span>
                {(sidebarOpen || mobileMenuOpen) && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle — desktop only */}
        <div className="p-3 border-t border-slate-700/50 flex-shrink-0 hidden md:block">
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-slate-700/30 transition-all text-xs"
          >
            <svg className={`w-4 h-4 transition-transform duration-300 ${sidebarOpen ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            {sidebarOpen && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className={`flex-1 transition-all duration-300 relative z-10 flex flex-col min-h-screen pb-20 md:pb-0 ${sidebarOpen ? 'md:ml-60' : 'md:ml-16'}`}>
        {/* Header */}
        <header className="sticky top-0 z-20 glass-card border-b border-slate-700/50 px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between flex-shrink-0 gap-2">
          {/* Left side: hamburger + page info */}
          <div className="flex items-center gap-2 min-w-0">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-slate-700/40 transition-all md:hidden flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="min-w-0">
              <h1 className="text-white font-bold text-sm sm:text-base truncate">{pageTitle}</h1>
              <p className="text-gray-500 text-xs truncate whitespace-nowrap">{dateStr} · {timeStr} WIB</p>
            </div>
          </div>

          {/* Right side: notification + user + logout */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-slate-700/40 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            </button>
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-700/50">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-purple-500/30">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-white text-sm font-semibold leading-none">{username}</p>
                <p className="text-gray-500 text-xs mt-0.5">Level 3 · Hemat 💪</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-gray-500 hover:text-red-400 transition-colors px-1 sm:px-2 flex items-center gap-1 group"
            >
              <svg className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-4 sm:p-6 max-w-5xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 glass-card border-t border-slate-700/50 md:hidden">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200
                  ${isActive ? bottomNavColor[item.href] : 'text-gray-500 hover:text-gray-300'}`}
              >
                <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                  {item.icon}
                </span>
                <span className={`text-xs font-medium ${isActive ? '' : 'text-gray-500'}`}>
                  {item.label.length > 6 ? item.label.substring(0, 5) + '.' : item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
