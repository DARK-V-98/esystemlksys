'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { 
  HardDrive, 
  Trash2, 
  Rocket,
  Cpu,
  MemoryStick,
  Thermometer,
  Battery,
  Wifi,
  Monitor,
  Server,
  Shield,
  Clock,
  Gauge,
  Zap,
  RefreshCw,
  Search,
  FolderOpen,
  Database,
  Activity,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";

const systemTools = [
  // Disk & Storage
  { id: 1, name: "Disk Cleaner", description: "Remove junk files and free up disk space", icon: Trash2, category: "Storage", status: "active" },
  { id: 2, name: "Disk Analyzer", description: "Visualize disk usage and find large files", icon: HardDrive, category: "Storage", status: "inactive" },
  { id: 3, name: "Duplicate Finder", description: "Find and remove duplicate files", icon: FolderOpen, category: "Storage", status: "inactive" },
  { id: 4, name: "Disk Defragmenter", description: "Optimize disk performance", icon: Database, category: "Storage", status: "inactive" },
  
  // Performance
  { id: 5, name: "RAM Optimizer", description: "Free up memory and boost performance", icon: MemoryStick, category: "Performance", status: "inactive" },
  { id: 6, name: "Startup Manager", description: "Control programs that run at startup", icon: Rocket, category: "Performance", status: "inactive" },
  { id: 7, name: "Process Manager", description: "Monitor and manage running processes", icon: Activity, category: "Performance", status: "inactive" },
  { id: 8, name: "CPU Monitor", description: "Real-time CPU usage monitoring", icon: Cpu, category: "Performance", status: "inactive" },
  { id: 9, name: "Performance Boost", description: "One-click system optimization", icon: Zap, category: "Performance", status: "inactive" },
  
  // System Info
  { id: 10, name: "System Info", description: "View detailed system specifications", icon: Monitor, category: "Info", status: "inactive" },
  { id: 11, name: "Temperature Monitor", description: "Track CPU and GPU temperatures", icon: Thermometer, category: "Info", status: "inactive" },
  { id: 12, name: "Battery Health", description: "Check battery status and health", icon: Battery, category: "Info", status: "inactive" },
  { id: 13, name: "Network Info", description: "View network configuration and status", icon: Wifi, category: "Info", status: "inactive" },
  
  // Maintenance
  { id: 14, name: "Registry Cleaner", description: "Clean and repair Windows registry", icon: Server, category: "Maintenance", status: "inactive" },
  { id: 15, name: "Driver Updater", description: "Check and update system drivers", icon: RefreshCw, category: "Maintenance", status: "inactive" },
  { id: 16, name: "Security Scanner", description: "Scan for security vulnerabilities", icon: Shield, category: "Maintenance", status: "inactive" },
  { id: 17, name: "Scheduled Tasks", description: "Manage Windows scheduled tasks", icon: Clock, category: "Maintenance", status: "inactive" },
  { id: 18, name: "Benchmark Test", description: "Test your system performance", icon: Gauge, category: "Maintenance", status: "inactive" },
];

const categories = ["All", "Storage", "Performance", "Info", "Maintenance"];

type Tool = typeof systemTools[0];

const DiskCleaner = ({ onFinish }: { onFinish: () => void }) => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("Scanning for junk files...");
    const [filesCleaned, setFilesCleaned] = useState(0);
    const [spaceFreed, setSpaceFreed] = useState(0);
    const [isCleaning, setIsCleaning] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setStatus("Cleaning complete!");
                    setIsCleaning(false);
                    toast.success(`Disk Cleaned! Freed ${(Math.random() * 2 + 1).toFixed(2)} GB of space.`);
                    return 100;
                }
                const newProgress = prev + Math.random() * 10;
                if (newProgress > 20 && newProgress < 80) {
                    setStatus("Removing temporary files...");
                    setFilesCleaned(f => f + Math.floor(Math.random() * 50));
                    setSpaceFreed(s => s + Math.random() * 100);
                } else if (newProgress >= 80) {
                    setStatus("Clearing system cache...");
                }
                return Math.min(newProgress, 100);
            });
        }, 300);

        return () => clearInterval(interval);
    }, []);

    return (
        <Card className="col-span-1 sm:col-span-2 lg:col-span-3 border-primary/50 shadow-glow">
            <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl gradient-primary text-primary-foreground">
                        <Trash2 className="h-7 w-7" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-foreground">Disk Cleaner</h3>
                        <p className="text-muted-foreground">{status}</p>
                    </div>
                </div>
                <Progress value={progress} className="w-full mb-4 h-3" />
                <div className="flex justify-between items-center text-sm text-muted-foreground mb-6">
                    <span>{filesCleaned} files cleaned</span>
                    <span>{(spaceFreed / 1024).toFixed(2)} GB freed</span>
                </div>
                <div className="text-right">
                    <Button onClick={onFinish} disabled={isCleaning}>
                        {isCleaning ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CheckCircle className="mr-2 h-4 w-4" />}
                        {isCleaning ? 'Cleaning in Progress...' : 'Finish'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function SystemsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  const handleToolClick = (tool: Tool) => {
    if (tool.status === 'active') {
        setActiveTool(tool);
    } else {
        toast.warning("Coming Soon!", {
            description: `The '${tool.name}' tool is under development.`,
        });
    }
  };

  const filteredTools = systemTools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (activeTool) {
    if (activeTool.id === 1) {
        return <DiskCleaner onFinish={() => setActiveTool(null)} />;
    }
    // Future tools can be handled here with else-if
  }


  return (
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl gradient-dark p-8">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense animate-pulse-glow">
              <Monitor className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-primary-foreground">
                System <span className="text-primary neon-text">Utilities</span>
              </h1>
              <p className="mt-1 text-primary-foreground/70">
                18 powerful tools for PC optimization and monitoring
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Trash2, label: "Quick Clean", desc: "Free up space", action: () => handleToolClick(systemTools.find(t => t.id === 1)!) },
            { icon: Zap, label: "Boost PC", desc: "Optimize now", action: () => toast.info("Coming soon!") },
            { icon: Shield, label: "Security Scan", desc: "Check threats", action: () => toast.info("Coming soon!") },
            { icon: RefreshCw, label: "Update All", desc: "Check updates", action: () => toast.info("Coming soon!") },
          ].map((action) => (
            <button
              key={action.label}
              onClick={action.action}
              className="group flex items-center gap-4 rounded-xl border-2 border-border bg-card p-4 shadow-card transition-all duration-300 hover:border-primary hover:shadow-glow"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:gradient-primary group-hover:text-primary-foreground group-hover:shadow-glow">
                <action.icon className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="font-bold text-foreground">{action.label}</p>
                <p className="text-sm text-muted-foreground">{action.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Search & Filter */}
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
                    placeholder="Search system tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12"
                    />
                </div>
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool, index) => (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              className="system-card group rounded-xl p-5 text-left shadow-card animate-slide-up disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ animationDelay: `${index * 50}ms` }}
              disabled={tool.status === 'inactive'}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:gradient-primary group-hover:text-primary-foreground group-hover:shadow-glow group-hover:scale-110">
                  <tool.icon className="h-7 w-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                     <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                      {tool.name}
                    </h3>
                    <span className={`h-2.5 w-2.5 rounded-full ${tool.status === 'active' ? 'bg-success' : 'bg-amber-500'}`} />
                  </div>
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
      </div>
  );
}
