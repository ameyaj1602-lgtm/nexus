'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Link2, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ParentLinkPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleLink = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = code.trim().toLowerCase();

    if (trimmed.length < 6) {
      setError('Please enter a valid invite code (at least 6 characters)');
      return;
    }

    // Check if the invite code matches the one stored on this device
    const storedCode = localStorage.getItem('nexus_invite_code');

    if (storedCode && storedCode === trimmed) {
      // Direct match on same device — link successful
      localStorage.setItem('nexus_parent_linked_code', trimmed);
      localStorage.setItem('nexus_parent_linked', 'true');
      setSuccess(true);

      setTimeout(() => {
        router.push('/parent/dashboard');
      }, 2000);
      return;
    }

    // For MVP on same device: if no stored code exists but parent enters a code,
    // store it and mark as linked (trust-based linking for MVP)
    if (!storedCode) {
      localStorage.setItem('nexus_parent_linked_code', trimmed);
      localStorage.setItem('nexus_parent_linked', 'true');
      setSuccess(true);

      setTimeout(() => {
        router.push('/parent/dashboard');
      }, 2000);
      return;
    }

    // Code doesn't match what's on this device
    setError(
      'Code not found. Make sure your child has signed up on this device and shared their invite code with you.'
    );
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="text-2xl font-bold text-foreground"
          >
            Nexus
          </Link>
          <p className="text-muted-foreground text-sm mt-2">Connect with your child&apos;s journey</p>
        </div>

        <Card className="rounded-xl border border-border bg-card">
          <CardContent className="p-6">
            {success ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle2 className="size-16 text-success mx-auto" />
                <h2 className="text-lg font-semibold text-foreground">
                  You&apos;re now connected to your child&apos;s journey!
                </h2>
                <p className="text-sm text-muted-foreground">
                  Redirecting to your dashboard...
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Link2 className="size-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Link to Your Child
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Enter the invite code from your child&apos;s dashboard
                    </p>
                  </div>
                </div>

                <form onSubmit={handleLink} className="space-y-4">
                  <div>
                    <Label htmlFor="invite-code" className="text-foreground">
                      Enter your child&apos;s invite code
                    </Label>
                    <Input
                      id="invite-code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="e.g. a3k9m2x7"
                      className="mt-1.5 bg-muted border-border text-center text-lg tracking-widest font-mono"
                      maxLength={10}
                      required
                    />
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/5 border border-destructive/10 rounded-lg p-3">
                      <AlertCircle className="size-4 mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-5"
                  >
                    Connect
                  </Button>
                </form>

                <div className="mt-6 rounded-lg bg-muted p-4 space-y-2">
                  <h3 className="text-sm font-medium text-foreground">
                    How to find the invite code:
                  </h3>
                  <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                    <li>Ask your child to open their Nexus dashboard</li>
                    <li>
                      Look for the &quot;Invite Code&quot; card on their dashboard
                    </li>
                    <li>Enter the 8-character code above</li>
                  </ol>
                </div>

                <p className="text-center text-muted-foreground text-xs mt-4">
                  For the MVP, both parent and student accounts must be on the same
                  device/browser.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
