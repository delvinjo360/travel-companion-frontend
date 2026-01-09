import { useState, useCallback, useEffect, useRef } from 'react';
import { Message } from '../types/chat.types';
import { sendMessageToTravelAgent } from '../utils/chatApi';

export const useChat = () => {
    // 1. Move all state INSIDE the hook
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Use a Ref for threadId so it persists without triggering re-renders unnecessarily
    // or causing stale closure issues inside useCallback
    const threadIdRef = useRef<string | null>(null);

    // 2. Initialize a unique Thread ID when the hook mounts
    useEffect(() => {
        // Check if we already have one (e.g., from localStorage) or create new
        const storedId = localStorage.getItem('travel_agent_thread_id');

        if (storedId) {
            threadIdRef.current = storedId;
        } else {
            const newId = crypto.randomUUID();
            threadIdRef.current = newId;
            localStorage.setItem('travel_agent_thread_id', newId);
        }
    }, []);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim()) return;

        // Add user message to UI immediately
        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: 'user',
            content,
            timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // 3. Ensure we have a threadId before sending
            if (!threadIdRef.current) {
                threadIdRef.current = crypto.randomUUID();
            }

            // 4. Pass the threadId to your API utility
            // (Using the ref ensures we always access the current value)
            const responseContent = await sendMessageToTravelAgent(
                content,
                threadIdRef.current
            );

            const assistantMessage: Message = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: responseContent,
                timestamp: Date.now(),
            };

            setMessages((prev) => [...prev, assistantMessage]);

        } catch (error) {
            console.error('Failed to get response:', error);

            const errorMessage: Message = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: "Sorry, I couldn’t generate a response right now. Please try again.",
                timestamp: Date.now(),
            };

            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, []); // Empty dependency array is safe because we use threadIdRef

    // Optional: Function to clear memory/start over
    const resetChat = useCallback(() => {
        const newId = crypto.randomUUID();
        threadIdRef.current = newId;
        localStorage.setItem('travel_agent_thread_id', newId);
        setMessages([]);
    }, []);

    return {
        messages,
        isLoading,
        sendMessage,
        resetChat
    };
};