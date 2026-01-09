'use client';

import Link from 'next/link';
import { Video, Music, ArrowLeft, PlayCircle } from 'lucide-react';

const mediaOptions = [
  {
    name: 'Video Player',
    description: 'Play your local video files.',
    icon: Video,
    path: '/media/video',
  },
  {
    name: 'Audio Player',
    description: 'Create playlists and listen to your music.',
    icon: Music,
    path: '/media/audio',
  },
];

export default function MediaPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense animate-pulse-glow">
            <PlayCircle className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Media <span className="text-primary neon-text">Center</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Your local video and audio player.
            </p>
          </div>
        </div>
      </div>

      <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
          <ArrowLeft className="h-5 w-5" />
          <span>Main Menu</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {mediaOptions.map((option) => (
          <Link key={option.path} href={option.path}>
            <div className="system-card group rounded-2xl p-8 text-center shadow-card h-full flex flex-col items-center justify-center aspect-video">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 text-primary transition-all duration-300 group-hover:gradient-primary group-hover:text-primary-foreground group-hover:shadow-glow group-hover:scale-110">
                <option.icon className="h-12 w-12" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{option.name}</h2>
              <p className="mt-2 text-muted-foreground">{option.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
