import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send, Copy, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import toast from 'react-hot-toast';

function ChatAi({problem}) {
    const [messages, setMessages] = useState([
        { role: 'model', parts:[{text: "Hi! I'm CodeMaster AI. How can I help you with this problem?"}]}
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [copiedText, setCopiedText] = useState(null);

    const { register, handleSubmit, reset, watch, formState: {errors} } = useForm();
    const messagesEndRef = useRef(null);
    const messageValue = watch("message");

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        return () => clearTimeout(timeoutId);
    }, [messages, isTyping]);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedText(text);
        toast.success("Code copied to clipboard!");
        setTimeout(() => setCopiedText(null), 2000);
    };

    const onSubmit = async (data) => {
        if (!data.message || data.message.trim() === '') return;
        
        const userMessage = { role: 'user', parts:[{text: data.message}] };
        const updatedMessages = [...messages, userMessage];
        
        setMessages(updatedMessages);
        reset();
        setIsTyping(true);

        try {
            const response = await axiosClient.post("/ai/chat", {
                messages: updatedMessages,
                title: problem.title,
                description: problem.description,
                testCases: problem.visibleTestCases,
                startCode: problem.startCode
            });
 
            setMessages(prev => [...prev, { 
                role: 'model', 
                parts:[{text: response.data.message}] 
            }]);
            
        } catch (error) {
            console.error("API Error:", error);
            toast.error(error.response?.data?.message || "Failed to communicate with AI.");
            setMessages(prev => [...prev, { 
                role: 'model', 
                parts:[{text: "Oops, something went wrong on our end. Please try again later!"}]
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-base-100 overflow-hidden border border-base-200">
            {/* Header */}
            <div className="bg-base-200/50 p-4 border-b border-base-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold shadow-sm">
                        AI
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-base-content">CodeMaster AI</h3>
                        <p className="text-xs text-base-content/60">Your personal coding assistant</p>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-base-100 relative custom-scrollbar">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div className={`max-w-[85%] rounded-2xl px-5 py-3 ${
                            msg.role === 'user' 
                                ? 'bg-primary text-primary-content rounded-br-none shadow-md' 
                                : 'bg-base-200 text-base-content rounded-bl-none border border-base-300'
                        }`}>
                            <div className="prose prose-sm max-w-none text-inherit prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent prose-pre:m-0">
                                <ReactMarkdown 
                                    components={{
                                        code({node, className, children}) {
                                            const match = /language-(\w+)/.exec(className || '')
                                            const codeString = String(children).replace(/\n$/, '')
                                            return match ? (
                                                <div className="relative group mt-3 mb-3 rounded-xl overflow-hidden border border-base-content/10 bg-[#1E1E1E]">
                                                    <div className="flex items-center justify-between px-4 py-1.5 bg-black/40 border-b border-white/10">
                                                        <span className="text-xs font-mono text-white/60">{match[1]}</span>
                                                        <button 
                                                            type="button"
                                                            onClick={() => handleCopy(codeString)}
                                                            className="text-white/60 hover:text-white transition-colors p-1"
                                                            title="Copy code"
                                                        >
                                                            {copiedText === codeString ? <CheckCircle2 size={14} className="text-success" /> : <Copy size={14} />}
                                                        </button>
                                                    </div>
                                                    <SyntaxHighlighter
                                                        children={codeString}
                                                        style={vscDarkPlus}
                                                        language={match[1]}
                                                        PreTag="div"
                                                        customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}
                                                    />
                                                </div>
                                            ) : (
                                                <code className={`${className || ''} bg-base-content/10 px-1.5 py-0.5 rounded-md font-mono text-sm`}>
                                                    {children}
                                                </code>
                                            )
                                        }
                                    }}
                                >
                                    {msg.parts[0]?.text || ''}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}
                
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-base-200 text-base-content rounded-2xl rounded-bl-none px-5 py-4 border border-base-300 flex items-center gap-1.5 w-fit">
                            <span className="w-2 h-2 bg-base-content/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-2 h-2 bg-base-content/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-2 h-2 bg-base-content/40 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="p-4 bg-base-100 border-t border-base-200"
            >
                <div className="relative flex items-center">
                    <input 
                        placeholder="Ask me anything..." 
                        className="input input-bordered w-full pr-12 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm bg-base-200/50" 
                        {...register("message", { required: true, minLength: 1 })}
                        disabled={isTyping}
                    />
                    <button 
                        type="submit" 
                        className={`absolute right-1.5 p-2 rounded-full flex items-center justify-center transition-all ${
                            (!messageValue || isTyping) 
                                ? 'bg-base-300 text-base-content/30 cursor-not-allowed' 
                                : 'bg-primary text-primary-content hover:scale-105 shadow-md'
                        }`}
                        disabled={!messageValue || isTyping}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ChatAi;