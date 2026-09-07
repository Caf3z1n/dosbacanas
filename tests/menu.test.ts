import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { menu } from "../src/lib/menu-data";
import { hasOffer, isHappyHour, money, selectProducts } from "../src/lib/menu";

test("snapshot preserves 192 active products in all 21 original categories, with valid local media", () => {
  assert.equal(menu.products.length, 192);
  assert.equal(menu.categories.length, 21);
  assert.equal(new Set(menu.products.map((p) => p.id)).size, 192);
  for (const product of menu.products) {
    assert.ok(menu.categories.some((c) => c.id === product.category_id));
    if (product.image)
      assert.ok(existsSync(`public${product.image}`), product.image);
  }
});
test("search tolerates accents, case and surrounding whitespace while combining category filters", () => {
  const found = selectProducts(menu, "porcoes", "all", " SALMAO ");
  assert.equal(found.length, 1);
  assert.equal(found[0].name, "Bolinho de Salmão com Cream Cheese");
  assert.equal(found[0].price, 54.9);
  assert.equal(selectProducts(menu, "vinhos", "all", "salmão").length, 0);
});
test("top picks and Happy Hour retain original prices and distinct product identities", () => {
  assert.equal(selectProducts(menu, "all", "top", "").length, 2);
  const happy = selectProducts(menu, "happy-hour", "all", "");
  assert.equal(happy.length, 7);
  const lime = happy.find((p) => p.name === "Caipirinha de Limão")!;
  assert.equal(lime.price, 26.9);
  assert.equal(lime.promo_price, 9.9);
  assert.equal(hasOffer(lime), true);
  assert.equal(hasOffer({ ...lime, promo_price: 0 }), false);
  assert.equal(
    selectProducts(menu, "caipirinhas", "all", "Caipirinha de Limão")[0].price,
    22.9,
  );
  assert.equal(money(9.9).replace(/\s/g, " "), "R$ 9,90");
});
test("Happy Hour respects São Paulo timezone and exclusive closing time", () => {
  const active = (iso: string) => isHappyHour(menu.schedule, new Date(iso));
  assert.equal(active("2026-09-07T19:59:59Z"), false);
  assert.equal(active("2026-09-07T20:00:00Z"), true);
  assert.equal(active("2026-09-07T22:59:59Z"), true);
  assert.equal(active("2026-09-07T23:00:00Z"), false);
  assert.equal(active("2026-09-12T20:00:00Z"), false);
  assert.equal(
    isHappyHour(
      [
        {
          days: [],
          date: "2026-09-12",
          start: "17:00",
          end: "20:00",
          active: true,
        },
      ],
      new Date("2026-09-12T20:00:00Z"),
    ),
    true,
  );
});
