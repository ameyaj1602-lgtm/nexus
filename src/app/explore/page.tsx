'use client';

import { useState, useMemo, useEffect } from 'react';
import { careers, careerClusters } from '@/lib/careers-data';
import { Career, IdentitySnapshot } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import Sidebar from '@/components/shared/sidebar';
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpDown,
  Plus,
  ShieldCheck,
  GraduationCap,
  Clock,
  Brain,
  IndianRupee,
  Sparkles,
} from 'lucide-react';

type SortOption = 'best_match' | 'highest_growth' | 'lowest_ai_risk' | 'highest_salary';

function formatSalary(val: number): string {
  if (val >= 10000000) return `${(val / 10000000).toFixed(1)}Cr`;
  if (val >= 100000) return `${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
  return val.toString();
}

function getGrowthIcon(trend: string) {
  if (trend === 'rising') return <TrendingUp className="size-4 text-emerald-400" />;
  if (trend === 'declining') return <TrendingDown className="size-4 text-red-400" />;
  return <Minus className="size-4 text-yellow-400" />;
}

function getAiRiskColor(score: number): string {
  if (score < 30) return 'text-emerald-400';
  if (score <= 50) return 'text-yellow-400';
  return 'text-red-400';
}

function getAiRiskBg(score: number): string {
  if (score < 30) return 'bg-emerald-400/10';
  if (score <= 50) return 'bg-yellow-400/10';
  return 'bg-red-400/10';
}

function calculateMatch(career: Career, identity: IdentitySnapshot | null): number {
  if (!identity || !career.identity_match) return 50;
  const dims: (keyof typeof career.identity_match)[] = [
    'creative', 'analytical', 'social', 'practical', 'entrepreneurial', 'caring',
  ];
  let totalDiff = 0;
  for (const d of dims) {
    const diff = Math.abs((career.identity_match[d] || 0) - (identity[d] || 0));
    totalDiff += diff;
  }
  const maxDiff = 100 * dims.length;
  return Math.round(100 - (totalDiff / maxDiff) * 100);
}

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [activeCluster, setActiveCluster] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('best_match');
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [identity, setIdentity] = useState<IdentitySnapshot | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('nexus_identity');
      if (raw) setIdentity(JSON.parse(raw));
    } catch {}
  }, []);

  const filteredCareers = useMemo(() => {
    let result = [...careers];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.cluster.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    if (activeCluster) {
      result = result.filter((c) => c.cluster === activeCluster);
    }

    switch (sortBy) {
      case 'best_match':
        result.sort((a, b) => calculateMatch(b, identity) - calculateMatch(a, identity));
        break;
      case 'highest_growth':
        result.sort((a, b) => {
          const order = { rising: 3, stable: 2, declining: 1 };
          return order[b.growth_trend] - order[a.growth_trend];
        });
        break;
      case 'lowest_ai_risk':
        result.sort((a, b) => a.ai_risk_score - b.ai_risk_score);
        break;
      case 'highest_salary':
        result.sort((a, b) => b.salary_range.max - a.salary_range.max);
        break;
    }

    return result;
  }, [search, activeCluster, sortBy, identity]);

  function addToHypotheses(career: Career) {
    try {
      const raw = localStorage.getItem('career_hypotheses');
      const hypotheses = raw ? JSON.parse(raw) : [];
      const exists = hypotheses.some((h: { career_name: string }) => h.career_name === career.name);
      if (exists) return;
      hypotheses.push({
        id: crypto.randomUUID(),
        student_id: 'current',
        career_name: career.name,
        status: 'exploring',
        evidence: '',
        liked_aspects: '',
        disliked_aspects: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      localStorage.setItem('career_hypotheses', JSON.stringify(hypotheses));
    } catch {}
  }

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'best_match', label: 'Best Match' },
    { value: 'highest_growth', label: 'Highest Growth' },
    { value: 'lowest_ai_risk', label: 'Lowest AI Risk' },
    { value: 'highest_salary', label: 'Highest Salary' },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 pb-24 md:pb-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Explore Careers</h1>
          <p className="text-sm text-zinc-500">{filteredCareers.length} careers to discover</p>
        </div>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
          <Input
            placeholder="Search careers by name, field, or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 h-11"
          />
        </div>

        {/* Cluster filter chips */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCluster(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !activeCluster
                ? 'bg-indigo-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            All
          </button>
          {careerClusters.map((cluster) => (
            <button
              key={cluster}
              onClick={() => setActiveCluster(activeCluster === cluster ? null : cluster)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeCluster === cluster
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
              }`}
            >
              {cluster}
            </button>
          ))}
        </div>

        {/* Sort options */}
        <div className="flex items-center gap-2 flex-wrap">
          <ArrowUpDown className="size-4 text-zinc-500" />
          <span className="text-xs text-zinc-500 mr-1">Sort:</span>
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSortBy(opt.value)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                sortBy === opt.value
                  ? 'bg-zinc-700 text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Career cards grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCareers.map((career) => (
            <div
              key={career.id}
              className="group rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 hover:border-zinc-700 hover:bg-zinc-900 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{career.icon}</span>
                  <div>
                    <h3 className="font-semibold text-zinc-100 leading-tight">{career.name}</h3>
                    <Badge variant="secondary" className="mt-1 text-[10px] px-2 py-0">
                      {career.cluster}
                    </Badge>
                  </div>
                </div>
                {sortBy === 'best_match' && identity && (
                  <span className="text-xs font-medium text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full">
                    {calculateMatch(career, identity)}%
                  </span>
                )}
              </div>

              <p className="text-sm text-zinc-400 line-clamp-2 mb-4">{career.description}</p>

              <div className="flex items-center gap-3 text-xs mb-4">
                <div className="flex items-center gap-1 text-zinc-400">
                  <IndianRupee className="size-3" />
                  <span>
                    {formatSalary(career.salary_range.min)}-{formatSalary(career.salary_range.max)}
                  </span>
                </div>
                <div className={`flex items-center gap-1 ${getAiRiskColor(career.ai_risk_score)}`}>
                  <ShieldCheck className="size-3" />
                  <span>{career.ai_risk_score}% AI Risk</span>
                </div>
                <div className="flex items-center gap-1 text-zinc-400">
                  {getGrowthIcon(career.growth_trend)}
                  <span className="capitalize">{career.growth_trend}</span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                onClick={() => setSelectedCareer(career)}
              >
                Explore
              </Button>
            </div>
          ))}
        </div>

        {filteredCareers.length === 0 && (
          <div className="text-center py-16 text-zinc-500">
            <Search className="size-8 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No careers found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
      </main>

      {/* Career Detail Dialog */}
      <Dialog open={!!selectedCareer} onOpenChange={(open) => !open && setSelectedCareer(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-zinc-900 border-zinc-800 text-zinc-100">
          {selectedCareer && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-3xl">{selectedCareer.icon}</span>
                  <div>
                    <DialogTitle className="text-xl">{selectedCareer.name}</DialogTitle>
                    <DialogDescription className="mt-1">
                      <Badge variant="secondary">
                        {selectedCareer.cluster}
                      </Badge>
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                <p className="text-sm text-zinc-300 leading-relaxed">{selectedCareer.description}</p>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-zinc-800/60 p-3 text-center">
                    <IndianRupee className="size-4 mx-auto mb-1 text-emerald-400" />
                    <p className="text-xs text-zinc-500">Salary Range</p>
                    <p className="text-sm font-semibold text-zinc-200">
                      {formatSalary(selectedCareer.salary_range.min)} -{' '}
                      {formatSalary(selectedCareer.salary_range.max)}
                    </p>
                  </div>
                  <div className={`rounded-lg p-3 text-center ${getAiRiskBg(selectedCareer.ai_risk_score)}`}>
                    <ShieldCheck className={`size-4 mx-auto mb-1 ${getAiRiskColor(selectedCareer.ai_risk_score)}`} />
                    <p className="text-xs text-zinc-500">AI Risk</p>
                    <p className={`text-sm font-semibold ${getAiRiskColor(selectedCareer.ai_risk_score)}`}>
                      {selectedCareer.ai_risk_score}%
                    </p>
                  </div>
                  <div className="rounded-lg bg-zinc-800/60 p-3 text-center">
                    {getGrowthIcon(selectedCareer.growth_trend)}
                    <p className="text-xs text-zinc-500 mt-1">Growth</p>
                    <p className="text-sm font-semibold text-zinc-200 capitalize">{selectedCareer.growth_trend}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-zinc-300 mb-2 flex items-center gap-2">
                    <Brain className="size-4 text-indigo-400" /> Skills Needed
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCareer.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs border-zinc-700 text-zinc-300">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-zinc-300 mb-2 flex items-center gap-2">
                    <GraduationCap className="size-4 text-indigo-400" /> Education Path
                  </h4>
                  <p className="text-sm text-zinc-400">{selectedCareer.education_path}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-zinc-300 mb-2 flex items-center gap-2">
                    <Clock className="size-4 text-indigo-400" /> Day in the Life
                  </h4>
                  <p className="text-sm text-zinc-400">{selectedCareer.day_in_life}</p>
                </div>

                <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-4">
                  <h4 className="text-sm font-semibold text-indigo-300 mb-2 flex items-center gap-2">
                    <Sparkles className="size-4" /> AI Future Lens
                  </h4>
                  <p className="text-sm text-zinc-400">
                    By 2030, AI will handle routine aspects of this role. The human skills that will
                    matter most are:{' '}
                    <span className="text-indigo-300 font-medium">
                      {selectedCareer.skills.slice(0, 3).join(', ')}
                    </span>
                    .
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={() => {
                      addToHypotheses(selectedCareer);
                      setSelectedCareer(null);
                    }}
                  >
                    <Plus className="size-4 mr-2" />
                    Add to My Hypotheses
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
