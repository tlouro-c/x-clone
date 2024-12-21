"use client";

interface ContentSwitchButtonProps {
    children?: React.ReactNode;
    onClickAction: (e: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    isHighlighted?: boolean;
    disabled?: boolean;
}

export default function ContentSwitchButton({children, className, onClickAction, isHighlighted, disabled } : ContentSwitchButtonProps) {

    return (
        <button disabled={disabled}
            onClick={onClickAction}
            className={`bg-transparent hover:bg-foreground/10 flex justify-center border-0 cursor-pointer items-center relative font-bold transition-transform ${className}`}
        >
            <div className={!isHighlighted ? "text-neutral-500 scale-95" : ""}>
                {children}
            </div>
            {isHighlighted && (
                <span className="absolute bottom-[-0px] h-[4px] rounded-full bg-sky-400 transition-all duration-300 w-1/4"></span>
            )}
        </button>
    );
}