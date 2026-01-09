"use client";

import type { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

type SidebarProps = {
  categories: Category[];
  activeCategory: string;
  setActiveCategory: (id: string) => void;
  onAddNew: () => void;
};

export function Sidebar({
  categories,
  activeCategory,
  setActiveCategory,
  onAddNew,
}: SidebarProps) {
  return (
    <aside className="hidden h-screen w-64 flex-col border-r bg-card/50 p-4 md:flex">
      <div className="p-2 mb-4">
        <Logo />
      </div>
      
      <div className="flex-1 space-y-1.5">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="ghost"
            onClick={() => setActiveCategory(category.id)}
            className={cn(
              "w-full justify-start text-base h-11",
              activeCategory === category.id
                ? "bg-secondary text-primary font-semibold"
                : "text-muted-foreground"
            )}
          >
            <category.icon className="mr-3 h-5 w-5" />
            {category.name}
          </Button>
        ))}
      </div>
      <div className="mt-4">
        <Button
          onClick={onAddNew}
          className="w-full h-12 text-base font-semibold"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add New Link
        </Button>
      </div>
    </aside>
  );
}
