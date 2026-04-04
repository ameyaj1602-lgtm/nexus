'use client';

import { useState, useMemo, useEffect } from 'react';
import { mentors, mentorClusters, Mentor } from '@/lib/mentors-data';
import { IdentitySnapshot } from '@/types';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import Sidebar from '@/components/shared/sidebar';
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  Sparkles,
  UserCheck,
  Route,
  MessageSquareQuote,
  X,
} from 'lucide-react';

type IdentityDimension = 'creative' | 'analytical' | 'social' | 'practical' | 'entrepreneurial' | 'caring';

// Map clusters to identity dimensions for matching
const clusterMatchMap: Record<string, IdentityDimension> = {
  'Design & Creative': 'creative',
  'Technology & AI': 'analytical',
  'Healthcare & Wellness': 'caring',
  'Business & Strategy': 'entrepreneurial',
  'Science & Research': 'analytical',
  'Media & Entertainment': 'creative',
  'Finance & Commerce': 'analytical',
  'Government & Public Policy': 'social',
  'Law & Governance': 'social',
  'Arts & Performance': 'creative',
  'Social Impact': 'caring',
  'Sports & Fitness': 'practical',
  'Hospitality & Food': 'practical',
};

function getIdentityScore(mentor: Mentor, identity: IdentitySnapshot | null): number {
  if (!identity) return 50;
  const dim = clusterMatchMap[mentor.cluster];
  if (!dim) return 50;
  return identity[dim] ?? 50;
}

export default function MentorsPage() {
  const [search, setSearch] = useState('');
  const [activeCluster, setActiveCluster] = useState<string | null>(null);
  const [matchIdentity, setMatchIdentity] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [identity, setIdentity] = useState<IdentitySnapshot | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('nexus_identity');
      if (raw) setIdentity(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const filteredMentors = useMemo(() => {
    let result = [...mentors];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.career.toLowerCase().includes(q) ||
          m.company.toLowerCase().includes(q) ||
          m.city.toLowerCase().includes(q) ||
          m.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (activeCluster) {
      result = result.filter((m) => m.cluster === activeCluster);
    }

    if (matchIdentity && identity) {
      result.sort((a, b) => getIdentityScore(b, identity) - getIdentityScore(a, identity));
    }

    return result;
  }, [search, activeCluster, matchIdentity, identity]);

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Mentor Directory</h1>
            <p className="text-sm text-zinc-500">
              Connect with {mentors.length} professionals across diverse careers
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
            <Input
              placeholder="Search by name, career, company, city, or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 h-11"
            />
          </div>

          {/* Cluster filter chips */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCluster(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                !activeCluster
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
              }`}
            >
              All
            </button>
            {mentorClusters.map((cluster) => (
              <button
                key={cluster}
                onClick={() => setActiveCluster(activeCluster === cluster ? null : cluster)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeCluster === cluster
                    ? 'bg-indigo-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                }`}
              >
                {cluster}
              </button>
            ))}
            <button
              onClick={() => setMatchIdentity(!matchIdentity)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
                matchIdentity
                  ? 'bg-purple-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
              }`}
            >
              <Sparkles className="size-3" />
              Match with my identity
            </button>
          </div>

          {/* Results count */}
          <p className="text-xs text-zinc-500">{filteredMentors.length} mentors found</p>

          {/* Mentors grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMentors.map((mentor) => (
              <button
                key={mentor.id}
                onClick={() => setSelectedMentor(mentor)}
                className="text-left bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 hover:border-indigo-500/50 hover:bg-zinc-900 transition-all group"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-2xl">{mentor.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{mentor.name}</div>
                    <div className="text-xs text-indigo-400 truncate">{mentor.career}</div>
                  </div>
                  {mentor.available && (
                    <div className="size-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" title="Available" />
                  )}
                </div>
                <div className="space-y-1.5 text-xs text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="size-3 shrink-0" />
                    <span className="truncate">{mentor.company}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-3 shrink-0" />
                    <span>{mentor.experience}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="size-3 shrink-0" />
                    <span>{mentor.city}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <Badge variant="secondary" className="text-[10px] bg-zinc-800 text-zinc-400">
                    {mentor.cluster}
                  </Badge>
                </div>
              </button>
            ))}
          </div>

          {filteredMentors.length === 0 && (
            <div className="text-center py-16 text-zinc-500">
              <p className="text-lg mb-1">No mentors found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>

      {/* Mentor detail sheet */}
      <Sheet open={!!selectedMentor} onOpenChange={(open) => !open && setSelectedMentor(null)}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto bg-zinc-950 border-zinc-800">
          {selectedMentor && (
            <>
              <SheetHeader className="pb-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-4xl">{selectedMentor.avatar}</div>
                  <div>
                    <SheetTitle className="text-white text-lg">{selectedMentor.name}</SheetTitle>
                    <SheetDescription className="text-indigo-400 text-sm">
                      {selectedMentor.career} at {selectedMentor.company}
                    </SheetDescription>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-zinc-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" /> {selectedMentor.experience}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" /> {selectedMentor.city}
                  </span>
                  {selectedMentor.available && (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <UserCheck className="size-3" /> Available for mentorship
                    </span>
                  )}
                </div>
              </SheetHeader>

              <div className="px-4 pb-4 space-y-6 mt-4">
                {/* Bio */}
                <div>
                  <p className="text-sm text-zinc-300 leading-relaxed">{selectedMentor.bio}</p>
                </div>

                {/* Journey */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Route className="size-4 text-indigo-400" />
                    <h3 className="text-sm font-semibold text-white">My Journey</h3>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">{selectedMentor.journey}</p>
                </div>

                {/* Advice */}
                <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquareQuote className="size-4 text-indigo-400" />
                    <h3 className="text-sm font-semibold text-white">My Advice</h3>
                  </div>
                  <p className="text-sm text-indigo-200 leading-relaxed italic">
                    &ldquo;{selectedMentor.advice}&rdquo;
                  </p>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMentor.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="bg-zinc-800 text-zinc-300 text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Request mentorship button */}
                <Button
                  onClick={() => {
                    setToast(
                      `Coming soon! We'll connect you with ${selectedMentor.name} when mentorship goes live.`
                    );
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Request Mentorship
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full px-4">
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 shadow-lg flex items-start gap-3">
            <Sparkles className="size-4 text-indigo-400 mt-0.5 shrink-0" />
            <p className="text-sm text-zinc-200 flex-1">{toast}</p>
            <button onClick={() => setToast(null)} className="text-zinc-500 hover:text-zinc-300">
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
