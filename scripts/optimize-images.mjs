import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve("public/images");
const data = JSON.parse(await fs.readFile("src/data/menu.json", "utf8"));
const images = [...new Set(data.products.map((p) => p.image).filter(Boolean))];
const converted = new Map();
let before = 0,
  after = 0;
for (const image of images) {
  if (image.endsWith(".webp")) continue;
  const source = path.resolve("public" + image);
  if (!source.startsWith(root + path.sep))
    throw new Error("Image outside workspace media directory");
  const output = source.replace(/\.[^.]+$/, ".webp");
  before += (await fs.stat(source)).size;
  await sharp(source)
    .rotate()
    .resize({
      width: 1400,
      height: 1400,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 84 })
    .toFile(output);
  const info = await sharp(output).metadata();
  if (!info.width || !info.height) throw new Error("Invalid optimized image");
  after += (await fs.stat(output)).size;
  converted.set(image, image.replace(/\.[^.]+$/, ".webp"));
}
for (const product of data.products)
  if (converted.has(product.image))
    product.image = converted.get(product.image);
await fs.writeFile("src/data/menu.json", JSON.stringify(data, null, 2) + "\n");
// Remove only successfully converted source files created by this project's import.
for (const source of converted.keys())
  await fs.unlink(path.resolve("public" + source));
await sharp("public/images/petiscos.jpg")
  .resize({ width: 1600, withoutEnlargement: true })
  .webp({ quality: 86 })
  .toFile("public/images/hero.webp");
console.log(
  JSON.stringify({
    images: converted.size,
    beforeMB: Math.round(before / 1e6),
    afterMB: Math.round(after / 1e6),
  }),
);
