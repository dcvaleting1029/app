import { Instagram, Facebook, Music2, Phone, Mail, MapPin } from "lucide-react";

const cols = [
  {
    title: "Services",
    items: ["Valeting", "Paint Correction", "Ceramic Coating", "Maintenance Plans", "Add-Ons"],
  },
  {
    title: "Company",
    items: ["About Us", "Reviews", "Gallery", "Contact"],
  },
  {
    title: "Information",
    items: ["FAQs", "Terms & Conditions", "Privacy Policy"],
  },
];

export default function Footer() {
  return (
    <footer
      id="contact"
      data-testid="footer"
      className="relative border-t border-white/10 bg-black"
    >
      <div className="mx-auto max-w-[1480px] px-6 pt-20 pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-4">
            <div className="flex items-center gap-3">
              <img
                src="https://customer-assets.emergentagent.com/job_shine-next-level/artifacts/c0p2224e_JA%20%2840%20x%2040%20px%29%20%2821%29.png"
                alt="DC Valeting"
                className="h-20 w-20 object-contain"
              />
            </div>
            <p className="mt-5 text-white/55 text-sm leading-relaxed max-w-sm">
              Professional valeting, detailing & paint correction services in
              Edinburgh and surrounding areas. Built on precision, trust and
              passion for detail.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[
                { Icon: Instagram, label: "instagram" },
                { Icon: Facebook, label: "facebook" },
                { Icon: Music2, label: "tiktok" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  data-testid={`social-${label}`}
                  className="w-9 h-9 rounded-full silver-border bg-white/[0.03] flex items-center justify-center hover:bg-white/[0.1] hover:border-white/30 transition"
                >
                  <Icon size={15} strokeWidth={1.5} className="text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {cols.map((c) => (
            <div key={c.title} className="lg:col-span-2">
              <h4 className="text-[11px] uppercase tracking-[0.3em] text-white/45 mb-5">
                {c.title}
              </h4>
              <ul className="space-y-3">
                {c.items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-white/75 hover:text-white transition"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div className="col-span-2 lg:col-span-2">
            <h4 className="text-[11px] uppercase tracking-[0.3em] text-white/45 mb-5">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-white/75">
              <li className="flex items-start gap-2">
                <Phone size={14} className="mt-0.5 text-white/60" strokeWidth={1.5} />
                <a href="tel:07983668046" className="hover:text-white" data-testid="footer-phone">
                  07983 668 046
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={14} className="mt-0.5 text-white/60" strokeWidth={1.5} />
                <a
                  href="mailto:dcvaleting17@gmail.com"
                  className="hover:text-white break-all"
                  data-testid="footer-email"
                >
                  dcvaleting17@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 text-white/60" strokeWidth={1.5} />
                <span>Edinburgh & Surrounding Areas</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] uppercase tracking-[0.22em] text-white/45">
          <span>© 2025 DC Valeting. All rights reserved.</span>
          <span>Made in Edinburgh</span>
        </div>
      </div>
    </footer>
  );
}
