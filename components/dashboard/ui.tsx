"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

export const panel = "rounded-2xl border border-black/5 bg-white shadow-sm";
export const field =
  "h-11 w-full rounded-xl border border-black/10 bg-white px-3.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 disabled:bg-black/5";

const VARIANTS = {
  primary: "bg-cta text-cta-foreground shadow-sm hover:bg-cta/90",
  outline: "border border-black/10 bg-white hover:bg-black/5",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

export function Btn({
  variant = "primary",
  small,
  busy,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof VARIANTS;
  small?: boolean;
  busy?: boolean;
}) {
  return (
    <button
      type="button"
      {...props}
      disabled={busy || props.disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        small ? "h-8 px-3 text-xs" : "h-11 px-5 text-sm",
        VARIANTS[variant],
        className
      )}
    >
      {busy && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}

const TONES: Record<string, string> = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  amber: "bg-amber-50 text-amber-700 ring-amber-600/20",
  red: "bg-red-50 text-red-700 ring-red-600/20",
  blue: "bg-sky-50 text-sky-700 ring-sky-600/20",
  gray: "bg-black/5 text-foreground/70 ring-black/10",
};

export const STATUS_TONE: Record<string, string> = {
  active: "green", delivered: "green", confirmed: "blue", shipped: "blue",
  pending: "amber", locked: "amber", disabled: "red", cancelled: "red",
};

export function Pill({ tone = "gray", children }: { tone?: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset", TONES[tone])}>
      {children}
    </span>
  );
}

export function PageHeader({ title, text, children }: { title: string; text?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-serif text-3xl font-semibold">{title}</h1>
        {text && <p className="mt-1 text-sm text-foreground/60">{text}</p>}
      </div>
      {children}
    </div>
  );
}

export function Modal({
  title,
  text,
  onClose,
  wide,
  children,
}: {
  title: string;
  text?: string;
  onClose: () => void;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn("rounded-2xl bg-white p-6", wide ? "max-w-3xl" : "max-w-lg")}>
        <DialogTitle className="pr-12 font-serif text-2xl font-semibold">{title}</DialogTitle>
        <DialogDescription className={cn("mt-1 text-sm text-foreground/60", !text && "sr-only")}>
          {text ?? title}
        </DialogDescription>
        <div className="mt-5">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

export type Confirm = { title: string; text: string; action: string; danger?: boolean; run: () => unknown };

export function ConfirmModal({ confirm, onClose }: { confirm: Confirm | null; onClose: () => void }) {
  if (!confirm) return null;
  return (
    <Modal title={confirm.title} text={confirm.text} onClose={onClose}>
      <div className="flex justify-end gap-3">
        <Btn variant="outline" onClick={onClose}>Cancel</Btn>
        <Btn
          variant={confirm.danger ? "danger" : "primary"}
          onClick={() => {
            onClose();
            confirm.run();
          }}
        >
          {confirm.action}
        </Btn>
      </div>
    </Modal>
  );
}

export function Alert({ error }: { error: string }) {
  if (!error) return null;
  return (
    <p role="alert" className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <XCircle className="size-4 shrink-0" /> {error}
    </p>
  );
}

export function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(onDone, 3500);
    return () => clearTimeout(id);
  }, [message, onDone]);
  if (!message) return null;
  return (
    <p role="status" className="fixed bottom-5 right-5 z-[60] flex max-w-sm items-center gap-2 rounded-xl bg-topbar px-4 py-3 text-sm text-topbar-foreground shadow-2xl">
      <CheckCircle2 className="size-4 shrink-0 text-emerald-400" /> {message}
    </p>
  );
}

export function Empty({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <div className="flex justify-center p-12 text-sm text-foreground/50">
      {loading ? <Loader2 className="size-6 animate-spin" aria-label="Loading" /> : children}
    </div>
  );
}

export function IconBtn({
  label,
  icon: Icon,
  danger,
  onClick,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "flex size-8 items-center justify-center rounded-lg text-foreground/60 transition hover:bg-black/5 hover:text-foreground",
        danger && "text-red-600 hover:bg-red-50 hover:text-red-700"
      )}
    >
      <Icon className="size-4" />
    </button>
  );
}

export function Checks({
  options,
  selected,
  onChange,
}: {
  options: { value: string; label: string; hint?: string; disabled?: boolean }[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((o) => (
        <label key={o.value} className="flex cursor-pointer has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60 items-start gap-2.5 rounded-xl border border-black/10 p-3 text-sm transition has-[:checked]:border-primary has-[:checked]:bg-primary/5">
          <input
            type="checkbox"
            aria-label={o.label}
            className="mt-0.5 size-4 accent-[#6B5846]"
            disabled={o.disabled}
            checked={selected.includes(o.value)}
            onChange={(e) =>
              onChange(e.target.checked ? [...selected, o.value] : selected.filter((v) => v !== o.value))
            }
          />
          <span>
            <span className="block font-medium">{o.label}</span>
            {o.hint && <span className="block text-xs text-foreground/50">{o.hint}</span>}
          </span>
        </label>
      ))}
    </div>
  );
}

// Loads a list and runs changes, showing the server's answer either way.
export function useAdminData<T>(path: string | null) {
  const [data, setData] = useState<T[]>([]);
  const [meta, setMeta] = useState<{ total: number; totalPages: number } | null>(null);
  const [loading, setLoading] = useState(Boolean(path));
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const reload = useCallback(async () => {
    if (!path) return;
    try {
      const res = await api<{ data: T[]; meta?: { total: number; totalPages: number } }>(path);
      setData(res.data);
      setMeta(res.meta ?? null);
      setLoadError("");
    } catch (err) {
      setLoadError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    reload();
  }, [reload]);

  const clearMessage = useCallback(() => setMessage(""), []);
  const clearError = useCallback(() => setError(""), []);

  async function run(url: string, method: string, body?: unknown, success = "Saved") {
    setError("");
    setMessage("");
    setBusy(true);
    try {
      await api(url, { method, body });
      setMessage(success);
      await reload();
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    } finally {
      setBusy(false);
    }
  }

  return { data, meta, reload, loading, busy, error: error || loadError, message, run, clearMessage, clearError };
}
