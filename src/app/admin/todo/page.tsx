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
    orderBy
} from 'firebase/firestore';
import { app } from '@/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ListTodo, Plus, Trash2, Github } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface Todo {
    id: string;
    text: string;
    completed: boolean;
    createdAt: any;
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

      const todosRef = collection(db, 'users', currentUser.uid, 'todos');
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
      if (!newTodo.trim() || !user) return;

      try {
          const db = getFirestore(app);
          const todosRef = collection(db, 'users', user.uid, 'todos');
          await addDoc(todosRef, {
              text: newTodo,
              completed: false,
              createdAt: serverTimestamp()
          });
          setNewTodo('');
          toast.success("Task added successfully!");
      } catch (error) {
          console.error("Error adding todo:", error);
          toast.error("Failed to add task.");
      }
  }
  
  const handleToggleTodo = async (id: string, completed: boolean) => {
      if (!user) return;
      const db = getFirestore(app);
      const todoRef = doc(db, 'users', user.uid, 'todos', id);
      try {
        await updateDoc(todoRef, { completed: !completed });
      } catch (error) {
        console.error("Error updating todo:", error);
        toast.error("Failed to update task status.");
      }
  }

  const handleDeleteTodo = async (id: string) => {
    if (!user) return;
    const db = getFirestore(app);
    const todoRef = doc(db, 'users', user.uid, 'todos', id);
    try {
        await deleteDoc(todoRef);
        toast.info("Task removed.");
    } catch (error) {
        console.error("Error deleting todo:", error);
        toast.error("Failed to remove task.");
    }
  }

  const completedCount = todos.filter(t => t.completed).length;
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
                A private task manager for developer-specific goals.
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
                        placeholder="Add a new task..."
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

                <div className="space-y-2">
                    {loading ? (
                        <p className="text-center text-muted-foreground py-8">Loading tasks...</p>
                    ) : todos.length > 0 ? (
                        todos.map(todo => (
                            <div key={todo.id} className="flex items-center gap-3 p-3 bg-card rounded-md border hover:border-primary/50 transition-colors">
                                <Checkbox 
                                    id={`todo-${todo.id}`}
                                    checked={todo.completed} 
                                    onCheckedChange={() => handleToggleTodo(todo.id, todo.completed)}
                                />
                                <label
                                    htmlFor={`todo-${todo.id}`}
                                    className={cn(
                                        "flex-grow font-medium cursor-pointer",
                                        todo.completed && "line-through text-muted-foreground"
                                    )}
                                >
                                    {todo.text}
                                </label>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteTodo(todo.id)}>
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            </div>
                        ))
                    ) : (
                         <div className="text-center py-12 text-muted-foreground">
                            <Github className="h-12 w-12 mx-auto mb-4"/>
                            <h3 className="font-semibold text-lg text-foreground">All Clear!</h3>
                            <p>You have no pending tasks. Time to code!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}
