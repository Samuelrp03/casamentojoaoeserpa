import Image from "next/image";
import { RsvpForm } from "@/components/rsvp-form";

const noteImageDesktop = "/Assets/Images/Note Image.svg";
const noteImageMobile = "/Assets/Images/Note Mobile.svg";

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
        <div className="relative">
          <figure className="relative mx-auto w-full" data-anim="info-note">
          <Image
            src={noteImageMobile}
            alt="Desenho de uma nota artesanal com borda laranja"
            width={540}
            height={637}
            sizes="(max-width: 1023px) 98vw, 0px"
            className="block h-auto w-full lg:hidden"
            priority={false}
          />
          <Image
            src={noteImageDesktop}
            alt="Desenho de uma nota artesanal com borda laranja"
            width={893}
            height={556}
            sizes="(min-width: 1024px) (max-width: 1440px) 96vw, 1600px"
            className="hidden h-auto w-full lg:block"
            priority={false}
          />
          <figcaption className="sr-only">Informações do casamento</figcaption>
          <div className="absolute inset-0 flex flex-col lg:flex-row"> 
            <div className="flex flex-col items-start justify-start pl-16 pr-4 py-6 sm:pl-24 sm:pr-6 sm:py-8 md:pl-24 md:pr-8 md:py-10 lg:py-16 lg:pb-20 lg:px-14 xl:px-20 2xl:px-24 lg:w-1/2">
              <h1 className="font-script text-2xl text-ink mb-4 text-start text-orange sm:text-3xl md:text-4xl lg:mb-8">
                Faça parte da nossa história
              </h1>
              <ul className="space-y-3 sm:space-y-4 lg:space-y-6">
                <li data-anim="info-item" className="flex items-start gap-2 sm:gap-3">
                  <CalendarIcon className="mt-0.5 shrink-0 text-ocean sm:mt-1" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft sm:text-sm lg:text-base">
                      Data
                    </p>
                    <p className="mt-0.5 text-base font-semibold text-ink sm:text-lg lg:text-2xl xl:text-3xl">
                      6 de fevereiro de 2027
                    </p>
                  </div>
                </li>

                <li data-anim="info-item" className="flex items-start gap-2 sm:gap-3">
                  <ClockIcon className="mt-0.5 shrink-0 text-ocean sm:mt-1" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft sm:text-sm lg:text-base">
                      Horário
                    </p>
                    <p className="mt-0.5 text-base font-semibold text-ink sm:text-lg lg:text-2xl xl:text-3xl">
                      A confirmar
                    </p>
                  </div>
                </li>

                <li data-anim="info-item" className="flex items-start gap-2 sm:gap-3">
                  <LocationIcon className="mt-0.5 shrink-0 text-ocean sm:mt-1" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft sm:text-sm lg:text-base">
                      Local
                    </p>
                    <p className="mt-0.5 text-base font-semibold text-ink sm:text-lg lg:text-2xl xl:text-3xl">
                      A ser informado
                    </p>
                  </div>
                </li>
              </ul>
              <div data-anim="info-map" className="mt-4 w-full h-full flex-1 rounded-lg bg-orange/90 p-3 text-sm text-cream sm:mt-6 sm:p-4 sm:text-base lg:mt-8 lg:max-w-xl xl:max-w-2xl lg:p-6">
                <p>Mapa aqui</p>
              </div>
            </div>
          </div>
        </figure>
        <div className="mx-auto mt-6 w-full max-w-2xl px-4 sm:px-6 lg:mt-0 lg:absolute lg:inset-y-0 lg:right-0 lg:flex lg:w-1/2 lg:max-w-none lg:items-center lg:justify-center lg:px-14 lg:py-16 xl:px-20 2xl:px-24">
          <div className="w-full rounded-xl border border-beige bg-cream/95 shadow-sm backdrop-blur-sm lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none">
            <RsvpForm />
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}