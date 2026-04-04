'use client';

import { useState } from 'react';
import { simulations, CareerSimulation, SimulationStep } from '@/lib/simulations-data';
import Sidebar from '@/components/shared/sidebar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Clock,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export default function SimulatePage() {
  const [selected, setSelected] = useState<CareerSimulation | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [choices, setChoices] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);

  const currentStep = selected ? selected.steps[stepIndex] : null;
  const progress = selected ? ((stepIndex + 1) / selected.steps.length) * 100 : 0;

  function handleChoice(optionIndex: number) {
    setChoices((prev) => ({ ...prev, [stepIndex]: optionIndex }));
  }

  function handleNext() {
    if (!selected) return;
    if (stepIndex < selected.steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      setFinished(true);
    }
  }

  function handleBack() {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  }

  function handleReset() {
    setSelected(null);
    setStepIndex(0);
    setChoices({});
    setFinished(false);
  }

  function handleAddHypothesis() {
    if (!selected) return;
    try {
      const existing = JSON.parse(localStorage.getItem('nexus_hypotheses') || '[]');
      const already = existing.find((h: { career: string }) => h.career === selected.career);
      if (!already) {
        existing.push({
          id: crypto.randomUUID(),
          career: selected.career,
          status: 'exploring',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        localStorage.setItem('nexus_hypotheses', JSON.stringify(existing));
      }
    } catch {
      // ignore
    }
  }

  // Skills collected from choices
  const collectedSkills = selected
    ? Object.entries(choices).map(([si, oi]) => {
        const step = selected.steps[Number(si)];
        return step.choice?.options[oi]?.skill;
      }).filter(Boolean)
    : [];

  // Grid selection view
  if (!selected) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 px-4 py-8 md:px-8 pb-24 md:pb-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Day in the Life Simulator
              </h1>
              <p className="text-muted-foreground">
                Step into a career for a few minutes. Experience realistic tasks, make decisions, and discover which skills you naturally gravitate toward.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {simulations.map((sim) => (
                <button
                  key={sim.id}
                  onClick={() => setSelected(sim)}
                  className="group text-left rounded-xl border border-border bg-card p-5 hover:border-indigo-500/50 hover:bg-indigo-600/5 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{sim.icon}</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      {sim.duration}
                    </div>
                  </div>
                  <h3 className="font-semibold text-base mb-1 group-hover:text-indigo-400 transition-colors">
                    {sim.career}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {sim.steps.length} steps with interactive decisions
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="size-3" /> Start simulation
                  </div>
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Finished summary view
  if (finished) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 px-4 py-8 md:px-8 pb-24 md:pb-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-5xl mb-4 block">{selected.icon}</span>
              <h1 className="text-2xl font-bold mb-2">Simulation Complete!</h1>
              <p className="text-muted-foreground">
                You just experienced a day as a {selected.career}.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 mb-6">
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="size-4 text-indigo-400" />
                Skills You Demonstrated
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {collectedSkills.map((skill, i) => (
                  <Badge key={i} variant="secondary" className="bg-indigo-600/10 text-indigo-400 border-indigo-600/20">
                    {skill}
                  </Badge>
                ))}
                {selected.steps.map((step, i) => (
                  <Badge key={`sh-${i}`} variant="outline" className="text-xs">
                    {step.skill_highlight}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 mb-6">
              <h2 className="font-semibold mb-3">Career Summary</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selected.summary}
              </p>
            </div>

            {Object.keys(choices).length > 0 && (
              <div className="rounded-xl border border-border bg-card p-6 mb-6">
                <h2 className="font-semibold mb-3">Your Decisions</h2>
                <div className="space-y-3">
                  {Object.entries(choices).map(([si, oi]) => {
                    const step = selected.steps[Number(si)];
                    if (!step.choice) return null;
                    const chosen = step.choice.options[oi];
                    return (
                      <div key={si} className="text-sm">
                        <p className="text-muted-foreground text-xs mb-1">{step.choice.question}</p>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="size-4 text-emerald-400 mt-0.5 shrink-0" />
                          <div>
                            <span className="font-medium">{chosen.label}</span>
                            <p className="text-xs text-muted-foreground mt-0.5">{chosen.outcome}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleAddHypothesis} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                Add to Hypotheses
              </Button>
              <Button onClick={handleReset} variant="outline" className="flex-1">
                <RotateCcw className="size-4 mr-2" />
                Try Another Career
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Step-by-step walkthrough
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
                <h1 className="text-lg font-bold">{selected.career}</h1>
                <p className="text-xs text-muted-foreground">
                  Step {stepIndex + 1} of {selected.steps.length}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground">
              Exit
            </Button>
          </div>

          {/* Progress */}
          <Progress value={progress} className="h-1.5 mb-8" />

          {/* Current Step */}
          {currentStep && (
            <div className="space-y-6">
              {/* Time & Title */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600/10 text-indigo-400 text-sm font-medium">
                  <Clock className="size-3.5" />
                  {currentStep.time}
                </div>
                <Badge variant="outline" className="text-xs">
                  {currentStep.skill_highlight}
                </Badge>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">{currentStep.title}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {currentStep.description}
                </p>
              </div>

              {/* Choice */}
              {currentStep.choice && (
                <div className="rounded-xl border border-border bg-card/50 p-5">
                  <p className="font-medium mb-4 text-sm">
                    {currentStep.choice.question}
                  </p>
                  <div className="space-y-2">
                    {currentStep.choice.options.map((opt, i) => {
                      const isChosen = choices[stepIndex] === i;
                      return (
                        <button
                          key={i}
                          onClick={() => handleChoice(i)}
                          className={`w-full text-left rounded-lg border p-3.5 text-sm transition-all ${
                            isChosen
                              ? 'border-indigo-500 bg-indigo-600/10 text-indigo-300'
                              : 'border-border hover:border-muted-foreground/30 hover:bg-muted/30'
                          }`}
                        >
                          <span className="font-medium">{opt.label}</span>
                          {isChosen && (
                            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                              {opt.outcome}
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  disabled={stepIndex === 0}
                  className="text-muted-foreground"
                >
                  <ArrowLeft className="size-4 mr-1" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={currentStep.choice && choices[stepIndex] === undefined}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {stepIndex === selected.steps.length - 1 ? 'Finish' : 'Next'}
                  <ArrowRight className="size-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
