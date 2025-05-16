import { IProductApi } from '@/src/data/remote/api/IProductApi';
import { ProductApi } from '@/src/data/remote/api/ProductApi';
import { ProductRepository } from '@/src/data/repositories/ProductRepository';
import { IProductRepository } from '@/src/domain/repositories/IProductRepository';
import { IHttpClient } from '@/src/infra/network/IHttpClient';
import { HttpClient } from '@/src/infra/network/httpClient';
import { container } from 'tsyringe';
import { DI_TOKENS } from './tokens';

container.registerInstance<IHttpClient>(
  DI_TOKENS.DUMMY_API_CLIENT,
  new HttpClient('https://dummyjson.com')
);

container.registerInstance<IProductApi>(
  DI_TOKENS.PRODUCT_API,
  new ProductApi(container.resolve(DI_TOKENS.DUMMY_API_CLIENT))
);

container.registerInstance<IProductRepository>(
  DI_TOKENS.PRODUCT_REPOSITORY,
  new ProductRepository(container.resolve(DI_TOKENS.PRODUCT_API))
);

export { container };
