'use client';
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import { app } from "@/firebase/config";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();
  const auth = getAuth(app);

  const handleLogout = async () => {
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
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col pl-0 md:pl-64">
        <Header onLogout={handleLogout} />
        <main className="flex-grow p-6">
            {children}
        </main>
        <footer className="p-4 text-center">
            <div className="rounded-xl bg-secondary p-4 text-center">
                <p className="text-sm text-muted-foreground">
                    Powered by <span className="font-black text-gradient">ESYSTEMLK</span> • Multipurpose System
                </p>
            </div>
        </footer>
      </div>
    </div>
  );
}
