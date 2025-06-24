
import { useState } from 'react';
import AppHeader from "@/components/AppHeader";
import ChatInterface from "@/components/ChatInterface";
import Sidebar from "@/components/Sidebar";
import { Task, CalendarEvent } from "@/types";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const handleTaskCreate = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const handleEventCreate = (event: CalendarEvent) => {
    setEvents(prev => [...prev, event]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6">
        <AppHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface - Main Column */}
          <div className="lg:col-span-2">
            <ChatInterface 
              onTaskCreate={handleTaskCreate}
              onEventCreate={handleEventCreate}
            />
          </div>

          {/* Sidebar */}
          <Sidebar 
            tasks={tasks}
            events={events}
            onTaskUpdate={setTasks}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
