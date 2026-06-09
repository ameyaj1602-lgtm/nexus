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
  IndianRupee,
} from 'lucide-react';

const meritNeedColors: Record<string, string> = {
  Merit: 'bg-primary/10 text-primary',
  Need: 'bg-coral/10 text-coral',
  Both: 'bg-success/10 text-success',
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
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 max-w-5xl pb-24 md:pb-8 overflow-y-auto">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Scholarship Finder
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {filtered.length} of {scholarships.length} scholarships
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by scholarship name, provider, or eligibility..."
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
                {['Engineering', 'Medical', 'Science', 'Arts', 'Commerce', 'Management', 'Law'].map((stream) => (
                  <button
                    key={stream}
                    onClick={() => setSelectedStream(selectedStream === stream ? null : stream)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedStream === stream
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-muted-foreground border border-border hover:border-primary/30 hover:text-foreground'
                    }`}
                  >
                    {stream}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-2 font-medium">Type</div>
              <div className="flex gap-2">
                {['Merit', 'Need', 'Both'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(selectedType === t ? null : t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedType === t
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-muted-foreground border border-border hover:border-primary/30 hover:text-foreground'
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
                className="text-left rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors group"
              >
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight pr-2">
                    {scholarship.name}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${meritNeedColors[scholarship.meritOrNeed]}`}>
                    {scholarship.meritOrNeed}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                  <Building2 className="size-3 shrink-0" />
                  <span className="truncate">{scholarship.provider}</span>
                </p>

                <div className="bg-muted rounded-lg px-3 py-2 mb-3">
                  <div className="text-xs text-muted-foreground mb-0.5">Amount</div>
                  <div className="text-xs font-semibold text-success">{scholarship.amount}</div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {scholarship.streams.slice(0, 4).map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
                      {s}
                    </span>
                  ))}
                  {scholarship.streams.length > 4 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
                      +{scholarship.streams.length - 4}
                    </span>
                  )}
                </div>

                {scholarship.deadline && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="size-3" />
                    Deadline: {scholarship.deadline}
                  </div>
                )}
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
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
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground flex items-center gap-1">
                      <Calendar className="size-3" />
                      {selectedScholarship.deadline}
                    </span>
                  )}
                </div>

                {/* Amount */}
                <div className="bg-success/10 border border-border rounded-lg p-3">
                  <div className="text-xs text-success font-medium mb-1 flex items-center gap-1">
                    <IndianRupee className="size-3" /> Scholarship Amount
                  </div>
                  <p className="text-sm text-foreground font-semibold">{selectedScholarship.amount}</p>
                </div>

                {/* Eligibility */}
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-xs text-muted-foreground font-medium mb-1 flex items-center gap-1">
                    <CheckCircle2 className="size-3" /> Eligibility
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">{selectedScholarship.eligibility}</p>
                </div>

                {/* Streams */}
                <div>
                  <div className="text-xs text-muted-foreground font-medium mb-1.5">Applicable Streams</div>
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
                    className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
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
