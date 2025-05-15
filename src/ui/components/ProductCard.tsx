import { Product } from '@/src/domain/model/Product';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProductCardProps {
  product: Product;
  onPress: (productId: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(product.id)}>
      <Image source={{ uri: product.thumbnail }} style={styles.thumbnail} resizeMode="cover" />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {product.title}
        </Text>
        <Text style={styles.brand}>{product.brand}</Text>

        <View style={styles.priceContainer}>
          {product.hasDiscount ? (
            <>
              <Text style={styles.originalPrice}>${product.originalPrice}</Text>
              <Text style={styles.finalPrice}>${product.finalPrice}</Text>
            </>
          ) : (
            <Text style={styles.finalPrice}>${product.originalPrice}</Text>
          )}
        </View>

        <View style={styles.footer}>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>★ {product.rating.toFixed(1)}</Text>
          </View>

          {product.stock > 0 ? (
            <Text style={styles.inStock}>Em estoque</Text>
          ) : (
            <Text style={styles.outOfStock}>Indisponível</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    height: 120,
  },
  thumbnail: {
    width: 120,
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  brand: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  finalPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e53935',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: '#f57c00',
    fontSize: 14,
    fontWeight: '500',
  },
  inStock: {
    fontSize: 12,
    color: '#4caf50',
  },
  outOfStock: {
    fontSize: 12,
    color: '#f44336',
  },
});
