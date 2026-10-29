"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Gift = {
  id: number;
  name: string;
  description: string | null;
  price: string | number | null;
  link: string | null;
  quantity_needed: number;
  quantity_reserved: number;
  created_at: string;
  updated_at: string;
};

type GiftForm = {
  name: string;
  description: string;
  price: string;
  link: string;
  quantity_needed: string;
  quantity_reserved: string;
};

const initialForm: GiftForm = {
  name: "",
  description: "",
  price: "",
  link: "",
  quantity_needed: "1",
  quantity_reserved: "0",
};

function formatPrice(price: string | number | null) {
  if (price === null || price === undefined || price === "") return null;
  const num = typeof price === "string" ? Number(price) : price;
  if (Number.isNaN(num)) return null;
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function AdminGiftsManager() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<GiftForm>(initialForm);
  const router = useRouter();

  const fetchGifts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/gifts");
      const data = await res.json();

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (data.ok) {
        setGifts(data.data);
      } else {
        setError(data.error || "Erro ao carregar presentes.");
      }
    } catch {
      setError("Erro ao carregar presentes.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchGifts();
  }, [fetchGifts]);

  function openNewForm() {
    setEditingId(null);
    setForm(initialForm);
    setShowForm(true);
    setError("");
  }

  function openEditForm(gift: Gift) {
    setEditingId(gift.id);
    setForm({
      name: gift.name,
      description: gift.description || "",
      price: gift.price === null || gift.price === undefined ? "" : String(gift.price),
      link: gift.link || "",
      quantity_needed: String(gift.quantity_needed || 1),
      quantity_reserved: String(gift.quantity_reserved || 0),
    });
    setShowForm(true);
    setError("");
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingId ? `/api/admin/gifts/${editingId}` : "/api/admin/gifts";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!data.ok) {
        setError(data.error || "Erro ao salvar presente.");
        return;
      }

      await fetchGifts();
      closeForm();
    } catch {
      setError("Erro ao salvar presente.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja remover este presente?")) return;

    try {
      const res = await fetch(`/api/admin/gifts/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!data.ok) {
        setError(data.error || "Erro ao remover presente.");
        return;
      }

      setGifts((prev) => prev.filter((gift) => gift.id !== id));
    } catch {
      setError("Erro ao remover presente.");
    }
  }

  async function updateQuantity(gift: Gift, quantity_reserved: number) {
    try {
      const res = await fetch(`/api/admin/gifts/${gift.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...gift, quantity_reserved }),
      });

      const data = await res.json();

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (data.ok) {
        setGifts((prev) => prev.map((g) => (g.id === gift.id ? data.data : g)));
      } else {
        setError(data.error || "Erro ao atualizar quantidade.");
      }
    } catch {
      setError("Erro ao atualizar quantidade.");
    }
  }

  return (
    <main className="texture-bg min-h-screen bg-cream px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl text-ink mb-2">
              Lista de Presentes
            </h1>
            <p className="text-ink-soft">
              Gerencie as quantidades necessárias e reservadas
            </p>
          </div>
          <button
            onClick={openNewForm}
            className="self-start rounded-lg bg-ocean px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-ink"
          >
            Cadastrar presente
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-orange/30 bg-orange/10 px-4 py-3 text-sm text-orange" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-ink-soft">Carregando...</div>
        ) : gifts.length === 0 ? (
          <div className="text-center py-12 text-ink-soft">
            Nenhum presente cadastrado ainda.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {gifts.map((gift) => {
              const needed = Number(gift.quantity_needed) || 0;
              const reserved = Number(gift.quantity_reserved) || 0;
              const remaining = Math.max(needed - reserved, 0);
              const isComplete = needed > 0 && reserved >= needed;

              return (
                <article
                  key={gift.id}
                  className="rounded-xl border border-beige bg-cream/95 backdrop-blur-sm p-4 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold text-ink break-words">
                      {gift.name}
                    </h2>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${
                        isComplete ? "bg-ink-soft/10 text-ink-soft" : "bg-ocean/10 text-ocean"
                      }`}
                    >
                      {isComplete ? "Completo" : "Disponível"}
                    </span>
                  </div>

                  {gift.description && (
                    <p className="text-sm text-ink-soft whitespace-pre-wrap break-words">
                      {gift.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    {formatPrice(gift.price) && (
                      <span className="font-semibold text-ink">{formatPrice(gift.price)}</span>
                    )}
                    {gift.link && (
                      <a
                        href={gift.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ocean hover:underline"
                      >
                        Ver produto
                      </a>
                    )}
                  </div>

                  <div className="rounded-lg border border-beige bg-cream/80 p-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-ink-soft">Necessário</span>
                      <span className="font-semibold text-ink">{needed}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-ink-soft">Reservado</span>
                      <span className="font-semibold text-ink">{reserved}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm border-t border-beige/50 pt-2">
                      <span className="text-ink-soft">Faltam</span>
                      <span className="font-semibold text-ink">{remaining}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => updateQuantity(gift, Math.min(reserved + 1, needed))}
                      disabled={isComplete}
                      className="rounded-lg border border-beige px-3 py-1.5 text-sm text-ink transition-colors hover:bg-beige/50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      + Reservar
                    </button>
                    <button
                      onClick={() => updateQuantity(gift, Math.max(reserved - 1, 0))}
                      disabled={reserved === 0}
                      className="rounded-lg border border-beige px-3 py-1.5 text-sm text-ink transition-colors hover:bg-beige/50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      - Remover reserva
                    </button>
                  </div>

                  <div className="mt-auto flex flex-wrap gap-2 pt-2 border-t border-beige/50">
                    <button
                      onClick={() => openEditForm(gift)}
                      className="rounded-lg border border-beige px-3 py-1.5 text-sm text-ink transition-colors hover:bg-beige/50"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(gift.id)}
                      className="rounded-lg border border-orange/40 px-3 py-1.5 text-sm text-orange transition-colors hover:bg-orange/10"
                    >
                      Remover
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <div className="absolute inset-0" onClick={closeForm} />
          <div className="relative z-[10000] w-full max-w-lg rounded-xl border border-beige bg-cream shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between border-b border-beige bg-cream px-6 py-4">
              <h2 className="font-display text-2xl text-ink">
                {editingId ? "Editar presente" : "Cadastrar presente"}
              </h2>
              <button
                onClick={closeForm}
                className="rounded-full p-1 text-ink-soft transition-colors hover:bg-beige/50 hover:text-ink"
                aria-label="Fechar"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
              <div>
                <label className="block text-sm font-semibold text-ink mb-1">
                  Nome do presente *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full rounded-lg border border-beige bg-cream px-3 py-2 text-ink focus:border-ocean focus-visible:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1">
                  Descrição
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border border-beige bg-cream px-3 py-2 text-ink focus:border-ocean focus-visible:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1">
                    Preço (R$)
                  </label>
                  <input
                    value={form.price}
                    onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                    placeholder="Ex: 199.90"
                    inputMode="decimal"
                    className="w-full rounded-lg border border-beige bg-cream px-3 py-2 text-ink focus:border-ocean focus-visible:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1">
                    Quantidade necessária *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.quantity_needed}
                    onChange={(e) => setForm((prev) => ({ ...prev, quantity_needed: e.target.value }))}
                    required
                    className="w-full rounded-lg border border-beige bg-cream px-3 py-2 text-ink focus:border-ocean focus-visible:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1">
                  Quantidade reservada
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.quantity_reserved}
                  onChange={(e) => setForm((prev) => ({ ...prev, quantity_reserved: e.target.value }))}
                  className="w-full rounded-lg border border-beige bg-cream px-3 py-2 text-ink focus:border-ocean focus-visible:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1">
                  Link do produto
                </label>
                <input
                  value={form.link}
                  onChange={(e) => setForm((prev) => ({ ...prev, link: e.target.value }))}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-beige bg-cream px-3 py-2 text-ink focus:border-ocean focus-visible:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-beige px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-beige/50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-ocean px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-ink disabled:opacity-70"
                >
                  {saving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}