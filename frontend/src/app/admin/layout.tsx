'use client';

import { Header } from '@/components/shared/Header';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { status } = useSession();
    const pathname = usePathname();
    const router = useRouter();
    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        if (!isLoginPage && status === 'unauthenticated') {
            router.replace('/admin/login');
        }
    }, [status, isLoginPage, router]);

    if (isLoginPage) {
        return <>{children}</>;
    }

    if (status !== 'authenticated') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Verificando sesión...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header variant="admin" />
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
