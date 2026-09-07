"use client";
import { useState, type CSSProperties } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Compass,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { normalize, type Category, type Product } from "@/lib/menu";
import { CategoryIcon, categoryGroup } from "./category-visual";
import { ProductImage } from "./product-card";

export function CategoryExplorer({
  categories,
  products,
  selected,
  onCategory,
}: {
  categories: Category[];
  products: Product[];
  selected: string;
  onCategory: (slug: string) => void;
}) {
  const [query, setQuery] = useState("");
  const matches = categories.filter((c) =>
    normalize(`${c.name} ${c.description ?? ""}`).includes(normalize(query)),
  );
  const happy = categories.find((c) => c.slug === "happy-hour");
  const groups = [
    {
      id: "cozinha",
      label: "Da cozinha",
      caption: "Para dividir bons momentos",
      icon: "porcoes",
    },
    {
      id: "bar",
      label: "Do bar",
      caption: "Encontre o seu próximo brinde",
      icon: "classicos",
    },
    {
      id: "sem-alcool",
      label: "Sem álcool",
      caption: "Leveza em cada gole",
      icon: "soft-drinks",
    },
  ];
  return (
    <div className="category-explorer">
      <div className="explorer-head">
        <span className="explorer-heading-icon">
          <Compass size={27} strokeWidth={1.4} />
        </span>
        <span className="eyebrow">SIGA A SUA VONTADE</span>
        <h2>O que vai ser hoje?</h2>
        <p>Uma mesa de possibilidades. Escolha por onde começar.</p>
        <div className="explorer-search">
          <Search size={17} />
          <input
            type="search"
            aria-label="Buscar categoria"
            placeholder="Encontre uma categoria…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              aria-label="Limpar busca de categoria"
              onClick={() => setQuery("")}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      <div className="explorer-body">
        <div className="explorer-quick">
          <button className="explorer-all" onClick={() => onCategory("all")}>
            <Compass size={29} strokeWidth={1.3} />
            <span>
              <strong>Quero explorar tudo</strong>
              <small>{products.length} opções no cardápio</small>
            </span>
            <ArrowUpRight size={20} />
          </button>
          {happy && matches.includes(happy) && (
            <button
              className="explorer-happy"
              onClick={() => onCategory("happy-hour")}
            >
              <span className="explorer-happy-icon">
                <CategoryIcon slug="happy-hour" size={27} />
              </span>
              <span>
                <strong>Happy Hour</strong>
                <small>Um brinde às boas ofertas</small>
              </span>
              <ArrowUpRight size={19} />
            </button>
          )}
        </div>
        {groups.map((group) => {
          const items = matches.filter(
            (c) => categoryGroup(c.slug) === group.id,
          );
          if (!items.length) return null;
          return (
            <section
              key={group.id}
              className="explorer-group"
              aria-labelledby={`explorer-${group.id}`}
            >
              <div className="explorer-group-heading">
                <CategoryIcon slug={group.icon} size={18} />
                <h3 id={`explorer-${group.id}`}>{group.label}</h3>
                <span>{group.caption}</span>
              </div>
              <div className="category-explorer-grid">
                {items.map((category, i) => {
                  const items = products.filter(
                    (p) => p.category_id === category.id,
                  );
                  const cover = items.find((p) => p.image);
                  return (
                    <button
                      className="category-option"
                      key={category.id}
                      style={
                        {
                          "--stagger": `${Math.min(i, 5) * 35}ms`,
                        } as CSSProperties
                      }
                      onClick={() => onCategory(category.slug)}
                      aria-pressed={selected === category.slug}
                      aria-label={`${category.name}, ${items.length} ${items.length === 1 ? "opção" : "opções"}`}
                    >
                      <span className="category-option-visual">
                        {cover && <ProductImage product={cover} sizes="90px" />}
                        <span className="category-option-icon">
                          <CategoryIcon slug={category.slug} size={20} />
                        </span>
                      </span>
                      <span className="category-option-copy">
                        <strong>{category.name}</strong>
                        <small>
                          {category.description ??
                            "Para celebrar em boa companhia"}
                        </small>
                        <span>
                          {items.length}{" "}
                          {items.length === 1 ? "opção" : "opções"}
                        </span>
                      </span>
                      <span className="category-option-arrow">
                        {selected === category.slug ? (
                          <Check size={15} />
                        ) : (
                          <ArrowUpRight size={15} />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
        {!matches.length && (
          <div className="explorer-empty">
            <Search size={30} />
            <h3>Nenhuma categoria encontrada</h3>
            <p>Tente “drinks”, “porções” ou “vinhos”.</p>
            <button className="text-button" onClick={() => setQuery("")}>
              Ver todas as categorias
              <ArrowRight size={15} />
            </button>
          </div>
        )}
        <div className="explorer-footer">
          <Sparkles size={14} />
          <span>O difícil é escolher. O bom é experimentar.</span>
        </div>
      </div>
    </div>
  );
}
