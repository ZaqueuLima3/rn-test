import { ProductRepository } from '@/src/data/repositories/ProductRepository';
import { Category } from '@/src/domain/model/Category';
import { Product } from '@/src/domain/model/Product';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { createContext, ReactNode, useCallback, useMemo, useState } from 'react';

interface ProductContextType {
  products: Product[] | undefined;
  categories: Category[] | undefined;
  selectedCategory: string | undefined;
  isLoading: boolean;
  isLoadingCategories: boolean;
  isFetchingNextPage: boolean;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  error: Error | null;
  categoriesError: Error | null;
  hasNextPage: boolean;

  fetchProducts: () => void;
  setPage: (page: number) => void;
  setItemsPerPage: (limit: number) => void;
  loadNextPage: () => void;
  refreshProducts: () => void;
  selectCategory: (category?: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductViewModelProvider: React.FC<{
  children: ReactNode;
  initialPage?: number;
  initialLimit?: number;
}> = ({ children, initialPage = 1, initialLimit = 30 }) => {
  const [page, setPage] = useState<number>(initialPage);
  const [limit, setLimit] = useState<number>(initialLimit);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const queryClient = useQueryClient();

  const repository = useMemo(() => new ProductRepository(), []);

  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => repository.getCategories(),
  });

  const { data, isLoading, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['products', selectedCategory],
      queryFn: ({ pageParam = initialPage }) =>
        repository.getProducts(pageParam, limit, selectedCategory),
      getNextPageParam: (lastPage) => {
        if (lastPage.currentPage < lastPage.totalPages) {
          return lastPage.currentPage + 1;
        }
        return undefined;
      },
      initialPageParam: initialPage,
    });

  const products = useMemo(() => {
    if (!data?.pages) return undefined;
    return data.pages.flatMap((page) => page.products);
  }, [data?.pages]);

  const totalPages = data?.pages[data.pages.length - 1]?.totalPages ?? 1;
  const currentPage = data?.pages[data.pages.length - 1]?.currentPage ?? initialPage;

  const fetchProducts = useCallback(
    (newPage?: number, newLimit?: number) => {
      if (newPage !== undefined) setPage(newPage);
      if (newLimit !== undefined) setLimit(newLimit);

      if (newPage === undefined && newLimit === undefined) {
        refetch();
      }
    },
    [refetch]
  );

  const setItemsPerPage = useCallback(
    (newLimit: number) => {
      setLimit(newLimit);
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    [queryClient]
  );

  const loadNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const refreshProducts = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  }, [queryClient]);

  const selectCategory = useCallback(
    (category?: string) => {
      setSelectedCategory(category);
      setPage(initialPage);
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    [queryClient, initialPage]
  );

  const contextValue = useMemo<ProductContextType>(
    () => ({
      products,
      categories,
      selectedCategory,
      isLoading,
      isLoadingCategories,
      isFetchingNextPage,
      error,
      categoriesError,
      currentPage,
      itemsPerPage: limit,
      totalPages,
      hasNextPage: !!hasNextPage,

      fetchProducts,
      setPage,
      setItemsPerPage,
      loadNextPage,
      refreshProducts,
      selectCategory,
    }),
    [
      products,
      categories,
      selectedCategory,
      isLoading,
      isLoadingCategories,
      isFetchingNextPage,
      error,
      categoriesError,
      currentPage,
      limit,
      totalPages,
      hasNextPage,
      fetchProducts,
      setPage,
      setItemsPerPage,
      loadNextPage,
      refreshProducts,
      selectCategory,
    ]
  );

  return <ProductContext.Provider value={contextValue}>{children}</ProductContext.Provider>;
};

export const useProductViewModel = () => {
  const context = React.useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProductViewModel should be used with ProductViewModelProvider');
  }
  return context;
};
