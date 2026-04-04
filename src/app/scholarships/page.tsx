'use client';

import { useState, useMemo } from 'react';
import { scholarships, type Scholarship } from '@/lib/scholarships-data';
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
  Award,
  ExternalLink,
  Calendar,
  CheckCircle2,
  Building2,
  Sparkles,
} from 'lucide-react';

const meritNeedColors: Record<string, string> = {
  Merit: 'bg-blue-500/20 text-blue-400',
  Need: 'bg-amber-500/20 text-amber-400',
  Both: 'bg-emerald-500/20 text-emerald-400',
};

export default function ScholarshipsPage() {
  const [search, setSearch] = useState('');
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

  const filtered = useMemo(() => {
    let result = [...scholarships];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.provider.toLowerCase().includes(q) ||
          s.eligibility.toLowerCase().includes(q) ||
          s.streams.some((st) => st.toLowerCase().includes(q))
      );
    }

    if (selectedStream) {
      result = result.filter((s) => s.streams.includes(selectedStream));
    }

    if (selectedType) {
      result = result.filter((s) => s.meritOrNeed === selectedType);
    }

    return result;
  }, [search, selectedStream, selectedType]);

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Award className="size-6 text-indigo-400" />
              Scholarship Finder
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              {filtered.length} of {scholarships.length} scholarships
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
            <Input
              placeholder="Search by scholarship name, provider, or eligibility..."
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
                {['Engineering', 'Medical', 'Science', 'Arts', 'Commerce', 'Management', 'Law'].map((stream) => (
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
              <div className="text-xs text-zinc-500 mb-2 font-medium">Type</div>
              <div className="flex gap-2">
                {['Merit', 'Need', 'Both'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(selectedType === t ? null : t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedType === t
                        ? 'bg-indigo-600 text-white'
                        : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    {t === 'Both' ? 'Merit + Need' : `${t}-based`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Scholarship cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((scholarship) => (
              <button
                key={scholarship.id}
                onClick={() => setSelectedScholarship(scholarship)}
                className="text-left bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4 hover:border-indigo-500/30 hover:bg-zinc-900 transition-all group"
              >
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-sm font-bold text-zinc-100 group-hover:text-indigo-400 transition-colors leading-tight pr-2">
                    {scholarship.name}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${meritNeedColors[scholarship.meritOrNeed]}`}>
                    {scholarship.meritOrNeed}
                  </span>
                </div>

                <p className="text-xs text-zinc-500 mb-3 flex items-center gap-1">
                  <Building2 className="size-3 shrink-0" />
                  <span className="truncate">{scholarship.provider}</span>
                </p>

                <div className="bg-zinc-800/50 rounded-lg px-3 py-2 mb-3">
                  <div className="text-xs text-zinc-500 mb-0.5">Amount</div>
                  <div className="text-xs font-semibold text-emerald-400">{scholarship.amount}</div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {scholarship.streams.slice(0, 4).map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-800 text-zinc-400">
                      {s}
                    </span>
                  ))}
                  {scholarship.streams.length > 4 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-800 text-zinc-400">
                      +{scholarship.streams.length - 4}
                    </span>
                  )}
                </div>

                {scholarship.deadline && (
                  <div className="flex items-center gap-1 text-xs text-zinc-500">
                    <Calendar className="size-3" />
                    Deadline: {scholarship.deadline}
                  </div>
                )}
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-zinc-600">
              <Award className="size-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No scholarships found</p>
              <p className="text-sm mt-1">Try adjusting your filters or search term</p>
            </div>
          )}
        </div>
      </main>

      {/* Scholarship detail dialog */}
      <Dialog open={!!selectedScholarship} onOpenChange={(open) => !open && setSelectedScholarship(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          {selectedScholarship && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg">{selectedScholarship.name}</DialogTitle>
                <DialogDescription className="flex items-center gap-1">
                  <Building2 className="size-3" />
                  {selectedScholarship.provider}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Type Badge */}
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${meritNeedColors[selectedScholarship.meritOrNeed]}`}>
                    {selectedScholarship.meritOrNeed === 'Both' ? 'Merit + Need Based' : `${selectedScholarship.meritOrNeed}-based`}
                  </span>
                  {selectedScholarship.deadline && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 flex items-center gap-1">
                      <Calendar className="size-3" />
                      {selectedScholarship.deadline}
                    </span>
                  )}
                </div>

                {/* Amount */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                  <div className="text-xs text-emerald-400 font-medium mb-1 flex items-center gap-1">
                    <Sparkles className="size-3" /> Scholarship Amount
                  </div>
                  <p className="text-sm text-zinc-200 font-semibold">{selectedScholarship.amount}</p>
                </div>

                {/* Eligibility */}
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <div className="text-xs text-zinc-500 font-medium mb-1 flex items-center gap-1">
                    <CheckCircle2 className="size-3" /> Eligibility
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">{selectedScholarship.eligibility}</p>
                </div>

                {/* Streams */}
                <div>
                  <div className="text-xs text-zinc-500 font-medium mb-1.5">Applicable Streams</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedScholarship.streams.map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>

                {/* Apply Link */}
                {selectedScholarship.link && (
                  <a
                    href={selectedScholarship.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <ExternalLink className="size-4" />
                    Apply / Learn More
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
