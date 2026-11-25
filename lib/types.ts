// The shapes returned by the backend API.
export type Category = string;

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  compareAt?: number; // original price when on sale
  rating: number; // 0–5
  featured?: boolean;
  inStock?: boolean;
  description_en: string;
  description_bn: string;
  image?: string;
};