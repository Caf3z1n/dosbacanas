"use client";

import { useId, useState, type CSSProperties } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Plus,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import type { Product } from "@/lib/menu";
import { CategoryIcon, categoryGroup } from "../category-visual";
import { Price, ProductImage } from "../product-card";
import { useMenuMotion } from "./theme-frame";
import type {
  RedesignCatalogProps,
  RedesignHeroProps,
  RedesignHighlightsProps,
} from "./redesign-types";

const selectionNames = [
  "MaracuJack",
  "Torresmo 300g",
  "Moscow Mule",
  "Camarão com Catupiry",
  "Petit Gateau",
];

function selectDeck(products: Product[]) {
  const selected = selectionNames.flatMap((name) => {
    const product = products.find((item) => item.name === name);
    return product ? [product] : [];
  });
  return selected.length ? selected : products.slice(0, 5);
}

const pad = (value: number) => String(value).padStart(2, "0");

export function BalcaoHero({
  products,
  onSelect,
  onCategory,
}: RedesignHeroProps) {
  const deck = selectDeck(products);
  const [index, setIndex] = useState(0);
  const motion = useMenuMotion();
  const sliderId = useId();
  const activeIndex = Math.min(index, Math.max(deck.length - 1, 0));
  const product = deck[activeIndex];
  if (!product) return null;

  const chooseNext = (step: number) =>
    setIndex((current) => (current + step + deck.length) % deck.length);

  return (
    <section
      className="bc-hero"
      aria-labelledby="bc-hero-title"
      data-bc-motion={motion}
    >
      <div className="bc-hero-inner shell">
        <div className="bc-hero-copy">
          <div className="bc-overline">
            <span className="bc-mark" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            DOS BACANAS / BALCÃO 360
          </div>
          <h1 id="bc-hero-title">
            <span>O SABOR</span>
            <span>TÁ NO SEU</span>
            <span className="bc-title-yellow">
              CONTROLE<span className="bc-title-dot">.</span>
            </span>
          </h1>
          <div className="bc-hero-intro">
            <ArrowDownRight size={31} strokeWidth={1.4} aria-hidden="true" />
            <p>
              Gire entre os sabores. Encontre o seu.
              <br />A próxima boa escolha começa aqui.
            </p>
          </div>
          <button className="bc-catalog-cta" onClick={() => onCategory("all")}>
            EXPLORAR O CARDÁPIO <ArrowDown size={18} />
          </button>
          <div className="bc-hero-footnote">
            <span>SOROCABA, SP</span>
            <span>BOA COMIDA. BOA COMPANHIA.</span>
          </div>
        </div>

        <div className="bc-console">
          <span className="bc-console-screw bc-screw-tl" aria-hidden="true" />
          <span className="bc-console-screw bc-screw-tr" aria-hidden="true" />
          <span className="bc-console-screw bc-screw-bl" aria-hidden="true" />
          <span className="bc-console-screw bc-screw-br" aria-hidden="true" />
          <div className="bc-console-top">
            <span>
              <i aria-hidden="true" /> SELETOR DE SABORES
            </span>
            <SlidersHorizontal size={15} aria-hidden="true" />
          </div>
          <div
            className="bc-dial"
            style={
              {
                "--bc-turn": `${-130 + activeIndex * (260 / Math.max(deck.length - 1, 1))}deg`,
              } as CSSProperties
            }
          >
            <div className="bc-dial-ticks" aria-hidden="true" />
            <div className="bc-dial-hand" aria-hidden="true">
              <i />
            </div>
            <span className="bc-dial-north" aria-hidden="true">
              DOS / BACANAS
            </span>
            <button
              className="bc-dial-photo"
              onClick={() => onSelect(product)}
              aria-label={`Ver detalhes de ${product.name}`}
            >
              <span className="bc-dial-image" key={product.id}>
                <ProductImage
                  product={product}
                  priority={activeIndex === 0}
                  sizes="(max-width: 700px) 250px, 380px"
                />
              </span>
              <span className="bc-dial-open" aria-hidden="true">
                <Plus size={22} />
              </span>
            </button>
            <span className="bc-dial-south" aria-hidden="true">
              TOQUE PARA CONHECER
            </span>
          </div>
          <div
            className="bc-console-display"
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="bc-selection-number">
              {pad(activeIndex + 1)}
              <small>/{pad(deck.length)}</small>
            </span>
            <div className="bc-selection-title" key={product.id}>
              <span>EM DESTAQUE NO BALCÃO</span>
              <h2>{product.name}</h2>
            </div>
            <Price product={product} className="bc-selection-price" />
          </div>
          <div className="bc-console-control">
            <button
              className="bc-step"
              onClick={() => chooseNext(-1)}
              aria-label="Sabor anterior"
            >
              <ChevronLeft size={21} />
            </button>
            <div className="bc-slider-wrap">
              <label htmlFor={sliderId}>
                DESLIZE PARA DESCOBRIR{" "}
                <ArrowRight size={12} aria-hidden="true" />
              </label>
              <input
                id={sliderId}
                type="range"
                min={0}
                max={deck.length - 1}
                step={1}
                value={activeIndex}
                aria-valuetext={product.name}
                onChange={(event) => setIndex(Number(event.target.value))}
              />
              <div className="bc-slider-notches" aria-hidden="true">
                {deck.map((item, position) => (
                  <span key={item.id} data-active={position === activeIndex}>
                    {pad(position + 1)}
                  </span>
                ))}
              </div>
            </div>
            <button
              className="bc-step"
              onClick={() => chooseNext(1)}
              aria-label="Próximo sabor"
            >
              <ChevronRight size={21} />
            </button>
          </div>
        </div>
      </div>
      <div className="bc-hero-ruler" aria-hidden="true">
        <span>ENTRE, ESCOLHA, FIQUE À VONTADE.</span>
        <span>DB — 360</span>
      </div>
    </section>
  );
}

const discoveryGroups = [
  {
    id: "cozinha",
    label: "FOME DE QUÊ?",
    subtitle: "Da cozinha pra sua mesa.",
    slug: "porcoes",
  },
  {
    id: "bar",
    label: "VAMOS BRINDAR?",
    subtitle: "Seu próximo gole tá aqui.",
    slug: "classicos",
  },
  {
    id: "sem-alcool",
    label: "LEVE NA BOA.",
    subtitle: "Sabor em qualquer ritmo.",
    slug: "soft-drinks",
  },
];

export function BalcaoHighlights({
  categories,
  products,
  onCategory,
  onTopPicks,
}: RedesignHighlightsProps) {
  const [group, setGroup] = useState("cozinha");
  const motion = useMenuMotion();
  const panelId = useId();
  const selected = discoveryGroups.find((item) => item.id === group)!;
  const choices = categories.filter((category) => {
    const categoryType = categoryGroup(category.slug);
    return (
      categoryType === group || (group === "bar" && categoryType === "happy")
    );
  });

  return (
    <section
      className="bc-discovery shell"
      aria-labelledby="bc-discovery-title"
      data-bc-motion={motion}
    >
      <div className="bc-discovery-heading section-heading">
        <span className="bc-overline">01 / ESCOLHA A DIREÇÃO</span>
        <h2 id="bc-discovery-title">
          CADA VONTADE.
          <br />
          <span>UM CAMINHO.</span>
        </h2>
        <p>Encontre o que combina com o seu momento.</p>
        <button className="bc-picks-link" onClick={onTopPicks}>
          <Star size={15} /> Os mais pedidos <ArrowUpRight size={15} />
        </button>
      </div>
      <div className="bc-discovery-console" data-cinema-heading>
        <div
          className="bc-group-switch"
          aria-label="Escolha uma parte do cardápio"
        >
          {discoveryGroups.map((item, itemIndex) => (
            <button
              key={item.id}
              aria-pressed={group === item.id}
              aria-controls={panelId}
              onClick={() => setGroup(item.id)}
              className={group === item.id ? "bc-group-active" : ""}
            >
              <span className="bc-group-number">{pad(itemIndex + 1)}</span>
              <CategoryIcon slug={item.slug} size={22} />
              <span>{item.label}</span>
              <ArrowDownRight size={19} className="bc-group-arrow" />
            </button>
          ))}
        </div>
        <div className="bc-discovery-panel" id={panelId}>
          <div className="bc-panel-label">
            <span>{selected.subtitle}</span>
            <span>{pad(choices.length)} CATEGORIAS</span>
          </div>
          <div className="bc-category-matrix" key={group}>
            {choices.map((category, categoryIndex) => {
              const count = products.filter(
                (product) => product.category_id === category.id,
              ).length;
              return (
                <button
                  key={category.id}
                  onClick={() => onCategory(category.slug)}
                  style={{ "--bc-order": categoryIndex } as CSSProperties}
                >
                  <CategoryIcon slug={category.slug} size={24} />
                  <span>
                    <strong>{category.name}</strong>
                    <small>
                      {count} {count === 1 ? "opção" : "opções"}
                    </small>
                  </span>
                  <ArrowUpRight size={17} />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function BalcaoCatalog({
  categories,
  products,
  onSelect,
}: RedesignCatalogProps) {
  return (
    <div className="bc-catalog">
      {categories.map((category, categoryIndex) => {
        const items = products.filter(
          (product) => product.category_id === category.id,
        );
        if (!items.length) return null;
        return (
          <section
            className="bc-menu-section menu-section"
            key={category.id}
            aria-labelledby={`bc-category-${category.slug}`}
          >
            <div className="bc-section-heading menu-section-heading">
              <span className="bc-category-index" aria-hidden="true">
                {pad(categoryIndex + 1)}
              </span>
              <div className="bc-category-title">
                <span>
                  <CategoryIcon slug={category.slug} size={18} />{" "}
                  {pad(items.length)} {items.length === 1 ? "OPÇÃO" : "OPÇÕES"}
                </span>
                <h2 id={`bc-category-${category.slug}`}>{category.name}</h2>
              </div>
              <p>{category.description}</p>
              <ArrowDownRight
                className="bc-category-arrow"
                size={35}
                strokeWidth={1.25}
                aria-hidden="true"
              />
            </div>
            <div className="bc-product-list">
              {items.map((product, productIndex) => (
                <article
                  className="bc-product product-card"
                  data-product-id={product.id}
                  key={product.id}
                >
                  <button
                    className="bc-product-button product-button"
                    onClick={() => onSelect(product)}
                    aria-label={`Ver detalhes de ${product.name}`}
                  >
                    <span className="bc-product-index" aria-hidden="true">
                      {pad(productIndex + 1)}
                    </span>
                    <div className="bc-product-photo product-photo">
                      <ProductImage
                        product={product}
                        sizes="(max-width: 600px) 140px, (max-width: 1000px) 220px, 240px"
                      />
                      <span
                        className="bc-product-photo-plus"
                        aria-hidden="true"
                      >
                        <Plus size={19} />
                      </span>
                    </div>
                    <div className="bc-product-copy product-copy">
                      <div className="bc-product-flags">
                        {product.is_top_pick ? (
                          <span>
                            <Star size={11} /> MAIS PEDIDO
                          </span>
                        ) : product.is_happy_hour ? (
                          <span>
                            <Clock3 size={11} /> HAPPY HOUR
                          </span>
                        ) : (
                          <span>{category.name}</span>
                        )}
                      </div>
                      <h3>{product.name}</h3>
                      {product.description && <p>{product.description}</p>}
                      <div className="bc-product-bottom product-bottom">
                        <Price product={product} />
                        <span className="bc-product-details">
                          DETALHES <ArrowUpRight size={15} />
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
