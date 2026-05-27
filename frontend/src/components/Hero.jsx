import { useEffect, useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import BookingPanel from "./BookingPanel";

const HERO_IMAGE =
  "https://customer-assets.emergentagent.com/job_shine-next-level/artifacts/2a3pred6_PHOTO-2026-05-27-23-15-28.jpg";

export default function Hero({ onBook, bookingRef }) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="home" className="relative overflow-hidden bg-[#050505]">
      {/* Right-side full-bleed image (50% on desktop) */}
      <div
        className="absolute inset-y-0 right-0 w-full lg:w-1/2 pointer-events-none"
        style={{
          transform: `translateY(${scrollY * -0.06}px)`,
          transition: "transform 0.1s linear",
        }}
      >
        <img
          src={HERO_IMAGE}
          alt="DC Valeting — Land Rover Defender detailing"
          className="w-full h-full object-cover object-center"
        />
        {/* Left-edge fade into pure black for seamless blend with text side */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, #050505 0%, rgba(5,5,5,0.85) 18%, rgba(5,5,5,0.35) 42%, rgba(5,5,5,0) 70%)",
          }}
        />
        {/* Top + bottom vignette for cinematic depth */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(5,5,5,0.45) 0%, rgba(5,5,5,0) 25%, rgba(5,5,5,0) 70%, rgba(5,5,5,0.7) 100%)",
          }}
        />
        {/* Mobile: stronger overall darkening so text remains readable */}
        <div className="absolute inset-0 lg:hidden bg-black/55" />
      </div>

      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 60%)",
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 60%)",
          }}
        />
      </div>

      {/* Floating particles overlay (front of image) */}
      <div className="absolute inset-0 pointer-events-none">
        <span
          className="particle w-2 h-2"
          style={{ top: "22%", left: "62%", animation: "floatA 9s ease-in-out infinite" }}
        />
        <span
          className="particle w-1.5 h-1.5"
          style={{ top: "65%", left: "78%", animation: "floatB 11s ease-in-out infinite" }}
        />
        <span
          className="particle w-1 h-1"
          style={{ top: "40%", left: "92%", animation: "floatC 13s ease-in-out infinite" }}
        />
        <span
          className="particle w-2.5 h-2.5"
          style={{ top: "55%", left: "55%", animation: "floatA 14s ease-in-out infinite 1s" }}
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

        {/* Right: floating booking panel (pushed lower to reveal image) */}
        <div className="lg:col-span-6 relative">
          <div
            ref={bookingRef}
            className="hidden lg:block lg:ml-auto w-full max-w-[400px] relative z-20 mt-[280px] xl:mt-[340px]"
          >
            <BookingPanel />
          </div>
        </div>
      </div>
    </section>
  );
}
