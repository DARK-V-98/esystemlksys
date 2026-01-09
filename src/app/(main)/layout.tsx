'use client';
import { MainLayout } from "@/components/layout/MainLayout";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/firebase/config";

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
            if (!user) {
                // If there's no user, redirect to auth page.
                // This handles the case where a user signs out.
                router.push("/auth");
            } else {
                // If there is a user, we can stop loading.
                localStorage.setItem("isAuthenticated", "true");
                setLoading(false);
            }
        });

        // Also check local storage for initial fast check
        const isAuthenticated = localStorage.getItem("isAuthenticated");
        if (!isAuthenticated) {
            router.push("/auth");
        } else {
            setLoading(false);
        }

        return () => unsubscribe();
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
