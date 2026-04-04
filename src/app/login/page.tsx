'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { login } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = login(email, password);
    if (user) {
      if (user.role === 'student') {
        const onboarded = localStorage.getItem('nexus_onboarding');
        router.push(onboarded ? '/dashboard' : '/onboarding');
      } else {
        router.push('/parent/dashboard');
      }
    } else {
      setError('No account found. Please sign up first.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Nexus
          </Link>
          <p className="text-zinc-400 mt-2">Welcome back</p>
        </div>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-zinc-300">Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="you@example.com" className="mt-1 bg-zinc-800 border-zinc-700" />
              </div>
              <div>
                <Label htmlFor="password" className="text-zinc-300">Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="Your password" className="mt-1 bg-zinc-800 border-zinc-700" />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 py-5">Log In</Button>
            </form>
            <p className="text-center text-zinc-500 text-sm mt-4">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-indigo-400 hover:underline">Sign up</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
