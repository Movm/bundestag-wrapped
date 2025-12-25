import { SkeletonShimmer } from '@/components/ui/Skeleton';

export function SuchePageSkeleton() {
  return (
    <div className="min-h-screen page-bg pt-14">
      <div className="min-h-screen flex flex-col items-center justify-center px-4 pb-20">
        {/* Emoji placeholder */}
        <SkeletonShimmer className="w-24 h-24 rounded-full mb-6" />

        {/* Title */}
        <SkeletonShimmer className="h-12 w-72 mb-3" />

        {/* Subtitle */}
        <SkeletonShimmer className="h-5 w-80 mb-8" />

        {/* Search input */}
        <div className="w-full max-w-2xl mb-6">
          <SkeletonShimmer className="h-16 w-full rounded-2xl" />
        </div>

        {/* Tab buttons */}
        <div className="flex gap-3 mb-10">
          <SkeletonShimmer className="h-12 w-28 rounded-xl" />
          <SkeletonShimmer className="h-12 w-32 rounded-xl" />
        </div>

        {/* Suggestions */}
        <div className="text-center">
          <SkeletonShimmer className="h-4 w-24 mx-auto mb-4" />
          <div className="flex flex-wrap justify-center gap-2">
            {[...Array(6)].map((_, i) => (
              <SkeletonShimmer key={i} className="h-9 w-24 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
