import { Star } from "lucide-react";
import useReveal from "../hooks/useReveal";

const REVIEWS = [
  {
    name: "James M.",
    car: "BMW M3",
    text: "Absolutely outstanding work. The paint correction transformed my car — better than new. Worth every penny.",
  },
  {
    name: "Sophie R.",
    car: "Range Rover Sport",
    text: "Professional, punctual and the attention to detail is unmatched. Will be booking the monthly maintenance plan.",
  },
  {
    name: "Mark D.",
    car: "Audi RS6",
    text: "Ceramic coating job is flawless. Glossy, slick and easy to clean. The team are perfectionists.",
  },
];

export default function Reviews() {
  const ref = useReveal();
  return (
    <section id="reviews" className="relative py-24 lg:py-32 border-t border-white/8">
      <div className="mx-auto max-w-[1480px] px-6">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-14">
          <div>
            <span className="text-[10px] uppercase tracking-[0.32em] text-white/55">
              — Client Reviews
            </span>
            <h2 className="font-display text-white text-[48px] lg:text-[68px] leading-[0.95] mt-3 tracking-[0.01em]">
              TRUSTED BY <span className="silver-text">DRIVERS</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={16} fill="white" stroke="white" />
              ))}
            </div>
            <span className="text-white/65 text-sm">5.0 · 240+ reviews</span>
          </div>
        </div>

        <div ref={ref} className="reveal stagger grid md:grid-cols-3 gap-5">
          {REVIEWS.map((r, i) => (
            <div
              key={r.name}
              data-testid={`review-${i}`}
              className="p-8 rounded-2xl silver-border bg-gradient-to-b from-white/[0.04] to-transparent hover:border-white/22 transition-all duration-500"
            >
              <div className="flex gap-1 mb-5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={13} fill="white" stroke="white" />
                ))}
              </div>
              <p className="text-white/80 leading-relaxed text-base italic">
                "{r.text}"
              </p>
              <div className="mt-6 pt-5 border-t border-white/10">
                <div className="font-display text-white text-lg tracking-[0.04em]">
                  {r.name.toUpperCase()}
                </div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-white/45 mt-1">
                  {r.car}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
