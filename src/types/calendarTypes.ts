export type CalendarView = "Month" | "Week" | "Day";

export interface CalendarEvent {
  id: number;
  description: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
}
