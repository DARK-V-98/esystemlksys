"use server";

import type { LinkItem } from "@/lib/types";

// This is a placeholder since the AI search is disabled.
export async function searchLinksAction(input: {query: string, links: LinkItem[]}): Promise<LinkItem[]> {
  if (!input.query.trim() || input.links.length === 0) {
    return [];
  }
    // Fallback to a simple text search
    const lowerCaseQuery = input.query.toLowerCase();
    return input.links
      .filter(link => 
        link.title.toLowerCase().includes(lowerCaseQuery) ||
        link.description.toLowerCase().includes(lowerCaseQuery) ||
        link.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery)) ||
        link.notes.toLowerCase().includes(lowerCaseQuery)
      )
      .map(link => ({ ...link, relevanceScore: 0.5 }));
}
