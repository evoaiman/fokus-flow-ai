
import { Clock, Calendar } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  duration?: string;
}

interface CalendarViewProps {
  events: CalendarEvent[];
}

const CalendarView = ({ events }: CalendarViewProps) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No events scheduled. Tell me about your meetings!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div key={event.id} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <Clock className="w-4 h-4 text-green-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800">{event.title}</p>
            <p className="text-xs text-green-600 font-medium">{event.time}</p>
            {event.duration && (
              <p className="text-xs text-gray-500">{event.duration}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CalendarView;
