const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const isValidDateString = (value) => {
  if (!DATE_REGEX.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() + 1 === month &&
    parsed.getUTCDate() === day
  );
};

const parseDateStringToUTC = (value) => {
  if (!isValidDateString(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

const formatUTCDateToString = (dateObject) => {
  return new Date(dateObject).toISOString().slice(0, 10);
};

module.exports = {
  DATE_REGEX,
  isValidDateString,
  parseDateStringToUTC,
  formatUTCDateToString,
};
