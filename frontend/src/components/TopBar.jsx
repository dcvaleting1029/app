import { Shield, Sparkles, Wrench, MapPin } from "lucide-react";

const items = [
  { icon: Shield, label: "Fully Insured" },
  { icon: Sparkles, label: "Paint Corrections & Ceramic Coatings" },
  { icon: Wrench, label: "Monthly Maintenance Plans" },
  { icon: MapPin, label: "Edinburgh & Surrounding Areas" },
];

export default function TopBar() {
  return (
    <div
      data-testid="top-bar"
      className="relative z-30 w-full border-b border-white/10 bg-black/70 backdrop-blur"
    >
      <div className="mx-auto max-w-[1480px] px-6">
        <div className="flex items-center justify-center gap-6 py-2 text-[11px] uppercase tracking-[0.18em] text-white/70 overflow-x-auto no-scrollbar">
          {items.map(({ icon: Icon, label }, i) => (
            <div key={label} className="flex items-center gap-3 whitespace-nowrap">
              <Icon size={13} className="text-white/80" strokeWidth={1.5} />
              <span>{label}</span>
              {i < items.length - 1 && <div className="divider-vert ml-3" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
