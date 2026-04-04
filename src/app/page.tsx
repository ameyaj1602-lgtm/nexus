'use client';

import Link from 'next/link';
import { Brain, Compass, Map, Users, TrendingUp, Shield, ArrowRight, Sparkles, BarChart3, Heart, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const stats = [
  { value: '93%', label: 'of schools lack counsellors' },
  { value: '29%', label: 'graduate unemployment' },
  { value: '70%', label: 'confused at Class 10' },
  { value: '10%', label: 'receive any guidance' },
];

const steps = [
  { icon: Brain, title: 'Discover Who You Are', description: 'Build your identity snapshot through interests, values, and strengths — not a boring test.', color: 'from-violet-500 to-purple-600' },
  { icon: Compass, title: "Explore What's Out There", description: '50+ careers with AI risk scores, salary data, and growth trends. See the world beyond engineering & medicine.', color: 'from-blue-500 to-cyan-500' },
  { icon: Map, title: 'Navigate Your Path', description: 'AI-powered roadmaps with family context. Stream selection, career hypotheses, and Plan B/C built in.', color: 'from-emerald-500 to-teal-500' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Nexus
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-sm px-4 py-1.5">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            India&apos;s First Career &amp; Identity Navigation OS
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
            Your career is a{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              30-year journey.
            </span>
            <br />
            It starts with knowing who you are.
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            Nexus combines AI, psychology, and family context to help you navigate from Class 8 to your first career — not just pick a stream.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup?role=student">
              <Button size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-lg px-8 py-6 rounded-xl">
                <GraduationCap className="w-5 h-5 mr-2" />
                I&apos;m a Student
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/signup?role=parent">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 rounded-xl border-zinc-700 hover:bg-zinc-900">
                <Users className="w-5 h-5 mr-2" />
                I&apos;m a Parent
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-white/5 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-red-400">{stat.value}</div>
              <div className="text-sm text-zinc-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How Nexus Works</h2>
            <p className="text-zinc-400 text-lg">Three phases. One evolving journey. Your identity at the center.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <Card key={i} className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-all group">
                <CardContent className="p-8">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-xs font-mono text-zinc-500 mb-2">PHASE {i + 1}</div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* For Students vs Parents */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Built for the whole family</h2>
            <p className="text-zinc-400 text-lg">Because in India, career decisions are family decisions.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-indigo-950/50 to-zinc-900 border-indigo-500/20 hover:border-indigo-500/40 transition-all">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-semibold">For Students</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    { icon: Brain, text: 'Identity discovery — who you really are, not who others want you to be' },
                    { icon: Compass, text: '50+ career paths with AI risk scores and real salary data' },
                    { icon: Sparkles, text: 'AI career coach that gets your context, your family, your constraints' },
                    { icon: BarChart3, text: 'Career hypothesis board — test ideas, not just pick one' },
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <item.icon className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                      <span className="text-zinc-300">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-950/50 to-zinc-900 border-purple-500/20 hover:border-purple-500/40 transition-all">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-semibold">For Parents</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    { icon: Heart, text: "See your child's evolving identity — not just a test score" },
                    { icon: TrendingUp, text: 'Compare career paths: cost, salary, AI risk, job availability' },
                    { icon: Shield, text: 'Honest answers to "Is design a real career?" and similar fears' },
                    { icon: Users, text: 'Family alignment score — bridge the expectation gap' },
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <item.icon className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                      <span className="text-zinc-300">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">The career guidance crisis is real</h2>
          <p className="text-zinc-400 text-lg mb-12 max-w-2xl mx-auto">
            13,892 student suicides in 2023. 72% of professionals wish they got better guidance.
            Only 8% of graduates work in jobs relevant to their degree. Something is broken.
          </p>
          <div className="grid sm:grid-cols-2 gap-6 text-left">
            <Card className="bg-red-950/20 border-red-500/20">
              <CardContent className="p-6">
                <div className="text-red-400 font-semibold mb-3">Current Reality</div>
                <ul className="space-y-2 text-zinc-400 text-sm">
                  <li>One psychometric test + 2 sessions = &quot;career guidance&quot;</li>
                  <li>Parents decide based on status, not fit</li>
                  <li>No one models AI disruption or career half-lives</li>
                  <li>Mental health treated separately from career</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-emerald-950/20 border-emerald-500/20">
              <CardContent className="p-6">
                <div className="text-emerald-400 font-semibold mb-3">The Nexus Way</div>
                <ul className="space-y-2 text-zinc-400 text-sm">
                  <li>Multi-year identity navigation, not one-time tests</li>
                  <li>Family as co-navigators with shared dashboards</li>
                  <li>AI-era career intelligence built into every path</li>
                  <li>Identity + career + mental health = one journey</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to find your direction?
          </h2>
          <p className="text-zinc-400 text-lg mb-8">
            Start your career &amp; identity journey today. Free to explore.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-lg px-10 py-6 rounded-xl">
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Nexus
          </div>
          <p className="text-zinc-500 text-sm">Where who you are meets where you&apos;re going.</p>
          <p className="text-zinc-600 text-xs">&copy; 2026 Nexus. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
