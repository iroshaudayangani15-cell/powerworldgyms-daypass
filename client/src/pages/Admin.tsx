import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock3,
  CreditCard,
  Dumbbell,
  LogOut,
  RefreshCw,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";

function formatVisitDate(value: string) {
  return new Intl.DateTimeFormat("en-LK", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatSubmittedAt(value: Date | string) {
  return new Intl.DateTimeFormat("en-LK", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function Admin() {
  const { user, loading, logout } = useAuth();
  const requestsQuery = trpc.payments.list.useQuery(undefined, {
    enabled: user?.role === "admin",
    refetchOnWindowFocus: false,
  });
  const updateStatus = trpc.payments.updateStatus.useMutation({
    onSuccess: () => requestsQuery.refetch(),
  });

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-[#f5f4f1] text-sm text-[#77766f]">Loading private dashboard…</div>;
  }

  if (!user) {
    return <div className="grid min-h-screen place-items-center bg-[#181817] p-5 text-white"><div className="w-full max-w-md border border-white/15 bg-white/5 p-8 text-center shadow-2xl"><div className="mx-auto grid h-14 w-14 place-items-center bg-[#ed1c2e] text-white"><ShieldCheck size={26} /></div><div className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff7380]">PowerWorld owner area</div><h1 className="mt-3 font-display text-3xl font-black tracking-[-0.06em]">Private dashboard</h1><p className="mt-3 text-sm leading-6 text-white/60">Sign in with the owner account to review QR payment requests.</p><button onClick={() => startLogin()} className="mt-7 flex w-full items-center justify-center gap-2 bg-[#ed1c2e] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#c51426]">Sign in securely <ArrowUpRight size={17} /></button></div></div>;
  }

  if (user.role !== "admin") {
    return <div className="grid min-h-screen place-items-center bg-[#f5f4f1] p-5"><div className="w-full max-w-md border border-[#deddd7] bg-white p-8 text-center shadow-xl"><div className="mx-auto grid h-14 w-14 place-items-center bg-[#fff1f1] text-[#ed1c2e]"><XCircle size={28} /></div><h1 className="mt-6 font-display text-3xl font-black tracking-[-0.06em]">Access restricted</h1><p className="mt-3 text-sm leading-6 text-[#77766f]">This dashboard is only available to the PowerWorld owner account.</p><button onClick={() => logout()} className="mt-7 inline-flex items-center gap-2 border border-[#deddd7] px-5 py-3 text-sm font-bold text-[#595852] transition hover:border-[#ed1c2e] hover:text-[#ed1c2e]"><LogOut size={16} /> Sign out</button></div></div>;
  }

  const requests = requestsQuery.data ?? [];
  const pending = requests.filter((item) => item.status === "pending");
  const approved = requests.filter((item) => item.status === "approved");
  const rejected = requests.filter((item) => item.status === "rejected");

  return <main className="min-h-screen bg-[#f5f4f1] text-[#181817]"><header className="border-b border-[#deddd7] bg-[#fffdfa]"><div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-8 lg:px-12"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center bg-[#ed1c2e] text-white"><Dumbbell size={18} /></span><div><div className="font-display text-lg font-black tracking-[-0.06em]">POWER<span className="text-[#ed1c2e]">WORLD</span></div><div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8b8a83]">Owner console</div></div></div><div className="flex items-center gap-4"><div className="hidden text-right sm:block"><div className="text-sm font-bold">Anonymous</div><div className="text-xs text-[#8b8a83]">Private access</div></div><button onClick={() => logout()} className="grid h-10 w-10 place-items-center border border-[#deddd7] text-[#77766f] transition hover:border-[#ed1c2e] hover:text-[#ed1c2e]" aria-label="Sign out"><LogOut size={17} /></button></div></div></header><div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#ed1c2e]"><ShieldCheck size={14} /> Owner only</div><h1 className="font-display text-4xl font-black tracking-[-0.07em] sm:text-5xl">Payment confirmations</h1><p className="mt-3 max-w-xl text-sm leading-6 text-[#77766f]">Review QR payment claims before issuing day-pass access. Only your authenticated owner account can see or change these requests.</p></div><button onClick={() => requestsQuery.refetch()} className="inline-flex w-fit items-center gap-2 border border-[#deddd7] bg-white px-4 py-3 text-xs font-bold text-[#595852] transition hover:border-[#ed1c2e] hover:text-[#ed1c2e]"><RefreshCw size={15} className={requestsQuery.isFetching ? "animate-spin" : ""} /> Refresh queue</button></div><div className="mt-8 grid gap-3 sm:grid-cols-3"><div className="border border-[#f0b5ba] bg-[#fff1f1] p-5"><div className="flex items-center justify-between text-[#c51426]"><Clock3 size={18} /><span className="text-[10px] font-bold uppercase tracking-[0.16em]">Needs review</span></div><div className="mt-4 font-display text-4xl font-black">{pending.length}</div><div className="mt-1 text-xs text-[#8b8a83]">Pending QR payments</div></div><div className="border border-[#c9e7d4] bg-[#effaf2] p-5"><div className="flex items-center justify-between text-[#24804a]"><CheckCircle2 size={18} /><span className="text-[10px] font-bold uppercase tracking-[0.16em]">Confirmed</span></div><div className="mt-4 font-display text-4xl font-black">{approved.length}</div><div className="mt-1 text-xs text-[#8b8a83]">Approved passes</div></div><div className="border border-[#deddd7] bg-white p-5"><div className="flex items-center justify-between text-[#77766f]"><XCircle size={18} /><span className="text-[10px] font-bold uppercase tracking-[0.16em]">Declined</span></div><div className="mt-4 font-display text-4xl font-black">{rejected.length}</div><div className="mt-1 text-xs text-[#8b8a83]">Rejected requests</div></div></div><section className="mt-10"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-display text-2xl font-black tracking-[-0.05em]">QR payment queue</h2><p className="mt-1 text-sm text-[#8b8a83]">Newest submissions appear first.</p></div><span className="rounded-full bg-[#181817] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white">{requests.length} total</span></div>{requestsQuery.isLoading ? <div className="border border-[#deddd7] bg-white p-10 text-center text-sm text-[#77766f]">Loading payment requests…</div> : requests.length === 0 ? <div className="border border-dashed border-[#cfc9c0] bg-white p-12 text-center"><CreditCard className="mx-auto text-[#c8c5be]" size={30} /><h3 className="mt-4 font-display text-xl font-bold">No payment requests yet</h3><p className="mt-2 text-sm text-[#8b8a83]">When a customer completes the QR payment step, it will appear here.</p></div> : <div className="space-y-3">{requests.map((request) => <article key={request.id} className="border border-[#deddd7] bg-white p-5 shadow-[0_8px_28px_rgba(24,24,23,0.04)]"><div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"><div className="flex items-start gap-4"><div className={`grid h-11 w-11 shrink-0 place-items-center ${request.status === "pending" ? "bg-[#fff1f1] text-[#ed1c2e]" : request.status === "approved" ? "bg-[#effaf2] text-[#24804a]" : "bg-[#f2f1ee] text-[#89877f]"}`}><QrCodeIcon status={request.status} /></div><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-display text-xl font-bold tracking-[-0.04em]">{request.customerName}</h3><StatusBadge status={request.status} /></div><div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#77766f]"><span>{request.phone}</span><span>{request.branch}</span><span>{formatVisitDate(request.visitDate)}</span></div><div className="mt-2 text-[11px] text-[#aaa79f]">Submitted {formatSubmittedAt(request.submittedAt)} · {request.quantity} {request.quantity === 1 ? "pass" : "passes"}</div></div></div><div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end"><div className="mr-2 font-display text-2xl font-black tracking-[-0.05em]">LKR {request.amount.toLocaleString()}</div>{request.status === "pending" ? <div className="flex gap-2"><button disabled={updateStatus.isPending} onClick={() => updateStatus.mutate({ id: request.id, status: "rejected" })} className="inline-flex items-center justify-center gap-2 border border-[#deddd7] px-4 py-3 text-xs font-bold text-[#77766f] transition hover:border-[#ed1c2e] hover:text-[#ed1c2e] disabled:opacity-50"><X size={15} /> Reject</button><button disabled={updateStatus.isPending} onClick={() => updateStatus.mutate({ id: request.id, status: "approved" })} className="inline-flex items-center justify-center gap-2 bg-[#181817] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#ed1c2e] disabled:opacity-50"><Check size={15} /> Confirm payment</button></div> : <div className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-bold ${request.status === "approved" ? "bg-[#effaf2] text-[#24804a]" : "bg-[#f2f1ee] text-[#89877f]"}`}>{request.status === "approved" ? <CheckCircle2 size={15} /> : <XCircle size={15} />} {request.status === "approved" ? "Payment confirmed" : "Request rejected"}</div>}</div></div></article>)}</div>}</section></div></main>;
}

function StatusBadge({ status }: { status: "pending" | "approved" | "rejected" }) {
  const label = status === "pending" ? "Needs review" : status === "approved" ? "Confirmed" : "Rejected";
  const className = status === "pending" ? "bg-[#fff1f1] text-[#c51426]" : status === "approved" ? "bg-[#effaf2] text-[#24804a]" : "bg-[#f2f1ee] text-[#89877f]";
  return <span className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] ${className}`}>{label}</span>;
}

function QrCodeIcon({ status }: { status: "pending" | "approved" | "rejected" }) {
  if (status === "approved") return <CheckCircle2 size={20} />;
  if (status === "rejected") return <XCircle size={20} />;
  return <CreditCard size={20} />;
}
