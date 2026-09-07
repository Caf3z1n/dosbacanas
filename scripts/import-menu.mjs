// One-time import of the public menu snapshot. Never executes source JavaScript.
import fs from "node:fs/promises";
import path from "node:path";

const source = process.argv[2]
  ? await fs.readFile(path.resolve(process.argv[2]), "utf8")
  : await fetch("https://dosbacanas.com.br/cardapiodigital", {
      signal: AbortSignal.timeout(30000),
    }).then((r) => {
      if (!r.ok) throw new Error(`Could not load menu: ${r.status}`);
      return r.text();
    });
const objects = [...source.matchAll(/\$R\[\d+\]=\{id:"[^"\n]+",[^{}]*\}/g)].map(
  ([match]) => {
    const literal = match.slice(match.indexOf("{"));
    const json = literal.replace(
      /"(?:\\.|[^"\\])*"|([a-zA-Z_]\w*):|!([01])/g,
      (token, key, bool) =>
        key
          ? JSON.stringify(key) + ":"
          : bool !== undefined
            ? bool === "0"
              ? "true"
              : "false"
            : token,
    );
    return JSON.parse(json);
  },
);
const unique = [...new Map(objects.map((o) => [o.id, o])).values()];
const categories = unique
  .filter((o) => o.slug && o.is_active)
  .sort((a, b) => a.sort_order - b.sort_order);
const products = unique
  .filter(
    (o) =>
      o.category_id &&
      o.is_active &&
      categories.some((c) => c.id === o.category_id),
  )
  .sort((a, b) => a.sort_order - b.sort_order);
await fs.mkdir("src/data", { recursive: true });
await fs.mkdir("public/images/products", { recursive: true });
const manifest = new Map();
for (const p of products) {
  if (!p.image_url) continue;
  const filename = new URL(p.image_url).pathname.split("/").at(-1);
  manifest.set(p.image_url, "public/images/products/" + filename);
  p.image = "/images/products/" + filename;
}
manifest.set(
  "https://dosbacanas.com.br/assets/logo-azHSlh79.png",
  "public/images/logo.png",
);
manifest.set(
  "https://dosbacanas.com.br/assets/petiscos-CCLpHkbE.jpg",
  "public/images/petiscos.jpg",
);
if (!categories.length || !products.length)
  throw new Error("Source format changed: no catalog found");
const jobs = [...manifest];
let done = 0;
async function worker() {
  while (jobs.length) {
    const [url, dest] = jobs.shift();
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
      if (!response.ok) throw new Error(String(response.status));
      await fs.writeFile(dest, Buffer.from(await response.arrayBuffer()));
      done++;
    } catch (error) {
      console.error("Asset failed:", dest, error.message);
    }
  }
}
await Promise.all(Array.from({ length: 8 }, worker));
if (done !== manifest.size)
  throw new Error(
    "Some images failed; existing catalog was preserved. Retry the import.",
  );
await fs.writeFile(
  "src/data/menu.json",
  JSON.stringify(
    {
      source: "https://dosbacanas.com.br/cardapiodigital",
      capturedAt: new Date().toISOString().slice(0, 10),
      categories,
      products,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  JSON.stringify({
    categories: categories.length,
    products: products.length,
    images: done,
    expectedImages: manifest.size,
    top: products.filter((p) => p.is_top_pick).map((p) => p.name),
    promos: products.filter((p) => p.is_promo).length,
  }),
);
