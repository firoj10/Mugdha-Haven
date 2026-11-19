import { products, type Category, type Product } from "@/data/products";

// Thin service layer. Today it reads the mock array; later, swap each body for
// a `fetch(`${API}/products...`)` call — the signatures stay the same, so no
// page or component needs to change. Kept async on purpose for that reason.

const API_LATENCY = 0; // bump while testing loading states if you like

function delay<T>(value: T): Promise<T> {
  return API_LATENCY
    ? new Promise((r) => setTimeout(() => r(value), API_LATENCY))
    : Promise.resolve(value);
}

export async function getProducts(): Promise<Product[]> {
  // return fetch(`${process.env.API_URL}/products`).then((r) => r.json());
  return delay(products);
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  // return fetch(`${process.env.API_URL}/products/${slug}`).then((r) => r.json());
  return delay(products.find((p) => p.slug === slug));
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return delay(products.filter((p) => p.featured));
}

export async function getCategories(): Promise<Category[]> {
  return delay([...new Set(products.map((p) => p.category))]);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  return delay(
    products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, limit)
  );
}
