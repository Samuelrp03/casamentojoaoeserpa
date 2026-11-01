"use client";

import { useEffect, useRef, useState } from "react";

type Reservation = {
  id: number;
  guest_name: string;
  created_at: string;
};

type Gift = {
  id: number;
  name: string;
  description: string | null;
  price: string | number | null;
  link: string | null;
  quantity_needed: number;
  quantity_reserved: number;
  reservations?: Reservation[];
};

type GiftSelectionModalProps = {
  open: boolean;
  onClose: () => void;
  onSkip: () => void;
  guestName?: string;
  onGiftChosen?: (gift: { id: number; name: string }) => void;
};

function formatPrice(price: string | number | null) {
  if (price === null || price === undefined || price === "") return null;
  const num = typeof price === "string" ? Number(price) : price;
  if (Number.isNaN(num)) return null;
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15.5 14" />
    </svg>
  );
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s-7-6.5-7-12a7 7 0 1 1 14 0c0 5.5-7 12-7 12z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function GiftSelectionModal({ open, onClose, onSkip, guestName = "", onGiftChosen }: GiftSelectionModalProps) {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [reservingId, setReservingId] = useState<number | null>(null);
  const [reserveError, setReserveError] = useState("");
  const [reservedGift, setReservedGift] = useState<Gift | null>(null);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    async function fetchGifts() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/gifts/public");
        const data = await res.json();
        if (data.ok) setGifts(data.data);
        else setError(data.error || "Erro ao carregar presentes.");
      } catch {
        setError("Erro ao carregar presentes.");
      } finally {
        setLoading(false);
      }
    }
    fetchGifts();
  }, [open, reloadKey]);

  useEffect(() => {
    if (reservedGift) successRef.current?.focus();
  }, [reservedGift]);

  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  function resetModalState() {
    setReservingId(null);
    setReserveError("");
    setReservedGift(null);
    setSelectedGift(null);
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
    if (!guestName.trim()) {
      setReserveError("Não foi possível identificar seu nome. Por favor, confirme novamente.");
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
          reservations: gift.reservations
            ? [...gift.reservations, { id: Date.now(), guest_name: guestName, created_at: new Date().toISOString() }]
            : [{ id: Date.now(), guest_name: guestName, created_at: new Date().toISOString() }],
        };
        setGifts((previous) => previous.map((item) => (item.id === gift.id ? updated : item)));
        setReservedGift(updated);
        setSelectedGift(null);
        onGiftChosen?.({ id: gift.id, name: gift.name });
      } else {
        setReserveError(data.error || "Não foi possível reservar o presente.");
        if (res.status === 409) setReloadKey((previous) => previous + 1);
      }
    } catch {
      setReserveError("Não foi possível reservar o presente. Tente novamente.");
    } finally {
      setReservingId(null);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999999]">
      <div className="absolute inset-0 bg-black/90" onClick={handleDismiss} />
      <div className="relative h-[100dvh] w-screen overflow-hidden bg-cream texture-bg flex flex-col">
        <div className="flex items-center justify-between border-b border-beige bg-cream/95 px-4 py-3 sm:px-6 lg:px-10">
          <div>
            <h2 className="font-display text-xl sm:text-2xl lg:text-3xl text-ink">Lista de Presentes</h2>
            <p className="text-xs sm:text-sm text-ink-soft mt-1">Escolha um presente para os noivos (opcional)</p>
          </div>
          <button type="button" onClick={handleDismiss} className="rounded-full p-1 text-ink-soft transition-colors hover:bg-beige/50 hover:text-ink" aria-label="Fechar">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
          <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[minmax(280px,420px)_1fr]">
            <aside className="relative border-b border-beige lg:border-b-0 lg:border-r bg-cream/80 px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
              <div className="mx-auto flex h-full max-w-md flex-col">
                <h1 className="font-script text-2xl text-orange sm:text-3xl lg:text-4xl">Faça parte da nossa história</h1>
                <ul className="mt-6 space-y-4 sm:space-y-5">
                  <li className="flex items-start gap-3">
                    <CalendarIcon className="mt-0.5 shrink-0 text-ocean" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">Data</p>
                      <p className="mt-0.5 text-base font-semibold text-ink sm:text-lg">30 de janeiro de 2027</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <ClockIcon className="mt-0.5 shrink-0 text-ocean" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">Horário</p>
                      <p className="mt-0.5 text-base font-semibold text-ink sm:text-lg">10 horas da manhã</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <LocationIcon className="mt-0.5 shrink-0 text-ocean" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">Local</p>
                      <p className="mt-0.5 text-base font-semibold text-ink sm:text-lg">Restaurante Bacanas</p>
                    </div>
                  </li>
                </ul>
                <div className="mt-6 flex-1 min-h-[200px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d122318.71103206387!2d-49.314161714529696!3d-16.653863122104156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935ef152546b521d%3A0x9bb6004b478f43ba!2sBacanas!5e0!3m2!1spt-BR!2sbr!4v1793504938697!5m2!1spt-BR!2sbr"
                    width="600"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    title="Mapa do local do casamento - Restaurante Bacanas"
                    className="h-full w-full min-h-[200px] rounded-lg"
                  />
                </div>
              </div>
            </aside>

            <main className="flex flex-col min-h-0">
              <div className="flex-1 min-h-0 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
                {reservedGift ? (
                  <div ref={successRef} tabIndex={-1} role="status" aria-live="polite" className="mx-auto flex h-full min-h-[400px] max-w-2xl flex-col items-center justify-center gap-3 text-center focus-visible:outline-none">
                    <p className="font-display text-2xl sm:text-3xl text-ink">Presente reservado!</p>
                    <p className="text-ink-soft">
                      {guestName ? (<><strong className="text-ink">{guestName}</strong>, você escolheu <strong className="text-ink">{reservedGift.name}</strong>.</>) : (<>Você escolheu <strong className="text-ink">{reservedGift.name}</strong>.</>)}
                      Obrigado pelo carinho com os noivos.
                    </p>
                    {reservedGift.link && (<a href={reservedGift.link} target="_blank" rel="noopener noreferrer" className="text-sm text-ocean hover:underline">Ver produto</a>)}
                  </div>
                ) : selectedGift ? (
                  <div className="mx-auto w-full max-w-4xl space-y-4">
                    <button type="button" onClick={() => setSelectedGift(null)} className="flex items-center gap-2 text-sm text-ocean hover:underline">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                      Voltar para lista
                    </button>
                    <div className="rounded-xl border border-beige bg-cream/95 p-5 sm:p-6 lg:p-8 space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-xl sm:text-2xl font-semibold text-ink break-words">{selectedGift.name}</h3>
                        {(() => {
                          const needed = Number(selectedGift.quantity_needed) || 0;
                          const reserved = Number(selectedGift.quantity_reserved) || 0;
                          const isComplete = needed > 0 && reserved >= needed;
                          return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${isComplete ? "bg-ink-soft/10 text-ink-soft" : "bg-ocean/10 text-ocean"}`}>{isComplete ? "Reservado" : "Disponível"}</span>;
                        })()}
                      </div>
                      {selectedGift.description && <p className="text-sm sm:text-base text-ink-soft whitespace-pre-wrap break-words">{selectedGift.description}</p>}
                      <div className="flex flex-wrap items-center gap-3 text-sm sm:text-base">
                        {formatPrice(selectedGift.price) && <span className="font-semibold text-ink">{formatPrice(selectedGift.price)}</span>}
                        {selectedGift.link && <a href={selectedGift.link} target="_blank" rel="noopener noreferrer" className="text-ocean hover:underline">Ver produto</a>}
                      </div>
                      <button
                        type="button"
                        disabled={(() => {
                          const needed = Number(selectedGift.quantity_needed) || 0;
                          const reserved = Number(selectedGift.quantity_reserved) || 0;
                          return (needed > 0 && reserved >= needed) || reservingId !== null;
                        })()}
                        onClick={() => handleReserve(selectedGift)}
                        aria-busy={reservingId === selectedGift.id}
                        className="w-full sm:w-auto rounded-lg bg-ocean px-6 py-2.5 text-sm sm:text-base font-semibold text-cream transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:bg-ink-soft disabled:text-cream/70"
                      >
                        {reservingId === selectedGift.id ? "Reservando..." : (() => { const needed = Number(selectedGift.quantity_needed) || 0; const reserved = Number(selectedGift.quantity_reserved) || 0; return needed > 0 && reserved >= needed ? "Indisponível" : "Reservar este presente"; })()}
                      </button>
                      {reserveError ? <p role="alert" className="text-sm text-orange">{reserveError}</p> : null}
                    </div>
                  </div>
                ) : loading ? (
                  <div className="flex h-full min-h-[400px] items-center justify-center text-ink-soft">Carregando presentes...</div>
                ) : error ? (
                  <div className="flex h-full min-h-[400px] items-center justify-center text-orange">{error}</div>
                ) : gifts.length === 0 ? (
                  <div className="flex h-full min-h-[400px] items-center justify-center text-ink-soft">Nenhum presente cadastrado no momento.</div>
                ) : (
                  <>
                    <div className="mx-auto w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                      {gifts.map((gift) => {
                        const needed = Number(gift.quantity_needed) || 0;
                        const reserved = Number(gift.quantity_reserved) || 0;
                        const remaining = Math.max(needed - reserved, 0);
                        const isComplete = needed > 0 && reserved >= needed;
                        const isReserving = reservingId === gift.id;
                        return (
                          <button
                            type="button"
                            key={gift.id}
                            onClick={() => { setSelectedGift(gift); setReserveError(""); }}
                            disabled={isReserving}
                            className="text-left rounded-xl border border-beige bg-cream/95 p-4 flex flex-col gap-3 transition-colors hover:border-ocean/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean h-full"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="text-lg font-semibold text-ink break-words">{gift.name}</h3>
                              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${isComplete ? "bg-ink-soft/10 text-ink-soft" : "bg-ocean/10 text-ocean"}`}>{isComplete ? "Reservado" : `Faltam ${remaining}`}</span>
                            </div>
                            {gift.description && <p className="text-sm text-ink-soft whitespace-pre-wrap break-words line-clamp-3">{gift.description}</p>}
                            <div className="mt-auto flex flex-wrap items-center gap-3 text-sm">{formatPrice(gift.price) && <span className="font-semibold text-ink">{formatPrice(gift.price)}</span>}</div>
                          </button>
                        );
                      })}
                    </div>
                    {reserveError ? <p role="alert" className="mt-4 text-center text-sm text-orange">{reserveError}</p> : null}
                  </>
                )}
              </div>
              <div className="border-t border-beige bg-cream/95 px-4 py-3 sm:px-6 lg:px-8 xl:px-10 flex justify-center">
                <button type="button" onClick={reservedGift ? handleClose : selectedGift ? () => setSelectedGift(null) : handleDismiss} disabled={reservingId !== null} className="rounded-lg border border-beige px-6 py-2 text-sm font-medium text-ink transition-colors hover:bg-beige/50 disabled:cursor-not-allowed disabled:opacity-70">
                  {reservedGift ? "Concluir" : selectedGift ? "Voltar" : "Pular e finalizar"}
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
