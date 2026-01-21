interface ProductCardSkeletonProps {
  viewMode?: 'grid' | 'list';
}

const ProductCardSkeleton = ({ viewMode = 'grid' }: ProductCardSkeletonProps) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="flex gap-4 p-4">
          {/* Image skeleton */}
          <div className="w-32 h-32 flex-shrink-0 rounded-lg bg-muted animate-pulse" />

          {/* Content skeleton */}
          <div className="flex-1 space-y-3">
            {/* Title */}
            <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
            {/* Description */}
            <div className="h-4 bg-muted rounded animate-pulse w-1/2" />

            {/* Color swatches */}
            <div className="flex gap-2 py-1">
              <div className="w-6 h-6 rounded-full bg-muted animate-pulse" />
              <div className="w-6 h-6 rounded-full bg-muted animate-pulse" />
              <div className="w-6 h-6 rounded-full bg-muted animate-pulse" />
            </div>

            {/* Price and button */}
            <div className="flex items-center justify-between pt-2">
              <div className="h-6 bg-muted rounded animate-pulse w-20" />
              <div className="h-9 bg-muted rounded-lg animate-pulse w-28" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view skeleton
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden min-h-[420px] flex flex-col">
      {/* Image skeleton */}
      <div className="aspect-square bg-muted animate-pulse flex-shrink-0" />

      {/* Content skeleton */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1 space-y-3">
          {/* Title */}
          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          {/* Description */}
          <div className="h-3 bg-muted rounded animate-pulse w-full" />
          <div className="h-3 bg-muted rounded animate-pulse w-2/3" />

          {/* Color swatches */}
          <div className="flex gap-2 py-1">
            <div className="w-6 h-6 rounded-full bg-muted animate-pulse" />
            <div className="w-6 h-6 rounded-full bg-muted animate-pulse" />
            <div className="w-6 h-6 rounded-full bg-muted animate-pulse" />
          </div>
        </div>

        {/* Price and button */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="h-5 bg-muted rounded animate-pulse w-16" />
          <div className="h-9 bg-muted rounded-lg animate-pulse w-24" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
