
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import { useAI } from "@/hooks/useAI";
import { Message, Task, CalendarEvent } from "@/types";

interface ChatInterfaceProps {
  onTaskCreate: (task: Task) => void;
  onEventCreate: (event: CalendarEvent) => void;
}

const ChatInterface = ({ onTaskCreate, onEventCreate }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Welcome to Fokus.ai! I'm your productivity companion. Tell me what's on your mind today - whether it's about your schedule, tasks, or just how you're feeling. I'm here to help structure your day around what matters most to you.",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { generateResponse } = useAI();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const messageHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const aiResponse = await generateResponse(currentMessage, messageHistory);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.message,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (aiResponse.action && aiResponse.data) {
        processAIAction(aiResponse.action, aiResponse.data);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble processing your request right now. Please try again.",
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const processAIAction = (action: string, data: any) => {
    switch (action) {
      case 'create_task':
        const newTask: Task = {
          id: Date.now().toString(),
          title: data.title,
          completed: false,
          priority: data.priority || 'medium',
          category: data.category || 'general'
        };
        onTaskCreate(newTask);
        break;
        
      case 'create_event':
        const newEvent: CalendarEvent = {
          id: Date.now().toString(),
          title: data.title,
          time: data.time || 'TBD'
        };
        onEventCreate(newEvent);
        break;
        
      case 'setup_profile':
        const suggestedTasks: Task[] = [
          { id: 'morning-1', title: 'Morning reflection', completed: false, priority: 'high', category: 'spiritual' },
          { id: 'work-1', title: 'Check priorities for the day', completed: false, priority: 'high', category: 'work' },
          { id: 'health-1', title: 'Take a walk', completed: false, priority: 'medium', category: 'health' }
        ];
        suggestedTasks.forEach(task => onTaskCreate(task));
        break;
    }
  };

  return (
    <Card className="h-[600px] flex flex-col p-4">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 rounded-lg p-3 animate-pulse">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="flex space-x-2">
        <Input
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Tell me what's on your mind..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={isLoading}
        />
        <Button onClick={handleSendMessage} disabled={isLoading || !currentMessage.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default ChatInterface;
