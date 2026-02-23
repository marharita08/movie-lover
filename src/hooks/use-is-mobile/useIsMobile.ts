import { useEffect, useState } from "react";

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let timeoutId: number;
    const check = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(
        () => setIsMobile(window.innerWidth < 768),
        100,
      );
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
};
