import { useEffect, useState } from "react";

const INITIAL_SECONDS = 60;

export const useOtpCountdown = () => {
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  const reset = () => {
    setSecondsLeft(INITIAL_SECONDS);
  };

  return {
    secondsLeft,
    isFinished: secondsLeft <= 0,
    reset,
  };
};
