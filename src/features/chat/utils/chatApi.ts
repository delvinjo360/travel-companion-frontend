/**
 * Utility for interacting with the Travel Agent AI API
 */

interface AgentResponse {
    text: string;
}

// Ensure your message structure matches what Mastra expects
interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

interface AgentRequestPayload {
    messages: Message[];
    resourceId?: string; // <--- ADD THIS: Required for memory persistence
    threadId?: string; // <--- ADD THIS: Required for memory persistence
}

const API_URL = 'http://localhost:4111/api/agents/travelAgent/generate';

/**
 * Sends a user message to the travel agent API and returns the AI response.
 * * @param message - The message text from the user
 * @param threadId - (Optional) Unique ID for the conversation session to enable memory
 * @returns The text response from the AI
 * @throws Error if the API request fails
 */
export const sendMessageToTravelAgent = async (message: string, threadId?: string | null): Promise<string> => {
    try {
        const payload: AgentRequestPayload = {
            messages: [
                {
                    role: 'user',
                    content: message
                }
            ]
        };

        // If a threadId is provided, attach it as 'resourceId'
        // This tells Mastra to load past context and save this interaction
        if (threadId) {
            payload.resourceId = "user";
            payload.threadId = threadId;
        }

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        console.log(response);

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data: AgentResponse = await response.json();

        if (!data.text) {
            // Depending on Mastra version, response might be direct or nested
            // You might need to adjust this check if the structure changes
            throw new Error('Invalid response format: missing text field');
        }

        return data.text;
    } catch (error) {
        console.error('Error calling travel agent API:', error);
        throw error;
    }
};