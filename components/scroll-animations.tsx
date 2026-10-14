"use client";

import { useEffect } from "react";
import { animate } from "animejs";

export function ScrollAnimations() {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const observers: IntersectionObserver[] = [];

    function reveal(
      selector: string,
      options: {
        x?: [number, number];
        y?: [number, number];
        stagger?: number;
      } = {},
    ) {
      const elements = Array.from(
        document.querySelectorAll<HTMLElement>(selector),
      );

      elements.forEach((element, index) => {
        element.style.opacity = "0";
        if (options.x) {
          element.style.transform = `translateX(${options.x[0]}px)`;
        } else if (options.y) {
          element.style.transform = `translateY(${options.y[0]}px)`;
        }

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                observer.unobserve(element);
                animate(element, {
                  opacity: [0, 1],
                  translateX: options.x ?? [0, 0],
                  translateY: options.y ?? [0, 0],
                  duration: 850,
                  delay: (options.stagger ?? 0) * index,
                  easing: "easeOutCubic",
                });
              }
            });
          },
          { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
        );

        observer.observe(element);
        observers.push(observer);
      });
    }

    // Couple section
    reveal('[data-anim="couple-title"]', {
      x: [0, 0],
      y: isDesktop ? [0, 0] : [40, 0],
    });
    reveal('[data-anim="couple-left"]', {
      x: isDesktop ? [-70, 0] : [0, 0],
      y: isDesktop ? [0, 0] : [40, 0],
    });
    reveal('[data-anim="couple-right"]', {
      x: isDesktop ? [70, 0] : [0, 0],
      y: isDesktop ? [0, 0] : [40, 0],
    });
    reveal('[data-anim="couple-image"]', {
      x: [0, 0],
      y: [50, 0],
    });

    // Wedding info section
    reveal('[data-anim="info-title"]', {
      x: isDesktop ? [-60, 0] : [0, 0],
      y: isDesktop ? [0, 0] : [40, 0],
    });
    reveal('[data-anim="info-item"]', {
      x: isDesktop ? [-50, 0] : [0, 0],
      y: isDesktop ? [0, 0] : [35, 0],
      stagger: 130,
    });

    // RSVP card and fields
    reveal('[data-anim="rsvp-card"]', {
      x: [0, 0],
      y: [60, 0],
    });
    reveal('[data-anim="rsvp-field"]', {
      x: [0, 0],
      y: isDesktop ? [0, 0] : [30, 0],
      stagger: 110,
    });

    // Keep the couple illustration fixed at the bottom once it appears.
    const coupleImage = document.querySelector<HTMLElement>(
      '[data-anim="couple-image"]',
    );

    if (coupleImage) {
      const fixImage = () => {
        const rect = coupleImage.getBoundingClientRect();
        coupleImage.style.position = "fixed";
        coupleImage.style.bottom = "0px";
        coupleImage.style.left = "50%";
        coupleImage.style.transform = "translateX(-50%)";
        coupleImage.style.width = `${rect.width}px`;
        coupleImage.style.zIndex = "0";
        coupleImage.style.pointerEvents = "none";
      };

      const fixedObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              fixImage();
              fixedObserver.disconnect();
            }
          });
        },
        { threshold: 0.35 },
      );

      fixedObserver.observe(coupleImage);
      observers.push(fixedObserver);
    }

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return null;
}