"use client";
import Image from "next/image";
import { GoogleIcon, WhatsAppIcon } from "./brand-icons";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Beer,
  Check,
  Clock3,
  LayoutGrid,
  RefreshCw,
  Search,
  Star,
  Tag,
  Utensils,
  X,
} from "lucide-react";
import {
  type MenuData,
  type Product,
  isHappyHour,
  links,
  selectProducts,
} from "@/lib/menu";
import type { MenuAlert } from "@/data/mock-config";
import { ProductCard } from "./product-card";
import { MenuDialog, type Overlay } from "./menu-dialog";
import { ThemeFrame, ThemeControls } from "./themes/theme-frame";
import { ThemeHero } from "./themes/theme-heroes";
import type { ThemeId } from "@/lib/themes";
import { CategoryIcon } from "./category-visual";

function subscribeUrl(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}
function subscribeClock(callback: () => void) {
  const timer = setInterval(callback, 30000);
  window.addEventListener("focus", callback);
  return () => {
    clearInterval(timer);
    window.removeEventListener("focus", callback);
  };
}

export function MenuExperience({
  initialMenu,
  variant = 1,
}: {
  initialMenu: MenuData;
  variant?: ThemeId;
}) {
  const [data, setData] = useState(initialMenu);
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [notice, setNotice] = useState<{
    text: string;
    error?: boolean;
  } | null>(null);
  const nav = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const queryString = useSyncExternalStore(
    subscribeUrl,
    () => window.location.search,
    () => "",
  );
  const tick = useSyncExternalStore(
    subscribeClock,
    () => Math.floor(Date.now() / 30000),
    () => 0,
  );
  const params = useMemo(() => new URLSearchParams(queryString), [queryString]);
  const requestedCategory = params.get("categoria") ?? "all";
  const category = data.categories.some((c) => c.slug === requestedCategory)
    ? requestedCategory
    : "all";
  const requestedFilter = params.get("filtro") ?? "all";
  const filter = ["all", "top", "happy", "promo"].includes(requestedFilter)
    ? requestedFilter
    : "all";
  const query = params.get("busca") ?? "";
  const happy = tick > 0 && isHappyHour(data.schedule, new Date(tick * 30000));
  const topProducts = data.products.filter((p) => p.is_top_pick);
  const hasPromos = data.products.some((p) => p.is_promo);
  const products = useMemo(
    () => selectProducts(data, category, filter, query),
    [data, category, filter, query],
  );
  const isDefault = category === "all" && filter === "all" && !query.trim();
  const chosenCategory = data.categories.find((c) => c.slug === category);

  function updateParams(values: Record<string, string>, replace = false) {
    const url = new URL(window.location.href);
    Object.entries(values).forEach(([key, value]) => {
      if (!value || value === "all") url.searchParams.delete(key);
      else url.searchParams.set(key, value);
    });
    window.history[replace ? "replaceState" : "pushState"]({}, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }
  function scrollToMenu() {
    requestAnimationFrame(() =>
      menuRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      }),
    );
  }
  function chooseCategory(slug: string) {
    setOverlay(null);
    updateParams({ categoria: slug, filtro: "all", busca: "" });
    scrollToMenu();
  }
  function chooseFilter(next: string) {
    updateParams({ filtro: next });
    scrollToMenu();
  }
  function openProduct(product: Product) {
    setOverlay({ kind: "product", product });
  }
  function focusSearch() {
    scrollToMenu();
    search.current?.focus({ preventScroll: true });
  }
  async function refresh() {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const response = await fetch("/api/menu", {
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) throw new Error("fetch");
      const fresh: MenuData = await response.json();
      if (!Array.isArray(fresh.products) || !Array.isArray(fresh.categories))
        throw new Error("data");
      setData(fresh);
      setNotice({ text: "Cardápio atualizado. Pode escolher à vontade!" });
    } catch {
      setNotice({
        text: "Não foi possível atualizar. Tente novamente; seu cardápio continua disponível.",
        error: true,
      });
    } finally {
      setRefreshing(false);
    }
  }
  useEffect(() => {
    const container = nav.current;
    const button = container?.querySelector<HTMLElement>(
      `[data-category="${category}"]`,
    );
    if (!container || !button) return;
    container.scrollTo({
      left: Math.max(
        0,
        button.offsetLeft - (container.clientWidth - button.offsetWidth) / 2,
      ),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }, [category]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 5000);
    return () => clearTimeout(timer);
  }, [notice]);
  useEffect(() => {
    const timer = setTimeout(() => {
      let dismissed: string[] = [];
      try {
        dismissed = JSON.parse(
          localStorage.getItem("bacanas-dismissed-alerts") ?? "[]",
        );
        if (!Array.isArray(dismissed)) dismissed = [];
      } catch {
        /* Storage is optional. */
      }
      const alert = data.alerts.find(
        (a) =>
          new Date(a.expiresAt).getTime() > Date.now() &&
          !dismissed.includes(`${a.id}:${a.updatedAt}`),
      );
      if (alert) setOverlay((current) => current ?? { kind: "alert", alert });
    }, 500);
    return () => clearTimeout(timer);
  }, [data.alerts]);
  function dismissAlert(alert: MenuAlert) {
    try {
      const saved = JSON.parse(
        localStorage.getItem("bacanas-dismissed-alerts") ?? "[]",
      );
      localStorage.setItem(
        "bacanas-dismissed-alerts",
        JSON.stringify([
          ...(Array.isArray(saved) ? saved : []),
          `${alert.id}:${alert.updatedAt}`,
        ]),
      );
    } catch {
      /* Browsing remains available without storage. */
    }
    setOverlay(null);
  }

  return (
    <ThemeFrame variant={variant}>
      <a className="skip-link" href="#cardapio">
        Ir para o cardápio
      </a>
      <header className="site-header">
        <div className="shell header-inner">
          <a
            href={links.home}
            className="brand"
            aria-label="Dos Bacanas Bar — site oficial"
          >
            <Image
              src="/images/logo.png"
              alt="Dos Bacanas Bar"
              width={184}
              height={68}
              priority
            />
          </a>
          <nav className="header-nav" aria-label="Navegação principal">
            <a href="#cardapio" className="header-link active">
              O cardápio
            </a>
            <button
              className="header-link"
              onClick={() => setOverlay({ kind: "info" })}
            >
              A casa <ArrowUpRight size={13} />
            </button>
          </nav>
          <div className="header-actions">
            <ThemeControls />
            <button
              className="icon-button mobile-search"
              onClick={focusSearch}
              aria-label="Buscar no cardápio"
            >
              <Search size={20} />
            </button>
            <a
              className="button button-outline contact-button"
              href={links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar conosco via WhatsApp"
            >
              <WhatsAppIcon size={17} />
              <span>Fale com a gente</span>
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </header>

      <main>
        <ThemeHero
          variant={variant}
          products={data.products}
          onSelect={openProduct}
          onCategory={chooseCategory}
        />

        <div className="category-bar">
          <div className="shell category-bar-inner">
            <div
              className="category-scroll"
              ref={nav}
              role="navigation"
              aria-label="Categorias do cardápio"
            >
              <button
                data-category="all"
                className={`category-tab ${category === "all" ? "selected" : ""}`}
                aria-pressed={category === "all"}
                onClick={() => chooseCategory("all")}
              >
                <CategoryIcon slug="all" size={17} /> Tudo
              </button>
              {data.categories.map((c) => (
                <button
                  key={c.id}
                  data-category={c.slug}
                  className={`category-tab ${category === c.slug ? "selected" : ""}`}
                  aria-pressed={category === c.slug}
                  onClick={() => chooseCategory(c.slug)}
                >
                  <CategoryIcon slug={c.slug} />
                  {c.name}
                </button>
              ))}
            </div>
            <button
              className="categories-toggle"
              onClick={() => setOverlay({ kind: "categories" })}
              aria-label="Ver todas as categorias"
            >
              <LayoutGrid size={19} />
              <span>Categorias</span>
            </button>
          </div>
        </div>

        {isDefault && (
          <section
            className="shell highlights"
            aria-labelledby="highlights-title"
          >
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  <Star size={12} /> OS QUERIDINHOS DA CASA
                </span>
                <h2 id="highlights-title">Quem prova, pede de novo.</h2>
              </div>
              <button
                className="text-button gold-text"
                onClick={() => chooseFilter("top")}
              >
                Ver mais pedidos <ArrowRight size={17} />
              </button>
            </div>
            <div className="featured-grid">
              {topProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  featured
                  category={
                    data.categories.find((c) => c.id === product.category_id)
                      ?.name
                  }
                  onSelect={openProduct}
                />
              ))}
              <button
                className="happy-card"
                onClick={() => chooseCategory("happy-hour")}
              >
                <div className="happy-card-top">
                  <span className="eyebrow">O MELHOR BRINDE DO DIA</span>
                  <ArrowUpRight size={22} />
                </div>
                <div className="happy-card-middle">
                  <span className="happy-script">É hora de</span>
                  <span className="happy-title">
                    Happy
                    <br />
                    Hour.
                  </span>
                  <Beer className="happy-beer" size={90} strokeWidth={0.7} />
                </div>
                <div className="happy-card-bottom">
                  <span>
                    <Clock3 size={14} /> Seg a sex, das 17h às 20h
                  </span>
                  <span className="happy-cta">
                    Explore as ofertas <ArrowRight size={17} />
                  </span>
                </div>
              </button>
            </div>
          </section>
        )}

        <section
          id="cardapio"
          ref={menuRef}
          className="shell catalog"
          aria-labelledby="catalog-title"
        >
          {variant === 4 && (
            <aside className="editorial-index" aria-label="Índice do cardápio">
              <span className="eyebrow">À SUA ESCOLHA</span>
              <h2>A carta.</h2>
              <button
                aria-pressed={category === "all"}
                onClick={() => chooseCategory("all")}
              >
                Tudo<span>192</span>
              </button>
              {data.categories.map((c, i) => (
                <button
                  key={c.id}
                  aria-pressed={category === c.slug}
                  onClick={() => chooseCategory(c.slug)}
                >
                  <span>{c.name}</span>
                  <small>{String(i + 1).padStart(2, "0")}</small>
                </button>
              ))}
            </aside>
          )}
          <div className="catalog-content">
            <div className="catalog-top">
              <div>
                <span className="eyebrow">ESCOLHA, EXPLORE, APROVEITE</span>
                <h2 id="catalog-title">
                  {query.trim()
                    ? "Encontre seu próximo favorito."
                    : (chosenCategory?.name ??
                      (filter === "top"
                        ? "Mais pedidos"
                        : filter === "happy"
                          ? "Happy Hour"
                          : filter === "promo"
                            ? "Promoções"
                            : "Nosso cardápio"))}
                </h2>
              </div>
              <div className="search-box">
                <Search size={18} />
                <input
                  ref={search}
                  aria-label="Buscar produto no cardápio"
                  placeholder="O que você está com vontade?"
                  value={query}
                  onChange={(e) =>
                    updateParams({ busca: e.target.value }, true)
                  }
                  type="search"
                />
                {query && (
                  <button
                    className="icon-button"
                    onClick={() => updateParams({ busca: "" }, true)}
                    aria-label="Limpar busca"
                  >
                    <X size={16} />
                  </button>
                )}
                <span className="search-hint">Buscar</span>
              </div>
            </div>
            <div className="catalog-toolbar">
              <div className="filter-tabs" aria-label="Filtrar produtos">
                <button
                  className={filter === "all" ? "selected" : ""}
                  onClick={() => chooseFilter("all")}
                  aria-pressed={filter === "all"}
                >
                  Tudo
                </button>
                <button
                  className={filter === "top" ? "selected" : ""}
                  onClick={() => chooseFilter("top")}
                  aria-pressed={filter === "top"}
                >
                  <Star size={14} /> Mais pedidos
                </button>
                {happy && (
                  <button
                    className={filter === "happy" ? "selected" : ""}
                    onClick={() => chooseFilter("happy")}
                    aria-pressed={filter === "happy"}
                  >
                    <Clock3 size={14} /> Happy Hour
                  </button>
                )}
                {hasPromos && (
                  <button
                    className={filter === "promo" ? "selected" : ""}
                    onClick={() => chooseFilter("promo")}
                    aria-pressed={filter === "promo"}
                  >
                    <Tag size={14} /> Promoções
                  </button>
                )}
              </div>
              <div className="catalog-meta">
                <span aria-live="polite">
                  {products.length} {products.length === 1 ? "opção" : "opções"}
                </span>
                <span className="meta-divider" />
                <button
                  className="refresh-button"
                  disabled={refreshing}
                  onClick={refresh}
                  aria-label="Atualizar cardápio"
                >
                  <RefreshCw size={14} className={refreshing ? "spin" : ""} />
                  <span>
                    {refreshing ? "Atualizando…" : "Atualizar cardápio"}
                  </span>
                </button>
              </div>
            </div>

            {category === "happy-hour" && (
              <div className="happy-banner">
                <Clock3 size={22} />
                <div>
                  <strong>
                    {happy
                      ? "O Happy Hour está acontecendo!"
                      : "A boa hora tem lugar certo."}
                  </strong>
                  <span>
                    Segunda a sexta, das 17h às 20h. Confira as ofertas abaixo.
                  </span>
                </div>
                <Beer size={27} />
              </div>
            )}
            {data.categories.map((c) => {
              const items = products.filter((p) => p.category_id === c.id);
              if (!items.length) return null;
              return (
                <section
                  key={c.id}
                  className="menu-section"
                  aria-labelledby={`title-${c.slug}`}
                >
                  <div className="menu-section-heading">
                    <div className="menu-section-title">
                      <CategoryIcon slug={c.slug} size={20} />
                      <h2 id={`title-${c.slug}`}>{c.name}</h2>
                      <span>{items.length.toString().padStart(2, "0")}</span>
                    </div>
                    {c.description && <p>{c.description}</p>}
                  </div>
                  <div className="product-grid">
                    {items.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onSelect={openProduct}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
            {!products.length && (
              <div className="empty-state">
                <Search size={34} strokeWidth={1} />
                <h3>Nenhum sabor por aqui.</h3>
                <p>
                  {query
                    ? `Não encontramos “${query}” com estes filtros.`
                    : "Não há produtos para esta combinação de filtros."}
                </p>
                <button
                  className="button button-gold"
                  onClick={() => {
                    updateParams({
                      categoria: "all",
                      filtro: "all",
                      busca: "",
                    });
                  }}
                >
                  Ver o cardápio completo <ArrowRight size={16} />
                </button>
              </div>
            )}
            {!!products.length && (
              <div className="end-note">
                <span />
                <Utensils size={15} />
                <p>Escolheu? Nossa equipe está pronta para te atender.</p>
                <span />
              </div>
            )}
          </div>
        </section>

        <section className="review-section">
          <div className="shell review-inner">
            <div className="review-stars" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={21} strokeWidth={1.3} />
              ))}
            </div>
            <span className="eyebrow">BOM MESMO É TER VOCÊ AQUI</span>
            <h2>Foi bacana pra você?</h2>
            <p>
              Conta como foi a comida, o drink e o atendimento.
              <br />
              Sua avaliação ajuda a nossa história a continuar.
            </p>
            <a
              className="button button-outline"
              href={links.review}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GoogleIcon />
              Avaliar no Google
              <ArrowUpRight size={16} />
            </a>
          </div>
        </section>
      </main>
      <footer className="site-footer shell">
        <Image
          src="/images/logo.png"
          alt="Dos Bacanas Bar"
          width={150}
          height={55}
        />
        <span>Comida boa. Copo cheio. Gente bacana.</span>
        <button
          className="text-button"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                .matches
                ? "instant"
                : "smooth",
            })
          }
        >
          Voltar ao topo <ArrowUp size={15} />
        </button>
      </footer>
      <nav className="mobile-bottom" aria-label="Atalhos">
        <a className="selected" href="#cardapio">
          <Utensils size={20} />
          <span>Cardápio</span>
        </a>
        <button onClick={() => setOverlay({ kind: "categories" })}>
          <LayoutGrid size={20} />
          <span>Categorias</span>
        </button>
        <button onClick={focusSearch}>
          <Search size={20} />
          <span>Buscar</span>
        </button>
        <a href={links.whatsapp} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon size={20} />
          <span>Fale conosco</span>
        </a>
      </nav>
      {overlay && (
        <MenuDialog
          overlay={overlay}
          selectedCategory={category}
          categories={data.categories}
          products={data.products}
          onClose={() => setOverlay(null)}
          onCategory={chooseCategory}
          onDismissAlert={dismissAlert}
        />
      )}
      {notice && (
        <div
          className={`toast ${notice.error ? "toast-error" : ""}`}
          role="status"
        >
          {notice.error ? <RefreshCw size={18} /> : <Check size={18} />}
          <span>{notice.text}</span>
          <button
            className="icon-button"
            onClick={() => setNotice(null)}
            aria-label="Fechar mensagem"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </ThemeFrame>
  );
}
