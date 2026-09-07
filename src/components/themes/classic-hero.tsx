"use client";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";
import type { Product } from "@/lib/menu";
import { Price } from "../product-card";
export function ClassicHero({
  heroProduct,
  onSelect,
}: {
  heroProduct?: Product;
  onSelect: (product: Product) => void;
}) {
  return (
    <section className="hero">
      <div className="hero-image">
        <Image
          src="/images/hero.webp"
          alt="Tábua de picanha, batata e molho do Dos Bacanas"
          fill
          sizes="(max-width: 600px) 100vw, 75vw"
          priority
        />
      </div>
      <div className="hero-shade" />
      <div className="shell hero-inner">
        <div className="hero-copy">
          <span className="eyebrow hero-eyebrow">
            <span /> BAR, GASTRONOMIA & BONS ENCONTROS
          </span>
          <h1>
            Bons encontros.
            <br />
            Sabores bacanas.
          </h1>
          <p>
            Porções para dividir, drinks para brindar.
            <br />
            Escolha seu favorito e aproveite o momento.
          </p>
          <a className="button button-gold" href="#cardapio">
            Explorar cardápio <ArrowDown size={17} />
          </a>
          <span className="hero-location">
            <MapPin size={13} /> Sorocaba, SP
          </span>
        </div>
        {heroProduct && (
          <button
            className="hero-feature"
            onClick={() => onSelect(heroProduct)}
            aria-label="Conhecer Tábua de Picanha"
          >
            <span className="hero-feature-label">PRA COMPARTILHAR</span>
            <span className="hero-feature-name">
              Tábua de Picanha <ArrowUpRight size={19} />
            </span>
            <Price product={heroProduct} />
          </button>
        )}
      </div>
    </section>
  );
}
