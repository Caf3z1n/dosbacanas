"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Check, Palette, Pause, Play } from "lucide-react";
import { themes, type ThemeId } from "@/lib/themes";
import { useCinematicMotion } from "./cinematic-motion";

type MotionSettings = {
  motion: boolean;
  paused: boolean;
  reduced: boolean;
  variant: ThemeId;
  setPaused: (paused: boolean) => void;
};
const MotionContext = createContext<MotionSettings>({
  motion: true,
  paused: false,
  reduced: false,
  variant: 1,
  setPaused: () => undefined,
});
export const useMenuMotion = () => useContext(MotionContext).motion;
function subscribeMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

export function ThemeFrame({
  variant,
  children,
}: {
  variant: ThemeId;
  children: ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const motion = !paused && !reduced;
  useCinematicMotion(root, motion, variant);
  return (
    <MotionContext value={{ motion, paused, reduced, variant, setPaused }}>
      <div
        ref={root}
        className={`menu-theme theme-${variant} ${motion ? "motion-on" : "motion-paused"}`}
        data-theme={variant}
      >
        {children}
      </div>
    </MotionContext>
  );
}

export function ThemeControls() {
  const { motion, paused, reduced, variant, setPaused } =
    useContext(MotionContext);
  const picker = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (picker.current && !picker.current.contains(event.target as Node))
        picker.current.open = false;
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && picker.current?.open) {
        picker.current.open = false;
        picker.current.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  return (
    <div className="theme-tools" aria-label="Personalizar visualização">
      <button
        className="motion-toggle"
        onClick={() => setPaused(!paused)}
        disabled={reduced}
        aria-label={
          reduced
            ? "Movimento reduzido ativado no dispositivo"
            : paused
              ? "Retomar animações"
              : "Pausar animações"
        }
        title={
          reduced
            ? "Movimento reduzido do dispositivo"
            : paused
              ? "Retomar animações"
              : "Pausar animações"
        }
      >
        {motion ? <Pause size={14} /> : <Play size={14} />}
      </button>
      <details ref={picker} className="theme-picker">
        <summary aria-label="Escolher visual do cardápio">
          <Palette size={17} />
          <span>Visuais</span>
          <b>0{variant}</b>
        </summary>
        <nav aria-label="Versões do cardápio">
          <span className="picker-label">UM BAR. CINCO JEITOS DE SENTIR.</span>
          {themes.map((theme) => (
            <a
              key={theme.id}
              href={`/cardapio${theme.id}`}
              aria-current={theme.id === variant ? "page" : undefined}
            >
              <span className={`theme-swatch swatch-${theme.id}`}>
                0{theme.id}
              </span>
              <span>
                <strong>{theme.name}</strong>
                <small>{theme.description}</small>
              </span>
              {theme.id === variant && <Check size={16} />}
            </a>
          ))}
        </nav>
      </details>
    </div>
  );
}
