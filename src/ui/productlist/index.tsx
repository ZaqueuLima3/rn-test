import { ProductListScreen } from './ProductListScreen';
import { ProductViewModelProvider } from './viewmodels/ProductViewModel';

export const ProductList = () => {
  return (
    <ProductViewModelProvider>
      <ProductListScreen />
    </ProductViewModelProvider>
  );
};
