'use client';

import { useState, useEffect } from 'react';
import { IdentitySnapshot, CareerHypothesis } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import Sidebar from '@/components/shared/sidebar';
import {
  Compass,
  Map,
  Lightbulb,
  ChevronRight,
  GraduationCap,
  BookOpen,
  Award,
  Briefcase,
  Pencil,
  Save,
} from 'lucide-react';

/* ---- Stream Recommendation Logic ---- */
interface StreamRec {
  name: string;
  why: string;
  careers: string[];
  confidence: number;
}

function getStreamRecommendations(identity: IdentitySnapshot | null): StreamRec[] {
  if (!identity) return [];
  const recs: StreamRec[] = [];

  if (identity.creative > 70) {
    recs.push({
      name: 'Arts / Humanities / Design',
      why: 'Your strong creative identity suggests you thrive when expressing ideas, building aesthetics, and thinking outside the box.',
      careers: ['UX Designer', 'Architect', 'Film Director', 'Fashion Designer', 'Graphic Designer'],
      confidence: Math.min(95, Math.round(identity.creative * 0.9 + 10)),
    });
  }

  if (identity.analytical > 70) {
    recs.push({
      name: 'Science / Mathematics',
      why: 'Your analytical strength means you enjoy solving complex problems, finding patterns, and working with data and logic.',
      careers: ['Data Scientist', 'AI/ML Engineer', 'Space Scientist', 'Biotechnologist', 'Cybersecurity Analyst'],
      confidence: Math.min(95, Math.round(identity.analytical * 0.9 + 10)),
    });
  }

  if (identity.social > 70 && identity.caring > 70) {
    recs.push({
      name: 'Humanities / Social Sciences',
      why: 'Your combination of social and caring traits means you find deep meaning in understanding people and making a difference.',
      careers: ['Clinical Psychologist', 'Social Worker', 'Teacher', 'Human Rights Lawyer', 'Public Policy Analyst'],
      confidence: Math.min(95, Math.round((identity.social + identity.caring) * 0.45 + 10)),
    });
  }

  if (identity.practical > 70 && identity.analytical > 70) {
    recs.push({
      name: 'Engineering / Technical',
      why: 'You combine hands-on practicality with analytical thinking -- perfect for building and optimizing real-world systems.',
      careers: ['Mechanical Engineer', 'Robotics Engineer', 'Civil Engineer', 'DevOps Engineer', 'Climate Tech Engineer'],
      confidence: Math.min(95, Math.round((identity.practical + identity.analytical) * 0.45 + 10)),
    });
  }

  if (identity.entrepreneurial > 70) {
    recs.push({
      name: 'Commerce / Business',
      why: 'Your entrepreneurial drive means you think in terms of opportunities, value creation, and leadership.',
      careers: ['Entrepreneur', 'Product Manager', 'Investment Banker', 'Digital Marketing Manager', 'Supply Chain Manager'],
      confidence: Math.min(95, Math.round(identity.entrepreneurial * 0.9 + 10)),
    });
  }

  // Fallback if no strong match
  if (recs.length === 0) {
    const dims = [
      { name: 'creative', val: identity.creative },
      { name: 'analytical', val: identity.analytical },
      { name: 'social', val: identity.social },
      { name: 'practical', val: identity.practical },
      { name: 'entrepreneurial', val: identity.entrepreneurial },
      { name: 'caring', val: identity.caring },
    ].sort((a, b) => b.val - a.val);

    const top = dims[0];
    const streamMap: Record<string, { name: string; careers: string[] }> = {
      creative: { name: 'Arts / Design', careers: ['UX Designer', 'Content Creator', 'Animator'] },
      analytical: { name: 'Science / Tech', careers: ['Data Scientist', 'Engineer', 'Researcher'] },
      social: { name: 'Humanities / Communication', careers: ['Journalist', 'Teacher', 'Psychologist'] },
      practical: { name: 'Engineering / Applied Sciences', careers: ['Engineer', 'Chef', 'Physiotherapist'] },
      entrepreneurial: { name: 'Business / Commerce', careers: ['Entrepreneur', 'Product Manager', 'Marketer'] },
      caring: { name: 'Healthcare / Social Impact', careers: ['Doctor', 'Social Worker', 'Nutritionist'] },
    };
    const match = streamMap[top.name] || streamMap.caring;
    recs.push({
      name: match.name,
      why: `${top.name.charAt(0).toUpperCase() + top.name.slice(1)} is your strongest trait.`,
      careers: match.careers,
      confidence: Math.round(top.val * 0.8),
    });
  }

  return recs.slice(0, 3);
}

/* ---- Roadmap Data ---- */
const ROADMAP_PHASES = [
  {
    title: 'Class 10',
    icon: <BookOpen className="size-5" />,
    active: true,
    decisions: ['Choose between Science, Commerce, or Humanities', 'Start exploring career interests'],
    actions: ['Complete identity assessment', 'Explore 10+ careers', 'Talk to 3 professionals'],
    timeline: 'Current',
  },
  {
    title: 'Stream Selection',
    icon: <Compass className="size-5" />,
    active: false,
    decisions: ['Pick your stream after Class 10 boards', 'Choose subjects wisely (Math vs Bio, etc.)'],
    actions: ['Research stream-to-career paths', 'Test hypotheses with summer programs', 'Discuss with family'],
    timeline: 'After boards',
  },
  {
    title: 'Class 11-12',
    icon: <GraduationCap className="size-5" />,
    active: false,
    decisions: ['Focus on academics + skill building', 'Decide on entrance exams (JEE, NEET, CLAT, NID, etc.)'],
    actions: ['Build portfolio or projects', 'Join relevant clubs and competitions', 'Start exam preparation'],
    timeline: '2 years',
  },
  {
    title: 'Entrance Exams',
    icon: <Award className="size-5" />,
    active: false,
    decisions: ['Attempt relevant entrance exams', 'Apply to colleges based on results and fit'],
    actions: ['Give mock tests regularly', 'Keep backup options ready', 'Research college cultures, not just rankings'],
    timeline: 'Class 12',
  },
  {
    title: 'College',
    icon: <GraduationCap className="size-5" />,
    active: false,
    decisions: ['Choose major/specialization', 'Pursue internships and projects'],
    actions: ['Build real-world skills through projects', 'Network with industry professionals', 'Explore multiple career paths through internships'],
    timeline: '3-5 years',
  },
  {
    title: 'First Job',
    icon: <Briefcase className="size-5" />,
    active: false,
    decisions: ['Choose first role based on growth, not just salary', 'Decide between startup vs corporate'],
    actions: ['Build a strong portfolio/resume', 'Leverage college network', 'Stay open to pivoting based on experience'],
    timeline: 'Post graduation',
  },
];

export default function NavigatePage() {
  const [identity, setIdentity] = useState<IdentitySnapshot | null>(null);
  const [hypotheses, setHypotheses] = useState<CareerHypothesis[]>([]);
  const [editingHypothesis, setEditingHypothesis] = useState<CareerHypothesis | null>(null);
  const [editLiked, setEditLiked] = useState('');
  const [editDisliked, setEditDisliked] = useState('');

  useEffect(() => {
    try {
      const rawId = localStorage.getItem('nexus_identity');
      if (rawId) setIdentity(JSON.parse(rawId));
      const rawHyp = localStorage.getItem('career_hypotheses');
      if (rawHyp) setHypotheses(JSON.parse(rawHyp));
    } catch {}
  }, []);

  const streamRecs = getStreamRecommendations(identity);

  function updateHypothesisStatus(id: string, status: CareerHypothesis['status']) {
    const updated = hypotheses.map((h) =>
      h.id === id ? { ...h, status, updated_at: new Date().toISOString() } : h
    );
    setHypotheses(updated);
    localStorage.setItem('career_hypotheses', JSON.stringify(updated));
  }

  function openEditModal(h: CareerHypothesis) {
    setEditingHypothesis(h);
    setEditLiked(h.liked_aspects || '');
    setEditDisliked(h.disliked_aspects || '');
  }

  function saveNotes() {
    if (!editingHypothesis) return;
    const updated = hypotheses.map((h) =>
      h.id === editingHypothesis.id
        ? { ...h, liked_aspects: editLiked, disliked_aspects: editDisliked, updated_at: new Date().toISOString() }
        : h
    );
    setHypotheses(updated);
    localStorage.setItem('career_hypotheses', JSON.stringify(updated));
    setEditingHypothesis(null);
  }

  const statusColors: Record<string, string> = {
    exploring: 'bg-primary/10 text-primary border-primary/30',
    tested: 'bg-coral/10 text-coral border-coral/30',
    rejected: 'bg-destructive/10 text-destructive border-destructive/30',
    active: 'bg-success/10 text-success border-success/30',
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        <div className="max-w-5xl space-y-8">
          <div>
            <h1 className="text-2xl font-bold">Navigate Your Path</h1>
            <p className="text-muted-foreground mt-1">Stream recommendations, career hypotheses, and your roadmap ahead.</p>
          </div>

          {/* Stream Recommendations */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Compass className="size-4 text-primary" />
              </div>
              Recommended Streams
            </h2>
            {streamRecs.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {streamRecs.map((rec) => (
                  <div
                    key={rec.name}
                    className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-foreground">{rec.name}</h3>
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {rec.confidence}% fit
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{rec.why}</p>
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Example careers:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {rec.careers.map((c) => (
                          <Badge key={c} variant="secondary" className="text-[10px]">
                            {c}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card p-6 text-center">
                <Compass className="size-8 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Complete your identity assessment to get personalized stream recommendations.
                </p>
              </div>
            )}
          </section>

          {/* Career Hypothesis Board */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="size-9 rounded-lg bg-coral/10 flex items-center justify-center">
                <Lightbulb className="size-4 text-coral" />
              </div>
              Career Hypothesis Board
            </h2>
            {hypotheses.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {hypotheses.map((h) => (
                  <div
                    key={h.id}
                    className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-foreground">{h.career_name}</h3>
                      <button
                        onClick={() => openEditModal(h)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                    </div>

                    {/* Status selector */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(['exploring', 'tested', 'rejected', 'active'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => updateHypothesisStatus(h.id, st)}
                          className={`text-[10px] px-2 py-0.5 rounded-full border capitalize transition-colors ${
                            h.status === st
                              ? statusColors[st]
                              : 'border-border text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    {/* Notes preview */}
                    {(h.liked_aspects || h.disliked_aspects) && (
                      <div className="space-y-1 text-xs text-muted-foreground">
                        {h.liked_aspects && (
                          <p className="line-clamp-1">
                            <span className="text-success">Liked:</span> {h.liked_aspects}
                          </p>
                        )}
                        {h.disliked_aspects && (
                          <p className="line-clamp-1">
                            <span className="text-destructive">Disliked:</span> {h.disliked_aspects}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card p-6 text-center">
                <Lightbulb className="size-8 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-3">
                  No career hypotheses yet. Explore careers and add ones that interest you.
                </p>
                <a href="/explore">
                  <Button variant="outline" size="sm">
                    Explore Careers
                  </Button>
                </a>
              </div>
            )}
          </section>

          {/* Visual Roadmap */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="size-9 rounded-lg bg-success/10 flex items-center justify-center">
                <Map className="size-4 text-success" />
              </div>
              Your Career Roadmap
            </h2>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[18px] top-0 bottom-0 w-px bg-border sm:left-[22px]" />

              <div className="space-y-6">
                {ROADMAP_PHASES.map((phase, i) => (
                  <div key={phase.title} className="relative flex gap-4 sm:gap-6">
                    {/* Icon circle */}
                    <div
                      className={`relative z-10 flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-full border-2 ${
                        phase.active
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-card text-muted-foreground'
                      }`}
                    >
                      {phase.icon}
                    </div>

                    {/* Content */}
                    <div className={`flex-1 ${i < ROADMAP_PHASES.length - 1 ? 'pb-6' : ''}`}>
                      <div className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-foreground">{phase.title}</h3>
                          <Badge
                            variant={phase.active ? 'default' : 'secondary'}
                            className={`text-[10px] ${phase.active ? 'bg-primary text-primary-foreground' : ''}`}
                          >
                            {phase.timeline}
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1.5 font-medium">Key Decisions</p>
                            <ul className="space-y-1">
                              {phase.decisions.map((d) => (
                                <li key={d} className="text-sm text-muted-foreground flex items-start gap-2 leading-relaxed">
                                  <ChevronRight className="size-3 mt-1 shrink-0 text-muted-foreground" />
                                  {d}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1.5 font-medium">Recommended Actions</p>
                            <ul className="space-y-1">
                              {phase.actions.map((a) => (
                                <li key={a} className="text-sm text-muted-foreground flex items-start gap-2 leading-relaxed">
                                  <ChevronRight className="size-3 mt-1 shrink-0 text-primary" />
                                  {a}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Edit Hypothesis Dialog */}
      <Dialog open={!!editingHypothesis} onOpenChange={(open) => !open && setEditingHypothesis(null)}>
        <DialogContent className="max-w-md bg-card border-border text-foreground">
          {editingHypothesis && (
            <>
              <DialogHeader>
                <DialogTitle>{editingHypothesis.career_name}</DialogTitle>
                <DialogDescription>Add notes about this career hypothesis</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    What I liked
                  </label>
                  <Textarea
                    value={editLiked}
                    onChange={(e) => setEditLiked(e.target.value)}
                    placeholder="What excited you about this career?"
                    className="bg-muted border-border text-foreground placeholder:text-muted-foreground min-h-[80px]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    What I didn&apos;t like
                  </label>
                  <Textarea
                    value={editDisliked}
                    onChange={(e) => setEditDisliked(e.target.value)}
                    placeholder="What concerns or doubts do you have?"
                    className="bg-muted border-border text-foreground placeholder:text-muted-foreground min-h-[80px]"
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingHypothesis(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={saveNotes}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Save className="size-3.5 mr-1.5" />
                    Save Notes
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
