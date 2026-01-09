"use client";

import React, { useState, useMemo, useTransition, useEffect } from "react";
import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import type { Category, LinkItem } from "@/lib/types";
import { initialLinks, initialCategories } from "@/lib/data";
import { searchLinksAction } from "@/lib/actions";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { LinkCard } from "@/components/link-card";
import { LinkForm } from "@/components/link-form";
import { Button } from "@/components/ui/button";

export function Dashboard() {
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const [categories] = useState<Category[]>(initialCategories);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LinkItem[] | null>(null);
  const [isPending, startTransition] = useTransition();
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults(null);
      return;
    }

    startTransition(async () => {
      const relevantLinks = links.filter(link => 
        activeCategory === 'all' || link.category.toLowerCase().replace(' ', '-') === activeCategory
      );
      const results = await searchLinksAction({ query: searchQuery, links: relevantLinks.map(l => ({...l, content: l.notes})) });
      setSearchResults(results as LinkItem[]);
    });
  }, [searchQuery, links, activeCategory]);

  const displayedLinks = useMemo(() => {
    if (searchResults) {
      return searchResults;
    }
    if (activeCategory === "all") {
      return links;
    }
    return links.filter(
      (link) => link.category.toLowerCase().replace(" ", "-") === activeCategory
    );
  }, [links, activeCategory, searchResults]);

  const handleSaveLink = (linkData: LinkItem) => {
    if (editingLink) {
      setLinks(links.map((l) => (l.id === linkData.id ? linkData : l)));
    } else {
      setLinks([linkData, ...links]);
    }
    setEditingLink(null);
  };

  const handleEditLink = (link: LinkItem) => {
    setEditingLink(link);
    setIsFormOpen(true);
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
  };
  
  const handleAddNewClick = () => {
    setEditingLink(null);
    setIsFormOpen(true);
  }

  return (
    <div className="flex h-screen w-full bg-background font-body">
      <Sidebar
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onAddNew={handleAddNewClick}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearching={isPending}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <AnimatePresence>
            <motion.div
              key={activeCategory + searchQuery}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
            >
              {displayedLinks.map((link, index) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <LinkCard
                    link={link}
                    onEdit={handleEditLink}
                    onDelete={handleDeleteLink}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
           {displayedLinks.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground">No links found.</p>
                <p className="mt-1 text-muted-foreground">
                  Try a different category or add a new link.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
      <LinkForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        onSave={handleSaveLink}
        linkToEdit={editingLink}
        categories={categories.filter(c => c.id !== 'all')}
      />
    </div>
  );
}
