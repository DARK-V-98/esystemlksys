'use client';
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  Wrench, 
  Monitor, 
  Globe, 
  Settings, 
  Menu,
  PlayCircle,
  Sparkles,
  Receipt,
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Wrench, label: "Tools", path: "/tools" },
  { icon: Monitor, label: "Systems", path: "/systems" },
  { icon: PlayCircle, label: "Media", path: "/media" },
  { icon: Sparkles, label: "Advanced Tools", path: "/advanced-tools" },
  { icon: Receipt, label: "My Invoices", path: "/my-bills" },
  { icon: Globe, label: "Websites", path: "/websites", count: "Coming" },
  { icon: Settings, label: "Management", path: "/management", count: "Coming" },
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
    <div className="flex h-full flex-col bg-sidebar">
      {/* Logo */}
      <Link href="/dashboard" className="flex h-20 items-center border-b border-sidebar-border px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-primary shadow-glow p-1">
            <Image src="/logo.png" alt="ESYSTEMLK Logo" width={36} height={36} />
          </div>
          <div>
            <h1 className="text-xl font-black text-gradient">ESYSTEMLK</h1>
            <p className="text-xs font-medium text-muted-foreground">E central system V 1.1</p>
          </div>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Main Menu
        </p>
        {menuItems.map((item) => {
          const isActive = (item.path === '/dashboard' && pathname === item.path) || (item.path !== '/dashboard' && pathname.startsWith(item.path));
          const linkPath = item.count === 'Coming' 
            ? `/coming-soon?title=${item.label}`
            : item.path;
          return (
            <Link
              key={item.path}
              href={linkPath}
              onClick={() => isMobile && setSidebarOpen(false)}
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
          <div className="rounded-lg bg-secondary p-3 text-center">
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

  if (isMobile) {
    return (
      <>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="md:hidden fixed top-12 left-4 z-50 p-2 rounded-md bg-card/80 backdrop-blur-sm">
          <Menu className="h-6 w-6 text-foreground" />
        </button>
        {isSidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/60 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <aside className={cn(
          "md:hidden fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-card shadow-lg transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <SidebarContent />
        </aside>
      </>
    )
  }

  return (
    <aside className="hidden md:block fixed left-0 top-10 z-40 h-[calc(100vh-2.5rem)] w-64 border-r border-sidebar-border bg-card">
      <SidebarContent />
    </aside>
  );
}
