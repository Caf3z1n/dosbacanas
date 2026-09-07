"use client";

import { useRef, useState, type CSSProperties } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Asterisk,
  BookOpen,
  Check,
  Shuffle,
} from "lucide-react";
import { hasOffer } from "@/lib/menu";
import { CategoryIcon, categoryGroup } from "../category-visual";
import { Price, ProductImage } from "../product-card";
import { useMenuMotion } from "./theme-frame";
import type {
  RedesignCatalogProps,
  RedesignHeroProps,
  RedesignHighlightsProps,
} from "./redesign-types";
import "./edicao-bacana.css";

const editions = [
  {
    label: "Cozinha",
    category: "tabuas",
    icon: "porcoes",
    name: "Tábua de Picanha",
    title: ["FOME DE", "ENCONTRO."],
    note: "A melhor parte é dividir.",
    link: "Explore as tábuas",
  },
  {
    label: "Bar",
    category: "classicos",
    icon: "classicos",
    name: "Moscow Mule",
    title: ["UM BRINDE", "AO AGORA."],
    note: "O próximo capítulo pede um drink.",
    link: "Explore os drinks",
  },
  {
    label: "Doce",
    category: "sobremesas",
    icon: "sobremesas",
    name: "Petit Gateau",
    title: ["O FINAL", "É DOCE."],
    note: "Sempre cabe mais uma página.",
    link: "Explore as sobremesas",
  },
] as const;

export function EdicaoHero({
  products,
  onSelect,
  onCategory,
}: RedesignHeroProps) {
  const [edition, setEdition] = useState(0);
  const [turn, setTurn] = useState(0);
  const [direction, setDirection] = useState(1);
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null);
  const suppressSwipeClickUntil = useRef(0);
  const motion = useMenuMotion();
  const issue = editions[edition];
  const cover =
    products.find((product) => product.name === issue.name) ?? products[0];

  function chooseEdition(index: number) {
    const next = (index + editions.length) % editions.length;
    if (next === edition) return;
    setDirection(index < edition ? -1 : 1);
    setEdition(next);
    setTurn((previous) => previous + 1);
  }

  if (!cover) return null;

  return (
    <section className="ed-hero shell" aria-labelledby="ed-title">
      <div className="ed-imprint">
        <span>
          <Asterisk size={14} /> O CARDÁPIO EM OUTRA EDIÇÃO
        </span>
        <span>
          SOROCABA, SP <span aria-hidden="true">↗</span>
        </span>
      </div>
      <div className="ed-masthead">
        <h1 id="ed-title" aria-label="Bacanas. Uma edição para saborear.">
          {"BACANAS".split("").map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              aria-hidden="true"
              style={{ "--letter": index } as CSSProperties}
            >
              {letter}
            </span>
          ))}
          <span className="ed-masthead-dot" aria-hidden="true">
            .
          </span>
        </h1>
        <div className="ed-masthead-note">
          <BookOpen size={20} strokeWidth={1.3} />
          <span>
            Uma edição
            <br />
            para saborear.
          </span>
        </div>
      </div>

      <div className="ed-issue-nav">
        <span className="ed-nav-label">
          VIRE A PÁGINA <ArrowRight size={15} />
        </span>
        <div className="ed-editions" aria-label="Escolher edição da capa">
          {editions.map((item, index) => (
            <button
              key={item.label}
              className={edition === index ? "ed-active" : ""}
              aria-pressed={edition === index}
              onClick={() => chooseEdition(index)}
            >
              <span className="ed-tab-number">0{index + 1}</span>
              <CategoryIcon slug={item.icon} size={17} />
              {item.label}
              {edition === index && (
                <span className="ed-active-mark" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
        <span className="ed-issue-no">EDIÇÃO 0{edition + 1} / 03</span>
      </div>

      <div
        className="ed-cover-stage"
        onPointerDown={(event) => {
          // A new tap starts cleanly, while a second finger leaves pinch zoom
          // to the browser instead of turning the edition.
          suppressSwipeClickUntil.current = 0;
          pointer.current =
            event.pointerType === "touch" && event.isPrimary
              ? {
                  id: event.pointerId,
                  x: event.clientX,
                  y: event.clientY,
                }
              : null;
        }}
        onPointerUp={(event) => {
          if (!pointer.current || pointer.current.id !== event.pointerId)
            return;
          const dx = event.clientX - pointer.current.x;
          const dy = event.clientY - pointer.current.y;
          pointer.current = null;
          if (
            Math.abs(dx) > 75 &&
            Math.abs(dy) < 45 &&
            Math.abs(dx) > Math.abs(dy) * 1.6
          ) {
            event.preventDefault();
            // Some mobile browsers still emit a compatibility click after
            // pointerup. Capture it before it can activate the photograph.
            suppressSwipeClickUntil.current = event.timeStamp + 800;
            chooseEdition(edition + (dx < 0 ? 1 : -1));
          }
        }}
        onClickCapture={(event) => {
          if (
            event.detail > 0 &&
            event.timeStamp < suppressSwipeClickUntil.current
          ) {
            event.preventDefault();
            event.stopPropagation();
            suppressSwipeClickUntil.current = 0;
          }
        }}
        onPointerCancel={() => {
          pointer.current = null;
          suppressSwipeClickUntil.current = 0;
        }}
      >
        <div
          className={`ed-spread ed-spread-${edition} ${motion ? "ed-turning" : ""}`}
          key={turn}
          style={{ "--turn-side": direction } as CSSProperties}
        >
          <button
            className="ed-cover-photo"
            onClick={() => onSelect(cover)}
            aria-label={`Ver detalhes de ${cover.name}`}
          >
            <ProductImage
              product={cover}
              priority
              sizes="(max-width: 600px) 100vw, (max-width: 1000px) 60vw, 850px"
            />
            <span className="ed-photo-label">
              <span>NA CAPA</span>
              <strong>{cover.name}</strong>
              <ArrowUpRight size={24} />
            </span>
            <span className="ed-crop-mark ed-crop-one" aria-hidden="true" />
            <span className="ed-crop-mark ed-crop-two" aria-hidden="true" />
          </button>
          <div className="ed-cover-story">
            <div className="ed-story-top">
              <span>
                LEIA COM OS OLHOS.
                <br />
                ESCOLHA COM VONTADE.
              </span>
              <Asterisk
                className="ed-story-asterisk"
                size={47}
                strokeWidth={1.2}
                aria-hidden="true"
              />
            </div>
            <h2>
              {issue.title.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <p>{issue.note}</p>
            <button
              className="ed-story-link"
              onClick={() => onCategory(issue.category)}
            >
              {issue.link}
              <ArrowUpRight size={19} />
            </button>
            <div className="ed-story-bottom">
              <span>
                FOTOGRAFIA BOA.
                <br />
                SABOR AINDA MELHOR.
              </span>
              <span className="ed-page-number">0{edition + 1}</span>
            </div>
          </div>
        </div>
        <button
          className="ed-page-corner"
          aria-label="Virar para a próxima edição"
          onClick={() => chooseEdition(edition + 1)}
        >
          <ArrowRight size={21} />
        </button>
      </div>

      <div className="ed-cover-footer">
        <div className="ed-cover-price" aria-live="polite">
          <span>{cover.name}</span>
          <Price product={cover} />
        </div>
        <div className="ed-page-controls">
          <button
            aria-label="Edição anterior"
            onClick={() => chooseEdition(edition - 1)}
          >
            <ArrowLeft size={17} />
          </button>
          <span>
            0{edition + 1}
            <span> / 03</span>
          </span>
          <button
            aria-label="Próxima edição"
            onClick={() => chooseEdition(edition + 1)}
          >
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
      <button className="ed-browse" onClick={() => onCategory("all")}>
        <span>{products.length} boas razões para continuar.</span>
        <span>
          EXPLORAR O CARDÁPIO <ArrowDown size={16} />
        </span>
      </button>
    </section>
  );
}

export function EdicaoHighlights({
  products,
  categories,
  onSelect,
  onTopPicks,
}: RedesignHighlightsProps) {
  const [mood, setMood] = useState("cozinha");
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [draw, setDraw] = useState(0);
  const motion = useMenuMotion();
  const candidates = products.filter((product) => {
    const category = categories.find((item) => item.id === product.category_id);
    if (!category) return false;
    if (mood === "doce") return category.slug === "sobremesas";
    if (mood === "bar") return categoryGroup(category.slug) === "bar";
    return (
      categoryGroup(category.slug) === "cozinha" &&
      category.slug !== "sobremesas"
    );
  });
  const picked = products.find((product) => product.id === pickedId);
  const preview =
    picked ??
    products.find((product) => product.is_top_pick && product.image) ??
    products[0];
  if (!preview) return null;

  function surprise() {
    const pool = candidates.filter((product) => product.id !== pickedId);
    const available = pool.length ? pool : candidates;
    if (!available.length) return;
    const product = available[Math.floor(Math.random() * available.length)];
    setPickedId(product.id);
    setDraw((previous) => previous + 1);
  }

  return (
    <section
      className="ed-discovery shell"
      aria-labelledby="ed-discovery-title"
    >
      <div className="ed-discovery-copy" data-cinema-heading>
        <span className="ed-kicker">
          <Shuffle size={16} /> ENCONTROS NÃO PLANEJADOS
        </span>
        <h2 id="ed-discovery-title">
          Deixe a<br />
          curiosidade
          <br />
          <span>escolher.</span>
        </h2>
        <p>
          Um novo favorito pode estar na próxima carta. Escolha sua vontade e
          descubra um sabor do cardápio.
        </p>
        <div className="ed-moods" aria-label="Tipo de sugestão">
          {[
            { id: "cozinha", label: "Comer", icon: "porcoes" },
            { id: "bar", label: "Brindar", icon: "classicos" },
            { id: "doce", label: "Adoçar", icon: "sobremesas" },
          ].map((option) => (
            <button
              key={option.id}
              aria-pressed={mood === option.id}
              onClick={() => {
                setMood(option.id);
                setPickedId(null);
              }}
            >
              <CategoryIcon slug={option.icon} size={17} />
              {option.label}
              {mood === option.id && <Check size={12} />}
            </button>
          ))}
        </div>
        <button
          className="ed-surprise"
          onClick={surprise}
          disabled={!candidates.length}
        >
          <Shuffle size={19} />
          <span>{picked ? "Mais uma surpresa" : "Me surpreenda"}</span>
          <ArrowUpRight size={19} />
        </button>
        <button className="ed-top-link" onClick={onTopPicks}>
          Prefiro os mais pedidos <ArrowRight size={16} />
        </button>
      </div>
      <div className={`ed-ticket-wrap ${picked ? "ed-ticket-revealed" : ""}`}>
        <div className="ed-ticket-back" aria-hidden="true" />
        <div
          className={`ed-ticket ${motion && picked ? "ed-ticket-opening" : ""}`}
          key={`${draw}-${pickedId ?? "cover"}`}
        >
          {picked ? (
            <button
              className="ed-ticket-content"
              onClick={() => onSelect(picked)}
              aria-label={`Ver detalhes da sugestão: ${picked.name}`}
            >
              <span className="ed-ticket-top">
                ACHADO DA VEZ <Asterisk size={17} />
              </span>
              <span className="ed-ticket-image">
                <ProductImage
                  product={picked}
                  sizes="(max-width: 700px) 85vw, 450px"
                />
              </span>
              <span className="ed-ticket-label">
                ESSE ENCONTRO FOI POR ACASO.
              </span>
              <strong>{picked.name}</strong>
              <span className="ed-ticket-bottom">
                <Price product={picked} />
                <span>
                  Conhecer <ArrowUpRight size={18} />
                </span>
              </span>
            </button>
          ) : (
            <div className="ed-ticket-unopened">
              <span>UM BOM ENCONTRO</span>
              <div className="ed-ticket-symbol" aria-hidden="true">
                <Asterisk strokeWidth={1.1} />
              </div>
              <strong>
                QUAL VAI
                <br />
                SER O SEU?
              </strong>
              <span className="ed-ticket-secret">
                ESCOLHA UMA VONTADE.
                <br />
                DEIXE O RESTO COM O ACASO.
              </span>
            </div>
          )}
        </div>
        <span className="ed-ticket-caption">
          <span aria-hidden="true">↳</span> Às vezes, a melhor escolha é uma
          descoberta.
        </span>
      </div>
      <p className="ed-announcement" aria-live="polite">
        {picked
          ? `Sua sugestão é ${picked.name}. Abra a carta para ver os detalhes.`
          : ""}
      </p>
    </section>
  );
}

export function EdicaoCatalog({
  categories,
  products,
  onSelect,
}: RedesignCatalogProps) {
  return (
    <div className="ed-catalog">
      {categories.map((category, categoryIndex) => {
        const items = products.filter(
          (product) => product.category_id === category.id,
        );
        if (!items.length) return null;
        return (
          <section
            className="ed-chapter menu-section"
            key={category.id}
            aria-labelledby={`ed-category-${category.slug}`}
          >
            <div className="ed-chapter-heading menu-section-heading">
              <div className="ed-chapter-index" aria-hidden="true">
                {String(categoryIndex + 1).padStart(2, "0")}
              </div>
              <div className="ed-chapter-title">
                <span>
                  <CategoryIcon slug={category.slug} size={17} /> NO CARDÁPIO
                </span>
                <h2 id={`ed-category-${category.slug}`}>{category.name}</h2>
                {category.description && <p>{category.description}</p>}
              </div>
              <span className="ed-chapter-count">
                {items.length} {items.length === 1 ? "escolha" : "escolhas"}
                <ArrowDown size={16} />
              </span>
            </div>
            <div
              className={`ed-contact-sheet ${items.length < 3 ? "ed-short-sheet" : ""}`}
            >
              {items.map((product, index) => (
                <article
                  key={product.id}
                  className={`product-card ed-product ${index % 5 === 0 ? "ed-product-lead" : ""}`}
                  data-product-id={product.id}
                >
                  <button
                    className="product-button"
                    onClick={() => onSelect(product)}
                    aria-label={`Ver detalhes de ${product.name}`}
                  >
                    <div className="ed-product-register">
                      <span>
                        {String(categoryIndex + 1).padStart(2, "0")}.
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>
                        {hasOffer(product)
                          ? "PREÇO ESPECIAL"
                          : product.is_happy_hour
                            ? "HAPPY HOUR"
                            : product.is_top_pick
                              ? "MAIS PEDIDO"
                              : category.name}
                      </span>
                      <ArrowUpRight size={16} />
                    </div>
                    <div className="product-photo">
                      <ProductImage
                        product={product}
                        sizes={
                          index % 5 === 0
                            ? "(max-width: 600px) 100vw, (max-width: 900px) 50vw, 640px"
                            : "(max-width: 600px) 50vw, (max-width: 900px) 50vw, 330px"
                        }
                      />
                      <span className="ed-photo-open" aria-hidden="true">
                        VER DE PERTO <ArrowUpRight size={18} />
                      </span>
                    </div>
                    <div className="product-copy">
                      <h3>{product.name}</h3>
                      {product.description && <p>{product.description}</p>}
                      <div className="product-bottom">
                        <Price product={product} />
                        <span className="ed-product-detail">
                          <span>Detalhes</span>
                          <ArrowUpRight size={17} />
                        </span>
                      </div>
                    </div>
                  </button>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
