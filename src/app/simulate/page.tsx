'use client';

import { useState, createElement } from 'react';
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
  CheckCircle2,
  Palette,
  BarChart3,
  Stethoscope,
  Scale,
  Clapperboard,
  Lightbulb,
  Building2,
  BrainCircuit,
  Brain,
  Rocket,
  Bookmark,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<any>> = {
  Palette,
  BarChart3,
  Stethoscope,
  Scale,
  Clapperboard,
  Lightbulb,
  Building2,
  BrainCircuit,
  Brain,
  Rocket,
};

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

  function renderIcon(iconName: string, className: string = 'size-5 text-primary') {
    const IconComponent = iconMap[iconName];
    if (!IconComponent) return null;
    return createElement(IconComponent, { className });
  }

  // Grid selection view
  if (!selected) {
    return (
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 max-w-5xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">
              Day in the Life Simulator
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Step into a career for a few minutes. Experience realistic tasks, make decisions, and discover which skills you naturally gravitate toward.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {simulations.map((sim) => (
              <button
                key={sim.id}
                onClick={() => setSelected(sim)}
                className="group text-left rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    {renderIcon(sim.icon)}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    {sim.duration}
                  </div>
                </div>
                <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                  {sim.career}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {sim.steps.length} steps with interactive decisions
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="size-3" /> Start simulation
                </div>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Finished summary view
  if (finished) {
    return (
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 max-w-5xl">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                {renderIcon(selected.icon)}
              </div>
              <h1 className="text-2xl font-bold mb-2">Simulation Complete</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You just experienced a day as a {selected.career}.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 mb-6">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Bookmark className="size-4 text-primary" />
                Skills You Demonstrated
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {collectedSkills.map((skill, i) => (
                  <Badge key={i} variant="secondary" className="bg-primary/10 text-primary border-primary/30">
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
              <h2 className="text-lg font-semibold mb-3">Career Summary</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selected.summary}
              </p>
            </div>

            {Object.keys(choices).length > 0 && (
              <div className="rounded-xl border border-border bg-card p-6 mb-6">
                <h2 className="text-lg font-semibold mb-3">Your Decisions</h2>
                <div className="space-y-3">
                  {Object.entries(choices).map(([si, oi]) => {
                    const step = selected.steps[Number(si)];
                    if (!step.choice) return null;
                    const chosen = step.choice.options[oi];
                    return (
                      <div key={si} className="text-sm">
                        <p className="text-muted-foreground text-xs mb-1">{step.choice.question}</p>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="size-4 text-success mt-0.5 shrink-0" />
                          <div>
                            <span className="font-medium text-foreground">{chosen.label}</span>
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
              <Button onClick={handleAddHypothesis} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
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
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 max-w-5xl">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                {renderIcon(selected.icon)}
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">{selected.career}</h1>
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
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Clock className="size-3.5" />
                  {currentStep.time}
                </div>
                <Badge variant="outline" className="text-xs">
                  {currentStep.skill_highlight}
                </Badge>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-3 text-foreground">{currentStep.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {currentStep.description}
                </p>
              </div>

              {/* Choice */}
              {currentStep.choice && (
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="font-medium mb-4 text-sm text-foreground">
                    {currentStep.choice.question}
                  </p>
                  <div className="space-y-2">
                    {currentStep.choice.options.map((opt, i) => {
                      const isChosen = choices[stepIndex] === i;
                      return (
                        <button
                          key={i}
                          onClick={() => handleChoice(i)}
                          className={`w-full text-left rounded-lg border p-3.5 text-sm transition-colors ${
                            isChosen
                              ? 'border-primary/30 bg-primary/10 text-primary'
                              : 'border-border hover:border-primary/30 hover:bg-muted'
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
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
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
