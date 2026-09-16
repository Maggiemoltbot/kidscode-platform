import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-10 lg:px-10">
      <Skeleton className="h-48" />
      <div className="mt-6 space-y-3">
        {[0, 1, 2, 3, 4].map((item) => (
          <Skeleton key={item} className="h-24" />
        ))}
      </div>
    </main>
  );
}
