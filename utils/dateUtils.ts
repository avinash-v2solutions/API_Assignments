import dayjs from 'dayjs';  // Import dayjs
import utc from 'dayjs/plugin/utc';  // Import the utc plugin

// Extend dayjs with the utc plugin
dayjs.extend(utc);

/**
 * Converts a UTC date string to IST (UTC +5:30)
 * @param {string} utcDate - UTC date string
 * @returns {string} - Date string in IST
 */
export function convertDate(utcDate: string): string {
  return dayjs.utc(utcDate).add(5, 'hours').add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss');
}
