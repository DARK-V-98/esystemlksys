'use client';
import { useState } from "react";
import Link from "next/link";
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
  Wrench,
  ArrowLeft
} from "lucide-react";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const tools = [
  // PDF Tools
  { id: 2, name: "Merge PDFs", description: "Combine multiple PDF files into one", icon: Merge, category: "PDF", status: "active", path: "/tools/pdf/merge" },
  { id: 3, name: "Split PDF", description: "Split PDF into multiple files", icon: SplitSquareVertical, category: "PDF", status: "active", path: "/tools/pdf/split" },
  { id: 5, name: "Rotate PDF", description: "Rotate PDF pages", icon: RotateCw, category: "PDF", status: "active", path: "/tools/pdf/rotate" },
  { id: 11, name: "Add Watermark", description: "Add text/image watermark to PDF", icon: Stamp, category: "PDF", status: "active", path: "/tools/pdf/watermark" },
  { id: 1, name: "Delete PDF Pages", description: "Remove specific pages from PDF files", icon: Trash2, category: "PDF", status: "active", path: "/tools/pdf/delete-pages" },
  { id: 4, name: "Compress PDF", description: "Reduce PDF file size", icon: Archive, category: "PDF", status: "inactive", path: "#" },
  { id: 6, name: "Lock PDF", description: "Add password protection to PDF", icon: Lock, category: "PDF", status: "inactive", path: "#" },
  { id: 7, name: "Unlock PDF", description: "Remove password from PDF", icon: Unlock, category: "PDF", status: "inactive", path: "#" },
  { id: 8, name: "PDF to Word", description: "Convert PDF to DOCX format", icon: FileText, category: "PDF", status: "inactive", path: "#" },
  { id: 9, name: "PDF to Excel", description: "Convert PDF to XLSX format", icon: FileSpreadsheet, category: "PDF", status: "inactive", path: "#" },
  { id: 10, name: "PDF to Image", description: "Convert PDF pages to images", icon: FileImage, category: "PDF", status: "inactive", path: "#" },
  
  // Document Converters
  { id: 12, name: "Word to PDF", description: "Convert DOCX to PDF format", icon: FileOutput, category: "Converter", status: "inactive", path: "#" },
  { id: 13, name: "Excel to PDF", description: "Convert XLSX to PDF format", icon: FileOutput, category: "Converter", status: "inactive", path: "#" },
  { id: 14, name: "Image to PDF", description: "Convert images to PDF", icon: FileInput, category: "Converter", status: "inactive", path: "#" },
  { id: 15, name: "HTML to PDF", description: "Convert HTML pages to PDF", icon: FileCode, category: "Converter", status: "inactive", path: "#" },
  
  // Image Tools
  { id: 16, name: "Image Compressor", description: "Reduce image file size", icon: Image, category: "Image", status: "inactive", path: "#" },
  { id: 17, name: "Image Resizer", description: "Resize images to any dimension", icon: Image, category: "Image", status: "inactive", path: "#" },
  { id: 18, name: "Image Format Converter", description: "Convert between image formats", icon: Palette, category: "Image", status: "inactive", path: "#" },
  
  // Text Tools
  { id: 19, name: "Text Counter", description: "Count words, characters, sentences", icon: Hash, category: "Text", status: "active", path: "/tools/text-counter" },
  { id: 20, name: "Text Case Converter", description: "Convert text case styles", icon: Type, category: "Text", status: "active", path: "/tools/text-case-converter" },
];

const categories = ["All", "PDF", "Converter", "Image", "Text"];

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const toolsPerPage = 8;

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTools.length / toolsPerPage);
  const indexOfLastTool = currentPage * toolsPerPage;
  const indexOfFirstTool = indexOfLastTool - toolsPerPage;
  const currentTools = filteredTools.slice(indexOfFirstTool, indexOfLastTool);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPaginationItems = () => {
    const items = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink href="#" isActive={i === currentPage} onClick={() => handlePageChange(i)}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
        items.push(
            <PaginationItem key={1}>
              <PaginationLink href="#" isActive={1 === currentPage} onClick={() => handlePageChange(1)}>
                1
              </PaginationLink>
            </PaginationItem>
        );

        if (currentPage > 3) {
            items.push(<PaginationEllipsis key="start-ellipsis" />);
        }

        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);

        if (currentPage <= 2) {
            startPage = 2;
            endPage = 4;
        }

        if (currentPage >= totalPages - 1) {
            startPage = totalPages - 3;
            endPage = totalPages - 1;
        }

        for (let i = startPage; i <= endPage; i++) {
            items.push(
              <PaginationItem key={i}>
                <PaginationLink href="#" isActive={i === currentPage} onClick={() => handlePageChange(i)}>
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
        }

        if (currentPage < totalPages - 2) {
            items.push(<PaginationEllipsis key="end-ellipsis" />);
        }

        items.push(
            <PaginationItem key={totalPages}>
              <PaginationLink href="#" isActive={totalPages === currentPage} onClick={() => handlePageChange(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
        );
    }
    return items;
  }

  const ToolCard = ({ tool }: { tool: typeof tools[0] }) => (
    <div
        className={cn(
            "system-card group rounded-xl p-5 text-center shadow-card animate-slide-up h-full flex flex-col items-center justify-center relative",
             tool.status === 'active' ? 'border-transparent' : ''
        )}
        onClick={tool.status === 'inactive' ? () => toast.info("Coming soon!", { description: `The '${tool.name}' tool is under development.`}) : undefined}
    >
        <div className={cn("absolute top-2 right-2 h-2.5 w-2.5 rounded-full shadow-md", tool.status === 'active' ? 'bg-success' : 'bg-destructive animate-pulse')} />
        
        <div className={cn(
            "flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:shadow-glow group-hover:scale-110",
            tool.status === 'active' ? 'group-hover:gradient-primary group-hover:text-primary-foreground' : 'group-hover:bg-primary/20'
        )}>
            <tool.icon className="h-8 w-8" />
        </div>
        <h3 className={cn(
            "mt-4 font-bold text-foreground transition-colors text-base",
            tool.status === 'active' ? 'group-hover:text-primary' : ''
        )}>
            {tool.name}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
            {tool.description}
        </p>
    </div>
  );

  return (
      <div className="space-y-6 animate-fade-in p-8">
        <div className="relative overflow-hidden gradient-dark p-8">
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

        <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <Link href="/dashboard" className="flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
                      <ArrowLeft className="h-5 w-5" />
                      <span>Main Menu</span>
                  </Link>
                  <div className="relative w-full sm:w-80">
                      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                      type="text"
                      placeholder="Search tools..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pl-12 h-12"
                      />
                  </div>
              </div>
              <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                  <button
                      key={category}
                      onClick={() => {
                        setActiveCategory(category);
                        setCurrentPage(1);
                      }}
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 min-h-[460px]">
            {currentTools.map((tool, index) => (
              tool.status === 'active' ? (
                <Link key={tool.id} href={tool.path} className="contents">
                  <ToolCard tool={tool} />
                </Link>
              ) : (
                <div key={tool.id} className="cursor-pointer">
                   <ToolCard tool={tool} />
                </div>
              )
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center min-h-[460px]">
              <Search className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-bold text-foreground">No tools found</h3>
              <p className="mt-1 text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}

          {totalPages > 1 && (
              <Pagination>
              <PaginationContent>
                  <PaginationItem>
                  <PaginationPrevious href="#" onClick={() => handlePageChange(currentPage - 1)} />
                  </PaginationItem>
                  {getPaginationItems()}
                  <PaginationItem>
                  <PaginationNext href="#" onClick={() => handlePageChange(currentPage + 1)} />
                  </PaginationItem>
              </PaginationContent>
              </Pagination>
          )}
        </div>
      </div>
  );
}
