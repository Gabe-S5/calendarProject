import EventCard from "../components/EventCard";
import { isoToLocalTime, minutesBetweenISOs, isoAddMinutes } from "../utils/timezoneHelpers";
import type { CalendarEvent } from "../types/calendarTypes";

interface Props {
  selectedDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDayClick: (date: Date) => void;
  onHourClick: (date: Date, hour: number) => void;
  onUpdateEvent: (event: CalendarEvent) => void;
}

export default function WeekView({ selectedDate, events, onEventClick, onHourClick, onUpdateEvent }: Props) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const HOUR_HEIGHT = 60;
  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const handleDragStart = (e: React.DragEvent, event: CalendarEvent) => {
    e.dataTransfer.setData("application/json", JSON.stringify(event));
  };

  const handleDropOnHour = (e: React.DragEvent, date: Date, hour: number) => {
    e.preventDefault();
    const json = e.dataTransfer.getData("text/plain");
    if (!json) return;

    // Preserve duration when dragging to new time
    const dragged: CalendarEvent = JSON.parse(json);
    const duration = minutesBetweenISOs(dragged.startTime, dragged.endTime);

    const newStart = new Date(date);
    newStart.setHours(hour, 0, 0, 0);
    const startIso = newStart.toISOString();
    const endIso = isoAddMinutes(startIso, duration);

    onUpdateEvent({ ...dragged, date: date, startTime: startIso, endTime: endIso });
  };

  return (
    <div className="flex h-[calc(100vh-150px)] overflow-y-auto bg-(--bg-base)">
      {/* Hour labels */}
      <div className="w-12 text-(--text-secondary) text-xs flex flex-col">
        {hours.map((h) => (
          <div
            key={h}
            style={{ minHeight: HOUR_HEIGHT }}
            className="border-r-2 border-(--border-color) flex items-start justify-end pr-1 pt-6"
          >
            {h}:00
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-7">
        {days.map((date) => {
          const dayEvents = events
            .filter((ev) => new Date(ev.startTime).toDateString() === date.toDateString())
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

          return (
            <div key={date.toISOString()} className="border-r border-(--border-color) relative">
              {/* Header */}
              <div className="text-center border-y-2 border-(--border-color) text-sm font-medium py-1 sticky top-0 bg-(--bg-base) z-10">
                {date.toLocaleDateString(undefined, { weekday: "short", day: "numeric" })}
              </div>

              {/* Hour grid */}
              {hours.map((h) => (
                <div
                  key={h}
                  style={{ height: HOUR_HEIGHT }}
                  className="border-b border-(--border-color) hover:bg-(--bg-panel)"
                  onClick={() => onHourClick(date, h)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDropOnHour(e, date, h)}
                />
              ))}

              {/* Events */}
              {dayEvents.map((ev) => {
                const [startHour, startMin] = isoToLocalTime(ev.startTime).split(":").map(Number);
                const top = startHour * HOUR_HEIGHT + (startMin / 60) * HOUR_HEIGHT + 28;

                return (
                  <div key={ev.id} style={{ position: "absolute", top, left: "0.25rem", right: "0.25rem" }}>
                    <EventCard event={ev} onClick={onEventClick} onDragStart={handleDragStart} />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
