import { Link, useLocation } from "react-router-dom";
import { 
  Wrench, 
  Monitor, 
  Globe, 
  Settings, 
  Home,
  LogOut,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Wrench, label: "Tools", path: "/tools" },
  { icon: Monitor, label: "Systems", path: "/systems" },
  { icon: Globe, label: "Websites", path: "/websites" },
  { icon: Settings, label: "Management", path: "/management" },
];

interface SidebarProps {
  onLogout: () => void;
}

export function Sidebar({ onLogout }: SidebarProps) {
  const location = useLocation();

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

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Main Menu
          </p>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
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
          <div className="mt-4 rounded-lg bg-secondary p-3 text-center">
            <p className="text-xs text-muted-foreground">
              Powered by
            </p>
            <p className="text-sm font-black text-gradient">ESYSTEMLK</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
