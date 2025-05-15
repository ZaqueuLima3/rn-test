import { Category } from '@/src/domain/model/Category';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface CategoryFilterProps {
  categories?: Category[];
  selectedCategory?: string;
  onSelectCategory: (category?: string) => void;
  isLoading: boolean;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#0066CC" />
      </View>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  const renderCategory = ({ item }: { item: Category }) => {
    const isSelected = selectedCategory === item.name;

    return (
      <TouchableOpacity
        style={[styles.categoryItem, isSelected && styles.selectedCategoryItem]}
        onPress={() => onSelectCategory(item.name)}
      >
        <Text
          style={[styles.categoryText, isSelected && styles.selectedCategoryText]}
          numberOfLines={1}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.categoryItem, !selectedCategory && styles.selectedCategoryItem]}
        onPress={() => onSelectCategory(undefined)}
      >
        <Text style={[styles.categoryText, !selectedCategory && styles.selectedCategoryText]}>
          All
        </Text>
      </TouchableOpacity>

      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item, index) => `category-${item.name}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 8,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: '#f5f5f5',
  },
  selectedCategoryItem: {
    backgroundColor: '#0066CC',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
  },
});
