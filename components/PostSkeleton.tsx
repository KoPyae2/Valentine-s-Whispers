export default function PostSkeleton() {
  return (
    <div className="relative p-4 md:p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-pink-200/20 shadow-xl">
      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/10 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
          <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
        <div className="h-4 w-5/6 bg-white/10 rounded animate-pulse" />
        <div className="h-4 w-4/6 bg-white/10 rounded animate-pulse" />
      </div>
    </div>
  );
} 