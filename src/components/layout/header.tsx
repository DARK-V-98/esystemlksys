"use client";

import { Search, Loader } from "lucide-react";

type HeaderProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
};

export function Header({
  searchQuery,
  setSearchQuery,
  isSearching,
}: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-end border-b bg-card/80 px-6 backdrop-blur-sm">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search links with AI..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 w-full rounded-lg border-none bg-background pl-9 pr-9 text-sm focus:ring-2 focus:ring-primary/50 focus:outline-none"
        />
        {isSearching && (
          <Loader className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>
    </header>
  );
}
