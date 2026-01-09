'use client';
import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc, updateDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { app } from '@/firebase/config';
import { toast } from 'sonner';
import { ArrowLeft, Users, Shield, VenetianMask } from 'lucide-react';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'developer';
  createdAt: Timestamp;
  lastActive?: Timestamp;
  isBanned: boolean;
  ipAddress?: string;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);

  useEffect(() => {
    const usersRef = collection(db, 'users');
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
      setUsers(usersData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [db]);

  const handleRoleChange = async (uid: string, newRole: UserProfile['role']) => {
    const userRef = doc(db, 'users', uid);
    try {
      await updateDoc(userRef, { role: newRole });
      toast.success(`User role updated to ${newRole}.`);
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update user role.");
    }
  };

  const handleBanToggle = async (uid: string, currentStatus: boolean) => {
    const userRef = doc(db, 'users', uid);
    const newStatus = !currentStatus;
    try {
      await updateDoc(userRef, { isBanned: newStatus });
      toast.success(`User has been ${newStatus ? 'banned' : 'unbanned'}.`);
    } catch (error) {
      console.error("Error updating ban status:", error);
      toast.error("Failed to update user status.");
    }
  };

  return (
    <div className="space-y-6 p-8 animate-fade-in">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <Users className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              User <span className="text-primary neon-text">Management</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Manage roles, permissions, and access for all users.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <Link href="/admin/dashboard" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Admin Dashboard</span>
        </Link>
        
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24">Loading users...</TableCell>
                        </TableRow>
                    ) : users.map((user) => (
                        <TableRow key={user.uid}>
                            <TableCell>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-xs text-muted-foreground">{user.email}</div>
                            </TableCell>
                            <TableCell>
                                <Select defaultValue={user.role} onValueChange={(value: UserProfile['role']) => handleRoleChange(user.uid, value)}>
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user"><div className="flex items-center gap-2"><Users className="h-4 w-4"/>User</div></SelectItem>
                                        <SelectItem value="developer"><div className="flex items-center gap-2"><VenetianMask className="h-4 w-4"/>Developer</div></SelectItem>
                                        <SelectItem value="admin"><div className="flex items-center gap-2"><Shield className="h-4 w-4"/>Admin</div></SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell>
                                {user.lastActive ? `${formatDistanceToNow(user.lastActive.toDate())} ago` : 'Never'}
                            </TableCell>
                            <TableCell>
                                {user.ipAddress || 'N/A'}
                            </TableCell>
                            <TableCell className="text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <Switch
                                        checked={user.isBanned}
                                        onCheckedChange={() => handleBanToggle(user.uid, user.isBanned)}
                                        className="data-[state=checked]:bg-destructive data-[state=unchecked]:bg-success"
                                    />
                                    <Badge variant={user.isBanned ? 'destructive' : 'default'} className={user.isBanned ? '' : 'bg-success'}>
                                        {user.isBanned ? 'Banned' : 'Active'}
                                    </Badge>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      </div>
    </div>
  );
}
