import { DateTime } from "luxon";

// Function to format the date to 'DD.MM'
export function formatDate(date: Date) {
  const day = date.getDate();
  const month = date.getMonth();
  const MonthString = monthsLongForm[month];
  return `${day} ${MonthString}`;
}

// Function to format the time to 'HH:MM'
export function formatTime(date: Date) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export const getCurrentDateTimeString = () => {
  return DateTime.local().toISO();
};


export const monthsLongForm: string[] = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];

export const monthsShortForm: string[] = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const daysLongForm: string[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
]
