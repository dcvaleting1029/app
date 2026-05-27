import { Shield, Sparkles, Wrench, MapPin } from "lucide-react";

const items = [
  { icon: Shield, label: "Fully Insured" },
  { icon: Sparkles, label: "Paint Corrections & Ceramic Coatings" },
  { icon: Wrench, label: "Monthly Maintenance Plans" },
  { icon: MapPin, label: "Edinburgh & Surrounding Areas" },
];

function MarqueeRow() {
  return (
    <div className="flex items-center shrink-0">
      {items.map((it, i) => {
        const Icon = it.icon;
        return (
          <div key={`${it.label}-${i}`} className="flex items-center gap-3 whitespace-nowrap px-8">
            <Icon size={13} className="text-white/80" strokeWidth={1.5} />
            <span className="text-[11px] uppercase tracking-[0.22em] text-white/75">
              {it.label}
            </span>
            <span className="ml-8 w-1 h-1 rounded-full bg-white/30" />
          </div>
        );
      })}
    </div>
  );
}

export default function TopBar() {
  return (
    <div
      data-testid="top-bar"
      className="relative z-30 w-full bg-black border-b border-white/10 overflow-hidden"
    >
      {/* Edge fades */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-black to-transparent" />

      <div className="py-2.5">
        <div className="marquee-track">
          {/* duplicate twice for seamless loop */}
          <MarqueeRow />
          <MarqueeRow />
          <MarqueeRow />
          <MarqueeRow />
        </div>
      </div>
    </div>
  );
}
