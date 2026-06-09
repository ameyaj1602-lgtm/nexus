'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Brain,
  Compass,
  Map,
  MessageCircle,
  Plus,
  ArrowRight,
  X,
  Lightbulb,
  Copy,
  Check,
  Link2,
} from 'lucide-react';
import { getUser } from '@/lib/auth';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import type { CareerHypothesis } from '@/types';

const weeklyPrompts = [
  "What would you do if money wasn't a factor?",
  'If you could solve one problem in India, what would it be?',
  "What's something you could do for hours without getting bored?",
  'Describe your perfect workday 10 years from now.',
  'What skill do you secretly wish you were amazing at?',
  'Who do you admire most, and what about them inspires you?',
  'If you could start a company tomorrow, what problem would it solve?',
];

const statusColors: Record<string, string> = {
  exploring: 'bg-primary/10 text-primary',
  tested: 'bg-coral/10 text-coral',
  active: 'bg-success/10 text-success',
  rejected: 'bg-destructive/10 text-destructive',
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [identity, setIdentity] = useState<Record<string, number> | null>(null);
  const [hypotheses, setHypotheses] = useState<CareerHypothesis[]>([]);
  const [prompt] = useState(
    weeklyPrompts[Math.floor(Math.random() * weeklyPrompts.length)]
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCareer, setNewCareer] = useState('');
  const [newNote, setNewNote] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.push('/login');
      return;
    }
    setUser(u);

    try {
      const id = localStorage.getItem('nexus_identity');
      if (id) setIdentity(JSON.parse(id));
    } catch {}

    try {
      const h = localStorage.getItem('career_hypotheses');
      if (h) setHypotheses(JSON.parse(h));
    } catch {}

    // Load or generate invite code for parent linking
    let code = localStorage.getItem('nexus_invite_code');
    if (!code) {
      code = Math.random().toString(36).substring(2, 10);
      localStorage.setItem('nexus_invite_code', code);
    }
    setInviteCode(code);
  }, [router]);

  // Build radar data - handle both raw 1-5 scores and 0-100 scores
  const radarData = identity
    ? [
        { dim: 'Creative', value: identity.creative > 5 ? identity.creative : identity.creative * 20 },
        { dim: 'Analytical', value: identity.analytical > 5 ? identity.analytical : identity.analytical * 20 },
        { dim: 'Social', value: identity.social > 5 ? identity.social : identity.social * 20 },
        { dim: 'Practical', value: identity.practical > 5 ? identity.practical : identity.practical * 20 },
        { dim: 'Entrepreneurial', value: identity.entrepreneurial > 5 ? identity.entrepreneurial : identity.entrepreneurial * 20 },
        { dim: 'Caring', value: identity.caring > 5 ? identity.caring : identity.caring * 20 },
      ]
    : [];

  function addHypothesis() {
    if (!newCareer.trim()) return;
    const hypothesis: CareerHypothesis = {
      id: crypto.randomUUID(),
      student_id: 'current',
      career_name: newCareer.trim(),
      status: 'exploring',
      evidence: newNote.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const updated = [...hypotheses, hypothesis];
    setHypotheses(updated);
    localStorage.setItem('career_hypotheses', JSON.stringify(updated));
    setNewCareer('');
    setNewNote('');
    setShowAddForm(false);
  }

  function removeHypothesis(id: string) {
    const updated = hypotheses.filter((h) => h.id !== id);
    setHypotheses(updated);
    localStorage.setItem('career_hypotheses', JSON.stringify(updated));
  }

  function cycleStatus(id: string) {
    const order: CareerHypothesis['status'][] = ['exploring', 'tested', 'active', 'rejected'];
    const updated = hypotheses.map((h) => {
      if (h.id !== id) return h;
      const idx = order.indexOf(h.status);
      return { ...h, status: order[(idx + 1) % order.length], updated_at: new Date().toISOString() };
    });
    setHypotheses(updated);
    localStorage.setItem('career_hypotheses', JSON.stringify(updated));
  }

  if (!user) return null;

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {user.name.split(' ')[0]}
        </h1>
        <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
          Your career and identity journey continues.
        </p>
      </div>

      {/* Top row: Identity + Journey */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Identity Snapshot Radar */}
        <Card className="rounded-xl border border-border bg-card p-0 hover:border-primary/30 transition-colors">
          <CardHeader className="pb-2 p-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-foreground">Identity Snapshot</CardTitle>
              <Badge className="bg-primary/10 text-primary border-0 text-xs">
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {identity ? (
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis
                    dataKey="dim"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  />
                  <PolarRadiusAxis
                    tick={false}
                    domain={[0, 100]}
                    axisLine={false}
                  />
                  <Radar
                    dataKey="value"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[260px] flex flex-col items-center justify-center text-muted-foreground gap-3">
                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Brain className="size-5 text-primary" />
                </div>
                <p className="text-sm leading-relaxed">Complete onboarding to see your identity map</p>
                <Link href="/onboarding">
                  <Button variant="outline" size="sm">
                    Start Onboarding
                    <ArrowRight className="size-4 ml-1" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Journey Progress */}
        <Card className="rounded-xl border border-border bg-card p-0 hover:border-primary/30 transition-colors">
          <CardHeader className="pb-2 p-5">
            <CardTitle className="text-lg font-semibold text-foreground">Your Journey</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="space-y-5 mt-2">
              {[
                {
                  icon: Brain,
                  label: 'Discover',
                  desc: 'Who am I?',
                  phase: 1,
                },
                {
                  icon: Compass,
                  label: 'Explore',
                  desc: "What's out there?",
                  phase: 2,
                },
                {
                  icon: Map,
                  label: 'Navigate',
                  desc: "What's my path?",
                  phase: 3,
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div
                    className={`size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 ${
                      i > 0 ? 'opacity-40' : ''
                    }`}
                  >
                    <item.icon className="size-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{item.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.desc}
                    </div>
                  </div>
                  {i === 0 && (
                    <Badge className="bg-primary/10 text-primary border-0 text-xs">
                      Current
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            {/* 3-phase progress bar */}
            <div className="mt-6 flex gap-1">
              <div className="h-1.5 flex-1 rounded-full bg-primary" />
              <div className="h-1.5 flex-1 rounded-full bg-muted" />
              <div className="h-1.5 flex-1 rounded-full bg-muted" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Phase 1 of 3 -- Discover
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row: Hypotheses + Prompt */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Career Hypothesis Board */}
        <Card className="rounded-xl border border-border bg-card p-0 hover:border-primary/30 transition-colors">
          <CardHeader className="pb-2 p-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-foreground">Career Hypothesis Board</CardTitle>
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <Plus className="size-3 mr-1" /> Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {/* Add form */}
            {showAddForm && (
              <div className="mb-4 p-3 rounded-lg bg-muted/50 border border-border space-y-2">
                <Input
                  value={newCareer}
                  onChange={(e) => setNewCareer(e.target.value)}
                  placeholder="Career name (e.g. UX Designer)"
                  className="bg-card"
                />
                <Input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Brief note (optional)"
                  className="bg-card"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={addHypothesis}
                    disabled={!newCareer.trim()}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Add Hypothesis
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {hypotheses.length > 0 ? (
              <div className="space-y-2">
                {hypotheses.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border group"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-foreground">
                        {h.career_name}
                      </span>
                      {h.evidence && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {h.evidence}
                        </p>
                      )}
                    </div>
                    <button onClick={() => cycleStatus(h.id)}>
                      <Badge
                        className={`text-xs border-0 cursor-pointer ${
                          statusColors[h.status] || statusColors.exploring
                        }`}
                      >
                        {h.status}
                      </Badge>
                    </button>
                    <button
                      onClick={() => removeHypothesis(h.id)}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Compass className="size-5 text-primary" />
                </div>
                <p className="text-sm leading-relaxed">
                  No hypotheses yet. Explore careers to start testing ideas.
                </p>
                <Link href="/explore" className="mt-3 inline-block">
                  <Button variant="outline" size="sm">
                    Explore Careers
                    <ArrowRight className="size-4 ml-1" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Reflection Prompt */}
        <Card className="rounded-xl border border-border bg-card p-0 hover:border-primary/30 transition-colors">
          <CardHeader className="pb-2 p-5">
            <div className="flex items-center gap-2">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Lightbulb className="size-5 text-primary" />
              </div>
              <CardTitle className="text-lg font-semibold text-foreground">Weekly Prompt</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="bg-muted rounded-lg p-4 mb-6 border border-border">
              <p className="text-foreground text-lg leading-relaxed italic">
                &ldquo;{prompt}&rdquo;
              </p>
            </div>
            <Link href="/discover">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Write in Journal
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              href: '/discover',
              icon: Brain,
              label: 'Discovery Quiz',
            },
            {
              href: '/explore',
              icon: Compass,
              label: 'Explore Careers',
            },
            {
              href: '/coach',
              icon: MessageCircle,
              label: 'Coach',
            },
            {
              href: '/navigate',
              icon: Map,
              label: 'My Roadmap',
            },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="rounded-xl border border-border bg-card hover:border-primary/30 transition-colors cursor-pointer group">
                <CardContent className="p-4 text-center">
                  <div className="size-9 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <item.icon className="size-5 text-primary" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.label}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Parent Invite Code */}
      <Card className="mt-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Link2 className="size-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">Invite Code for Parents</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Share this code with your parent so they can connect to your journey
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <code className="text-lg font-mono font-semibold tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/30">
              {inviteCode}
            </code>
            <Button
              size="sm"
              variant="ghost"
              className="text-muted-foreground hover:text-primary"
              onClick={() => {
                navigator.clipboard.writeText(inviteCode);
                setCodeCopied(true);
                setTimeout(() => setCodeCopied(false), 2000);
              }}
            >
              {codeCopied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
