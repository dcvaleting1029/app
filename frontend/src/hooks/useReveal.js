import { useEffect, useRef } from "react";

export default function useReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            if (options.once !== false) obs.unobserve(entry.target);
          }
        });
      },
      { threshold: options.threshold ?? 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [options.once, options.threshold]);

  return ref;
}
