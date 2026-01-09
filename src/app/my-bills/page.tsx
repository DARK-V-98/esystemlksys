'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, collection, query, where, onSnapshot, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { app } from '@/firebase/config';
import { ArrowLeft, Receipt, Plus, Search, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface BillRecord {
  id: string;
  userId: string;
  data: string; // This is a JSON string
  createdAt: any;
}

interface BillData {
  invoiceNumber: string;
  clientCompany: string;
  invoiceDate: string;
  total: number;
}

export default function MyBillsPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [bills, setBills] = useState<BillRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setBills([]);
      return;
    }

    setLoading(true);
    const db = getFirestore(app);
    const billsRef = collection(db, 'users', user.uid, 'bills');
    const q = query(billsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const billsData = snapshot.docs.map(doc => doc.data() as BillRecord);
      setBills(billsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching bills:", error);
      toast.error("Failed to load your bills.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDeleteBill = async (billId: string) => {
    if(!user) return;
    toast.info("Deleting bill...");
    try {
        const db = getFirestore(app);
        const billRef = doc(db, 'users', user.uid, 'bills', billId);
        await deleteDoc(billRef);
        toast.success("Bill deleted successfully.");
    } catch (error) {
        console.error("Error deleting bill:", error);
        toast.error("Failed to delete bill.");
    }
  }

  const parseBillData = (data: string): BillData | null => {
    try {
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  }
  
  const filteredBills = bills.filter(bill => {
      const billData = parseBillData(bill.data);
      if(!billData) return false;
      const query = searchQuery.toLowerCase();
      return billData.invoiceNumber.toLowerCase().includes(query) ||
             billData.clientCompany.toLowerCase().includes(query);
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <Receipt className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              My <span className="text-primary neon-text">Bills</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Manage and view all your saved bills and receipts.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
                <ArrowLeft className="h-5 w-5" />
                <span>Main Menu</span>
            </Link>
            <div className="flex gap-4">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by Invoice # or Client..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <Link href="/advanced-tools/bill-generator">
                    <Button variant="gradient" className="h-12">
                        <Plus className="mr-2 h-5 w-5"/>
                        Create New Bill
                    </Button>
                </Link>
            </div>
        </div>
        
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24">Loading your bills...</TableCell>
                        </TableRow>
                    ) : filteredBills.length > 0 ? (
                      filteredBills.map((bill) => {
                          const billData = parseBillData(bill.data);
                          if (!billData) return null;
                          return (
                            <TableRow key={bill.id}>
                                <TableCell>
                                    <div className="font-medium text-primary">{billData.invoiceNumber}</div>
                                </TableCell>
                                <TableCell>{billData.clientCompany}</TableCell>
                                <TableCell>{format(parseISO(billData.invoiceDate), 'PPP')}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">${billData.total.toFixed(2)}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" disabled>
                                        <Eye className="h-4 w-4"/>
                                        <span className="sr-only">View</span>
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                          <Trash2 className="h-4 w-4"/>
                                          <span className="sr-only">Delete</span>
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the bill with invoice number
                                            <span className="font-bold text-primary"> {billData.invoiceNumber}</span>.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => handleDeleteBill(bill.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                          )
                        })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-48">
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <Receipt className="h-10 w-10"/>
                                <h3 className="font-semibold text-lg">No Bills Found</h3>
                                <p className="text-sm">
                                    {searchQuery ? "No bills match your search." : "You haven't created any bills yet."}
                                </p>
                                <Link href="/advanced-tools/bill-generator" className="mt-4">
                                     <Button variant="secondary">Create Your First Bill</Button>
                                </Link>
                            </div>
                        </TableCell>
                      </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
      </div>
    </div>
  );
}
