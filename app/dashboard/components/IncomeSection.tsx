'use client';

import { useState, useEffect } from 'react';
import StatCard from './StatCard';
import { supabase } from '@/lib/supabase';

type Income = {
  id: string;
  source: string;
  category: string;
  amount: number;
  date: string;
};

const categoryColors: Record<string, string> = {
  Gaji: 'from-cyan-500 to-cyan-400',
  Freelance: 'from-purple-500 to-purple-400',
  Investasi: 'from-pink-500 to-pink-400',
  Bonus: 'from-yellow-500 to-yellow-400',
  Lainnya: 'from-gray-500 to-gray-400',
};

function formatRupiah(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function IncomeSection() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ source: '', category: 'Gaji', amount: '', date: '' });
  const [amountDisplay, setAmountDisplay] = useState('');
  const [saving, setSaving] = useState(false);

  const total = incomes.reduce((s, i) => s + i.amount, 0);

  // Fetch from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase
        .from('pemasukan')
        .select('*')
        .eq('user_id', session.user.id)
        .order('date', { ascending: false });
      if (data) setIncomes(data);
      setLoading(false);
    };
    fetchData();
  }, []);

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

  const handleAdd = async () => {
    if (!form.source || !form.amount || !form.date) return;
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data, error } = await supabase.from('pemasukan').insert({
      user_id: session.user.id,
      source: form.source,
      category: form.category,
      amount: parseInt(form.amount),
      date: form.date,
    }).select().single();
    if (!error && data) {
      setIncomes(prev => [data, ...prev]);
    }
    setSaving(false);
    resetModal();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('pemasukan').delete().eq('id', id);
    setIncomes(prev => prev.filter(i => i.id !== id));
  };

  // Build chart from actual data (last 5)
  const chartData = [...incomes].slice(0, 5).reverse();
  const maxAmount = Math.max(...chartData.map(i => i.amount), 1);

  return (
    <section id="pemasukan" className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20">
            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white text-glow-cyan">Pemasukan</h2>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-900 font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/40 transition-all duration-200 hover:scale-105">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Tambah Pemasukan</span><span className="sm:hidden">Tambah</span>
        </button>
      </div>

      {/* Stat Card */}
      <StatCard
        label="Total Pemasukan Bulan Ini"
        value={total}
        trend={0}
        gradient="from-cyan-500 to-cyan-400"
        glowColor="rgba(34,211,238,0.2)"
        icon={
          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4 text-sm">Grafik Pemasukan Terbaru</h3>
          {loading ? (
            <div className="h-32 flex items-center justify-center text-gray-500 text-sm">Memuat data…</div>
          ) : chartData.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-gray-500 text-sm">Belum ada data</div>
          ) : (
            <div className="flex items-end gap-3 h-32">
              {chartData.map((inc, i) => {
                const pct = (inc.amount / maxAmount) * 100;
                return (
                  <div key={inc.id} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-cyan-400 text-xs font-semibold">
                      {(inc.amount / 1000000).toFixed(1)}jt
                    </span>
                    <div className="w-full rounded-t-lg overflow-hidden" style={{ height: '80px', display: 'flex', alignItems: 'flex-end' }}>
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-cyan-600 to-cyan-400 transition-all duration-1000 animate-slideInUp"
                        style={{ height: `${pct}%`, animationDelay: `${i * 100}ms` }}
                      />
                    </div>
                    <span className="text-gray-400 text-xs truncate w-full text-center">{inc.source.substring(0, 5)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4 text-sm">Transaksi Terbaru</h3>
          {loading ? (
            <div className="text-gray-500 text-sm text-center py-6">Memuat data…</div>
          ) : incomes.length === 0 ? (
            <div className="text-gray-500 text-sm text-center py-6">Belum ada pemasukan</div>
          ) : (
            <div className="space-y-3 overflow-y-auto custom-scrollbar max-h-40">
              {incomes.map((inc) => (
                <div key={inc.id} className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0 group">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${categoryColors[inc.category] || 'from-gray-500 to-gray-400'}`} />
                    <div>
                      <p className="text-white text-sm font-medium">{inc.source}</p>
                      <p className="text-gray-500 text-xs">{inc.date} · {inc.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-semibold text-sm">+Rp {inc.amount.toLocaleString('id-ID')}</span>
                    <button
                      onClick={() => handleDelete(inc.id)}
                      className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all text-xs"
                      title="Hapus"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Income Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={resetModal} />
          <div className="relative glass-card rounded-2xl p-6 w-full max-w-md border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 animate-slideInUp">
            <h3 className="text-white font-bold text-lg mb-5 text-glow-cyan">Tambah Pemasukan</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Sumber</label>
                <input type="text" placeholder="Gaji, Freelance..."
                  value={form.source}
                  onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                  className="w-full bg-slate-800/60 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Jumlah (Rp)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 text-sm font-medium pointer-events-none">Rp</span>
                  <input
                    type="text" inputMode="numeric" placeholder="0"
                    value={amountDisplay} onChange={handleAmountChange}
                    className="w-full bg-slate-800/60 border border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Tanggal</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full bg-slate-800/60 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
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
              <button onClick={handleAdd} disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-900 font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/40 transition-all disabled:opacity-60">
                {saving ? 'Menyimpan…' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
