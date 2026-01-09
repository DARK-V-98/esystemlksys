import type { LucideIcon } from 'lucide-react';

export type Category = {
  id: string;
  name: string;
  icon: LucideIcon;
};

export type LinkItem = {
  id: string;
  url: string;
  title: string;
  description: string;
  image?: {
    url: string;
    width: number;
    height: number;
    aiHint: string;
  };
  category: string; // category name
  tags: string[];
  notes: string;
  createdAt: string;
  relevanceScore?: number;
};
