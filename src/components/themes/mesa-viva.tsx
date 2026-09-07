"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CakeSlice,
  ChevronLeft,
  ChevronRight,
  Martini,
  Sparkles,
  Star,
  Sun,
  UsersRound,
  Utensils,
} from "lucide-react";
import type { Product } from "@/lib/menu";
import { CategoryIcon } from "../category-visual";
import { Price, ProductImage } from "../product-card";
import { useMenuMotion } from "./theme-frame";
import type {
  RedesignCatalogProps,
  RedesignHeroProps,
  RedesignHighlightsProps,
} from "./redesign-types";

const occasions = [
  {
    label: "Pra dividir",
    caption: "Conversa boa pede mesa cheia.",
    category: "tabuas",
    categoryLabel: "Ver todas as tábuas",
    Icon: UsersRound,
    names: ["Tábua de Picanha", "Tábua de Mignon", "Tábua de Frango"],
  },
  {
    label: "Pra brindar",
    caption: "Escolha o seu próximo brinde.",
    category: "classicos",
    categoryLabel: "Ver todos os drinks",
    Icon: Martini,
    names: ["MaracuJack", "Moscow Mule", "Negroni"],
  },
  {
    label: "Pra adoçar",
    caption: "Sempre cabe um final feliz.",
    category: "sobremesas",
    categoryLabel: "Ver todas as sobremesas",
    Icon: CakeSlice,
    names: ["Petit Gateau", "Pudim de Leite"],
  },
];

export function MesaVivaHero({
  products,
  onSelect,
  onCategory,
}: RedesignHeroProps) {
  const [occasionIndex, setOccasionIndex] = useState(0);
  const [dishIndex, setDishIndex] = useState(0);
  const motion = useMenuMotion();
  const occasion = occasions[occasionIndex];
  const dishes = occasion.names
    .map((name) => products.find((product) => product.name === name))
    .filter((product): product is Product => Boolean(product));
  const dish = dishes[dishIndex % dishes.length] ?? products[0];

  function changeOccasion(index: number) {
    setOccasionIndex(index);
    setDishIndex(0);
  }

  function turnTable(direction: number) {
    setDishIndex(
      (current) => (current + direction + dishes.length) % dishes.length,
    );
  }

  if (!dish) return null;

  return (
    <section
      className={`mv-hero ${motion ? "mv-motion" : ""}`}
      aria-labelledby="mv-title"
    >
      <div className="mv-hero-inner shell">
        <div className="mv-welcome">
          <p className="mv-kicker">
            <Sun size={17} /> DOS BACANAS · SOROCABA
          </p>
          <h1 id="mv-title">
            A mesa <br />é sua<span className="mv-period">.</span>
          </h1>
          <p className="mv-intro">
            Gente boa, conversa solta <br />e um cardápio cheio de encontros.
          </p>
          <button className="mv-explore" onClick={() => onCategory("all")}>
            Explorar o cardápio <ArrowDown size={18} />
          </button>
          <div className="mv-occasion-picker">
            <span className="mv-picker-label">QUAL É O PLANO DE HOJE?</span>
            <div
              className="mv-occasions"
              role="group"
              aria-label="Escolher ocasião"
            >
              {occasions.map(({ label, Icon }, index) => (
                <button
                  key={label}
                  aria-pressed={occasionIndex === index}
                  onClick={() => changeOccasion(index)}
                >
                  <Icon size={20} strokeWidth={1.7} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mv-table-scene">
          <div className="mv-tabletop" aria-hidden="true" />
          <div className="mv-table-seal" aria-hidden="true">
            <Sun size={25} />
            <span>
              SENTA AQUI.
              <br />
              FICA À VONTADE.
            </span>
          </div>
          <div className="mv-table-utensils" aria-hidden="true">
            <Utensils strokeWidth={0.75} />
          </div>
          <div className="mv-plate-wrap" key={`${occasionIndex}-${dish.id}`}>
            <button
              className="mv-plate"
              onClick={() => onSelect(dish)}
              aria-label={`Ver detalhes de ${dish.name}`}
            >
              <span className="mv-plate-photo">
                <ProductImage
                  product={dish}
                  priority
                  sizes="(max-width: 600px) 260px, (max-width: 1000px) 340px, 430px"
                />
              </span>
              <span className="mv-plate-open">
                <ArrowUpRight size={23} />
              </span>
            </button>
          </div>
          <div
            className="mv-table-picks"
            role="group"
            aria-label={`Sugestões: ${occasion.label.toLowerCase()}`}
          >
            {dishes.map((product, index) => (
              <button
                key={product.id}
                onClick={() => setDishIndex(index)}
                aria-label={`Mostrar ${product.name}`}
                aria-pressed={dish.id === product.id}
              >
                <span>
                  <ProductImage product={product} sizes="72px" />
                </span>
              </button>
            ))}
          </div>
          <div
            className="mv-dish-note"
            key={`note-${dish.id}`}
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="mv-note-label">
              <occasion.Icon size={14} /> {occasion.caption}
            </span>
            <button className="mv-dish-title" onClick={() => onSelect(dish)}>
              <strong>{dish.name}</strong>
              <ArrowUpRight size={20} />
            </button>
            <div className="mv-note-bottom">
              <Price product={dish} />
              <div
                className="mv-table-controls"
                aria-label="Navegar pelas sugestões"
              >
                <button
                  onClick={() => turnTable(-1)}
                  aria-label="Sugestão anterior"
                  disabled={dishes.length < 2}
                >
                  <ChevronLeft size={19} />
                </button>
                <span>
                  {String((dishIndex % dishes.length) + 1).padStart(2, "0")}
                  <i />
                  {String(dishes.length).padStart(2, "0")}
                </span>
                <button
                  onClick={() => turnTable(1)}
                  aria-label="Próxima sugestão"
                  disabled={dishes.length < 2}
                >
                  <ChevronRight size={19} />
                </button>
              </div>
            </div>
          </div>
          <button
            className="mv-see-category"
            onClick={() => onCategory(occasion.category)}
          >
            {occasion.categoryLabel}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
      <div className="mv-hero-footer shell">
        <span>
          <Sparkles size={15} /> Bons encontros começam à mesa.
        </span>
        <span>
          O SEU PRÓXIMO FAVORITO ESTÁ AQUI <ArrowDown size={15} />
        </span>
      </div>
    </section>
  );
}

export function MesaVivaHighlights({
  categories,
  products,
  onCategory,
  onTopPicks,
}: RedesignHighlightsProps) {
  const shortcuts = ["porcoes", "chopp", "classicos", "massas", "sobremesas"]
    .map((slug) => categories.find((category) => category.slug === slug))
    .filter((category) => category !== undefined);

  return (
    <section
      className="mv-highlights shell"
      aria-labelledby="mv-discover-title"
    >
      <div className="mv-discover-heading">
        <div>
          <span className="mv-kicker">DE VONTADE EM VONTADE</span>
          <h2 id="mv-discover-title">
            Pode dar <br />
            uma olhadinha.
          </h2>
        </div>
        <button className="mv-favorites" onClick={onTopPicks}>
          <Star size={18} />
          <span>Os mais pedidos</span>
          <ArrowUpRight size={17} />
        </button>
      </div>
      <div className="mv-category-shelf" aria-label="Atalhos do cardápio">
        {shortcuts.map((category, index) => {
          const photo = products.find(
            (product) => product.category_id === category.id && product.image,
          );
          return (
            <button
              key={category.id}
              className="mv-shelf-item"
              onClick={() => onCategory(category.slug)}
            >
              <span className="mv-shelf-photo">
                {photo ? (
                  <ProductImage
                    product={photo}
                    sizes="(max-width: 600px) 124px, 190px"
                  />
                ) : (
                  <CategoryIcon slug={category.slug} size={40} />
                )}
                <span className="mv-shelf-number">0{index + 1}</span>
                <span className="mv-shelf-icon">
                  <CategoryIcon slug={category.slug} size={20} />
                </span>
              </span>
              <span className="mv-shelf-name">
                {category.name}
                <ArrowUpRight size={17} />
              </span>
            </button>
          );
        })}
      </div>
      <p className="mv-shelf-hint">
        Encontre sua vontade. Toque para explorar. <ArrowRight size={15} />
      </p>
    </section>
  );
}

export function MesaVivaCatalog({
  categories,
  products,
  onSelect,
}: RedesignCatalogProps) {
  return (
    <div className="mv-catalog-sections">
      {categories.map((category) => {
        const items = products.filter(
          (product) => product.category_id === category.id,
        );
        if (!items.length) return null;
        return (
          <section
            className="mv-menu-section"
            key={category.id}
            aria-labelledby={`mv-${category.slug}`}
          >
            <div
              className="mv-section-intro"
              data-cinema-heading
              data-scroll-lock-sticky
            >
              <span className="mv-section-icon">
                <CategoryIcon slug={category.slug} size={27} />
              </span>
              <span className="mv-section-count">
                {String(items.length).padStart(2, "0")} OPÇÕES
              </span>
              <h2 id={`mv-${category.slug}`}>{category.name}</h2>
              {category.description && <p>{category.description}</p>}
              <ArrowDown
                className="mv-section-arrow"
                size={28}
                strokeWidth={1.3}
              />
            </div>
            <div className="mv-product-grid">
              {items.map((product, index) => (
                <article
                  className="mv-product-card product-card"
                  data-product-id={product.id}
                  key={product.id}
                >
                  <button
                    className="mv-product-button"
                    onClick={() => onSelect(product)}
                    aria-label={`Ver detalhes de ${product.name}`}
                  >
                    <div className="mv-product-visual">
                      <div className="product-photo">
                        <ProductImage
                          product={product}
                          sizes="(max-width: 600px) 132px, (max-width: 1100px) 180px, 210px"
                        />
                      </div>
                      <span className="mv-product-index" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="product-copy">
                      {(product.is_top_pick || product.is_happy_hour) && (
                        <span className="mv-product-badge">
                          {product.is_top_pick ? (
                            <Star size={11} />
                          ) : (
                            <Sun size={11} />
                          )}
                          {product.is_top_pick ? "MAIS PEDIDO" : "HAPPY HOUR"}
                        </span>
                      )}
                      <h3>{product.name}</h3>
                      {product.description && <p>{product.description}</p>}
                      <div className="product-bottom">
                        <Price product={product} />
                        <span className="mv-product-more">
                          <ArrowUpRight size={20} />
                          <span className="mv-visually-hidden">
                            Ver detalhes
                          </span>
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
