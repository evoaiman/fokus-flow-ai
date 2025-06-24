
import { Card } from "@/components/ui/card";
import { CheckSquare, Calendar } from "lucide-react";
import TaskTimeline from "@/components/TaskTimeline";
import CalendarView from "@/components/CalendarView";
import { Task, CalendarEvent } from "@/types";

interface SidebarProps {
  tasks: Task[];
  events: CalendarEvent[];
  onTaskUpdate: (tasks: Task[]) => void;
}

const Sidebar = ({ tasks, events, onTaskUpdate }: SidebarProps) => {
  return (
    <div className="space-y-6">
      {/* Today's Tasks */}
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <CheckSquare className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Today's Tasks</h3>
        </div>
        <TaskTimeline tasks={tasks} onTaskUpdate={onTaskUpdate} />
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
  );
};

export default Sidebar;
