"use server";

import {
  aiSearchLinks,
  type AiSearchLinksInput,
  type AiSearchLinksOutput,
} from "@/ai/flows/ai-search-links";
import type { LinkItem } from "@/lib/types";

// The Genkit flow expects a slightly different format for links (content field is required).
// We'll map our LinkItem to what the flow expects.
type GenkitLinkInput = {
    title: string;
    description: string;
    tags: string[];
    content: string;
    url: string;
}

export async function searchLinksAction(input: {query: string, links: LinkItem[]}): Promise<LinkItem[]> {
  if (!input.query.trim() || input.links.length === 0) {
    return [];
  }

  // Find the original links to map back to later
  const originalLinksMap = new Map(input.links.map(link => [link.url, link]));

  const genkitInput: AiSearchLinksInput = {
    query: input.query,
    links: input.links.map(link => ({
        title: link.title,
        description: link.description,
        tags: link.tags,
        content: link.notes, // Using notes as content for relevance search
        url: link.url,
    })),
  };

  try {
    const results = await aiSearchLinks(genkitInput);
    
    // Map results back to full LinkItem objects and sort
    const sortedLinks = results.map(result => {
        const originalLink = originalLinksMap.get(result.url);
        return {
            ...(originalLink as LinkItem),
            relevanceScore: result.relevanceScore,
        };
    }).sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

    return sortedLinks;

  } catch (error) {
    console.error("AI Search Error:", error);
    // Fallback to a simple text search if AI fails
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
}
