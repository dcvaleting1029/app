import { ListChecks, CalendarDays, Car, ArrowRight } from "lucide-react";
import useReveal from "../hooks/useReveal";

const STEPS = [
  { n: "01", icon: ListChecks, title: "Choose Your Service" },
  { n: "02", icon: CalendarDays, title: "Pick A Date & Time" },
  { n: "03", icon: Car, title: "We Come To You" },
];

export default function CtaBanner({ onBook }) {
  const ref = useReveal();
  return (
    <section className="relative py-20 lg:py-24 border-t border-white/8">
      <div className="mx-auto max-w-[1480px] px-6">
        <div
          ref={ref}
          className="reveal relative overflow-hidden rounded-3xl silver-border-strong p-10 lg:p-16 bg-gradient-to-br from-[#0d0d0d] via-[#0a0a0a] to-[#040404]"
        >
          {/* Decorative glow */}
          <div
            className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 60%)",
            }}
          />
          <div className="absolute inset-x-0 top-0 h-px shimmer-line" />

          <div className="relative grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6">
              <span className="text-[10px] uppercase tracking-[0.32em] text-white/55">
                — Ready when you are
              </span>
              <h2 className="font-display text-white text-[44px] lg:text-[68px] leading-[0.95] mt-3 tracking-[0.01em]">
                LET'S GET YOUR CAR <br />
                <span className="silver-text">LOOKING ITS BEST</span>
              </h2>
              <p className="text-white/65 text-base lg:text-lg mt-6 max-w-xl leading-relaxed">
                Booking is quick and easy. Choose your service, pick a date and
                we'll take care of the rest.
              </p>
              <button
                data-testid="cta-banner-book"
                onClick={onBook}
                className="btn-primary mt-8"
              >
                BOOK YOUR VALET <ArrowRight size={16} />
              </button>
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <div className="space-y-3">
                {STEPS.map(({ n, icon: Icon, title }) => (
                  <div
                    key={n}
                    className="flex items-center gap-5 p-5 rounded-xl silver-border bg-white/[0.025] hover:bg-white/[0.05] transition-all duration-500"
                  >
                    <span className="font-display text-white/30 text-3xl">{n}</span>
                    <div className="w-12 h-12 rounded-xl border border-white/20 bg-black/40 flex items-center justify-center">
                      <Icon size={20} strokeWidth={1.4} className="text-white" />
                    </div>
                    <div className="font-display text-white text-[22px] tracking-[0.03em]">
                      {title.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
