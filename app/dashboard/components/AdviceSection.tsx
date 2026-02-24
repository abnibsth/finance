'use client';

interface Advice {
  type: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  icon: string;
  action?: string;
}

function generateAdvice(income: number, expense: number, savings: number): Advice[] {
  const ratio = expense / income;
  const savingRate = savings / income;
  const advices: Advice[] = [];

  if (ratio > 0.8) {
    advices.push({
      type: 'danger',
      title: '⚠️ Pengeluaran Terlalu Tinggi!',
      message: `Pengeluaran kamu mencapai ${Math.round(ratio * 100)}% dari pemasukan. Idealnya pengeluaran tidak lebih dari 70% agar kamu bisa menabung.`,
      icon: '🚨',
      action: 'Kurangi pengeluaran hiburan & belanja sekarang!',
    });
  } else if (ratio > 0.6) {
    advices.push({
      type: 'warning',
      title: '⚡ Pengeluaran Cukup Besar',
      message: `Pengeluaran kamu ada di ${Math.round(ratio * 100)}% dari pemasukan. Masih aman, tapi coba tekan ke bawah 60% untuk mulai berinvestasi.`,
      icon: '⚡',
      action: 'Evaluasi pengeluaran non-esensial bulan ini.',
    });
  } else {
    advices.push({
      type: 'success',
      title: '✨ Keuangan Kamu Sehat!',
      message: `Keren! Pengeluaran kamu hanya ${Math.round(ratio * 100)}% dari pemasukan. Kamu punya ruang yang baik untuk menabung dan berinvestasi.`,
      icon: '🏆',
      action: 'Alokasikan surplus untuk investasi reksa dana.',
    });
  }

  if (savingRate < 0.1) {
    advices.push({
      type: 'danger',
      title: '📉 Tabungan Masih Sangat Rendah',
      message: 'Tingkat tabunganmu di bawah 10%. Coba terapkan metode 50/30/20: 50% kebutuhan, 30% keinginan, 20% tabungan.',
      icon: '💡',
      action: 'Mulai autodebet tabungan di awal bulan.',
    });
  } else if (savingRate < 0.2) {
    advices.push({
      type: 'warning',
      title: '📊 Tabungan Bisa Lebih Baik',
      message: 'Kamu sudah menabung, tapi kalau bisa dorong ke 20% atau lebih dari pemasukan untuk masa depan yang lebih aman.',
      icon: '📊',
      action: `Target: Rp ${(income * 0.2).toLocaleString('id-ID')} / bulan`,
    });
  } else {
    advices.push({
      type: 'success',
      title: '💰 Tabungan Sudah Bagus!',
      message: `Tingkat tabunganmu ${Math.round(savingRate * 100)}% – di atas rata-rata! Pertimbangkan untuk mulai diversifikasi ke investasi seperti saham atau obligasi.`,
      icon: '💰',
    });
  }

  advices.push({
    type: 'info',
    title: '🎯 Tips Level Up Keuangan',
    message: 'Investasikan minimal 10% pendapatanmu ke reksa dana indeks atau saham untuk pertumbuhan jangka panjang. Waktu adalah aset terbesar investor.',
    icon: '🚀',
    action: 'Buka rekening sekuritas dan mulai hari ini!',
  });

  advices.push({
    type: 'info',
    title: '🛡️ Dana Darurat',
    message: 'Pastikan dana daruratmu minimal 3–6x pengeluaran bulanan tersimpan di tabungan yang mudah dicairkan (bukan deposito).',
    icon: '🛡️',
    action: `Target dana darurat: Rp ${(expense * 6).toLocaleString('id-ID')}`,
  });

  return advices;
}

const typeStyle = {
  success: {
    border: 'border-green-500/30',
    bg: 'bg-green-500/10',
    badge: 'bg-green-500/20 text-green-400',
    glow: '0 0 20px rgba(74,222,128,0.1)',
    dot: 'bg-green-400',
    label: 'BAIK',
  },
  warning: {
    border: 'border-yellow-500/30',
    bg: 'bg-yellow-500/10',
    badge: 'bg-yellow-500/20 text-yellow-400',
    glow: '0 0 20px rgba(250,204,21,0.1)',
    dot: 'bg-yellow-400',
    label: 'PERHATIAN',
  },
  danger: {
    border: 'border-red-500/30',
    bg: 'bg-red-500/10',
    badge: 'bg-red-500/20 text-red-400',
    glow: '0 0 20px rgba(239,68,68,0.1)',
    dot: 'bg-red-400',
    label: 'BERBAHAYA',
  },
  info: {
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/10',
    badge: 'bg-cyan-500/20 text-cyan-400',
    glow: '0 0 20px rgba(34,211,238,0.1)',
    dot: 'bg-cyan-400',
    label: 'TIPS',
  },
};

const INCOME = 12350000;
const EXPENSE = 4850000;
const SAVINGS = 37700000;

const LEVEL_THRESHOLDS = [
  { min: 0, label: 'Pemula 🐣', color: 'text-gray-400' },
  { min: 20, label: 'Menabung 🌱', color: 'text-green-400' },
  { min: 40, label: 'Hemat 💪', color: 'text-cyan-400' },
  { min: 60, label: 'Bijak 🧠', color: 'text-purple-400' },
  { min: 80, label: 'Master 👑', color: 'text-yellow-400' },
];

export default function AdviceSection() {
  const advices = generateAdvice(INCOME, EXPENSE, SAVINGS);
  const savingRate = Math.round((SAVINGS / (INCOME * 12)) * 100);
  const score = Math.min(100, Math.round(((1 - EXPENSE / INCOME) * 50) + (savingRate * 0.5)));
  const level = LEVEL_THRESHOLDS.filter(l => score >= l.min).at(-1)!;

  return (
    <section id="saran" className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-yellow-500/20">
          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white" style={{ textShadow: '0 0 12px rgba(250,204,21,0.7)' }}>Saran Keuangan</h2>
      </div>

      {/* Financial Score Card */}
      <div className="glass-card rounded-2xl p-6 border border-yellow-500/20" style={{ boxShadow: '0 0 30px rgba(250,204,21,0.08)' }}>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-shrink-0 text-center">
            <div className="relative w-28 h-28 mx-auto">
              {/* Outer ring */}
              <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
                <circle cx="50" cy="50" r="42" fill="none"
                  stroke="url(#scoreGrad)" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - score / 100)}`}
                  style={{ transition: 'stroke-dashoffset 1.5s ease' }} />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-yellow-400">{score}</span>
                <span className="text-gray-400 text-xs">/ 100</span>
              </div>
            </div>
            <p className="text-gray-400 text-xs mt-2">Financial Score</p>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <span className={`text-2xl font-black ${level.color}`}>{level.label}</span>
            </div>
            <p className="text-gray-400 text-sm">
              Keuanganmu berada di level <span className={`font-bold ${level.color}`}>{level.label}</span>.
              {score >= 60
                ? ' Terus pertahankan kebiasaan finansialmu yang baik!'
                : ' Masih ada ruang untuk berkembang — simak saran di bawah ini.'}
            </p>
            {/* Score bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Skor Keuangan</span>
                <span className="text-yellow-400 font-semibold">{score}/100</span>
              </div>
              <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-amber-400 transition-all duration-1000"
                  style={{ width: `${score}%` }} />
              </div>
              <div className="flex justify-between text-xs mt-1 text-gray-600">
                <span>0</span><span>20</span><span>40</span><span>60</span><span>80</span><span>100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advice Cards */}
      <div className="space-y-4">
        {advices.map((adv, i) => {
          const s = typeStyle[adv.type];
          return (
            <div key={i}
              className={`glass-card rounded-2xl p-5 border ${s.border} ${s.bg} animate-slideInUp`}
              style={{ animationDelay: `${i * 120}ms`, boxShadow: s.glow }}>
              <div className="flex items-start gap-4">
                <div className={`w-2 h-2 rounded-full ${s.dot} mt-2 flex-shrink-0 animate-pulse`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h4 className="text-white font-semibold text-sm">{adv.title}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${s.badge}`}>{s.label}</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{adv.message}</p>
                  {adv.action && (
                    <div className={`mt-3 text-xs font-semibold ${s.badge.split(' ')[1]} flex items-center gap-1.5`}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      {adv.action}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
