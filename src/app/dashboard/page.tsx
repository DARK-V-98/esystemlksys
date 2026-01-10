'use client';
import Link from "next/link";
import { 
  Wrench, 
  Monitor, 
  Globe, 
  Settings, 
  ArrowRight,
  Cpu,
  HardDrive,
  Zap,
  Users,
  User,
  Shield,
  LogOut,
  PlayCircle,
  Menu,
  UserCog,
  Sparkles,
  Receipt
} from "lucide-react";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User as FirebaseUser, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PingMonitor from "@/components/PingMonitor";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";


const menuCards = [
  {
    icon: Wrench,
    title: "Tools",
    description: "File converters, text utilities, image editors",
    path: "/tools",
  },
  {
    icon: Monitor,
    title: "Systems",
    description: "Access POS, Inventory, and other business systems",
    path: "/systems",
  },
  {
    icon: PlayCircle,
    title: "Media Player",
    description: "Play local audio and video files",
    path: "/media",
  },
  {
    icon: Sparkles,
    title: "Advanced Tools",
    description: "Specialized utilities like the Bill Generator",
    path: "/advanced-tools",
  },
   {
    icon: Receipt,
    title: "My Invoices",
    description: "View and manage your saved invoices",
    path: "/my-bills",
  },
  {
    icon: Globe,
    title: "Websites",
    description: "SEO tools, web scrapers, meta analyzers",
    path: "/websites",
    count: "Coming"
  },
  {
    icon: Settings,
    title: "Management",
    description: "Account settings, preferences, usage stats",
    path: "/management",
    count: "Coming"
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const isPrivileged = userRole === 'admin' || userRole === 'developer';

  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    setUser(currentUser);
    if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const role = userDoc.data().role;
            setUserRole(role);
            localStorage.setItem("userRole", role);
        }
    } else {
        setUserRole(null);
        router.push('/auth');
    }
    });

    // Check local storage on initial load
    setUserRole(localStorage.getItem('userRole'));
    
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    const auth = getAuth(app);
    try {
        await signOut(auth);
        localStorage.clear();
        router.push("/auth");
    } catch (error) {
        console.error("Logout failed:", error);
    }
  };


  return (
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="relative overflow-hidden gradient-dark p-6 md:p-8 rounded-lg">
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
            <div className="relative flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-5 w-5 text-primary" />
                        <span className="text-sm font-semibold text-primary">MULTIPURPOSE SYSTEM</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-primary-foreground">
                        Welcome back, <span className="text-primary neon-text">{user?.displayName || 'User'}</span>
                    </h1>
                    <p className="mt-2 text-primary-foreground/70 text-base md:text-lg">
                        Your complete PC toolkit is ready. Select a category to get started.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                  <PingMonitor />
                  <ThemeSwitcher />
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                      <Button
                          variant="outline"
                          size="icon"
                          className="overflow-hidden rounded-full h-12 w-12 gradient-primary text-primary-foreground shadow-glow"
                      >
                          <User className="h-6 w-6" />
                      </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-64">
                      <DropdownMenuLabel>
                          <p className="font-bold truncate">{user?.displayName || user?.email}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground font-normal">
                              <Shield className="h-3 w-3 text-success"/>
                              <span className="capitalize">{userRole || 'User'}</span>
                          </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {isPrivileged && (
                        <DropdownMenuItem onClick={() => router.push('/admin/dashboard')} className="cursor-pointer">
                            <UserCog className="mr-2 h-4 w-4" />
                            Switch to Admin
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                      </DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
                </div>
            </div>
        </div>
        <div className="bg-card rounded-lg border shadow-sm p-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {menuCards.map((card, index) => (
                <Link
                    key={card.path}
                    href={card.count === 'Coming' ? `/coming-soon?title=${card.title}` : card.path}
                    className="group animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <div className="system-card rounded-xl p-4 shadow-card h-full flex flex-col items-center justify-center text-center aspect-square">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg gradient-primary shadow-glow transition-all duration-300 group-hover:shadow-glow-intense group-hover:scale-110">
                            <card.icon className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h3 className="mt-3 text-base font-bold text-foreground group-hover:text-primary transition-colors">
                            {card.title}
                        </h3>
                    </div>
                </Link>
                ))}
            </div>
        </div>
        <div className="mt-4 flex justify-center">
            <div className="rounded-lg bg-secondary p-3 text-center w-full max-w-sm">
                <p className="text-xs text-muted-foreground">
                Powered by
                </p>
                <p className="text-sm font-black text-gradient">ESYSTEMLK</p>
                <a href="https://www.esystemlk.xyz" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    www.esystemlk.xyz
                </a>
            </div>
        </div>
      </div>
  );
}
