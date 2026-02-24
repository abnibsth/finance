'use client';

import { useState } from 'react';
import StatCard from './StatCard';

const initialIncomes = [
  { id: 1, source: 'Gaji Bulanan', category: 'Gaji', amount: 8500000, date: '2026-02-01' },
  { id: 2, source: 'Freelance Web', category: 'Freelance', amount: 2000000, date: '2026-02-08' },
  { id: 3, source: 'Dividen Saham', category: 'Investasi', amount: 350000, date: '2026-02-14' },
  { id: 4, source: 'Bonus Proyek', category: 'Bonus', amount: 1500000, date: '2026-02-19' },
];

const weeklyData = [
  { week: 'M1', amount: 8500000 },
  { week: 'M2', amount: 2000000 },
  { week: 'M3', amount: 350000 },
  { week: 'M4', amount: 1500000 },
];

const maxWeekly = Math.max(...weeklyData.map(w => w.amount));

const categoryColors: Record<string, string> = {
  Gaji: 'from-cyan-500 to-cyan-400',
  Freelance: 'from-purple-500 to-purple-400',
  Investasi: 'from-pink-500 to-pink-400',
  Bonus: 'from-yellow-500 to-yellow-400',
};

// Format angka dengan titik ribuan: 100000 → "100.000"
function formatRupiah(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function IncomeSection() {
  const [incomes, setIncomes] = useState(initialIncomes);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ source: '', category: 'Gaji', amount: '', date: '' });
  const [amountDisplay, setAmountDisplay] = useState('');

  const total = incomes.reduce((s, i) => s + i.amount, 0);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\./g, '').replace(/\D/g, '');
    setAmountDisplay(formatRupiah(raw));
    setForm(f => ({ ...f, amount: raw }));
  };

  const resetModal = () => {
    setForm({ source: '', category: 'Gaji', amount: '', date: '' });
    setAmountDisplay('');
    setShowModal(false);
  };

  const handleAdd = () => {
    if (!form.source || !form.amount || !form.date) return;
    setIncomes(prev => [...prev, { id: Date.now(), ...form, amount: parseInt(form.amount) }]);
    resetModal();
  };

  return (
    <section id="pemasukan" className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20">
            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white text-glow-cyan">Pemasukan</h2>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-900 font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/40 transition-all duration-200 hover:scale-105">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Pemasukan
        </button>
      </div>

      {/* Stat Card */}
      <StatCard
        label="Total Pemasukan Bulan Ini"
        value={total}
        trend={12}
        gradient="from-cyan-500 to-cyan-400"
        glowColor="rgba(34,211,238,0.2)"
        icon={
          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Bar Chart */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4 text-sm">Grafik Mingguan</h3>
          <div className="flex items-end gap-3 h-32">
            {weeklyData.map((w, i) => {
              const pct = (w.amount / maxWeekly) * 100;
              return (
                <div key={w.week} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-cyan-400 text-xs font-semibold">
                    {(w.amount / 1000000).toFixed(1)}jt
                  </span>
                  <div className="w-full rounded-t-lg overflow-hidden" style={{ height: '80px', display: 'flex', alignItems: 'flex-end' }}>
                    <div
                      className={`w-full rounded-t-lg bg-gradient-to-t from-cyan-600 to-cyan-400 transition-all duration-1000 animate-slideInUp`}
                      style={{ height: `${pct}%`, animationDelay: `${i * 100}ms` }}
                    />
                  </div>
                  <span className="text-gray-400 text-xs">{w.week}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4 text-sm">Transaksi Terbaru</h3>
          <div className="space-y-3 overflow-y-auto custom-scrollbar max-h-40">
            {incomes.map((inc) => (
              <div key={inc.id} className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${categoryColors[inc.category] || 'from-gray-500 to-gray-400'}`} />
                  <div>
                    <p className="text-white text-sm font-medium">{inc.source}</p>
                    <p className="text-gray-500 text-xs">{inc.date}</p>
                  </div>
                </div>
                <span className="text-cyan-400 font-semibold text-sm">+Rp {inc.amount.toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Income Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={resetModal} />
          <div className="relative glass-card rounded-2xl p-6 w-full max-w-md border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 animate-slideInUp">
            <h3 className="text-white font-bold text-lg mb-5 text-glow-cyan">Tambah Pemasukan</h3>
            <div className="space-y-4">
              {/* Sumber */}
              <div>
                <label className="block text-gray-300 text-sm mb-1">Sumber</label>
                <input type="text" placeholder="Gaji, Freelance..."
                  value={form.source}
                  onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                  className="w-full bg-slate-800/60 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
              {/* Jumlah — auto-format titik ribuan */}
              <div>
                <label className="block text-gray-300 text-sm mb-1">Jumlah (Rp)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 text-sm font-medium pointer-events-none">Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={amountDisplay}
                    onChange={handleAmountChange}
                    className="w-full bg-slate-800/60 border border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
              </div>
              {/* Tanggal */}
              <div>
                <label className="block text-gray-300 text-sm mb-1">Tanggal</label>
                <input type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full bg-slate-800/60 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
              {/* Kategori */}
              <div>
                <label className="block text-gray-300 text-sm mb-1">Kategori</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full bg-slate-800/60 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  {['Gaji', 'Freelance', 'Investasi', 'Bonus', 'Lainnya'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={resetModal}
                className="flex-1 py-2.5 rounded-xl border border-slate-600 text-gray-400 text-sm hover:text-white hover:border-slate-500 transition-all">
                Batal
              </button>
              <button onClick={handleAdd}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-900 font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/40 transition-all">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
