'use client';
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useRouter } from "next/navigation";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar onLogout={handleLogout} />
      <main className="pl-64">
        <div className="min-h-screen p-6">{children}</div>
      </main>
    </div>
  );
}
