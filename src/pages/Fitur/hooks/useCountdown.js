import { useState, useEffect } from 'react';

const calculateCountdown = (launchDate) => {
  const now = new Date().getTime();
  const distance = launchDate - now;

  if (distance > 0) {
    const years = Math.floor(distance / (1000 * 60 * 60 * 24 * 365));
    const days = Math.floor((distance % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return { years, days, hours, minutes, seconds };
  }

  return { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
};

const useCountdown = (launchDate) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateCountdown(launchDate));

  useEffect(() => {
    setTimeLeft(calculateCountdown(launchDate));

    const interval = setInterval(() => {
      setTimeLeft(calculateCountdown(launchDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [launchDate]);

  return timeLeft;
};

export default useCountdown;
