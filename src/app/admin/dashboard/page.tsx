'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Zap,
  Shield,
  LogOut,
  User,
  SlidersHorizontal,
  Bell,
  UserCog
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '@/firebase/config';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

const adminMenuCards = [
  {
    icon: SlidersHorizontal,
    title: "Maintenance",
    description: "Toggle system maintenance mode",
    path: "/admin/maintenance",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Send system-wide notifications",
    path: "/admin/notifications",
  },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/auth');
        return;
      }
      setUser(currentUser);
      
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        setUserRole(role);
        if (!['admin', 'developer'].includes(role)) {
          router.push('/dashboard');
        }
      } else {
        router.push('/dashboard');
      }
    });
    
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
    <div className="flex flex-col gap-6 p-8">
      <div className="relative overflow-hidden gradient-dark p-6 md:p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-primary">ADMIN PANEL</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-primary-foreground">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-primary-foreground/70 text-base md:text-lg">
              Manage your application and users from here.
            </p>
          </div>
          <div className="flex items-center gap-4">
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
                <DropdownMenuItem onClick={() => router.push('/dashboard')} className="cursor-pointer">
                  <UserCog className="mr-2 h-4 w-4" />
                  Switch to User View
                </DropdownMenuItem>
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {adminMenuCards.map((card, index) => (
            <Link
              key={card.path}
              href={card.path}
              className="group animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="system-card rounded-xl p-6 shadow-card h-full flex flex-col items-center justify-center text-center aspect-square">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg gradient-primary shadow-glow transition-all duration-300 group-hover:shadow-glow-intense group-hover:scale-110">
                  <card.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {card.title}
                </h3>
                 <p className="mt-1 text-sm text-muted-foreground">{card.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
