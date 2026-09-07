const lockAttribute = "data-menu-scroll-locked";
export const scrollUnlockEvent = "menu-scroll-unlocked";

export function isMenuScrollLocked() {
  return document.documentElement.hasAttribute(lockAttribute);
}

function preserveProperties(style: CSSStyleDeclaration, properties: string[]) {
  const saved = properties.map((property) => ({
    property,
    value: style.getPropertyValue(property),
    priority: style.getPropertyPriority(property),
  }));
  return () =>
    saved.forEach(({ property, value, priority }) => {
      if (value) style.setProperty(property, value, priority);
      else style.removeProperty(property);
    });
}

// A fixed body also locks touch scrolling on iOS. Preserve its original width
// so removing the scrollbar cannot reflow the catalogue behind the dialog.
export function lockMenuScroll() {
  const root = document.documentElement;
  const body = document.body;
  const { scrollX: x, scrollY: y } = window;
  const width = root.clientWidth;
  const restoreBody = preserveProperties(body.style, [
    "position",
    "top",
    "left",
    "width",
    "overflow",
  ]);
  const restoreOverflow = preserveProperties(root.style, [
    "overflow",
    "overscroll-behavior",
  ]);
  const restoreBehavior = preserveProperties(root.style, ["scroll-behavior"]);
  const sticky = Array.from(
    body.querySelectorAll<HTMLElement>(
      ".site-header, .category-bar, .editorial-index",
    ),
  )
    .filter(
      (element) =>
        getComputedStyle(element).position === "sticky" &&
        element.getClientRects().length > 0,
    )
    .map((element) => ({
      element,
      top: element.getBoundingClientRect().top,
      restore: preserveProperties(element.style, ["translate"]),
    }));
  const running = body
    .getAnimations({ subtree: true })
    .filter(
      (animation) =>
        animation.id === "bacanas-cinema" && animation.playState === "running",
    );
  root.setAttribute(lockAttribute, "");
  running.forEach((animation) => animation.pause());
  root.style.scrollBehavior = "auto";
  window.scrollTo({ left: x, top: y, behavior: "instant" });
  body.style.position = "fixed";
  body.style.top = `${-y}px`;
  body.style.left = `${-x}px`;
  body.style.width = `${width}px`;
  body.style.overflow = "hidden";
  root.style.overflow = "hidden";
  root.style.overscrollBehavior = "none";
  // Fixed-body locking resets the scrollport used by sticky elements. Offset
  // their painted position without changing the space they occupy in the page.
  const offsets = sticky.map((item) => ({
    ...item,
    offset: item.top - item.element.getBoundingClientRect().top,
  }));
  offsets.forEach(({ element, offset }) => {
    element.style.translate = `0 ${offset}px`;
  });

  return () => {
    sticky.forEach((item) => item.restore());
    restoreBody();
    restoreOverflow();
    window.scrollTo({ left: x, top: y, behavior: "instant" });
    restoreBehavior();
    root.removeAttribute(lockAttribute);
    running.forEach((animation) => {
      if (animation.playState === "paused") animation.play();
    });
    window.dispatchEvent(new Event(scrollUnlockEvent));
  };
}
