'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Users } from 'lucide-react';
import { signup } from '@/lib/auth';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') || 'student';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'parent'>(defaultRole as 'student' | 'parent');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup({ name, email, role });
    if (role === 'student') {
      if (!localStorage.getItem('nexus_invite_code')) {
        localStorage.setItem('nexus_invite_code', Math.random().toString(36).substring(2, 10));
      }
      router.push('/onboarding');
    } else {
      router.push('/parent/link');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-primary">
            Nexus
          </Link>
          <p className="text-muted-foreground mt-2 text-sm">Create your account to get started</p>
        </div>

        <Card className="rounded-xl border border-border bg-card">
          <CardContent className="p-6">
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => setRole('student')}
                className={`p-4 rounded-xl border-2 transition-colors flex flex-col items-center gap-2 ${
                  role === 'student'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <GraduationCap className={`size-5 ${role === 'student' ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-sm font-medium ${role === 'student' ? 'text-primary' : 'text-muted-foreground'}`}>
                  I&apos;m a Student
                </span>
              </button>
              <button
                onClick={() => setRole('parent')}
                className={`p-4 rounded-xl border-2 transition-colors flex flex-col items-center gap-2 ${
                  role === 'parent'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <Users className={`size-5 ${role === 'parent' ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-sm font-medium ${role === 'parent' ? 'text-primary' : 'text-muted-foreground'}`}>
                  I&apos;m a Parent
                </span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-foreground">Name</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} required
                  placeholder="Your full name" className="mt-1 bg-muted border-border" />
              </div>
              <div>
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="you@example.com" className="mt-1 bg-muted border-border" />
              </div>
              <div>
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="Min 6 characters" className="mt-1 bg-muted border-border" />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-5">
                Create Account
              </Button>
            </form>

            <p className="text-center text-muted-foreground text-sm mt-4">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline">Log in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SignupForm />
    </Suspense>
  );
}
