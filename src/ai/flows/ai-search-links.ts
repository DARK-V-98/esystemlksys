'use server';

/**
 * @fileOverview A flow for AI-powered search of saved links.
 *
 * - aiSearchLinks - A function that searches links based on keywords using AI.
 * - AiSearchLinksInput - The input type for the aiSearchLinks function.
 * - AiSearchLinksOutput - The return type for the aiSearchLinks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiSearchLinksInputSchema = z.object({
  query: z.string().describe('The search query entered by the user.'),
  links: z.array(
    z.object({
      title: z.string().describe('The title of the link.'),
      description: z.string().describe('The description of the link.'),
      tags: z.array(z.string()).describe('The tags associated with the link.'),
      content: z.string().optional().describe('The content of the link (optional).'),
      url: z.string().url().describe('The url of the link.'),
    })
  ).describe('The array of links to search through.'),
});

export type AiSearchLinksInput = z.infer<typeof AiSearchLinksInputSchema>;

const AiSearchLinksOutputSchema = z.array(
  z.object({
    title: z.string().describe('The title of the link.'),
    description: z.string().describe('The description of the link.'),
    tags: z.array(z.string()).describe('The tags associated with the link.'),
    content: z.string().optional().describe('The content of the link (optional).'),
    url: z.string().url().describe('The url of the link.'),
    relevanceScore: z.number().describe('A score indicating the relevance of the link to the search query.'),
  })
).describe('An array of links sorted by relevance to the search query.');

export type AiSearchLinksOutput = z.infer<typeof AiSearchLinksOutputSchema>;

export async function aiSearchLinks(input: AiSearchLinksInput): Promise<AiSearchLinksOutput> {
  return aiSearchLinksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSearchLinksPrompt',
  input: {schema: AiSearchLinksInputSchema},
  output: {schema: AiSearchLinksOutputSchema},
  prompt: `You are an AI assistant that helps users find relevant links based on their search query.

You will be provided with a list of links, each with a title, description, tags, content and a URL.
Your task is to determine the relevance of each link to the user's query and return a sorted array of links based on relevance.

For each link, you must compute a relevance score. Links with higher relevance scores should appear earlier in the list.
Links should be sorted by relevance score in descending order.

Consider the title, description, tags, and content (if available) of each link when determining its relevance.

Query: {{{query}}}

Links:{{#each links}}
Title: {{{this.title}}}
Description: {{{this.description}}}
Tags: {{#each this.tags}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Content: {{{this.content}}}
URL: {{{this.url}}}
{{/each}}

Output the links sorted by relevance, including the title, description, tags, content, URL, and a relevanceScore for each link.
Ensure that the relevanceScore is a number.
`,
});

const aiSearchLinksFlow = ai.defineFlow(
  {
    name: 'aiSearchLinksFlow',
    inputSchema: AiSearchLinksInputSchema,
    outputSchema: AiSearchLinksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
