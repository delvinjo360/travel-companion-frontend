import React, { useEffect, useRef } from 'react';
import { useChat } from '../hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';

const EXAMPLE_PROMPTS = [
    "Plan a 5-day trip to Paris",
    "Create a budget-friendly Bali itinerary",
    "7-day Europe trip under ₹1,50,000"
];

export const ChatContainer: React.FC = () => {
    const { messages, isLoading, sendMessage } = useChat();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex flex-col h-screen bg-white font-sans text-gray-900">
            <ChatHeader />

            <div className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto px-4 py-8">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center min-h-[50vh] text-center space-y-8">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-semibold text-gray-900">Where to next?</h2>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    I can help you plan your perfect trip, create itineraries, and estimate budgets.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-2xl px-4">
                                {EXAMPLE_PROMPTS.map((prompt) => (
                                    <button
                                        key={prompt}
                                        onClick={() => sendMessage(prompt)}
                                        className="text-left p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
                                    >
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                                            &quot;{prompt}&quot;
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 pb-4">
                            {messages.map((message) => (
                                <ChatMessage key={message.id} message={message} />
                            ))}
                            {isLoading && (
                                <div className="flex justify-start w-full mb-4 animate-pulse">
                                    <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-none px-5 py-4">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>
            </div>

            <ChatInput onSend={sendMessage} isLoading={isLoading} />
        </div>
    );
};
