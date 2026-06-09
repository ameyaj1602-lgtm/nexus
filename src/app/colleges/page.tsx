'use client';

import { useState, useMemo } from 'react';
import { colleges, collegeTypes, indianStates, type College } from '@/lib/colleges-data';
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
  GraduationCap,
  MapPin,
  IndianRupee,
  Trophy,
  ExternalLink,
  ChevronDown,
  X,
  Briefcase,
  BookOpen,
  CircleDot,
} from 'lucide-react';

function formatAmount(val: number): string {
  if (val >= 10000000) return `${(val / 10000000).toFixed(1)}Cr`;
  if (val >= 100000) return `${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
  return val.toString();
}

const feeRanges = [
  { label: 'All', min: 0, max: Infinity },
  { label: 'Under 50K', min: 0, max: 50000 },
  { label: '50K - 2L', min: 50000, max: 200000 },
  { label: '2L - 5L', min: 200000, max: 500000 },
  { label: '5L+', min: 500000, max: Infinity },
];

export default function CollegesPage() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedFeeRange, setSelectedFeeRange] = useState(0);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...colleges];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.state.toLowerCase().includes(q) ||
          c.streams.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (selectedType) {
      result = result.filter((c) => c.type === selectedType);
    }

    if (selectedStream) {
      result = result.filter((c) => c.streams.includes(selectedStream));
    }

    if (selectedState) {
      result = result.filter((c) => c.state === selectedState);
    }

    const fee = feeRanges[selectedFeeRange];
    if (fee.max !== Infinity || fee.min !== 0) {
      result = result.filter(
        (c) => c.avgFees.min >= fee.min && c.avgFees.max <= fee.max
      );
    }

    result.sort((a, b) => (a.ranking ?? 999) - (b.ranking ?? 999));

    return result;
  }, [search, selectedType, selectedStream, selectedState, selectedFeeRange]);

  const activeFilterCount = [selectedType, selectedStream, selectedState, selectedFeeRange > 0].filter(Boolean).length;

  function clearFilters() {
    setSelectedType(null);
    setSelectedStream(null);
    setSelectedState(null);
    setSelectedFeeRange(0);
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 pb-24 md:pb-8 overflow-y-auto max-w-5xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              College Explorer
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {filtered.length} of {colleges.length} colleges
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by college name, city, state, or stream..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground h-11"
            />
          </div>

          {/* Filter toggle for mobile */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground md:hidden"
          >
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            <ChevronDown className={`size-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Filters */}
          <div className={`space-y-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
            {/* Type filter */}
            <div>
              <div className="text-xs text-muted-foreground mb-2 font-medium">College Type</div>
              <div className="flex flex-wrap gap-2">
                {collegeTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(selectedType === type ? null : type)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedType === type
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Stream filter */}
            <div>
              <div className="text-xs text-muted-foreground mb-2 font-medium">Stream</div>
              <div className="flex flex-wrap gap-2">
                {['Engineering', 'Medical', 'Science', 'Commerce', 'Arts', 'Management', 'Design', 'Law'].map((stream) => (
                  <button
                    key={stream}
                    onClick={() => setSelectedStream(selectedStream === stream ? null : stream)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedStream === stream
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {stream}
                  </button>
                ))}
              </div>
            </div>

            {/* State & Fee range row */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="text-xs text-muted-foreground mb-2 font-medium">State</div>
                <select
                  value={selectedState ?? ''}
                  onChange={(e) => setSelectedState(e.target.value || null)}
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                >
                  <option value="">All States</option>
                  {indianStates.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <div className="text-xs text-muted-foreground mb-2 font-medium">Fee Range (Annual)</div>
                <select
                  value={selectedFeeRange}
                  onChange={(e) => setSelectedFeeRange(Number(e.target.value))}
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                >
                  {feeRanges.map((r, i) => (
                    <option key={i} value={i}>{r.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
                <X className="size-3" /> Clear all filters
              </button>
            )}
          </div>

          {/* College grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((college) => (
              <button
                key={college.id}
                onClick={() => setSelectedCollege(college)}
                className="text-left rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight pr-2">
                    {college.name}
                  </h3>
                  {college.ranking && (
                    <span className="flex items-center gap-1 text-xs text-coral shrink-0">
                      <Trophy className="size-3" />
                      #{college.ranking}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                  <MapPin className="size-3" />
                  {college.city}, {college.state}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary">
                    {college.type}
                  </span>
                  {college.streams.slice(0, 3).map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
                      {s}
                    </span>
                  ))}
                  {college.streams.length > 3 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
                      +{college.streams.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <IndianRupee className="size-3" />
                    {formatAmount(college.avgFees.min)}-{formatAmount(college.avgFees.max)}/yr
                  </span>
                  <span className="flex items-center gap-1 text-success">
                    <Briefcase className="size-3" />
                    {formatAmount(college.avgPlacement.min)}-{formatAmount(college.avgPlacement.max)}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <GraduationCap className="size-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No colleges found</p>
              <p className="text-sm mt-1">Try adjusting your filters or search term</p>
            </div>
          )}
        </div>
      </main>

      {/* College detail dialog */}
      <Dialog open={!!selectedCollege} onOpenChange={(open) => !open && setSelectedCollege(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          {selectedCollege && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg">{selectedCollege.name}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-3" />
                  {selectedCollege.city}, {selectedCollege.state}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Type & Ranking */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {selectedCollege.type}
                  </span>
                  {selectedCollege.ranking && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-coral/10 text-coral">
                      <Trophy className="size-3" />
                      NIRF #{selectedCollege.ranking}
                    </span>
                  )}
                </div>

                {/* Streams */}
                <div>
                  <div className="text-xs text-muted-foreground font-medium mb-1.5">Streams</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCollege.streams.map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>

                {/* Fees & Placements */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Annual Fees</div>
                    <div className="text-sm font-semibold text-foreground flex items-center gap-1">
                      <IndianRupee className="size-3" />
                      {formatAmount(selectedCollege.avgFees.min)} - {formatAmount(selectedCollege.avgFees.max)}
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Avg Placement</div>
                    <div className="text-sm font-semibold text-success flex items-center gap-1">
                      <IndianRupee className="size-3" />
                      {formatAmount(selectedCollege.avgPlacement.min)} - {formatAmount(selectedCollege.avgPlacement.max)}
                    </div>
                  </div>
                </div>

                {/* Entrance Exams */}
                <div>
                  <div className="text-xs text-muted-foreground font-medium mb-1.5 flex items-center gap-1">
                    <BookOpen className="size-3" /> Entrance Exams
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCollege.entranceExams.map((e) => (
                      <span key={e} className="px-2.5 py-1 rounded-full text-xs bg-primary/10 text-primary font-medium">
                        {e}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div>
                  <div className="text-xs text-muted-foreground font-medium mb-1.5 flex items-center gap-1">
                    <CircleDot className="size-3" /> Highlights
                  </div>
                  <ul className="space-y-1">
                    {selectedCollege.highlights.map((h, i) => (
                      <li key={i} className="text-xs text-foreground flex items-start gap-2">
                        <span className="text-primary mt-0.5">-</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Website */}
                <a
                  href={selectedCollege.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  <ExternalLink className="size-4" />
                  Visit Website
                </a>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
