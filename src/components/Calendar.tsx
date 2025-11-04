import { useState, useEffect } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import type { CalendarEvent, CalendarView } from "../types/calendarTypes";

interface StoredCalendarEvent {
  id: number;
  title: string;
  description: string;
  date: string; // stored as ISO string
  startTime: string;
  endTime: string;
  timezoneOffset: number;
}

const LOCAL_STORAGE_KEY = "calendar-events";

const deserializeEvent = (ev: StoredCalendarEvent): CalendarEvent => ({
  ...ev,
  date: new Date(ev.date),
});

export default function Calendar() {
  const [view, setView] = useState<CalendarView>("Month");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored).map(deserializeEvent) : [];
    }
  });

  // Retrieves from localstorage
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed: CalendarEvent[] = JSON.parse(stored).map((ev: StoredCalendarEvent) => {
          const date = new Date(ev.date);
          return {
            ...ev,
            date: date,
            startTime: ev.startTime,
            endTime: ev.endTime,
          };
        });

        setEvents(parsed);
      } catch (err) {
        console.error("Failed to parse stored events:", err);
      }
    }
  }, []);

  // Updates localstorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const handleAddEvent = (event: CalendarEvent) => {
    setEvents([...events, { ...event, id: Date.now() }]);
  };

  const handleUpdateEvent = (updated: CalendarEvent) => {
    setEvents(events.map((ev) => (ev.id === updated.id ? updated : ev)));
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter((ev) => ev.id !== id));
  };

  // Go to next month/week/day
  const handleNext = () => {
    const newDate = new Date(selectedDate);
    if (view === "Month") newDate.setMonth(newDate.getMonth() + 1);
    else if (view === "Week") newDate.setDate(newDate.getDate() + 7);
    else newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  // Go to prev month/week/day
  const handlePrev = () => {
    const newDate = new Date(selectedDate);
    if (view === "Month") newDate.setMonth(newDate.getMonth() - 1);
    else if (view === "Week") newDate.setDate(newDate.getDate() - 7);
    else newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  return (
    <div className="space-y-4">
      <CalendarHeader
        view={view}
        setView={setView}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onNext={handleNext}
        onPrev={handlePrev}
      />
      <CalendarGrid
        view={view}
        selectedDate={selectedDate}
        events={events}
        onAddEvent={handleAddEvent}
        onUpdateEvent={handleUpdateEvent}
        onDeleteEvent={handleDeleteEvent}
      />
    </div>
  );
}
