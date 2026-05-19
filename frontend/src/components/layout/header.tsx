'use client';

import { Bell, User } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-foreground">Welcome back</h2>
        </div>

        <div className="flex items-center gap-4">
          <button className="rounded-full p-2 hover:bg-accent">
            <Bell className="h-5 w-5 text-muted-foreground" />
          </button>

          <button className="flex items-center gap-2 rounded-full bg-primary p-2 text-primary-foreground">
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
