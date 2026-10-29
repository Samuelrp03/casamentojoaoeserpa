"use client";

import { useEffect, useState } from "react";

type Gift = {
  id: number;
  name: string;
  description: string | null;
  price: string | number | null;
  link: string | null;
  quantity_needed: number;
  quantity_reserved: number;
};

type GiftSelectionModalProps = {
  open: boolean;
  onClose: () => void;
  onSkip: () => void;
};

function formatPrice(price: string | number | null) {
  if (price === null || price === undefined || price === "") return null;
  const num = typeof price === "string" ? Number(price) : price;
  if (Number.isNaN(num)) return null;
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function GiftSelectionModal({ open, onClose, onSkip }: GiftSelectionModalProps) {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    async function fetchGifts() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/gifts/public");
        const data = await res.json();
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
    }

    fetchGifts();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80" onClick={onSkip} />
      <div className="relative z-[100000] w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl border border-beige bg-cream shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-beige bg-cream px-6 py-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl text-ink">
              Lista de Presentes
            </h2>
            <p className="text-sm text-ink-soft mt-1">
              Escolha um presente para os noivos (opcional)
            </p>
          </div>
          <button
            onClick={onSkip}
            className="rounded-full p-1 text-ink-soft transition-colors hover:bg-beige/50 hover:text-ink"
            aria-label="Fechar"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5">
          {loading ? (
            <div className="text-center py-12 text-ink-soft">Carregando presentes...</div>
          ) : error ? (
            <div className="text-center py-12 text-orange">{error}</div>
          ) : gifts.length === 0 ? (
            <div className="text-center py-12 text-ink-soft">
              Nenhum presente cadastrado no momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gifts.map((gift) => {
                const needed = Number(gift.quantity_needed) || 0;
                const reserved = Number(gift.quantity_reserved) || 0;
                const remaining = Math.max(needed - reserved, 0);
                const isComplete = needed > 0 && reserved >= needed;

                return (
                  <article
                    key={gift.id}
                    className={`rounded-xl border border-beige bg-cream/95 p-4 flex flex-col gap-3 ${
                      isComplete ? "opacity-70" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold text-ink break-words">{gift.name}</h3>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${
                          isComplete ? "bg-ink-soft/10 text-ink-soft" : "bg-ocean/10 text-ocean"
                        }`}
                      >
                        {isComplete ? "Completo" : `Faltam ${remaining}`}
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

                    <div className="mt-auto pt-2">
                      <button
                        disabled={isComplete}
                        onClick={onClose}
                        className="w-full rounded-lg bg-ocean px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:bg-ink-soft disabled:text-cream/70"
                      >
                        {isComplete ? "Indisponível" : "Escolher este presente"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 border-t border-beige bg-cream px-6 py-4 flex justify-center">
          <button
            onClick={onSkip}
            className="rounded-lg border border-beige px-6 py-2 text-sm font-medium text-ink transition-colors hover:bg-beige/50"
          >
            Pular e finalizar
          </button>
        </div>
      </div>
    </div>
  );
}