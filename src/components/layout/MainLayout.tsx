'use client';
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
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
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col md:pl-64">
        <main className="flex-grow p-4 sm:p-6 md:p-8">
            {children}
        </main>
      </div>
    </div>
  );
}
