import { RsvpForm } from "@/components/rsvp-form";

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15.5 14" />
    </svg>
  );
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s-7-6.5-7-12a7 7 0 1 1 14 0c0 5.5-7 12-7 12z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function WeddingInfoSection() {
  return (
    <section
      id="casamento"
      className="texture-bg relative overflow-hidden bg-cream/90 py-12 sm:py-16 lg:py-20"
      aria-labelledby="casamento-titulo"
    >

      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
        <h2
          id="casamento-titulo"
          data-anim="info-title"
          className="font-script text-2xl text-orange sm:text-4xl"
        >
          Comemore conosco essa data tão especial
        </h2>

        <div className="mt-12 grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div className="space-y-8">
            <ul className="space-y-6">
              <li data-anim="info-item" className="flex items-start gap-4">
                <CalendarIcon className="mt-1 shrink-0 text-ocean" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
                    Data
                  </p>
                  <p className="mt-1 text-xl font-semibold text-ink">
                    6 de fevereiro de 2027
                  </p>
                </div>
              </li>

              <li data-anim="info-item" className="flex items-start gap-4">
                <ClockIcon className="mt-1 shrink-0 text-ocean" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
                    Horário
                  </p>
                  <p className="mt-1 text-xl font-semibold text-ink">
                    A confirmar
                  </p>
                </div>
              </li>

              <li data-anim="info-item" className="flex items-start gap-4">
                <LocationIcon className="mt-1 shrink-0 text-ocean" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
                    Local
                  </p>
                  <p className="mt-1 text-xl font-semibold text-ink">
                    A ser informado
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <RsvpForm />
        </div>
      </div>
    </section>
  );
}