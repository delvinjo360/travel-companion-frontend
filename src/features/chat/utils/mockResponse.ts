export const generateMockResponse = async (userMessage: string): Promise<string> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('paris')) {
        return "Paris is a wonderful choice! For a 5-day trip, I'd recommend starting with the Eiffel Tower and Louvre, then exploring Montmartre. What's your budget range for this trip?";
    }

    if (lowerMessage.includes('bali')) {
        return "Bali offers a great mix of beaches and culture. For a budget-friendly itinerary, consider staying in Ubud for culture and Canggu for beaches. Would you like a day-by-day breakdown?";
    }

    if (lowerMessage.includes('budget') || lowerMessage.includes('cost')) {
        return "I can definitely help with budgeting. Could you tell me more about your travel style? Are you looking for luxury, mid-range, or backpacking options?";
    }

    return "Sure! I can help you plan your trip. Tell me your destination, number of days, and budget (e.g., 'Plan a 5-day trip to Paris').";
};
