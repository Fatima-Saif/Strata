import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col p-6 lg:p-8 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-[400px] w-full rounded-lg" />
    </div>
  );
}
