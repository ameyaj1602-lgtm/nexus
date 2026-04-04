'use client';

import { useState, useEffect, useMemo } from 'react';
import { careers } from '@/lib/careers-data';
import { Career, IdentitySnapshot } from '@/types';
import Sidebar from '@/components/shared/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  ArrowLeftRight,
  Search,
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  IndianRupee,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Plus,
} from 'lucide-react';

function formatSalary(val: number): string {
  if (val >= 10000000) return `${(val / 10000000).toFixed(1)}Cr`;
  if (val >= 100000) return `${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
  return val.toString();
}

function getAiRiskColor(score: number): string {
  if (score < 30) return 'text-emerald-400';
  if (score <= 50) return 'text-yellow-400';
  return 'text-red-400';
}

function getAiRiskBg(score: number): string {
  if (score < 30) return 'bg-emerald-400';
  if (score <= 50) return 'bg-yellow-400';
  return 'bg-red-400';
}

function getGrowthInfo(trend: string) {
  if (trend === 'rising') return { icon: TrendingUp, color: 'text-emerald-400', label: 'Rising' };
  if (trend === 'declining') return { icon: TrendingDown, color: 'text-red-400', label: 'Declining' };
  return { icon: Minus, color: 'text-yellow-400', label: 'Stable' };
}

function computeIdentityMatch(career: Career, identity: IdentitySnapshot | null): number {
  if (!identity || !career.identity_match) return 0;
  const dims = ['creative', 'analytical', 'social', 'practical', 'entrepreneurial', 'caring'] as const;
  let total = 0;
  let count = 0;
  for (const dim of dims) {
    const careerVal = career.identity_match[dim];
    const userVal = identity[dim];
    if (careerVal !== undefined && userVal !== undefined) {
      total += 100 - Math.abs(careerVal - userVal);
      count++;
    }
  }
  return count > 0 ? Math.round(total / count) : 0;
}

export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [identity, setIdentity] = useState<IdentitySnapshot | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nexus_identity');
      if (stored) setIdentity(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const selectedCareers = useMemo(
    () => selectedIds.map((id) => careers.find((c) => c.id === id)!).filter(Boolean),
    [selectedIds]
  );

  const filteredCareers = useMemo(
    () =>
      careers.filter(
        (c) =>
          !selectedIds.includes(c.id) &&
          c.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery, selectedIds]
  );

  function addCareer(id: string) {
    if (selectedIds.length < 3 && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
      setShowSearch(false);
      setSearchQuery('');
    }
  }

  function removeCareer(id: string) {
    setSelectedIds(selectedIds.filter((sid) => sid !== id));
  }

  // Find overlapping skills
  const allSkills = selectedCareers.map((c) => new Set(c.skills));
  const overlappingSkills =
    allSkills.length >= 2
      ? [...allSkills[0]].filter((s) => allSkills.every((set) => set.has(s)))
      : [];

  // Max salary for bar chart scaling
  const maxSalary = Math.max(
    ...selectedCareers.map((c) => c.salary_range.max),
    1
  );

  // AI verdict
  function getVerdict(): string {
    if (selectedCareers.length < 2 || !identity) return '';
    const scores = selectedCareers.map((c) => ({
      career: c.name,
      match: computeIdentityMatch(c, identity),
    }));
    scores.sort((a, b) => b.match - a.match);
    if (scores[0].match === scores[1].match) {
      return `Both ${scores[0].career} and ${scores[1].career} match your identity equally well (${scores[0].match}%). Explore both through simulations or real experiences.`;
    }
    return `Based on your identity profile, ${scores[0].career} (${scores[0].match}% match) aligns better with who you are than ${scores[1].career} (${scores[1].match}% match). But remember - identity evolves, and interest matters as much as fit.`;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 px-4 py-8 md:px-8 pb-24 md:pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
              <ArrowLeftRight className="size-6 text-indigo-400" />
              Compare Careers
            </h1>
            <p className="text-muted-foreground">
              Select 2-3 careers to compare side by side. See how they stack up on salary, growth, skills, and identity match.
            </p>
          </div>

          {/* Career Selection */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            {selectedCareers.map((career) => (
              <div
                key={career.id}
                className="flex items-center gap-2 rounded-full border border-indigo-600/30 bg-indigo-600/10 px-4 py-2"
              >
                <span>{career.icon}</span>
                <span className="text-sm font-medium">{career.name}</span>
                <button
                  onClick={() => removeCareer(career.id)}
                  className="ml-1 text-muted-foreground hover:text-red-400 transition-colors"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
            {selectedIds.length < 3 && (
              <div className="relative">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="flex items-center gap-2 rounded-full border border-dashed border-border px-4 py-2 text-sm text-muted-foreground hover:border-indigo-500/50 hover:text-indigo-400 transition-colors"
                >
                  <Plus className="size-3.5" />
                  Add career
                </button>
                {showSearch && (
                  <div className="absolute top-12 left-0 z-50 w-72 rounded-xl border border-border bg-card shadow-xl p-3">
                    <div className="relative mb-2">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search careers..."
                        className="pl-9 h-9 text-sm"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-0.5">
                      {filteredCareers.slice(0, 10).map((c) => (
                        <button
                          key={c.id}
                          onClick={() => addCareer(c.id)}
                          className="w-full text-left flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          <span>{c.icon}</span>
                          <span>{c.name}</span>
                        </button>
                      ))}
                      {filteredCareers.length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-4">
                          No careers found
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Comparison Table */}
          {selectedCareers.length >= 2 && (
            <div className="space-y-6">
              {/* Salary Range */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm">
                  <IndianRupee className="size-4 text-indigo-400" />
                  Salary Range (Annual)
                </h3>
                <div className="space-y-3">
                  {selectedCareers.map((c) => (
                    <div key={c.id} className="flex items-center gap-3">
                      <span className="text-sm w-32 md:w-40 truncate">{c.icon} {c.name}</span>
                      <div className="flex-1 relative h-7 bg-muted/30 rounded-full overflow-hidden">
                        <div
                          className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-600/60 to-indigo-500/40 rounded-full"
                          style={{
                            width: `${(c.salary_range.max / maxSalary) * 100}%`,
                          }}
                        />
                        <div className="absolute inset-0 flex items-center px-3 text-xs font-medium">
                          {formatSalary(c.salary_range.min)} - {formatSalary(c.salary_range.max)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Risk */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm">
                  <ShieldCheck className="size-4 text-indigo-400" />
                  AI Disruption Risk
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedCareers.map((c) => (
                    <div key={c.id} className="text-center">
                      <p className="text-sm mb-2">{c.icon} {c.name}</p>
                      <div className="relative w-20 h-20 mx-auto mb-2">
                        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" className="text-muted/20" strokeWidth="3" />
                          <circle
                            cx="18" cy="18" r="15.9" fill="none"
                            className={getAiRiskBg(c.ai_risk_score).replace('bg-', 'text-')}
                            strokeWidth="3"
                            strokeDasharray={`${c.ai_risk_score} ${100 - c.ai_risk_score}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-lg font-bold ${getAiRiskColor(c.ai_risk_score)}`}>
                            {c.ai_risk_score}%
                          </span>
                        </div>
                      </div>
                      <p className={`text-xs font-medium ${getAiRiskColor(c.ai_risk_score)}`}>
                        {c.ai_risk_score < 30 ? 'Low Risk' : c.ai_risk_score <= 50 ? 'Moderate' : 'High Risk'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Growth Trend & Education */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="font-semibold mb-4 text-sm">Growth Trend</h3>
                  <div className="space-y-3">
                    {selectedCareers.map((c) => {
                      const info = getGrowthInfo(c.growth_trend);
                      return (
                        <div key={c.id} className="flex items-center gap-3">
                          <span className="text-sm">{c.icon}</span>
                          <span className="flex-1 text-sm truncate">{c.name}</span>
                          <div className={`flex items-center gap-1 text-sm font-medium ${info.color}`}>
                            <info.icon className="size-4" />
                            {info.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="font-semibold mb-4 text-sm flex items-center gap-2">
                    <GraduationCap className="size-4 text-indigo-400" />
                    Education Path
                  </h3>
                  <div className="space-y-3">
                    {selectedCareers.map((c) => (
                      <div key={c.id}>
                        <p className="text-sm font-medium mb-0.5">{c.icon} {c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.education_path}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Skills Comparison */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold mb-4 text-sm">Key Skills</h3>
                <div className="space-y-3">
                  {selectedCareers.map((c) => (
                    <div key={c.id}>
                      <p className="text-sm font-medium mb-2">{c.icon} {c.name}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {c.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant={overlappingSkills.includes(skill) ? 'default' : 'outline'}
                            className={
                              overlappingSkills.includes(skill)
                                ? 'bg-indigo-600/20 text-indigo-400 border-indigo-600/30 text-xs'
                                : 'text-xs'
                            }
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                  {overlappingSkills.length > 0 && (
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">
                        Overlapping skills (highlighted above):
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {overlappingSkills.map((s) => (
                          <Badge key={s} className="bg-indigo-600/20 text-indigo-400 border-indigo-600/30 text-xs">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Identity Match */}
              {identity && (
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="font-semibold mb-4 text-sm flex items-center gap-2">
                    <Sparkles className="size-4 text-indigo-400" />
                    Identity Match
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedCareers.map((c) => {
                      const match = computeIdentityMatch(c, identity);
                      return (
                        <div key={c.id} className="text-center">
                          <p className="text-sm mb-2">{c.icon} {c.name}</p>
                          <div className="text-3xl font-bold text-indigo-400 mb-1">{match}%</div>
                          <p className="text-xs text-muted-foreground">identity match</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Day in the Life */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold mb-4 text-sm">A Typical Day</h3>
                <div className="space-y-3">
                  {selectedCareers.map((c) => (
                    <div key={c.id}>
                      <p className="text-sm font-medium mb-0.5">{c.icon} {c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.day_in_life}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Verdict */}
              {identity && (
                <div className="rounded-xl border border-indigo-600/30 bg-indigo-600/5 p-5">
                  <h3 className="font-semibold mb-2 text-sm flex items-center gap-2">
                    <Sparkles className="size-4 text-indigo-400" />
                    Which career fits you better?
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {getVerdict()}
                  </p>
                </div>
              )}
              {!identity && (
                <div className="rounded-xl border border-border bg-card p-5 text-center">
                  <p className="text-sm text-muted-foreground">
                    Complete the identity assessment in the Discover section to see your personalized match scores and AI verdict.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Empty state */}
          {selectedCareers.length < 2 && (
            <div className="text-center py-16 rounded-xl border border-dashed border-border">
              <ArrowLeftRight className="size-10 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-sm">
                Select at least 2 careers to start comparing
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
