import { useLocalSearchParams } from 'expo-router';
import { ProductDetailScreen } from './ProductDetailScreen';
import { ProductDetailViewModelProvider } from './viewmodels/ProductDetailViewModel';

export const ProductDetail: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = id ? parseInt(id, 10) : 0;

  return (
    <ProductDetailViewModelProvider productId={productId}>
      <ProductDetailScreen />
    </ProductDetailViewModelProvider>
  );
};
