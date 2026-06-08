import { Check, ArrowRight, Sparkles, Car } from "lucide-react";
import useReveal from "../hooks/useReveal";

const SIGNATURE_PACKAGES = [
  {
    id: "full-package",
    icon: Sparkles,
    badge: "Full Package",
    title: "FULL PACKAGE",
    tagline: "Complete protection. Premium finish.",
    desc: "The ultimate all-in-one package for a showroom finish and long-lasting protection inside and out.",
    price: "£599",
    priceNote: "Save more with our complete package",
    columns: [
      {
        title: "Deep Clean Valet",
        items: [
          "Thorough exterior wash",
          "Wheels, arches & tyres deep cleaned",
          "Snow foam pre-wash",
          "Door shuts & jambs cleaned",
          "Full interior deep clean",
          "Seats, carpets & mats shampooed",
          "Dashboard, vents & trim cleaned",
          "Interior & exterior dressed & protected",
          "Streak-free finish",
        ],
      },
      {
        title: "2 Stage Polish",
        items: [
          "Stage 1 — Cut (removes swirls, haze & light scratches)",
          "Stage 2 — Polish (refines paint for maximum gloss & clarity)",
          "Enhances depth, shine & colour",
          "Restores a flawless, showroom finish",
        ],
      },
      {
        title: "Ceramic Coating",
        items: [
          "Premium ceramic coating on all exterior paintwork",
          "Long-lasting protection up to 2–3 years",
          "Hydrophobic effect — water & dirt repellent",
          "UV & chemical resistant",
          "Enhanced gloss & easier maintenance",
        ],
      },
    ],
    tag: "Signature",
    featured: true,
  },
  {
    id: "exterior-package",
    icon: Car,
    badge: "Exterior Package",
    title: "EXTERIOR PACKAGE",
    tagline: "Shine. Protect. Impress.",
    desc: "A complete exterior care package designed to restore your car's shine and protect the finish for long-lasting results.",
    price: "£450",
    priceNote: "Professional care. Premium results.",
    columns: [
      {
        title: "Exterior Deep Clean",
        items: [
          "Thorough hand wash",
          "Wheels, arches & tyres deep cleaned",
          "Snow foam pre-wash",
          "Door shuts & jambs cleaned",
          "Clay bar treatment",
          "Remove road grime, tar & baked-on dirt",
          "Streak-free finish",
        ],
      },
      {
        title: "2 Stage Polish",
        items: [
          "Stage 1 — Cut (removes swirls, haze & light scratches)",
          "Stage 2 — Polish (refines paint for maximum gloss & clarity)",
          "Enhances depth, shine & colour",
          "Restores a flawless, showroom finish",
        ],
      },
      {
        title: "Ceramic Coating",
        items: [
          "Premium ceramic coating on all exterior paintwork",
          "Long-lasting protection up to 2–3 years",
          "Hydrophobic effect — water & dirt repellent",
          "UV & chemical resistant",
          "Enhanced gloss & easier maintenance",
        ],
      },
    ],
    tag: "Exterior",
  },
];

const STAGE_PACKAGES = [
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
  const sigRef = useReveal();

  return (
    <section id="packages" className="relative py-24 lg:py-32 border-t border-white/8">
      <div className="mx-auto max-w-[1480px] px-6">
        <div ref={ref} className="reveal grid lg:grid-cols-12 gap-8 items-end mb-14">
          <div className="lg:col-span-6">
            <span className="text-[10px] uppercase tracking-[0.32em] text-white/55">
              — Packages
            </span>
            <h2 className="font-display text-white text-[52px] lg:text-[72px] leading-[0.95] mt-3 tracking-[0.01em]">
              SIGNATURE BUNDLES & <br />
              <span className="silver-text">PAINT CORRECTION</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="text-white/65 text-base lg:text-lg leading-relaxed">
              Two flagship bundles plus our enhancement & correction tiers —
              everything you need to restore, protect and maintain your finish.
            </p>
          </div>
        </div>

        {/* Signature bundle packages */}
        <div ref={sigRef} className="reveal grid lg:grid-cols-2 gap-5 lg:gap-6 mb-6">
          {SIGNATURE_PACKAGES.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                data-testid={`package-${p.id}`}
                className={`relative rounded-2xl p-8 lg:p-10 border transition-all duration-500 group overflow-hidden ${
                  p.featured
                    ? "bg-gradient-to-b from-white/[0.09] via-white/[0.03] to-transparent border-white/25 hover:border-white/40"
                    : "bg-gradient-to-b from-white/[0.04] to-transparent border-white/12 hover:border-white/25"
                }`}
              >
                {p.featured && (
                  <div className="absolute top-5 right-5 z-10 px-3 py-1 rounded-full bg-white text-black text-[10px] uppercase tracking-[0.22em] font-medium shadow-[0_4px_20px_rgba(255,255,255,0.15)]">
                    Most popular
                  </div>
                )}

                {/* Ambient glow */}
                <div
                  className="absolute -top-32 -right-32 w-[280px] h-[280px] rounded-full pointer-events-none opacity-60"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 60%)",
                  }}
                />

                <div className="relative">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-lg border border-white/20 bg-white/[0.04] flex items-center justify-center">
                      <Icon size={16} strokeWidth={1.4} className="text-white" />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">
                      {p.badge}
                    </span>
                  </div>
                  <h3 className="font-display text-white text-[34px] lg:text-[42px] leading-[0.95] tracking-[0.01em] mt-3">
                    {p.title}
                  </h3>
                  <div className="text-[11px] uppercase tracking-[0.24em] text-white/55 mt-2">
                    {p.tagline}
                  </div>
                  <p className="text-white/60 text-sm lg:text-base leading-relaxed mt-4 max-w-md">
                    {p.desc}
                  </p>

                  {/* Price band */}
                  <div className="mt-7 mb-7 rounded-xl border border-white/15 bg-black/40 px-5 py-5 text-center">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-white/55">
                      Special Package Price
                    </div>
                    <div className="font-display text-white text-6xl lg:text-7xl tracking-[0.01em] mt-2 leading-none">
                      {p.price}
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.22em] text-white/55 mt-3">
                      {p.priceNote}
                    </div>
                  </div>

                  {/* Three feature columns */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    {p.columns.map((col) => (
                      <div
                        key={col.title}
                        className="p-4 rounded-xl border border-white/8 bg-white/[0.02]"
                      >
                        <h4 className="text-white text-xs uppercase tracking-[0.22em] font-display">
                          {col.title}
                        </h4>
                        <ul className="space-y-2 mt-3">
                          {col.items.map((it) => (
                            <li
                              key={it}
                              className="flex items-start gap-2 text-white/75 text-[12px] leading-snug"
                            >
                              <Check
                                size={11}
                                strokeWidth={2}
                                className="text-white/90 mt-0.5 flex-shrink-0"
                              />
                              <span>{it}</span>
                            </li>
                          ))}
                        </ul>
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
                      Book this package
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Subtitle for stage cards */}
        <div id="services" className="mt-16 mb-8">
          <span className="text-[10px] uppercase tracking-[0.32em] text-white/55">
            — Paint Correction Tiers
          </span>
          <h3 className="font-display text-white text-[32px] lg:text-[44px] leading-[0.95] mt-3 tracking-[0.01em]">
            ENHANCEMENT & <span className="silver-text">FULL CORRECTION</span>
          </h3>
        </div>

        {/* Existing Stage 1 / Stage 2 cards */}
        <div className="grid lg:grid-cols-2 gap-5 lg:gap-6">
          {STAGE_PACKAGES.map((p) => (
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
                    <Check
                      size={16}
                      strokeWidth={1.6}
                      className="text-white/90 mt-0.5 flex-shrink-0"
                    />
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
