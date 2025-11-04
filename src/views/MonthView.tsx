import EventCard from "../components/EventCard";
import type { CalendarEvent } from "../types/calendarTypes";

interface Props {
  selectedDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDayClick: (date: Date) => void;
  onUpdateEvent: (event: CalendarEvent) => void;
}

export default function MonthView({ selectedDate, events, onEventClick, onDayClick, onUpdateEvent }: Props) {
  const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const startDay = startOfMonth.getDay();
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startDay);

  const days: Date[] = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    return d;
  });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeks = Array.from({ length: 6 }, (_, i) => days.slice(i * 7, i * 7 + 7));

  const handleDragStart = (e: React.DragEvent, event: CalendarEvent) => {
    e.dataTransfer.setData("application/json", JSON.stringify(event));
  };

  const handleDropOnDay = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    const json = e.dataTransfer.getData("application/json");
    if (!json) return;

    // Start/End time remains the same
    const dragged: CalendarEvent = JSON.parse(json);
    const start = new Date(dragged.startTime);
    const end = new Date(dragged.endTime);
    const duration = end.getTime() - start.getTime();

    const newStart = new Date(date);
    newStart.setHours(start.getHours(), start.getMinutes(), 0, 0);
    const newEnd = new Date(newStart.getTime() + duration);

    onUpdateEvent({ ...dragged, startTime: newStart.toISOString(), endTime: newEnd.toISOString() });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-150px)] overflow-y-auto bg-(--bg-base) px-4">
      {/* Day of week header */}
      <div className="grid grid-cols-7 border-y border-(--border-color) text-center text-sm font-medium sticky top-0 bg-(--bg-base) z-10">
        {weekDays.map((day) => (
          <div key={day} className="py-2 border-x border-(--border-color) text-(--text-primary)">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 grid grid-rows-6 grid-cols-7 border-t border-l border-(--border-color) min-h-220">
        {weeks.flat().map((date) => {
          const dayEvents = events.filter((ev) => new Date(ev.startTime).toDateString() === date.toDateString());

          const isCurrentMonth = date.getMonth() === selectedDate.getMonth();

          return (
            <div
              key={date.toISOString()}
              className={`border-r border-b border-(--border-color) p-1 relative hover:bg-(--bg-panel) ${
                !isCurrentMonth ? "opacity-50" : ""
              }`}
              onClick={() => onDayClick(date)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDropOnDay(e, date)}
            >
              <div className="text-xs font-medium mb-1 text-right">{date.getDate()}</div>

              <div className="space-y-1">
                {dayEvents.map((ev) => (
                  <EventCard key={ev.id} event={ev} onClick={onEventClick} onDragStart={handleDragStart} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
