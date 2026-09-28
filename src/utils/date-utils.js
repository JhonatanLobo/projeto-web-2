export const TIME_ZONE = 'America/Fortaleza';

const localDateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  calendar: 'gregory',
  numberingSystem: 'latn',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  fractionalSecondDigits: 3,
  hourCycle: 'h23',
  timeZoneName: 'longOffset',
});

const weekdayFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  weekday: 'short',
});

export function formatFortalezaTimestamp(date = new Date()) {
  const parts = Object.fromEntries(
    localDateTimeFormatter.formatToParts(date).map(({ type, value }) => [type, value]),
  );
  const offset = parts.timeZoneName.replace('GMT', '') || '+00:00';

  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}.${parts.fractionalSecond}${offset}`;
}

export function isWeekday(date = new Date()) {
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(weekdayFormatter.format(date));
}

export function isValidDateParam(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function filterLogsByDate(logs, date) {
  return logs.filter((entry) => entry.timestamp?.slice(0, 10) === date);
}
