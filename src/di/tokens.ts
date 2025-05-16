export const DI_TOKENS = {
  PRODUCT_REPOSITORY: Symbol.for('IProductRepository'),

  DUMMY_API_CLIENT: Symbol.for('DummyApiClient'),

  PRODUCT_API: Symbol.for('IProductApi'),
} as const;
