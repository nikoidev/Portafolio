import { Skeleton } from '@/components/ui/skeleton';

export default function ContactLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
            <div className="container mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <Skeleton className="h-12 w-72 mx-auto" />
                    <Skeleton className="h-6 w-[520px] max-w-full mx-auto" />
                    <Skeleton className="h-6 w-80 mx-auto" />
                </div>
                {/* Contact cards */}
                <div className="max-w-5xl mx-auto mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-52 rounded-xl" />
                        ))}
                    </div>
                </div>
                {/* Availability + others */}
                <div className="max-w-5xl mx-auto mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Skeleton className="h-52 rounded-xl" />
                        <Skeleton className="h-52 rounded-xl" />
                    </div>
                </div>
                {/* FAQ */}
                <div className="max-w-5xl mx-auto">
                    <Skeleton className="h-10 w-56 mx-auto mb-8" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-32 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
