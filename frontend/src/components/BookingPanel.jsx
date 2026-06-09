import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { CheckCircle2, ChevronRight, Clock, Lock, ShieldCheck, X } from "lucide-react";

const SERVICES = [
  "Full Package",
  "Exterior Package",
  "Full Valet",
  "Deep Clean",
  "Exterior Wash",
  "Maintenance Clean",
  "Paint Correction Stage 1",
  "Paint Correction Stage 2",
  "Ceramic Coating",
  "Monthly Maintenance",
];

const EXTRAS = [
  { id: "engine-bay-clean", label: "Engine Bay Clean", price: "£30" },
  { id: "pet-hair-removal", label: "Pet Hair Removal", price: "£15" },
  { id: "ozone-odour", label: "Ozone Odour Treatment", price: "£40" },
  { id: "seat-shampoo", label: "Seat Shampoo & Extraction", price: "£30" },
  { id: "steam-clean", label: "Steam Clean", price: "£30" },
  { id: "leather-conditioning", label: "Leather Seat Conditioning", price: "£40" },
  { id: "ceramic-spray", label: "Ceramic Spray Sealant", price: "£20" },
  { id: "mould-treatment", label: "Mould Treatment", price: "£50" },
];

const SIZES = [
  { id: "small", label: "Small / Medium" },
  { id: "suv", label: "SUV / Large" },
  { id: "xl", label: "XL / Van" },
];

const TIMES = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];

const RECURRENCES = [
  { id: "none", label: "One-off", sub: "Single booking" },
  { id: "2w", label: "Every 2 weeks", sub: "Auto-rebook fortnightly" },
  { id: "4w", label: "Every 4 weeks", sub: "Auto-rebook monthly" },
  { id: "6w", label: "Every 6 weeks", sub: "Auto-rebook every 6 weeks" },
];

const STEPS = ["SERVICE", "DATE & TIME", "YOUR DETAILS", "CONFIRM"];

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function BookingPanel({ onClose, mobile }) {
  const [step, setStep] = useState(0);
  const [service, setService] = useState(SERVICES[0]);
  const [size, setSize] = useState(SIZES[0].id);
  const [extras, setExtras] = useState([]);
  const [extrasOpen, setExtrasOpen] = useState(false);
  const [recurrence, setRecurrence] = useState("none");
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const next = () => {
    if (step === 0 && (!service || !size)) {
      toast.error("Please select a service and vehicle size");
      return;
    }
    if (step === 1 && (!date || !time)) {
      toast.error("Please pick a date and time");
      return;
    }
    if (step === 2 && (!name || !email || !phone)) {
      toast.error("Please fill in your details");
      return;
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        service,
        vehicle_size: SIZES.find((s) => s.id === size).label,
        date: date.toISOString().slice(0, 10),
        time,
        name,
        email,
        phone,
        address,
        notes,
        extras: extras.map((id) => EXTRAS.find((e) => e.id === id)?.label).filter(Boolean),
        recurrence,
      };
      await axios.post(`${API}/bookings`, payload);
      toast.success("Booking confirmed — we'll be in touch shortly.");
      setDone(true);
    } catch (e) {
      console.error(e);
      toast.error("Could not submit booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      data-testid="booking-panel"
      className="glass-strong rounded-2xl p-5 shadow-[0_20px_80px_rgba(0,0,0,0.6)] relative"
    >
      {mobile && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/70 hover:text-white"
          data-testid="booking-close"
        >
          <X size={18} />
        </button>
      )}

      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/55">
          Reserve your slot
        </span>
        <span className="text-[10px] uppercase tracking-[0.25em] text-white/55">
          Step {Math.min(step + 1, 4)} / 4
        </span>
      </div>
      <h3 className="font-display text-white text-[28px] tracking-[0.04em] leading-none mt-2">
        BOOK YOUR VALET
      </h3>

      {/* Step indicator */}
      <div className="mt-5 grid grid-cols-4 gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-col gap-1.5">
            <div
              className={`h-[3px] rounded-full ${
                i <= step ? "bg-white" : "bg-white/15"
              } transition-all duration-500`}
            />
            <span
              className={`text-[8.5px] uppercase tracking-[0.18em] ${
                i <= step ? "text-white/90" : "text-white/40"
              }`}
            >
              {i + 1} {s}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5">
        {done ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="mx-auto mb-3 text-white" size={42} strokeWidth={1.2} />
            <div className="font-display text-2xl text-white">BOOKING CONFIRMED</div>
            <p className="text-white/60 text-sm mt-2">
              We've received your request and will contact you to confirm details.
            </p>
            <button
              onClick={() => {
                setDone(false);
                setStep(0);
                setDate(null);
                setTime(null);
                setName("");
                setEmail("");
                setPhone("");
                setAddress("");
                setNotes("");
                setExtras([]);
                setExtrasOpen(false);
                setRecurrence("none");
              }}
              className="btn-outline mt-5"
              data-testid="booking-new"
            >
              MAKE ANOTHER BOOKING
            </button>
          </div>
        ) : (
          <>
            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.22em] text-white/55">
                    Service
                  </label>
                  <select
                    data-testid="booking-service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="mt-1.5 w-full bg-black/60 border border-white/12 rounded-lg px-3 py-3 text-sm text-white focus:outline-none focus:border-white/40 transition"
                  >
                    {SERVICES.map((s) => (
                      <option key={s} value={s} className="bg-black">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.22em] text-white/55">
                    Vehicle Size
                  </label>
                  <div className="grid grid-cols-3 gap-2 mt-1.5">
                    {SIZES.map((s) => (
                      <button
                        key={s.id}
                        data-testid={`booking-size-${s.id}`}
                        onClick={() => setSize(s.id)}
                        className={`px-2 py-2.5 text-[10px] uppercase tracking-[0.14em] rounded-lg border transition ${
                          size === s.id
                            ? "bg-white text-black border-white"
                            : "bg-white/[0.03] text-white/75 border-white/12 hover:border-white/30"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional extras dropdown */}
                <div>
                  <button
                    type="button"
                    data-testid="booking-extras-toggle"
                    onClick={() => setExtrasOpen((o) => !o)}
                    className="w-full flex items-center justify-between bg-black/60 border border-white/12 rounded-lg px-3 py-3 text-sm text-white hover:border-white/30 transition"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-[0.22em] text-white/55">
                        Extras
                      </span>
                      <span className="text-[10px] text-white/40">(optional)</span>
                      {extras.length > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white text-black text-[10px] font-medium leading-none">
                          {extras.length}
                        </span>
                      )}
                    </span>
                    <ChevronRight
                      size={14}
                      className={`transition-transform ${extrasOpen ? "rotate-90" : ""}`}
                    />
                  </button>
                  {extrasOpen && (
                    <div className="mt-2 border border-white/10 rounded-lg bg-black/40 max-h-[220px] overflow-y-auto">
                      {EXTRAS.map((ex) => {
                        const checked = extras.includes(ex.id);
                        return (
                          <label
                            key={ex.id}
                            data-testid={`extra-${ex.id}`}
                            className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm border-b border-white/5 last:border-b-0 hover:bg-white/[0.04] cursor-pointer"
                          >
                            <span className="flex items-center gap-2.5 min-w-0">
                              <span
                                className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                  checked
                                    ? "bg-white border-white"
                                    : "border-white/25 bg-black/30"
                                }`}
                              >
                                {checked && (
                                  <CheckCircle2 size={11} className="text-black" strokeWidth={3} />
                                )}
                              </span>
                              <span className="text-white/85 truncate">{ex.label}</span>
                            </span>
                            <span className="text-white/55 text-[11px] shrink-0">{ex.price}</span>
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={checked}
                              onChange={() => {
                                setExtras((curr) =>
                                  curr.includes(ex.id)
                                    ? curr.filter((x) => x !== ex.id)
                                    : [...curr, ex.id]
                                );
                              }}
                            />
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Recurrence */}
                <div>
                  <label className="text-[10px] uppercase tracking-[0.22em] text-white/55">
                    Booking type
                  </label>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    {RECURRENCES.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        data-testid={`booking-recurrence-${r.id}`}
                        onClick={() => setRecurrence(r.id)}
                        className={`px-3 py-2.5 rounded-lg border text-left transition ${
                          recurrence === r.id
                            ? "bg-white text-black border-white"
                            : "bg-white/[0.03] text-white/85 border-white/12 hover:border-white/30"
                        }`}
                      >
                        <div className="text-[11px] uppercase tracking-[0.18em] leading-tight">
                          {r.label}
                        </div>
                        <div
                          className={`text-[10px] mt-0.5 leading-tight ${
                            recurrence === r.id ? "text-black/65" : "text-white/45"
                          }`}
                        >
                          {r.sub}
                        </div>
                      </button>
                    ))}
                  </div>
                  {recurrence !== "none" && (
                    <p className="text-[11px] text-white/55 mt-2 leading-snug">
                      Subscription bookings auto-rebook after each completed visit. Cancel anytime via the link in your confirmation email.
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.22em] text-white/55">
                    Select date
                  </label>
                  <div className="mt-1.5 rounded-lg border border-white/10 bg-black/50 p-2">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                      className="text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.22em] text-white/55">
                    Time slot
                  </label>
                  <div className="grid grid-cols-3 gap-2 mt-1.5">
                    {TIMES.map((t) => (
                      <button
                        key={t}
                        data-testid={`booking-time-${t}`}
                        onClick={() => setTime(t)}
                        className={`py-2.5 text-xs rounded-full border transition flex items-center justify-center gap-1.5 ${
                          time === t
                            ? "bg-white text-black border-white"
                            : "bg-white/[0.03] text-white/80 border-white/12 hover:border-white/30"
                        }`}
                      >
                        <Clock size={11} strokeWidth={1.6} /> {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <Field
                  label="Full name"
                  testId="booking-name"
                  value={name}
                  onChange={setName}
                  placeholder="John Smith"
                />
                <Field
                  label="Email"
                  testId="booking-email"
                  value={email}
                  onChange={setEmail}
                  type="email"
                  placeholder="you@email.com"
                />
                <Field
                  label="Phone"
                  testId="booking-phone"
                  value={phone}
                  onChange={setPhone}
                  placeholder="07xxx xxx xxx"
                />
                <Field
                  label="Address (optional)"
                  testId="booking-address"
                  value={address}
                  onChange={setAddress}
                  placeholder="Edinburgh"
                />
                <Field
                  label="Notes (optional)"
                  testId="booking-notes"
                  value={notes}
                  onChange={setNotes}
                  placeholder="Anything we should know"
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-2 text-sm">
                <SummaryRow k="Service" v={service} />
                <SummaryRow k="Vehicle" v={SIZES.find((s) => s.id === size).label} />
                {extras.length > 0 && (
                  <SummaryRow
                    k="Extras"
                    v={extras
                      .map((id) => EXTRAS.find((e) => e.id === id)?.label)
                      .filter(Boolean)
                      .join(", ")}
                  />
                )}
                <SummaryRow
                  k="Booking type"
                  v={RECURRENCES.find((r) => r.id === recurrence)?.label || "One-off"}
                />
                <SummaryRow k="Date" v={date?.toDateString()} />
                <SummaryRow k="Time" v={time} />
                <SummaryRow k="Name" v={name} />
                <SummaryRow k="Email" v={email} />
                <SummaryRow k="Phone" v={phone} />
              </div>
            )}

            <div className="flex items-center gap-3 mt-5">
              {step > 0 && (
                <button
                  onClick={back}
                  className="btn-outline flex-1"
                  data-testid="booking-back"
                >
                  BACK
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={next}
                  className="btn-primary flex-1"
                  data-testid="booking-continue"
                >
                  CONTINUE <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  disabled={submitting}
                  onClick={submit}
                  className="btn-primary flex-1 disabled:opacity-60"
                  data-testid="booking-confirm"
                >
                  {submitting ? "CONFIRMING…" : "CONFIRM BOOKING"}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-[9px] uppercase tracking-[0.16em] text-white/55">
        <div className="flex items-center gap-1.5">
          <Lock size={11} /> Free cancellation
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={11} /> Fully insured
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={11} /> 2 min booking
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, testId }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.22em] text-white/55">
        {label}
      </label>
      <input
        data-testid={testId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full bg-black/60 border border-white/12 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition"
      />
    </div>
  );
}

function SummaryRow({ k, v }) {
  return (
    <div className="flex justify-between gap-3 py-2 border-b border-white/8 last:border-b-0">
      <span className="text-white/55 text-[11px] uppercase tracking-[0.18em]">{k}</span>
      <span className="text-white text-right">{v || "—"}</span>
    </div>
  );
}
