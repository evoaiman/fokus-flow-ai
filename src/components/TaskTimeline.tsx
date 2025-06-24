
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Clock } from "lucide-react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

interface TaskTimelineProps {
  tasks: Task[];
  onTaskUpdate: (tasks: Task[]) => void;
}

const TaskTimeline = ({ tasks, onTaskUpdate }: TaskTimelineProps) => {
  const toggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    onTaskUpdate(updatedTasks);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'spiritual': return '🙏';
      case 'work': return '💼';
      case 'health': return '🏃';
      default: return '📝';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No tasks yet. Share what you need to do!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-start space-x-3 group">
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-auto"
            onClick={() => toggleTask(task.id)}
          >
            {task.completed ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
            )}
          </Button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm">{getCategoryIcon(task.category)}</span>
              <p className={`text-sm font-medium ${
                task.completed ? 'line-through text-gray-500' : 'text-gray-800'
              }`}>
                {task.title}
              </p>
            </div>
            <p className={`text-xs ${getPriorityColor(task.priority)} capitalize`}>
              {task.priority} priority
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskTimeline;
