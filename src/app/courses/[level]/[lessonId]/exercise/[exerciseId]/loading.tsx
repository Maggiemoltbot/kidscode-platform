import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-10 lg:px-10">
      <Skeleton className="h-8 w-72" />
      <Skeleton className="mt-6 h-24" />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {[0, 1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-20" />
        ))}
      </div>
      <Skeleton className="mt-8 h-64" />
    </main>
  );
}
