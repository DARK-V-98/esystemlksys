'use client';
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  FileImage, 
  FileSpreadsheet, 
  FileCode,
  Merge,
  RotateCw,
  Lock,
  Unlock,
  Archive,
  Image,
  Type,
  Hash,
  Search,
  Trash2,
  FileOutput,
  FileInput,
  SplitSquareVertical,
  Stamp,
  Palette,
  Wrench
} from "lucide-react";

const tools = [
  // PDF Tools
  { id: 1, name: "Delete PDF Pages", description: "Remove specific pages from PDF files", icon: Trash2, category: "PDF" },
  { id: 2, name: "Merge PDFs", description: "Combine multiple PDF files into one", icon: Merge, category: "PDF" },
  { id: 3, name: "Split PDF", description: "Split PDF into multiple files", icon: SplitSquareVertical, category: "PDF" },
  { id: 4, name: "Compress PDF", description: "Reduce PDF file size", icon: Archive, category: "PDF" },
  { id: 5, name: "Rotate PDF", description: "Rotate PDF pages", icon: RotateCw, category: "PDF" },
  { id: 6, name: "Lock PDF", description: "Add password protection to PDF", icon: Lock, category: "PDF" },
  { id: 7, name: "Unlock PDF", description: "Remove password from PDF", icon: Unlock, category: "PDF" },
  { id: 8, name: "PDF to Word", description: "Convert PDF to DOCX format", icon: FileText, category: "PDF" },
  { id: 9, name: "PDF to Excel", description: "Convert PDF to XLSX format", icon: FileSpreadsheet, category: "PDF" },
  { id: 10, name: "PDF to Image", description: "Convert PDF pages to images", icon: FileImage, category: "PDF" },
  { id: 11, name: "Add Watermark", description: "Add text/image watermark to PDF", icon: Stamp, category: "PDF" },
  
  // Document Converters
  { id: 12, name: "Word to PDF", description: "Convert DOCX to PDF format", icon: FileOutput, category: "Converter" },
  { id: 13, name: "Excel to PDF", description: "Convert XLSX to PDF format", icon: FileOutput, category: "Converter" },
  { id: 14, name: "Image to PDF", description: "Convert images to PDF", icon: FileInput, category: "Converter" },
  { id: 15, name: "HTML to PDF", description: "Convert HTML pages to PDF", icon: FileCode, category: "Converter" },
  
  // Image Tools
  { id: 16, name: "Image Compressor", description: "Reduce image file size", icon: Image, category: "Image" },
  { id: 17, name: "Image Resizer", description: "Resize images to any dimension", icon: Image, category: "Image" },
  { id: 18, name: "Image Format Converter", description: "Convert between image formats", icon: Palette, category: "Image" },
  
  // Text Tools
  { id: 19, name: "Text Counter", description: "Count words, characters, sentences", icon: Hash, category: "Text" },
  { id: 20, name: "Text Case Converter", description: "Convert text case styles", icon: Type, category: "Text" },
];

const categories = ["All", "PDF", "Converter", "Image", "Text"];

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl gradient-dark p-8">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense animate-pulse-glow">
              <Wrench className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-primary-foreground">
                File <span className="text-primary neon-text">Tools</span>
              </h1>
              <p className="mt-1 text-primary-foreground/70">
                20+ powerful utilities for file management and conversion
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-200 ${
                  activeCategory === category
                    ? "gradient-primary text-primary-foreground shadow-glow"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTools.map((tool, index) => (
            <button
              key={tool.id}
              className="system-card group rounded-xl p-5 text-left shadow-card animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:gradient-primary group-hover:text-primary-foreground group-hover:shadow-glow group-hover:scale-110">
                  <tool.icon className="h-7 w-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {tool.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {tool.description}
                  </p>
                  <span className="mt-2 inline-block rounded-lg bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                    {tool.category}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-bold text-foreground">No tools found</h3>
            <p className="mt-1 text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="rounded-xl bg-secondary p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by <span className="font-black text-gradient">ESYSTEMLK</span> • File Tools
          </p>
        </div>
      </div>
  );
}
