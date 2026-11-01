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

type GiftStepProps = {
  guestName: string;
  onFinish: (gift: { id: number; name: string } | null) => void;
};

function formatPrice(price: string | number | null) {
  if (price === null || price === undefined || price === "") return null;
  const num = typeof price === "string" ? Number(price) : price;
  if (Number.isNaN(num)) return null;
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function getAvailability(gift: Gift) {
  const needed = Number(gift.quantity_needed) || 0;
  const reserved = Number(gift.quantity_reserved) || 0;
  return {
    remaining: Math.max(needed - reserved, 0),
    isComplete: needed > 0 && reserved >= needed,
    hasLimit: needed > 0,
  };
}

function AvailabilityBadge({
  gift,
  showRemaining = true,
}: {
  gift: Gift;
  showRemaining?: boolean;
}) {
  const { remaining, isComplete, hasLimit } = getAvailability(gift);

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${
        isComplete ? "bg-ink-soft/10 text-ink-soft" : "bg-ocean/10 text-ocean"
      }`}
    >
      {isComplete
        ? "Reservado"
        : showRemaining && hasLimit
          ? `Faltam ${remaining}`
          : "Disponível"}
    </span>
  );
}

export function GiftStep({ guestName, onFinish }: GiftStepProps) {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [reservingId, setReservingId] = useState<number | null>(null);
  const [reserveError, setReserveError] = useState("");
  const [reservedGift, setReservedGift] = useState<Gift | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;

    async function loadGifts() {
      try {
        const res = await fetch("/api/gifts/public");
        const data = await res.json();
        if (!active) return;
        if (data.ok) {
          setGifts(data.data);
          setError("");
        } else {
          setError(data.error || "Erro ao carregar presentes.");
        }
      } catch {
        if (active) setError("Erro ao carregar presentes.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadGifts();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  useEffect(() => {
    if (reservedGift) successRef.current?.focus();
  }, [reservedGift]);

  function reloadGifts() {
    setLoading(true);
    setError("");
    setSelectedGift(null);
    setReloadKey((previous) => previous + 1);
  }

  async function handleReserve(gift: Gift) {
    if (reservingId !== null) return;
    if (!guestName.trim()) {
      setReserveError(
        "Não foi possível identificar seu nome. Volte à etapa anterior e tente novamente."
      );
      return;
    }

    setReservingId(gift.id);
    setReserveError("");

    try {
      const res = await fetch("/api/gifts/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ giftId: gift.id, guestName }),
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
        setSelectedGift(null);
      } else {
        setReserveError(data.error || "Não foi possível reservar o presente.");
        if (res.status === 409) reloadGifts();
      }
    } catch {
      setReserveError(
        "Não foi possível reservar o presente. Tente novamente."
      );
    } finally {
      setReservingId(null);
    }
  }

  if (reservedGift) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="flex flex-col items-center gap-3 rounded-xl border border-ocean/30 bg-ocean/5 px-4 py-8 text-center focus-visible:outline-none lg:my-auto lg:w-full"
      >
        <p className="font-display text-xl text-ink sm:text-2xl">
          Presente reservado!
        </p>
        <p className="text-sm text-ink-soft sm:text-base">
          <strong className="text-ink">{guestName}</strong>, você escolheu{" "}
          <strong className="text-ink">{reservedGift.name}</strong>.
          <br />
          Obrigado pelo carinho com os noivos.
        </p>
        <button
          type="button"
          onClick={() =>
            onFinish({ id: reservedGift.id, name: reservedGift.name })
          }
          className="mt-1 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-ocean px-6 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:w-auto"
        >
          Concluir
        </button>
      </div>
    );
  }

  if (selectedGift) {
    const isReserving = reservingId === selectedGift.id;
    const { isComplete } = getAvailability(selectedGift);

    return (
      <div className="space-y-4 lg:flex lg:h-full lg:min-h-0 lg:w-full lg:flex-col">
        <button
          type="button"
          onClick={() => {
            setSelectedGift(null);
            setReserveError("");
          }}
          className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-ocean hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Voltar para a lista
        </button>

        <div className="space-y-3 rounded-xl border border-beige bg-cream/95 p-4 sm:p-5 lg:shrink-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold break-words text-ink sm:text-xl">
              {selectedGift.name}
            </h3>
            <AvailabilityBadge gift={selectedGift} showRemaining={false} />
          </div>

          {selectedGift.description && (
            <div
              role="region"
              aria-label="Descrição do presente"
              tabIndex={0}
              className="max-h-40 overflow-y-auto overscroll-contain rounded-lg border border-beige/70 bg-cream px-3 py-2 text-sm break-words whitespace-pre-wrap text-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean sm:text-base lg:max-h-32"
            >
              {selectedGift.description}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 text-sm sm:text-base">
            {formatPrice(selectedGift.price) && (
              <span className="font-semibold text-ink">
                {formatPrice(selectedGift.price)}
              </span>
            )}
            {selectedGift.link && (
              <a
                href={selectedGift.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ocean hover:underline"
              >
                Ver produto
              </a>
            )}
          </div>

          <button
            type="button"
            disabled={isComplete || reservingId !== null}
            onClick={() => handleReserve(selectedGift)}
            aria-busy={isReserving}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-ocean px-6 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:cursor-not-allowed disabled:bg-ink-soft disabled:text-cream/70 sm:w-auto"
          >
            {isReserving
              ? "Reservando..."
              : isComplete
                ? "Indisponível"
                : "Reservar este presente"}
          </button>

          {reserveError && (
            <p role="alert" className="text-sm text-orange">
              {reserveError}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:flex lg:h-full lg:min-h-0 lg:w-full lg:flex-col">
      {loading ? (
        <div className="flex min-h-[10rem] items-center justify-center rounded-xl border border-beige bg-cream/95 px-4 py-8 text-sm text-ink-soft lg:flex-1">
          Carregando presentes...
        </div>
      ) : error ? (
        <div className="space-y-3 rounded-xl border border-orange/30 bg-orange/5 px-4 py-6 text-center lg:flex-1">
          <p role="alert" className="text-sm text-orange">
            {error}
          </p>
          <button
            type="button"
            onClick={reloadGifts}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-orange/40 px-4 py-2 text-sm font-medium text-orange transition-colors hover:bg-orange/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            Tentar novamente
          </button>
        </div>
      ) : gifts.length === 0 ? (
        <div className="flex min-h-[10rem] items-center justify-center rounded-xl border border-beige bg-cream/95 px-4 py-8 text-center text-sm text-ink-soft lg:flex-1">
          Nenhum presente cadastrado no momento. Você pode concluir sem escolher.
        </div>
      ) : (
        <ul className="space-y-3 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain lg:pr-1">
          {gifts.map((gift) => (
            <li key={gift.id}>
              <button
                type="button"
                onClick={() => {
                  setSelectedGift(gift);
                  setReserveError("");
                }}
                className="flex h-full w-full flex-col gap-2 rounded-xl border border-beige bg-cream/95 p-4 text-left transition-colors hover:border-ocean/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="text-base font-semibold break-words text-ink">
                    {gift.name}
                  </span>
                  <AvailabilityBadge gift={gift} />
                </span>
                <span className="flex items-center justify-between gap-3 text-sm text-ink-soft">
                  <span>
                    {formatPrice(gift.price) ? (
                      <span className="font-semibold text-ink">
                        {formatPrice(gift.price)}
                      </span>
                    ) : (
                      "Sem valor informado"
                    )}
                  </span>
                  <span className="shrink-0 text-ocean">Ver detalhes</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {reserveError && (
        <p role="alert" className="text-sm text-orange">
          {reserveError}
        </p>
      )}

      <button
        type="button"
        onClick={() => onFinish(null)}
        className="inline-flex min-h-11 w-full shrink-0 items-center justify-center rounded-lg border border-beige px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-beige/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
      >
        Pular e concluir
      </button>
    </div>
  );
}
