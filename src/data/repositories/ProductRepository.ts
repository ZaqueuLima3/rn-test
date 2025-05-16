import { IProductApi } from '@/src/data/remote/api/IProductApi';
import {
  mapProductListToDomain,
  mapProductToDomain,
} from '@/src/data/remote/model/ProductResponse';
import { Category } from '@/src/domain/model/Category';
import { Product } from '@/src/domain/model/Product';
import { IProductRepository } from '@/src/domain/repositories/IProductRepository';
import { mapCategoryResponseToDomain } from '../remote/model/CategoryResponse';

export class ProductRepository implements IProductRepository {
  constructor(private readonly productApi: IProductApi) {}

  async getProducts(
    page: number = 1,
    limit: number = 30,
    category?: string
  ): Promise<{
    products: Product[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    try {
      const response = category
        ? await this.productApi.getProductsByCategory(category, limit, skip)
        : await this.productApi.getProducts(limit, skip);

      return mapProductListToDomain(response);
    } catch (error) {
      console.error('Products request error:', error);
      throw error;
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      const response = await this.productApi.getCategories();

      return response.map(mapCategoryResponseToDomain);
    } catch (error) {
      console.error('Category request error:', error);
      throw error;
    }
  }

  async getProductById(id: number): Promise<Product | null> {
    try {
      const response = await this.productApi.getProductById(id);
      return mapProductToDomain(response);
    } catch (error) {
      console.error(`Product request with ID ${id} failed:`, error);
      throw error;
    }
  }
}
