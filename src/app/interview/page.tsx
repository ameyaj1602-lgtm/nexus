'use client';

import { useState, createElement } from 'react';
import { interviewSets, CareerInterviewSet } from '@/lib/interview-data';
import Sidebar from '@/components/shared/sidebar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Lightbulb,
  Send,
  Palette,
  BarChart3,
  Stethoscope,
  Target,
  Cpu,
  Scale,
  Video,
  Zap,
  Building2,
  Brain,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<any>> = {
  Palette,
  BarChart3,
  Stethoscope,
  Target,
  Cpu,
  Scale,
  Video,
  Zap,
  Building2,
  Brain,
};

function CareerIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name];
  if (Icon) return createElement(Icon, { className: className || 'size-5 text-primary' });
  return (
    <span className={`size-9 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary ${className || ''}`}>
      {name.charAt(0)}
    </span>
  );
}

function getCategoryStyle(cat: string) {
  switch (cat) {
    case 'technical':
      return 'bg-primary/10 text-primary border-primary/30';
    case 'behavioral':
      return 'bg-cyan-accent/10 text-cyan-accent border-cyan-accent/30';
    case 'situational':
      return 'bg-coral/10 text-coral border-coral/30';
    default:
      return 'bg-success/10 text-success border-success/30';
  }
}

export default function InterviewPage() {
  const [selected, setSelected] = useState<CareerInterviewSet | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showTip, setShowTip] = useState<Record<number, boolean>>({});
  const [currentAnswer, setCurrentAnswer] = useState('');

  const currentQuestion = selected ? selected.questions[questionIndex] : null;
  const totalQuestions = selected ? selected.questions.length : 0;
  const answeredCount = Object.keys(answers).length;
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  function handleSubmitAnswer() {
    if (!currentAnswer.trim()) return;
    setAnswers((prev) => ({ ...prev, [questionIndex]: currentAnswer.trim() }));
    setShowTip((prev) => ({ ...prev, [questionIndex]: true }));
    setCurrentAnswer('');
  }

  function handleNext() {
    if (selected && questionIndex < selected.questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
      setCurrentAnswer(answers[questionIndex + 1] || '');
    }
  }

  function handleBack() {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
      setCurrentAnswer(answers[questionIndex - 1] || '');
    }
  }

  function handleReset() {
    setSelected(null);
    setQuestionIndex(0);
    setAnswers({});
    setShowTip({});
    setCurrentAnswer('');
  }

  // Selection grid
  if (!selected) {
    return (
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 max-w-5xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Interview Prep</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Practice answering real interview questions for your target career. Get expert tips after each answer.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {interviewSets.map((set) => (
              <button
                key={set.career}
                onClick={() => setSelected(set)}
                className="group text-left rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CareerIcon name={set.icon} className="size-5 text-primary" />
                  </div>
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {set.type}
                  </Badge>
                </div>
                <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                  {set.career}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {set.questions.length} practice questions
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <MessageSquare className="size-3" /> Start practice
                </div>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Interview practice view
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 max-w-5xl">
        <div className="max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <CareerIcon name={selected.icon} className="size-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">{selected.career} Interview</h1>
                <p className="text-xs text-muted-foreground">
                  {answeredCount} of {totalQuestions} answered
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground">
              <RotateCcw className="size-4 mr-1" />
              Exit
            </Button>
          </div>

          {/* Progress */}
          <Progress value={progress} className="h-1.5 mb-6" />

          {/* Question navigation dots */}
          <div className="flex gap-1.5 mb-6">
            {selected.questions.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuestionIndex(i);
                  setCurrentAnswer(answers[i] || '');
                }}
                className={`size-2.5 rounded-full transition-all ${
                  i === questionIndex
                    ? 'bg-primary scale-125'
                    : answers[i]
                    ? 'bg-success'
                    : 'bg-muted-foreground/20'
                }`}
              />
            ))}
          </div>

          {/* Current question */}
          {currentQuestion && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-muted-foreground">Q{questionIndex + 1}</span>
                  <Badge variant="outline" className={`text-[10px] capitalize ${getCategoryStyle(currentQuestion.category)}`}>
                    {currentQuestion.category}
                  </Badge>
                </div>
                <h2 className="text-lg font-semibold leading-relaxed text-foreground">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Answer area */}
              {answers[questionIndex] ? (
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="text-xs text-muted-foreground mb-1">Your answer:</p>
                  <p className="text-sm leading-relaxed text-foreground">{answers[questionIndex]}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Type your answer here... Think about this as if you were in a real interview."
                    rows={5}
                    className="text-sm"
                  />
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={!currentAnswer.trim()}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Send className="size-4 mr-1" />
                    Submit Answer
                  </Button>
                </div>
              )}

              {/* Tip */}
              {showTip[questionIndex] && (
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="font-semibold text-sm mb-2 flex items-center gap-2 text-primary">
                    <Lightbulb className="size-4" />
                    Expert Tip
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {currentQuestion.tip}
                  </p>
                </div>
              )}

              {/* Show tip button if already answered but tip not shown */}
              {answers[questionIndex] && !showTip[questionIndex] && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTip((prev) => ({ ...prev, [questionIndex]: true }))}
                >
                  <Lightbulb className="size-4 mr-1" />
                  Show Tip
                </Button>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  disabled={questionIndex === 0}
                  className="text-muted-foreground"
                >
                  <ArrowLeft className="size-4 mr-1" />
                  Previous
                </Button>
                {questionIndex < totalQuestions - 1 ? (
                  <Button variant="ghost" size="sm" onClick={handleNext}>
                    Next
                    <ArrowRight className="size-4 ml-1" />
                  </Button>
                ) : answeredCount === totalQuestions ? (
                  <div className="flex items-center gap-2 text-success text-sm">
                    <CheckCircle2 className="size-4" />
                    All done!
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {totalQuestions - answeredCount} remaining
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
