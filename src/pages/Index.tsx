
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Calendar, CheckSquare } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import TaskTimeline from "@/components/TaskTimeline";
import CalendarView from "@/components/CalendarView";
import { useAI } from "@/hooks/useAI";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  duration?: string;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Welcome to Fokus.ai! I'm your productivity companion. Tell me what's on your mind today - whether it's about your schedule, tasks, or just how you're feeling. I'm here to help structure your day around what matters most to you.",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  
  const [currentMessage, setCurrentMessage] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
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
      // Prepare context for AI
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
      
      // Process any actions from the AI response
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
        setTasks(prev => [...prev, newTask]);
        break;
        
      case 'create_event':
        const newEvent: CalendarEvent = {
          id: Date.now().toString(),
          title: data.title,
          time: data.time || 'TBD'
        };
        setEvents(prev => [...prev, newEvent]);
        break;
        
      case 'setup_profile':
        // Create suggested tasks based on profile
        const suggestedTasks: Task[] = [
          { id: 'morning-1', title: 'Morning reflection', completed: false, priority: 'high', category: 'spiritual' },
          { id: 'work-1', title: 'Check priorities for the day', completed: false, priority: 'high', category: 'work' },
          { id: 'health-1', title: 'Take a walk', completed: false, priority: 'medium', category: 'health' }
        ];
        setTasks(prev => [...prev, ...suggestedTasks]);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Fokus.ai</h1>
          <p className="text-gray-600">Your conversational productivity companion</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface - Main Column */}
          <div className="lg:col-span-2">
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Tasks */}
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-4">
                <CheckSquare className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-800">Today's Tasks</h3>
              </div>
              <TaskTimeline tasks={tasks} onTaskUpdate={setTasks} />
            </Card>

            {/* Calendar Events */}
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-800">Today's Schedule</h3>
              </div>
              <CalendarView events={events} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
