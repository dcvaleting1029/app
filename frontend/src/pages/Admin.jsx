import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  Mail,
  Phone,
  MapPin,
  Search,
  LogOut,
  Trash2,
  CheckCircle2,
  CircleAlert,
  Loader2,
  RefreshCw,
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const LS_KEY = "dc_admin_pw";

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];
const STATUS_COLORS = {
  pending: "bg-amber-500/15 text-amber-300 border-amber-400/30",
  confirmed: "bg-sky-500/15 text-sky-300 border-sky-400/30",
  completed: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  cancelled: "bg-rose-500/15 text-rose-300 border-rose-400/30",
};

export default function Admin() {
  const [pw, setPw] = useState(() => localStorage.getItem(LS_KEY) || "");
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loginInput, setLoginInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "DC Valeting — Admin";
  }, []);

  // verify saved pw on mount
  useEffect(() => {
    if (!pw) {
      setChecking(false);
      return;
    }
    axios
      .get(`${API}/admin/stats`, { headers: { "X-Admin-Password": pw } })
      .then(() => setAuthed(true))
      .catch(() => {
        localStorage.removeItem(LS_KEY);
        setPw("");
      })
      .finally(() => setChecking(false));
  }, [pw]);

  const login = async (e) => {
    e?.preventDefault();
    if (!loginInput) return;
    setSubmitting(true);
    try {
      await axios.post(`${API}/admin/login`, { password: loginInput });
      localStorage.setItem(LS_KEY, loginInput);
      setPw(loginInput);
      setAuthed(true);
      toast.success("Welcome back");
    } catch {
      toast.error("Wrong password");
    } finally {
      setSubmitting(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(LS_KEY);
    setPw("");
    setAuthed(false);
    setLoginInput("");
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="animate-spin text-white/60" size={28} />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
        <form
          onSubmit={login}
          className="glass-strong rounded-2xl p-8 w-full max-w-sm"
          data-testid="admin-login-form"
        >
          <div className="text-[10px] uppercase tracking-[0.3em] text-white/55">
            DC Valeting
          </div>
          <h1 className="font-display text-white text-3xl mt-2 tracking-[0.04em]">
            ADMIN ACCESS
          </h1>
          <p className="text-white/55 text-sm mt-2">
            Enter the admin password to view bookings.
          </p>
          <input
            data-testid="admin-password"
            type="password"
            value={loginInput}
            onChange={(e) => setLoginInput(e.target.value)}
            placeholder="Password"
            className="mt-6 w-full bg-black/60 border border-white/12 rounded-lg px-3 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40"
            autoFocus
          />
          <button
            disabled={submitting}
            data-testid="admin-login-submit"
            className="btn-primary w-full mt-4 disabled:opacity-60"
          >
            {submitting ? "SIGNING IN…" : "SIGN IN"}
          </button>
          <a href="/" className="block text-center text-[11px] uppercase tracking-[0.22em] text-white/40 hover:text-white/70 mt-6">
            ← Back to site
          </a>
        </form>
      </div>
    );
  }

  return <Dashboard pw={pw} onLogout={logout} />;
}

function Dashboard({ pw, onLogout }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const headers = useMemo(() => ({ "X-Admin-Password": pw }), [pw]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/admin/bookings`, { headers });
      setBookings(data);
    } catch (e) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      const { data } = await axios.patch(
        `${API}/admin/bookings/${id}`,
        { status },
        { headers }
      );
      setBookings((b) => b.map((x) => (x.id === id ? data : x)));
      toast.success(`Marked ${status}`);
    } catch {
      toast.error("Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking? This cannot be undone.")) return;
    try {
      await axios.delete(`${API}/admin/bookings/${id}`, { headers });
      setBookings((b) => b.filter((x) => x.id !== id));
      toast.success("Booking deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter((b) => {
      if (filter !== "all" && (b.status || "pending") !== filter) return false;
      if (!q) return true;
      return [b.name, b.email, b.phone, b.service, b.vehicle_size, b.date]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [bookings, query, filter]);

  const stats = useMemo(() => {
    const s = { total: bookings.length, pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    bookings.forEach((b) => {
      const st = b.status || "pending";
      if (s[st] != null) s[st] += 1;
    });
    return s;
  }, [bookings]);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="border-b border-white/10 sticky top-0 z-10 bg-black/70 backdrop-blur-xl">
        <div className="max-w-[1480px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="font-display text-white text-lg tracking-[0.18em]">
              DC VALETING
            </a>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 border-l border-white/15 pl-3">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              data-testid="admin-refresh"
              onClick={fetchAll}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/12 hover:bg-white/5 text-xs uppercase tracking-[0.18em]"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            <button
              data-testid="admin-logout"
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/12 hover:bg-white/5 text-xs uppercase tracking-[0.18em]"
            >
              <LogOut size={13} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1480px] mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
          <StatCard label="Total" value={stats.total} accent="white" />
          <StatCard label="Pending" value={stats.pending} accent="amber" />
          <StatCard label="Confirmed" value={stats.confirmed} accent="sky" />
          <StatCard label="Completed" value={stats.completed} accent="emerald" />
          <StatCard label="Cancelled" value={stats.cancelled} accent="rose" />
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              data-testid="admin-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, phone, service…"
              className="w-full bg-black/60 border border-white/12 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", ...STATUSES].map((s) => (
              <button
                key={s}
                data-testid={`admin-filter-${s}`}
                onClick={() => setFilter(s)}
                className={`px-3 py-2 rounded-lg text-[10px] uppercase tracking-[0.2em] border transition ${
                  filter === s
                    ? "bg-white text-black border-white"
                    : "bg-white/[0.03] text-white/70 border-white/12 hover:border-white/30"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings list */}
        {loading ? (
          <div className="py-20 text-center text-white/40">
            <Loader2 className="animate-spin mx-auto" size={24} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-white/40 border border-dashed border-white/10 rounded-2xl">
            <CircleAlert size={26} className="mx-auto mb-3" />
            No bookings match your filters.
          </div>
        ) : (
          <div className="space-y-3" data-testid="admin-bookings-list">
            {filtered.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                onStatus={updateStatus}
                onDelete={deleteBooking}
                isUpdating={updatingId === b.id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const ACCENT_COLORS = {
  white: "text-white",
  amber: "text-amber-300",
  sky: "text-sky-300",
  emerald: "text-emerald-300",
  rose: "text-rose-300",
};

function StatCard({ label, value, accent = "white" }) {
  return (
    <div className="p-5 rounded-2xl silver-border bg-gradient-to-b from-white/[0.04] to-transparent">
      <div className="text-[10px] uppercase tracking-[0.22em] text-white/45">
        {label}
      </div>
      <div className={`font-display text-4xl mt-1 ${ACCENT_COLORS[accent]}`}>
        {value}
      </div>
    </div>
  );
}

function BookingCard({ booking, onStatus, onDelete, isUpdating }) {
  const status = booking.status || "pending";
  const created = booking.created_at
    ? new Date(booking.created_at).toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

  return (
    <div
      data-testid={`booking-row-${booking.id}`}
      className="rounded-2xl silver-border bg-gradient-to-b from-white/[0.03] to-transparent hover:border-white/20 transition p-5 lg:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1 min-w-[260px]">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="font-display text-white text-2xl tracking-[0.03em]">
              {booking.name.toUpperCase()}
            </h3>
            <span
              className={`text-[10px] uppercase tracking-[0.22em] px-2.5 py-1 rounded-full border ${STATUS_COLORS[status]}`}
            >
              {status}
            </span>
          </div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-white/45 mt-1">
            Booked {created}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {STATUSES.filter((s) => s !== status).map((s) => (
            <button
              key={s}
              data-testid={`status-btn-${booking.id}-${s}`}
              disabled={isUpdating}
              onClick={() => onStatus(booking.id, s)}
              className="text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-white/12 hover:bg-white/5 hover:border-white/30 transition disabled:opacity-50"
            >
              {s === "confirmed" && <CheckCircle2 size={11} className="inline mr-1.5 -mt-0.5" />}
              Mark {s}
            </button>
          ))}
          <button
            data-testid={`delete-btn-${booking.id}`}
            onClick={() => onDelete(booking.id)}
            className="p-2 rounded-full border border-white/12 hover:bg-rose-500/10 hover:border-rose-400/30 text-rose-300 transition"
            aria-label="Delete booking"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-3 mt-5 pt-5 border-t border-white/8">
        <Field icon={Calendar} label="Service" value={booking.service} />
        <Field label="Vehicle" value={booking.vehicle_size} />
        <Field icon={Calendar} label="Date" value={booking.date} />
        <Field icon={Clock} label="Time" value={booking.time} />
        <Field icon={Phone} label="Phone" value={booking.phone} href={`tel:${booking.phone}`} />
        <Field icon={Mail} label="Email" value={booking.email} href={`mailto:${booking.email}`} />
        {booking.address && <Field icon={MapPin} label="Address" value={booking.address} />}
        {booking.notes && (
          <div className="col-span-2 lg:col-span-3">
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/40">
              Notes
            </div>
            <div className="text-sm text-white/85 mt-1">{booking.notes}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, value, href }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.22em] text-white/40 flex items-center gap-1.5">
        {Icon && <Icon size={11} />} {label}
      </div>
      {href ? (
        <a
          href={href}
          className="text-sm text-white/90 hover:text-white mt-1 block truncate"
        >
          {value}
        </a>
      ) : (
        <div className="text-sm text-white/90 mt-1 truncate">{value}</div>
      )}
    </div>
  );
}
