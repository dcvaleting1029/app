import { ShieldCheck } from "lucide-react";
import useReveal from "../hooks/useReveal";

const ADDONS = [
  {
    id: "1y",
    title: "1 YEAR CERAMIC",
    desc: "Great entry-level protection with long-lasting hydrophobic effect and added gloss.",
    price: "Add £120–£180",
  },
  {
    id: "3-5y",
    title: "3–5 YEAR CERAMIC",
    desc: "Premium long-lasting protection with superior gloss, slickness and chemical resistance.",
    price: "Add £250–£400",
  },
];

export default function CeramicAddons() {
  const ref = useReveal();
  return (
    <section className="relative py-16 lg:py-20 border-t border-white/8">
      <div className="mx-auto max-w-[1480px] px-6">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.32em] text-white/55">
              — Add-Ons
            </span>
            <h3 className="font-display text-white text-[36px] lg:text-[48px] leading-[0.95] mt-2 tracking-[0.01em]">
              CERAMIC COATING UPGRADES
            </h3>
          </div>
          <p className="max-w-md text-white/55 text-sm lg:text-base">
            Lock in your finish with a professional ceramic coating — applied
            after correction for years of effortless maintenance.
          </p>
        </div>

        <div ref={ref} className="reveal stagger grid lg:grid-cols-2 gap-5">
          {ADDONS.map((a) => (
            <div
              key={a.id}
              data-testid={`addon-${a.id}`}
              className="group flex items-center justify-between gap-6 p-6 lg:p-8 rounded-2xl silver-border bg-gradient-to-r from-white/[0.04] to-transparent hover:from-white/[0.08] hover:border-white/22 transition-all duration-500"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-xl border border-white/20 bg-white/[0.04] flex items-center justify-center group-hover:bg-white/10 transition">
                  <ShieldCheck size={24} strokeWidth={1.3} className="text-white" />
                </div>
                <div>
                  <h4 className="font-display text-white text-[24px] tracking-[0.03em] leading-none">
                    {a.title}
                  </h4>
                  <p className="text-white/55 text-sm mt-2 max-w-md leading-relaxed">{a.desc}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-display text-white text-[22px] tracking-[0.02em]">
                  {a.price}
                </div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-white/40 mt-1">
                  per vehicle
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
