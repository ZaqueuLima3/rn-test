import { Category } from '@/src/domain/model/Category';

export interface CategoryResponse {
  name: string;
}

export const mapCategoryResponseToDomain = (res: CategoryResponse): Category => {
  return {
    name: res.name,
  };
};
