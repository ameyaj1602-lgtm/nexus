'use client';

import { useState, useMemo, useEffect, createElement } from 'react';
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
  Lightbulb,
  Palette,
  BarChart3,
  Briefcase,
  Leaf,
  Video,
  Gamepad2,
  Landmark,
  Building2,
  Bot,
  Stethoscope,
  PenTool,
  Scale,
  Rocket,
  Newspaper,
  HandHeart,
  Scissors,
  Package,
  Dumbbell,
  Clapperboard,
  Cpu,
  Megaphone,
  Trophy,
  Dna,
  ChefHat,
  BookOpen,
  BadgeDollarSign,
  Sofa,
  Cog,
  Music,
  Pill,
  SearchCode,
  Target,
  Wand2,
  HardHat,
  ClipboardList,
  Link,
  TreePine,
  Plane,
  Laugh,
  Sprout,
  Medal,
  Cloud,
  Gavel,
  LineChart,
  Apple,
  Globe,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<any>> = {
  Palette,
  BarChart3,
  Brain,
  Briefcase,
  Leaf,
  Video,
  TrendingUp,
  Gamepad2,
  Landmark,
  Building2,
  Bot,
  Stethoscope,
  PenTool,
  Scale,
  Rocket,
  Newspaper,
  ShieldCheck,
  HandHeart,
  Scissors,
  Package,
  Dumbbell,
  Clapperboard,
  Cpu,
  Megaphone,
  Trophy,
  Dna,
  ChefHat,
  BookOpen,
  BadgeDollarSign,
  Sofa,
  Cog,
  Music,
  Pill,
  SearchCode,
  Target,
  Wand2,
  HardHat,
  ClipboardList,
  Link,
  TreePine,
  Plane,
  Laugh,
  Sprout,
  Medal,
  Cloud,
  Gavel,
  LineChart,
  Apple,
  Globe,
};

type SortOption = 'best_match' | 'highest_growth' | 'lowest_ai_risk' | 'highest_salary';

function formatSalary(val: number): string {
  if (val >= 10000000) return `${(val / 10000000).toFixed(1)}Cr`;
  if (val >= 100000) return `${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
  return val.toString();
}

function getGrowthIcon(trend: string) {
  if (trend === 'rising') return <TrendingUp className="size-4 text-success" />;
  if (trend === 'declining') return <TrendingDown className="size-4 text-destructive" />;
  return <Minus className="size-4 text-muted-foreground" />;
}

function getAiRiskColor(score: number): string {
  if (score < 30) return 'text-success';
  if (score <= 50) return 'text-coral';
  return 'text-destructive';
}

function getAiRiskBg(score: number): string {
  if (score < 30) return 'bg-success/10';
  if (score <= 50) return 'bg-coral/10';
  return 'bg-destructive/10';
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
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Explore Careers</h1>
            <p className="text-sm text-muted-foreground">{filteredCareers.length} careers to discover</p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search careers by name, field, or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground h-11"
            />
          </div>

          {/* Cluster filter chips */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCluster(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                !activeCluster
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
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
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                }`}
              >
                {cluster}
              </button>
            ))}
          </div>

          {/* Sort options */}
          <div className="flex items-center gap-2 flex-wrap">
            <ArrowUpDown className="size-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground mr-1">Sort:</span>
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  sortBy === opt.value
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
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
                className="group rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      {iconMap[career.icon]
                        ? createElement(iconMap[career.icon], { className: 'size-5 text-primary' })
                        : null}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground leading-tight">{career.name}</h3>
                      <Badge variant="secondary" className="mt-1 text-[10px] px-2 py-0">
                        {career.cluster}
                      </Badge>
                    </div>
                  </div>
                  {sortBy === 'best_match' && identity && (
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {calculateMatch(career, identity)}%
                    </span>
                  )}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{career.description}</p>

                <div className="flex items-center gap-3 text-xs mb-4">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <IndianRupee className="size-3" />
                    <span>
                      {formatSalary(career.salary_range.min)}-{formatSalary(career.salary_range.max)}
                    </span>
                  </div>
                  <div className={`flex items-center gap-1 ${getAiRiskColor(career.ai_risk_score)}`}>
                    <ShieldCheck className="size-3" />
                    <span>{career.ai_risk_score}% AI Risk</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    {getGrowthIcon(career.growth_trend)}
                    <span className="capitalize">{career.growth_trend}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setSelectedCareer(career)}
                >
                  Explore
                </Button>
              </div>
            ))}
          </div>

          {filteredCareers.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Search className="size-8 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No careers found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>

      {/* Career Detail Dialog */}
      <Dialog open={!!selectedCareer} onOpenChange={(open) => !open && setSelectedCareer(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card border-border text-foreground">
          {selectedCareer && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-1">
                  <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    {iconMap[selectedCareer.icon]
                      ? createElement(iconMap[selectedCareer.icon], { className: 'size-5 text-primary' })
                      : null}
                  </div>
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
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedCareer.description}</p>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-border bg-card p-3 text-center">
                    <IndianRupee className="size-4 mx-auto mb-1 text-success" />
                    <p className="text-xs text-muted-foreground">Salary Range</p>
                    <p className="text-sm font-semibold text-foreground">
                      {formatSalary(selectedCareer.salary_range.min)} -{' '}
                      {formatSalary(selectedCareer.salary_range.max)}
                    </p>
                  </div>
                  <div className={`rounded-xl border border-border p-3 text-center ${getAiRiskBg(selectedCareer.ai_risk_score)}`}>
                    <ShieldCheck className={`size-4 mx-auto mb-1 ${getAiRiskColor(selectedCareer.ai_risk_score)}`} />
                    <p className="text-xs text-muted-foreground">AI Risk</p>
                    <p className={`text-sm font-semibold ${getAiRiskColor(selectedCareer.ai_risk_score)}`}>
                      {selectedCareer.ai_risk_score}%
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-3 text-center">
                    {getGrowthIcon(selectedCareer.growth_trend)}
                    <p className="text-xs text-muted-foreground mt-1">Growth</p>
                    <p className="text-sm font-semibold text-foreground capitalize">{selectedCareer.growth_trend}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Brain className="size-4 text-primary" /> Skills Needed
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCareer.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <GraduationCap className="size-4 text-primary" /> Education Path
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedCareer.education_path}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Clock className="size-4 text-primary" /> Day in the Life
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedCareer.day_in_life}</p>
                </div>

                <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Lightbulb className="size-4 text-primary" /> Future Outlook
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    By 2030, automation will handle routine aspects of this role. The human skills that will
                    matter most are:{' '}
                    <span className="text-primary font-medium">
                      {selectedCareer.skills.slice(0, 3).join(', ')}
                    </span>
                    .
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
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
