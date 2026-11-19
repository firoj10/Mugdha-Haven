import { Hero } from "@/components/hero";
import { CategoryShowcase } from "@/components/category-showcase";
import { FeaturedProducts } from "@/components/featured-products";
import { Benefits } from "@/components/benefits";
import { Guides } from "@/components/guides";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Benefits />
      <CategoryShowcase />
      <FeaturedProducts variant="favorite" />
      <FeaturedProducts variant="best" />
      <Guides />
    </>
  );
}
