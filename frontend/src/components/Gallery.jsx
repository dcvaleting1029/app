import useReveal from "../hooks/useReveal";

const IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=900&q=80&auto=format&fit=crop",
    h: "tall",
    label: "Foam Wash",
  },
  {
    src: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=900&q=80&auto=format&fit=crop",
    h: "short",
    label: "Paint Correction",
  },
  {
    src: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=900&q=80&auto=format&fit=crop",
    h: "med",
    label: "Ceramic Finish",
  },
  {
    src: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=900&q=80&auto=format&fit=crop",
    h: "med",
    label: "Interior Detail",
  },
  {
    src: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&q=80&auto=format&fit=crop",
    h: "tall",
    label: "Showroom Gloss",
  },
  {
    src: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=900&q=80&auto=format&fit=crop",
    h: "short",
    label: "Performance",
  },
  {
    src: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=900&q=80&auto=format&fit=crop",
    h: "med",
    label: "SUV Detail",
  },
  {
    src: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&q=80&auto=format&fit=crop",
    h: "tall",
    label: "Mirror Finish",
  },
];

const heights = {
  short: "h-[260px] lg:h-[300px]",
  med: "h-[340px] lg:h-[400px]",
  tall: "h-[440px] lg:h-[520px]",
};

export default function Gallery() {
  const ref = useReveal();
  return (
    <section id="gallery" className="relative py-24 lg:py-32 border-t border-white/8">
      <div className="mx-auto max-w-[1480px] px-6">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.32em] text-white/55">
              — Recent Results
            </span>
            <h2 className="font-display text-white text-[48px] lg:text-[72px] leading-[0.95] mt-3 tracking-[0.01em]">
              FRESH FROM THE <span className="silver-text">DETAIL BAY</span>
            </h2>
          </div>
          <a
            href="#"
            data-testid="gallery-instagram"
            className="text-[11px] uppercase tracking-[0.24em] text-white/70 hover:text-white transition flex items-center gap-2"
          >
            View on Instagram →
          </a>
        </div>

        <div
          ref={ref}
          className="reveal stagger columns-1 sm:columns-2 lg:columns-4 gap-4 lg:gap-5 [column-fill:_balance]"
        >
          {IMAGES.map((img, i) => (
            <div
              key={i}
              data-testid={`gallery-item-${i}`}
              className={`zoom-wrap mb-4 lg:mb-5 break-inside-avoid rounded-2xl overflow-hidden silver-border hover:border-white/35 transition-all duration-500 relative group ${heights[img.h]}`}
            >
              <img
                src={img.src}
                alt={img.label}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                <div className="text-[10px] uppercase tracking-[0.24em] text-white/70">
                  Recent work
                </div>
                <div className="font-display text-white text-xl tracking-[0.04em]">
                  {img.label.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
