'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
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
} from 'lucide-react';

const STORAGE_KEY = 'nexus_skills_assessment';

function getAiResistanceMeta(level: Skill21['aiResistance']) {
  switch (level) {
    case 'High':
      return { icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10', label: 'AI-Resistant' };
    case 'Medium':
      return { icon: Shield, color: 'text-yellow-400', bg: 'bg-yellow-400/10', label: 'AI-Augmented' };
    case 'Low':
      return { icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-400/10', label: 'AI-Replaceable' };
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
        stroke="rgba(255,255,255,0.08)"
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
        stroke="rgba(255,255,255,0.06)"
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
        className="fill-zinc-500 text-[9px]"
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
        fill="rgba(99, 102, 241, 0.15)"
        stroke="rgb(99, 102, 241)"
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
            fill="rgb(99, 102, 241)"
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
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">21st Century Skills</h1>
            <p className="text-sm text-zinc-500 mt-1 max-w-2xl">
              These 15 skills will matter more than your degree by 2030. Based on the World Economic
              Forum&apos;s Future of Jobs Report. Assess yourself, find your gaps, and start building.
            </p>
          </div>

          {/* Progress bar */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Self-Assessment Progress
              </span>
              <span className="text-xs text-zinc-500">
                {assessedCount}/{totalSkills} skills rated
              </span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${(assessedCount / totalSkills) * 100}%` }}
              />
            </div>
            {allAssessed && (
              <div className="flex items-center gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRadar(!showRadar)}
                  className="text-xs border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  <BarChart3 className="size-3 mr-1.5" />
                  {showRadar ? 'Hide' : 'Show'} Skills Radar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetAssessments}
                  className="text-xs text-zinc-500 hover:text-zinc-300"
                >
                  <RotateCcw className="size-3 mr-1.5" />
                  Reset
                </Button>
              </div>
            )}
          </div>

          {/* Radar chart */}
          {showRadar && allAssessed && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-sm font-semibold mb-4 text-center">Your Skills Radar</h2>
              <RadarChart data={radarData} labels={radarLabels} size={320} />
              <p className="text-xs text-zinc-500 text-center mt-3">
                Higher values = stronger self-assessment. Aim for balance across all categories.
              </p>
            </div>
          )}

          {/* Skill gaps */}
          {allAssessed && skillGaps.length > 0 && (
            <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Target className="size-4 text-amber-400" />
                <h2 className="text-sm font-semibold">Skill Gaps for Your Target Careers</h2>
              </div>
              <div className="space-y-3">
                {skillGaps.map(({ skill, level, neededFor }) => (
                  <div key={skill.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{skill.name}</div>
                      <div className="text-xs text-zinc-500">
                        Needed for: {neededFor.join(', ')}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-zinc-500 w-16 text-right">
                        Level {level}/5
                      </span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((l) => (
                          <div
                            key={l}
                            className={`w-3 h-3 rounded-sm ${
                              l <= level ? 'bg-amber-400' : 'bg-zinc-700'
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
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
              }`}
            >
              All Skills
            </button>
            {skillCategories.map((cat) => {
              const meta = categoryMeta[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeCategory === cat
                      ? `${meta.bg} ${meta.color} border ${meta.border}`
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <span>{meta.icon}</span>
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Skills by category */}
          {(activeCategory ? [activeCategory] : skillCategories).map((category) => {
            const catSkills = groupedSkills[category];
            if (!catSkills || catSkills.length === 0) return null;
            const meta = categoryMeta[category];

            return (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{meta.icon}</span>
                  <h2 className={`text-sm font-semibold ${meta.color}`}>{category} Skills</h2>
                  <Badge variant="secondary" className="text-[10px] bg-zinc-800 text-zinc-500">
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
                        className={`bg-zinc-900/80 border rounded-xl transition-all ${
                          isExpanded ? `${meta.border} border-opacity-50` : 'border-zinc-800'
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
                                className={`text-[10px] ${meta.bg} ${meta.color} border-0`}
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
                            <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                              {skill.description}
                            </p>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="size-4 text-zinc-500 shrink-0 mt-1" />
                          ) : (
                            <ChevronDown className="size-4 text-zinc-500 shrink-0 mt-1" />
                          )}
                        </button>

                        {/* Self-assessment slider */}
                        <div className="px-4 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-zinc-500 w-16 shrink-0">
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
                                      ? 'bg-indigo-600 text-white'
                                      : currentLevel && currentLevel >= level
                                      ? 'bg-indigo-600/30 text-indigo-300'
                                      : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
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
                            <span className="text-[10px] text-zinc-600 w-16 text-right shrink-0">
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
                          <div className="px-4 pb-4 space-y-4 border-t border-zinc-800 pt-4">
                            {/* Why it matters */}
                            <div>
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <Lightbulb className="size-3.5 text-amber-400" />
                                <h4 className="text-xs font-semibold text-amber-400">
                                  Why It Matters
                                </h4>
                              </div>
                              <p className="text-xs text-zinc-400 leading-relaxed">
                                {skill.whyItMatters}
                              </p>
                            </div>

                            {/* Activities */}
                            <div>
                              <h4 className="text-xs font-semibold text-zinc-300 mb-2">
                                How to Build This Skill
                              </h4>
                              <ul className="space-y-1.5">
                                {skill.activities.map((activity, i) => (
                                  <li
                                    key={i}
                                    className="text-xs text-zinc-400 flex items-start gap-2"
                                  >
                                    <span className="text-indigo-400 mt-0.5 shrink-0">
                                      {i + 1}.
                                    </span>
                                    {activity}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Careers */}
                            <div>
                              <h4 className="text-xs font-semibold text-zinc-300 mb-2">
                                Critical For These Careers
                              </h4>
                              <div className="flex flex-wrap gap-1.5">
                                {skill.careers.map((career) => (
                                  <Badge
                                    key={career}
                                    variant="secondary"
                                    className="text-[10px] bg-zinc-800 text-zinc-400"
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
