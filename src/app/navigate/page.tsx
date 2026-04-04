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
      why: 'You combine hands-on practicality with analytical thinking \u2014 perfect for building and optimizing real-world systems.',
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
    exploring: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    tested: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Map className="size-6 text-emerald-400" /> Navigate Your Path
            </h1>
            <p className="text-zinc-400 mt-1">Stream recommendations, career hypotheses, and your roadmap ahead.</p>
          </div>

          {/* Stream Recommendations */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Compass className="size-5 text-indigo-400" />
              Recommended Streams
            </h2>
            {streamRecs.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {streamRecs.map((rec) => (
                  <div
                    key={rec.name}
                    className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-zinc-100">{rec.name}</h3>
                      <span className="text-xs font-medium text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full">
                        {rec.confidence}% fit
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400 mb-4">{rec.why}</p>
                    <div>
                      <p className="text-xs text-zinc-500 mb-2">Example careers:</p>
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
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-center">
                <Compass className="size-8 mx-auto mb-3 text-zinc-600" />
                <p className="text-sm text-zinc-500">
                  Complete your identity assessment to get personalized stream recommendations.
                </p>
              </div>
            )}
          </section>

          {/* Career Hypothesis Board */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="size-5 text-yellow-400" />
              Career Hypothesis Board
            </h2>
            {hypotheses.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {hypotheses.map((h) => (
                  <div
                    key={h.id}
                    className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-zinc-200">{h.career_name}</h3>
                      <button
                        onClick={() => openEditModal(h)}
                        className="text-zinc-500 hover:text-zinc-300 transition-colors"
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
                              : 'border-zinc-800 text-zinc-600 hover:text-zinc-400'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    {/* Notes preview */}
                    {(h.liked_aspects || h.disliked_aspects) && (
                      <div className="space-y-1 text-xs text-zinc-500">
                        {h.liked_aspects && (
                          <p className="line-clamp-1">
                            <span className="text-emerald-500">Liked:</span> {h.liked_aspects}
                          </p>
                        )}
                        {h.disliked_aspects && (
                          <p className="line-clamp-1">
                            <span className="text-red-400">Disliked:</span> {h.disliked_aspects}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-center">
                <Lightbulb className="size-8 mx-auto mb-3 text-zinc-600" />
                <p className="text-sm text-zinc-500 mb-3">
                  No career hypotheses yet. Explore careers and add ones that interest you.
                </p>
                <a href="/explore">
                  <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300">
                    Explore Careers
                  </Button>
                </a>
              </div>
            )}
          </section>

          {/* Visual Roadmap */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Map className="size-5 text-emerald-400" />
              Your Career Roadmap
            </h2>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[18px] top-0 bottom-0 w-px bg-zinc-800 sm:left-[22px]" />

              <div className="space-y-6">
                {ROADMAP_PHASES.map((phase, i) => (
                  <div key={phase.title} className="relative flex gap-4 sm:gap-6">
                    {/* Icon circle */}
                    <div
                      className={`relative z-10 flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-full border-2 ${
                        phase.active
                          ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400'
                          : 'border-zinc-700 bg-zinc-900 text-zinc-500'
                      }`}
                    >
                      {phase.icon}
                    </div>

                    {/* Content */}
                    <div className={`flex-1 ${i < ROADMAP_PHASES.length - 1 ? 'pb-6' : ''}`}>
                      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 hover:border-zinc-700 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-zinc-200">{phase.title}</h3>
                          <Badge
                            variant={phase.active ? 'default' : 'secondary'}
                            className={`text-[10px] ${phase.active ? 'bg-indigo-600' : ''}`}
                          >
                            {phase.timeline}
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-zinc-500 mb-1.5 font-medium">Key Decisions</p>
                            <ul className="space-y-1">
                              {phase.decisions.map((d) => (
                                <li key={d} className="text-sm text-zinc-400 flex items-start gap-2">
                                  <ChevronRight className="size-3 mt-1 shrink-0 text-zinc-600" />
                                  {d}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs text-zinc-500 mb-1.5 font-medium">Recommended Actions</p>
                            <ul className="space-y-1">
                              {phase.actions.map((a) => (
                                <li key={a} className="text-sm text-zinc-400 flex items-start gap-2">
                                  <ChevronRight className="size-3 mt-1 shrink-0 text-indigo-500" />
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
        <DialogContent className="max-w-md bg-zinc-900 border-zinc-800 text-zinc-100">
          {editingHypothesis && (
            <>
              <DialogHeader>
                <DialogTitle>{editingHypothesis.career_name}</DialogTitle>
                <DialogDescription>Add notes about this career hypothesis</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-1.5 block">
                    What I liked
                  </label>
                  <Textarea
                    value={editLiked}
                    onChange={(e) => setEditLiked(e.target.value)}
                    placeholder="What excited you about this career?"
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 min-h-[80px]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-1.5 block">
                    What I didn&apos;t like
                  </label>
                  <Textarea
                    value={editDisliked}
                    onChange={(e) => setEditDisliked(e.target.value)}
                    placeholder="What concerns or doubts do you have?"
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 min-h-[80px]"
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingHypothesis(null)}
                    className="border-zinc-700 text-zinc-400"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={saveNotes}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
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
