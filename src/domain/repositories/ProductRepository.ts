import { Category } from '@/src/domain/model/Category';
import { Product } from '@/src/domain/model/Product';

export interface IProductRepository {
  getProducts(
    page?: number,
    limit?: number,
    category?: string
  ): Promise<{
    products: Product[];
    total: number;
    currentPage: number;
    totalPages: number;
  }>;

  getCategories(): Promise<Category[]>;
}
