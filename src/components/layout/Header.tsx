'use client';
import {
  LogOut,
  Menu,
  User,
  Shield,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "@/firebase/config";

interface HeaderProps {
    onLogout: () => void;
}

export function Header({ onLogout }: HeaderProps) {
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

    return (
        <header className="flex h-20 items-center justify-end border-b border-border px-6">
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
                <DropdownMenuItem onClick={onLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}
