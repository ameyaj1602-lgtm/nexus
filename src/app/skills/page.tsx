'use client';

import { useState, useEffect, useMemo, useCallback, createElement } from 'react';
import {
  skills21,
  skillCategories,
  categoryMeta,
  Skill21,
} from '@/lib/skills-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/shared/sidebar';
import {
  ChevronDown,
  ChevronUp,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Target,
  BarChart3,
  Lightbulb,
  RotateCcw,
  Puzzle,
  Handshake,
  Sun,
  Monitor,
} from 'lucide-react';

const STORAGE_KEY = 'nexus_skills_assessment';

// Map category names to Lucide icons (replacing emojis from categoryMeta)
const categoryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Thinking: Puzzle,
  People: Handshake,
  Self: Sun,
  Digital: Monitor,
};

function getAiResistanceMeta(level: Skill21['aiResistance']) {
  switch (level) {
    case 'High':
      return { icon: ShieldCheck, color: 'text-success', bg: 'bg-success/10', label: 'AI-Resistant' };
    case 'Medium':
      return { icon: Shield, color: 'text-coral', bg: 'bg-coral/10', label: 'AI-Augmented' };
    case 'Low':
      return { icon: ShieldAlert, color: 'text-destructive', bg: 'bg-destructive/10', label: 'AI-Replaceable' };
  }
}

// Simple radar chart using SVG
function RadarChart({
  data,
  labels,
  size = 280,
}: {
  data: number[];
  labels: string[];
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 40;
  const levels = 5;
  const n = data.length;

  function getPoint(index: number, value: number) {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    const dist = (value / 5) * r;
    return {
      x: cx + dist * Math.cos(angle),
      y: cy + dist * Math.sin(angle),
    };
  }

  // Grid lines
  const gridLines = [];
  for (let level = 1; level <= levels; level++) {
    const points = [];
    for (let i = 0; i < n; i++) {
      const p = getPoint(i, level);
      points.push(`${p.x},${p.y}`);
    }
    gridLines.push(
      <polygon
        key={`grid-${level}`}
        points={points.join(' ')}
        fill="none"
        stroke="hsl(var(--border))"
        strokeWidth="1"
      />
    );
  }

  // Axis lines
  const axes = [];
  for (let i = 0; i < n; i++) {
    const p = getPoint(i, 5);
    axes.push(
      <line
        key={`axis-${i}`}
        x1={cx}
        y1={cy}
        x2={p.x}
        y2={p.y}
        stroke="hsl(var(--border))"
        strokeWidth="1"
      />
    );
  }

  // Data polygon
  const dataPoints = data.map((v, i) => {
    const p = getPoint(i, v);
    return `${p.x},${p.y}`;
  });

  // Labels
  const labelElements = labels.map((label, i) => {
    const p = getPoint(i, 5.8);
    const short = label.length > 12 ? label.slice(0, 11) + '...' : label;
    return (
      <text
        key={`label-${i}`}
        x={p.x}
        y={p.y}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-muted-foreground text-[9px]"
      >
        {short}
      </text>
    );
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {gridLines}
      {axes}
      <polygon
        points={dataPoints.join(' ')}
        fill="hsl(var(--primary) / 0.15)"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
      />
      {data.map((v, i) => {
        const p = getPoint(i, v);
        return (
          <circle
            key={`dot-${i}`}
            cx={p.x}
            cy={p.y}
            r="3"
            fill="hsl(var(--primary))"
          />
        );
      })}
      {labelElements}
    </svg>
  );
}

export default function SkillsPage() {
  const [assessments, setAssessments] = useState<Record<string, number>>({});
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Skill21['category'] | null>(null);
  const [showRadar, setShowRadar] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setAssessments(JSON.parse(raw));
    } catch {}
  }, []);

  // Save to localStorage
  const saveAssessment = useCallback(
    (skillId: string, level: number) => {
      const updated = { ...assessments, [skillId]: level };
      setAssessments(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },
    [assessments]
  );

  const resetAssessments = useCallback(() => {
    setAssessments({});
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const assessedCount = Object.keys(assessments).length;
  const totalSkills = skills21.length;
  const allAssessed = assessedCount === totalSkills;

  // Radar chart data
  const radarData = useMemo(() => {
    return skills21.map((s) => assessments[s.id] || 0);
  }, [assessments]);

  const radarLabels = skills21.map((s) => s.name);

  // Skill gaps: get target careers from localStorage and compare
  const skillGaps = useMemo(() => {
    if (!allAssessed) return [];
    // Get career hypotheses to find target careers
    let targetCareers: string[] = [];
    try {
      const raw = localStorage.getItem('career_hypotheses');
      if (raw) {
        const hypotheses = JSON.parse(raw);
        targetCareers = hypotheses
          .filter((h: { status: string }) => h.status === 'exploring' || h.status === 'active')
          .map((h: { career_name: string }) => h.career_name);
      }
    } catch {}

    if (targetCareers.length === 0) return [];

    // Find skills that matter for target careers
    const gaps: { skill: Skill21; level: number; neededFor: string[] }[] = [];
    for (const skill of skills21) {
      const matchingCareers = skill.careers.filter((c) =>
        targetCareers.some((tc) => c.toLowerCase().includes(tc.toLowerCase()) || tc.toLowerCase().includes(c.toLowerCase()))
      );
      if (matchingCareers.length > 0) {
        const level = assessments[skill.id] || 0;
        if (level < 4) {
          gaps.push({ skill, level, neededFor: matchingCareers });
        }
      }
    }
    return gaps.sort((a, b) => a.level - b.level);
  }, [assessments, allAssessed]);

  const filteredSkills = activeCategory
    ? skills21.filter((s) => s.category === activeCategory)
    : skills21;

  // Group by category for display
  const groupedSkills = useMemo(() => {
    const groups: Record<string, Skill21[]> = {};
    for (const s of filteredSkills) {
      if (!groups[s.category]) groups[s.category] = [];
      groups[s.category].push(s);
    }
    return groups;
  }, [filteredSkills]);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">21st Century Skills</h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
              These 15 skills will matter more than your degree by 2030. Based on the World Economic
              Forum&apos;s Future of Jobs Report. Assess yourself, find your gaps, and start building.
            </p>
          </div>

          {/* Progress bar */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Self-Assessment Progress
              </span>
              <span className="text-xs text-muted-foreground">
                {assessedCount}/{totalSkills} skills rated
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${(assessedCount / totalSkills) * 100}%` }}
              />
            </div>
            {allAssessed && (
              <div className="flex items-center gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRadar(!showRadar)}
                  className="text-xs"
                >
                  <BarChart3 className="size-3 mr-1.5" />
                  {showRadar ? 'Hide' : 'Show'} Skills Radar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetAssessments}
                  className="text-xs text-muted-foreground"
                >
                  <RotateCcw className="size-3 mr-1.5" />
                  Reset
                </Button>
              </div>
            )}
          </div>

          {/* Radar chart */}
          {showRadar && allAssessed && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-sm font-semibold mb-4 text-center">Your Skills Radar</h2>
              <RadarChart data={radarData} labels={radarLabels} size={320} />
              <p className="text-xs text-muted-foreground text-center mt-3">
                Higher values = stronger self-assessment. Aim for balance across all categories.
              </p>
            </div>
          )}

          {/* Skill gaps */}
          {allAssessed && skillGaps.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="size-9 rounded-lg bg-coral/10 flex items-center justify-center">
                  <Target className="size-4 text-coral" />
                </div>
                <h2 className="text-lg font-semibold">Skill Gaps for Your Target Careers</h2>
              </div>
              <div className="space-y-3">
                {skillGaps.map(({ skill, level, neededFor }) => (
                  <div key={skill.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{skill.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Needed for: {neededFor.join(', ')}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground w-16 text-right">
                        Level {level}/5
                      </span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((l) => (
                          <div
                            key={l}
                            className={`w-3 h-3 rounded-sm ${
                              l <= level ? 'bg-coral' : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                !activeCategory
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              All Skills
            </button>
            {skillCategories.map((cat) => {
              const CatIcon = categoryIconMap[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeCategory === cat
                      ? 'bg-primary/10 text-primary border border-primary/30'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {CatIcon && <CatIcon className="size-3" />}
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Skills by category */}
          {(activeCategory ? [activeCategory] : skillCategories).map((category) => {
            const catSkills = groupedSkills[category];
            if (!catSkills || catSkills.length === 0) return null;
            const CatIcon = categoryIconMap[category];

            return (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  {CatIcon && (
                    <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CatIcon className="size-4 text-primary" />
                    </div>
                  )}
                  <h2 className="text-lg font-semibold">{category} Skills</h2>
                  <Badge variant="secondary" className="text-[10px]">
                    {catSkills.length}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {catSkills.map((skill) => {
                    const isExpanded = expandedSkill === skill.id;
                    const aiMeta = getAiResistanceMeta(skill.aiResistance);
                    const AiIcon = aiMeta.icon;
                    const currentLevel = assessments[skill.id];

                    return (
                      <div
                        key={skill.id}
                        className={`rounded-xl border bg-card transition-colors ${
                          isExpanded ? 'border-primary/30' : 'border-border hover:border-primary/30'
                        }`}
                      >
                        {/* Card header */}
                        <button
                          onClick={() => setExpandedSkill(isExpanded ? null : skill.id)}
                          className="w-full text-left p-4 flex items-start gap-3"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm">{skill.name}</span>
                              <Badge
                                variant="secondary"
                                className="text-[10px] bg-primary/10 text-primary border-0"
                              >
                                {category}
                              </Badge>
                              <span
                                className={`flex items-center gap-1 text-[10px] ${aiMeta.color} ${aiMeta.bg} px-2 py-0.5 rounded-full`}
                              >
                                <AiIcon className="size-3" />
                                {aiMeta.label}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                              {skill.description}
                            </p>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="size-4 text-muted-foreground shrink-0 mt-1" />
                          ) : (
                            <ChevronDown className="size-4 text-muted-foreground shrink-0 mt-1" />
                          )}
                        </button>

                        {/* Self-assessment slider */}
                        <div className="px-4 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-muted-foreground w-16 shrink-0">
                              Self-assess:
                            </span>
                            <div className="flex gap-1 flex-1">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <button
                                  key={level}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    saveAssessment(skill.id, level);
                                  }}
                                  className={`flex-1 h-7 rounded text-[10px] font-medium transition-all ${
                                    currentLevel === level
                                      ? 'bg-primary text-primary-foreground'
                                      : currentLevel && currentLevel >= level
                                      ? 'bg-primary/30 text-primary'
                                      : 'bg-muted text-muted-foreground hover:text-foreground'
                                  }`}
                                  title={
                                    level === 1
                                      ? 'Beginner'
                                      : level === 2
                                      ? 'Developing'
                                      : level === 3
                                      ? 'Competent'
                                      : level === 4
                                      ? 'Proficient'
                                      : 'Expert'
                                  }
                                >
                                  {level}
                                </button>
                              ))}
                            </div>
                            <span className="text-[10px] text-muted-foreground w-16 text-right shrink-0">
                              {currentLevel === 1
                                ? 'Beginner'
                                : currentLevel === 2
                                ? 'Developing'
                                : currentLevel === 3
                                ? 'Competent'
                                : currentLevel === 4
                                ? 'Proficient'
                                : currentLevel === 5
                                ? 'Expert'
                                : ''}
                            </span>
                          </div>
                        </div>

                        {/* Expanded content */}
                        {isExpanded && (
                          <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
                            {/* Why it matters */}
                            <div>
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <Lightbulb className="size-3.5 text-coral" />
                                <h4 className="text-xs font-semibold text-coral">
                                  Why It Matters
                                </h4>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {skill.whyItMatters}
                              </p>
                            </div>

                            {/* Activities */}
                            <div>
                              <h4 className="text-xs font-semibold text-foreground mb-2">
                                How to Build This Skill
                              </h4>
                              <ul className="space-y-1.5">
                                {skill.activities.map((activity, i) => (
                                  <li
                                    key={i}
                                    className="text-xs text-muted-foreground flex items-start gap-2 leading-relaxed"
                                  >
                                    <span className="text-primary mt-0.5 shrink-0">
                                      {i + 1}.
                                    </span>
                                    {activity}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Careers */}
                            <div>
                              <h4 className="text-xs font-semibold text-foreground mb-2">
                                Critical For These Careers
                              </h4>
                              <div className="flex flex-wrap gap-1.5">
                                {skill.careers.map((career) => (
                                  <Badge
                                    key={career}
                                    variant="secondary"
                                    className="text-[10px]"
                                  >
                                    {career}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
