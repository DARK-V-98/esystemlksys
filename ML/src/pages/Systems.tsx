import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
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
  Activity
} from "lucide-react";

const systemTools = [
  // Disk & Storage
  { id: 1, name: "Disk Cleaner", description: "Remove junk files and free up disk space", icon: Trash2, category: "Storage", status: "active" },
  { id: 2, name: "Disk Analyzer", description: "Visualize disk usage and find large files", icon: HardDrive, category: "Storage", status: "active" },
  { id: 3, name: "Duplicate Finder", description: "Find and remove duplicate files", icon: FolderOpen, category: "Storage", status: "active" },
  { id: 4, name: "Disk Defragmenter", description: "Optimize disk performance", icon: Database, category: "Storage", status: "active" },
  
  // Performance
  { id: 5, name: "RAM Optimizer", description: "Free up memory and boost performance", icon: MemoryStick, category: "Performance", status: "active" },
  { id: 6, name: "Startup Manager", description: "Control programs that run at startup", icon: Rocket, category: "Performance", status: "active" },
  { id: 7, name: "Process Manager", description: "Monitor and manage running processes", icon: Activity, category: "Performance", status: "active" },
  { id: 8, name: "CPU Monitor", description: "Real-time CPU usage monitoring", icon: Cpu, category: "Performance", status: "active" },
  { id: 9, name: "Performance Boost", description: "One-click system optimization", icon: Zap, category: "Performance", status: "active" },
  
  // System Info
  { id: 10, name: "System Info", description: "View detailed system specifications", icon: Monitor, category: "Info", status: "active" },
  { id: 11, name: "Temperature Monitor", description: "Track CPU and GPU temperatures", icon: Thermometer, category: "Info", status: "active" },
  { id: 12, name: "Battery Health", description: "Check battery status and health", icon: Battery, category: "Info", status: "active" },
  { id: 13, name: "Network Info", description: "View network configuration and status", icon: Wifi, category: "Info", status: "active" },
  
  // Maintenance
  { id: 14, name: "Registry Cleaner", description: "Clean and repair Windows registry", icon: Server, category: "Maintenance", status: "active" },
  { id: 15, name: "Driver Updater", description: "Check and update system drivers", icon: RefreshCw, category: "Maintenance", status: "active" },
  { id: 16, name: "Security Scanner", description: "Scan for security vulnerabilities", icon: Shield, category: "Maintenance", status: "active" },
  { id: 17, name: "Scheduled Tasks", description: "Manage Windows scheduled tasks", icon: Clock, category: "Maintenance", status: "active" },
  { id: 18, name: "Benchmark Test", description: "Test your system performance", icon: Gauge, category: "Maintenance", status: "active" },
];

const categories = ["All", "Storage", "Performance", "Info", "Maintenance"];

export default function Systems() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTools = systemTools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout>
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
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { icon: Trash2, label: "Quick Clean", desc: "Free up space", action: "clean" },
            { icon: Zap, label: "Boost PC", desc: "Optimize now", action: "boost" },
            { icon: Shield, label: "Security Scan", desc: "Check threats", action: "scan" },
            { icon: RefreshCw, label: "Update All", desc: "Check updates", action: "update" },
          ].map((action) => (
            <button
              key={action.action}
              className="group flex items-center gap-4 rounded-xl border-2 border-border bg-card p-4 shadow-card transition-all duration-300 hover:border-primary hover:shadow-glow"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:gradient-primary group-hover:text-primary-foreground group-hover:shadow-glow">
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
              className="system-card group rounded-xl p-5 text-left shadow-card animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:gradient-primary group-hover:text-primary-foreground group-hover:shadow-glow group-hover:scale-110">
                  <tool.icon className="h-7 w-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                      {tool.name}
                    </h3>
                    <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
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

        {/* Footer */}
        <div className="rounded-xl bg-secondary p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by <span className="font-black text-gradient">ESYSTEMLK</span> • System Utilities
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
