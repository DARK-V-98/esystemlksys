'use client';
import { MainLayout } from "@/components/layout/MainLayout";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, serverTimestamp, updateDoc } from "firebase/firestore";
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
        const db = getFirestore(app);
        
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is authenticated via Firebase
                if (localStorage.getItem("isAuthenticated") !== "true") {
                    localStorage.setItem("isAuthenticated", "true");
                }
                
                // Update last active timestamp
                const userDocRef = doc(db, 'users', user.uid);
                await updateDoc(userDocRef, { lastActive: serverTimestamp() });

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

        return () => {
            unsubscribe();
        };
    }, [router]);

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black">
                <Cpu className="h-16 w-16 text-primary animate-spin"/>
            </div>
        );
    }

    return (
        <MainLayout>
            {children}
        </MainLayout>
    );
}
