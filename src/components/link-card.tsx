"use client";

import Image from "next/image";
import {
  MoreHorizontal,
  Globe,
  Tag,
  Edit2,
  Trash2,
  Book,
} from "lucide-react";

import type { LinkItem } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type LinkCardProps = {
  link: LinkItem;
  onEdit: (link: LinkItem) => void;
  onDelete: (id: string) => void;
};

export function LinkCard({ link, onEdit, onDelete }: LinkCardProps) {
  const domain = new URL(link.url).hostname;

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
      {link.image && (
        <div className="relative overflow-hidden">
          <Image
            src={link.image.url}
            alt={link.title}
            width={link.image.width}
            height={link.image.height}
            className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={link.image.aiHint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
        </div>
      )}
      <CardHeader className="relative pt-6">
        <CardTitle className="pr-10 text-lg leading-snug">{link.title}</CardTitle>
        <CardDescription className="flex items-center gap-2 pt-1 text-sm">
          <Globe className="h-3 w-3" />
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate hover:text-primary hover:underline"
          >
            {domain}
          </a>
        </CardDescription>
        <div className="absolute right-4 top-4">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(link)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(link.id)}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-4 text-sm text-muted-foreground">
        <p>{link.description}</p>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4 pb-4">
        {link.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
            {link.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {link.notes && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="notes" className="border-b-0">
              <AccordionTrigger className="flex-row-reverse justify-end gap-2 p-0 text-sm font-semibold text-primary/80 hover:text-primary hover:no-underline">
                <Book className="h-4 w-4" />
                Show Notes
              </AccordionTrigger>
              <AccordionContent className="mt-2 rounded-md bg-background p-3 text-sm text-foreground">
                <p className="whitespace-pre-wrap">{link.notes}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardFooter>
    </Card>
  );
}
