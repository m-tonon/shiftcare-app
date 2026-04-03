export function isToday(date: string): boolean {
  return date === new Date().toISOString().split('T')[0];
}

export function formatShortDate(date: string): string {
  return new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
