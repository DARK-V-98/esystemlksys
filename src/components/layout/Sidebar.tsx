'use client';
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  Wrench, 
  Monitor, 
  Globe, 
  Settings, 
  Cpu,
  Menu,
  PlayCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const menuItems = [
  { icon: Wrench, label: "Tools", path: "/tools" },
  { icon: Monitor, label: "Systems", path: "/systems" },
  { icon: PlayCircle, label: "Media", path: "/media" },
  { icon: Globe, label: "Websites", path: "/websites" },
  { icon: Settings, label: "Management", path: "/management" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-20 items-center border-b border-sidebar-border px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-primary shadow-glow animate-pulse-glow p-1">
            <Image src="/logo.png" alt="ESYSTEMLK Logo" width={36} height={36} />
          </div>
          <div>
            <h1 className="text-xl font-black text-gradient">ESYSTEMLK</h1>
            <p className="text-xs font-medium text-muted-foreground">Multipurpose System</p>
          </div>
        </div>
      </div>

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
    </div>
  );

  if (isMobile) {
    return (
      <>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-card/80 backdrop-blur-sm">
          <Menu className="h-6 w-6 text-foreground" />
        </button>
        {isSidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/60 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <aside className={cn(
          "md:hidden fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar shadow-card transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <SidebarContent />
        </aside>
      </>
    )
  }

  return (
    <aside className="hidden md:block fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar shadow-card">
      <SidebarContent />
    </aside>
  );
}
