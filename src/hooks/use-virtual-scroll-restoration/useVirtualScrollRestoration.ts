import type { Virtualizer } from "@tanstack/react-virtual";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useVirtualScrollRestoration = (
  virtualizer: Virtualizer<HTMLDivElement, Element>,
  containerRef: React.RefObject<HTMLDivElement>,
  isReady: boolean,
) => {
  const location = useLocation();
  const scrollKey = `scroll_${location.key}`;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollTop = el.scrollTop;
      const firstVisible = virtualizer
        .getVirtualItems()
        .find((item) => item.start >= scrollTop);

      const index = firstVisible?.index ?? 0;
      sessionStorage.setItem(scrollKey, String(index));
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [scrollKey, virtualizer, containerRef]);

  useEffect(() => {
    if (!isReady) return;
    const saved = sessionStorage.getItem(scrollKey);
    if (!saved) return;

    requestAnimationFrame(() => {
      virtualizer.scrollToIndex(parseInt(saved), { align: "start" });
    });
  }, [isReady, scrollKey, virtualizer]);
};
