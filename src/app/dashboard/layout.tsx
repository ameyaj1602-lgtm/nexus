'use client';

import Sidebar from '@/components/shared/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">{children}</main>
    </div>
  );
}
