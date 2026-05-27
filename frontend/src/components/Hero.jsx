import { useEffect, useRef } from "react";
import { ArrowRight, Play } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BookingPanel from "./BookingPanel";

gsap.registerPlugin(ScrollTrigger);

const HERO_IMAGE =
  "https://customer-assets.emergentagent.com/job_shine-next-level/artifacts/2a3pred6_PHOTO-2026-05-27-23-15-28.jpg";

const LINE_1 = ["PROFESSIONAL", "CARE."];
const LINE_2 = ["PREMIUM", "RESULTS."];

export default function Hero({ onBook, bookingRef }) {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const imageWrapRef = useRef(null);
  const bookingWrapRef = useRef(null);
  const statsRef = useRef(null);
  const shineRef = useRef(null);
  const dustRef = useRef(null);
  const ctaRef = useRef(null);
  const subtitleRef = useRef(null);
  const paragraphRef = useRef(null);
  const wordsRef = useRef([]);

  // helper to register words
  const setWordRef = (el, i) => {
    if (el) wordsRef.current[i] = el;
  };

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 1024px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // Initial state for words
      gsap.set(wordsRef.current, {
        yPercent: 26,
        scale: 1.08,
        letterSpacing: "-0.04em",
        transformPerspective: 900,
        rotateX: 6,
        willChange: "transform",
      });

      gsap.set(subtitleRef.current, { y: 20, opacity: 0 });
      gsap.set(paragraphRef.current, { y: 30, opacity: 0 });
      gsap.set(ctaRef.current, { y: 30, opacity: 0 });
      gsap.set(shineRef.current, { xPercent: -120, opacity: 0 });

      // Right-side reveal: image wrap + booking panel come alive in sync
      gsap.set(imageWrapRef.current, {
        scale: 1.12,
        xPercent: 6,
        transformPerspective: 1000,
        rotateY: -3,
        willChange: "transform",
      });
      gsap.set(bookingWrapRef.current, {
        y: 60,
        scale: 0.96,
        transformPerspective: 1000,
        rotateY: 4,
        willChange: "transform",
      });
      gsap.set(statsRef.current, { y: 24 });

      // Scrub timeline tied to scroll
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=520",
          scrub: 1.1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        subtitleRef.current,
        { y: 0, opacity: 1, duration: 0.4 },
        0
      );

      // Words: stagger reveal — each word animates independently
      tl.to(
        wordsRef.current,
        {
          yPercent: 0,
          scale: 1,
          letterSpacing: "0.01em",
          rotateX: 0,
          duration: 0.9,
          stagger: 0.1,
        },
        0.05
      );

      // Metallic shine sweep across text horizontally
      tl.to(
        shineRef.current,
        {
          xPercent: 220,
          opacity: 1,
          duration: 0.9,
          ease: "power2.inOut",
        },
        0.45
      ).to(
        shineRef.current,
        { opacity: 0, duration: 0.2 },
        ">-0.1"
      );

      // Paragraph + CTA reveal after text
      tl.to(
        paragraphRef.current,
        { y: 0, opacity: 1, duration: 0.5 },
        0.55
      );
      tl.to(
        ctaRef.current,
        { y: 0, opacity: 1, duration: 0.6 },
        0.7
      );
      tl.to(
        statsRef.current,
        { y: 0, duration: 0.6 },
        0.75
      );

      // Right side reveal — image + booking panel animate in sync with text
      tl.to(
        imageWrapRef.current,
        {
          scale: 1,
          xPercent: 0,
          rotateY: 0,
          duration: 1.1,
        },
        0
      );
      tl.to(
        bookingWrapRef.current,
        {
          y: 0,
          scale: 1,
          rotateY: 0,
          duration: 1.0,
        },
        0.25
      );

      // Continuous parallax: image keeps zooming gently as user scrolls past
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { scale: 1.0, yPercent: 0 },
          {
            scale: 1.12,
            yPercent: -10,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "+=900",
              scrub: 1.2,
            },
          }
        );
      }

      // Floating dust drift via small continuous animation (not scroll-locked, very subtle)
      if (!reduced && dustRef.current) {
        const particles = dustRef.current.querySelectorAll(".dust");
        particles.forEach((p, i) => {
          gsap.to(p, {
            y: `+=${gsap.utils.random(-30, 30)}`,
            x: `+=${gsap.utils.random(-20, 20)}`,
            opacity: gsap.utils.random(0.2, 0.7),
            duration: gsap.utils.random(6, 12),
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            delay: i * 0.15,
          });
        });
      }

      // CTA subtle pulse every few seconds (not scroll-locked)
      if (!reduced && ctaRef.current) {
        gsap.to(ctaRef.current.querySelector(".cta-pulse"), {
          boxShadow:
            "0 0 0 6px rgba(255,255,255,0.06), 0 8px 40px rgba(255,255,255,0.18)",
          duration: 1.6,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Subtle mouse-parallax depth for text container (desktop only)
  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) return;
    const el = sectionRef.current;
    if (!el) return;

    let rafId;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        wordsRef.current.forEach((w, i) => {
          if (!w) return;
          const depth = 4 + i * 1.2;
          w.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0)`;
        });
      });
    };
    el.addEventListener("mousemove", onMove);
    return () => {
      el.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#050505] min-h-screen"
    >
      {/* Right-side full-bleed image (50% on desktop) */}
      <div ref={imageWrapRef} className="absolute inset-y-0 right-0 w-full lg:w-1/2 pointer-events-none">
        <div ref={imageRef} className="absolute inset-0 will-change-transform">
          <img
            src={HERO_IMAGE}
            alt="DC Valeting — Land Rover Defender detailing"
            className="w-full h-full object-cover object-center"
          />
        </div>
        {/* Left-edge fade */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, #050505 0%, rgba(5,5,5,0.85) 18%, rgba(5,5,5,0.35) 42%, rgba(5,5,5,0) 70%)",
          }}
        />
        {/* Vertical vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(5,5,5,0.45) 0%, rgba(5,5,5,0) 25%, rgba(5,5,5,0) 70%, rgba(5,5,5,0.7) 100%)",
          }}
        />
        <div className="absolute inset-0 lg:hidden bg-black/55" />
      </div>

      {/* Animated smoke / glow */}
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
        {/* Light streak behind text */}
        <div
          className="absolute left-0 top-1/3 w-2/3 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
            filter: "blur(1px)",
          }}
        />
        <div
          className="absolute left-0 bottom-1/3 w-1/2 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)",
            filter: "blur(1px)",
          }}
        />
      </div>

      {/* Floating dust particles */}
      <div ref={dustRef} className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="dust absolute rounded-full"
            style={{
              top: `${(i * 73) % 100}%`,
              left: `${(i * 137) % 100}%`,
              width: `${2 + (i % 4)}px`,
              height: `${2 + (i % 4)}px`,
              background:
                "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)",
              filter: "blur(0.5px)",
              opacity: 0.35,
              willChange: "transform, opacity",
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-[1480px] px-6 pt-40 lg:pt-52 pb-24 lg:pb-32 grid lg:grid-cols-12 gap-10 items-center min-h-[88vh]">
        {/* Left content */}
        <div className="lg:col-span-6 relative z-10">
          <div
            ref={subtitleRef}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full silver-border bg-white/[0.02] mb-8 will-change-transform"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/75">
              Professional Valeting & Detailing
            </span>
          </div>

          {/* Animated headline */}
          <h1
            data-testid="hero-headline"
            className="font-display relative text-white text-[64px] sm:text-[84px] lg:text-[112px] leading-[0.92] tracking-[0.01em] select-none"
            style={{ perspective: "1000px" }}
          >
            <span className="block overflow-hidden">
              <span className="inline-flex flex-wrap gap-x-[0.18em] gap-y-1">
                {LINE_1.map((w, i) => (
                  <span
                    key={`l1-${i}`}
                    ref={(el) => setWordRef(el, i)}
                    className="inline-block silver-text"
                    style={{
                      filter:
                        "drop-shadow(0 0 18px rgba(255,255,255,0.05))",
                    }}
                  >
                    {w}
                  </span>
                ))}
              </span>
            </span>
            <span className="block overflow-hidden mt-1">
              <span className="inline-flex flex-wrap gap-x-[0.18em] gap-y-1">
                {LINE_2.map((w, i) => (
                  <span
                    key={`l2-${i}`}
                    ref={(el) => setWordRef(el, LINE_1.length + i)}
                    className="inline-block silver-text"
                    style={{
                      filter:
                        "drop-shadow(0 0 22px rgba(255,255,255,0.08))",
                    }}
                  >
                    {w}
                  </span>
                ))}
              </span>
            </span>

            {/* Metallic shine sweep overlay */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              <span
                ref={shineRef}
                className="absolute top-0 left-0 h-full w-[40%]"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.55) 50%, transparent 80%)",
                  mixBlendMode: "screen",
                  filter: "blur(8px)",
                  willChange: "transform, opacity",
                }}
              />
            </span>

            {/* Soft gradient glow under text */}
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-x-10 bottom-[-30%] h-[40%] -z-10"
              style={{
                background:
                  "radial-gradient(ellipse 60% 100% at 30% 50%, rgba(255,255,255,0.08) 0%, transparent 70%)",
                filter: "blur(20px)",
              }}
            />
          </h1>

          <p
            ref={paragraphRef}
            className="mt-7 text-white/65 text-base lg:text-lg max-w-xl leading-relaxed will-change-transform"
          >
            Professional valeting, paint correction & ceramic coating services in
            Edinburgh and surrounding areas. Keeping your vehicle looking its
            absolute best — every detail considered.
          </p>

          <div
            ref={ctaRef}
            className="mt-9 flex flex-wrap items-center gap-4 will-change-transform"
          >
            <button
              data-testid="hero-book-cta"
              onClick={onBook}
              className="btn-primary cta-pulse relative overflow-hidden"
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                BOOK YOUR VALET
                <ArrowRight size={16} />
              </span>
              {/* shimmer overlay */}
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-[1400ms] ease-out"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)",
                }}
              />
            </button>
            <a href="#services" className="btn-outline" data-testid="hero-view-services">
              <Play size={14} fill="currentColor" />
              VIEW SERVICES
            </a>
          </div>

          {/* Trust strip */}
          <div ref={statsRef} className="mt-12 grid grid-cols-3 gap-6 max-w-md will-change-transform">
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

        {/* Right: floating booking panel */}
        <div className="lg:col-span-6 relative">
          <div
            ref={(node) => {
              bookingWrapRef.current = node;
              if (bookingRef) bookingRef.current = node;
            }}
            className="hidden lg:block lg:ml-auto w-full max-w-[400px] relative z-20 mt-[280px] xl:mt-[340px] will-change-transform"
          >
            <BookingPanel />
          </div>
        </div>
      </div>
    </section>
  );
}
