function SkeletonBlock({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={[
        "animate-pulse rounded-lg border border-edge bg-surface",
        className,
      ].join(" ")}
    />
  );
}

export function OverviewSkeleton() {
  return (
    <div className="w-full space-y-5 p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <SkeletonBlock
            key={index}
            className="h-[110px]"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-5">
        <SkeletonBlock className="h-[250px] xl:col-span-3" />

        <SkeletonBlock className="h-[250px] xl:col-span-2" />
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-5">
        <SkeletonBlock className="h-[360px] xl:col-span-3" />

        <SkeletonBlock className="h-[360px] xl:col-span-2" />
      </div>

      <SkeletonBlock className="h-[220px]" />
    </div>
  );
}