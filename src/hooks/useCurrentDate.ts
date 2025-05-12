import { useState, useEffect } from 'react';

export function useCurrentDate() {
  const [date, setDate] = useState(formatDate(new Date()));

  useEffect(() => {
    // Update date at midnight
    const timer = setInterval(() => {
      setDate(formatDate(new Date()));
    }, 60000); // Check every minute

    return () => clearInterval(timer);
  }, []);

  return date;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}