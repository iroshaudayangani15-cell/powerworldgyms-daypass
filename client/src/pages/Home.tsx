import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  CreditCard,
  Clock3,
  Info,
  ExternalLink,
  LockKeyhole,
  MapPin,
  Menu,
  Minus,
  Plus,
  QrCode,
  ShieldCheck,
  Sparkles,
  Ticket,
  X,
} from "lucide-react";
import { toast } from "sonner";

const gyms = [
  { name: "Attidiya", detail: "Open daily", tag: "Branch" },
  { name: "Bellanthara", detail: "Open daily", tag: "Branch" },
  { name: "Bokundara", detail: "Open daily", tag: "Branch" },
  { name: "Boralesgamuwa", detail: "Open daily", tag: "Branch" },
  { name: "CR & FC", detail: "Open daily", tag: "Branch" },
  { name: "The Ladies", detail: "Open daily", tag: "Ladies only" },
  { name: "Ethul Kotte", detail: "Open daily", tag: "Branch" },
  { name: "High Level", detail: "Open daily", tag: "Branch" },
  { name: "IDH", detail: "Open daily", tag: "Branch" },
  { name: "Kalubowila", detail: "Open daily", tag: "Branch" },
  { name: "Kiribathgoda", detail: "Open daily", tag: "Branch" },
  { name: "Kotahena", detail: "Open daily", tag: "Branch" },
  { name: "Kottawa", detail: "Open daily", tag: "Branch" },
  { name: "Maharagama", detail: "Open daily", tag: "Branch" },
  { name: "Malabe", detail: "Open daily", tag: "Branch" },
  { name: "Moratuwa", detail: "Open daily", tag: "Branch" },
  { name: "Nawala", detail: "Open daily", tag: "Branch" },
  { name: "Obesekarapura", detail: "Open daily", tag: "Branch" },
  { name: "Ragama", detail: "Open daily", tag: "Branch" },
  { name: "Tamil Union", detail: "Open daily", tag: "Branch" },
  { name: "Welisara", detail: "Open daily", tag: "Branch" },
  { name: "Welisarathease", detail: "Open daily", tag: "Branch" },
];

const benefits = [
  "Full gym floor access",
  "Cardio & strength zones",
  "Changing rooms & showers",
  "One visit, no commitment",
];

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-LK", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default function Home() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [date, setDate] = useState(today);
  const [gym, setGym] = useState(gyms[0].name);
  const [quantity, setQuantity] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentChoice, setPaymentChoice] = useState<"qr" | "card">("qr");
  const [complete, setComplete] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const total = quantity * 2000;
  const submitPayment = trpc.payments.submitQr.useMutation({
    onSuccess: () => {
      setPaymentOpen(false);
      setComplete(true);
    },
    onError: () => toast.error("We couldn't submit your payment for review. Please try again."),
  });

  const submitCheckout = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCheckoutOpen(false);
    setPaymentOpen(true);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f4f1] text-[#181817]">
      <div className="mx-auto min-h-screen max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <header className="relative z-20 flex items-center justify-between py-5 lg:py-7">
          <a href="#top" className="group flex items-center gap-3" aria-label="PowerWorld home">
            <img src="/manus-storage/powerworld-logo-header_5dd68be4.png" alt="PowerWorld Fitness Centres" className="h-11 w-auto object-contain sm:h-12" />
          </a>

          <nav className="hidden items-center gap-8 text-[13px] font-semibold text-[#6e6d66] lg:flex">
            <a href="#what-you-get" className="transition-colors hover:text-[#ed1c2e]">What you get</a>
            <a href="#how-it-works" className="transition-colors hover:text-[#ed1c2e]">How it works</a>
            <a href="#support" className="transition-colors hover:text-[#ed1c2e]">Need help?</a>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-[#deddd7] bg-white/70 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#77766f] sm:inline-flex">Sri Lanka</span>
            <button className="grid h-10 w-10 place-items-center border border-[#deddd7] bg-white text-[#181817] transition hover:border-[#ed1c2e] hover:text-[#ed1c2e] lg:hidden" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle navigation">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
          {menuOpen && (
            <nav className="absolute right-0 top-16 w-48 border border-[#deddd7] bg-white p-2 shadow-xl lg:hidden">
              {[["#what-you-get", "What you get"], ["#how-it-works", "How it works"], ["#support", "Need help?"]].map(([href, label]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="block px-3 py-3 text-sm font-semibold text-[#66655f] hover:bg-[#f7f6f2] hover:text-[#ed1c2e]">{label}</a>)}
            </nav>
          )}
        </header>

        <section id="top" className="relative grid gap-8 pb-16 pt-9 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pb-24 lg:pt-16">
          <div className="relative z-10 flex flex-col justify-center">
            <div className="mb-7 inline-flex w-fit items-center gap-2 rounded-full border border-[#e8b7bb] bg-[#fff4f4] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c51426]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ed1c2e] shadow-[0_0_0_4px_rgba(237,28,46,0.12)]" />
              Day pass · now available
            </div>
            <h1 className="max-w-[720px] font-display text-[clamp(3.5rem,8vw,7.4rem)] font-black leading-[0.87] tracking-[-0.085em] text-[#171716]">
              One day.<br /><span className="text-[#ed1c2e]">Full power.</span>
            </h1>
            <p className="mt-8 max-w-[470px] text-[16px] leading-7 text-[#6c6b65] sm:text-[18px] sm:leading-8">Drop in, train hard, and experience PowerWorld on your schedule. Get full access to the gym floor for one simple price.</p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a href="#buy" className="group inline-flex items-center gap-3 bg-[#181817] px-5 py-3.5 text-sm font-bold text-white shadow-[0_14px_30px_rgba(24,24,23,0.18)] transition hover:-translate-y-0.5 hover:bg-[#ed1c2e]">Get your pass <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></a>
              <span className="flex items-center gap-2 text-xs font-semibold text-[#87867f]"><ShieldCheck size={16} className="text-[#ed1c2e]" /> No membership required</span>
            </div>
            <div className="mt-14 grid max-w-[520px] grid-cols-3 border-y border-[#deddd7] py-5">
              <div><div className="font-display text-2xl font-black tracking-[-0.05em]">01</div><div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#84837d]">Pass type</div></div>
              <div className="border-l border-[#deddd7] pl-5"><div className="font-display text-2xl font-black tracking-[-0.05em]">24h</div><div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#84837d]">Access window</div></div>
              <div className="border-l border-[#deddd7] pl-5"><div className="font-display text-2xl font-black tracking-[-0.05em]">LKR</div><div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#84837d]">Local pricing</div></div>
            </div>
          </div>

          <div id="buy" className="relative z-10 lg:pt-2">
            <div className="relative overflow-hidden bg-[#ed1c2e] p-2 shadow-[0_24px_60px_rgba(119,21,28,0.2)] sm:p-3">
              <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full border-[32px] border-white/10" />
              <div className="pointer-events-none absolute bottom-0 left-0 h-1/2 w-full opacity-15" style={{ backgroundImage: "linear-gradient(135deg, transparent 25%, white 25%, white 26%, transparent 26%, transparent 50%, white 50%, white 51%, transparent 51%)", backgroundSize: "46px 46px" }} />
              <div className="relative bg-[#fffdfa] p-5 sm:p-7 lg:p-8">
                <div className="flex items-start justify-between gap-4 border-b border-[#e3e1db] pb-6">
                  <div><div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#ed1c2e]"><Ticket size={14} /> Simple access</div><h2 className="font-display text-3xl font-black tracking-[-0.06em]">Day Pass</h2><p className="mt-1 text-sm text-[#888780]">One visit. All the essentials.</p></div>
                  <div className="text-right"><div className="font-display text-3xl font-black tracking-[-0.06em]">LKR 2,000</div><div className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8b8a83]">per person</div></div>
                </div>

                <div className="mt-6 space-y-5">
                  <div><label htmlFor="visit-date" className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-[#595852]"><CalendarDays size={15} className="text-[#ed1c2e]" /> Visit date</label><div className="relative"><input id="visit-date" type="date" min={today} value={date} onChange={(event) => setDate(event.target.value)} className="h-12 w-full appearance-none border border-[#dcdad3] bg-[#faf9f6] px-3 text-sm font-semibold outline-none transition focus:border-[#ed1c2e] focus:ring-4 focus:ring-[#ed1c2e]/10" /><span className="pointer-events-none absolute right-3 top-3 text-xs font-bold text-[#ed1c2e]">{date === today ? "Today" : ""}</span></div></div>
                  <div><label htmlFor="gym" className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-[#595852]"><MapPin size={15} className="text-[#ed1c2e]" /> Choose your gym</label><div className="relative"><select id="gym" value={gym} onChange={(event) => setGym(event.target.value)} className="h-12 w-full appearance-none border border-[#dcdad3] bg-[#faf9f6] px-3 pr-10 text-sm font-semibold outline-none transition focus:border-[#ed1c2e] focus:ring-4 focus:ring-[#ed1c2e]/10">{gyms.map((item) => <option key={item.name} value={item.name}>{item.name} · {item.tag}</option>)}</select><ChevronDown size={17} className="pointer-events-none absolute right-3 top-3.5 text-[#ed1c2e]" /></div></div>
                  <div className="flex items-center justify-between border-y border-[#e3e1db] py-4"><div><div className="text-xs font-bold uppercase tracking-[0.13em] text-[#595852]">Number of passes</div><div className="mt-1 text-xs text-[#8b8a83]">For you or your training crew</div></div><div className="flex items-center gap-3"><button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="grid h-9 w-9 place-items-center rounded-full border border-[#d9d7d0] text-[#77766f] transition hover:border-[#ed1c2e] hover:text-[#ed1c2e]" aria-label="Decrease pass quantity"><Minus size={15} /></button><span className="w-5 text-center font-display text-xl font-black">{quantity}</span><button type="button" onClick={() => setQuantity((value) => Math.min(5, value + 1))} className="grid h-9 w-9 place-items-center rounded-full bg-[#181817] text-white transition hover:bg-[#ed1c2e]" aria-label="Increase pass quantity"><Plus size={15} /></button></div></div>
                </div>

                <div className="mt-6 flex items-center justify-between"><div><div className="text-xs font-bold uppercase tracking-[0.13em] text-[#888780]">Total today</div><div className="mt-1 text-xs text-[#aaa9a2]">{formatDate(date)} · {gym}</div></div><div className="font-display text-3xl font-black tracking-[-0.06em]">LKR {total.toLocaleString()}</div></div>
                <button type="button" onClick={() => setCheckoutOpen(true)} className="mt-6 flex w-full items-center justify-center gap-3 bg-[#ed1c2e] px-5 py-4 text-sm font-bold text-white shadow-[0_12px_24px_rgba(237,28,46,0.23)] transition hover:-translate-y-0.5 hover:bg-[#c51426]">Continue to checkout <ArrowRight size={17} /></button>
                <p className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] text-[#92918a]"><LockKeyhole size={13} /> Secure checkout · No recurring charges</p>
              </div>
            </div>
          </div>
        </section>

        <section id="what-you-get" className="border-t border-[#deddd7] py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
            <div><div className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#ed1c2e]">Everything you need</div><h2 className="max-w-[420px] font-display text-4xl font-black leading-[0.95] tracking-[-0.07em] sm:text-5xl">Make your visit count.</h2><p className="mt-5 max-w-[360px] text-sm leading-6 text-[#77766f]">No complicated plans or long-term contracts. Just a straightforward day of training, on your terms.</p></div>
            <div className="grid gap-3 sm:grid-cols-2">{benefits.map((benefit, index) => <div key={benefit} className="group flex items-start gap-4 border border-[#deddd7] bg-white/65 p-5 transition hover:-translate-y-1 hover:border-[#e8b7bb] hover:bg-white"><span className="grid h-9 w-9 shrink-0 place-items-center bg-[#fff1f1] text-[#ed1c2e]"><Check size={17} strokeWidth={2.5} /></span><div><div className="font-display text-lg font-bold tracking-[-0.04em]">{benefit}</div><div className="mt-1 text-xs leading-5 text-[#918f87]">Included with every day pass</div></div><span className="ml-auto font-display text-xs font-black text-[#d1cfca]">0{index + 1}</span></div>)}</div>
          </div>
        </section>

        <section id="how-it-works" className="grid gap-8 border-t border-[#deddd7] py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:py-20">
          <div><div className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#ed1c2e]">How it works</div><h2 className="font-display text-4xl font-black leading-[0.95] tracking-[-0.07em] sm:text-5xl">From tap to training<br /><span className="text-[#ed1c2e]">in under a minute.</span></h2></div>
          <div className="space-y-5">{[["01", "Pick a date", "Choose when you want to train — today or a future date."], ["02", "Choose a location", "Select the PowerWorld gym that works best for you."], ["03", "Show your pass", "Bring your confirmation to the front desk and get moving."]].map(([number, title, copy]) => <div key={number} className="flex gap-4 border-b border-[#deddd7] pb-5"><span className="font-display text-sm font-black text-[#ed1c2e]">{number}</span><div><div className="font-display text-lg font-bold tracking-[-0.04em]">{title}</div><div className="mt-1 text-sm leading-6 text-[#85847d]">{copy}</div></div></div>)}</div>
        </section>

        <footer id="support" className="flex flex-col gap-5 border-t border-[#deddd7] py-8 text-xs text-[#8b8a83] sm:flex-row sm:items-center sm:justify-between"><div>© 2026 PowerWorld Fitness Centres</div><div className="flex gap-5 font-semibold"><a href="mailto:hello@powerworldgyms.com" className="transition hover:text-[#ed1c2e]">hello@powerworldgyms.com</a><span>Daily · 5:00 AM – 11:00 PM</span></div></footer>
      </div>

      {checkoutOpen && <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#181817]/60 p-0 backdrop-blur-sm sm:items-center sm:p-5"><div className="relative w-full max-w-lg bg-[#fffdfa] p-5 shadow-2xl sm:p-8"><button onClick={() => setCheckoutOpen(false)} className="absolute right-4 top-4 grid h-9 w-9 place-items-center border border-[#deddd7] text-[#77766f] transition hover:border-[#ed1c2e] hover:text-[#ed1c2e]" aria-label="Close checkout"><X size={17} /></button><div className="mb-7 pr-10"><div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#ed1c2e]"><Sparkles size={14} /> Almost there</div><h2 className="font-display text-3xl font-black tracking-[-0.06em]">Tell us who&apos;s training.</h2><p className="mt-2 text-sm leading-6 text-[#85847d]">We&apos;ll use these details to send your day-pass confirmation.</p></div><form onSubmit={submitCheckout} className="space-y-4"><div><label htmlFor="name" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-[#595852]">Full name</label><input id="name" required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Alex Perera" className="h-12 w-full border border-[#dcdad3] bg-[#faf9f6] px-3 text-sm outline-none transition focus:border-[#ed1c2e] focus:ring-4 focus:ring-[#ed1c2e]/10" /></div><div><label htmlFor="phone" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-[#595852]">Mobile number</label><input id="phone" required type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="07X XXX XXXX" className="h-12 w-full border border-[#dcdad3] bg-[#faf9f6] px-3 text-sm outline-none transition focus:border-[#ed1c2e] focus:ring-4 focus:ring-[#ed1c2e]/10" /></div><div className="flex items-start gap-3 bg-[#fff3f3] p-3 text-xs leading-5 text-[#77766f]"><Info size={16} className="mt-0.5 shrink-0 text-[#ed1c2e]" />This prototype is ready to connect to your preferred payment gateway. No charge is made in this demo.</div><button type="submit" className="flex w-full items-center justify-center gap-3 bg-[#181817] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#ed1c2e]">Continue to payment · LKR {total.toLocaleString()} <ArrowRight size={17} /></button></form></div></div>}

      {paymentOpen && <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#181817]/60 p-0 backdrop-blur-sm sm:items-center sm:p-5"><div className="relative w-full max-w-lg bg-[#fffdfa] p-5 shadow-2xl sm:p-8"><button onClick={() => setPaymentOpen(false)} className="absolute right-4 top-4 grid h-9 w-9 place-items-center border border-[#deddd7] text-[#77766f] transition hover:border-[#ed1c2e] hover:text-[#ed1c2e]" aria-label="Close payment methods"><X size={17} /></button><div className="mb-6 pr-10"><div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#ed1c2e]"><LockKeyhole size={14} /> Secure payment</div><h2 className="font-display text-3xl font-black tracking-[-0.06em]">Choose how to pay.</h2><p className="mt-2 text-sm leading-6 text-[#85847d]">Complete your day-pass payment of <strong className="text-[#181817]">LKR {total.toLocaleString()}</strong>.</p></div><div className="grid grid-cols-2 gap-3"><button type="button" onClick={() => setPaymentChoice("qr")} className={`flex items-center gap-3 border p-4 text-left transition ${paymentChoice === "qr" ? "border-[#ed1c2e] bg-[#fff1f1] text-[#ed1c2e]" : "border-[#deddd7] bg-[#faf9f6] text-[#595852] hover:border-[#ed1c2e]"}`}><QrCode size={22} /><span><span className="block text-sm font-bold">QR Pay</span><span className="mt-0.5 block text-[11px] text-[#8b8a83]">Scan to pay</span></span></button><button type="button" onClick={() => setPaymentChoice("card")} className={`flex items-center gap-3 border p-4 text-left transition ${paymentChoice === "card" ? "border-[#ed1c2e] bg-[#fff1f1] text-[#ed1c2e]" : "border-[#deddd7] bg-[#faf9f6] text-[#595852] hover:border-[#ed1c2e]"}`}><CreditCard size={22} /><span><span className="block text-sm font-bold">Card Pay</span><span className="mt-0.5 block text-[11px] text-[#8b8a83]">Official portal</span></span></button></div>{paymentChoice === "qr" ? <div className="mt-5 border border-[#e3e1db] bg-[#faf9f6] p-5 text-center"><div className="mx-auto mb-4 flex h-10 w-fit items-center gap-2 bg-[#181817] px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white"><QrCode size={15} /> Scan QR to pay</div><img src="/manus-storage/WhatsAppImage2026-09-27at2.25.40PM_f2858c77.jpeg" alt="PowerWorld QR payment code" className="mx-auto aspect-square w-full max-w-[230px] object-contain bg-white p-2" /><p className="mt-4 text-xs leading-5 text-[#77766f]">Open your banking app, scan the code, and pay <strong className="text-[#181817]">LKR {total.toLocaleString()}</strong>.</p><button type="button" disabled={submitPayment.isPending} onClick={() => submitPayment.mutate({ customerName: name, phone, branch: gym, visitDate: date, quantity, amount: total })} className="mt-5 flex w-full items-center justify-center gap-3 bg-[#ed1c2e] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#c51426] disabled:cursor-wait disabled:opacity-60">{submitPayment.isPending ? "Submitting for review…" : "I've completed payment"} {!submitPayment.isPending && <Check size={17} />}</button></div> : <div className="mt-5 border border-[#e3e1db] bg-[#faf9f6] p-5"><div className="flex items-start gap-3"><CreditCard size={20} className="mt-0.5 shrink-0 text-[#ed1c2e]" /><div><div className="font-display text-lg font-bold tracking-[-0.04em]">Continue on PowerWorld</div><p className="mt-1 text-sm leading-6 text-[#77766f]">You&apos;ll be taken to the official PowerWorld app to complete your card payment.</p></div></div><button type="button" onClick={() => { window.location.href = "https://app.powerworldgyms.com"; }} className="mt-5 flex w-full items-center justify-center gap-3 bg-[#181817] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#ed1c2e]">Go to official card payment <ExternalLink size={17} /></button></div>}</div></div>}

      {complete && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#181817]/60 p-5 backdrop-blur-sm"><div className="w-full max-w-md bg-[#fffdfa] p-7 text-center shadow-2xl sm:p-10"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#fff1f1] text-[#ed1c2e]"><Clock3 size={34} /></div><div className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#ed1c2e]">Payment submitted</div><h2 className="mt-3 font-display text-4xl font-black tracking-[-0.07em]">Your payment is in review.</h2><p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-[#85847d]">Your QR payment for {name || "your visit"} at {gym} on {formatDate(date)} was sent to the PowerWorld owner for confirmation.</p><div className="mt-7 flex items-center justify-between border-y border-[#e3e1db] py-4 text-left"><div><div className="text-xs text-[#8b8a83]">Total</div><div className="font-display text-2xl font-black">LKR {total.toLocaleString()}</div></div><div className="text-right"><div className="text-xs text-[#8b8a83]">Status</div><div className="font-display text-2xl font-black text-[#ed1c2e]">Pending</div></div></div><button onClick={() => setComplete(false)} className="mt-7 w-full bg-[#ed1c2e] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#c51426]">Done</button></div></div>}
    </main>
  );
}
