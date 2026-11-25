// Catalog service used by server components. Browser code uses lib/api.ts.
import type { Category, Product } from "@/lib/types";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

async function load<T>(path: string): Promise<T | null> {
  const res = await fetch(`${API_URL}/api${path}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API ${res.status} on ${path}`);
  return res.json();
}

type List<T> = { data: T[] };

export async function getProducts(): Promise<Product[]> {
  return (await load<List<Product>>("/products?limit=100"))!.data;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const res = await load<{ data: Product }>(`/products/${encodeURIComponent(slug)}`);
  return res?.data;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return (await load<List<Product>>("/products?featured=true&limit=100"))!.data;
}

export async function getCategories(): Promise<Category[]> {
  return (await load<List<{ name: string }>>("/categories"))!.data.map((c) => c.name);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const res = await load<List<Product>>(
    `/products/${encodeURIComponent(product.slug)}/related?limit=${limit}`
  );
  return res?.data ?? [];
}