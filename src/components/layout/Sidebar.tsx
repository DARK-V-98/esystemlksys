'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Wrench, 
  Monitor, 
  Globe, 
  Settings, 
  Home,
  LogOut,
  Cpu,
  User,
  Shield,
  Mail,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "@/firebase/config";

const menuItems = [
  { icon: Wrench, label: "Tools", path: "/tools" },
  { icon: Monitor, label: "Systems", path: "/systems" },
  { icon: Globe, label: "Websites", path: "/websites" },
  { icon: Settings, label: "Management", path: "/management" },
];

interface SidebarProps {
  onLogout: () => void;
}

export function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email);
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
          localStorage.setItem("userRole", userDoc.data().role);
        }
        localStorage.setItem("userEmail", user.email || '');
      } else {
        setUserEmail(null);
        setUserRole(null);
      }
    });

    // Check local storage on initial load
    setUserEmail(localStorage.getItem('userEmail'));
    setUserRole(localStorage.getItem('userRole'));

    return () => unsubscribe();
  }, []);

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar shadow-card">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center border-b border-sidebar-border px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-primary shadow-glow animate-pulse-glow">
              <Cpu className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gradient">ESYSTEMLK</h1>
              <p className="text-xs font-medium text-muted-foreground">Multipurpose System</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        {userEmail && (
            <div className="border-b border-sidebar-border p-4">
                <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    User Profile
                </p>
                <div className="flex items-center gap-3 rounded-xl bg-secondary p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-primary-foreground shadow-glow">
                        <User className="h-5 w-5" />
                    </div>
                    <div className="truncate">
                        <p className="truncate text-sm font-bold text-foreground">{userEmail}</p>
                        <p className="text-xs font-medium text-muted-foreground capitalize flex items-center gap-1.5">
                            <Shield className="h-3 w-3 text-success"/>
                            {userRole || 'User'}
                        </p>
                    </div>
                </div>
            </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Main Menu
          </p>
          <Link
                href="/dashboard"
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-200",
                  pathname === "/dashboard"
                    ? "gradient-primary text-primary-foreground shadow-glow"
                    : "text-foreground hover:bg-secondary hover:text-primary"
                )}
              >
                <Menu className="h-5 w-5" />
                Main Menu
              </Link>
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.path);
            const linkPath = item.count === 'Coming' 
              ? `/coming-soon?title=${item.label}`
              : item.path;
            return (
              <Link
                key={item.path}
                href={linkPath}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "gradient-primary text-primary-foreground shadow-glow"
                    : "text-foreground hover:bg-secondary hover:text-primary"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
