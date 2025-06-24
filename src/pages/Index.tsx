
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Calendar, CheckSquare, User } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import TaskTimeline from "@/components/TaskTimeline";
import CalendarView from "@/components/CalendarView";

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

    // Simulate AI processing (we'll replace this with actual OpenAI integration)
    setTimeout(() => {
      const aiResponse = generateAIResponse(currentMessage);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.message,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Process any actions from the AI response
      if (aiResponse.action) {
        processAIAction(aiResponse.action, aiResponse.data);
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    // Profile setup detection
    if (input.includes('i\'m') || input.includes('my name is') || input.includes('muslim') || input.includes('christian') || input.includes('work')) {
      return {
        message: "Thank you for sharing that with me! I'll help structure your day around your values and schedule. Let me create a balanced routine that respects your priorities and spiritual practices.",
        action: 'setup_profile',
        data: { name: extractName(userInput), religion: extractReligion(userInput) }
      };
    }
    
    // Meeting/event detection
    if (input.includes('meeting') || input.includes('call') || input.includes('appointment') || input.includes('at ')) {
      const time = extractTime(userInput);
      const title = extractEventTitle(userInput);
      return {
        message: `I've added "${title}" to your calendar${time ? ` at ${time}` : ''}. Would you like me to set a reminder or block time for preparation?`,
        action: 'create_event',
        data: { title, time }
      };
    }
    
    // Task detection
    if (input.includes('need to') || input.includes('have to') || input.includes('should') || input.includes('remind me')) {
      const task = extractTask(userInput);
      return {
        message: `I've added "${task}" to your task list. Would you like me to suggest the best time to work on this based on your schedule?`,
        action: 'create_task',
        data: { title: task, priority: 'medium' }
      };
    }
    
    // Default response
    return {
      message: "I understand. How would you like me to help you organize this in your day? I can help with scheduling, task management, or just thinking through your priorities.",
      action: null,
      data: null
    };
  };

  const processAIAction = (action: string, data: any) => {
    switch (action) {
      case 'create_task':
        const newTask: Task = {
          id: Date.now().toString(),
          title: data.title,
          completed: false,
          priority: data.priority || 'medium',
          category: 'general'
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

  // Helper functions for extracting information
  const extractName = (text: string) => {
    const nameMatch = text.match(/i'?m\s+(\w+)|my name is\s+(\w+)/i);
    return nameMatch ? (nameMatch[1] || nameMatch[2]) : '';
  };

  const extractReligion = (text: string) => {
    if (text.toLowerCase().includes('muslim')) return 'muslim';
    if (text.toLowerCase().includes('christian')) return 'christian';
    return '';
  };

  const extractTime = (text: string) => {
    const timeMatch = text.match(/(\d{1,2})\s*(?::(\d{2}))?\s*(am|pm|AM|PM)?/);
    return timeMatch ? timeMatch[0] : null;
  };

  const extractEventTitle = (text: string) => {
    if (text.toLowerCase().includes('meeting')) return 'Meeting';
    if (text.toLowerCase().includes('call')) return 'Call';
    if (text.toLowerCase().includes('appointment')) return 'Appointment';
    return 'Event';
  };

  const extractTask = (text: string) => {
    const taskPatterns = [
      /need to (.+)/i,
      /have to (.+)/i,
      /should (.+)/i,
      /remind me to (.+)/i
    ];
    
    for (const pattern of taskPatterns) {
      const match = text.match(pattern);
      if (match) return match[1];
    }
    
    return text;
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
