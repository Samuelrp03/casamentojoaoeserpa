"use client";

import { useEffect, useRef, useState } from "react";

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
  const [reloadKey, setReloadKey] = useState(0);
  const [reservingId, setReservingId] = useState<number | null>(null);
  const [reserveError, setReserveError] = useState("");
  const [reservedGift, setReservedGift] = useState<Gift | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

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
  }, [open, reloadKey]);

  useEffect(() => {
    if (reservedGift) {
      successRef.current?.focus();
    }
  }, [reservedGift]);

  function resetModalState() {
    setReservingId(null);
    setReserveError("");
    setReservedGift(null);
  }

  function handleDismiss() {
    resetModalState();
    onSkip();
  }

  function handleClose() {
    resetModalState();
    onClose();
  }

  async function handleReserve(gift: Gift) {
    if (reservingId !== null) return;

    setReservingId(gift.id);
    setReserveError("");

    try {
      const res = await fetch("/api/gifts/reserve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ giftId: gift.id }),
      });
      const data = await res.json();

      if (data.ok) {
        const updated: Gift = {
          ...gift,
          quantity_needed: Number(data.data.quantity_needed),
          quantity_reserved: Number(data.data.quantity_reserved),
        };
        setGifts((previous) =>
          previous.map((item) => (item.id === gift.id ? updated : item))
        );
        setReservedGift(updated);
      } else {
        setReserveError(data.error || "Não foi possível reservar o presente.");
        if (res.status === 409) {
          setReloadKey((previous) => previous + 1);
        }
      }
    } catch {
      setReserveError("Não foi possível reservar o presente. Tente novamente.");
    } finally {
      setReservingId(null);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80" onClick={handleDismiss} />
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
            type="button"
            onClick={handleDismiss}
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
          {reservedGift ? (
            <div
              ref={successRef}
              tabIndex={-1}
              role="status"
              aria-live="polite"
              className="flex flex-col items-center gap-3 py-10 text-center focus-visible:outline-none"
            >
              <p className="font-display text-2xl text-ink">Presente reservado!</p>
              <p className="text-ink-soft">
                Você escolheu <strong className="text-ink">{reservedGift.name}</strong>.
                Obrigado pelo carinho com os noivos.
              </p>
              {reservedGift.link && (
                <a
                  href={reservedGift.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ocean hover:underline"
                >
                  Ver produto
                </a>
              )}
            </div>
          ) : loading ? (
            <div className="text-center py-12 text-ink-soft">Carregando presentes...</div>
          ) : error ? (
            <div className="text-center py-12 text-orange">{error}</div>
          ) : gifts.length === 0 ? (
            <div className="text-center py-12 text-ink-soft">
              Nenhum presente cadastrado no momento.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gifts.map((gift) => {
                  const needed = Number(gift.quantity_needed) || 0;
                  const reserved = Number(gift.quantity_reserved) || 0;
                  const remaining = Math.max(needed - reserved, 0);
                  const isComplete = needed > 0 && reserved >= needed;
                  const isReserving = reservingId === gift.id;

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
                          type="button"
                          disabled={isComplete || reservingId !== null}
                          onClick={() => handleReserve(gift)}
                          aria-busy={isReserving}
                          className="w-full rounded-lg bg-ocean px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:bg-ink-soft disabled:text-cream/70"
                        >
                          {isReserving
                            ? "Reservando..."
                            : isComplete
                            ? "Indisponível"
                            : "Escolher este presente"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
              {reserveError ? (
                <p role="alert" className="mt-4 text-center text-sm text-orange">
                  {reserveError}
                </p>
              ) : null}
            </>
          )}
        </div>

        <div className="sticky bottom-0 border-t border-beige bg-cream px-6 py-4 flex justify-center">
          <button
            type="button"
            onClick={reservedGift ? handleClose : handleDismiss}
            disabled={reservingId !== null}
            className="rounded-lg border border-beige px-6 py-2 text-sm font-medium text-ink transition-colors hover:bg-beige/50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {reservedGift ? "Concluir" : "Pular e finalizar"}
          </button>
        </div>
      </div>
    </div>
  );
}