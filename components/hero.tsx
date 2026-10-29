import Image from "next/image";
import Link from "next/link";

const heroImage = "/Assets/Images/Hero.png";
const arrowDown = "/Assets/Icons/Arrow%20down.svg";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100svh] w-full items-end overflow-hidden bg-ink"
      aria-label="Convite principal de João e Serpa"
    >
      <h1 className="sr-only">
        Casamento de João Henrick Camargos e Vitoria Serpa Fernandes
      </h1>
      <Image
        src={heroImage}
        alt="Fotografia de João e Serpa"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover object-top"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-cream to-cream/0"
      />
      <Link
        href="#apresentacao"
        aria-label="Rolar para o conteúdo da página"
        className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-full p-3 text-cream transition-transform hover:translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream"
      >
        <Image
          src={arrowDown}
          alt=""
          width={37}
          height={22}
          aria-hidden="true"
          className="h-5 w-auto animate-bounce sm:h-6"
        />
      </Link>
    </section>
  );
}