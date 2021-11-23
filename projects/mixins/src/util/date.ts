export function compareDates(
  comparator: (a: Date, b: Date) => boolean,
  ...dates: Date[]
): Date {
  let date = dates[0];

  for (let i = 1; i < dates.length; i++) {
    if (comparator(date, dates[i])) {
      date = dates[i];
    }
  }

  return date;
}

export function getMinDate(...dates: Date[]): Date {
  return compareDates(
    (a: Date, b: Date) => a.getTime() < b.getTime(),
    ...dates
  );
}

export function getMaxDate(...dates: Date[]): Date {
  return compareDates(
    (a: Date, b: Date) => a.getTime() > b.getTime(),
    ...dates
  );
}
