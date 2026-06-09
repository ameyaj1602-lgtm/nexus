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
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-primary">
            Nexus
          </Link>
          <p className="text-muted-foreground mt-2 text-sm">Welcome back</p>
        </div>
        <Card className="rounded-xl border border-border bg-card">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="you@example.com" className="mt-1 bg-muted border-border" />
              </div>
              <div>
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="Your password" className="mt-1 bg-muted border-border" />
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-5">Log In</Button>
            </form>
            <p className="text-center text-muted-foreground text-sm mt-4">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
