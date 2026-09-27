import { Link, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Bell, CalendarDays, Check, Clock3, MapPin, QrCode, ShieldCheck, Ticket } from "lucide-react";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-LK", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default function Pass() {
  const [, params] = useRoute("/pass/:token");
  const token = params?.token ?? "";
  const passQuery = trpc.payments.pass.useQuery(
    { token },
    { enabled: Boolean(token), refetchInterval: 5000, refetchOnWindowFocus: true },
  );
  const pass = passQuery.data;

  if (passQuery.isLoading) {
    return <div className="grid min-h-screen place-items-center bg-[#f5f5f5] text-sm text-[#77766f]">Loading your day pass…</div>;
  }

  const isExpired = pass?.status === "expired";

  if (!pass || pass.status !== "approved") {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f5f5f5] p-5 text-[#181817]">
        <div className="w-full max-w-md border border-[#e1e0dc] bg-white p-8 text-center shadow-[0_10px_35px_rgba(24,24,23,0.06)]">
          <div className="mx-auto grid h-14 w-14 place-items-center bg-[#fff1f1] text-[#ed1c2e]"><Clock3 size={27} /></div>
          <h1 className="mt-6 font-display text-3xl font-black tracking-[-0.06em]">{isExpired ? "Day pass expired" : "Day pass not active yet"}</h1>
          <p className="mt-3 text-sm leading-6 text-[#77766f]">{isExpired ? "This day pass ended at 10:00 PM Sri Lanka time on the selected visit date. The pass cannot be opened again." : "Your pass details will appear here after the PowerWorld owner confirms your QR payment."}</p>
          <Link href="/" className="mt-7 inline-flex items-center gap-2 bg-[#ed1c2e] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#c51426]"><ArrowLeft size={16} /> Back to purchase page</Link>
        </div>
      </main>
    );
  }

  const passNumber = `#PW${String(pass.id).padStart(8, "0")}`;
  const accessLabel = pass.quantity === 1 ? "Day Pass · Primary" : `Day Pass · ${pass.quantity} passes`;

  return (
    <main className="min-h-screen bg-[#f7f7f7] text-[#181817]">
      <header className="border-b border-[#e8e8e8] bg-white shadow-[0_2px_10px_rgba(24,24,23,0.05)]">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" aria-label="PowerWorld home"><img src="/manus-storage/powerworld-logo-header_5dd68be4.png" alt="PowerWorld Fitness Centres" className="h-10 w-auto sm:h-12" /></Link>
          <button aria-label="Notifications" className="grid h-10 w-10 place-items-center text-[#77766f]"><Bell size={23} /></button>
        </div>
      </header>

      <div className="mx-auto max-w-[850px] px-5 pb-12 pt-8 sm:px-8 sm:pt-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3"><Link href="/" className="grid h-9 w-9 place-items-center rounded-full border border-[#deddd7] bg-white text-[#595852] transition hover:border-[#ed1c2e] hover:text-[#ed1c2e]" aria-label="Back"><ArrowLeft size={17} /></Link><h1 className="font-display text-3xl font-black tracking-[-0.06em] sm:text-4xl">Day pass</h1></div>
          <div className="hidden items-center gap-2 text-xs font-bold text-[#24804a] sm:flex"><ShieldCheck size={15} /> Confirmed</div>
        </div>
        <div className="mt-6 flex items-center gap-1 border-b border-[#e2e2e2] text-sm font-semibold text-[#9b9a95]"><span className="border-b-2 border-[#181817] px-4 py-3 text-[#181817]">Primary</span><span className="px-4 py-3">Pass history</span></div>

        <section className="relative mt-7 overflow-hidden rounded-[18px] border border-[#e5e5e5] bg-white shadow-[0_12px_35px_rgba(24,24,23,0.08)]">
          <div className="absolute inset-y-0 left-0 w-1.5 bg-[#25ce69]" />
          <div className="flex items-center justify-between bg-[#f4f4f4] px-5 py-3 text-xs font-semibold text-[#595852] sm:px-7"><span>{passNumber} <span className="mx-1 text-[#aaa8a2]">•</span> {accessLabel}</span><span className="font-bold text-[#25a95b]">Active <span className="text-[10px]">•</span></span></div>
          <div className="px-5 py-6 sm:px-8 sm:py-8">
            <div className="flex items-center gap-4"><div className="grid h-14 w-14 place-items-center rounded-full bg-[#181817] text-white"><Ticket size={25} /></div><div><h2 className="font-display text-2xl font-black tracking-[-0.05em]">{pass.customerName}</h2><p className="mt-1 text-sm text-[#77766f]">PowerWorld · One-day gym access</p></div><div className="ml-auto hidden rounded-full bg-[#e7f7ed] p-2 text-[#20a15a] sm:block"><Check size={18} /></div></div>
            <div className="my-7 border-t border-[#e3e3e3]" />
            <div className="grid gap-6 sm:grid-cols-2"><div><div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#a09e98]">Pass value</div><div className="mt-2 font-display text-3xl font-black">LKR {pass.amount.toLocaleString()}</div></div><div><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#a09e98]"><CalendarDays size={14} /> Valid date</div><div className="mt-2 text-lg font-bold">{formatDate(pass.visitDate)}</div><div className="mt-1 text-xs text-[#8b8a83]">Valid until 10:00 PM Sri Lanka time</div></div></div>
            <div className="my-7 border-t border-[#e3e3e3]" />
            <div className="grid gap-5 sm:grid-cols-2"><div><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#a09e98]"><MapPin size={14} /> Gym branch</div><div className="mt-2 text-base font-bold">{pass.branch}</div></div><div><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#a09e98]"><QrCode size={14} /> Entry status</div><div className="mt-2 text-base font-bold text-[#20a15a]">Ready to check in</div></div></div>
          </div>
          <div className="flex flex-col gap-3 border-t border-[#e5e5e5] bg-[#fcfcfc] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8"><p className="text-xs leading-5 text-[#77766f]">Show this confirmed pass at the {pass.branch} front desk on your visit date.</p><Link href="/" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#cfcfcb] bg-white px-5 py-3 text-sm font-semibold text-[#595852] transition hover:border-[#ed1c2e] hover:text-[#ed1c2e]">Buy another pass <ArrowLeft size={15} className="rotate-180" /></Link></div>
        </section>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#9b9a95]"><ShieldCheck size={14} className="text-[#25a95b]" /> Verified by PowerWorld Fitness Centres</div>
      </div>
    </main>
  );
}
