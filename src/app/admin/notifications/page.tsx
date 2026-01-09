'use client';
import { useState } from 'react';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '@/firebase/config';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, Bell, Send } from 'lucide-react';
import Link from 'next/link';

export default function NotificationsPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const db = getFirestore(app);

  const handleSendNotification = async () => {
    if (!message.trim()) {
      toast.error('Notification message cannot be empty.');
      return;
    }
    setLoading(true);
    try {
      const notificationsRef = collection(db, 'notifications');
      await addDoc(notificationsRef, {
        message: message,
        timestamp: serverTimestamp(),
      });
      setMessage('');
      toast.success('System-wide notification sent successfully!');
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error('Failed to send notification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-8 animate-fade-in">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <Bell className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Admin <span className="text-primary neon-text">Notifications</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Send a message to all currently active users.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
         <Link href="/admin/dashboard" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Admin Dashboard</span>
        </Link>
        
        <div className="bg-secondary/50 border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold">Broadcast a New Notification</h2>
            <p className="text-muted-foreground">
                This message will appear as a toast for all users. It will automatically disappear after 10 seconds.
            </p>
            <Textarea
                placeholder="Enter your notification message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px] text-base"
                disabled={loading}
            />
            <Button onClick={handleSendNotification} disabled={loading || !message.trim()} className="w-full sm:w-auto" variant="gradient">
                <Send className="mr-2 h-5 w-5" />
                {loading ? 'Sending...' : 'Broadcast Notification'}
            </Button>
        </div>
      </div>
    </div>
  );
}
