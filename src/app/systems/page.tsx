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
  ArrowLeft,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, AreaChart, Area } from 'recharts';
import { cn } from "@/lib/utils";


const systemTools = [
  // Disk & Storage
  { id: 1, name: "Disk Cleaner", description: "Remove junk files and free up disk space", icon: Trash2, category: "Storage", status: "active" },
  { id: 2, name: "Disk Analyzer", description: "Visualize disk usage and find large files", icon: HardDrive, category: "Storage", status: "active" },
  { id: 3, name: "Duplicate Finder", description: "Find and remove duplicate files", icon: FolderOpen, category: "Storage", status: "inactive" },
  { id: 4, name: "Disk Defragmenter", description: "Optimize disk performance", icon: Database, category: "Storage", status: "inactive" },
  
  // Performance
  { id: 5, name: "RAM Optimizer", description: "Free up memory and boost performance", icon: MemoryStick, category: "Performance", status: "active" },
  { id: 6, name: "Startup Manager", description: "Control programs that run at startup", icon: Rocket, category: "Performance", status: "active" },
  { id: 7, name: "CPU Monitor", description: "Real-time CPU usage monitoring", icon: Cpu, category: "Performance", status: "active" },
  { id: 8, name: "Performance Boost", description: "One-click system optimization", icon: Zap, category: "Performance", status: "active" },
  { id: 9, name: "Process Manager", description: "View and manage running processes", icon: Activity, category: "Performance", status: "active"},
  
  // System Info
  { id: 10, name: "System Info", description: "View detailed system specifications", icon: Monitor, category: "Info", status: "active" },
  { id: 11, name: "Temperature Monitor", description: "Track CPU and GPU temperatures", icon: Thermometer, category: "Info", status: "active" },
  { id: 12, name: "Battery Health", description: "Check battery status and health", icon: Battery, category: "Info", status: "active" },
  { id: 13, name: "Network Info", description: "View network configuration and status", icon: Wifi, category: "Info", status: "active" },
  
  // Maintenance
  { id: 14, name: "Registry Cleaner", description: "Clean and repair Windows registry", icon: Server, category: "Maintenance", status: "active" },
  { id: 15, name: "Driver Updater", description: "Check and update system drivers", icon: RefreshCw, category: "Maintenance", status: "active" },
  { id: 16, name: "Security Scanner", description: "Scan for security vulnerabilities", icon: Shield, category: "Maintenance", status: "active" },
  { id: 17, name: "Scheduled Tasks", description: "Manage Windows scheduled tasks", icon: Clock, category: "Maintenance", status: "inactive" },
  { id: 18, name: "Benchmark Test", description: "Test your system performance", icon: Gauge, category: "Maintenance", status: "active" },
];

const categories = ["All", "Storage", "Performance", "Info", "Maintenance"];

type Tool = typeof systemTools[0];

const ToolWrapper = ({ title, icon: Icon, children, onBack }: { title: string, icon: React.ElementType, children: React.ReactNode, onBack: () => void }) => (
    <Card className="col-span-1 sm:col-span-2 lg:col-span-3 border-primary/50 shadow-glow animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl gradient-primary text-primary-foreground">
                    <Icon className="h-7 w-7" />
                </div>
                <div>
                    <CardTitle className="text-xl font-bold text-foreground">{title}</CardTitle>
                </div>
            </div>
            <Button onClick={onBack} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tools
            </Button>
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
        <div>
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
        </div>
    );
};

const DiskAnalyzer = () => {
    const data = [
        { name: 'Media', size: 450, fill: 'hsl(var(--primary))' },
        { name: 'Apps', size: 250, fill: 'hsl(var(--primary) / 0.8)' },
        { name: 'Docs', size: 150, fill: 'hsl(var(--primary) / 0.6)' },
        { name: 'System', size: 100, fill: 'hsl(var(--primary) / 0.4)' },
        { name: 'Other', size: 50, fill: 'hsl(var(--primary) / 0.2)' },
    ];

    return (
        <div>
            <p className="text-muted-foreground mb-4">Total Disk Usage: 1TB</p>
            <div className="h-[250px] w-full">
                <ResponsiveContainer>
                    <BarChart data={data} layout="vertical">
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={80} />
                        <Tooltip cursor={{ fill: 'hsl(var(--secondary))' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} formatter={(value) => `${value} GB`}/>
                        <Bar dataKey="size" fill="hsl(var(--primary))" background={{ fill: 'hsl(var(--secondary))' }} radius={[4, 4, 4, 4]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
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
        <div>
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
        </div>
    );
};

const StartupManager = () => {
    const [startupItems, setStartupItems] = useState([
        { name: 'ESYSTEMLK Core Service', enabled: true },
        { name: 'Common Web Utilities', enabled: true },
        { name: 'Nvidia GeForce Experience', enabled: true },
        { name: 'Discord', enabled: false },
        { name: 'Steam', enabled: false },
    ]);

    const toggleItem = (index: number) => {
        setStartupItems(items => items.map((item, i) => i === index ? {...item, enabled: !item.enabled} : item));
    };

    return (
        <div className="space-y-3">
            {startupItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border bg-secondary/50 p-3">
                    <p className="font-medium">{item.name}</p>
                    <button onClick={() => toggleItem(index)} className="flex items-center gap-2 text-sm font-semibold">
                        {item.enabled ? <ToggleRight className="h-6 w-6 text-success" /> : <ToggleLeft className="h-6 w-6 text-muted-foreground" />}
                        <span className={cn(item.enabled ? 'text-success' : 'text-muted-foreground')}>{item.enabled ? 'Enabled' : 'Disabled'}</span>
                    </button>
                </div>
            ))}
        </div>
    );
};

const CpuMonitor = () => {
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
        <div className="h-[250px] w-full">
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
    );
};

const PerformanceBoost = ({ onFinish }: { onFinish: () => void }) => {
    const [boosts, setBoosts] = useState([
        { name: 'Defragmenting Memory', done: false },
        { name: 'Cleaning Temporary Files', done: false },
        { name: 'Optimizing Startup Apps', done: false },
        { name: 'Balancing Power Plan', done: false },
    ]);
    const [isBoosting, setIsBoosting] = useState(true);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index < boosts.length) {
                setBoosts(b => b.map((item, i) => i === index ? {...item, done: true} : item));
                index++;
            } else {
                clearInterval(interval);
                setIsBoosting(false);
                toast.success("Performance Boosted!");
            }
        }, 700);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <ul className="space-y-3 mb-6">
                {boosts.map((boost, index) => (
                    <li key={index} className="flex items-center gap-3">
                        {boost.done ? <CheckCircle className="h-5 w-5 text-success" /> : <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                        <span className={cn(boost.done ? "text-muted-foreground line-through" : "text-foreground")}>{boost.name}</span>
                    </li>
                ))}
            </ul>
            <div className="text-right">
                <Button onClick={onFinish} disabled={isBoosting}>
                    {isBoosting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CheckCircle className="mr-2 h-4 w-4" />}
                    {isBoosting ? 'Boosting...' : 'Finish'}
                </Button>
            </div>
        </div>
    );
};

const ProcessManager = () => {
    const [processes, setProcesses] = useState([
        { name: 'chrome.exe', cpu: 12.5, ram: 256.3 },
        { name: 'Code.exe', cpu: 8.2, ram: 512.1 },
        { name: 'explorer.exe', cpu: 2.1, ram: 128.5 },
        { name: 'svchost.exe', cpu: 0.5, ram: 64.2 },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setProcesses(procs => procs.map(p => ({
                ...p,
                cpu: Math.max(0.1, p.cpu + (Math.random() - 0.5) * 2),
                ram: Math.max(10, p.ram + (Math.random() - 0.5) * 10),
            })));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-muted-foreground px-3">
                <span>Process Name</span>
                <div className="flex gap-8">
                    <span>CPU %</span>
                    <span>RAM (MB)</span>
                </div>
            </div>
            {processes.map((proc) => (
                <div key={proc.name} className="flex justify-between rounded-lg p-3 hover:bg-secondary">
                    <span className="font-medium">{proc.name}</span>
                    <div className="flex gap-8 font-mono">
                        <span>{proc.cpu.toFixed(1)}%</span>
                        <span>{proc.ram.toFixed(1)}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

const SystemInfo = () => {
    const info = {
        'OS': 'Windows 11 Pro',
        'Processor': '12th Gen Intel(R) Core(TM) i9-12900K',
        'RAM': '64.0 GB',
        'Graphics Card': 'NVIDIA GeForce RTX 4090',
        'Mainboard': 'ASUS ROG STRIX Z690-E GAMING WIFI',
        'Storage': '2TB NVMe SSD',
    };

    return (
        <ul className="space-y-3">
            {Object.entries(info).map(([key, value]) => (
                <li key={key} className="flex justify-between border-b pb-2">
                    <span className="font-semibold text-muted-foreground">{key}</span>
                    <span className="font-medium text-foreground text-right">{value}</span>
                </li>
            ))}
        </ul>
    );
};

const TemperatureMonitor = () => {
    const [temp, setTemp] = useState(45);

    useEffect(() => {
        const interval = setInterval(() => {
            setTemp(t => t + (Math.random() - 0.5) * 2);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const tempColor = temp > 80 ? 'text-destructive' : temp > 60 ? 'text-warning' : 'text-success';

    return (
        <div className="flex flex-col items-center justify-center gap-4 h-[250px]">
            <div className={`text-7xl font-bold font-mono ${tempColor}`}>
                {temp.toFixed(1)}°C
            </div>
            <p className="text-muted-foreground">CPU Core Temperature</p>
        </div>
    );
};

const BatteryHealth = () => {
    const [battery, setBattery] = useState({ level: 92, health: 98, cycles: 124 });

    useEffect(() => {
        setBattery({
            level: Math.floor(Math.random() * 21) + 80,
            health: 98,
            cycles: 124,
        });
    }, []);

    return (
        <div className="grid grid-cols-3 gap-4 text-center h-[250px] items-center">
            <div>
                <p className="text-5xl font-bold text-success">{battery.level}%</p>
                <p className="text-muted-foreground">Charge</p>
            </div>
            <div>
                <p className="text-5xl font-bold text-primary">{battery.health}%</p>
                <p className="text-muted-foreground">Health</p>
            </div>
            <div>
                <p className="text-5xl font-bold text-foreground">{battery.cycles}</p>
                <p className="text-muted-foreground">Cycles</p>
            </div>
        </div>
    );
};

const NetworkInfo = () => {
    const [network, setNetwork] = useState({
        ip: "192.168.1.101",
        download: 125.8,
        upload: 45.2,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setNetwork(n => ({
                ...n,
                download: Math.max(10, n.download + (Math.random() - 0.5) * 10),
                upload: Math.max(5, n.upload + (Math.random() - 0.5) * 5),
            }));
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-4 h-[250px] flex flex-col justify-around">
            <div className="flex justify-between items-baseline">
                <span className="font-semibold text-muted-foreground">IP Address</span>
                <span className="font-mono text-lg">{network.ip}</span>
            </div>
            <div className="flex justify-between items-baseline">
                <span className="font-semibold text-muted-foreground">Download Speed</span>
                <span className="font-mono text-lg">{network.download.toFixed(1)} Mbps</span>
            </div>
            <div className="flex justify-between items-baseline">
                <span className="font-semibold text-muted-foreground">Upload Speed</span>
                <span className="font-mono text-lg">{network.upload.toFixed(1)} Mbps</span>
            </div>
        </div>
    );
};

const RegistryCleaner = ({ onFinish }: { onFinish: () => void }) => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("Scanning registry for issues...");
    const [issuesFound, setIssuesFound] = useState(0);
    const [isWorking, setIsWorking] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + Math.random() * 8;
                if (newProgress >= 100) {
                    clearInterval(interval);
                    setStatus(`${issuesFound} issues fixed successfully!`);
                    setIsWorking(false);
                    toast.success("Registry Cleaned!");
                    return 100;
                }
                if (newProgress > 50) setStatus("Fixing registry errors...");
                setIssuesFound(f => f + (Math.random() > 0.8 ? 1 : 0));
                return newProgress;
            });
        }, 250);

        return () => clearInterval(interval);
    }, [issuesFound]);

    return (
        <div>
            <p className="text-muted-foreground mb-4">{status}</p>
            <Progress value={progress} className="w-full mb-4 h-3" />
            <div className="text-center text-lg font-bold text-primary mb-6">
                {issuesFound} Issues Found & Fixed
            </div>
            <div className="text-right">
                <Button onClick={onFinish} disabled={isWorking}>
                    {isWorking ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CheckCircle className="mr-2 h-4 w-4" />}
                    {isWorking ? 'Working...' : 'Finish'}
                </Button>
            </div>
        </div>
    );
};

const DriverUpdater = ({ onFinish }: { onFinish: () => void }) => {
    const [drivers, setDrivers] = useState([
        { name: 'NVIDIA GeForce RTX 4090', upToDate: false },
        { name: 'Intel Bluetooth', upToDate: true },
        { name: 'Realtek Audio', upToDate: false },
    ]);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdate = (index: number) => {
        setIsUpdating(true);
        toast.info(`Updating ${drivers[index].name}...`);
        setTimeout(() => {
            setDrivers(d => d.map((driver, i) => i === index ? {...driver, upToDate: true} : driver));
            setIsUpdating(false);
            toast.success(`${drivers[index].name} updated successfully!`);
        }, 2000);
    };

    return (
        <div className="space-y-3">
            {drivers.map((driver, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border bg-secondary/50 p-3">
                    <div>
                        <p className="font-medium">{driver.name}</p>
                        <p className={cn("text-xs", driver.upToDate ? 'text-success' : 'text-warning')}>{driver.upToDate ? "Up to date" : "Update available"}</p>
                    </div>
                    <Button size="sm" onClick={() => handleUpdate(index)} disabled={driver.upToDate || isUpdating}>
                        {driver.upToDate ? <CheckCircle className="mr-2 h-4 w-4" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                        {driver.upToDate ? "Updated" : "Update"}
                    </Button>
                </div>
            ))}
        </div>
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
        <div>
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
        </div>
    );
};

const BenchmarkTest = ({ onFinish }: { onFinish: () => void }) => {
    const [cpuProgress, setCpuProgress] = useState(0);
    const [gpuProgress, setGpuProgress] = useState(0);
    const [isTesting, setIsTesting] = useState(true);

    useEffect(() => {
        setIsTesting(true);
        const cpuInterval = setInterval(() => setCpuProgress(p => Math.min(100, p + 5)), 200);
        setTimeout(() => {
            clearInterval(cpuInterval);
            const gpuInterval = setInterval(() => setGpuProgress(p => Math.min(100, p + 4)), 200);
            setTimeout(() => {
                clearInterval(gpuInterval);
                setIsTesting(false);
                toast.success("Benchmark Complete! Score: 18,542");
            }, 5000);
        }, 4000);

        return () => {
            clearInterval(cpuInterval);
        };
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <label className="text-sm font-medium">CPU Benchmark</label>
                <Progress value={cpuProgress} className="h-3 mt-2" />
            </div>
            <div>
                <label className="text-sm font-medium">GPU Benchmark</label>
                <Progress value={gpuProgress} className="h-3 mt-2" />
            </div>
            {!isTesting && (
                <div className="text-center pt-4 animate-fade-in">
                    <p className="text-muted-foreground">Final Score</p>
                    <p className="text-5xl font-bold text-primary">18,542</p>
                </div>
            )}
             <div className="text-right">
                <Button onClick={onFinish} disabled={isTesting}>
                    {isTesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CheckCircle className="mr-2 h-4 w-4" />}
                    {isTesting ? 'Testing...' : 'Finish'}
                </Button>
            </div>
        </div>
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
    const onFinish = () => setActiveTool(null);
    let toolComponent;
    
    switch (activeTool.id) {
        case 1: toolComponent = <DiskCleaner onFinish={onFinish} />; break;
        case 2: toolComponent = <DiskAnalyzer />; break;
        case 5: toolComponent = <RamOptimizer onFinish={onFinish} />; break;
        case 6: toolComponent = <StartupManager />; break;
        case 7: toolComponent = <CpuMonitor />; break;
        case 8: toolComponent = <PerformanceBoost onFinish={onFinish} />; break;
        case 9: toolComponent = <ProcessManager />; break;
        case 10: toolComponent = <SystemInfo />; break;
        case 11: toolComponent = <TemperatureMonitor />; break;
        case 12: toolComponent = <BatteryHealth />; break;
        case 13: toolComponent = <NetworkInfo />; break;
        case 14: toolComponent = <RegistryCleaner onFinish={onFinish} />; break;
        case 15: toolComponent = <DriverUpdater onFinish={onFinish} />; break;
        case 16: toolComponent = <SecurityScanner onFinish={onFinish} />; break;
        case 18: toolComponent = <BenchmarkTest onFinish={onFinish} />; break;
        default: return null;
    }
    
    return <ToolWrapper title={activeTool.name} icon={activeTool.icon} onBack={() => setActiveTool(null)}>{toolComponent}</ToolWrapper>;
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
        <div className="relative overflow-hidden gradient-dark p-8">
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
      </div>
  );
}

    