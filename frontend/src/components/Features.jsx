import { ShieldCheck, Sparkles, Eye, Truck } from "lucide-react";
import useReveal from "../hooks/useReveal";

const items = [
  {
    icon: ShieldCheck,
    title: "Fully Insured",
    desc: "Comprehensive cover on every job, every vehicle, every time.",
  },
  {
    icon: Sparkles,
    title: "Quality Products",
    desc: "Only professional-grade detailing products and equipment.",
  },
  {
    icon: Eye,
    title: "Attention To Detail",
    desc: "Obsessive care from intake inspection to final polish.",
  },
  {
    icon: Truck,
    title: "Mobile Service",
    desc: "We come to you — Edinburgh and surrounding areas.",
  },
];

export default function Features() {
  const ref = useReveal();
  return (
    <section className="relative py-20 lg:py-28 border-t border-white/8">
      <div className="mx-auto max-w-[1480px] px-6">
        <div ref={ref} className="reveal stagger grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {items.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              data-testid={`feature-${title.toLowerCase().replace(/\s/g, "-")}`}
              className="group p-7 rounded-2xl silver-border bg-gradient-to-b from-white/[0.04] to-transparent hover:from-white/[0.08] hover:border-white/22 transition-all duration-500"
            >
              <div className="w-11 h-11 rounded-xl border border-white/20 bg-white/[0.04] flex items-center justify-center mb-5 group-hover:bg-white/10 transition">
                <Icon size={20} strokeWidth={1.4} className="text-white" />
              </div>
              <h3 className="font-display text-white text-[22px] tracking-[0.04em] leading-tight">
                {title.toUpperCase()}
              </h3>
              <p className="text-white/55 text-sm mt-2 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
