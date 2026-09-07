"use client";
import { useEffect, type RefObject } from "react";
import type { ThemeId } from "@/lib/themes";
import { isMenuScrollLocked, scrollUnlockEvent } from "@/lib/modal-scroll-lock";

// Art direction controls the choreography; the content never depends on motion.
const directions = {
  1: {
    duration: 1100,
    lift: 65,
    rotate: 5,
    zoom: 1.22,
    wipe: "inset(0 0 100% 0)",
    travel: 10,
  },
  2: {
    duration: 1150,
    lift: 40,
    rotate: 0,
    zoom: 1.3,
    wipe: "inset(0 100% 0 0)",
    travel: 9,
  },
  3: {
    duration: 1400,
    lift: 62,
    rotate: 5,
    zoom: 1.23,
    wipe: "inset(0 0 100% 0)",
    travel: 9,
  },
  4: {
    duration: 1550,
    lift: 82,
    rotate: 10,
    zoom: 1.34,
    wipe: "inset(48% 0 48% 0)",
    travel: 16,
  },
  5: {
    duration: 1450,
    lift: 45,
    rotate: 0,
    zoom: 1.17,
    wipe: "inset(0 100% 0 0)",
    travel: 8,
  },
} satisfies Record<
  ThemeId,
  {
    duration: number;
    lift: number;
    rotate: number;
    zoom: number;
    wipe: string;
    travel: number;
  }
>;

export function useCinematicMotion(
  root: RefObject<HTMLDivElement | null>,
  enabled: boolean,
  variant: ThemeId,
) {
  useEffect(() => {
    const parent = root.current;
    if (!parent || !enabled) return;
    const art = directions[variant];
    const compact = window.matchMedia("(max-width: 600px)").matches;
    const seen = new WeakSet<Element>();
    const watched = new WeakSet<Element>();
    const moving = new Set<HTMLElement>();
    const animations = new Set<Animation>();
    let frame = 0;
    const pace = compact ? 1.4 : 1;
    const ease = compact
      ? "cubic-bezier(.22,.68,.18,1)"
      : "cubic-bezier(.16,1,.3,1)";

    function animate(
      element: Element | null,
      frames: Keyframe[],
      duration: number,
      delay = 0,
    ) {
      if (!element || isMenuScrollLocked()) return;
      const animation = element.animate(frames, {
        duration: Math.round(duration * pace),
        delay: Math.round(delay * pace),
        easing: ease,
        fill: "both",
      });
      animation.id = "bacanas-cinema";
      animations.add(animation);
      animation.onfinish = () => {
        animations.delete(animation);
        animation.cancel();
      };
      animation.oncancel = () => animations.delete(animation);
    }
    function showCard(card: HTMLElement) {
      const siblings = Array.from(card.parentElement?.children ?? []);
      const index = siblings.indexOf(card);
      const layout = card.parentElement && getComputedStyle(card.parentElement);
      const columns =
        layout?.display === "grid"
          ? layout.gridTemplateColumns.split(" ").length
          : 1;
      const delay = (index % columns) * 130;
      const side = index % 2 ? 1 : -1;
      const turn = variant === 2 ? side * 3 : variant === 5 ? side * 2 : 0;
      const lateral = variant === 2 ? side * 38 : variant === 4 ? side * 22 : 0;
      card.classList.add("cinematic-card");
      animate(
        card,
        [
          {
            opacity: 0,
            transform: `perspective(1300px) translate3d(${lateral}px,${art.lift}px,0) rotateX(${art.rotate}deg) rotateZ(${turn}deg) scale(.94)`,
            transformOrigin: "50% 100%",
          },
          {
            opacity: 1,
            transform:
              "perspective(1300px) translate3d(0,0,0) rotateX(0) rotateZ(0) scale(1)",
            transformOrigin: "50% 100%",
          },
        ],
        art.duration,
        delay,
      );
      animate(
        card.querySelector(".product-photo"),
        [{ clipPath: art.wipe }, { clipPath: "inset(0 0 0 0 round 0px)" }],
        art.duration * 0.9,
        delay + 70,
      );
      animate(
        card.querySelector(".product-photo img"),
        [
          {
            transform: `scale(${art.zoom}) translateY(9px)`,
            filter: `blur(${compact ? 3 : 7}px) saturate(.65)`,
          },
          {
            transform: "scale(1.075) translateY(0)",
            filter: "blur(0) saturate(1)",
          },
        ],
        art.duration + 280,
        delay + 60,
      );
      animate(
        card.querySelector(".product-copy h3"),
        [
          {
            opacity: 0,
            transform: "translateY(24px)",
            clipPath: "inset(0 0 100% 0)",
          },
          {
            opacity: 1,
            transform: "translateY(0)",
            clipPath: "inset(0 0 0 0)",
          },
        ],
        750,
        delay + 280,
      );
      animate(
        card.querySelector(".product-copy p"),
        [
          { opacity: 0, transform: "translateY(15px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        650,
        delay + 380,
      );
      animate(
        card.querySelector(".product-bottom"),
        [
          { opacity: 0, transform: "translateY(17px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        750,
        delay + 440,
      );
    }
    function showHeading(heading: HTMLElement) {
      animate(
        heading,
        [
          {
            opacity: 0,
            transform: "translateY(38px)",
            clipPath: "inset(0 0 100% 0)",
          },
          {
            opacity: 1,
            transform: "translateY(0)",
            clipPath: "inset(0 0 0 0)",
          },
        ],
        1050,
      );
    }
    const reveal = new IntersectionObserver(
      (entries) => {
        if (isMenuScrollLocked()) return;
        for (const entry of entries) {
          if (!entry.isIntersecting || seen.has(entry.target)) continue;
          seen.add(entry.target);
          if (entry.target.classList.contains("product-card"))
            showCard(entry.target as HTMLElement);
          else showHeading(entry.target as HTMLElement);
          reveal.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px 35px 0px", threshold: 0.04 },
    );

    function paint() {
      frame = 0;
      if (isMenuScrollLocked()) return;
      const height = window.innerHeight;
      const changes: { card: HTMLElement; offset: number }[] = [];
      moving.forEach((card) => {
        if (!card.isConnected) {
          moving.delete(card);
          return;
        }
        const box = card.getBoundingClientRect();
        const progress = Math.max(
          -1,
          Math.min(
            1,
            (box.top + box.height / 2 - height / 2) /
              (height / 2 + box.height / 2),
          ),
        );
        changes.push({
          card,
          offset: progress * art.travel * (compact ? 0.65 : 1),
        });
      });
      changes.forEach(({ card, offset }) =>
        card.style.setProperty("--cinema-drift", `${offset.toFixed(2)}px`),
      );
    }
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const proximity = new IntersectionObserver(
      (entries) => {
        if (isMenuScrollLocked()) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) moving.add(entry.target as HTMLElement);
          else moving.delete(entry.target as HTMLElement);
        });
        scroll();
      },
      { rootMargin: "100px 0px" },
    );
    function watch() {
      parent!
        .querySelectorAll<HTMLElement>(
          ".product-card, .menu-section-heading, .section-heading, .catalog-top, .review-inner, [data-cinema-heading]",
        )
        .forEach((element) => {
          if (watched.has(element)) return;
          watched.add(element);
          reveal.observe(element);
          if (element.classList.contains("product-card"))
            proximity.observe(element);
        });
    }
    function resumeScroll() {
      parent!
        .querySelectorAll<HTMLElement>(
          ".product-card, .menu-section-heading, .section-heading, .catalog-top, .review-inner, [data-cinema-heading]",
        )
        .forEach((element) => {
          if (!seen.has(element)) {
            reveal.unobserve(element);
            reveal.observe(element);
          }
        });
      scroll();
    }
    // A keyboard user can move through products immediately, even during a reveal.
    function focus(event: FocusEvent) {
      const card = (event.target as HTMLElement).closest<HTMLElement>(
        ".product-card",
      );
      if (!card) return;
      seen.add(card);
      reveal.unobserve(card);
      card
        .getAnimations({ subtree: true })
        .filter((a) => a.id === "bacanas-cinema")
        .forEach((a) => a.cancel());
    }
    watch();
    const mutation = new MutationObserver(watch);
    mutation.observe(parent, { childList: true, subtree: true });
    parent.addEventListener("focusin", focus);
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll, { passive: true });
    window.addEventListener(scrollUnlockEvent, resumeScroll);
    return () => {
      reveal.disconnect();
      proximity.disconnect();
      mutation.disconnect();
      cancelAnimationFrame(frame);
      animations.forEach((animation) => animation.cancel());
      parent.removeEventListener("focusin", focus);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", scroll);
      window.removeEventListener(scrollUnlockEvent, resumeScroll);
      parent
        .querySelectorAll<HTMLElement>(".cinematic-card")
        .forEach((card) => {
          card.classList.remove("cinematic-card");
          card.style.removeProperty("--cinema-drift");
        });
    };
  }, [root, enabled, variant]);
}
