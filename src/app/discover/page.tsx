'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Brain,
  Flame,
  Meh,
  X,
  Check,
  ChevronUp,
  ChevronDown,
  BookOpen,
  RotateCcw,
} from 'lucide-react';
import Sidebar from '@/components/shared/sidebar';

// ─── Interest Explorer: 20 scenario cards ─────────────────────
const scenarioCards = [
  { id: 1, scenario: "You're building a robot that can paint murals on city walls", icon: '🤖', category: 'Technology', dims: { creative: 2, analytical: 1, practical: 2 } },
  { id: 2, scenario: "You're leading a team to solve a community water crisis", icon: '🌊', category: 'Social Impact', dims: { social: 2, caring: 2, practical: 1 } },
  { id: 3, scenario: "You're analyzing stock market patterns to predict trends", icon: '📈', category: 'Business', dims: { analytical: 3, entrepreneurial: 1 } },
  { id: 4, scenario: "You're designing a mobile app that helps people meditate", icon: '🧘', category: 'Design', dims: { creative: 2, caring: 2, analytical: 1 } },
  { id: 5, scenario: "You're performing on stage at a music festival", icon: '🎸', category: 'Arts', dims: { creative: 3, social: 2 } },
  { id: 6, scenario: "You're running experiments in a biotech lab to cure a disease", icon: '🧬', category: 'Science', dims: { analytical: 3, practical: 1 } },
  { id: 7, scenario: "You're negotiating a billion-dollar business deal", icon: '🤝', category: 'Business', dims: { social: 2, entrepreneurial: 2, analytical: 1 } },
  { id: 8, scenario: "You're teaching underprivileged kids to code", icon: '💻', category: 'Social Impact', dims: { caring: 3, social: 1, practical: 1 } },
  { id: 9, scenario: "You're filming a documentary in the Himalayas", icon: '🎬', category: 'Arts', dims: { creative: 2, practical: 2, social: 1 } },
  { id: 10, scenario: "You're writing an article that could change government policy", icon: '✍️', category: 'Media', dims: { analytical: 1, social: 2, caring: 2 } },
  { id: 11, scenario: "You're launching your own fashion brand from scratch", icon: '👗', category: 'Business', dims: { creative: 2, entrepreneurial: 3 } },
  { id: 12, scenario: "You're debugging a complex AI algorithm at 2 AM", icon: '🐛', category: 'Technology', dims: { analytical: 3, practical: 2 } },
  { id: 13, scenario: "You're organizing a massive charity event for 1000 people", icon: '🎪', category: 'Social Impact', dims: { social: 3, caring: 1, entrepreneurial: 1 } },
  { id: 14, scenario: "You're inventing a clean energy device that could power villages", icon: '⚡', category: 'Science', dims: { analytical: 2, practical: 2, caring: 1 } },
  { id: 15, scenario: "You're coaching an athlete to win a national championship", icon: '🏆', category: 'Sports', dims: { social: 2, practical: 1, caring: 2 } },
  { id: 16, scenario: "You're designing the interior of a luxury hotel", icon: '🏨', category: 'Design', dims: { creative: 3, practical: 1 } },
  { id: 17, scenario: "You're arguing a landmark case in the Supreme Court", icon: '⚖️', category: 'Law', dims: { analytical: 2, social: 2, caring: 1 } },
  { id: 18, scenario: "You're developing a new recipe that becomes a viral sensation", icon: '👨‍🍳', category: 'Arts', dims: { creative: 2, entrepreneurial: 1, practical: 2 } },
  { id: 19, scenario: "You're managing a wildlife sanctuary in a national park", icon: '🦁', category: 'Nature', dims: { caring: 2, practical: 2, social: 1 } },
  { id: 20, scenario: "You're building a startup that connects rural artisans to global markets", icon: '🌍', category: 'Business', dims: { entrepreneurial: 3, caring: 1, social: 1 } },
];

const categoryColors: Record<string, string> = {
  Technology: 'bg-blue-600/20 text-blue-400',
  'Social Impact': 'bg-emerald-600/20 text-emerald-400',
  Business: 'bg-amber-600/20 text-amber-400',
  Design: 'bg-pink-600/20 text-pink-400',
  Arts: 'bg-purple-600/20 text-purple-400',
  Science: 'bg-cyan-600/20 text-cyan-400',
  Sports: 'bg-orange-600/20 text-orange-400',
  Media: 'bg-rose-600/20 text-rose-400',
  Law: 'bg-slate-600/20 text-slate-400',
  Nature: 'bg-green-600/20 text-green-400',
};

// ─── Values Sorter ─────────────────────────────────────────────
const valuesList = [
  { id: 'money', label: 'Money & Wealth', icon: '💰' },
  { id: 'freedom', label: 'Creative Freedom', icon: '🎨' },
  { id: 'helping', label: 'Helping Others', icon: '🤝' },
  { id: 'stability', label: 'Stability & Security', icon: '🏠' },
  { id: 'adventure', label: 'Adventure & Travel', icon: '✈️' },
  { id: 'fame', label: 'Fame & Recognition', icon: '🌟' },
  { id: 'family', label: 'Family & Relationships', icon: '❤️' },
];

// ─── Identity Journal ──────────────────────────────────────────
const journalPrompts = [
  'Describe a time you felt completely in your element.',
  'What would you do if no one judged you?',
  'What problem in the world makes you most angry?',
  'If you could shadow anyone for a week, who would it be and why?',
  "What's something you're good at that most people don't know?",
];

export default function DiscoverPage() {
  // Interest Explorer state
  const [currentCard, setCurrentCard] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});

  // Values Sorter state
  const [values, setValues] = useState(
    valuesList.map((v, i) => ({ ...v, rank: i + 1 }))
  );

  // Journal state
  const [journalText, setJournalText] = useState('');
  const [journalEntries, setJournalEntries] = useState<
    { prompt: string; response: string; date: string }[]
  >([]);
  const [currentPrompt, setCurrentPrompt] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nexus_journal');
      if (saved) setJournalEntries(JSON.parse(saved));
    } catch {}
    try {
      const savedResponses = localStorage.getItem('nexus_interest_responses');
      if (savedResponses) {
        const parsed = JSON.parse(savedResponses);
        setResponses(parsed);
        setCurrentCard(Object.keys(parsed).length);
      }
    } catch {}
    try {
      const savedValues = localStorage.getItem('nexus_values');
      if (savedValues) setValues(JSON.parse(savedValues));
    } catch {}
  }, []);

  // ── Interest Explorer handlers ──
  function respond(type: string) {
    const updated = { ...responses, [currentCard]: type };
    setResponses(updated);
    localStorage.setItem('nexus_interest_responses', JSON.stringify(updated));

    // Update identity scores based on response
    if (type === 'love') {
      try {
        const dims = scenarioCards[currentCard]?.dims || {};
        const raw = localStorage.getItem('nexus_identity');
        const current = raw
          ? JSON.parse(raw)
          : {
              creative: 50,
              analytical: 50,
              social: 50,
              practical: 50,
              entrepreneurial: 50,
              caring: 50,
            };

        const isScaled = Object.values(current).some(
          (v) => typeof v === 'number' && (v as number) > 5
        );

        Object.entries(dims).forEach(([key, val]) => {
          if (isScaled) {
            current[key] = Math.min(100, (current[key] || 50) + (val as number) * 3);
          } else {
            current[key] = Math.min(5, (current[key] || 3) + (val as number) * 0.15);
          }
        });
        localStorage.setItem('nexus_identity', JSON.stringify(current));
      } catch {}
    }

    if (currentCard < scenarioCards.length - 1) {
      setCurrentCard((c) => c + 1);
    } else {
      setCurrentCard(scenarioCards.length);
    }
  }

  function resetInterests() {
    setCurrentCard(0);
    setResponses({});
    localStorage.removeItem('nexus_interest_responses');
  }

  // ── Values Sorter handlers ──
  function moveValue(index: number, direction: number) {
    const newValues = [...values];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= newValues.length) return;
    [newValues[index], newValues[newIndex]] = [
      newValues[newIndex],
      newValues[index],
    ];
    newValues.forEach((v, i) => (v.rank = i + 1));
    setValues(newValues);
    localStorage.setItem('nexus_values', JSON.stringify(newValues));
  }

  // ── Journal handlers ──
  function saveJournal() {
    if (!journalText.trim()) return;
    const entry = {
      prompt: journalPrompts[currentPrompt],
      response: journalText.trim(),
      date: new Date().toISOString(),
    };
    const updated = [...journalEntries, entry];
    setJournalEntries(updated);
    localStorage.setItem('nexus_journal', JSON.stringify(updated));
    setJournalText('');
    setCurrentPrompt((p) => (p + 1) % journalPrompts.length);
  }

  const card = scenarioCards[currentCard];
  const done = currentCard >= scenarioCards.length;
  const completedCount = Math.min(
    Object.keys(responses).length,
    scenarioCards.length
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Brain className="size-6 text-indigo-400" />
              Discover Who You Are
            </h1>
            <p className="text-muted-foreground mt-1">
              Explore your interests, rank your values, and journal your thoughts.
            </p>
          </div>

          <Tabs defaultValue="interests" className="space-y-6">
            <TabsList className="bg-muted border border-border">
              <TabsTrigger value="interests">Interest Explorer</TabsTrigger>
              <TabsTrigger value="values">Values Sorter</TabsTrigger>
              <TabsTrigger value="journal">Identity Journal</TabsTrigger>
            </TabsList>

            {/* ──── Tab 1: Interest Explorer ──── */}
            <TabsContent value="interests">
              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">
                    {completedCount} of {scenarioCards.length} scenarios
                  </span>
                  <span className="text-xs text-indigo-400 font-medium">
                    {Math.round(
                      (completedCount / scenarioCards.length) * 100
                    )}
                    %
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                    style={{
                      width: `${(completedCount / scenarioCards.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {!done && card ? (
                <Card className="bg-card border-border">
                  <CardContent className="p-8 text-center space-y-6">
                    <Badge
                      className={`text-xs border-0 ${
                        categoryColors[card.category] || 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {card.category}
                    </Badge>
                    <div className="text-6xl">{card.icon}</div>
                    <p className="text-xl leading-relaxed max-w-md mx-auto">
                      {card.scenario}
                    </p>
                    <div className="flex gap-3 justify-center flex-wrap">
                      <Button
                        onClick={() => respond('nope')}
                        variant="outline"
                        size="lg"
                        className="border-border hover:bg-red-950/50 hover:border-red-800 hover:text-red-300 min-w-[120px]"
                      >
                        <X className="size-5 mr-2" />
                        Not my thing
                      </Button>
                      <Button
                        onClick={() => respond('meh')}
                        variant="outline"
                        size="lg"
                        className="border-border hover:bg-yellow-950/50 hover:border-yellow-800 hover:text-yellow-300 min-w-[120px]"
                      >
                        <Meh className="size-5 mr-2" />
                        Meh
                      </Button>
                      <Button
                        onClick={() => respond('love')}
                        size="lg"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white min-w-[120px]"
                      >
                        <Flame className="size-5 mr-2" />
                        That&apos;s me!
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-card border-border">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="text-5xl">🎉</div>
                    <h3 className="text-xl font-semibold">
                      Interest exploration complete!
                    </h3>
                    <p className="text-muted-foreground">
                      Your identity snapshot has been updated based on your
                      responses.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button
                        onClick={resetInterests}
                        variant="outline"
                        className="border-border"
                      >
                        <RotateCcw className="size-4 mr-2" />
                        Retake
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* ──── Tab 2: Values Sorter ──── */}
            <TabsContent value="values">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">
                    Rank what matters most to you
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Use the arrows to reorder. #1 = most important to you.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {values.map((v, i) => (
                      <div
                        key={v.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border hover:border-muted-foreground transition-colors"
                      >
                        <span className="text-lg font-bold text-muted-foreground w-7 text-right">
                          #{v.rank}
                        </span>
                        <span className="text-2xl">{v.icon}</span>
                        <span className="flex-1 text-sm font-medium">
                          {v.label}
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => moveValue(i, -1)}
                            disabled={i === 0}
                            className="p-0.5 rounded hover:bg-muted disabled:opacity-20 transition-opacity"
                          >
                            <ChevronUp className="size-4 text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => moveValue(i, 1)}
                            disabled={i === values.length - 1}
                            className="p-0.5 rounded hover:bg-muted disabled:opacity-20 transition-opacity"
                          >
                            <ChevronDown className="size-4 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Your rankings are saved automatically.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ──── Tab 3: Identity Journal ──── */}
            <TabsContent value="journal">
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BookOpen className="size-5 text-indigo-400" />
                    <CardTitle className="text-base">Identity Journal</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Reflect on who you are -- no right or wrong answers.
                  </p>
                </CardHeader>
                <CardContent>
                  {/* Current prompt */}
                  <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-lg p-4 mb-4">
                    <p className="text-indigo-300 italic text-base leading-relaxed">
                      &ldquo;{journalPrompts[currentPrompt]}&rdquo;
                    </p>
                  </div>

                  <Textarea
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value)}
                    placeholder="Write your thoughts here..."
                    rows={5}
                    className="bg-muted/30 border-border mb-3 resize-none"
                  />

                  <div className="flex items-center justify-between">
                    <Button
                      onClick={saveJournal}
                      disabled={!journalText.trim()}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white"
                    >
                      <Check className="size-4 mr-2" />
                      Save Entry
                    </Button>
                    <button
                      onClick={() =>
                        setCurrentPrompt(
                          (p) => (p + 1) % journalPrompts.length
                        )
                      }
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Skip to next prompt →
                    </button>
                  </div>

                  {/* Past entries */}
                  {journalEntries.length > 0 && (
                    <div className="mt-8 space-y-3">
                      <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <BookOpen className="size-4" />
                        Past Entries ({journalEntries.length})
                      </h4>
                      {journalEntries
                        .slice()
                        .reverse()
                        .map((entry, i) => (
                          <div
                            key={i}
                            className="p-4 rounded-lg bg-muted/20 border border-border"
                          >
                            <p className="text-xs text-indigo-400 mb-1.5 font-medium">
                              {entry.prompt}
                            </p>
                            <p className="text-sm leading-relaxed">
                              {entry.response}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(entry.date).toLocaleDateString(
                                'en-IN',
                                {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                }
                              )}
                            </p>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
