import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Packages", href: "#packages" },
  { label: "Gallery", href: "#gallery" },
  { label: "About", href: "#about" },
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
      className="bg-transparent"
    >
      <div className="mx-auto max-w-[1480px] px-6">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 group" data-testid="logo">
            <img
              src="https://customer-assets.emergentagent.com/job_shine-next-level/artifacts/c0p2224e_JA%20%2840%20x%2040%20px%29%20%2821%29.png"
              alt="DC Valeting"
              className="h-14 w-14 lg:h-16 lg:w-16 object-contain"
              style={{ filter: "drop-shadow(0 0 14px rgba(255,255,255,0.1))" }}
            />
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
          <div className="lg:hidden -mx-6 mt-0 px-6 pb-6 pt-4 bg-black/90 backdrop-blur-xl border-t border-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.6)]">
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
