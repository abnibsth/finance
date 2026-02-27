'use client';

import { useState, useEffect } from 'react';
import StatCard from './StatCard';
import { supabase } from '@/lib/supabase';

type Goal = {
  id: string;
  name: string;
  target: number;
  saved: number;
  icon: string;
  color: string;
};

function CircularProgress({ percentage, size = 120, stroke = 10 }: { percentage: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percentage / 100) * circ;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="url(#savingsGrad)" strokeWidth={stroke}
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1.5s ease' }}
      />
      <defs>
        <linearGradient id="savingsGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function formatRupiah(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

const goalColors = [
  'from-cyan-500 to-cyan-400',
  'from-purple-500 to-purple-400',
  'from-pink-500 to-pink-400',
  'from-yellow-500 to-yellow-400',
  'from-green-500 to-green-400',
  'from-orange-500 to-orange-400',
];

export default function SavingsSection() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [form, setForm] = useState({ name: '', target: '', saved: '', icon: '🎯' });
  const [editForm, setEditForm] = useState({ name: '', target: '', saved: '', icon: '🎯' });
  const [targetDisplay, setTargetDisplay] = useState('');
  const [savedDisplay, setSavedDisplay] = useState('');
  const [editTargetDisplay, setEditTargetDisplay] = useState('');
  const [editSavedDisplay, setEditSavedDisplay] = useState('');
  const [saving, setSaving] = useState(false);

  const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const overallPct = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase
        .from('tabungan')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: true });
      if (data) setGoals(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // ── Add modal handlers ──
  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\./g, '').replace(/\D/g, '');
    setTargetDisplay(formatRupiah(raw));
    setForm(f => ({ ...f, target: raw }));
  };

  const handleSavedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\./g, '').replace(/\D/g, '');
    setSavedDisplay(formatRupiah(raw));
    setForm(f => ({ ...f, saved: raw }));
  };

  const resetModal = () => {
    setForm({ name: '', target: '', saved: '', icon: '🎯' });
    setTargetDisplay('');
    setSavedDisplay('');
    setShowModal(false);
  };

  const handleAdd = async () => {
    if (!form.name || !form.target) return;
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const colorIndex = goals.length % goalColors.length;
    const { data, error } = await supabase.from('tabungan').insert({
      user_id: session.user.id,
      name: form.name,
      target: parseInt(form.target),
      saved: parseInt(form.saved) || 0,
      icon: form.icon,
      color: goalColors[colorIndex],
    }).select().single();
    if (!error && data) {
      setGoals(prev => [...prev, data]);
    }
    setSaving(false);
    resetModal();
  };

  // ── Edit modal handlers ──
  const openEditModal = (goal: Goal) => {
    setEditingGoal(goal);
    setEditForm({
      name: goal.name,
      target: String(goal.target),
      saved: String(goal.saved),
      icon: goal.icon,
    });
    setEditTargetDisplay(formatRupiah(String(goal.target)));
    setEditSavedDisplay(formatRupiah(String(goal.saved)));
    setShowEditModal(true);
  };

  const handleEditTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\./g, '').replace(/\D/g, '');
    setEditTargetDisplay(formatRupiah(raw));
    setEditForm(f => ({ ...f, target: raw }));
  };

  const handleEditSavedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\./g, '').replace(/\D/g, '');
    setEditSavedDisplay(formatRupiah(raw));
    setEditForm(f => ({ ...f, saved: raw }));
  };

  const resetEditModal = () => {
    setEditingGoal(null);
    setEditForm({ name: '', target: '', saved: '', icon: '🎯' });
    setEditTargetDisplay('');
    setEditSavedDisplay('');
    setShowEditModal(false);
  };

  const handleUpdate = async () => {
    if (!editingGoal || !editForm.name || !editForm.target) return;
    setSaving(true);
    const { data, error } = await supabase
      .from('tabungan')
      .update({
        name: editForm.name,
        target: parseInt(editForm.target),
        saved: parseInt(editForm.saved) || 0,
        icon: editForm.icon,
      })
      .eq('id', editingGoal.id)
      .select()
      .single();
    if (!error && data) {
      setGoals(prev => prev.map(g => g.id === editingGoal.id ? data : g));
    }
    setSaving(false);
    resetEditModal();
  };

  // ── Delete handler ──
  const handleDelete = async (id: string) => {
    await supabase.from('tabungan').delete().eq('id', id);
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  return (
    <section id="tabungan" className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/20">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white text-glow-purple">Tabungan & Goals</h2>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-400 text-white font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/40 transition-all duration-200 hover:scale-105">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Tambah Goal</span><span className="sm:hidden">Tambah</span>
        </button>
      </div>

      {/* Overview Ring */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative flex-shrink-0">
            <CircularProgress percentage={overallPct} size={130} stroke={12} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">{overallPct}%</span>
              <span className="text-gray-400 text-xs">Tercapai</span>
            </div>
          </div>
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <p className="text-gray-400 text-sm">Total Tabungan</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Rp {totalSaved.toLocaleString('id-ID')}
            </p>
            <p className="text-gray-500 text-sm">dari target Rp {totalTarget.toLocaleString('id-ID')}</p>
            <div className="flex gap-4 pt-2 justify-center sm:justify-start">
              <div className="text-center">
                <p className="text-cyan-400 font-bold">{goals.filter(g => g.saved >= g.target).length}</p>
                <p className="text-gray-500 text-xs">Goals Tercapai</p>
              </div>
              <div className="text-center">
                <p className="text-purple-400 font-bold">{goals.filter(g => g.saved < g.target).length}</p>
                <p className="text-gray-500 text-xs">On Progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      {loading ? (
        <div className="text-gray-500 text-sm text-center py-6">Memuat data…</div>
      ) : goals.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center text-gray-500 text-sm">
          Belum ada goal tabungan. Tambahkan goal pertamamu!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {goals.map((goal, i) => {
            const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100));
            const done = pct >= 100;
            return (
              <div key={goal.id}
                className={`glass-card rounded-2xl p-5 animate-slideInUp border ${done ? 'border-green-500/30' : 'border-slate-700/30'} group`}
                style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{goal.icon}</span>
                    <div>
                      <p className="text-white font-semibold text-sm">{goal.name}</p>
                      <p className="text-gray-500 text-xs">Target: Rp {(goal.target / 1000000).toFixed(1)}jt</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {done && (
                      <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-0.5 rounded-full">✓ Done</span>
                    )}
                    {/* Edit button */}
                    <button
                      onClick={() => openEditModal(goal)}
                      className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1 rounded-lg text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-all"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all text-sm"
                      title="Hapus"
                    >
                      ×
                    </button>
                  </div>
                </div>
                {/* Saved amount display */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Rp {goal.saved.toLocaleString('id-ID')}</span>
                    <span className={`font-semibold ${done ? 'text-green-400' : 'text-purple-400'}`}>{pct}%</span>
                  </div>
                  <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${done ? 'from-green-500 to-green-400' : goal.color} transition-all duration-1000`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                {/* Quick add button */}
                <button
                  onClick={() => openEditModal(goal)}
                  className="w-full mt-2 py-1.5 rounded-lg border border-slate-700/50 text-gray-400 hover:text-purple-400 hover:border-purple-500/30 transition-all text-xs flex items-center justify-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Update Tabungan
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add Goal Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={resetModal} />
          <div className="relative glass-card rounded-2xl p-6 w-full max-w-md border border-purple-500/30 shadow-2xl shadow-purple-500/20 animate-slideInUp">
            <h3 className="text-white font-bold text-lg mb-5 text-glow-purple">Tambah Goal Tabungan</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Nama Goal</label>
                <input type="text" placeholder="Liburan, Gadget, Dana Darurat..."
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-slate-800/60 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Target (Rp)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 text-sm font-medium pointer-events-none">Rp</span>
                  <input type="text" inputMode="numeric" placeholder="0"
                    value={targetDisplay} onChange={handleTargetChange}
                    className="w-full bg-slate-800/60 border border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Sudah Ditabung (Rp)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 text-sm font-medium pointer-events-none">Rp</span>
                  <input type="text" inputMode="numeric" placeholder="0"
                    value={savedDisplay} onChange={handleSavedChange}
                    className="w-full bg-slate-800/60 border border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Icon Emoji</label>
                <input type="text" maxLength={2}
                  value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                  className="w-full bg-slate-800/60 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={resetModal}
                className="flex-1 py-2.5 rounded-xl border border-slate-600 text-gray-400 text-sm hover:text-white transition-all">Batal</button>
              <button onClick={handleAdd} disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-purple-400 text-white font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/40 transition-all disabled:opacity-60">
                {saving ? 'Menyimpan…' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Goal Modal ── */}
      {showEditModal && editingGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={resetEditModal} />
          <div className="relative glass-card rounded-2xl p-6 w-full max-w-md border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 animate-slideInUp">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">{editingGoal.icon}</span>
              <div>
                <h3 className="text-white font-bold text-lg text-glow-cyan">Edit Goal</h3>
                <p className="text-gray-500 text-xs">Update progres tabunganmu</p>
              </div>
            </div>

            {/* Current progress indicator */}
            <div className="glass-card rounded-xl p-3 mb-4 border border-slate-700/30">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-400">Progres saat ini</span>
                <span className="text-purple-400 font-semibold">
                  {Math.min(100, Math.round((editingGoal.saved / editingGoal.target) * 100))}%
                </span>
              </div>
              <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${editingGoal.color} transition-all duration-500`}
                  style={{ width: `${Math.min(100, Math.round((editingGoal.saved / editingGoal.target) * 100))}%` }}
                />
              </div>
              <p className="text-gray-500 text-xs mt-1.5">
                Rp {editingGoal.saved.toLocaleString('id-ID')} dari Rp {editingGoal.target.toLocaleString('id-ID')}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Nama Goal</label>
                <input type="text" placeholder="Nama goal..."
                  value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-slate-800/60 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Target (Rp)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 text-sm font-medium pointer-events-none">Rp</span>
                  <input type="text" inputMode="numeric" placeholder="0"
                    value={editTargetDisplay} onChange={handleEditTargetChange}
                    className="w-full bg-slate-800/60 border border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1 flex items-center gap-2">
                  Sudah Ditabung (Rp)
                  <span className="text-cyan-400 text-xs font-normal">← update di sini</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 text-sm font-medium pointer-events-none">Rp</span>
                  <input type="text" inputMode="numeric" placeholder="0"
                    value={editSavedDisplay} onChange={handleEditSavedChange}
                    className="w-full bg-slate-800/60 border border-cyan-500/30 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Icon Emoji</label>
                <input type="text" maxLength={2}
                  value={editForm.icon} onChange={e => setEditForm(f => ({ ...f, icon: e.target.value }))}
                  className="w-full bg-slate-800/60 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={resetEditModal}
                className="flex-1 py-2.5 rounded-xl border border-slate-600 text-gray-400 text-sm hover:text-white transition-all">Batal</button>
              <button onClick={handleUpdate} disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-900 font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/40 transition-all disabled:opacity-60">
                {saving ? 'Menyimpan…' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
