import { ProjectCardSkeleton } from '@/components/public/ProjectCardSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectsLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
            <div className="container mx-auto px-4 py-16">
                {/* Header skeleton */}
                <div className="text-center mb-12 space-y-4">
                    <Skeleton className="h-12 w-48 mx-auto" />
                    <Skeleton className="h-6 w-96 mx-auto" />
                    <Skeleton className="h-6 w-64 mx-auto" />
                </div>
                {/* Filter bar skeleton */}
                <Skeleton className="h-40 w-full rounded-xl mb-8" />
                {/* Grid skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <ProjectCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}
