"use client";
import { type PointerEvent, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Clock3,
  Martini,
  MoveUpRight,
  Star,
  Utensils,
} from "lucide-react";
import type { Product } from "@/lib/menu";
import type { ThemeId } from "@/lib/themes";
import { ProductImage } from "../product-card";
import { ClassicHero } from "./classic-hero";
import { MesaVivaHero } from "./mesa-viva";
import { BalcaoHero } from "./balcao-360";
import { EdicaoHero } from "./edicao-bacana";
import { useMenuMotion } from "./theme-frame";

type HeroProps = {
  products: Product[];
  onSelect: (product: Product) => void;
  onCategory: (slug: string) => void;
};

function Tilt({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  const motion = useMenuMotion();
  function move(event: PointerEvent<HTMLDivElement>) {
    if (!motion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--tilt-y",
      `${((event.clientX - rect.left) / rect.width - 0.5) * 9}deg`,
    );
    event.currentTarget.style.setProperty(
      "--tilt-x",
      `${((event.clientY - rect.top) / rect.height - 0.5) * -7}deg`,
    );
  }
  return (
    <div
      className={`tilt-stage ${className}`}
      onPointerMove={move}
      onPointerLeave={(event) => {
        event.currentTarget.style.setProperty("--tilt-y", "0deg");
        event.currentTarget.style.setProperty("--tilt-x", "0deg");
      }}
    >
      <div className="tilt-content">{children}</div>
    </div>
  );
}
function Stamp({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const points = Array.from({ length: 40 }, (_, i) => {
    const angle = (Math.PI * i) / 20;
    const r = i % 2 ? 44 : 50;
    return `${(50 + Math.cos(angle) * r).toFixed(3)},${(50 + Math.sin(angle) * r).toFixed(3)}`;
  }).join(" ");
  return (
    <div className={`graphic-stamp ${className}`} aria-hidden="true">
      <svg viewBox="0 0 100 100">
        <polygon points={points} />
      </svg>
      <span>{children}</span>
    </div>
  );
}
function Tape({ text }: { text: string }) {
  return (
    <div className="marquee-tape" aria-hidden="true">
      <div>
        {[0, 1].map((copy) => (
          <span key={copy}>
            {Array.from({ length: 4 }, (_, i) => (
              <span key={i}>
                {text}
                <Star size={20} fill="currentColor" />
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

function PosterHero({ products, onSelect, onCategory }: HeroProps) {
  const food = products.find((p) => p.name === "Coxinha da Asa")!;
  const drink = products.find((p) => p.name === "MaracuJack")!;
  return (
    <section className="poster-hero">
      <div className="shell poster-main">
        <div className="poster-copy">
          <span className="poster-kicker">
            <span /> SOROCABA, A MESA TÁ POSTA.
          </span>
          <h1>
            <span>SABOR</span>
            <span>SEM</span>
            <span className="outlined-word">MEDIDA.</span>
          </h1>
          <div className="poster-copy-bottom">
            <p>
              A porção é caprichada.
              <br />O drink, no ponto.
              <br />O resto é com a sua turma.
            </p>
            <a
              className="round-cta"
              href="#cardapio"
              aria-label="Explorar cardápio"
            >
              <ArrowDown size={31} />
              <span>BORA?</span>
            </a>
          </div>
        </div>
        <Tilt className="poster-art">
          <div className="poster-orbit" aria-hidden="true" />
          <button
            className="poster-photo poster-food"
            onClick={() => onSelect(food)}
            aria-label={`Ver detalhes de ${food.name}`}
          >
            <ProductImage
              product={food}
              sizes="(max-width: 700px) 300px, 550px"
              priority
            />
            <span>
              {food.name}
              <ArrowUpRight size={18} />
            </span>
          </button>
          <button
            className="poster-photo poster-drink"
            onClick={() => onSelect(drink)}
            aria-label={`Ver detalhes de ${drink.name}`}
          >
            <ProductImage product={drink} sizes="250px" />
            <span>UM BRINDE A ISSO.</span>
          </button>
          <Stamp className="poster-stamp">
            BOM
            <br />
            DE
            <br />
            VERDADE.
          </Stamp>
          <div className="poster-caption">
            <span>COMIDA BOA NÃO PRECISA DE OCASIÃO.</span>
            <MoveUpRight size={34} strokeWidth={1} />
          </div>
        </Tilt>
      </div>
      <Tape text="COMIDA BOA. GENTE BACANA." />
      <div className="poster-shortcuts shell">
        <button onClick={() => onCategory("porcoes")}>
          <Utensils size={18} /> PRA DIVIDIR <ArrowUpRight size={16} />
        </button>
        <button onClick={() => onCategory("classicos")}>
          <Martini size={18} /> PRA BRINDAR <ArrowUpRight size={16} />
        </button>
        <button onClick={() => onCategory("happy-hour")}>
          <Clock3 size={18} /> PRA APROVEITAR <ArrowUpRight size={16} />
        </button>
      </div>
    </section>
  );
}

export function ThemeHero({
  variant,
  ...props
}: HeroProps & { variant: ThemeId }) {
  if (variant === 2) return <PosterHero {...props} />;
  if (variant === 3) return <MesaVivaHero {...props} />;
  if (variant === 4) return <BalcaoHero {...props} />;
  if (variant === 5) return <EdicaoHero {...props} />;
  return (
    <ClassicHero
      heroProduct={props.products.find((p) => p.name === "Tábua de Picanha")}
      onSelect={props.onSelect}
    />
  );
}
