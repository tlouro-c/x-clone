"use client";


export const HomeHeaderSkeleton = () => {
    return (
        <div className="sticky top-0 w-full border-b flex z-10 bg-background/80 backdrop-blur-sm justify-center pointer-events-none">

            <div className="flex-1 h-14 bg-transparent flex justify-center border-0 items-center relative font-bold">
                For you
                <span
                    className="absolute bottom-0 h-[4px] rounded-full bg-sky-400 transition-all duration-300 w-1/4"></span>
            </div>
            <div className="flex-1 h-14 bg-transparent flex justify-center border-0 items-center relative font-bold text-neutral-500 scale-95">
                Following
            </div>
        </div>
    );
};