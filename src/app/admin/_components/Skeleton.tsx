export function SkeletonLine({ className = "" }: { className?: string }) {
  return <div className={`bg-[#E5E3DC] animate-pulse rounded ${className}`} />;
}

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 space-y-3">
      <SkeletonLine className="h-4 w-2/5" />
      {Array.from({ length: lines - 1 }).map((_, i) => (
        <SkeletonLine key={i} className={`h-3 ${i % 2 === 0 ? "w-full" : "w-3/4"}`} />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 overflow-hidden">
      <div className="px-5 py-4 border-b border-[#8E1B3A]/10">
        <SkeletonLine className="h-5 w-1/3" />
      </div>
      <div className="divide-y divide-[#8E1B3A]/5">
        {Array.from({ length: rows }).map((_, row) => (
          <div key={row} className="px-5 py-3 flex gap-4">
            {Array.from({ length: cols }).map((_, col) => (
              <SkeletonLine key={col} className={`h-3 flex-1 ${col === 0 ? "max-w-[120px]" : ""}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonKPIs({ count = 4 }: { count?: number }) {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-${count} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#E5E3DC] animate-pulse" />
          <SkeletonLine className="h-8 w-16 mb-2" />
          <SkeletonLine className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
}
