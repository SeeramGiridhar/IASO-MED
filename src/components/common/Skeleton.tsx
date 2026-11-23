interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div className={`animate-pulse bg-gray-200/80 rounded-xl ${className}`} />
    );
}

export function DoctorCardSkeleton() {
    return (
        <div className="bg-white rounded-3xl p-6 border-2 border-gray-50 flex flex-col sm:flex-row gap-6 animate-pulse">
            <div className="w-24 h-24 rounded-2xl bg-gray-200 shrink-0" />
            <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="flex gap-4 pt-2">
                    <div className="h-8 bg-gray-200 rounded-xl w-24" />
                    <div className="h-8 bg-gray-200 rounded-xl w-24" />
                </div>
            </div>
            <div className="sm:self-center">
                <div className="h-12 bg-gray-200 rounded-2xl w-32" />
            </div>
        </div>
    );
}

export function ReportCardSkeleton() {
    return (
        <div className="bg-white rounded-3xl p-6 border-2 border-gray-50 flex items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-gray-200 shrink-0" />
                <div className="space-y-2 flex-1">
                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
            </div>
            <div className="h-8 bg-gray-200 rounded-xl w-20" />
        </div>
    );
}
