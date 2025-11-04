import type { CalendarEvent } from "../types/calendarTypes";
import { isoToLocalTime } from "../utils/timezoneHelpers";

interface EventCardProps {
  event: CalendarEvent;
  onClick: (event: CalendarEvent) => void;
  onDragStart: (e: React.DragEvent, event: CalendarEvent) => void;
}

export default function EventCard({ event, onClick, onDragStart }: EventCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents overlapping click events
    onClick(event);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    if (onDragStart) onDragStart(e, event);
    e.dataTransfer.setData("text/plain", JSON.stringify(event)); // store event data
  };

  return (
    <li
      draggable={true}
      onClick={handleClick}
      onDragStart={handleDragStart}
      className="event-card p-1 rounded mt-2 cursor-pointer"
    >
      {event.title}
      <p className="text-[10px] opacity-80">{`${isoToLocalTime(event.startTime)} - ${isoToLocalTime(
        event.endTime
      )}`}</p>
    </li>
  );
}
