import { ProductListScreen } from './ProductListScreen';
import { ProductViewModelProvider } from './viewmodels/ProductViewModel';

export const ProductList: React.FC = () => {
  return (
    <ProductViewModelProvider>
      <ProductListScreen />
    </ProductViewModelProvider>
  );
};
