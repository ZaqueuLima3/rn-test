import { Product, ProductAvailability, ProductReview } from '@/src/domain/model/Product';

export interface ProductReviewResponse {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductDimensionsResponse {
  width: number;
  height: number;
  depth: number;
}

export interface ProductMetaResponse {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface ProductResponse {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: ProductDimensionsResponse;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: ProductReviewResponse[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: ProductMetaResponse;
  thumbnail: string;
  images: string[];
}

export interface ProductListResponse {
  products: ProductResponse[];
  total: number;
  skip: number;
  limit: number;
}

export const mapProductListToDomain = (
  res: ProductListResponse
): {
  products: Product[];
  total: number;
  currentPage: number;
  totalPages: number;
} => {
  return {
    products: res.products.map(mapProductToDomain),
    total: res.total,
    currentPage: Math.floor(res.skip / res.limit) + 1,
    totalPages: Math.ceil(res.total / res.limit),
  };
};

export const mapProductToDomain = (res: ProductResponse): Product => {
  let availability: ProductAvailability;

  switch (res.availabilityStatus.toLowerCase()) {
    case 'in stock':
      availability = ProductAvailability.IN_STOCK;
      break;
    case 'low stock':
      availability = ProductAvailability.LOW_STOCK;
      break;
    default:
      availability = ProductAvailability.OUT_OF_STOCK;
  }

  const finalPrice = res.price * (1 - res.discountPercentage / 100);

  return {
    id: res.id,
    title: res.title,
    description: res.description,
    category: res.category,
    originalPrice: res.price,
    finalPrice: parseFloat(finalPrice.toFixed(2)),
    discountPercentage: res.discountPercentage,
    rating: res.rating,
    stock: res.stock,
    tags: res.tags,
    brand: res.brand,
    sku: res.sku,
    availability: availability,
    reviews: res.reviews.map(mapReviewsToDomain),
    thumbnail: res.thumbnail,
    images: res.images,
    hasDiscount: res.discountPercentage > 0,
    averageRating: res.rating,
  };
};

export const mapReviewsToDomain = (res: ProductReviewResponse): ProductReview => {
  return {
    rating: res.rating,
    comment: res.comment,
    date: new Date(res.date),
    reviewName: res.reviewerName,
  };
};
