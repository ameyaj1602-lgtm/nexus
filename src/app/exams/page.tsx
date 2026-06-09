'use client';

import { useState, useMemo } from 'react';
import { exams, type Exam } from '@/lib/exams-data';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import Sidebar from '@/components/shared/sidebar';
import {
  Search,
  FileText,
  Calendar,
  ExternalLink,
  Lightbulb,
  Users,
  CheckCircle2,
} from 'lucide-react';

const difficultyColors: Record<string, string> = {
  High: 'bg-destructive/10 text-destructive',
  Medium: 'bg-coral/10 text-coral',
  Low: 'bg-success/10 text-success',
};

export default function ExamsPage() {
  const [search, setSearch] = useState('');
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const filtered = useMemo(() => {
    let result = [...exams];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.fullName.toLowerCase().includes(q) ||
          e.streams.some((s) => s.toLowerCase().includes(q)) ||
          e.acceptedBy.toLowerCase().includes(q)
      );
    }

    if (selectedStream) {
      result = result.filter((e) => e.streams.includes(selectedStream));
    }

    if (selectedDifficulty) {
      result = result.filter((e) => e.difficulty === selectedDifficulty);
    }

    return result;
  }, [search, selectedStream, selectedDifficulty]);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 pb-24 md:pb-8 overflow-y-auto max-w-5xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Exam Explorer
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {filtered.length} of {exams.length} entrance exams
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search exams by name, stream, or accepted colleges..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground h-11"
            />
          </div>

          {/* Filters */}
          <div className="space-y-3">
            <div>
              <div className="text-xs text-muted-foreground mb-2 font-medium">Stream</div>
              <div className="flex flex-wrap gap-2">
                {['Engineering', 'Medical', 'Law', 'Design', 'Management', 'Science', 'Arts', 'Commerce'].map((stream) => (
                  <button
                    key={stream}
                    onClick={() => setSelectedStream(selectedStream === stream ? null : stream)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedStream === stream
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:border-primary/30 hover:text-foreground'
                    }`}
                  >
                    {stream}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-2 font-medium">Difficulty</div>
              <div className="flex gap-2">
                {['High', 'Medium', 'Low'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDifficulty(selectedDifficulty === d ? null : d)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedDifficulty === d
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:border-primary/30 hover:text-foreground'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Exam cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((exam) => (
              <button
                key={exam.id}
                onClick={() => setSelectedExam(exam)}
                className="text-left rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors group"
              >
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {exam.name}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${difficultyColors[exam.difficulty]}`}>
                    {exam.difficulty}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{exam.fullName}</p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {exam.streams.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {exam.examMonth}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground truncate max-w-[60%] text-right">
                    <Users className="size-3 shrink-0" />
                    <span className="truncate">{exam.acceptedBy}</span>
                  </span>
                </div>
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <FileText className="size-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-semibold">No exams found</p>
              <p className="text-sm mt-1">Try adjusting your filters or search term</p>
            </div>
          )}
        </div>
      </main>

      {/* Exam detail dialog */}
      <Dialog open={!!selectedExam} onOpenChange={(open) => !open && setSelectedExam(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          {selectedExam && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg">{selectedExam.name}</DialogTitle>
                <DialogDescription>{selectedExam.fullName}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Difficulty & Month */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${difficultyColors[selectedExam.difficulty]}`}>
                    {selectedExam.difficulty} Difficulty
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground flex items-center gap-1">
                    <Calendar className="size-3" />
                    {selectedExam.examMonth}
                  </span>
                </div>

                {/* Streams */}
                <div>
                  <div className="text-xs text-muted-foreground font-medium mb-1.5">Streams</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedExam.streams.map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>

                {/* Eligibility */}
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-xs text-muted-foreground font-medium mb-1 flex items-center gap-1">
                    <CheckCircle2 className="size-3" /> Eligibility
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">{selectedExam.eligibility}</p>
                </div>

                {/* Accepted By */}
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-xs text-muted-foreground font-medium mb-1 flex items-center gap-1">
                    <Users className="size-3" /> Accepted By
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">{selectedExam.acceptedBy}</p>
                </div>

                {/* Tips */}
                <div className="bg-primary/10 rounded-lg p-3 border border-primary/30">
                  <div className="text-xs text-primary font-medium mb-1 flex items-center gap-1">
                    <Lightbulb className="size-3" /> Preparation Tips
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">{selectedExam.tips}</p>
                </div>

                {/* Registration Link */}
                {selectedExam.registrationUrl && (
                  <a
                    href={selectedExam.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <ExternalLink className="size-4" />
                    Register / Official Website
                  </a>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
