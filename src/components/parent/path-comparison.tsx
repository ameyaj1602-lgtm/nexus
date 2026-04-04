'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

const paths = [
  { name: 'Engineering (BTech)', duration: '4 years', cost: '₹4-15L', salary: '₹4-12L/yr', aiRisk: 35, jobs: 'High', growth: 'Stable' },
  { name: 'Medicine (MBBS+MD)', duration: '8-10 years', cost: '₹20-80L', salary: '₹6-20L/yr', aiRisk: 15, jobs: 'High', growth: 'Stable' },
  { name: 'Commerce / CA', duration: '5 years', cost: '₹2-5L', salary: '₹7-20L/yr', aiRisk: 45, jobs: 'High', growth: 'Stable' },
  { name: 'Design (BDes)', duration: '4 years', cost: '₹4-12L', salary: '₹4-15L/yr', aiRisk: 30, jobs: 'Rising', growth: 'Rising' },
  { name: 'Computer Science', duration: '4 years', cost: '₹4-15L', salary: '₹6-25L/yr', aiRisk: 30, jobs: 'Very High', growth: 'Rising' },
  { name: 'Humanities / Law', duration: '3-5 years', cost: '₹2-10L', salary: '₹3-15L/yr', aiRisk: 20, jobs: 'Moderate', growth: 'Stable' },
];

export default function PathComparison() {
  const [selected, setSelected] = useState([0, 3]);

  const toggle = (i: number) => {
    if (selected.includes(i)) {
      setSelected(selected.filter(x => x !== i));
    } else if (selected.length < 3) {
      setSelected([...selected, i]);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {paths.map((p, i) => (
          <button key={i} onClick={() => toggle(i)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selected.includes(i)
                ? 'bg-indigo-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}>
            {p.name}
          </button>
        ))}
      </div>
      {selected.length >= 2 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 text-zinc-500 font-medium pr-4">Metric</th>
                {selected.map(i => (
                  <th key={i} className="text-left py-3 text-zinc-200 font-medium pr-4">{paths[i].name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-zinc-400">
              {(['duration', 'cost', 'salary', 'aiRisk', 'jobs', 'growth'] as const).map(metric => (
                <tr key={metric} className="border-b border-zinc-800/50">
                  <td className="py-2.5 pr-4 capitalize text-zinc-500">{metric === 'aiRisk' ? 'AI Risk' : metric}</td>
                  {selected.map(i => {
                    const val = paths[i][metric];
                    const isRisk = metric === 'aiRisk';
                    return (
                      <td key={i} className={`py-2.5 pr-4 ${
                        isRisk ? (val as number) < 30 ? 'text-emerald-400' : (val as number) < 50 ? 'text-yellow-400' : 'text-red-400' : ''
                      }`}>
                        {isRisk ? `${val}%` : val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-zinc-500">Select at least 2 paths to compare.</p>
      )}
    </div>
  );
}
