import { useEffect, useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import BookingPanel from "./BookingPanel";

export default function Hero({ onBook, bookingRef }) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="home" className="relative overflow-hidden">
      {/* Background ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-[800px] h-[800px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 60%)",
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[700px] h-[700px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 60%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1480px] px-6 pt-16 lg:pt-20 pb-24 lg:pb-32 grid lg:grid-cols-12 gap-10 items-center min-h-[88vh]">
        {/* Left content */}
        <div className="lg:col-span-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full silver-border bg-white/[0.02] mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/75">
              Professional Valeting & Detailing
            </span>
          </div>

          <h1
            data-testid="hero-headline"
            className="font-display text-white text-[64px] sm:text-[84px] lg:text-[112px] leading-[0.92] tracking-[0.01em]"
          >
            PROFESSIONAL <br />
            CARE.{" "}
            <span className="silver-text">PREMIUM</span> <br />
            <span className="silver-text">RESULTS.</span>
          </h1>

          <p className="mt-7 text-white/65 text-base lg:text-lg max-w-xl leading-relaxed">
            Professional valeting, paint correction & ceramic coating services in
            Edinburgh and surrounding areas. Keeping your vehicle looking its
            absolute best — every detail considered.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button data-testid="hero-book-cta" onClick={onBook} className="btn-primary">
              BOOK YOUR VALET
              <ArrowRight size={16} />
            </button>
            <a href="#services" className="btn-outline" data-testid="hero-view-services">
              <Play size={14} fill="currentColor" />
              VIEW SERVICES
            </a>
          </div>

          {/* Trust strip */}
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
            <div>
              <div className="font-display text-3xl text-white">8+</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/50 mt-1">
                Years experience
              </div>
            </div>
            <div className="border-l border-white/10 pl-6">
              <div className="font-display text-3xl text-white">1.2k</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/50 mt-1">
                Vehicles detailed
              </div>
            </div>
            <div className="border-l border-white/10 pl-6">
              <div className="font-display text-3xl text-white">5.0</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/50 mt-1">
                Avg. rating
              </div>
            </div>
          </div>
        </div>

        {/* Right: Car + booking */}
        <div className="lg:col-span-6 relative">
          {/* Car image */}
          <div
            className="relative rounded-2xl overflow-hidden silver-border"
            style={{
              transform: `translateY(${scrollY * -0.08}px)`,
              transition: "transform 0.1s linear",
            }}
          >
            <div className="aspect-[4/5] lg:aspect-[5/6] relative bg-black">
              <img
                src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1400&q=80&auto=format&fit=crop"
                alt="Glossy black performance car"
                className="w-full h-full object-cover opacity-95"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=80";
                }}
              />
              <div className="car-spotlight" />
              <div className="reflective-floor" />

              {/* Floating particles */}
              <span
                className="particle w-2 h-2"
                style={{ top: "20%", left: "30%", animation: "floatA 9s ease-in-out infinite" }}
              />
              <span
                className="particle w-1.5 h-1.5"
                style={{ top: "65%", left: "70%", animation: "floatB 11s ease-in-out infinite" }}
              />
              <span
                className="particle w-1 h-1"
                style={{ top: "40%", left: "85%", animation: "floatC 13s ease-in-out infinite" }}
              />
              <span
                className="particle w-2.5 h-2.5"
                style={{ top: "55%", left: "15%", animation: "floatA 14s ease-in-out infinite 1s" }}
              />
              <span
                className="particle w-1 h-1"
                style={{ top: "15%", left: "75%", animation: "floatC 10s ease-in-out infinite 2s" }}
              />

              {/* Top right floating tag */}
              <div className="absolute top-5 right-5 glass-strong rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.22em] text-white/85">
                  Available this week
                </span>
              </div>

              {/* Bottom rating card */}
              <div className="absolute bottom-5 left-5 glass-strong rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border border-white/20 bg-gradient-to-br from-white/20 to-white/5"
                    />
                  ))}
                </div>
                <div className="leading-tight">
                  <div className="text-[11px] text-white">★ 5.0 / 5.0</div>
                  <div className="text-[9px] uppercase tracking-[0.18em] text-white/55">
                    240+ reviews
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating booking panel (desktop only) */}
          <div
            ref={bookingRef}
            className="hidden lg:block absolute -right-4 xl:-right-8 top-1/2 -translate-y-1/2 w-[380px] xl:w-[400px] z-20"
          >
            <BookingPanel />
          </div>
        </div>
      </div>
    </section>
  );
}
