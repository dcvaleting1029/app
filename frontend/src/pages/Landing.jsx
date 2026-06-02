import { useEffect, useRef, useState } from "react";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import BookingPanel from "../components/BookingPanel";
import Features from "../components/Features";
import Packages from "../components/Packages";
import CeramicAddons from "../components/CeramicAddons";
import WhyChoose from "../components/WhyChoose";
import Gallery from "../components/Gallery";
import Reviews from "../components/Reviews";
import CtaBanner from "../components/CtaBanner";
import Footer from "../components/Footer";

export default function Landing() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const bookingRef = useRef(null);

  const openBooking = () => {
    setBookingOpen(true);
    // smooth scroll to booking panel
    setTimeout(() => {
      bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  useEffect(() => {
    document.title =
      "Car Detailing & Valeting Edinburgh | Ceramic Coating Specialists | DC Valeting";
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white">
      <div className="noise-overlay" />
      <div className="fixed top-0 left-0 right-0 z-40">
        <TopBar />
        <Navbar onBook={openBooking} />
      </div>

      <main className="relative">
        <Hero onBook={openBooking} bookingRef={bookingRef} />
        <Features />
        <Packages onBook={openBooking} />
        <CeramicAddons />
        <WhyChoose />
        <Gallery />
        <Reviews />
        <CtaBanner onBook={openBooking} />
      </main>

      <Footer />

      {/* Mobile booking sheet trigger (sticky bottom on small screens) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 lg:hidden">
        <button
          data-testid="mobile-book-fab"
          onClick={openBooking}
          className="btn-primary shadow-2xl"
        >
          BOOK YOUR VALET
        </button>
      </div>

      {/* Mobile booking modal */}
      {bookingOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-black/80 backdrop-blur-md p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setBookingOpen(false);
          }}
        >
          <div className="max-w-md mx-auto mt-12">
            <BookingPanel onClose={() => setBookingOpen(false)} mobile />
          </div>
        </div>
      )}
    </div>
  );
}
