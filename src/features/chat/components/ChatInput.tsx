import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Button } from '@/shared/components/Button';

interface ChatInputProps {
    onSend: (message: string) => void;
    isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
    const [input, setInput] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = () => {
        if (input.trim() && !isLoading) {
            onSend(input);
            setInput('');
            // Reset height
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
    };

    return (
        <div className="bg-white border-t border-gray-100 p-4">
            <div className="max-w-3xl mx-auto relative flex items-end gap-2 bg-gray-50 rounded-2xl border border-gray-200 p-2 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-200 transition-all">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about your next trip... (e.g. '3 days in Rome')"
                    className="flex-1 max-h-[150px] bg-transparent border-none text-gray-900 placeholder-gray-400 focus:ring-0 resize-none py-3 px-2 text-sm leading-relaxed"
                    rows={1}
                    disabled={isLoading}
                />
                <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    variant="primary"
                    className="rounded-xl h-10 w-10 !p-0 flex items-center justify-center shrink-0 mb-0.5"
                    aria-label="Send message"
                >
                    {isLoading ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                            />
                        </svg>
                    )}
                </Button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-2">
                Travel Companion can make mistakes. Double check flight and hotel details.
            </p>
        </div>
    );
};
