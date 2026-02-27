'use client';

import { useEffect, useState } from 'react';

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  trend?: number; // positive = up, negative = down
  icon: React.ReactNode;
  gradient: string; // e.g. 'from-cyan-500 to-purple-500'
  glowColor: string; // e.g. 'rgba(34,211,238,0.4)'
  delay?: number;
}

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

export default function StatCard({ label, value, prefix = 'Rp', trend, icon, gradient, glowColor, delay = 0 }: StatCardProps) {
  const displayValue = useCountUp(value);

  return (
    <div
      className="relative group animate-slideInUp"
      style={{ animationDelay: `${delay}ms`, boxShadow: `0 0 24px ${glowColor}` }}
    >
      {/* Glow border */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500`} />
      <div className="relative glass-card rounded-2xl p-5 h-full">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-20`}>
            {icon}
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d={trend >= 0 ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'} />
              </svg>
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <p className="text-gray-400 text-xs font-medium mb-1">{label}</p>
        <p className="text-white text-lg sm:text-xl font-bold tracking-tight">
          {prefix} {displayValue.toLocaleString('id-ID')}
        </p>
      </div>
    </div>
  );
}
