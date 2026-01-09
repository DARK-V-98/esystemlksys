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
  Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { app } from "@/firebase/config";

const menuCards = [
  {
    icon: Wrench,
    title: "Tools",
    description: "PDF tools, file converters, text utilities, image editors",
    path: "/tools",
    count: "20+",
  },
  {
    icon: Monitor,
    title: "Systems",
    description: "PC optimization, disk cleanup, RAM boost, system info",
    path: "/systems",
    count: "18+",
  },
  {
    icon: Globe,
    title: "Websites",
    description: "SEO tools, web scrapers, meta analyzers, site generators",
    path: "/websites",
    count: "Coming",
  },
  {
    icon: Settings,
    title: "Management",
    description: "Account settings, preferences, usage stats, admin tools",
    path: "/management",
    count: "Coming",
  },
];

const stats = [
  { icon: Wrench, label: "Total Tools", value: "38+", color: "text-primary" },
  { icon: Cpu, label: "Categories", value: "4" },
  { icon: HardDrive, label: "File Formats", value: "50+" },
  { icon: Users, label: "Active Users", value: "1" },
];

export default function DashboardPage() {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (user) {
        setUserName(user.displayName || user.email?.split('@')[0] || "User");
    } else {
        setUserName(localStorage.getItem("userName") || "User");
    }
  }, []);

  return (
      <div className="flex flex-col">
        <div className="flex-grow space-y-8 animate-fade-in">
          {/* Header */}
          <div className="relative overflow-hidden rounded-2xl gradient-dark p-8">
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold text-primary">MULTIPURPOSE SYSTEM</span>
              </div>
              <h1 className="text-4xl font-black text-primary-foreground">
                Welcome back, <span className="text-primary neon-text">{userName}</span>
              </h1>
              <p className="mt-2 text-primary-foreground/70 text-lg">
                Your complete PC toolkit is ready. Select a category to get started.
              </p>
            </div>
          </div>

          {/* Menu Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {menuCards.map((card, index) => (
              <Link
                key={card.path}
                href={card.count === 'Coming' ? `/coming-soon?title=${card.label}` : card.path}
                className="group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="system-card rounded-2xl p-6 shadow-card">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow transition-all duration-300 group-hover:shadow-glow-intense group-hover:scale-110">
                        <card.icon className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {card.title}
                        </h3>
                        <p className="mt-1 text-muted-foreground">
                          {card.description}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full gradient-primary px-4 py-1.5 text-sm font-bold text-primary-foreground shadow-glow">
                      {card.count}
                    </span>
                  </div>

                  <div className="mt-6 flex items-center text-sm font-bold text-primary">
                    <span>Explore {card.title}</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="rounded-xl border-2 border-border bg-card p-5 text-center shadow-card transition-all duration-300 hover:border-primary hover:shadow-glow animate-slide-up"
                style={{ animationDelay: `${(index + 4) * 100}ms` }}
              >
                <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color || 'text-muted-foreground'}`} />
                <p className="text-3xl font-black text-gradient">{stat.value}</p>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
  );
}
