import { CategoryResponse } from '@/src/data/remote/model/CategoryResponse';
import { ProductListResponse, ProductResponse } from '@/src/data/remote/model/ProductResponse';

export interface IProductApi {
  getProducts(limit?: number, skip?: number): Promise<ProductListResponse>;
  getProductById(id: number): Promise<ProductResponse>;
  getCategories(): Promise<CategoryResponse[]>;
  getProductsByCategory(
    category: string,
    limit?: number,
    skip?: number
  ): Promise<ProductListResponse>;
}
