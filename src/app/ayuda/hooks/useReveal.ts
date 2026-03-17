import { useEffect, useRef } from "react";
export function useReveal(extraDelay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const targets: Element[] = container.classList.contains("ay-reveal")
      ? [container]
      : Array.from(container.querySelectorAll(".ay-reveal"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        targets.forEach((el, i) => setTimeout(() => el.classList.add("ay-visible"), extraDelay + i * 80));
        observer.disconnect();
      });
    }, { threshold: 0.07 });
    observer.observe(container);
    return () => observer.disconnect();
  }, [extraDelay]);
  return ref;
}
