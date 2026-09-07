"use client";
import Image from "next/image";
import { ArrowUpRight, Clock3, Star, Utensils } from "lucide-react";
import { type Product, hasOffer, money } from "@/lib/menu";
import { useState } from "react";

export function ProductImage({
  product,
  sizes = "(max-width: 600px) 112px, (max-width: 1000px) 45vw, 300px",
  priority = false,
}: {
  product: Product;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (!product.image || failed)
    return (
      <div className="image-placeholder">
        <Utensils size={28} strokeWidth={1} />
        <span>Foto em breve</span>
      </div>
    );
  return (
    <Image
      src={product.image}
      alt={product.name}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
    />
  );
}
export function Price({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  return (
    <span className={`price ${className}`}>
      {hasOffer(product) && <del>{money(product.price)}</del>}
      <span>
        {money(hasOffer(product) ? product.promo_price! : product.price)}
      </span>
    </span>
  );
}
export function ProductCard({
  product,
  featured = false,
  category,
  onSelect,
}: {
  product: Product;
  featured?: boolean;
  category?: string;
  onSelect: (product: Product) => void;
}) {
  return (
    <article
      className={featured ? "product-card featured-card" : "product-card"}
      data-product-id={product.id}
    >
      <button
        className="product-button"
        onClick={() => onSelect(product)}
        aria-label={`Ver detalhes de ${product.name}`}
      >
        <div className="product-photo">
          <ProductImage
            product={product}
            sizes={featured ? "(max-width: 600px) 270px, 450px" : undefined}
          />
          {featured && (
            <span className="product-tag">
              <Star size={12} fill="currentColor" /> MAIS PEDIDO
            </span>
          )}
          {!featured && product.is_happy_hour && (
            <span className="product-tag">
              <Clock3 size={12} /> HAPPY HOUR
            </span>
          )}
          {!featured && product.is_top_pick && (
            <span className="product-tag">
              <Star size={12} /> MAIS PEDIDO
            </span>
          )}
          <span className="photo-arrow" aria-hidden="true">
            <ArrowUpRight size={19} />
          </span>
        </div>
        <div className="product-copy">
          {featured && (
            <span className="eyebrow product-category">{category}</span>
          )}
          <h3>{product.name}</h3>
          {product.description && <p>{product.description}</p>}
          <div className="product-bottom">
            <Price product={product} />
            <span className="detail-label">
              Ver detalhes <ArrowUpRight size={14} />
            </span>
          </div>
        </div>
      </button>
    </article>
  );
}
