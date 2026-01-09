'use client';
import { useState, useEffect } from 'react';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { app } from '@/firebase/config';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, ServerCrash, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';

export default function MaintenancePage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);
  const maintenanceRef = doc(db, 'app-status', 'maintenance');

  useEffect(() => {
    const unsubscribe = onSnapshot(maintenanceRef, (doc) => {
      if (doc.exists()) {
        setMaintenanceMode(doc.data().isUnderMaintenance);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [maintenanceRef]);

  const handleToggleMaintenance = async () => {
    const newStatus = !maintenanceMode;
    try {
      await setDoc(maintenanceRef, { isUnderMaintenance: newStatus });
      setMaintenanceMode(newStatus);
      toast.success(`Maintenance mode has been ${newStatus ? 'enabled' : 'disabled'}.`);
    } catch (error) {
      console.error("Error updating maintenance status:", error);
      toast.error("Failed to update maintenance status.");
    }
  };

  return (
    <div className="space-y-6 p-8 animate-fade-in">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <SlidersHorizontal className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Maintenance <span className="text-primary neon-text">Mode</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Control user access to the application during updates.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <Link href="/admin/dashboard" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Admin Dashboard</span>
        </Link>
        
        <div className="bg-secondary/50 border rounded-lg p-6 flex flex-col items-center text-center">
            <ServerCrash className={`h-16 w-16 mb-4 ${maintenanceMode ? 'text-destructive' : 'text-muted-foreground'}`} />
            <h2 className="text-2xl font-bold">System Maintenance Control</h2>
            <p className="text-muted-foreground mt-2 max-w-md">
                When enabled, only Administrators and Developers can access the application. Regular users will see a maintenance notice on the login page.
            </p>

            <div className="flex items-center space-x-3 mt-8 rounded-full border bg-card p-4">
                <Label htmlFor="maintenance-switch" className={`font-bold text-lg ${maintenanceMode ? 'text-destructive' : 'text-success'}`}>
                    {maintenanceMode ? 'MAINTENANCE ACTIVE' : 'SYSTEM ONLINE'}
                </Label>
                <Switch
                    id="maintenance-switch"
                    checked={maintenanceMode}
                    onCheckedChange={handleToggleMaintenance}
                    disabled={loading}
                    className="data-[state=checked]:bg-destructive data-[state=unchecked]:bg-success"
                />
            </div>
        </div>
      </div>
    </div>
  );
}
