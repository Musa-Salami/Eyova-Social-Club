"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ADMIN_SESSION_KEY, validateAdminLogin } from "@/lib/admin-auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateAdminLogin(email, password)) {
      setError("Invalid login details.");
      return;
    }
    localStorage.setItem(ADMIN_SESSION_KEY, "true");
    router.push("/admin");
  };

  return (
    <section className="mx-auto w-full max-w-md px-4 py-14 md:px-6">
      <div className="glass-card rounded-3xl p-6 md:p-8">
        <div className="mb-5 flex items-center gap-3">
          <Image
            src="/eyova-logo.jpg"
            alt="Eyova logo"
            width={56}
            height={56}
            className="rounded-xl border border-cyan-300/30"
          />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-300">
              Admin Access
            </p>
            <h1 className="text-2xl font-semibold text-white">Eyova Admin Login</h1>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block text-sm text-slate-200">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-lg border border-cyan-300/25 bg-slate-950/70 p-2.5 text-sm text-white outline-none focus:border-cyan-300"
              required
            />
          </label>
          <label className="block text-sm text-slate-200">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-cyan-300/25 bg-slate-950/70 p-2.5 text-sm text-white outline-none focus:border-cyan-300"
              required
            />
          </label>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <button
            type="submit"
            className="w-full rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
          >
            Login to Admin
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-300">
          <Link href="/" className="text-cyan-300 hover:text-cyan-200">
            Return to dashboard
          </Link>
        </p>
      </div>
    </section>
  );
}
