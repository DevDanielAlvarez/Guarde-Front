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

export function formatTimeInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  return digits.replace(/(\d{2})(\d{1,2})$/, '$1:$2');
}

/** Parses "dd/mm/aaaa" + "HH:mm" and checks it's a real date/time in the future. */
export function isValidFutureDateTimeInput(dateValue: string, timeValue: string) {
  const dateDigits = dateValue.replace(/\D/g, '');
  const timeDigits = timeValue.replace(/\D/g, '');
  if (dateDigits.length !== 8 || timeDigits.length !== 4) {
    return false;
  }

  const day = Number(dateDigits.slice(0, 2));
  const month = Number(dateDigits.slice(2, 4));
  const year = Number(dateDigits.slice(4, 8));
  const hour = Number(timeDigits.slice(0, 2));
  const minute = Number(timeDigits.slice(2, 4));
  const date = new Date(year, month - 1, day, hour, minute);

  const isRealDate =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date.getHours() === hour &&
    date.getMinutes() === minute;

  return isRealDate && date.getTime() > Date.now();
}

/** Converts "dd/mm/aaaa" + "HH:mm" input into an ISO datetime string for the API. */
export function toIsoDateTime(dateValue: string, timeValue: string) {
  const dateDigits = dateValue.replace(/\D/g, '');
  const timeDigits = timeValue.replace(/\D/g, '');
  const day = dateDigits.slice(0, 2);
  const month = dateDigits.slice(2, 4);
  const year = dateDigits.slice(4, 8);
  const hour = timeDigits.slice(0, 2);
  const minute = timeDigits.slice(2, 4);
  return `${year}-${month}-${day}T${hour}:${minute}:00`;
}

/** Formats an ISO datetime string as "dd/mm/aaaa às HH:mm" for display. */
export function formatAppointmentDateTime(isoValue: string) {
  const date = new Date(isoValue);
  const datePart = date.toLocaleDateString('pt-BR');
  const timePart = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${datePart} às ${timePart}`;
}
