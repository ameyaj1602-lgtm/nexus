'use client';

import Link from 'next/link';
import { ArrowRight, GraduationCap, Users, Brain, Compass, Map, TrendingUp, Shield, Heart, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
  { value: '93%', label: 'of schools lack career counsellors' },
  { value: '29%', label: 'graduate unemployment rate' },
  { value: '70%', label: 'confused about streams at Class 10' },
  { value: '8%', label: 'receive any career guidance' },
];

const steps = [
  { icon: Brain, title: 'Discover yourself', description: 'Build your identity through interests, values, and strengths. Not a boring psychometric test.' },
  { icon: Compass, title: 'Explore careers', description: '50+ careers with real salary data, AI risk scores, and growth trends. Beyond just engineering and medicine.' },
  { icon: Map, title: 'Navigate your path', description: 'Personalised roadmaps with stream selection, career hypotheses, and backup plans built in.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-xs font-extrabold text-primary-foreground">N</span>
            </div>
            <span className="text-lg font-bold tracking-tight">Nexus</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">Get started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-medium text-primary mb-4 tracking-wide">
            Career guidance that actually makes sense
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Figure out what to do{' '}
            <span className="text-primary">after Class 10</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Explore 50+ careers with real salary data, AI risk scores, and a coach that
            understands Indian families. Not another psychometric test.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup?role=student">
              <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-5 rounded-xl text-base">
                <GraduationCap className="size-4 mr-2" />
                I&apos;m a student
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </Link>
            <Link href="/signup?role=parent">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-5 rounded-xl text-base border-border hover:bg-muted">
                <Users className="size-4 mr-2" />
                I&apos;m a parent
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-extrabold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Three steps. One evolving journey.</h2>
            <p className="text-muted-foreground">Your identity at the centre, not a test score.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <step.icon className="size-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Students vs Parents */}
      <section className="py-20 px-4 sm:px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Built for the whole family</h2>
            <p className="text-muted-foreground">Because in India, career decisions are family decisions.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Students */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="size-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">For students</h3>
              </div>
              <ul className="space-y-3">
                {[
                  { icon: Brain, text: 'Identity discovery — who you really are, not who others want you to be' },
                  { icon: Compass, text: '50+ career paths with AI risk scores and real salary data' },
                  { icon: MessageCircleIcon, text: 'AI career coach that gets your context, family, and constraints' },
                  { icon: BarChart3, text: 'Career hypothesis board — test ideas before committing' },
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <item.icon className="size-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Parents */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="size-10 rounded-lg bg-cyan-accent/10 flex items-center justify-center">
                  <Users className="size-5 text-cyan-accent" />
                </div>
                <h3 className="text-lg font-semibold">For parents</h3>
              </div>
              <ul className="space-y-3">
                {[
                  { icon: Heart, text: "See your child's evolving identity — not just a test score" },
                  { icon: TrendingUp, text: 'Compare career paths: cost, salary, AI risk, job availability' },
                  { icon: Shield, text: 'Honest answers to "Is design a real career?" and similar fears' },
                  { icon: Users, text: 'Family alignment score — bridge the expectation gap' },
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <item.icon className="size-4 text-cyan-accent shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to figure things out?
          </h2>
          <p className="text-muted-foreground mb-8">
            Start exploring careers for free. No tests. No pressure.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-5 rounded-xl text-base">
              Get started free
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-md bg-primary flex items-center justify-center">
              <span className="text-[10px] font-extrabold text-primary-foreground">N</span>
            </div>
            <span className="font-bold">Nexus</span>
          </div>
          <p className="text-muted-foreground text-sm">Career navigation for Indian students.</p>
          <p className="text-muted-foreground/60 text-xs">&copy; 2026 Nexus</p>
        </div>
      </footer>
    </div>
  );
}

function MessageCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}
