"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.ok) {
        router.push("/admin");
      } else {
        setError(data.error || "Senha incorreta.");
      }
    } catch (err) {
      setError("Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="texture-bg relative min-h-screen bg-cream flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md">
        <figure className="relative mx-auto w-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-[280px] sm:max-w-[400px] px-6 py-8 sm:px-8 sm:py-10">
              <h1 className="font-display text-center text-2xl sm:text-3xl text-ink mb-6">
                Área Administrativa
              </h1>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-ink mb-2">
                    Senha
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    className="w-full rounded-lg border border-beige bg-cream px-4 py-3 text-base text-ink placeholder:text-ink-soft/60 transition-colors focus:border-ocean focus:bg-paper focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                    placeholder="Digite a senha"
                  />
                </div>
                {error && (
                  <p className="text-sm text-orange" role="alert">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-ocean px-6 py-3 font-semibold text-cream transition-all duration-200 hover:bg-ink disabled:cursor-not-allowed disabled:bg-ink-soft disabled:text-cream/70"
                >
                  {loading ? "Entrando..." : "Entrar"}
                </button>
              </form>
            </div>
          </div>
        </figure>
      </div>
    </main>
  );
}
