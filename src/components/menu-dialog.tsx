"use client";
import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Clock3,
  MapPin,
  MessageCircle,
  Star,
  Utensils,
  X,
} from "lucide-react";
import { links, type Category, type Product } from "@/lib/menu";
import { ProductImage, Price } from "./product-card";
import type { MenuAlert } from "@/data/mock-config";
import { CategoryExplorer } from "./category-explorer";

export type Overlay =
  | { kind: "product"; product: Product }
  | { kind: "categories" }
  | { kind: "info" }
  | { kind: "alert"; alert: MenuAlert };

function Dialog({
  title,
  children,
  onClose,
  className = "",
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      previous?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`dialog ${className}`}
      aria-label={title}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dialog-inner">
        <button
          autoFocus
          className="icon-button dialog-close"
          onClick={onClose}
          aria-label="Fechar"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </dialog>
  );
}

export function MenuDialog({
  overlay,
  categories,
  products,
  onClose,
  onCategory,
  onDismissAlert,
  selectedCategory = "all",
}: {
  overlay: Overlay;
  categories: Category[];
  products: Product[];
  onClose: () => void;
  onCategory: (slug: string) => void;
  onDismissAlert: (alert: MenuAlert) => void;
  selectedCategory?: string;
}) {
  if (overlay.kind === "product") {
    const product = overlay.product;
    const category = categories.find((c) => c.id === product.category_id);
    return (
      <Dialog title={product.name} onClose={onClose} className="product-dialog">
        <div className="dialog-photo">
          <ProductImage
            product={product}
            sizes="(max-width: 600px) 100vw, 650px"
            priority
          />
        </div>
        <div className="dialog-content">
          <div className="dialog-labels">
            <span className="eyebrow">{category?.name}</span>
            {product.is_top_pick && (
              <span>
                <Star size={13} /> Mais pedido
              </span>
            )}
            {product.is_happy_hour && (
              <span>
                <Clock3 size={13} /> Happy Hour
              </span>
            )}
          </div>
          <h2>{product.name}</h2>
          {product.description && (
            <p className="full-description">{product.description}</p>
          )}
          <div className="dialog-price-row">
            <div>
              <span className="small-label">
                {product.promo_price ? "Preço especial" : "Valor"}
              </span>
              <Price product={product} />
            </div>
            <span className="table-note">
              <Utensils size={16} /> Bom apetite!
            </span>
          </div>
          {product.is_happy_hour && (
            <p className="happy-note">
              Oferta do Happy Hour. Consulte os horários e a disponibilidade com
              nossa equipe.
            </p>
          )}
        </div>
      </Dialog>
    );
  }
  if (overlay.kind === "categories")
    return (
      <Dialog
        title="Todas as categorias"
        onClose={onClose}
        className="category-dialog"
      >
        <CategoryExplorer
          categories={categories}
          products={products}
          selected={selectedCategory}
          onCategory={onCategory}
        />
      </Dialog>
    );
  if (overlay.kind === "alert")
    return (
      <Dialog title={overlay.alert.title} onClose={onClose}>
        {overlay.alert.image && (
          <div className="dialog-photo">
            <Image src={overlay.alert.image} alt="" fill sizes="650px" />
          </div>
        )}
        <div className="dialog-content">
          <span className="eyebrow">DOS BACANAS INFORMA</span>
          <h2>{overlay.alert.title}</h2>
          <p className="full-description">{overlay.alert.message}</p>
          <div className="dialog-actions">
            {overlay.alert.actionLabel && overlay.alert.actionUrl && (
              <a
                className="button button-gold"
                href={overlay.alert.actionUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {overlay.alert.actionLabel}
                <ArrowUpRight size={17} />
              </a>
            )}
            <button className="button button-outline" onClick={onClose}>
              Continuar navegando
            </button>
            <button
              className="text-button"
              onClick={() => onDismissAlert(overlay.alert)}
            >
              Não mostrar novamente
            </button>
          </div>
        </div>
      </Dialog>
    );
  return (
    <Dialog
      title="Sobre o Dos Bacanas Bar"
      onClose={onClose}
      className="info-dialog"
    >
      <div className="dialog-content">
        <Image
          className="info-logo"
          src="/images/logo.png"
          alt="Dos Bacanas Bar"
          width={200}
          height={76}
        />
        <span className="eyebrow">MAIS QUE UM BAR, UM BOM ENCONTRO</span>
        <h2>Seu lugar é aqui.</h2>
        <p>
          Uma experiência única em cada prato. Receitas autorais assinadas com
          ingredientes selecionados, drinks elaborados por mixologistas e um
          ambiente sofisticado para celebrar cada momento. Mais que um bar — um
          destino gastronômico para os Bacanas.
        </p>
        <a
          className="info-address"
          href={links.map}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MapPin size={22} />
          <span>
            Av. São Francisco, 343
            <br />
            <small>Sorocaba · SP · 18095-450</small>
          </span>
          <ArrowUpRight size={18} />
        </a>
        <div className="dialog-actions">
          <a
            className="button button-gold"
            href={links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={18} /> Falar com a gente
          </a>
          <a
            className="text-button"
            href={links.home}
            target="_blank"
            rel="noopener noreferrer"
          >
            Conheça o Dos Bacanas <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
    </Dialog>
  );
}
