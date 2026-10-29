"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Rsvp = {
  id: number;
  name: string;
  response: "accept" | "decline";
  message: string | null;
  created_at: string;
};

export function AdminDashboard() {
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchRsvps = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/rsvps");
      const data = await res.json();

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (data.ok) {
        setRsvps(data.data);
      } else {
        setError(data.error || "Erro ao carregar dados.");
      }
    } catch {
      setError("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchRsvps();
  }, [fetchRsvps]);

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (err) {
      console.error(err);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR");
  }

  const total = rsvps.length;
  const accepted = rsvps.filter((r) => r.response === "accept").length;
  const declined = rsvps.filter((r) => r.response === "decline").length;

  return (
    <main className="texture-bg min-h-screen bg-cream px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl text-ink mb-2">
              Confirmações de Presença
            </h1>
            <p className="text-ink-soft">
              Casamento João & Vitória • 6 de fevereiro de 2027
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/admin/presentes"
              className="self-start rounded-lg border border-beige bg-cream px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-beige/50"
            >
              Gerenciar presentes
            </a>
            <button
              onClick={handleLogout}
              className="self-start rounded-lg border border-beige bg-cream px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-beige/50"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-beige bg-cream/95 p-4 backdrop-blur-sm">
            <p className="text-sm text-ink-soft mb-1">Total</p>
            <p className="text-2xl font-bold text-ink">{total}</p>
          </div>
          <div className="rounded-xl border border-beige bg-cream/95 p-4 backdrop-blur-sm">
            <p className="text-sm text-ink-soft mb-1">Aceitaram</p>
            <p className="text-2xl font-bold text-ocean">{accepted}</p>
          </div>
          <div className="rounded-xl border border-beige bg-cream/95 p-4 backdrop-blur-sm">
            <p className="text-sm text-ink-soft mb-1">Declinaram</p>
            <p className="text-2xl font-bold text-orange">{declined}</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-ink-soft">Carregando...</div>
        ) : error ? (
          <div className="text-center py-12 text-orange" role="alert">
            {error}
          </div>
        ) : rsvps.length === 0 ? (
          <div className="text-center py-12 text-ink-soft">
            Nenhuma confirmação recebida ainda.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rsvps.map((rsvp) => (
              <article
                key={rsvp.id}
                className="rounded-xl border border-beige bg-cream/95 backdrop-blur-sm p-4 flex flex-col gap-3 transition-colors hover:bg-cream-deep/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold text-ink break-words">
                    {rsvp.name}
                  </h2>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${
                      rsvp.response === "accept"
                        ? "bg-ocean/10 text-ocean"
                        : "bg-orange/10 text-orange"
                    }`}
                  >
                    {rsvp.response === "accept" ? "Aceitou" : "Declinou"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-ink mb-1">Mensagem</p>
                  {rsvp.message ? (
                    <p className="text-ink-soft whitespace-pre-wrap break-words">
                      {rsvp.message}
                    </p>
                  ) : (
                    <p className="text-ink-soft italic">Sem mensagem</p>
                  )}
                </div>
                <div className="mt-auto pt-2 border-t border-beige/50">
                  <p className="text-xs text-ink-soft">
                    {formatDate(rsvp.created_at)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
