function DateDisplay() {
  const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="date-display">
      {formatter.format(new Date())}
    </div>
  );
}

export default DateDisplay;
