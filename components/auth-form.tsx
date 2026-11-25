"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck, User } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { LanguageSwitcher } from "@/components/language-switcher";

const input =
  "h-12 w-full rounded-xl border border-foreground/15 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15";
const icon = "pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-foreground/40";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const t = useTranslations("auth");
  const { ready, user, permissions, login, register } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);
  const isRegister = mode === "register";

  // Staff land on the admin dashboard, customers on their profile. This also
  // sends an already logged-in visitor away from this page.
  useEffect(() => {
    if (ready && user) router.replace(permissions.length ? "/admin" : "/account");
  }, [ready, user, permissions, router]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "");
    setBusy(true);
    setError("");
    try {
      if (isRegister) await register(value("name"), value("email"), value("password"));
      else await login(value("email"), value("password"));
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-topbar text-topbar-foreground lg:block">
        <Image src="/images/hero-1.webp" alt="" fill priority sizes="55vw" className="object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-topbar via-topbar/70 to-transparent" />
        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <Brand light />
          <div className="max-w-md space-y-5">
            <h2 className="font-serif text-4xl font-semibold leading-tight xl:text-5xl">
              {t("heroTitle")}
            </h2>
            <p className="text-topbar-foreground/70">{t("heroText")}</p>
            <p className="inline-flex items-center gap-2 rounded-full border border-topbar-foreground/20 px-4 py-2 text-xs">
              <ShieldCheck className="size-4 text-highlight" /> {t("secure")}
            </p>
          </div>
          <p className="text-xs text-topbar-foreground/50">© Mugdha Haven</p>
        </div>
      </aside>

      {/* Form */}
      <section className="flex flex-col px-6 py-8 sm:px-12">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground">
            <ArrowLeft className="size-4" /> {t("backToStore")}
          </Link>
          <LanguageSwitcher />
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <div className="mb-8 lg:hidden">
            <Brand />
          </div>
          <h1 className="font-serif text-4xl font-semibold">
            {t(isRegister ? "registerTitle" : "loginTitle")}
          </h1>
          <p className="mt-2 text-sm text-foreground/60">
            {t(isRegister ? "registerSub" : "loginSub")}
          </p>

          {/* method="post": a submit before React loads must not put the password in the URL */}
          <form onSubmit={submit} method="post" className="mt-8 space-y-5">
            {isRegister && (
              <label className="block text-sm font-medium">
                {t("name")}
                <span className="relative mt-1.5 block">
                  <User className={icon} />
                  <input name="name" required minLength={2} autoComplete="name" className={input} />
                </span>
              </label>
            )}
            <label className="block text-sm font-medium">
              {t("email")}
              <span className="relative mt-1.5 block">
                <Mail className={icon} />
                <input name="email" type="email" required autoComplete="email" className={input} />
              </span>
            </label>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                {t("password")}
              </label>
              <div className="relative mt-1.5">
                <Lock className={icon} />
                <input
                  id="password"
                  name="password"
                  type={show ? "text" : "password"}
                  required
                  minLength={isRegister ? 10 : undefined}
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  className={`${input} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  aria-label={t(show ? "hidePassword" : "showPassword")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-foreground/50 hover:text-foreground"
                >
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {isRegister && <p className="mt-1.5 text-xs text-foreground/60">{t("passwordHint")}</p>}
            </div>

            {error && (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-cta text-sm font-semibold text-cta-foreground shadow-lg shadow-foreground/20 transition hover:-translate-y-0.5 hover:bg-cta/90 disabled:translate-y-0 disabled:opacity-60"
            >
              {busy && <Loader2 className="size-4 animate-spin" />}
              {busy ? t("wait") : t(isRegister ? "register" : "login")}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-foreground/60">
            {t(isRegister ? "haveAccount" : "noAccount")}{" "}
            <Link href={isRegister ? "/login" : "/register"} className="font-semibold text-primary hover:underline">
              {t(isRegister ? "login" : "register")}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

function Brand({ light }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <span className="flex size-11 items-center justify-center rounded-xl bg-highlight font-serif text-xl font-bold text-highlight-foreground">
        M
      </span>
      <span className={`font-serif text-2xl font-semibold ${light ? "text-topbar-foreground" : ""}`}>
        Mugdha Haven
      </span>
    </Link>
  );
}
