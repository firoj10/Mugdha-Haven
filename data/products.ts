// Mock catalog — placeholder data mirroring the reference imported-cosmetics
// shop. Prices in BDT (৳). When the Express backend lands, this file is the
// only thing that goes away: the service layer in lib/products.ts keeps the
// same shape, so pages and components never change.

export type Category =
  | "Serum"
  | "Cream"
  | "Cleanser"
  | "Essence"
  | "Baby Care"
  | "Sunscreen"
  | "Eye Care";

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
  description_en: string;
  description_bn: string;
  image?: string; // backend CDN url later; undefined -> styled placeholder
};

export const products: Product[] = [
  {
    id: "1",
    slug: "cosrx-snail-96-mucin-essence",
    image: "/images/products/1.jpg",
    name: "Advanced Snail 96 Mucin Power Essence 100ml",
    brand: "COSRX",
    category: "Essence",
    price: 1550,
    rating: 4.8,
    featured: true,
    description_en:
      "A lightweight essence with 96.3% snail secretion filtrate that deeply hydrates, plumps and repairs dull, tired skin.",
    description_bn:
      "৯৬.৩% স্নেইল সিক্রেশন ফিল্ট্রেট সমৃদ্ধ হালকা এসেন্স, যা ত্বককে গভীরভাবে আর্দ্র রাখে, উজ্জ্বল করে এবং ক্লান্ত ত্বক মেরামত করে।",
  },
  {
    id: "2",
    slug: "cosrx-snail-92-all-in-one-cream",
    image: "/images/products/2.jpg",
    name: "Advanced Snail 92 All In One Cream 100ml",
    brand: "COSRX",
    category: "Cream",
    price: 1650,
    rating: 4.7,
    featured: true,
    description_en:
      "A rich daily moisturiser with 92% snail mucin that locks in moisture and restores a smooth, bouncy texture.",
    description_bn:
      "৯২% স্নেইল মিউসিন সমৃদ্ধ ঘন ময়েশ্চারাইজার, যা আর্দ্রতা ধরে রাখে এবং ত্বকে মসৃণ ও কোমল ভাব ফিরিয়ে আনে।",
  },
  {
    id: "3",
    slug: "skin1004-centella-tea-trica-spot-cream",
    image: "/images/products/3.jpg",
    name: "Madagascar Centella Tea-Trica Spot Cream 20ml",
    brand: "Skin1004",
    category: "Cream",
    price: 1300,
    rating: 4.6,
    description_en:
      "A targeted spot cream with Centella and tea tree that calms blemishes and soothes irritated, sensitive skin.",
    description_bn:
      "সেন্টেলা ও টি-ট্রি সমৃদ্ধ স্পট ক্রিম, যা ব্রণ শান্ত করে এবং সংবেদনশীল ত্বকের জ্বালাভাব কমায়।",
  },
  {
    id: "4",
    slug: "anua-niacinamide-10-txa-4-serum",
    image: "/images/products/4.jpg",
    name: "Niacinamide 10 TXA 4 Serum 10ml (mini)",
    brand: "Anua",
    category: "Serum",
    price: 1000,
    rating: 4.7,
    featured: true,
    description_en:
      "A brightening serum pairing 10% niacinamide with tranexamic acid to fade dark spots and even out skin tone.",
    description_bn:
      "১০% নিয়াসিনামাইড ও ট্রানেক্সামিক অ্যাসিড সমৃদ্ধ সেরাম, যা কালো দাগ হালকা করে এবং ত্বকের রঙ সমান করে।",
  },
  {
    id: "5",
    slug: "anua-azelaic-acid-10-serum",
    image: "/images/products/5.jpg",
    name: "Azelaic Acid 10 Hyaluron Redness Soothing Serum 10ml (mini)",
    brand: "Anua",
    category: "Serum",
    price: 1000,
    rating: 4.5,
    description_en:
      "Azelaic acid and hyaluronic acid work together to reduce redness, refine texture and comfort reactive skin.",
    description_bn:
      "অ্যাজেলেইক অ্যাসিড ও হায়ালুরনিক অ্যাসিড একসাথে লালচে ভাব কমায়, ত্বকের গঠন উন্নত করে এবং সংবেদনশীল ত্বকে আরাম দেয়।",
  },
  {
    id: "6",
    slug: "centellian24-madeca-cream-time-reverse",
    image: "/images/products/6.jpg",
    name: "Madeca Cream Time Reverse 50ml",
    brand: "Centellian24",
    category: "Cream",
    price: 1400,
    rating: 4.6,
    description_en:
      "An anti-ageing Centella cream that firms, smooths fine lines and supports the skin's natural barrier.",
    description_bn:
      "সেন্টেলা সমৃদ্ধ অ্যান্টি-এজিং ক্রিম, যা ত্বক টানটান করে, সূক্ষ্ম রেখা কমায় এবং ত্বকের প্রাকৃতিক ব্যারিয়ার শক্তিশালী করে।",
  },
  {
    id: "7",
    slug: "cosrx-low-ph-good-morning-cleanser",
    image: "/images/products/7.jpg",
    name: "Low pH Good Morning Gel Cleanser 150ml",
    brand: "COSRX",
    category: "Cleanser",
    price: 1100,
    compareAt: 1300,
    rating: 4.8,
    featured: true,
    description_en:
      "A gentle low-pH gel cleanser that removes impurities without stripping, leaving skin fresh and balanced.",
    description_bn:
      "লো-পিএইচ জেল ক্লিনজার, যা ত্বকের আর্দ্রতা না কেড়ে ময়লা পরিষ্কার করে এবং ত্বক রাখে সতেজ ও ভারসাম্যপূর্ণ।",
  },
  {
    id: "8",
    slug: "cosrx-salicylic-acid-cleanser",
    image: "/images/products/8.jpg",
    name: "Salicylic Acid Daily Gentle Cleanser 150ml",
    brand: "COSRX",
    category: "Cleanser",
    price: 1200,
    rating: 4.6,
    description_en:
      "A daily BHA cleanser that clears pores, controls excess oil and helps prevent breakouts.",
    description_bn:
      "প্রতিদিনের বিএইচএ ক্লিনজার, যা লোমকূপ পরিষ্কার করে, অতিরিক্ত তেল নিয়ন্ত্রণ করে এবং ব্রণ প্রতিরোধে সাহায্য করে।",
  },
  {
    id: "9",
    slug: "aplb-glutathione-niacinamide-body-lotion",
    image: "/images/products/9.jpg",
    name: "Glutathione Niacinamide Body Lotion 300ml",
    brand: "APLB",
    category: "Baby Care",
    price: 1550,
    rating: 4.5,
    description_en:
      "A silky body lotion with glutathione and niacinamide for soft, hydrated and visibly brighter skin.",
    description_bn:
      "গ্লুটাথায়ন ও নিয়াসিনামাইড সমৃদ্ধ কোমল বডি লোশন, যা ত্বক রাখে নরম, আর্দ্র ও উজ্জ্বল।",
  },
  {
    id: "10",
    slug: "nella-white-snow-underarm-cream",
    image: "/images/products/10.jpg",
    name: "White Snow Fermented Underarm Cream 50ml",
    brand: "Nella",
    category: "Cream",
    price: 1200,
    compareAt: 1400,
    rating: 4.3,
    description_en:
      "A fermented brightening cream formulated to smooth and even out delicate underarm skin.",
    description_bn:
      "ফার্মেন্টেড ব্রাইটেনিং ক্রিম, যা আন্ডারআর্মের কোমল ত্বক মসৃণ ও উজ্জ্বল করতে সাহায্য করে।",
  },
  {
    id: "11",
    slug: "k-secret-glow-serum-niacinamide-yuja",
    image: "/images/products/11.png",
    name: "Seoul 1988 Glow Serum Niacinamide 15% + Yuja 30ml",
    brand: "K-Secret",
    category: "Serum",
    price: 1700,
    rating: 4.6,
    featured: true,
    description_en:
      "A glow-boosting serum with 15% niacinamide and yuja extract that revives radiance and refines pores.",
    description_bn:
      "১৫% নিয়াসিনামাইড ও ইউজা নির্যাস সমৃদ্ধ সেরাম, যা ত্বকে উজ্জ্বলতা ফিরিয়ে আনে এবং লোমকূপ সূক্ষ্ম করে।",
  },
  {
    id: "12",
    slug: "celimax-pore-dark-spot-brightening-cream",
    image: "/images/products/12.jpg",
    name: "Pore + Dark Spot Brightening Cream 35ml",
    brand: "Celimax",
    category: "Cream",
    price: 1500,
    rating: 4.5,
    description_en:
      "A lightweight brightening cream that visibly reduces dark spots and tightens the look of pores.",
    description_bn:
      "হালকা ব্রাইটেনিং ক্রিম, যা কালো দাগ দৃশ্যমানভাবে কমায় এবং লোমকূপ টানটান দেখায়।",
  },
  {
    id: "13",
    slug: "arencia-vitamin-c-booster-shot",
    image: "/images/products/13.jpg",
    name: "Vitamin C Booster Shot 30ml",
    brand: "Arencia",
    category: "Serum",
    price: 1550,
    rating: 4.4,
    description_en:
      "A potent vitamin C booster that brightens dull skin and supports a healthy, radiant glow.",
    description_bn:
      "শক্তিশালী ভিটামিন সি বুস্টার, যা নিস্তেজ ত্বক উজ্জ্বল করে এবং স্বাস্থ্যোজ্জ্বল আভা ধরে রাখে।",
  },
  {
    id: "14",
    slug: "medicube-txa-niacinamide-15-serum",
    image: "/images/products/14.jpg",
    name: "TXA Niacinamide 15% Serum 30ml",
    brand: "Medicube",
    category: "Serum",
    price: 1900,
    rating: 4.7,
    description_en:
      "A high-strength serum targeting stubborn pigmentation for a clearer, more uniform complexion.",
    description_bn:
      "উচ্চ-ক্ষমতার সেরাম, যা জেদি পিগমেন্টেশন কমিয়ে ত্বককে আরও পরিষ্কার ও সমান করে তোলে।",
  },
  {
    id: "15",
    slug: "wskin-am-boosting-serum-anti-melasma",
    image: "/images/products/15.jpg",
    name: "A.M Boosting Serum (Anti-Melasma) 30ml",
    brand: "W.Skin Laboratory",
    category: "Serum",
    price: 1700,
    rating: 4.5,
    description_en:
      "An anti-melasma booster serum that fades discolouration and promotes a brighter, clearer tone.",
    description_bn:
      "অ্যান্টি-মেলাজমা বুস্টার সেরাম, যা দাগ হালকা করে এবং ত্বক আরও উজ্জ্বল ও পরিষ্কার করে।",
  },
  {
    id: "16",
    slug: "wskin-am-cream-anti-melasma",
    image: "/images/products/16.jpg",
    name: "A.M Cream Anti-Melasma 50ml",
    brand: "W.Skin Laboratory",
    category: "Cream",
    price: 1350,
    rating: 4.4,
    description_en:
      "A nourishing anti-melasma cream that pairs with the booster serum to even out and protect skin.",
    description_bn:
      "পুষ্টিকর অ্যান্টি-মেলাজমা ক্রিম, যা বুস্টার সেরামের সাথে ব্যবহারে ত্বক সমান করে ও সুরক্ষা দেয়।",
  },
  {
    id: "17",
    slug: "aveeno-baby-daily-care-lotion",
    image: "/images/products/17.jpg",
    name: "Baby Daily Care Moisturising Lotion",
    brand: "Aveeno",
    category: "Baby Care",
    price: 1280,
    rating: 4.9,
    featured: true,
    description_en:
      "A gentle, fragrance-free oat lotion that keeps delicate baby skin soft and moisturised all day.",
    description_bn:
      "কোমল, সুগন্ধিবিহীন ওট লোশন, যা শিশুর নাজুক ত্বক সারাদিন নরম ও আর্দ্র রাখে।",
  },
  {
    id: "18",
    slug: "wskin-triple-care-sun-cream-spf50",
    image: "/images/products/18.jpg",
    name: "Triple Care Sun Cream SPF50+ PA++++ 60g",
    brand: "W.Skin Laboratory",
    category: "Sunscreen",
    price: 950,
    rating: 4.6,
    description_en:
      "A lightweight daily sunscreen with SPF50+ PA++++ that shields skin without a heavy white cast.",
    description_bn:
      "এসপিএফ৫০+ পিএ++++ সমৃদ্ধ হালকা সানস্ক্রিন, যা সাদা ছাপ ছাড়াই ত্বক সুরক্ষা দেয়।",
  },
  {
    id: "19",
    slug: "dr-althea-345-relief-cream",
    image: "/images/products/19.jpg",
    name: "345 Relief Cream 50ml",
    brand: "Dr. Althea",
    category: "Cream",
    price: 2050,
    rating: 4.8,
    description_en:
      "A deeply nourishing relief cream that repairs the barrier and comforts dry, stressed skin.",
    description_bn:
      "গভীরভাবে পুষ্টিদায়ক রিলিফ ক্রিম, যা ত্বকের ব্যারিয়ার মেরামত করে এবং শুষ্ক, ক্লান্ত ত্বকে আরাম দেয়।",
  },
  {
    id: "20",
    slug: "celimax-vita-a-retinal-shot-booster",
    image: "/images/products/20.jpg",
    name: "The Vita A Retinal Shot Tightening Booster 15ml",
    brand: "Celimax",
    category: "Serum",
    price: 1600,
    rating: 4.5,
    description_en:
      "A retinal booster that smooths fine lines and firms skin for a visibly tightened, youthful look.",
    description_bn:
      "রেটিনাল বুস্টার, যা সূক্ষ্ম রেখা মসৃণ করে এবং ত্বক টানটান করে তারুণ্যদীপ্ত চেহারা দেয়।",
  },
  {
    id: "21",
    slug: "mary-may-tranexamic-glutathione-eye-cream",
    image: "/images/products/21.jpg",
    name: "Tranexamic Acid + Glutathione Eye Cream",
    brand: "Mary & May",
    category: "Eye Care",
    price: 500,
    compareAt: 750,
    rating: 4.4,
    description_en:
      "A brightening eye cream that targets dark circles and smooths the delicate under-eye area.",
    description_bn:
      "ব্রাইটেনিং আই ক্রিম, যা চোখের নিচের কালো দাগ কমায় এবং নাজুক ত্বক মসৃণ করে।",
  },
];
