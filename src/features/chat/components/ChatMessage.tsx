import React from 'react';
import { Message } from '../types/chat.types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
    message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${isUser
                    ? 'bg-blue-600 text-white rounded-br-none prose-invert'
                    : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                    }`}
            >
                <div className={`text-sm leading-relaxed prose prose-sm max-w-none 
                    ${isUser ? 'prose-invert text-white prose-p:text-white prose-headings:text-white prose-strong:text-white prose-a:text-white' : 'prose-slate'}
                    prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5 break-words`}
                >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                    </ReactMarkdown>
                </div>
                <span className={`text-[10px] mt-1 block opacity-70 ${isUser ? 'text-blue-100' : 'text-gray-400'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </div>
    );
};
