import type { CalendarView } from "../types/calendarTypes";

interface CalendarHeaderProps {
  view: CalendarView;
  setView: (view: CalendarView) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function CalendarHeader({ view, setView, selectedDate, onNext, onPrev }: CalendarHeaderProps) {
  const formatHeaderTitle = () => {
    const options: Intl.DateTimeFormatOptions =
      view === "Month"
        ? { month: "long", year: "numeric" }
        : view === "Week"
        ? { month: "long", day: "numeric", year: "numeric" }
        : { weekday: "long", month: "long", day: "numeric", year: "numeric" };

    return selectedDate.toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-(--border-color) bg-(--bg-panel)">
      {/* Left Section: Current Date and Move to Next/Prev Dates */}
      <div className="flex items-center gap-4">
        <button onClick={onPrev} className="button-active" aria-label="Previous">
          ←
        </button>
        <h2 className="text-lg font-semibold text-(--text-primary)">{formatHeaderTitle()}</h2>
        <button onClick={onNext} className="button-active" aria-label="Next">
          →
        </button>
      </div>

      {/* Middle Section: App Title */}
      <h2 className="text-xl font-bold text-(--text-primary)">Gabe's Calendar Planner</h2>

      {/* Right Section: View Switcher */}
      <div className="flex gap-2">
        {(["Month", "Week", "Day"] as CalendarView[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`calendar-view-btn ${view === v ? "button-active" : "button-inactive"}`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
