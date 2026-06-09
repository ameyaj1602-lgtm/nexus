'use client';

import { useState, useEffect } from 'react';
import { IdentitySnapshot, CareerHypothesis } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Sidebar from '@/components/shared/sidebar';
import {
  LayoutDashboard,
  GitCompare,
  Heart,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Radar,
  Lightbulb,
  Target,
  BookOpen,
  ArrowLeftRight,
  Check,
  MessageCircle,
} from 'lucide-react';
import { calculateAlignment } from '@/lib/alignment';

/* ---- Inline PathComparison component ---- */
interface PathData {
  name: string;
  duration: string;
  cost: string;
  salaryRange: string;
  aiRisk: number;
  jobAvailability: string;
  identityFit: string;
}

const COMPARISON_PATHS: PathData[] = [
  { name: 'Engineering (BTech)', duration: '4 years', cost: '₹4-15L total', salaryRange: '₹4-20L/year', aiRisk: 30, jobAvailability: 'High (IT/Core)', identityFit: 'Analytical + Practical' },
  { name: 'Medicine (MBBS)', duration: '5.5 + 3 years', cost: '₹10-60L total', salaryRange: '₹6-30L/year', aiRisk: 15, jobAvailability: 'Very High', identityFit: 'Caring + Analytical' },
  { name: 'Commerce / CA', duration: '3 + 3-5 years', cost: '₹2-5L total', salaryRange: '₹7-30L/year', aiRisk: 45, jobAvailability: 'High', identityFit: 'Analytical + Practical' },
  { name: 'Design (BDes)', duration: '4 years', cost: '₹4-12L total', salaryRange: '₹5-25L/year', aiRisk: 25, jobAvailability: 'Growing Fast', identityFit: 'Creative + Social' },
  { name: 'Computer Science', duration: '4 years', cost: '₹4-15L total', salaryRange: '₹6-40L/year', aiRisk: 20, jobAvailability: 'Very High', identityFit: 'Analytical + Creative' },
  { name: 'Government Jobs', duration: '1-3 years prep', cost: '₹1-3L coaching', salaryRange: '₹6-18L/year + benefits', aiRisk: 10, jobAvailability: 'Limited seats', identityFit: 'Social + Caring' },
];

function getAiRiskColor(score: number): string {
  if (score < 30) return 'text-success';
  if (score <= 50) return 'text-coral';
  return 'text-destructive';
}

function PathComparison() {
  const [selected, setSelected] = useState<number[]>([0, 4]);

  function togglePath(index: number) {
    if (selected.includes(index)) {
      if (selected.length <= 2) return;
      setSelected(selected.filter((i) => i !== index));
    } else {
      if (selected.length >= 3) return;
      setSelected([...selected, index]);
    }
  }

  const selectedPaths = selected.map((i) => COMPARISON_PATHS[i]);
  const rows: { label: string; key: keyof PathData }[] = [
    { label: 'Duration', key: 'duration' },
    { label: 'Estimated Cost', key: 'cost' },
    { label: 'Salary Range', key: 'salaryRange' },
    { label: 'AI Risk', key: 'aiRisk' },
    { label: 'Job Availability', key: 'jobAvailability' },
    { label: 'Identity Fit', key: 'identityFit' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <ArrowLeftRight className="size-4 text-cyan-accent" />
        <h3 className="text-sm font-semibold text-foreground">Compare Paths (select 2-3)</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {COMPARISON_PATHS.map((path, i) => (
          <Button
            key={path.name}
            variant={selected.includes(i) ? 'default' : 'outline'}
            size="sm"
            onClick={() => togglePath(i)}
            className={selected.includes(i) ? 'bg-cyan-accent text-background hover:bg-cyan-accent/90' : ''}
          >
            {selected.includes(i) && <Check className="size-3 mr-1" />}
            {path.name}
          </Button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 pr-4 text-muted-foreground font-medium w-36">Metric</th>
              {selectedPaths.map((p) => (
                <th key={p.name} className="text-left py-3 px-3 text-foreground font-semibold">{p.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-border/50">
                <td className="py-3 pr-4 text-muted-foreground font-medium">{row.label}</td>
                {selectedPaths.map((p) => (
                  <td key={`${p.name}-${row.key}`} className="py-3 px-3">
                    {row.key === 'aiRisk' ? (
                      <span className={`font-semibold ${getAiRiskColor(p.aiRisk)}`}>{p.aiRisk}%</span>
                    ) : (
                      <span className="text-foreground">{String(p[row.key])}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const FAQ_DATA = [
  {
    q: 'Is design a real career in India?',
    a: 'Absolutely. India\'s design industry is growing at 15% annually. UX designers at top companies earn ₹15-40L/year. NID and NIFT graduates are highly sought after. Companies like Google, Microsoft, and Swiggy have large design teams in India.',
  },
  {
    q: 'Will my child get a job with a humanities degree?',
    a: 'Yes, but the path is different from engineering. Humanities graduates thrive in content, policy, law, education, HR, and social impact. The key is building practical skills alongside the degree. Starting salaries may be lower but career growth is strong.',
  },
  {
    q: 'Should we invest in coaching or career guidance?',
    a: 'Career guidance is more valuable than subject coaching for long-term outcomes. Research shows students with career clarity make better academic choices and are 3x less likely to drop out of college. Invest in self-awareness and exploration first.',
  },
  {
    q: 'What about government jobs — are they still worth pursuing?',
    a: 'Government jobs offer unmatched stability, pension, and social respect. However, competition is extreme (0.1-1% selection rate). Having a backup plan is essential. The best strategy is preparing while building alternative skills.',
  },
  {
    q: 'How will AI affect my child\'s career?',
    a: 'AI will transform every career, not eliminate most of them. The careers at highest risk are routine, repetitive tasks. Focus on your child developing uniquely human skills: creativity, empathy, complex problem-solving, and leadership. These are AI-resistant.',
  },
];

interface AlignmentData {
  score: number;
  aligned: string[];
  gaps: string[];
  suggestions: string[];
}

type NavItem = 'dashboard' | 'compare' | 'alignment' | 'faq';

export default function ParentDashboardPage() {
  const [identity, setIdentity] = useState<IdentitySnapshot | null>(null);
  const [hypotheses, setHypotheses] = useState<CareerHypothesis[]>([]);
  const [activeNav, setActiveNav] = useState<NavItem>('dashboard');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [alignment, setAlignment] = useState<AlignmentData>({ score: 50, aligned: [], gaps: [], suggestions: [] });

  useEffect(() => {
    try {
      const rawId = localStorage.getItem('nexus_identity');
      if (rawId) setIdentity(JSON.parse(rawId));
      const rawHyp = localStorage.getItem('career_hypotheses');
      if (rawHyp) setHypotheses(JSON.parse(rawHyp));
      // Calculate real alignment score
      const result = calculateAlignment();
      setAlignment(result);
    } catch {}
  }, []);

  const navItems: { key: NavItem; label: string; icon: React.ReactNode }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="size-4" /> },
    { key: 'compare', label: 'Compare Paths', icon: <GitCompare className="size-4" /> },
    { key: 'alignment', label: 'Family Alignment', icon: <Heart className="size-4" /> },
    { key: 'faq', label: 'Parent FAQ', icon: <HelpCircle className="size-4" /> },
  ];

  const identityDims = identity
    ? [
        { label: 'Creative', value: identity.creative },
        { label: 'Analytical', value: identity.analytical },
        { label: 'Social', value: identity.social },
        { label: 'Practical', value: identity.practical },
        { label: 'Entrepreneurial', value: identity.entrepreneurial },
        { label: 'Caring', value: identity.caring },
      ]
    : [];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 pb-24 md:pb-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Parent Dashboard</h1>
          <p className="text-sm text-muted-foreground">Understand your child&apos;s career journey</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar nav */}
          <nav className="lg:w-56 shrink-0">
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveNav(item.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeNav === item.key
                      ? 'bg-cyan-accent/10 text-cyan-accent'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Main content */}
          <div className="flex-1 space-y-6">
            {/* Dashboard view */}
            {activeNav === 'dashboard' && (
              <>
                {/* Identity Profile */}
                <section className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <div className="size-9 rounded-lg bg-cyan-accent/10 flex items-center justify-center">
                      <Radar className="size-5 text-cyan-accent" />
                    </div>
                    Child&apos;s Identity Profile
                  </h2>
                  {identity ? (
                    <div className="space-y-3">
                      {identityDims.map((dim) => (
                        <div key={dim.label} className="flex items-center gap-3">
                          <span className="w-28 text-sm text-muted-foreground">{dim.label}</span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-cyan-accent transition-all"
                              style={{ width: `${dim.value}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-foreground w-10 text-right">
                            {dim.value}%
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Your child hasn&apos;t completed their identity assessment yet. Once they do,
                      you&apos;ll see their profile here.
                    </p>
                  )}
                </section>

                {/* Career Interests */}
                <section className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <div className="size-9 rounded-lg bg-cyan-accent/10 flex items-center justify-center">
                      <Lightbulb className="size-5 text-cyan-accent" />
                    </div>
                    Career Interests
                  </h2>
                  {hypotheses.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {hypotheses.map((h) => (
                        <div
                          key={h.id}
                          className="flex items-center justify-between rounded-lg bg-muted p-3"
                        >
                          <span className="text-sm font-medium text-foreground">{h.career_name}</span>
                          <Badge
                            variant={
                              h.status === 'active'
                                ? 'default'
                                : h.status === 'rejected'
                                  ? 'destructive'
                                  : 'secondary'
                            }
                            className="text-[10px] capitalize"
                          >
                            {h.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No career hypotheses saved yet. Your child can add careers they&apos;re
                      interested in from the Explore page.
                    </p>
                  )}
                </section>
              </>
            )}

            {/* Compare Paths view */}
            {activeNav === 'compare' && (
              <section className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <div className="size-9 rounded-lg bg-cyan-accent/10 flex items-center justify-center">
                    <GitCompare className="size-5 text-cyan-accent" />
                  </div>
                  Path Comparison Tool
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Compare different career paths side-by-side to understand the investment, returns,
                  and risks of each option.
                </p>
                <PathComparison />
              </section>
            )}

            {/* Family Alignment view */}
            {activeNav === 'alignment' && (
              <section className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <div className="size-9 rounded-lg bg-coral/10 flex items-center justify-center">
                    <Heart className="size-5 text-coral" />
                  </div>
                  Family Alignment Score
                </h2>

                <div className="flex flex-col items-center mb-8">
                  {/* Circular progress */}
                  <div className="relative size-36 mb-4">
                    <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        className="stroke-muted"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={alignment.score >= 70 ? 'hsl(var(--success))' : alignment.score >= 45 ? 'hsl(var(--cyan-accent))' : 'hsl(var(--coral))'}
                        strokeWidth="3"
                        strokeDasharray={`${alignment.score}, 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-foreground">{alignment.score}%</span>
                      <span className="text-xs text-muted-foreground">aligned</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center max-w-md leading-relaxed">
                    Your expectations and your child&apos;s identity are {alignment.score}% aligned.
                    {alignment.score >= 70
                      ? ' Great alignment — keep the conversations going!'
                      : ' Here’s what to focus on to bridge the gap.'}
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-success mb-3 flex items-center gap-2">
                      <Target className="size-4" /> Areas of Alignment
                    </h3>
                    <ul className="space-y-2">
                      {alignment.aligned.map((item, i) => (
                        <li
                          key={i}
                          className="text-sm text-muted-foreground bg-success/10 rounded-lg px-3 py-2 border border-success/20"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-coral mb-3 flex items-center gap-2">
                      <BookOpen className="size-4" /> Areas to Work On
                    </h3>
                    <ul className="space-y-2">
                      {alignment.gaps.map((item, i) => (
                        <li
                          key={i}
                          className="text-sm text-muted-foreground bg-coral/10 rounded-lg px-3 py-2 border border-coral/20"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Conversation Starters */}
                {alignment.suggestions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-cyan-accent mb-3 flex items-center gap-2">
                      <MessageCircle className="size-4" /> Conversation Starters
                    </h3>
                    <ul className="space-y-2">
                      {alignment.suggestions.map((item, i) => (
                        <li
                          key={i}
                          className="text-sm text-muted-foreground bg-cyan-accent/10 rounded-lg px-3 py-2 border border-cyan-accent/20"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {/* FAQ view */}
            {activeNav === 'faq' && (
              <section className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <div className="size-9 rounded-lg bg-cyan-accent/10 flex items-center justify-center">
                    <HelpCircle className="size-5 text-cyan-accent" />
                  </div>
                  What Parents Ask
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Honest, data-backed answers to common parent questions about careers in India.
                </p>
                <div className="space-y-2">
                  {FAQ_DATA.map((faq, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-border overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted transition-colors"
                      >
                        <span className="text-sm font-medium text-foreground">{faq.q}</span>
                        {expandedFaq === i ? (
                          <ChevronUp className="size-4 text-muted-foreground shrink-0" />
                        ) : (
                          <ChevronDown className="size-4 text-muted-foreground shrink-0" />
                        )}
                      </button>
                      {expandedFaq === i && (
                        <div className="px-4 pb-4">
                          <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}
