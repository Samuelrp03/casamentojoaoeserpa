import Image from "next/image";
import { RsvpForm } from "@/components/rsvp-form";

const noteImage = "/Assets/Images/Note Image.svg";

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
      className="texture-bg relative overflow-hidden bg-cream/90 pb-12 sm:pb-16 lg:pb-20"
      aria-labelledby="casamento-titulo"
    >

      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 xl:px-10">
        <figure className="relative mx-auto w-full" data-anim="info-note">
          <Image
            src={noteImage}
            alt="Desenho de uma nota artesanal com borda laranja"
            width={893}
            height={556}
            sizes="(max-width: 768px) 98vw, (max-width: 1024px) 98vw, (max-width: 1440px) 96vw, 1600px"
            className="h-auto w-full"
            priority={false}
          />
          <figcaption className="sr-only">Informações do casamento</figcaption>
          <div className="absolute inset-0 flex flex-col lg:flex-row">
            <div className="flex-col flex items-start justify-start py-14 pb-24 px-3 sm:px-8 lg:px-14 xl:px-20 2xl:px-24">
              <h1 className="font-script text-4xl text-ink mb-8 text-start text-orange">
                Faça parte da nossa história
              </h1>
              <ul className="space-y-3 sm:space-y-5 lg:space-y-6">
                <li data-anim="info-item" className="flex items-start gap-3">
                  <CalendarIcon className="mt-1 shrink-0 text-ocean" />
                  <div>
                    <p className="text-xl font-semibold uppercase tracking-[0.18em] text-ink-soft">
                      Data
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-ink">
                      6 de fevereiro de 2027
                    </p>
                  </div>
                </li>

                <li data-anim="info-item" className="flex items-start gap-3">
                  <ClockIcon className="mt-1 shrink-0 text-ocean" />
                  <div>
                    <p className="text-xl font-semibold uppercase tracking-[0.18em] text-ink-soft">
                      Horário
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-ink">
                      A confirmar
                    </p>
                  </div>
                </li>

                <li data-anim="info-item" className="flex items-start gap-3">
                  <LocationIcon className="mt-1 shrink-0 text-ocean" />
                  <div>
                    <p className="text-xl font-semibold uppercase tracking-[0.18em] text-ink-soft">
                      Local
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-ink">
                      A ser informado
                    </p>
                  </div>
                </li>
              </ul>
              <div data-anim="info-map" className="mt-8 w-full h-full lg:max-w-[98%] xl:max-w-full bg-orange rounded-lg p-4 sm:p-6 lg:p-8">
                <p>Mapa aqui</p>
              </div>
            </div>
            <div className="flex-1 flex items-start justify-center pr-12 py-12">
              <div className="w-full max-w-[96%] lg:max-w-[98%] xl:max-w-full">
                <RsvpForm />
              </div>
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}