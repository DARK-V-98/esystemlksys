'use client';
import { useState, useEffect, useMemo } from "react";
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
  Loader2,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, AreaChart, Area } from 'recharts';


const systemTools = [
  // Disk & Storage
  { id: 1, name: "Disk Cleaner", description: "Remove junk files and free up disk space", icon: Trash2, category: "Storage", status: "active" },
  { id: 2, name: "Disk Analyzer", description: "Visualize disk usage and find large files", icon: HardDrive, category: "Storage", status: "inactive" },
  { id: 3, name: "Duplicate Finder", description: "Find and remove duplicate files", icon: FolderOpen, category: "Storage", status: "inactive" },
  { id: 4, name: "Disk Defragmenter", description: "Optimize disk performance", icon: Database, category: "Storage", status: "inactive" },
  
  // Performance
  { id: 5, name: "RAM Optimizer", description: "Free up memory and boost performance", icon: MemoryStick, category: "Performance", status: "active" },
  { id: 6, name: "Startup Manager", description: "Control programs that run at startup", icon: Rocket, category: "Performance", status: "inactive" },
  { id: 7, name: "CPU Monitor", description: "Real-time CPU usage monitoring", icon: Cpu, category: "Performance", status: "active" },
  { id: 8, name: "Performance Boost", description: "One-click system optimization", icon: Zap, category: "Performance", status: "inactive" },
  
  // System Info
  { id: 10, name: "System Info", description: "View detailed system specifications", icon: Monitor, category: "Info", status: "inactive" },
  { id: 11, name: "Temperature Monitor", description: "Track CPU and GPU temperatures", icon: Thermometer, category: "Info", status: "active" },
  { id: 12, name: "Battery Health", description: "Check battery status and health", icon: Battery, category: "Info", status: "inactive" },
  { id: 13, name: "Network Info", description: "View network configuration and status", icon: Wifi, category: "Info", status: "inactive" },
  
  // Maintenance
  { id: 14, name: "Registry Cleaner", description: "Clean and repair Windows registry", icon: Server, category: "Maintenance", status: "inactive" },
  { id: 15, name: "Driver Updater", description: "Check and update system drivers", icon: RefreshCw, category: "Maintenance", status: "inactive" },
  { id: 16, name: "Security Scanner", description: "Scan for security vulnerabilities", icon: Shield, category: "Maintenance", status: "active" },
  { id: 17, name: "Scheduled Tasks", description: "Manage Windows scheduled tasks", icon: Clock, category: "Maintenance", status: "inactive" },
  { id: 18, name: "Benchmark Test", description: "Test your system performance", icon: Gauge, category: "Maintenance", status: "inactive" },
];

const categories = ["All", "Storage", "Performance", "Info", "Maintenance"];

type Tool = typeof systemTools[0];

const ToolWrapper = ({ title, icon: Icon, children }: { title: string, icon: React.ElementType, children: React.ReactNode }) => (
    <Card className="col-span-1 sm:col-span-2 lg:col-span-3 border-primary/50 shadow-glow animate-fade-in">
        <CardHeader>
            <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl gradient-primary text-primary-foreground">
                    <Icon className="h-7 w-7" />
                </div>
                <div>
                    <CardTitle className="text-xl font-bold text-foreground">{title}</CardTitle>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
    </Card>
);

const DiskCleaner = ({ onFinish }: { onFinish: () => void }) => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("Scanning for junk files...");
    const [filesCleaned, setFilesCleaned] = useState(0);
    const [spaceFreed, setSpaceFreed] = useState(0);
    const [isCleaning, setIsCleaning] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + Math.random() * 10;
                if (newProgress >= 100) {
                    clearInterval(interval);
                    setStatus("Cleaning complete!");
                    setIsCleaning(false);
                    toast.success(`Disk Cleaned! Freed ${(spaceFreed / 1024).toFixed(2)} GB of space.`);
                    return 100;
                }
                if (newProgress > 20 && newProgress < 80) {
                    setStatus("Removing temporary files...");
                    setFilesCleaned(f => f + Math.floor(Math.random() * 50));
                    setSpaceFreed(s => s + Math.random() * 100);
                } else if (newProgress >= 80) {
                    setStatus("Clearing system cache...");
                }
                return newProgress;
            });
        }, 300);

        return () => clearInterval(interval);
    }, [spaceFreed]);

    return (
        <ToolWrapper title="Disk Cleaner" icon={Trash2}>
            <p className="text-muted-foreground mb-4">{status}</p>
            <Progress value={progress} className="w-full mb-4 h-3" />
            <div className="flex justify-between items-center text-sm text-muted-foreground mb-6">
                <span>{filesCleaned} files cleaned</span>
                <span>{(spaceFreed / 1024).toFixed(2)} GB freed</span>
            </div>
            <div className="text-right">
                <Button onClick={onFinish} disabled={isCleaning}>
                    {isCleaning ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CheckCircle className="mr-2 h-4 w-4" />}
                    {isCleaning ? 'Cleaning...' : 'Finish'}
                </Button>
            </div>
        </ToolWrapper>
    );
};

const RamOptimizer = ({ onFinish }: { onFinish: () => void }) => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("Analyzing memory usage...");
    const [ramFreed, setRamFreed] = useState(0);
    const [isOptimizing, setIsOptimizing] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + Math.random() * 15;
                if (newProgress >= 100) {
                    clearInterval(interval);
                    setStatus("Memory optimization complete!");
                    setIsOptimizing(false);
                    toast.success(`RAM Optimized! Freed ${ramFreed.toFixed(0)} MB.`);
                    return 100;
                }
                if (newProgress > 30) {
                    setStatus("Closing background processes...");
                    setRamFreed(f => f + Math.random() * 50);
                }
                return newProgress;
            });
        }, 400);

        return () => clearInterval(interval);
    }, [ramFreed]);

    return (
        <ToolWrapper title="RAM Optimizer" icon={MemoryStick}>
            <p className="text-muted-foreground mb-4">{status}</p>
            <Progress value={progress} className="w-full mb-4 h-3" />
            <div className="text-center text-lg font-bold text-primary mb-6">
                {ramFreed.toFixed(0)} MB Freed
            </div>
            <div className="text-right">
                <Button onClick={onFinish} disabled={isOptimizing}>
                    {isOptimizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CheckCircle className="mr-2 h-4 w-4" />}
                    {isOptimizing ? 'Optimizing...' : 'Finish'}
                </Button>
            </div>
        </ToolWrapper>
    );
};

const CpuMonitor = ({ onFinish }: { onFinish: () => void }) => {
    const [data, setData] = useState(() =>
        Array.from({ length: 10 }, (_, i) => ({ name: `T-${10-i}`, usage: Math.random() * 20 + 5 }))
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setData(prevData => {
                const newData = [...prevData.slice(1), { name: `T-${0}`, usage: Math.random() * 40 + 10 }];
                return newData.map((d, i) => ({...d, name: `T-${10-i}`}));
            });
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <ToolWrapper title="CPU Monitor" icon={Cpu}>
            <div className="h-[200px] w-full">
                <ResponsiveContainer>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}/>
                        <Area type="monotone" dataKey="usage" stroke="hsl(var(--primary))" fill="url(#colorUsage)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <div className="text-right mt-6">
                <Button onClick={onFinish}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
            </div>
        </ToolWrapper>
    );
};

const TemperatureMonitor = ({ onFinish }: { onFinish: () => void }) => {
    const [temp, setTemp] = useState(45);

    useEffect(() => {
        const interval = setInterval(() => {
            setTemp(t => t + (Math.random() - 0.5) * 2);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const tempColor = temp > 80 ? 'text-destructive' : temp > 60 ? 'text-warning' : 'text-success';

    return (
        <ToolWrapper title="Temperature Monitor" icon={Thermometer}>
            <div className="flex flex-col items-center justify-center gap-4 h-[200px]">
                <div className={`text-7xl font-bold font-mono ${tempColor}`}>
                    {temp.toFixed(1)}°C
                </div>
                <p className="text-muted-foreground">CPU Core Temperature</p>
            </div>
            <div className="text-right mt-6">
                <Button onClick={onFinish}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
            </div>
        </ToolWrapper>
    );
};

const SecurityScanner = ({ onFinish }: { onFinish: () => void }) => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("Starting security scan...");
    const [filesScanned, setFilesScanned] = useState(0);
    const [threatsFound, setThreatsFound] = useState(0);
    const [isScanning, setIsScanning] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + Math.random() * 5;
                if (newProgress >= 100) {
                    clearInterval(interval);
                    setStatus(threatsFound > 0 ? "Scan complete. Threats found!" : "Scan complete. No threats found.");
                    setIsScanning(false);
                    if (threatsFound > 0) {
                      toast.error(`${threatsFound} potential threats found!`);
                    } else {
                      toast.success("System is secure. No threats found.");
                    }
                    return 100;
                }
                setStatus(`Scanning file: C:\\Windows\\System32\\${Math.random().toString(36).substring(7)}.dll`);
                setFilesScanned(f => f + Math.floor(Math.random() * 100));
                if (Math.random() < 0.01) {
                    setThreatsFound(t => t + 1);
                }
                return newProgress;
            });
        }, 100);
        return () => clearInterval(interval);
    }, [threatsFound]);

    return (
        <ToolWrapper title="Security Scanner" icon={Shield}>
            <p className="text-muted-foreground mb-4 truncate">{status}</p>
            <Progress value={progress} className="w-full mb-4 h-3" />
            <div className="flex justify-between items-center text-sm text-muted-foreground mb-6">
                <span>{filesScanned} files scanned</span>
                <span className={threatsFound > 0 ? 'text-destructive font-bold' : 'text-success font-bold'}>
                    {threatsFound} threats found
                </span>
            </div>
            <div className="text-right">
                <Button onClick={onFinish} disabled={isScanning}>
                    {isScanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CheckCircle className="mr-2 h-4 w-4" />}
                    {isScanning ? 'Scanning...' : 'Finish'}
                </Button>
            </div>
        </ToolWrapper>
    );
};


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

  const renderActiveTool = () => {
    if (!activeTool) return null;
    switch (activeTool.id) {
        case 1:
            return <DiskCleaner onFinish={() => setActiveTool(null)} />;
        case 5:
            return <RamOptimizer onFinish={() => setActiveTool(null)} />;
        case 7:
            return <CpuMonitor onFinish={() => setActiveTool(null)} />;
        case 11:
            return <TemperatureMonitor onFinish={() => setActiveTool(null)} />;
        case 16:
            return <SecurityScanner onFinish={() => setActiveTool(null)} />;
        default:
            return null;
    }
  };

  if (activeTool) {
    return (
        <div className="space-y-6 animate-fade-in">
            {renderActiveTool()}
        </div>
    );
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredTools.map((tool, index) => (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              className="system-card group rounded-xl p-5 text-left shadow-card animate-slide-up disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ animationDelay: `${index * 50}ms` }}
              disabled={tool.status === 'inactive'}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:gradient-primary group-hover:text-primary-foreground group-hover:shadow-glow group-hover:scale-110">
                  <tool.icon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                     <h3 className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                      {tool.name}
                    </h3>
                    <span className={`h-2.5 w-2.5 rounded-full ${tool.status === 'active' ? 'bg-success' : 'bg-amber-500'} group-disabled:bg-muted-foreground`} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                    {tool.description}
                  </p>
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
