export enum ProductAvailability {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export interface ProductReview {
  rating: number;
  comment: string;
  date: Date;
  reviewName: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  originalPrice: number;
  finalPrice: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  availability: ProductAvailability;
  reviews: ProductReview[];
  thumbnail: string;
  images: string[];
  hasDiscount: boolean;
  averageRating: number;
}
