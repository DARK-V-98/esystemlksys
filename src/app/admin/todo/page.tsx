'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { 
    getFirestore, 
    collection, 
    onSnapshot, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc,
    serverTimestamp,
    query,
    orderBy,
    getDoc,
    Timestamp
} from 'firebase/firestore';
import { app } from '@/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ListTodo, Plus, Trash2, CheckCircle, Circle, User } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';

interface Todo {
    id: string;
    text: string;
    status: 'Pending' | 'Completed';
    createdAt: Timestamp;
    addedBy: string;
    completedBy?: string;
    completedAt?: Timestamp;
}

export default function TodoPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/auth');
        return;
      }
      setUser(currentUser);
      
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() && userDoc.data().role !== 'developer') {
          toast.error("Access Denied", { description: "This page is for developers only."});
          router.push('/admin/dashboard');
          return;
      }

      const todosRef = collection(db, 'developer-todos');
      const q = query(todosRef, orderBy('createdAt', 'desc'));
      
      const unsubscribeTodos = onSnapshot(q, (snapshot) => {
        const todosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Todo));
        setTodos(todosData);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching todos:", error);
        toast.error("Failed to load your tasks.");
        setLoading(false);
      });

      return () => unsubscribeTodos();
    });

    return () => unsubscribe();
  }, [router]);

  const handleAddTodo = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTodo.trim() || !user || !user.displayName) return;

      try {
          const db = getFirestore(app);
          const todosRef = collection(db, 'developer-todos');
          await addDoc(todosRef, {
              text: newTodo,
              status: 'Pending',
              createdAt: serverTimestamp(),
              addedBy: user.displayName,
          });
          setNewTodo('');
          toast.success("Task added successfully!");
      } catch (error) {
          console.error("Error adding todo:", error);
          toast.error("Failed to add task.");
      }
  }
  
  const handleToggleStatus = async (id: string, currentStatus: 'Pending' | 'Completed') => {
      if (!user || !user.displayName) return;
      const db = getFirestore(app);
      const todoRef = doc(db, 'developer-todos', id);
      try {
        if (currentStatus === 'Pending') {
            await updateDoc(todoRef, { 
                status: 'Completed',
                completedBy: user.displayName,
                completedAt: serverTimestamp(),
            });
            toast.success("Task marked as completed.");
        } else {
            await updateDoc(todoRef, {
                status: 'Pending',
                completedBy: null,
                completedAt: null,
            });
            toast.info("Task marked as pending.");
        }
      } catch (error) {
        console.error("Error updating todo:", error);
        toast.error("Failed to update task status.");
      }
  }

  const handleDeleteTodo = async (id: string) => {
    if (!user) return;
    const db = getFirestore(app);
    const todoRef = doc(db, 'developer-todos', id);
    try {
        await deleteDoc(todoRef);
        toast.info("Task removed.");
    } catch (error) {
        console.error("Error deleting todo:", error);
        toast.error("Failed to remove task.");
    }
  }

  const completedCount = todos.filter(t => t.status === 'Completed').length;
  const pendingCount = todos.length - completedCount;

  return (
    <div className="space-y-6 p-4 md:p-8 animate-fade-in">
        <div className="relative overflow-hidden gradient-dark p-6 md:p-8 rounded-lg">
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
                <ListTodo className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
                <h1 className="text-3xl font-black text-primary-foreground">
                Developer <span className="text-primary neon-text">Todo List</span>
                </h1>
                <p className="mt-1 text-primary-foreground/70">
                A shared task manager for all developers.
                </p>
            </div>
            </div>
        </div>
        <div className="bg-card rounded-lg border shadow-sm p-4 md:p-6 space-y-6">
            <Link href="/admin/dashboard" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Admin Dashboard</span>
            </Link>

            <div className="bg-secondary/50 border rounded-lg p-6 space-y-4">
                <form onSubmit={handleAddTodo} className="flex gap-2">
                    <Input 
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="Add a new task for the team..."
                        className="h-12"
                    />
                    <Button type="submit" variant="gradient" className="h-12" disabled={!newTodo.trim()}>
                        <Plus className="h-5 w-5"/>
                        <span className="hidden sm:inline ml-2">Add Task</span>
                    </Button>
                </form>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Total: <span className="font-bold text-foreground">{todos.length}</span></span>
                    <span>Pending: <span className="font-bold text-yellow-500">{pendingCount}</span></span>
                    <span>Completed: <span className="font-bold text-success">{completedCount}</span></span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">Status</TableHead>
                            <TableHead>Task</TableHead>
                            <TableHead>Added By</TableHead>
                            <TableHead>Completed By</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">Loading tasks...</TableCell>
                            </TableRow>
                        ) : todos.length > 0 ? (
                            todos.map(todo => (
                                <TableRow key={todo.id} className={cn(todo.status === 'Completed' && 'bg-secondary/50')}>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => handleToggleStatus(todo.id, todo.status)}
                                        >
                                            {todo.status === 'Completed' ? (
                                                <CheckCircle className="h-5 w-5 text-success"/>
                                            ) : (
                                                <Circle className="h-5 w-5 text-muted-foreground"/>
                                            )}
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <p className={cn("font-medium", todo.status === 'Completed' && 'line-through text-muted-foreground')}>
                                            {todo.text}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Added {formatDistanceToNow(todo.createdAt.toDate(), { addSuffix: true })}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground"/>
                                            <span className="font-medium">{todo.addedBy}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {todo.completedBy ? (
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-muted-foreground"/>
                                                <div>
                                                    <p className="font-medium">{todo.completedBy}</p>
                                                    {todo.completedAt && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {formatDistanceToNow(todo.completedAt.toDate(), { addSuffix: true })}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteTodo(todo.id)}>
                                            <Trash2 className="h-4 w-4"/>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                             <TableRow>
                                <TableCell colSpan={5} className="text-center h-48">
                                    <ListTodo className="h-12 w-12 mx-auto text-muted-foreground mb-4"/>
                                    <h3 className="font-semibold text-lg text-foreground">All Clear!</h3>
                                    <p className="text-muted-foreground">There are no tasks on the board.</p>
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
