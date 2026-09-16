import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 sm:py-10 lg:px-10">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="mt-6 h-64" />
      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_320px]">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    </main>
  );
}
