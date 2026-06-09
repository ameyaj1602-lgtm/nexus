'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  ChevronRight,
  ChevronLeft,
  Cpu,
  Palette,
  FlaskConical,
  Briefcase,
  Dumbbell,
  Music,
  PenTool,
  Heart,
  Gamepad2,
  UtensilsCrossed,
  TreePine,
  Film,
  Calculator,
  Stethoscope,
  Scale,
  GraduationCap,
  CheckCircle2,
} from 'lucide-react';

const ages = Array.from({ length: 7 }, (_, i) => String(12 + i));
const grades = ['8', '9', '10'];
const boards = ['CBSE', 'ICSE', 'State', 'IB', 'Other'];
const schoolTypes = ['Private', 'Government', 'Semi-Government', 'International'];

const parentChips = [
  'Engineering',
  'Medicine',
  'CA',
  'Government Job',
  'Abroad',
  'Not Sure',
  'Other',
];

const interestOptions = [
  { id: 'technology', label: 'Technology', icon: Cpu },
  { id: 'art_design', label: 'Art & Design', icon: Palette },
  { id: 'science', label: 'Science', icon: FlaskConical },
  { id: 'business', label: 'Business', icon: Briefcase },
  { id: 'sports', label: 'Sports', icon: Dumbbell },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'writing', label: 'Writing', icon: PenTool },
  { id: 'social_work', label: 'Social Work', icon: Heart },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'food', label: 'Food', icon: UtensilsCrossed },
  { id: 'nature', label: 'Nature', icon: TreePine },
  { id: 'film', label: 'Film', icon: Film },
  { id: 'math', label: 'Math', icon: Calculator },
  { id: 'medicine', label: 'Medicine', icon: Stethoscope },
  { id: 'law', label: 'Law', icon: Scale },
  { id: 'teaching', label: 'Teaching', icon: GraduationCap },
];

const identityQuestions = [
  { key: 'creative', question: 'I love making things look beautiful' },
  { key: 'analytical', question: 'I enjoy solving puzzles and logical problems' },
  { key: 'social', question: "I feel energized when I'm around people" },
  { key: 'practical', question: 'I prefer hands-on work over reading' },
  { key: 'entrepreneurial', question: 'I dream of building my own thing someday' },
  { key: 'caring', question: 'Helping others gives me the most satisfaction' },
];

const scaleLabels = ['Not me', '', 'Neutral', '', 'Totally me'];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Step 1
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [board, setBoard] = useState('');
  const [city, setCity] = useState('');
  const [schoolType, setSchoolType] = useState('');

  // Step 2
  const [parentExpectations, setParentExpectations] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  // Step 3
  const [scores, setScores] = useState<Record<string, number>>({
    creative: 3,
    analytical: 3,
    social: 3,
    practical: 3,
    entrepreneurial: 3,
    caring: 3,
  });

  function toggleParentChip(chip: string) {
    setParentExpectations((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  }

  function toggleInterest(id: string) {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  function canProceedStep1() {
    return name.trim() && age && grade && board && city.trim() && schoolType;
  }

  function canProceedStep2() {
    return parentExpectations.length > 0 && interests.length >= 2;
  }

  function handleFinish() {
    // Convert 1-5 scores to 0-100 for identity dimensions
    const identityScores: Record<string, number> = {};
    for (const key of Object.keys(scores)) {
      identityScores[key] = Math.round(((scores[key] - 1) / 4) * 100);
    }

    const onboardingData = {
      profile: { name, age, grade, board, city, schoolType },
      parentExpectations,
      interests,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem('nexus_onboarding', JSON.stringify(onboardingData));

    // Save identity snapshot in the format the dashboard expects
    const identitySnapshot = {
      id: crypto.randomUUID(),
      student_id: 'current',
      ...identityScores,
      snapshot_date: new Date().toISOString(),
      source: 'self',
    };
    localStorage.setItem('nexus_identity', JSON.stringify(identitySnapshot));

    // Update user name in auth
    const userRaw = localStorage.getItem('nexus_user');
    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        user.name = name;
        localStorage.setItem('nexus_user', JSON.stringify(user));
      } catch {}
    }

    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header with progress */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-foreground">
              Nexus
            </span>
            <span className="text-sm text-muted-foreground">
              Step {step} of 3
            </span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  s <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-2xl w-full px-4 py-8">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h1 className="text-2xl font-bold">Tell us about yourself</h1>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                This helps us personalize your experience.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-muted-foreground">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="mt-1.5 bg-card border-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Age</Label>
                  <Select value={age} onValueChange={(v) => { if (v) setAge(v); }}>
                    <SelectTrigger className="mt-1.5 w-full">
                      <SelectValue placeholder="Select age" />
                    </SelectTrigger>
                    <SelectContent>
                      {ages.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a} years
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-muted-foreground">Class / Grade</Label>
                  <Select value={grade} onValueChange={(v) => { if (v) setGrade(v); }}>
                    <SelectTrigger className="mt-1.5 w-full">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((g) => (
                        <SelectItem key={g} value={g}>
                          Class {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Board</Label>
                <Select value={board} onValueChange={(v) => { if (v) setBoard(v); }}>
                  <SelectTrigger className="mt-1.5 w-full">
                    <SelectValue placeholder="Select your board" />
                  </SelectTrigger>
                  <SelectContent>
                    {boards.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="city" className="text-muted-foreground">
                  City
                </Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Your city"
                  className="mt-1.5 bg-card border-border"
                />
              </div>

              <div>
                <Label className="text-muted-foreground">School Type</Label>
                <Select value={schoolType} onValueChange={(v) => { if (v) setSchoolType(v); }}>
                  <SelectTrigger className="mt-1.5 w-full">
                    <SelectValue placeholder="Select school type" />
                  </SelectTrigger>
                  <SelectContent>
                    {schoolTypes.map((st) => (
                      <SelectItem key={st} value={st}>
                        {st}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={() => setStep(2)}
                disabled={!canProceedStep1()}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11"
              >
                Continue
                <ChevronRight className="size-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Your World */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h1 className="text-2xl font-bold">Your World</h1>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                Help us understand what matters to you and your family.
              </p>
            </div>

            {/* Parent expectations */}
            <div className="space-y-3">
              <Label className="text-base">
                What do your parents want for you?
              </Label>
              <p className="text-sm text-muted-foreground">
                Select all that apply. No judgment here.
              </p>
              <div className="flex flex-wrap gap-2">
                {parentChips.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => toggleParentChip(chip)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      parentExpectations.includes(chip)
                        ? 'bg-primary/10 border-primary/30 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* What excites you */}
            <div className="space-y-3">
              <Label className="text-base">What excites you?</Label>
              <p className="text-sm text-muted-foreground">
                Pick at least 2 areas that spark your curiosity.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {interestOptions.map((item) => {
                  const selected = interests.includes(item.id);
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleInterest(item.id)}
                      className={`relative flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${
                        selected
                          ? 'bg-primary/10 border-primary/30'
                          : 'bg-card border-border hover:border-primary/30'
                      }`}
                    >
                      {selected && (
                        <CheckCircle2 className="absolute top-2 right-2 size-4 text-primary" />
                      )}
                      <Icon
                        className={`size-5 ${
                          selected
                            ? 'text-primary'
                            : 'text-muted-foreground'
                        }`}
                      />
                      <span
                        className={`text-xs font-medium text-center leading-tight ${
                          selected
                            ? 'text-primary'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="h-11"
              >
                <ChevronLeft className="size-4 mr-1" />
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!canProceedStep2()}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-11"
              >
                Continue
                <ChevronRight className="size-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Identity Check */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h1 className="text-2xl font-bold">Quick Identity Check</h1>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                Rate how much each statement feels like you. 1 = not me, 5 =
                totally me.
              </p>
            </div>

            <div className="space-y-5">
              {identityQuestions.map((q) => (
                <Card key={q.key} className="rounded-xl border border-border bg-card p-5">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-foreground pr-4">{q.question}</p>
                      <Badge
                        variant="outline"
                        className="shrink-0 text-primary border-primary/30"
                      >
                        {scores[q.key]}/5
                      </Badge>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={scores[q.key]}
                      onChange={(e) =>
                        setScores((prev) => ({
                          ...prev,
                          [q.key]: Number(e.target.value),
                        }))
                      }
                      className="w-full accent-primary cursor-pointer h-2"
                    />
                    <div className="flex justify-between mt-1">
                      {scaleLabels.map((label, i) => (
                        <span
                          key={i}
                          className={`text-[10px] w-12 text-center ${
                            scores[q.key] === i + 1
                              ? 'text-primary font-medium'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="h-11"
              >
                <ChevronLeft className="size-4 mr-1" />
                Back
              </Button>
              <Button
                onClick={handleFinish}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-11"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
