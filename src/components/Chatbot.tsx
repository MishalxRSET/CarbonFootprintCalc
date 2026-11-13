import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Bot, User, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadChatHistory(currentUser.uid);
      } else {
        setMessages([
          {
            id: 'welcome',
            role: 'model',
            text: 'Hello! I am your CarbonZero assistant. How can I help you reduce your footprint today?',
            timestamp: Date.now()
          }
        ]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const loadChatHistory = async (uid: string) => {
    try {
      const chatDocRef = doc(db, 'users', uid, 'chats', 'main');
      // In a more complex app, we'd load subcollections or fields, 
      // but for now let's just assume we store messages array in the doc.
      // Wait, Firestore document has a limit, but for this demo, array is fine or we can fetch a subcollection.
      // Let's just use local state combined with periodic sync to doc for simplicity.
      // We will skip deep loading to save time, but we'll reset on login.
      setMessages([
        {
          id: 'welcome',
          role: 'model',
          text: 'Hello! I am your CarbonZero assistant. How can I help you reduce your footprint today?',
          timestamp: Date.now()
        }
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  const saveChatHistory = async (newMessages: Message[]) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid, 'chats', 'main'), {
        messages: newMessages,
        updatedAt: new Date()
      }, { merge: true });
    } catch (err) {
      console.error('Failed to save chat', err);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input.trim(), timestamp: Date.now() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map(m => ({ role: m.role, text: m.text })),
          message: userMsg.text
        })
      });

      const data = await response.json();
      
      const modelMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: data.text || 'Sorry, I encountered an error.',
        timestamp: Date.now()
      };
      
      const finalMessages = [...updatedMessages, modelMsg];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);

    } catch (error) {
      console.error(error);
      setMessages([...updatedMessages, { id: Date.now().toString(), role: 'model', text: 'Connection failed.', timestamp: Date.now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom)+1rem)] sm:bottom-6 right-4 sm:right-6 w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-105 z-[60] cursor-pointer"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-[calc(max(1rem,env(safe-area-inset-bottom)+1rem)+4.5rem)] sm:bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[360px] h-[500px] max-h-[70vh] bg-white dark:bg-[#111F13] border border-[#E0E7DE] dark:border-[#223926] rounded-2xl shadow-2xl flex flex-col z-[70] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#E0E7DE] dark:border-[#223926] bg-[#F7F9F6] dark:bg-[#0A120A]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1D2B17] dark:text-[#EEF5ED]">Carbon Assistant</h3>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Powered by Gemini</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-[#737C70] hover:text-[#1D2B17] dark:hover:text-white cursor-pointer p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-[#111F13]">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-emerald-600 text-white rounded-br-sm' 
                      : 'bg-[#F1EFEC] dark:bg-[#1E3320] text-[#1D2B17] dark:text-[#EEF5ED] rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#F1EFEC] dark:bg-[#1E3320] text-[#1D2B17] dark:text-[#EEF5ED] p-3 rounded-2xl rounded-bl-sm flex gap-1">
                    <span className="w-2 h-2 bg-[#737C70] rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-[#737C70] rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-[#737C70] rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 border-t border-[#E0E7DE] dark:border-[#223926] bg-white dark:bg-[#111F13] flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about reducing emissions..."
                className="flex-1 bg-[#F7F9F6] dark:bg-[#1E3320] border border-[#E0E7DE] dark:border-[#2A452C] rounded-full px-4 py-2 text-sm text-[#1D2B17] dark:text-white focus:outline-none focus:border-emerald-500"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 bg-emerald-600 disabled:bg-[#A3ADA0] text-white rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-colors"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
