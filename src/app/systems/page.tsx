'use client';
import Link from "next/link";
import { 
  Monitor,
  ArrowLeft,
  ShoppingCart,
  Warehouse,
  Users,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const businessSystems = [
  { 
    id: 1, 
    name: "Point of Sale System", 
    description: "Manage sales, customers, and payments with ease.", 
    icon: ShoppingCart, 
    status: "active",
    path: "/systems/pos"
  },
  { 
    id: 2, 
    name: "Inventory Management", 
    description: "Track stock levels, orders, and suppliers.", 
    icon: Warehouse, 
    status: "inactive",
    path: "#"
  },
  { 
    id: 3, 
    name: "HRM System", 
    description: "Streamline payroll, attendance, and employee data.", 
    icon: Users, 
    status: "inactive",
    path: "#"
  },
  { 
    id: 4, 
    name: "E-commerce Platform", 
    description: "Build and manage your online store.", 
    icon: Store, 
    status: "inactive",
    path: "#"
  },
];

export default function SystemsPage() {

  const handleInactiveClick = (systemName: string) => {
    toast.info("Coming soon!", {
      description: `The '${systemName}' system is under development.`
    });
  }

  return (
      <div className="space-y-6 animate-fade-in p-4 md:p-8">
        <div className="relative overflow-hidden p-6 md:p-8 gradient-dark rounded-lg">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense animate-pulse-glow">
              <Monitor className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-primary-foreground">
                ESYSTEMLK <span className="text-primary neon-text">Systems</span>
              </h1>
              <p className="mt-1 text-primary-foreground/70 text-sm md:text-base">
                Powerful, integrated software solutions to run your business.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border shadow-sm p-4 md:p-6 space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <Link href="/dashboard" className="flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
                    <ArrowLeft className="h-5 w-5" />
                    <span>Main Menu</span>
                </Link>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {businessSystems.map((system, index) => {
                const cardContent = (
                  <div 
                    key={system.id}
                    className={cn(
                      "system-card group rounded-2xl p-8 text-center shadow-card h-full flex flex-col items-center justify-center aspect-video animate-slide-up",
                      system.status === 'inactive' && 'cursor-pointer'
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={system.status === 'inactive' ? () => handleInactiveClick(system.name) : undefined}
                  >
                    <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 text-primary transition-all duration-300 group-hover:gradient-primary group-hover:text-primary-foreground group-hover:shadow-glow group-hover:scale-110">
                        <system.icon className="h-12 w-12" />
                    </div>
                    <h2 className="mt-6 text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{system.name}</h2>
                    <p className="mt-2 text-muted-foreground">{system.description}</p>
                  </div>
                );
                
                return system.status === 'active' ? (
                  <Link key={system.id} href={system.path || '#'}>
                    {cardContent}
                  </Link>
                ) : (
                  cardContent
                );
              })}
            </div>
        </div>
      </div>
  );
}