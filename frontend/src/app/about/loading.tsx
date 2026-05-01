import { Skeleton } from '@/components/ui/skeleton';

export default function AboutLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
            <div className="container mx-auto px-4 py-16">
                {/* Avatar + hero */}
                <div className="text-center mb-16 space-y-4">
                    <Skeleton className="w-32 h-32 rounded-full mx-auto" />
                    <Skeleton className="h-12 w-48 mx-auto" />
                    <Skeleton className="h-6 w-96 mx-auto" />
                    <Skeleton className="h-6 w-72 mx-auto" />
                    <div className="flex justify-center gap-3 pt-2">
                        <Skeleton className="h-9 w-28 rounded-md" />
                        <Skeleton className="h-9 w-10 rounded-md" />
                        <Skeleton className="h-9 w-10 rounded-md" />
                    </div>
                </div>
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                    ))}
                </div>
                {/* Main content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Skeleton className="h-48 rounded-xl" />
                        <Skeleton className="h-64 rounded-xl" />
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="h-56 rounded-xl" />
                        <Skeleton className="h-40 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}
