import { SkeletonKPIs, SkeletonTable } from "./_components/Skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-24 bg-[#E5E3DC] rounded" />
        <div className="h-8 w-64 bg-[#E5E3DC] rounded" />
        <div className="h-3 w-96 bg-[#E5E3DC] rounded" />
      </div>

      <SkeletonKPIs count={4} />
      <SkeletonTable rows={6} cols={5} />
    </div>
  );
}
