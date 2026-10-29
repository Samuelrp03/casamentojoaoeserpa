import Image from "next/image";

const coupleImage = "/Assets/Images/Entrega%20Serpa%20Fam%C3%ADlia%20Fundo%20Transparente.png";

export function CoupleSection() {
  return (
    <section
      id="apresentacao"
      className="texture-bg relative overflow-hidden bg-cream"
      aria-labelledby="apresentacao-titulo"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 h-40 bg-gradient-to-t from-cream/0 to-cream"
      />
      
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12 -mt-16 sm:-mt-20">
        <h2
          id="apresentacao-titulo"
          data-anim="couple-title"
          className="text-center font-display text-[clamp(2.25rem,6vw,4rem)] text-ink"
        >
          Quem são os noivos?
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-y-10 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-8">
          <article data-anim="couple-left" className="relative z-10 text-left lg:text-left">
            <h3 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] text-orange">
              João Henrick Camargos
            </h3>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink sm:text-xl">
              Jornalista, cinéfilo e amante de jogos. João certamente é uma pessoa que vale a pena investir bons minutos em uma conversa, seja sobre filmes, videogame ou filosofia. Um grande comunicador e uma pessoa que consegue alegrar o clima de qualquer ambiente em instantes. <br /> <span className="font-bold">Um grande comunicador e um amigo melhor ainda.</span>
            </p>
          </article>

          <article data-anim="couple-right" className="relative z-10 text-left lg:text-right">
            <h3 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] text-ocean">
              Vitoria Serpa Fernandes
            </h3>
            <p className="mt-5 ml-auto max-w-xl text-base leading-relaxed text-ink sm:text-xl">
              Escritora, artista e amante dos animais. Vitória é aquela amiga com quem você pode contar em toda e qualquer situação, sempre firme nos próprios valores e disposta a ouvir os mais sinceros desabafos e dar os mais calorosos (ou dolorosos) conselhos.<br /> <span className="font-bold">Alguém que definitivamente vale a pena ter por perto.</span> 
            </p>
          </article>

          <div
            data-anim="couple-image"
            className="relative order-first mx-auto aspect-[4/3] w-full max-w-2xl sticky bottom-0 lg:order-none lg:col-span-2"
          >
            <Image
              src={coupleImage}
              alt="Ilustração dos noivos e dos pets da família"
              width={640}
              height={480}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}