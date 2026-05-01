import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export function ProjectCardSkeleton() {
    return (
        <Card className="overflow-hidden border-border/60">
            {/* Thumbnail area */}
            <Skeleton className="aspect-video w-full rounded-none" />

            <CardHeader className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </CardHeader>

            <CardContent>
                {/* Tech badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-6 w-16 rounded-md" />
                    ))}
                </div>
                {/* View count */}
                <Skeleton className="h-4 w-20" />
            </CardContent>

            <CardFooter className="flex justify-between">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
            </CardFooter>
        </Card>
    );
}
