"use client";

import { useEffect } from "react";
import { animate } from "animejs";

type RevealOptions = {
  x?: [number, number];
  y?: [number, number];
  scale?: [number, number];
  stagger?: number;
};

type RevealAnimation = RevealOptions & {
  selector: string;
};

export function ScrollAnimations() {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const observers: IntersectionObserver[] = [];

    function reveal({ selector, ...options }: RevealAnimation) {
      const elements = Array.from(
        document.querySelectorAll<HTMLElement>(selector),
      );

      elements.forEach((element, index) => {
        const startX = options.x?.[0] ?? 0;
        const startY = options.y?.[0] ?? 0;
        const startScale = options.scale?.[0] ?? 1;
        const staggerDelay = (options.stagger ?? 0) * index;

        const hide = () => {
          element.style.opacity = "0";
          element.style.transform = `translate(${startX}px, ${startY}px) scale(${startScale})`;
        };

        hide();

        let current: ReturnType<typeof animate> | null = null;
        let visible = false;

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              current?.pause();

              if (entry.isIntersecting) {
                // Já está visível (ex.: corte parcial seguido de
                // retorno), então não reinicia a animação.
                if (visible) return;

                visible = true;
                current = animate(element, {
                  opacity: [0, 1],
                  translateX: options.x ?? [0, 0],
                  translateY: options.y ?? [0, 0],
                  scale: options.scale ?? [1, 1],
                  duration: 800,
                  delay: staggerDelay,
                  easing: "easeOutCubic",
                });
                return;
              }

              if (!visible) return;

              const { top, bottom } = entry.boundingClientRect;
              const leavingThroughBottom = top > 0 && top < window.innerHeight;
              const leftAboveViewport = bottom <= 0;

              if (leavingThroughBottom) {
                // Saiu pela parte de baixo da tela: anima a saída
                // como o espelho da entrada (a opacidade vai a zero
                // e o elemento volta ao deslocamento inicial).
                visible = false;
                current = animate(element, {
                  opacity: [1, 0],
                  translateX: [0, startX],
                  translateY: [0, startY],
                  scale: [1, startScale],
                  duration: 800,
                  delay: staggerDelay,
                  easing: "easeInCubic",
                  onComplete: hide,
                });
              } else if (leftAboveViewport) {
                // Saiu por cima da tela: como já está fora de vista,
                // volta ao estado inicial sem animação.
                visible = false;
                hide();
              }
              // Caso contrário, ainda está parcialmente visível:
              // mantém tudo como está.
            });
          },
          { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
        );

        observer.observe(element);
        observers.push(observer);
      });
    }

    const animations: RevealAnimation[] = [
      // Seção do casal
      {
        selector: '[data-anim="couple-title"]',
        y: isDesktop ? [0, 0] : [20, 0],
      },
      {
        selector: '[data-anim="couple-left"]',
        x: isDesktop ? [-70, 0] : [0, 0],
        y: isDesktop ? [0, 0] : [20, 0],
      },
      {
        selector: '[data-anim="couple-right"]',
        x: isDesktop ? [70, 0] : [0, 0],
        y: isDesktop ? [0, 0] : [20, 0],
      },

      // Seção de informações do casamento
      {
        selector: '[data-anim="info-title"]',
        x: isDesktop ? [-60, 0] : [0, 0],
        y: isDesktop ? [0, 0] : [20, 0],
      },
      {
        selector: '[data-anim="info-item"]',
        x: isDesktop ? [-50, 0] : [0, 0],
        y: isDesktop ? [0, 0] : [20, 0],
        stagger: isDesktop ? 130 : 80,
      },
      {
        selector: '[data-anim="info-note"]',
        y: isDesktop ? [0, 0] : [20, 0],
        scale: isDesktop ? [1, 1] : [0.98, 1],
      },
      {
        selector: '[data-anim="info-map"]',
        y: isDesktop ? [0, 0] : [16, 0],
        stagger: isDesktop ? 0 : 60,
      },

      // Cartão e campos do RSVP
      {
        selector: '[data-anim="rsvp-card"]',
        y: isDesktop ? [60, 0] : [24, 0],
      },
      {
        selector: '[data-anim="rsvp-field"]',
        y: isDesktop ? [0, 0] : [16, 0],
        stagger: isDesktop ? 110 : 80,
      },
    ];

    animations.forEach(reveal);

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return null;
}
