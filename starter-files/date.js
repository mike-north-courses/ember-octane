const MONTH_NAMES = [
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

/**
 * Pad a numeric value with zeroes, if needed
 *
 * @example
 *
 * padLeadingZeroes(13, 4); // "0013"
 * padLeadingZeroes(130, 2); // "130"
 *
 * @param {number} val value
 * @param {number} digits number of digits to pad
 * @returns {string}
 */
function padLeadingZeroes(val, digits) {
  let valString = `${val}`;
  while (valString.length < digits) valString = 0 + valString;
  return valString;
}

/**
 * Create a string representation of a Date
 * @param {string|number|Date} date
 * @returns {string}
 */
export function dateToString(date) {
  if (!(typeof date === 'string' || typeof date === 'number' || date instanceof Date)) return null;
  const d = new Date(date);
  const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
  const hrsConverted = d.getHours() > 12 ? Math.abs(12 - d.getHours()) : d.getHours();

  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} ${padLeadingZeroes(
    hrsConverted,
    2
  )}:${padLeadingZeroes(d.getMinutes(), 2)}.${padLeadingZeroes(d.getSeconds(), 2)} ${ampm}`;
}
