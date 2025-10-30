
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  useFirebase,
  useCollection,
  addDocumentNonBlocking,
  initiateAnonymousSignIn,
  useMemoFirebase
} from '@/firebase';
import { collection, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Send, RefreshCw, MessageSquare, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as indonesiaLocale } from 'date-fns/locale';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { moderateText } from '@/ai/flows/moderate-text-flow';

const messageSchema = z.object({
  to: z.string().min(2, 'Nama tujuan minimal 2 karakter.').max(50, 'Nama tujuan maksimal 50 karakter.'),
  message: z.string().min(5, 'Pesan minimal 5 karakter.').max(500, 'Pesan maksimal 500 karakter.'),
  captcha: z.string().refine(val => !isNaN(parseInt(val)), 'Jawaban harus berupa angka.'),
});

type AnonymousMessage = {
    id: string;
    to: string;
    message: string;
    createdAt: {
        seconds: number;
        nanoseconds: number;
    } | null;
};

type Captcha = {
    num1: number;
    num2: number;
    answer: number;
} | null;

const generateCaptcha = (): Captcha => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  return { num1, num2, answer: num1 + num2 };
};

export default function SecretMessagesPage() {
  const { toast } = useToast();
  const { firestore, auth, user, isUserLoading } = useFirebase();
  const [captcha, setCaptcha] = useState<Captcha>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      to: '',
      message: '',
      captcha: '',
    },
  });
  
  useEffect(() => {
    if (!isUserLoading && !user) {
        initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  const messagesCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'anonymous_messages');
  }, [firestore]);

  const messagesQuery = useMemoFirebase(() => {
      if (!messagesCollectionRef) return null;
      return query(messagesCollectionRef, orderBy('createdAt', 'desc'));
  }, [messagesCollectionRef]);

  const { data: messages, isLoading: isLoadingMessages } = useCollection<AnonymousMessage>(messagesQuery);
  
  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
  };

  const onSubmit = async (values: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true);
    if (!captcha || parseInt(values.captcha) !== captcha.answer) {
      toast({
        variant: 'destructive',
        title: 'Captcha Salah!',
        description: 'Jawabanmu salah, coba lagi.',
      });
      form.setError('captcha', { message: 'Jawaban salah!' });
      refreshCaptcha();
      setIsSubmitting(false);
      return;
    }

    if (!user || !messagesCollectionRef) {
        toast({ variant: "destructive", title: "Error", description: "Firebase belum siap." });
        setIsSubmitting(false);
        return;
    }

    let isAppropriate = true;
    try {
        const fullMessageText = `${values.to}: ${values.message}`;
        const moderationResult = await moderateText({ text: fullMessageText });
        isAppropriate = moderationResult.isAppropriate;
    } catch (aiError) {
        console.warn("AI moderation failed, defaulting to appropriate.", aiError);
        // Fallback: If AI moderation fails, assume the message is appropriate.
        isAppropriate = true;
    }

    if (!isAppropriate) {
        toast({
            variant: 'destructive',
            title: 'Pesan Ditolak',
            description: 'Mengandung kata yang dilarang, harap untuk tidak menggunakan kata kasar!',
        });
        setIsSubmitting(false);
        return;
    }

    try {
        addDocumentNonBlocking(messagesCollectionRef, {
            to: values.to,
            message: values.message,
            createdAt: serverTimestamp(),
        });

        toast({
            title: 'Pesan Terkirim!',
            description: 'Pesan anonimmu telah berhasil dikirim.',
        });
        form.reset();
        refreshCaptcha();
    } catch (error) {
        console.error("Error during message submission: ", error);
        toast({
            variant: "destructive",
            title: "Terjadi Kesalahan",
            description: "Gagal mengirim pesan. Silakan coba lagi.",
        });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header activeSection="secret-messages" />
      <div className="bg-background min-h-screen pt-24">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Anonymous <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Message</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Kirim pesan anonim untuk kelas IC 2024. Identitasmu benar-benar rahasia, bahkan pengelola website ini tidak akan mengetahuinya.</p>
          </div>

          <Card className="max-w-2xl mx-auto mb-16 glass-card">
            <CardHeader>
              <CardTitle>Kirim Pesan Anonim</CardTitle>
              <CardDescription>Pesan yang Anda kirim akan muncul di papan pesan publik di halaman ini. Harap gunakan kata-kata yang sopan.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="to"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Untuk Siapa?</FormLabel>
                        <FormControl>
                          <Input placeholder="Tulis nama tujuan..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pesanmu</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Tuliskan apapun yang ada di pikiranmu..." {...field} rows={4} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center gap-4">
                      <FormField
                      control={form.control}
                      name="captcha"
                      render={({ field }) => (
                          <FormItem className='flex-grow'>
                          <FormLabel>Verifikasi (Captcha)</FormLabel>
                          <FormControl>
                              <Input placeholder={captcha ? `Berapa ${captcha.num1} + ${captcha.num2}?` : 'Memuat captcha...'} {...field} />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={refreshCaptcha} className="mt-8">
                          <RefreshCw className="h-5 w-5"/>
                          <span className="sr-only">Refresh Captcha</span>
                      </Button>
                  </div>

                  <Button type="submit" disabled={isSubmitting || isUserLoading || !captcha} className="w-full">
                    {isSubmitting ? 'Memeriksa & Mengirim...' : 'Kirim Pesan'}
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-white mb-10 flex items-center justify-center gap-3">
                  <MessageSquare className="h-8 w-8 text-primary"/>
                  Papan Pesan
              </h2>
              {isLoadingMessages && (
                   <div className="text-center text-muted-foreground">Memuat pesan...</div>
              )}
              {!isLoadingMessages && messages?.length === 0 && (
                  <p className="text-center text-muted-foreground">Belum ada pesan. Jadilah yang pertama!</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {messages?.map(msg => (
                      <Card key={msg.id} className="spotlight-card">
                          <CardContent className="spotlight-card-content pt-6 flex flex-col justify-between h-full">
                            <div>
                                <div className="flex items-center gap-2 mb-3 text-primary">
                                    <User className="h-4 w-4"/>
                                    <p className="font-bold text-sm">Untuk: {msg.to}</p>
                                </div>
                                <p className="text-sm text-white leading-relaxed">{msg.message}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-4 self-end">
                                {msg.createdAt ? formatDistanceToNow(new Date(msg.createdAt.seconds * 1000), { addSuffix: true, locale: indonesiaLocale }) : 'beberapa saat yang lalu'}
                            </p>
                          </CardContent>
                      </Card>
                  ))}
              </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
