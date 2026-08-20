export function formatDateInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  return digits.replace(/(\d{2})(\d)/, '$1/$2').replace(/(\d{2})(\d{1,4})$/, '$1/$2');
}

export function isValidDateInput(value: string) {
  const digits = value.replace(/\D/g, '');
  if (digits.length !== 8) {
    return false;
  }
  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));
  const date = new Date(year, month - 1, day);
  const isRealDate =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return isRealDate && date.getTime() <= Date.now();
}

/** Converts a "dd/mm/aaaa" input into an ISO "aaaa-mm-dd" string for the API. */
export function toIsoDate(value: string) {
  const digits = value.replace(/\D/g, '');
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  return `${year}-${month}-${day}`;
}
