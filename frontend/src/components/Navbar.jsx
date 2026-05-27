import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Packages", href: "#packages" },
  { label: "Gallery", href: "#gallery" },
  { label: "Reviews", href: "#reviews" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ onBook }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="navbar"
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-black/85 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1480px] px-6">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 group" data-testid="logo">
            <img
              src="https://customer-assets.emergentagent.com/job_shine-next-level/artifacts/40jiimj9_WhatsApp%20Image%202026-05-27%20at%2023.01.29%20%281%29.jpeg"
              alt="DC Valeting"
              className="h-12 w-12 lg:h-14 lg:w-14 object-contain rounded-md"
              style={{ filter: "drop-shadow(0 0 12px rgba(255,255,255,0.08))" }}
            />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-display text-white text-[18px] tracking-[0.18em]">
                DC VALETING
              </span>
              <span className="text-[9px] uppercase tracking-[0.35em] text-white/45 mt-1">
                Edinburgh
              </span>
            </div>
          </a>

          {/* Center links */}
          <nav className="hidden lg:flex items-center gap-9">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                data-testid={`nav-${l.label.toLowerCase()}`}
                className="text-[12px] uppercase tracking-[0.22em] text-white/70 hover:text-white transition-colors duration-300 relative group"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right CTA */}
          <div className="hidden lg:block">
            <button
              data-testid="navbar-book-now"
              onClick={onBook}
              className="btn-primary"
            >
              BOOK NOW
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            data-testid="mobile-menu-toggle"
            className="lg:hidden p-2 text-white"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden pb-6 border-t border-white/10 pt-4">
            <div className="flex flex-col gap-4">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-sm uppercase tracking-[0.22em] text-white/80 hover:text-white"
                >
                  {l.label}
                </a>
              ))}
              <button onClick={() => { setOpen(false); onBook(); }} className="btn-primary mt-2 w-full">
                BOOK NOW
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
