type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiRequestOptions extends Omit<RequestInit, 'method'> {
    params?: Record<string, string | number | boolean>;
}

export class ApiError extends Error {
    constructor(
        public status: number,
        public message: string,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

async function fetchClient<T>(
    endpoint: string,
    method: RequestMethod,
    options: ApiRequestOptions = {}
): Promise<T> {
    const { params, headers, ...customConfig } = options;

    // Handle query parameters
    let url = `${BASE_URL}${endpoint}`;
    if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, String(value));
            }
        });
        const queryString = searchParams.toString();
        if (queryString) {
            url += (url.includes('?') ? '&' : '?') + queryString;
        }
    }

    const config: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        ...customConfig,
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            let errorMessage = 'An error occurred while fetching data';
            let errorData;

            try {
                errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch {
                // Ignore JSON parse error for error responses
            }

            throw new ApiError(response.status, errorMessage, errorData);
        }

        // Handle 204 No Content
        if (response.status === 204) {
            return {} as T;
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new Error(error instanceof Error ? error.message : 'Network error');
    }
}

export const api = {
    get: <T>(endpoint: string, options?: ApiRequestOptions) =>
        fetchClient<T>(endpoint, 'GET', options),

    post: <T>(endpoint: string, body: any, options?: ApiRequestOptions) =>
        fetchClient<T>(endpoint, 'POST', { ...options, body: JSON.stringify(body) }),

    put: <T>(endpoint: string, body: any, options?: ApiRequestOptions) =>
        fetchClient<T>(endpoint, 'PUT', { ...options, body: JSON.stringify(body) }),

    delete: <T>(endpoint: string, options?: ApiRequestOptions) =>
        fetchClient<T>(endpoint, 'DELETE', options),

    patch: <T>(endpoint: string, body: any, options?: ApiRequestOptions) =>
        fetchClient<T>(endpoint, 'PATCH', { ...options, body: JSON.stringify(body) }),
};
