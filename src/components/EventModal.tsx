import { useState, useEffect } from "react";
import type { CalendarEvent } from "../types/calendarTypes";
import { Trash2 } from "lucide-react";
import { localDateAndTimeToUTCISO, isoAddMinutes, isoToLocalTime } from "../utils/timezoneHelpers";

interface EventModalProps {
  selectedDate: Date;
  onSave: (event: CalendarEvent) => void;
  onClose: () => void;
  existingEvent?: CalendarEvent;
  onDelete: (id: number) => void;
  defaultStartTime: string;
}

export default function EventModal({
  selectedDate,
  onSave,
  onClose,
  existingEvent,
  onDelete,
  defaultStartTime,
}: EventModalProps) {
  const isEditing = !!existingEvent;
  const [title, setTitle] = useState(isEditing ? existingEvent?.title : "");
  const [description, setDescription] = useState(isEditing ? existingEvent?.description : "");

  // Default start time set when clicking a specific hour in WeekView/DayView
  const [startTime, setStartTime] = useState<string>(
    isEditing ? isoToLocalTime(existingEvent.startTime) : defaultStartTime || "09:00"
  );
  const [endTime, setEndTime] = useState<string>(
    isEditing
      ? isoToLocalTime(existingEvent.endTime)
      : (() => {
          const [hour] = (defaultStartTime || "09:00").split(":").map(Number);
          return `${String((hour + 1) % 24).padStart(2, "0")}:00`;
        })()
  );

  useEffect(() => {
    // All times are stored in UTC, so we must convert to ISO
    if (existingEvent) {
      setTitle(existingEvent.title);
      setDescription(existingEvent.description || "");
      setStartTime(isoToLocalTime(existingEvent.startTime));
      setEndTime(isoToLocalTime(existingEvent.endTime));
    }
  }, [existingEvent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Store times in UTC ISO to preserve timezone
    const startIso = localDateAndTimeToUTCISO(selectedDate, startTime);
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    const durationMinutes = eh * 60 + em - (sh * 60 + sm);
    const endIso = isoAddMinutes(startIso, durationMinutes);

    onSave({
      id: existingEvent?.id || Date.now(),
      title,
      description,
      date: selectedDate,
      startTime: startIso,
      endTime: endIso,
    });

    onClose();
  };

  const handleDelete = () => {
    if (existingEvent && onDelete) {
      onDelete(existingEvent.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center">
      {/* Modal container */}
      <div className="relative z-1010 flex items-center justify-center min-h-screen w-full px-4">
        {/* Modal content */}
        <div className="event-modal w-full max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-(--text-primary)">
              {existingEvent ? "Edit Event" : "Add Event"}
            </h2>
            {existingEvent && (
              <button
                onClick={handleDelete}
                className="text-(--text-secondary) hover:text-red-500 transition-colors cursor-pointer"
                title="Delete event"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-lg font-medium mb-1">Title</label>
              <input
                type="text"
                className="input-field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-lg font-medium mb-1">Description</label>
              <textarea
                className="input-field"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Start / End times */}
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="block text-lg font-medium mb-1">Start</label>
                <input
                  type="time"
                  className="input-field"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-lg font-medium mb-1">End</label>
                <input
                  type="time"
                  className="input-field"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2 pt-2">
              <button type="button" onClick={onClose} className="button-secondary mr-2">
                Cancel
              </button>
              <button type="submit" className="button-primary">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
