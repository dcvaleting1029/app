import useReveal from "../hooks/useReveal";

const IMAGES = [
  {
    src: "https://customer-assets.emergentagent.com/job_shine-next-level/artifacts/8uadvz76_PHOTO-2026-05-27-23-15-23%20%284%29.jpg",
    h: "tall",
    label: "Porsche Cayenne — Interior Detail",
    tag: "Full Interior Valet",
  },
  {
    src: "https://customer-assets.emergentagent.com/job_shine-next-level/artifacts/kamnoibu_PHOTO-2026-05-27-23-15-23%20%285%29.jpg",
    h: "med",
    label: "Cayenne Boot Deep Clean",
    tag: "Vacuum & Shampoo",
  },
  {
    src: "https://customer-assets.emergentagent.com/job_shine-next-level/artifacts/4wl0ixnh_PHOTO-2026-05-27-23-15-24%20%281%29.jpg",
    h: "tall",
    label: "Porsche — Cabin Protection",
    tag: "Steering Wrap & Detail",
  },
  {
    src: "https://customer-assets.emergentagent.com/job_shine-next-level/artifacts/scczsqc1_PHOTO-2026-05-27-23-15-23%20%286%29.jpg",
    h: "med",
    label: "Ford Tourneo — Foam Wash",
    tag: "Exterior Maintenance",
  },
  {
    src: "https://customer-assets.emergentagent.com/job_shine-next-level/artifacts/0a0bnzcz_PHOTO-2026-05-27-23-15-24%20%282%29.jpg",
    h: "tall",
    label: "Cayenne Rear — Snow Foam",
    tag: "Safe Wash Process",
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
          className="reveal stagger columns-1 sm:columns-2 lg:columns-3 gap-4 lg:gap-5 [column-fill:_balance]"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-5 left-5 right-5 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500">
                <div className="text-[10px] uppercase tracking-[0.24em] text-white/70">
                  {img.tag}
                </div>
                <div className="font-display text-white text-xl tracking-[0.04em] mt-1">
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
