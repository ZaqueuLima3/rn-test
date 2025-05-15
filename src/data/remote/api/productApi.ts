import { dummyApiClient } from '@/src/data/remote/http/httpClient';
import { CategoryResponse } from '@/src/data/remote/model/CategoryResponse';
import { ProductListResponse, ProductResponse } from '@/src/data/remote/model/ProductResponse';

export const productApi = {
  getProducts: (limit = 30, skip = 0) =>
    dummyApiClient.get<ProductListResponse>(`/products?limit=${limit}&skip=${skip}`),

  getCategories: () => dummyApiClient.get<CategoryResponse[]>('/products/categories'),

  getProductsByCategory: (category: string, limit = 30, skip = 0) =>
    dummyApiClient.get<ProductListResponse>(
      `/products/category/${category}?limit=${limit}&skip=${skip}`
    ),

  getProductById: (id: number) => dummyApiClient.get<ProductResponse>(`/products/${id}`),
};
