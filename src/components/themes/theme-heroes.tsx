"use client";
import { useState, type PointerEvent, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Martini,
  MoveUpRight,
  Sparkles,
  Star,
  Utensils,
} from "lucide-react";
import type { Product } from "@/lib/menu";
import type { ThemeId } from "@/lib/themes";
import { Price, ProductImage } from "../product-card";
import { ClassicHero } from "./classic-hero";
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

function NightHero({ products, onSelect }: HeroProps) {
  const [active, setActive] = useState(0);
  const selection = ["MaracuJack", "Moscow Mule", "Negroni"].map((name) =>
    products.find((p) => p.name === name)!,
  );
  const captions = [
    "O primeiro brinde é só o começo.",
    "Uma boa conversa pede companhia.",
    "Clássicos nunca saem de cena.",
  ];
  return (
    <section className="night-hero" aria-label="Drinks em destaque">
      <div className="night-photo-stage" aria-hidden="true">
        {selection.map((p, i) => (
          <div
            key={p.id}
            className={`night-background ${active === i ? "active" : ""}`}
          >
            <ProductImage product={p} sizes="100vw" priority={i === 0} />
          </div>
        ))}
      </div>
      <div className="night-vignette" />
      <div className="night-frame" aria-hidden="true" />
      <div className="shell night-main">
        <div className="night-topline">
          <span>DOS BACANAS — COQUETELARIA & GASTRONOMIA</span>
          <span>SOROCABA, SP</span>
        </div>
        <div className="night-title">
          <span className="eyebrow">
            QUANDO A BOA COMPANHIA ENCONTRA O BOM DRINK
          </span>
          <h1>
            A noite
            <br />
            <span>é nossa.</span>
          </h1>
          <p key={active} className="night-caption">
            {captions[active]}
          </p>
          <a href="#cardapio" className="night-menu-link">
            DESCUBRA O CARDÁPIO <ArrowDown size={16} />
          </a>
        </div>
        <div className="night-bottom">
          <div className="night-controls">
            <button
              aria-label="Drink anterior"
              onClick={() => setActive((active + 2) % 3)}
            >
              <ArrowLeft size={18} />
            </button>
            <span aria-live="polite">
              0{active + 1}
              <i>/ 03</i>
            </span>
            <button
              aria-label="Próximo drink"
              onClick={() => setActive((active + 1) % 3)}
            >
              <ArrowRight size={18} />
            </button>
          </div>
          <button
            className="night-selected"
            onClick={() => onSelect(selection[active])}
            aria-label={`Ver detalhes de ${selection[active].name}`}
          >
            <span>NO SEU COPO</span>
            <strong>{selection[active].name}</strong>
            <Price product={selection[active]} />
            <ArrowUpRight size={23} />
          </button>
          <div className="night-dots" aria-label="Selecionar drink">
            {selection.map((p, i) => (
              <button
                key={p.id}
                aria-label={`Destacar ${p.name}`}
                aria-pressed={i === active}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PaperHero({ products, onSelect }: HeroProps) {
  const food = products.find((p) => p.name === "Tábua de Picanha")!;
  return (
    <section className="paper-hero shell">
      <div className="paper-topline">
        <span>GASTRONOMIA PARA COMPARTILHAR</span>
        <span>UM CONVITE AOS BONS ENCONTROS</span>
      </div>
      <div className="paper-main">
        <div className="paper-copy">
          <span className="paper-chapter">
            DA NOSSA COZINHA PARA A SUA MESA
          </span>
          <h1>
            O prazer
            <br />
            de estar
            <br />à mesa.
          </h1>
          <p>
            Entre uma porção e outra,
            <br />a vida acontece. Sente-se,
            <br />
            escolha e fique à vontade.
          </p>
          <a className="paper-menu-link" href="#cardapio">
            Conheça a nossa carta <ArrowDown size={17} />
          </a>
        </div>
        <div className="paper-art">
          <div className="paper-arch-line" aria-hidden="true" />
          <button
            className="paper-arch"
            onClick={() => onSelect(food)}
            aria-label={`Ver detalhes de ${food.name}`}
          >
            <ProductImage
              product={food}
              sizes="(max-width: 700px) 90vw, 600px"
              priority
            />
          </button>
          <Stamp className="paper-stamp">
            <Utensils size={21} />
            <small>
              FEITO PARA
              <br />
              DIVIDIR.
            </small>
          </Stamp>
          <div className="paper-photo-caption">
            <span>01.</span>
            <span>
              Tábua de Picanha
              <br />
              <small>Pão, batata e molho de alho.</small>
            </span>
            <ArrowUpRight size={19} />
          </div>
        </div>
      </div>
      <div className="paper-footnote">
        <span>Receitas autorais.</span>
        <Star size={13} />
        <span>Ingredientes selecionados.</span>
        <Star size={13} />
        <span>Bons momentos.</span>
      </div>
    </section>
  );
}

function ClubHero({ products, onSelect, onCategory }: HeroProps) {
  const food = products.find((p) => p.name === "Tábua de Picanha")!;
  const drink = products.find((p) => p.name === "Aperol Spritz")!;
  return (
    <section className="club-hero shell">
      <div className="club-intro">
        <span className="eyebrow">
          <Sparkles size={13} /> BEM-VINDO AO SEU PRÓXIMO BOM MOMENTO
        </span>
        <span className="club-location">SOROCABA, SP ↗</span>
      </div>
      <div className="club-bento">
        <div className="club-message">
          <span className="club-mini-brand">FOME DE BONS MOMENTOS?</span>
          <h1>
            Seu rolê.
            <br />
            Seu brinde.
            <br />
            Seu lugar.
          </h1>
          <a className="button button-gold" href="#cardapio">
            Encontre seu favorito <ArrowDown size={18} />
          </a>
          <div className="club-message-footer">
            <div className="club-orbit-mark" aria-hidden="true">
              <Star size={38} strokeWidth={1} />
            </div>
            <p>
              Vem pela comida.
              <br />
              Fica pela companhia.
            </p>
          </div>
        </div>
        <Tilt className="club-food-stage">
          <button
            className="club-tile club-food"
            onClick={() => onSelect(food)}
            aria-label={`Ver detalhes de ${food.name}`}
          >
            <ProductImage
              product={food}
              sizes="(max-width: 700px) 60vw, 600px"
              priority
            />
            <span className="club-tile-top">
              PRA COMPARTILHAR
              <span className="club-tile-arrow">
                <ArrowUpRight size={22} />
              </span>
            </span>
            <span className="club-tile-caption">
              <small>ESPAÇO NA MESA, POR FAVOR.</small>
              <strong>
                Tábua
                <br />
                de Picanha
              </strong>
              <Price product={food} />
            </span>
          </button>
        </Tilt>
        <button
          className="club-tile club-drink"
          onClick={() => onCategory("classicos")}
        >
          <ProductImage
            product={drink}
            sizes="(max-width: 700px) 40vw, 350px"
          />
          <span className="club-tile-top">
            PRA BRINDAR
            <span className="club-tile-arrow">
              <ArrowUpRight size={20} />
            </span>
          </span>
          <span className="club-tile-caption">
            <strong>
              Só mais
              <br />
              um brinde.
            </strong>
            <small>EXPLORE NOSSOS DRINKS</small>
          </span>
        </button>
        <button
          className="club-tile club-happy"
          onClick={() => onCategory("happy-hour")}
        >
          <span className="club-tile-top">
            <Clock3 size={18} />
            <ArrowUpRight size={22} />
          </span>
          <span className="club-happy-title">
            HAPPY
            <br />
            HOUR<span className="club-happy-dot">!</span>
          </span>
          <span className="club-happy-time">SEG A SEX · 17H ÀS 20H</span>
        </button>
      </div>
      <div className="club-discover">
        <span>Vá no que te dá vontade.</span>
        <button onClick={() => onCategory("porcoes")}>
          Porções <ArrowUpRight size={13} />
        </button>
        <button onClick={() => onCategory("classicos")}>
          Drinks <ArrowUpRight size={13} />
        </button>
        <button onClick={() => onCategory("sobremesas")}>
          Sobremesas <ArrowUpRight size={13} />
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
  if (variant === 3) return <NightHero {...props} />;
  if (variant === 4) return <PaperHero {...props} />;
  if (variant === 5) return <ClubHero {...props} />;
  return (
    <ClassicHero
      heroProduct={props.products.find((p) => p.name === "Tábua de Picanha")}
      onSelect={props.onSelect}
    />
  );
}
