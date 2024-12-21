import {Skeleton} from "@/components/ui/skeleton";

export const TweetFormSkeleton = () => {

    return (
        <div className="flex p-3 gap-1 border-b">
            {/* Avatar Skeleton */}
            <Skeleton className="w-12 h-12 rounded-full" />

            {/* Form Skeleton */}
            <div className="flex-1 space-y-4">
                {/* Textarea Skeleton */}
                <Skeleton className="w-full h-16 rounded-md" />

                {/* Divider */}
                <div className="border-b"></div>

                {/* Footer */}
                <div className="w-full flex justify-end items-center gap-5">
                    {/* Character Count Skeleton */}
                    <Skeleton className="w-10 h-5 rounded-md" />

                    {/* Button Skeleton */}
                    <Skeleton className="w-20 h-10 rounded-full" />
                </div>
            </div>
        </div>
    )
}