import { Award, Heart, Clock, BadgeCheck } from "lucide-react";
import useReveal from "../hooks/useReveal";

const items = [
  {
    n: "01",
    icon: Award,
    title: "Experienced & Trusted",
    desc: "Years of hands-on detailing experience across all vehicle types.",
  },
  {
    n: "02",
    icon: Heart,
    title: "Passion For Detail",
    desc: "Every panel, every reflection, every finish — handled with care.",
  },
  {
    n: "03",
    icon: Clock,
    title: "Convenient Service",
    desc: "Mobile or workshop. Flexible hours that fit around your schedule.",
  },
  {
    n: "04",
    icon: BadgeCheck,
    title: "Satisfaction Guaranteed",
    desc: "We don't leave until you're delighted with the result.",
  },
];

export default function WhyChoose() {
  const ref = useReveal();
  return (
    <section id="about" className="relative py-24 lg:py-32 border-t border-white/8">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-[1480px] px-6">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.32em] text-white/55">
            — Why DC Valeting
          </span>
          <h2 className="font-display text-white text-[52px] lg:text-[78px] leading-[0.95] mt-3 tracking-[0.01em]">
            BUILT ON <span className="silver-text">PRECISION</span>
          </h2>
        </div>

        <div ref={ref} className="reveal stagger grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/8 rounded-2xl overflow-hidden silver-border">
          {items.map(({ n, icon: Icon, title, desc }) => (
            <div
              key={title}
              data-testid={`why-${title.toLowerCase().replace(/[^\w]/g, "-")}`}
              className="bg-[#070707] p-8 lg:p-10 hover:bg-[#0c0c0c] transition-colors duration-500 group"
            >
              <div className="flex items-center justify-between mb-7">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                  {n}
                </span>
                <div className="w-12 h-12 rounded-xl border border-white/20 flex items-center justify-center group-hover:border-white/40 transition">
                  <Icon size={22} strokeWidth={1.3} className="text-white" />
                </div>
              </div>
              <h3 className="font-display text-white text-[24px] tracking-[0.03em] leading-tight">
                {title.toUpperCase()}
              </h3>
              <p className="text-white/55 text-sm mt-3 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
