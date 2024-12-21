import React from 'react';

interface LoaderProps {
    className?: string; // Optional className prop
}

const Loader: React.FC<LoaderProps> = ({ className }) => {
    return (
        <div className={`min-h-6 min-w-6 rounded-full border-4 border-background border-t-foreground animate-spin ${className} `}></div>
    );
};

export default Loader;