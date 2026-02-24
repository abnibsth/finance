'use client';

import { useState } from 'react';
import StatCard from './StatCard';

const categories = [
  { name: 'Makanan & Minuman', icon: '🍜', amount: 1800000, color: 'from-orange-500 to-orange-400', max: 2500000 },
  { name: 'Transportasi', icon: '🚗', amount: 650000, color: 'from-blue-500 to-blue-400', max: 1000000 },
  { name: 'Hiburan', icon: '🎮', amount: 450000, color: 'from-purple-500 to-purple-400', max: 800000 },
  { name: 'Kesehatan', icon: '💊', amount: 300000, color: 'from-green-500 to-green-400', max: 500000 },
  { name: 'Belanja', icon: '🛍️', amount: 900000, color: 'from-pink-500 to-pink-400', max: 1500000 },
  { name: 'Tagihan', icon: '📄', amount: 750000, color: 'from-red-500 to-red-400', max: 1000000 },
];

const recentExpenses = [
  { id: 1, desc: 'Makan Siang', category: 'Makanan & Minuman', amount: 45000, date: '2026-02-24' },
  { id: 2, desc: 'Bensin', category: 'Transportasi', amount: 100000, date: '2026-02-23' },
  { id: 3, desc: 'Netflix', category: 'Hiburan', amount: 54000, date: '2026-02-22' },
  { id: 4, desc: 'Obat', category: 'Kesehatan', amount: 75000, date: '2026-02-21' },
  { id: 5, desc: 'Grab', category: 'Transportasi', amount: 35000, date: '2026-02-20' },
];

// Format angka dengan titik ribuan: 100000 → "100.000"
function formatRupiah(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function ExpenseSection() {
  const [expenses, setExpenses] = useState(recentExpenses);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ desc: '', category: 'Makanan & Minuman', amount: '', date: '' });
  const [amountDisplay, setAmountDisplay] = useState('');

  const total = categories.reduce((s, c) => s + c.amount, 0);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\./g, '').replace(/\D/g, '');
    setAmountDisplay(formatRupiah(raw));
    setForm(f => ({ ...f, amount: raw }));
  };

  const resetModal = () => {
    setForm({ desc: '', category: 'Makanan & Minuman', amount: '', date: '' });
    setAmountDisplay('');
    setShowModal(false);
  };

  const handleAdd = () => {
    if (!form.desc || !form.amount || !form.date) return;
    setExpenses(prev => [...prev, { id: Date.now(), ...form, amount: parseInt(form.amount) }]);
    resetModal();
  };

  return (
    <section id="pengeluaran" className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-pink-500/20">
            <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white" style={{ textShadow: '0 0 12px rgba(244,114,182,0.7)' }}>Pengeluaran</h2>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-pink-400 text-white font-semibold text-sm hover:shadow-lg hover:shadow-pink-500/40 transition-all duration-200 hover:scale-105">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Pengeluaran
        </button>
      </div>

      {/* Stat Card */}
      <StatCard
        label="Total Pengeluaran Bulan Ini"
        value={total}
        trend={-8}
        gradient="from-pink-500 to-rose-500"
        glowColor="rgba(244,114,182,0.2)"
        icon={
          <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4 text-sm">Breakdown Kategori</h3>
          <div className="space-y-3">
            {categories.map((cat) => {
              const pct = Math.round((cat.amount / cat.max) * 100);
              return (
                <div key={cat.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-300 text-xs flex items-center gap-2">
                      <span>{cat.icon}</span>{cat.name}
                    </span>
                    <span className="text-gray-400 text-xs">Rp{(cat.amount / 1000).toFixed(0)}rb / Rp{(cat.max / 1000).toFixed(0)}rb</span>
                  </div>
                  <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${cat.color} transition-all duration-1000 animate-slideInUp`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4 text-sm">Transaksi Terbaru</h3>
          <div className="space-y-3 overflow-y-auto custom-scrollbar max-h-48">
            {expenses.map((exp) => {
              const cat = categories.find(c => c.name === exp.category);
              return (
                <div key={exp.id} className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{categories.find(c => c.name === exp.category)?.icon || '💳'}</span>
                    <div>
                      <p className="text-white text-sm font-medium">{exp.desc}</p>
                      <p className="text-gray-500 text-xs">{exp.date}</p>
                    </div>
                  </div>
                  <span className="text-pink-400 font-semibold text-sm">-Rp {exp.amount.toLocaleString('id-ID')}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={resetModal} />
          <div className="relative glass-card rounded-2xl p-6 w-full max-w-md border border-pink-500/30 shadow-2xl shadow-pink-500/20 animate-slideInUp">
            <h3 className="text-white font-bold text-lg mb-5" style={{ textShadow: '0 0 10px rgba(244,114,182,0.6)' }}>Tambah Pengeluaran</h3>
            <div className="space-y-4">
              {/* Keterangan */}
              <div>
                <label className="block text-gray-300 text-sm mb-1">Keterangan</label>
                <input type="text" placeholder="Makan siang, bensin..."
                  value={form.desc}
                  onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                  className="w-full bg-slate-800/60 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500" />
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
                    className="w-full bg-slate-800/60 border border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500" />
                </div>
              </div>
              {/* Tanggal */}
              <div>
                <label className="block text-gray-300 text-sm mb-1">Tanggal</label>
                <input type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full bg-slate-800/60 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500" />
              </div>
              {/* Kategori */}
              <div>
                <label className="block text-gray-300 text-sm mb-1">Kategori</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full bg-slate-800/60 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500">
                  {categories.map(c => <option key={c.name}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={resetModal}
                className="flex-1 py-2.5 rounded-xl border border-slate-600 text-gray-400 text-sm hover:text-white transition-all">
                Batal
              </button>
              <button onClick={handleAdd}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-pink-400 text-white font-semibold text-sm hover:shadow-lg hover:shadow-pink-500/40 transition-all">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
