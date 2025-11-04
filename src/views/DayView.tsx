import EventCard from "../components/EventCard";
import { isoToLocalTime, minutesBetweenISOs, isoAddMinutes } from "../utils/timezoneHelpers";
import type { CalendarEvent } from "../types/calendarTypes";

interface Props {
  selectedDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onHourClick: (date: Date, hour: number) => void;
  onUpdateEvent: (event: CalendarEvent) => void;
}

export default function DayView({ selectedDate, events, onEventClick, onHourClick, onUpdateEvent }: Props) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const HOUR_HEIGHT = 60;

  const handleDragStart = (e: React.DragEvent, event: CalendarEvent) => {
    e.dataTransfer.setData("application/json", JSON.stringify(event));
  };

  const handleDropOnHour = (e: React.DragEvent, hour: number) => {
    e.preventDefault();
    const json = e.dataTransfer.getData("application/json");
    if (!json) return;

    // Preserve duration when dragging to new time
    const dragged: CalendarEvent = JSON.parse(json);
    const duration = minutesBetweenISOs(dragged.startTime, dragged.endTime);

    const newStart = new Date(selectedDate);
    newStart.setHours(hour, 0, 0, 0);
    const startIso = newStart.toISOString();
    const endIso = isoAddMinutes(startIso, duration);

    onUpdateEvent({ ...dragged, startTime: startIso, endTime: endIso });
  };

  const dayEvents = events
    .filter((ev) => new Date(ev.startTime).toDateString() === selectedDate.toDateString())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  return (
    <div className="flex border-t border-(--border-color) h-[calc(100vh-150px)] overflow-y-auto bg-(--bg-base)">
      {/* Hour labels */}
      <div className="w-16 text-(--text-secondary) text-xs flex flex-col">
        {hours.map((h) => (
          <div
            key={h}
            style={{ minHeight: HOUR_HEIGHT }}
            className="border-r-2 border-(--border-color) flex items-start justify-end pr-1 pt-5"
          >
            {h}:00
          </div>
        ))}
      </div>

      {/* Day column */}
      <div className="flex-1 relative border-l border-(--border-color)">
        <div className="text-center border-b border-(--border-color) text-sm font-medium py-1 sticky top-0 bg-(--bg-base) z-10">
          {selectedDate.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
        </div>

        {hours.map((h) => (
          <div
            key={h}
            style={{ height: HOUR_HEIGHT }}
            className="border-b border-(--border-color) hover:bg-(--bg-panel)"
            onClick={() => onHourClick(selectedDate, h)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDropOnHour(e, h)}
          />
        ))}

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
    </div>
  );
}
