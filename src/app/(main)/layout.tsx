'use client';
import { MainLayout } from "@/components/layout/MainLayout";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/firebase/config";
import { Cpu } from "lucide-react";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth(app);
        
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is authenticated via Firebase
                if (localStorage.getItem("isAuthenticated") !== "true") {
                    localStorage.setItem("isAuthenticated", "true");
                }
                setLoading(false);
            } else {
                // User is not authenticated via Firebase, check local storage as a fallback
                if (localStorage.getItem("isAuthenticated") === "true") {
                    // This state is inconsistent, let's log out properly
                    localStorage.removeItem("isAuthenticated");
                }
                router.push("/auth");
            }
        });

        // This handles the case where the page reloads and Firebase auth state is not yet determined.
        const isAuthenticated = localStorage.getItem("isAuthenticated");
        if (!isAuthenticated) {
            // If no local flag, we wait for Firebase to tell us, or redirect if it determines no user.
            // If Firebase is fast, it will set loading to false. If not, the onAuthStateChanged will handle it.
        } else {
            // If there's a local flag, we can probably show the UI, but still let Firebase be the source of truth.
            setLoading(false); 
        }

        // Disable right-click context menu
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };
        document.addEventListener('contextmenu', handleContextMenu);

        return () => {
            unsubscribe();
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [router]);

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black">
                <Cpu className="h-16 w-16 text-primary animate-spin"/>
            </div>
        );
    }

    return <MainLayout>{children}</MainLayout>;
}
