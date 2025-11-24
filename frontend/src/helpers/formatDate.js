import { format, parseISO, isValid } from 'date-fns';

export const formatDate = (dateString, fallback = "-") => {
  if (!dateString) return fallback;

  const date = parseISO(dateString);
  if (!isValid(date)) return fallback;

  return format(date, 'd MMM yyyy, HH:mm');
};