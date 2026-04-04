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
      // Generate invite code for parent linking if not already present
      if (!localStorage.getItem('nexus_invite_code')) {
        localStorage.setItem('nexus_invite_code', Math.random().toString(36).substring(2, 10));
      }
      router.push('/onboarding');
    } else {
      router.push('/parent/link');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Nexus
          </Link>
          <p className="text-zinc-400 mt-2">Start your career journey</p>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => setRole('student')}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  role === 'student'
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-zinc-700 hover:border-zinc-600'
                }`}
              >
                <GraduationCap className={`w-6 h-6 ${role === 'student' ? 'text-indigo-400' : 'text-zinc-500'}`} />
                <span className={`text-sm font-medium ${role === 'student' ? 'text-indigo-400' : 'text-zinc-400'}`}>
                  I&apos;m a Student
                </span>
              </button>
              <button
                onClick={() => setRole('parent')}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  role === 'parent'
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-zinc-700 hover:border-zinc-600'
                }`}
              >
                <Users className={`w-6 h-6 ${role === 'parent' ? 'text-purple-400' : 'text-zinc-500'}`} />
                <span className={`text-sm font-medium ${role === 'parent' ? 'text-purple-400' : 'text-zinc-400'}`}>
                  I&apos;m a Parent
                </span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-zinc-300">Name</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} required
                  placeholder="Your full name" className="mt-1 bg-zinc-800 border-zinc-700" />
              </div>
              <div>
                <Label htmlFor="email" className="text-zinc-300">Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="you@example.com" className="mt-1 bg-zinc-800 border-zinc-700" />
              </div>
              <div>
                <Label htmlFor="password" className="text-zinc-300">Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="Min 6 characters" className="mt-1 bg-zinc-800 border-zinc-700" />
              </div>
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 py-5">
                Create Account
              </Button>
            </form>

            <p className="text-center text-zinc-500 text-sm mt-4">
              Already have an account?{' '}
              <Link href="/login" className="text-indigo-400 hover:underline">Log in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <SignupForm />
    </Suspense>
  );
}
