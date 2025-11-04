export const isoToLocalTime = (iso: string) => {
  const d = new Date(iso); // JS converts ISO (UTC) -> local
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

export const isoToLocalDate = (iso: string) => {
  const d = new Date(iso);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

export const localDateAndTimeToUTCISO = (localDate: Date, timeHHMM: string) => {
  const [hh, mm] = timeHHMM.split(":").map(Number);
  const local = new Date(localDate);
  local.setHours(hh, mm, 0, 0);
  // toISOString returns UTC ISO
  return local.toISOString();
};

export const isoAddMinutes = (iso: string, minutes: number) => {
  const d = new Date(iso);
  d.setTime(d.getTime() + minutes * 60 * 1000);
  return d.toISOString();
};

export const minutesBetweenISOs = (startIso: string, endIso: string) =>
  Math.round((new Date(endIso).getTime() - new Date(startIso).getTime()) / 60000);
