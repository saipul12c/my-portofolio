import { useState, useEffect } from 'react';

const useCountdown = (launchDate) => {
  const calculateTime = () => {
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

  const [timeLeft, setTimeLeft] = useState(calculateTime);

  useEffect(() => {
    setTimeLeft(calculateTime());

    const interval = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [launchDate]);

  return timeLeft;
};

export default useCountdown;
