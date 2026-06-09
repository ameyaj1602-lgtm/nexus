'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Compass,
  Map,
  Navigation,
  MessageCircle,
  Settings,
  LogOut,
  GraduationCap,
  Users,
  Zap,
  Play,
  ArrowLeftRight,
  FileText,
  Award,
  ClipboardList,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logout, getUser } from '@/lib/auth';

const studentNav = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Discover', href: '/discover', icon: Compass },
  { label: 'Explore', href: '/explore', icon: Map },
  { label: 'Navigate', href: '/navigate', icon: Navigation },
  { label: 'Colleges', href: '/colleges', icon: GraduationCap },
  { label: 'Exams', href: '/exams', icon: ClipboardList },
  { label: 'Scholarships', href: '/scholarships', icon: Award },
  { label: 'Mentors', href: '/mentors', icon: Users },
  { label: 'Skills', href: '/skills', icon: Zap },
  { label: 'Simulate', href: '/simulate', icon: Play },
  { label: 'Compare', href: '/compare', icon: ArrowLeftRight },
  { label: 'Resume', href: '/resume', icon: FileText },
  { label: 'Coach', href: '/coach', icon: MessageCircle },
  { label: 'Settings', href: '/settings', icon: Settings },
];

const parentNav = [
  { label: 'Dashboard', href: '/parent/dashboard', icon: LayoutDashboard },
  { label: 'Explore Careers', href: '/explore', icon: Compass },
  { label: 'Colleges', href: '/colleges', icon: GraduationCap },
  { label: 'Exams', href: '/exams', icon: ClipboardList },
  { label: 'Scholarships', href: '/scholarships', icon: Award },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = getUser();
  const navItems = user?.role === 'parent' ? parentNav : studentNav;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 lg:w-60 flex-col border-r border-border bg-sidebar h-screen sticky top-0">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="size-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-xs font-extrabold text-primary-foreground">N</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Nexus
          </span>
        </div>

        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          {user && (
            <div className="flex items-center gap-3 px-3 py-2 mb-1">
              <div className="size-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user.name}</div>
                <div className="text-xs text-muted-foreground capitalize">
                  {user.role}
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-muted w-full transition-colors"
          >
            <LogOut className="size-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-center justify-around border-t border-border bg-background/95 backdrop-blur-sm px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {navItems.slice(0, 5).map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors min-w-[3.5rem]',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground active:bg-muted'
              )}
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
