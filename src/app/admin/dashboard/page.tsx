
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useMemoFirebase } from '@/firebase/provider';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, LogOut, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as indonesiaLocale } from 'date-fns/locale';
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
} from '@/components/ui/alert-dialog';

type AnonymousMessage = {
    id: string;
    to: string;
    message: string;
    createdAt: {
        seconds: number;
        nanoseconds: number;
    } | null;
};

export default function AdminDashboardPage() {
    const router = useRouter();
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState<AnonymousMessage | null>(null);
    
    useEffect(() => {
        const isAdminLoggedIn = sessionStorage.getItem('admin-auth') === 'true';
        if (!isAdminLoggedIn) {
            router.replace('/admin/login');
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    // Queries for messages
    const messagesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'anonymous_messages'), orderBy('createdAt', 'desc'));
    }, [firestore]);
    const { data: messages, isLoading: isLoadingMessages } = useCollection<AnonymousMessage>(messagesQuery);

    const handleDeleteMessage = async (id: string) => {
        if (!id) return;
        
        try {
            const response = await fetch('/api/deleteMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ details: 'Server returned a non-JSON error response.' }));
                toast({
                    variant: 'destructive',
                    title: 'Gagal Menghapus',
                    description: errorData.details,
                });
                return;
            }
            
            toast({ title: 'Berhasil', description: 'Pesan telah dihapus.' });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Tidak dapat terhubung ke server.';
            toast({ variant: 'destructive', title: 'Error Jaringan', description: errorMessage });
        } finally {
            setMessageToDelete(null);
        }
    };
    
    const handleLogout = () => {
        sessionStorage.removeItem('admin-auth');
        router.replace('/admin/login');
        toast({ title: 'Logout Berhasil' });
    };

    if (!isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background text-white">
                Memverifikasi...
            </div>
        );
    }

    return (
        <AlertDialog>
            <div className="min-h-screen bg-background text-white p-4 sm:p-6 md:p-8">
                <div className="container mx-auto">
                    <header className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
                        <Button onClick={handleLogout} variant="destructive">
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </header>
                    
                    <Card className="bg-card/60 border-border">
                        <CardHeader>
                            <CardTitle>Daftar Pesan Anonim</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoadingMessages && <p className="text-center text-muted-foreground">Memuat pesan...</p>}
                            
                            {!isLoadingMessages && (!messages || messages.length === 0) && (
                                <p className="text-center text-muted-foreground">Belum ada pesan anonim.</p>
                            )}

                            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                                {messages?.map((msg) => (
                                    <div key={msg.id} className="flex items-start justify-between p-4 rounded-lg bg-background/50 border border-border/50">
                                        <div className="flex-1 pr-4">
                                            <div className="flex items-center gap-2 mb-2 text-primary">
                                                <User className="h-4 w-4" />
                                                <span className="font-bold text-sm">Untuk: {msg.to}</span>
                                            </div>
                                            <p className="text-white break-words text-sm">{msg.message}</p>
                                            <p className="text-xs text-muted-foreground mt-2">
                                                {msg.createdAt 
                                                    ? formatDistanceToNow(new Date(msg.createdAt.seconds * 1000), { addSuffix: true, locale: indonesiaLocale }) 
                                                    : 'beberapa saat yang lalu'}
                                            </p>
                                        </div>
                                        <AlertDialogTrigger asChild>
                                            <Button 
                                              onClick={() => setMessageToDelete(msg)}
                                              variant="ghost" 
                                              size="icon" 
                                              className="text-red-500 hover:bg-red-500/10 hover:text-red-400 flex-shrink-0"
                                              aria-label="Hapus pesan"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                        </AlertDialogTrigger>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tindakan ini tidak dapat dibatalkan. Ini akan menghapus pesan secara permanen.
                    </AlertDialogDescription>
                    {messageToDelete && (
                        <blockquote className="mt-4 pl-4 border-l-2 border-border text-white italic">
                           "Pesan untuk <span className="font-bold text-primary">{messageToDelete.to}</span>: {messageToDelete.message}"
                        </blockquote>
                    )}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => { setMessageToDelete(null); }}>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            if (messageToDelete) handleDeleteMessage(messageToDelete.id);
                        }}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Hapus
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
