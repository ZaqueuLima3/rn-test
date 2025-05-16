import { useInjection } from '@/src/di/hooks/hooks';
import { DI_TOKENS } from '@/src/di/tokens';
import { Product } from '@/src/domain/model/Product';
import { IProductRepository } from '@/src/domain/repositories/IProductRepository';
import { useQuery } from '@tanstack/react-query';
import React, { createContext, ReactNode, useMemo } from 'react';

interface ProductDetailContextType {
  product: Product | null | undefined;
  isLoading: boolean;
  error: Error | null;
}

const ProductDetailContext = createContext<ProductDetailContextType | undefined>(undefined);

export const ProductDetailViewModelProvider: React.FC<{
  children: ReactNode;
  productId: number;
}> = ({ children, productId = 0 }) => {
  const repository = useInjection<IProductRepository>(DI_TOKENS.PRODUCT_REPOSITORY);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => repository.getProductById(productId),
    enabled: productId > 0,
  });

  const contextValue = useMemo<ProductDetailContextType>(
    () => ({
      product,
      isLoading,
      error,
    }),
    [product, isLoading, error]
  );

  return (
    <ProductDetailContext.Provider value={contextValue}>{children}</ProductDetailContext.Provider>
  );
};

export const useProductDetailViewModel = () => {
  const context = React.useContext(ProductDetailContext);
  if (context === undefined) {
    throw new Error('useProductViewModel should be used with ProductDetailViewModelProvider');
  }
  return context;
};
