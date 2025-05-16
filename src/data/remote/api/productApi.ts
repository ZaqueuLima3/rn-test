import { CategoryResponse } from '@/src/data/remote/model/CategoryResponse';
import { ProductListResponse, ProductResponse } from '@/src/data/remote/model/ProductResponse';
import { IHttpClient } from '@/src/infra/network/IHttpClient';
import { IProductApi } from './IProductApi';

export class ProductApi implements IProductApi {
  constructor(private readonly dummyApiClient: IHttpClient) {}

  getProducts(limit = 30, skip = 0): Promise<ProductListResponse> {
    return this.dummyApiClient.get<ProductListResponse>(`/products?limit=${limit}&skip=${skip}`);
  }

  getCategories(): Promise<CategoryResponse[]> {
    return this.dummyApiClient.get<CategoryResponse[]>('/products/categories');
  }

  getProductsByCategory(category: string, limit = 30, skip = 0): Promise<ProductListResponse> {
    return this.dummyApiClient.get<ProductListResponse>(
      `/products/category/${category}?limit=${limit}&skip=${skip}`
    );
  }

  getProductById(id: number): Promise<ProductResponse> {
    return this.dummyApiClient.get<ProductResponse>(`/products/${id}`);
  }
}
