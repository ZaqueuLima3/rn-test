# E-Commerce App with MVVM and Clean Architecture

This project implements a React Native e-commerce application using the MVVM (Model-View-ViewModel) pattern combined with Clean Architecture. This architecture is widely used in native Android development and has been adapted for React Native to provide a scalable, maintainable, and testable codebase.

## Architecture Overview

The application follows a layered architecture with clear boundaries and dependencies that point inward, adhering to the Dependency Rule of Clean Architecture:

![Diagram](/diagram.png)

## Why MVVM with Clean Architecture?

This architecture was chosen for several reasons:

1. **Separation of Concerns**: Clear boundaries between UI, business logic, and data operations
2. **Testability**: Each layer can be tested independently
3. **Scalability**: New features can be added without modifying existing code
4. **Maintainability**: Changes in one layer don't affect other layers (if following the dependency rule)
5. **Reusability**: Logic can be shared across different parts of the application
6. **Adaptability**: The native Android architecture pattern works well with React Native, making it familiar for Android developers transitioning to React Native

## Architecture Layers

### Data Layer

The data layer is responsible for retrieving data from various sources (API, local database, etc.) and mapping it to domain models.

#### `/src/data/remote/api/productApi`

This module contains API client implementations for making network requests to the backend services. It handles the actual HTTP communication and is responsible for:

- Defining API endpoints
- Making HTTP requests
- Handling response formats

```typescript
// Example: productApi.ts
export const productApi = {
  getProducts: (limit = 30, skip = 0) =>
    dummyApiClient.get<ProductListResponse>(`/products?limit=${limit}&skip=${skip}`),

  getProductById: (id: number) => dummyApiClient.get<ProductResponse>(`/products/${id}`),

  getCategories: () => dummyApiClient.get<string[]>('/products/categories'),
};
```

#### `/src/data/remote/model/ProductResponse`

These are Data Transfer Objects (DTOs) that match the structure of API responses. They're used to deserialize JSON responses from the API and include mapping functions to convert these DTOs to domain models.

```typescript
// Example: ProductResponse.ts
export interface ProductResponse {
  id: number;
  title: string;
  description: string;
  price: number;
  // other API fields
}

export const mapProductToDomain = (res: ProductResponse): Product => {
  // Transform API model to domain model
  return {
    id: res.id,
    title: res.title,
    description: res.description,
    originalPrice: res.price,
    // other transformations
  };
};
```

#### `/src/data/repositories/ProductRepository`

Implementations of the repository interfaces defined in the domain layer. They use the API clients to fetch data and mappers to convert that data to domain models.

```typescript
// Example: ProductRepository.ts
export class ProductRepository implements IProductRepository {
  async getProducts(
    page: number = 1,
    limit: number = 30
  ): Promise<{
    products: Product[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const response = await productApi.getProducts(limit, skip);
    return mapProductListToDomain(response);
  }

  // Other repository methods
}
```

### Domain Layer

The domain layer contains business logic and rules. It's independent of other layers and defines interfaces that the data layer implements.

#### `/src/domain/repositories/IProductRepository`

Repository interfaces that define contracts for data operations. These interfaces are implemented by concrete repository classes in the data layer.

```typescript
// Example: IProductRepository.ts
export interface IProductRepository {
  getProducts(
    page?: number,
    limit?: number,
    category?: string
  ): Promise<{
    products: Product[];
    total: number;
    currentPage: number;
    totalPages: number;
  }>;

  getProductById(id: number): Promise<Product | null>;

  getCategories(): Promise<string[]>;
}
```

#### `/src/domain/model/Product`

Domain models (entities) that represent the core business objects. These models are used throughout the application and are independent of any particular data source.

```typescript
// Example: Product.ts
export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  originalPrice: number;
  finalPrice: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  thumbnail: string;
  images: string[];
  // other business properties
}
```

### UI / Presentation Layer

The presentation layer is responsible for displaying information to the user and handling user interactions.

#### `/src/ui/productlist/viewmodels/ProductViewModel`

ViewModels manage the state and business logic for the UI. They fetch data from the repositories, process it, and expose it to the views. They also handle user actions and update the state accordingly.

```typescript
// Example: ProductViewModel.tsx
export const ProductViewModelProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [page, setPage] = useState<number>(1);
  const repository = useMemo(() => new ProductRepository(), []);

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', page],
    queryFn: () => repository.getProducts(page),
  });

  const contextValue = useMemo<ProductContextType>(
    () => ({
      products: data?.products,
      isLoading,
      error,
      // other state and methods
    }),
    [data, isLoading, error]
  );

  return <ProductContext.Provider value={contextValue}>{children}</ProductContext.Provider>;
};
```

#### `/src/ui/productlist/ProductListScreen`

UI components that display data to the user and handle user interactions. They consume ViewModels to get state and dispatch actions.

```typescript
// Example: ProductListScreen.tsx
export const ProductListScreen: React.FC = () => {
  const router = useRouter();
  const { products, isLoading, error, loadNextPage } = useProductViewModel();

  const handleProductPress = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => handleProductPress(item.id)} />
        )}
        onEndReached={loadNextPage}
        // other props
      />
    </View>
  );
};
```

#### `/src/ui/productlist/index`

Entry point for the product list module, typically a simple export or composition of components.

```typescript
// Example: index.tsx
import { ProductListScreen } from './ProductListScreen';
import { ProductViewModelProvider } from './viewmodels/ProductViewModel';

export const ProductList = () => {
  return (
    <ProductViewModelProvider>
      <ProductListScreen />
    </ProductViewModelProvider>
  );
};
```

#### `/src/ui/components/<Components>`

Reusable UI components used across different screens. These components are usually presentational and take props to render different states.

```typescript
// Example: ProductCard.tsx
export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(product.id)}>
      <Image source={{ uri: product.thumbnail }} style={styles.thumbnail} />
      <View style={styles.content}>
        <Text style={styles.title}>{product.title}</Text>
        {/* other UI elements */}
      </View>
    </TouchableOpacity>
  );
};
```

### App Layer (Expo Router)

The app layer is responsible for routing and navigation between screens.

#### `/app/_layout`

Defines the layout structure for the application, including navigation configurations.

```typescript
// Example: _layout.tsx
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Products' }} />
        <Stack.Screen name="product/[id]" options={{ title: 'Product' }} />
      </Stack>
    </QueryClientProvider>
  );
}
```

#### `/app/index`

Main entry point for the application, typically renders the main screen.

```typescript
// Example: index.tsx
export default function Index() {
  return <ProductList />;
}
```

## Benefits of This Architecture

1. **Clear Responsibilities**: Each component has a single responsibility, making the code easier to understand and maintain.
2. **Testability**: Each layer can be tested in isolation, making unit tests simpler and more effective.
3. **Independence**: The domain layer is independent of frameworks and UI, making it portable and reusable.
4. **Scalability**: New features can be added without affecting existing code, following the Open/Closed Principle.
5. **Adaptability**: The architecture can be adapted to different UI frameworks or data sources with minimal changes.

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install` or `yarn install`
3. Start the development server with `npm start` or `yarn start`
4. Run the app on a simulator or device with `npm run ios` or `npm run android`
