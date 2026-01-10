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
        localStorage.clear();
        router.push("/auth");
    } catch (error) {
        console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col pt-10 md:pl-64">
        <main className="flex-grow">
            {children}
        </main>
      </div>
    </div>
  );
}
