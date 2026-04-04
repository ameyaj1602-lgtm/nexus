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
  High: 'bg-red-500/20 text-red-400',
  Medium: 'bg-yellow-500/20 text-yellow-400',
  Low: 'bg-emerald-500/20 text-emerald-400',
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
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <FileText className="size-6 text-indigo-400" />
              Exam Finder
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              {filtered.length} of {exams.length} entrance exams
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
            <Input
              placeholder="Search exams by name, stream, or accepted colleges..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 h-11"
            />
          </div>

          {/* Filters */}
          <div className="space-y-3">
            <div>
              <div className="text-xs text-zinc-500 mb-2 font-medium">Stream</div>
              <div className="flex flex-wrap gap-2">
                {['Engineering', 'Medical', 'Law', 'Design', 'Management', 'Science', 'Arts', 'Commerce'].map((stream) => (
                  <button
                    key={stream}
                    onClick={() => setSelectedStream(selectedStream === stream ? null : stream)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedStream === stream
                        ? 'bg-indigo-600 text-white'
                        : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    {stream}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs text-zinc-500 mb-2 font-medium">Difficulty</div>
              <div className="flex gap-2">
                {['High', 'Medium', 'Low'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDifficulty(selectedDifficulty === d ? null : d)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedDifficulty === d
                        ? 'bg-indigo-600 text-white'
                        : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
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
                className="text-left bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4 hover:border-indigo-500/30 hover:bg-zinc-900 transition-all group"
              >
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-sm font-bold text-zinc-100 group-hover:text-indigo-400 transition-colors">
                    {exam.name}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${difficultyColors[exam.difficulty]}`}>
                    {exam.difficulty}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mb-3">{exam.fullName}</p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {exam.streams.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-800 text-zinc-400">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {exam.examMonth}
                  </span>
                  <span className="flex items-center gap-1 text-zinc-400 truncate max-w-[60%] text-right">
                    <Users className="size-3 shrink-0" />
                    <span className="truncate">{exam.acceptedBy}</span>
                  </span>
                </div>
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-zinc-600">
              <FileText className="size-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No exams found</p>
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
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 flex items-center gap-1">
                    <Calendar className="size-3" />
                    {selectedExam.examMonth}
                  </span>
                </div>

                {/* Streams */}
                <div>
                  <div className="text-xs text-zinc-500 font-medium mb-1.5">Streams</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedExam.streams.map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>

                {/* Eligibility */}
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <div className="text-xs text-zinc-500 font-medium mb-1 flex items-center gap-1">
                    <CheckCircle2 className="size-3" /> Eligibility
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">{selectedExam.eligibility}</p>
                </div>

                {/* Accepted By */}
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <div className="text-xs text-zinc-500 font-medium mb-1 flex items-center gap-1">
                    <Users className="size-3" /> Accepted By
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">{selectedExam.acceptedBy}</p>
                </div>

                {/* Tips */}
                <div className="bg-indigo-500/10 rounded-lg p-3 border border-indigo-500/20">
                  <div className="text-xs text-indigo-400 font-medium mb-1 flex items-center gap-1">
                    <Lightbulb className="size-3" /> Preparation Tips
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">{selectedExam.tips}</p>
                </div>

                {/* Registration Link */}
                {selectedExam.registrationUrl && (
                  <a
                    href={selectedExam.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
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
