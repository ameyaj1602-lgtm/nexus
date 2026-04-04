import { supabase } from './supabase';

export interface User {
  name: string;
  email: string;
  role: 'student' | 'parent';
}

const AUTH_KEY = 'nexus_user';

// Supabase auth methods
export async function signUpWithEmail(email: string, password: string, name: string, role: 'student' | 'parent') {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role },
    },
  });

  if (error) throw error;

  // Also save locally for immediate access (Supabase email confirmation may be enabled)
  const user: User = { name, email, role };
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));

  return data;
}

export async function loginWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Fallback to localStorage if Supabase auth not fully set up
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      const user: User = JSON.parse(stored);
      if (user.email === email) return user;
    }
    throw error;
  }

  const user: User = {
    name: data.user?.user_metadata?.name || email.split('@')[0],
    email: data.user?.email || email,
    role: data.user?.user_metadata?.role || 'student',
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
}

export async function logoutSupabase() {
  await supabase.auth.signOut();
  localStorage.removeItem(AUTH_KEY);
}

// Quick local methods (kept for backward compat and instant UI)
export function signup(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  // Fire and forget Supabase signup
  signUpWithEmail(user.email, 'nexus-temp-123', user.name, user.role).catch(() => {});
}

export function login(email: string, _password: string): User | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) return null;
  const user: User = JSON.parse(stored);
  if (user.email === email) return user;
  return null;
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_KEY);
  logoutSupabase().catch(() => {});
}

export function isLoggedIn(): boolean {
  return getUser() !== null;
}
