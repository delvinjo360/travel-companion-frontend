import React from 'react';

export const ChatHeader: React.FC = () => {
    return (
        <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-md">
            <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                        T
                    </div>
                    <h1 className="font-semibold text-gray-900 tracking-tight">Travel Companion</h1>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                        Beta
                    </span>
                </div>
            </div>
        </header>
    );
};
