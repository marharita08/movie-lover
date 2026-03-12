import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export const useScrollRestoration = (isReady: boolean = true) => {
  const location = useLocation();
  const scrollKey = `scroll_${location.key}`;
  const isRestoredRef = useRef(false);

  // Зберігаємо позицію
  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem(scrollKey, String(window.scrollY));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollKey]);

  // Скидаємо при зміні сторінки
  useEffect(() => {
    isRestoredRef.current = false;
  }, [location.key]);

  // Відновлюємо коли всі дані завантажились
  useEffect(() => {
    if (!isReady || isRestoredRef.current) return;

    const saved = sessionStorage.getItem(scrollKey);
    if (!saved) {
      isRestoredRef.current = true;
      return;
    }

    requestAnimationFrame(() => {
      window.scrollTo(0, parseInt(saved));
      isRestoredRef.current = true;
    });
  }, [isReady, scrollKey]);
};
