'use client';

import { useState } from 'react';
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
} from 'lucide-react';

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

  function getCategoryColor(cat: string) {
    switch (cat) {
      case 'technical': return 'bg-blue-600/10 text-blue-400 border-blue-600/20';
      case 'behavioral': return 'bg-purple-600/10 text-purple-400 border-purple-600/20';
      case 'situational': return 'bg-amber-600/10 text-amber-400 border-amber-600/20';
      default: return 'bg-emerald-600/10 text-emerald-400 border-emerald-600/20';
    }
  }

  // Selection grid
  if (!selected) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 px-4 py-8 md:px-8 pb-24 md:pb-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
                <MessageSquare className="size-6 text-indigo-400" />
                Interview Prep
              </h1>
              <p className="text-muted-foreground">
                Practice answering real interview questions for your target career. Get expert tips after each answer.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {interviewSets.map((set) => (
                <button
                  key={set.career}
                  onClick={() => setSelected(set)}
                  className="group text-left rounded-xl border border-border bg-card p-5 hover:border-indigo-500/50 hover:bg-indigo-600/5 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{set.icon}</span>
                    <Badge variant="outline" className="text-[10px] capitalize">{set.type}</Badge>
                  </div>
                  <h3 className="font-semibold text-base mb-1 group-hover:text-indigo-400 transition-colors">
                    {set.career}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {set.questions.length} practice questions
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MessageSquare className="size-3" /> Start practice
                  </div>
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Interview practice view
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 px-4 py-8 md:px-8 pb-24 md:pb-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selected.icon}</span>
              <div>
                <h1 className="text-lg font-bold">{selected.career} Interview</h1>
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
                    ? 'bg-indigo-500 scale-125'
                    : answers[i]
                    ? 'bg-emerald-500'
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
                  <Badge variant="outline" className={`text-[10px] capitalize ${getCategoryColor(currentQuestion.category)}`}>
                    {currentQuestion.category}
                  </Badge>
                </div>
                <h2 className="text-lg font-semibold leading-relaxed">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Answer area */}
              {answers[questionIndex] ? (
                <div className="rounded-xl border border-border bg-card/50 p-4">
                  <p className="text-xs text-muted-foreground mb-1">Your answer:</p>
                  <p className="text-sm leading-relaxed">{answers[questionIndex]}</p>
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
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Send className="size-4 mr-1" />
                    Submit Answer
                  </Button>
                </div>
              )}

              {/* Tip */}
              {showTip[questionIndex] && (
                <div className="rounded-xl border border-amber-600/20 bg-amber-600/5 p-5">
                  <h3 className="font-semibold text-sm mb-2 flex items-center gap-2 text-amber-400">
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
                  className="text-amber-400 border-amber-600/20 hover:bg-amber-600/5"
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
                  <div className="flex items-center gap-2 text-emerald-400 text-sm">
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
