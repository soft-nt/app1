type DateDisplayProps = {
  color: string;
};

function DateDisplay({ color }: DateDisplayProps) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="date-display" style={{ color }}>
      {formatter.format(new Date())}
    </div>
  );
}

export default DateDisplay;
