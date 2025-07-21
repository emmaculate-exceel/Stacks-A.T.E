"use client"

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Minimize2, Send, User, Bot, Loader } from 'lucide-react';

const FloatingChat = ({
    position = 'bottom-right',
    companyName = 'A.T Support',
    greeting = 'Welcome to A.T Empire! How can we assist you with our AI solutions today?',
    placeholder = 'Type your message here...'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: '1',
            type: 'bot',
            content: greeting,
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: inputValue.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            // Replace with Sudocat AI's API endpoint and headers
            const response = await fetch('https://api.sudocat.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.SUDOCAT_API_KEY}`, // <-- Replace with your Sudocat API key
                },
                body: JSON.stringify({
                    model: "sudocat-model", // <-- Replace with Sudocat's model name
                    messages: [{ role: "user", content: inputValue.trim() }]
                })
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.choices && data.choices[0] && data.choices[0].message.content) {
                const botMessage = data.choices[0].message.content;

                const botResponse = {
                    id: (Date.now() + 1).toString(),
                    type: 'bot',
                    content: botMessage,
                    timestamp: new Date()
                };

                setMessages(prev => [...prev, botResponse]);
            } else {
                throw new Error("No content in response from Sudocat AI");
            }
        } catch (error) {
            console.error("Error fetching Sudocat AI response:", error);
            const errorMessage = {
                id: (Date.now() + 1).toString(),
                type: 'bot',
                content: "I'm sorry, there was an error processing your message.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
        setIsMinimized(false);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    const positionClasses = position === 'bottom-right'
        ? 'right-6 sm:right-8'
        : 'left-6 sm:left-8';

    return (
        <>
            <style>
                {`
                @keyframes float {
                    0% { transform: translateY(0px) scale(1); }
                    50% { transform: translateY(-10px) scale(1.05); }
                    100% { transform: translateY(0px) scale(1); }
                }

                @keyframes glow {
                    0% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(139, 92, 246, 0.3); }
                    50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(139, 92, 246, 0.6); }
                    100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(139, 92, 246, 0.3); }
                }

                .chat-button {
                    animation: float 3s ease-in-out infinite, glow 2s ease-in-out infinite;
                }

                .chat-button:hover {
                    animation: none;
                    transform: scale(1.1);
                    box-shadow: 0 0 25px rgba(59, 130, 246, 0.8), 0 0 35px rgba(139, 92, 246, 0.6);
                    transition: all 0.3s ease-in-out;
                }
                `}
            </style>
            <button
                onClick={toggleChat}
                className={`chat-button fixed z-[3000] bottom-6 sm:bottom-8 ${positionClasses} w-14 h-14 rounded-full 
                flex justify-center items-center text-white transition-all duration-300 focus:outline-none 
                focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-500 
                bg-gradient-to-r from-blue-500 to-purple-500`}
                aria-label="Open chat"
            >
                {isOpen ? (
                    <X className="w-6 h-6 animate-in fade-in" />
                ) : (
                    <MessageCircle className="w-6 h-6 animate-in fade-in" />
                )}
            </button>

            {isOpen && (
                <div
                    className={`fixed z-50 ${positionClasses} bottom-24 sm:bottom-28 w-[90vw] sm:w-[400px] 
                    bg-white rounded-2xl shadow-2xl transform transition-all duration-300 
                    ${isMinimized ? 'h-[60px]' : 'max-h-[80vh] h-[480px]'}`}
                    ref={chatContainerRef}
                    style={{
                        maxHeight: 'calc(100vh - 120px)',
                        bottom: 'calc(4rem + 56px)'
                    }}
                >
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-between p-4 rounded-t-2xl text-white">
                        <div className="flex items-center space-x-2">
                            <Bot className="w-6 h-6" />
                            <span className="font-semibold">{companyName}</span>
                        </div>
                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="p-1 hover:bg-white/20 rounded-full transition-colors"
                            aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
                        >
                            <Minimize2 className="w-5 h-5" />
                        </button>
                    </div>

                    {!isMinimized && (
                        <>
                            <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-br from-blue-50 to-purple-50"
                                style={{ height: 'calc(100% - 120px)' }}>
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex items-start space-x-2 mb-4 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                                    >
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
                                            ${message.type === 'user' ? 'bg-gradient-to-r from-blue-100 to-purple-100' : 'bg-gray-100'}`}
                                        >
                                            {message.type === 'user' ? (
                                                <User className="w-5 h-5 text-blue-600" />
                                            ) : (
                                                <Bot className="w-5 h-5 text-purple-600" />
                                            )}
                                        </div>
                                        <div
                                            className={`max-w-[75%] rounded-2xl px-4 py-2 ${message.type === 'user'
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                                                : 'bg-white shadow-sm'
                                                }`}
                                        >
                                            {message.content}
                                            <div className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-400'
                                                }`}>
                                                {message.timestamp.toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex items-center space-x-2">
                                        <Bot className="w-8 h-8 p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-purple-600" />
                                        <div className="bg-white rounded-full px-4 py-2 shadow-sm">
                                            <Loader className="w-4 h-4 animate-spin text-blue-500" />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <form onSubmit={handleSubmit} className="p-4 bg-white rounded-b-2xl border-t">
                                <div className="relative">
                                    <textarea
                                        ref={inputRef}
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        placeholder={placeholder}
                                        className="w-full pl-4 pr-12 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl resize-none focus:outline-none 
                                        focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                        rows={1}
                                        style={{ maxHeight: '120px' }}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!inputValue.trim()}
                                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full 
                                        transition-all duration-200 ${inputValue.trim()
                                                ? 'text-purple-500 hover:bg-purple-50'
                                                : 'text-gray-300'
                                            }`}
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default FloatingChat;