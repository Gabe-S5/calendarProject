import { useState } from "react";
import type { CalendarEvent, CalendarView } from "../types/calendarTypes";
import EventModal from "./EventModal";

import MonthView from "../views/MonthView";
import WeekView from "../views/WeekView";
import DayView from "../views/DayView";

interface Props {
  view: CalendarView;
  selectedDate: Date;
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
  onUpdateEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: number) => void;
}

export default function CalendarGrid({ view, selectedDate, events, onAddEvent, onUpdateEvent, onDeleteEvent }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [modalDate, setModalDate] = useState<Date | null>(null);
  const [defaultStartTime, setDefaultStartTime] = useState("");

  // EventCard Handlers
  // Month View Day Click
  const handleDayClick = (date: Date) => {
    setEditingEvent(null);
    setModalDate(date);
    setShowModal(true);
  };

  // Week/Day View Hour Click
  const handleHourClick = (date: Date, hour: number) => {
    setEditingEvent(null);
    setModalDate(date);
    setDefaultStartTime(`${hour.toString().padStart(2, "0")}:00`);
    setShowModal(true);
  };

  // Event Card Click
  const handleEventClick = (event: CalendarEvent) => {
    setEditingEvent(event);
    setModalDate(event.date);
    setShowModal(true);
  };

  // EventModal Handlers
  // Event Modal Save
  const handleSaveEvent = (event: CalendarEvent) => {
    if (editingEvent) onUpdateEvent(event);
    else onAddEvent(event);
    setShowModal(false);
  };

  // Event Modal Delete
  const handleDeleteEvent = (id: number) => {
    onDeleteEvent(id);
    setShowModal(false);
  };

  const viewProps = {
    selectedDate,
    events,
    onEventClick: handleEventClick,
    onDayClick: handleDayClick,
    onHourClick: handleHourClick,
    onUpdateEvent,
  };

  return (
    <div>
      {/* View Switch */}
      {view === "Month" && <MonthView {...viewProps} />}
      {view === "Week" && <WeekView {...viewProps} />}
      {view === "Day" && <DayView {...viewProps} />}

      {showModal && modalDate && (
        <EventModal
          selectedDate={modalDate}
          existingEvent={editingEvent || undefined}
          onSave={handleSaveEvent}
          onClose={() => setShowModal(false)}
          onDelete={handleDeleteEvent}
          defaultStartTime={defaultStartTime}
        />
      )}
    </div>
  );
}
