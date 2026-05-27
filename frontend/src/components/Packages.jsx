import { Check, ArrowRight } from "lucide-react";
import useReveal from "../hooks/useReveal";

const PACKAGES = [
  {
    id: "stage1",
    badge: "Stage 1",
    title: "STAGE 1 ENHANCEMENT",
    desc: "A single-stage machine polish to remove light swirl marks, haze and minor defects for a high-gloss finish.",
    features: [
      "Safe Wash",
      "Decontamination",
      "Clay Bar Treatment",
      "Single Stage Machine Polish",
      "Sealant / Wax Protection",
    ],
    pricing: [
      { size: "Small / Medium", price: "£180–£220" },
      { size: "SUV / Large", price: "£230–£280" },
    ],
    tag: "1 Day Service",
  },
  {
    id: "stage2",
    badge: "Stage 2",
    title: "STAGE 2 FULL CORRECTION",
    desc: "A two-stage correction to remove deeper defects, scratches and oxidation for a showroom finish.",
    features: [
      "Safe Wash",
      "Decontamination",
      "Clay Bar Treatment",
      "Two Stage Machine Polish",
      "Panel Wipe",
      "Sealant / Wax Protection",
    ],
    pricing: [
      { size: "Small / Medium", price: "£300–£400" },
      { size: "SUV / Large", price: "£450+" },
    ],
    tag: "1–2 Day Service",
    featured: true,
  },
];

export default function Packages({ onBook }) {
  const ref = useReveal();
  return (
    <section id="packages" className="relative py-24 lg:py-32 border-t border-white/8">
      <div className="mx-auto max-w-[1480px] px-6">
        <div ref={ref} className="reveal grid lg:grid-cols-12 gap-8 items-end mb-14">
          <div className="lg:col-span-6">
            <span className="text-[10px] uppercase tracking-[0.32em] text-white/55">
              — Packages
            </span>
            <h2 className="font-display text-white text-[52px] lg:text-[72px] leading-[0.95] mt-3 tracking-[0.01em]">
              PAINT CORRECTION & <br />
              <span className="silver-text">CERAMIC COATINGS</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="text-white/65 text-base lg:text-lg leading-relaxed">
              Tailored packages to restore, protect and maintain your vehicle's
              finish — from light enhancement to full multi-stage correction.
            </p>
          </div>
        </div>

        <div id="services" className="grid lg:grid-cols-2 gap-5 lg:gap-6">
          {PACKAGES.map((p) => (
            <div
              key={p.id}
              data-testid={`package-${p.id}`}
              className={`relative rounded-2xl p-8 lg:p-10 border transition-all duration-500 group ${
                p.featured
                  ? "bg-gradient-to-b from-white/[0.08] to-white/[0.01] border-white/25 hover:border-white/40"
                  : "bg-gradient-to-b from-white/[0.03] to-transparent border-white/10 hover:border-white/22"
              }`}
            >
              {p.featured && (
                <div className="absolute -top-3 right-8 px-3 py-1 rounded-full bg-white text-black text-[10px] uppercase tracking-[0.22em] font-medium">
                  Most popular
                </div>
              )}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">
                    {p.badge}
                  </span>
                  <h3 className="font-display text-white text-[34px] lg:text-[40px] leading-[0.95] tracking-[0.01em] mt-2">
                    {p.title}
                  </h3>
                </div>
              </div>
              <p className="text-white/60 text-sm lg:text-base leading-relaxed mb-7">
                {p.desc}
              </p>

              <ul className="space-y-3 mb-8">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-white/85 text-sm">
                    <Check size={16} strokeWidth={1.6} className="text-white/90 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="border-t border-white/10 pt-6 space-y-2">
                {p.pricing.map((pr) => (
                  <div key={pr.size} className="flex items-baseline justify-between">
                    <span className="text-white/55 text-xs uppercase tracking-[0.18em]">
                      {pr.size}
                    </span>
                    <span className="font-display text-white text-2xl tracking-[0.02em]">
                      {pr.price}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-7">
                <span className="text-[10px] uppercase tracking-[0.24em] text-white/55 px-3 py-1.5 rounded-full silver-border">
                  {p.tag}
                </span>
                <button
                  onClick={onBook}
                  data-testid={`package-${p.id}-book`}
                  className="flex items-center gap-2 text-white text-[11px] uppercase tracking-[0.22em] group-hover:gap-3 transition-all"
                >
                  Book this
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
