'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/shared/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Plus,
  Trash2,
  Download,
  Eye,
  Edit3,
  GraduationCap,
  X,
} from 'lucide-react';

interface ResumeData {
  name: string;
  classGrade: string;
  school: string;
  city: string;
  email: string;
  phone: string;
  objective: string;
  skills: string[];
  projects: { title: string; description: string }[];
  achievements: string[];
  interests: string[];
}

const defaultResume: ResumeData = {
  name: '',
  classGrade: '',
  school: '',
  city: '',
  email: '',
  phone: '',
  objective: '',
  skills: [],
  projects: [{ title: '', description: '' }],
  achievements: [''],
  interests: [],
};

export default function ResumePage() {
  const [resume, setResume] = useState<ResumeData>(defaultResume);
  const [showPreview, setShowPreview] = useState(false);
  const [customSkill, setCustomSkill] = useState('');
  const [customInterest, setCustomInterest] = useState('');
  const printRef = useRef<HTMLDivElement>(null);

  // Load identity and career interests for auto-suggestions
  useEffect(() => {
    try {
      const identity = JSON.parse(localStorage.getItem('nexus_identity') || '{}');
      const hypotheses = JSON.parse(localStorage.getItem('nexus_hypotheses') || '[]');

      // Auto-generate skills from identity dimensions
      const suggestedSkills: string[] = [];
      if (identity.creative > 60) suggestedSkills.push('Creative Thinking', 'Design');
      if (identity.analytical > 60) suggestedSkills.push('Analytical Thinking', 'Problem Solving');
      if (identity.social > 60) suggestedSkills.push('Communication', 'Teamwork');
      if (identity.practical > 60) suggestedSkills.push('Hands-on Skills', 'Project Management');
      if (identity.entrepreneurial > 60) suggestedSkills.push('Leadership', 'Initiative');
      if (identity.caring > 60) suggestedSkills.push('Empathy', 'Active Listening');

      // Auto-generate objective from hypotheses
      const careerNames = hypotheses.map((h: { career: string }) => h.career).slice(0, 3);
      const autoObjective = careerNames.length > 0
        ? `A motivated student with a strong interest in ${careerNames.join(', ')}. Eager to learn, build skills, and explore opportunities in these fields through projects, internships, and real-world experiences.`
        : '';

      setResume((prev) => ({
        ...prev,
        skills: suggestedSkills.length > 0 ? suggestedSkills : prev.skills,
        objective: autoObjective || prev.objective,
      }));
    } catch {
      // ignore
    }
  }, []);

  function updateField(field: keyof ResumeData, value: string) {
    setResume((prev) => ({ ...prev, [field]: value }));
  }

  function addSkill() {
    if (customSkill.trim() && !resume.skills.includes(customSkill.trim())) {
      setResume((prev) => ({ ...prev, skills: [...prev.skills, customSkill.trim()] }));
      setCustomSkill('');
    }
  }

  function removeSkill(skill: string) {
    setResume((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  }

  function addInterest() {
    if (customInterest.trim() && !resume.interests.includes(customInterest.trim())) {
      setResume((prev) => ({ ...prev, interests: [...prev.interests, customInterest.trim()] }));
      setCustomInterest('');
    }
  }

  function removeInterest(interest: string) {
    setResume((prev) => ({ ...prev, interests: prev.interests.filter((i) => i !== interest) }));
  }

  function addProject() {
    setResume((prev) => ({
      ...prev,
      projects: [...prev.projects, { title: '', description: '' }],
    }));
  }

  function updateProject(index: number, field: 'title' | 'description', value: string) {
    setResume((prev) => {
      const projects = [...prev.projects];
      projects[index] = { ...projects[index], [field]: value };
      return { ...prev, projects };
    });
  }

  function removeProject(index: number) {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  }

  function addAchievement() {
    setResume((prev) => ({ ...prev, achievements: [...prev.achievements, ''] }));
  }

  function updateAchievement(index: number, value: string) {
    setResume((prev) => {
      const achievements = [...prev.achievements];
      achievements[index] = value;
      return { ...prev, achievements };
    });
  }

  function removeAchievement(index: number) {
    setResume((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 max-w-5xl pb-24 md:pb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Resume Builder</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Build a clean, professional resume. Skills and objective auto-populate from your profile.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
              {showPreview ? <Edit3 className="size-4 mr-1" /> : <Eye className="size-4 mr-1" />}
              {showPreview ? 'Edit' : 'Preview'}
            </Button>
            <Button size="sm" onClick={handlePrint} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Download className="size-4 mr-1" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Side */}
          <div className={`space-y-6 ${showPreview ? 'hidden lg:block' : ''}`}>
            {/* Personal Info */}
            <section className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
              <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Full Name</Label>
                  <Input value={resume.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Arjun Mehta" className="mt-1 h-9 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Class / Grade</Label>
                  <Input value={resume.classGrade} onChange={(e) => updateField('classGrade', e.target.value)} placeholder="Class 10, CBSE" className="mt-1 h-9 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">School</Label>
                  <Input value={resume.school} onChange={(e) => updateField('school', e.target.value)} placeholder="Delhi Public School" className="mt-1 h-9 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">City</Label>
                  <Input value={resume.city} onChange={(e) => updateField('city', e.target.value)} placeholder="New Delhi" className="mt-1 h-9 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <Input value={resume.email} onChange={(e) => updateField('email', e.target.value)} placeholder="arjun@email.com" className="mt-1 h-9 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Phone (optional)</Label>
                  <Input value={resume.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="+91 98765 43210" className="mt-1 h-9 text-sm" />
                </div>
              </div>
            </section>

            {/* Objective */}
            <section className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
              <h2 className="text-lg font-semibold mb-2">Objective</h2>
              <p className="text-xs text-muted-foreground mb-2">Auto-generated from your career interests. Feel free to edit.</p>
              <Textarea
                value={resume.objective}
                onChange={(e) => updateField('objective', e.target.value)}
                placeholder="A motivated student interested in..."
                rows={3}
                className="text-sm"
              />
            </section>

            {/* Skills */}
            <section className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
              <h2 className="text-lg font-semibold mb-2">Skills</h2>
              <p className="text-xs text-muted-foreground mb-3">Pulled from your identity dimensions. Add more below.</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {resume.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary text-xs pr-1">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="ml-1.5 hover:text-destructive">
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                  placeholder="Add a skill..."
                  className="h-8 text-sm flex-1"
                />
                <Button size="sm" variant="outline" onClick={addSkill} className="h-8">
                  <Plus className="size-3.5" />
                </Button>
              </div>
            </section>

            {/* Projects */}
            <section className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Projects & Activities</h2>
                <Button size="sm" variant="ghost" onClick={addProject} className="h-7 text-xs">
                  <Plus className="size-3 mr-1" /> Add
                </Button>
              </div>
              <div className="space-y-3">
                {resume.projects.map((project, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={project.title}
                        onChange={(e) => updateProject(i, 'title', e.target.value)}
                        placeholder="Project title"
                        className="h-8 text-sm"
                      />
                      <Textarea
                        value={project.description}
                        onChange={(e) => updateProject(i, 'description', e.target.value)}
                        placeholder="Brief description..."
                        rows={2}
                        className="text-sm"
                      />
                    </div>
                    {resume.projects.length > 1 && (
                      <button onClick={() => removeProject(i)} className="text-muted-foreground hover:text-destructive mt-1">
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Achievements */}
            <section className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Achievements</h2>
                <Button size="sm" variant="ghost" onClick={addAchievement} className="h-7 text-xs">
                  <Plus className="size-3 mr-1" /> Add
                </Button>
              </div>
              <div className="space-y-2">
                {resume.achievements.map((ach, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={ach}
                      onChange={(e) => updateAchievement(i, e.target.value)}
                      placeholder="e.g., School Science Fair Winner 2025"
                      className="h-8 text-sm flex-1"
                    />
                    {resume.achievements.length > 1 && (
                      <button onClick={() => removeAchievement(i)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Interests */}
            <section className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
              <h2 className="text-lg font-semibold mb-3">Interests</h2>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {resume.interests.map((interest) => (
                  <Badge key={interest} variant="outline" className="text-xs pr-1">
                    {interest}
                    <button onClick={() => removeInterest(interest)} className="ml-1.5 hover:text-destructive">
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addInterest()}
                  placeholder="Add an interest..."
                  className="h-8 text-sm flex-1"
                />
                <Button size="sm" variant="outline" onClick={addInterest} className="h-8">
                  <Plus className="size-3.5" />
                </Button>
              </div>
            </section>

            {/* Mobile buttons */}
            <div className="flex gap-2 lg:hidden">
              <Button variant="outline" className="flex-1" onClick={() => setShowPreview(true)}>
                <Eye className="size-4 mr-1" /> Preview
              </Button>
              <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handlePrint}>
                <Download className="size-4 mr-1" /> Download
              </Button>
            </div>
          </div>

          {/* Preview Side */}
          <div className={`${!showPreview ? 'hidden lg:block' : ''}`}>
            <div className="sticky top-8">
              <div className="mb-3 flex items-center justify-between lg:hidden">
                <h2 className="text-lg font-semibold">Preview</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                  <Edit3 className="size-4 mr-1" /> Back to Edit
                </Button>
              </div>
              {/* Resume Preview */}
              <div
                ref={printRef}
                id="resume-preview"
                className="bg-white text-gray-900 rounded-xl shadow-lg p-8 text-sm print:shadow-none print:rounded-none print:p-6"
              >
                {/* Header */}
                <div className="border-b-2 border-gray-800 pb-4 mb-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {resume.name || 'Your Name'}
                  </h1>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                    {resume.classGrade && <span>{resume.classGrade}</span>}
                    {resume.school && <span>{resume.school}</span>}
                    {resume.city && <span>{resume.city}</span>}
                    {resume.email && <span>{resume.email}</span>}
                    {resume.phone && <span>{resume.phone}</span>}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <GraduationCap className="size-3 text-gray-600" />
                    <span className="text-[10px] text-gray-600 font-medium tracking-wide">BUILT WITH NEXUS</span>
                  </div>
                </div>

                {/* Objective */}
                {resume.objective && (
                  <section className="mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-1">Objective</h2>
                    <p className="text-xs text-gray-700 leading-relaxed">{resume.objective}</p>
                  </section>
                )}

                {/* Skills */}
                {resume.skills.length > 0 && (
                  <section className="mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-1">Skills</h2>
                    <div className="flex flex-wrap gap-1">
                      {resume.skills.map((skill) => (
                        <span key={skill} className="inline-block bg-gray-100 text-gray-700 text-[10px] px-2 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {/* Projects */}
                {resume.projects.some((p) => p.title) && (
                  <section className="mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-1">Projects & Activities</h2>
                    <div className="space-y-2">
                      {resume.projects.filter((p) => p.title).map((project, i) => (
                        <div key={i}>
                          <p className="text-xs font-semibold text-gray-800">{project.title}</p>
                          {project.description && (
                            <p className="text-[11px] text-gray-600">{project.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Achievements */}
                {resume.achievements.some((a) => a) && (
                  <section className="mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-1">Achievements</h2>
                    <ul className="list-disc list-inside space-y-0.5">
                      {resume.achievements.filter(Boolean).map((ach, i) => (
                        <li key={i} className="text-xs text-gray-700">{ach}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Interests */}
                {resume.interests.length > 0 && (
                  <section>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-1">Interests</h2>
                    <p className="text-xs text-gray-700">{resume.interests.join(' | ')}</p>
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body > *:not(#resume-preview) { display: none !important; }
          #resume-preview {
            position: fixed;
            top: 0; left: 0; right: 0;
            background: white !important;
            display: block !important;
          }
          aside, nav, header, .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}
