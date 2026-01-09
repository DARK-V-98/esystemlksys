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
  PlayCircle
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
    count: "20+",
  },
  {
    icon: Monitor,
    title: "Systems",
    description: "PC optimization, disk cleanup, RAM boost",
    path: "/systems",
    count: "18+",
  },
  {
    icon: PlayCircle,
    title: "Media Player",
    description: "Play local audio and video files",
    path: "/media",
    count: "New",
  },
  {
    icon: Globe,
    title: "Websites",
    description: "SEO tools, web scrapers, meta analyzers",
    path: "/websites",
    count: "Coming",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

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
    }
    });

    // Check local storage on initial load
    setUserRole(localStorage.getItem('userRole'));
    
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth(app);
    try {
        await signOut(auth);
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        router.push("/auth");
    } catch (error) {
        console.error("Logout failed:", error);
    }
  };


  return (
      <div className="flex flex-col">
        <div className="flex-grow space-y-8 animate-fade-in">
          {/* Header */}
          <div className="relative overflow-hidden rounded-2xl gradient-dark p-6 md:p-8">
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
                      <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                      </DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
                </div>
            </div>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {menuCards.map((card, index) => (
              <Link
                key={card.path}
                href={card.count === 'Coming' ? `/coming-soon?title=${card.title}` : card.path}
                className="group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="system-card rounded-2xl p-6 shadow-card h-full flex flex-col items-center justify-center text-center aspect-square">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl gradient-primary shadow-glow transition-all duration-300 group-hover:shadow-glow-intense group-hover:scale-110">
                        <card.icon className="h-10 w-10 text-primary-foreground" />
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {card.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {card.description}
                    </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
  );
}
