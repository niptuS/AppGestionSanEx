import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Animated,
  ToastAndroid,
  StyleSheet,
} from 'react-native';
import { useProducts } from '@/stores/ProductsStore';
import { useShoppingCart } from '@/stores/ShoppingCartStore';
import { useThemeColor } from "@/hooks/useThemeColor";
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { shareProduct } from '@/scripts/Share';
import { useRouter } from 'expo-router';

const ProductScreen = ({ route }) => {
  const router = useRouter();
  const { productId } = route.params;
  const { products } = useProducts();
  const { addToCart } = useShoppingCart();
  const [product, setProduct] = useState(null);

  const width = Dimensions.get('window').width;
  const scrollX = new Animated.Value(0);
  const position = Animated.divide(scrollX, width);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardBackgroundColor = useThemeColor({}, 'backgroundCard');

  useEffect(() => {
    const selectedProduct = products.find(p => p.id === productId);
    setProduct(selectedProduct);
  }, [productId, products]);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    ToastAndroid.show('Producto añadido al carrito', ToastAndroid.SHORT);
  };

  const renderProduct = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.image} />
    </View>
  );

  if (!product) {
    return <Text>Cargando...</Text>;
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar backgroundColor={cardBackgroundColor} barStyle="dark-content" />
      <ScrollView>
        <View style={[styles.header, { backgroundColor: cardBackgroundColor }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Entypo name="chevron-left" style={styles.backIcon} />
          </TouchableOpacity>
          <FlatList
            data={product.images}
            horizontal
            renderItem={renderProduct}
            showsHorizontalScrollIndicator={false}
            decelerationRate={0.8}
            snapToInterval={width}
            bounces={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
          />
          <View style={styles.indicatorContainer}>
            {product.images?.map((_, index) => {
              const opacity = position.interpolate({
                inputRange: [index - 1, index, index + 1],
                extrapolate: 'clamp'
              });

              return (
                <Animated.View
                  key={index}
                  style={[styles.indicator, { opacity }]}
                />
              );
            })}
          </View>
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.row}>
            <Text style={[styles.productName, { color: textColor }]}>{product.name}</Text>
            <TouchableOpacity
              onPress={() => shareProduct({
                name: product.name,
                url: product.images[0],
                price: product.price
              })}
            >
              <Ionicons name="share-social" style={styles.shareIcon} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.description, { color: textColor }]}>{product.description}</Text>
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: textColor }]}>
              ${product.price.toLocaleString('es-ES')}
            </Text>
            {product.isPromotion && (
              <Text style={[styles.discount, { color: textColor }]}>
                Discount: {product.discountPercentage}% off
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleAddToCart}
          style={[styles.addButton, { backgroundColor: cardBackgroundColor }]}
          disabled={product.stock === 0}
        >
          <Text style={[styles.addButtonText, { color: textColor }]}>
            {product.stock > 0 ? 'Add to cart' : 'Not Available'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  header: {
    width: '100%',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  backIcon: {
    fontSize: 18,
    color: '#000',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  imageContainer: {
    width: Dimensions.get('window').width,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 32,
  },
  indicator: {
    height: 2.4,
    marginHorizontal: 4,
    borderRadius: 100,
  },
  detailsContainer: {
    paddingHorizontal: 16,
    marginTop: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  cartIcon: {
    fontSize: 18,
    color: '#0000ff',
    marginRight: 6,
  },
  text: {
    fontSize: 12,
  },
  productName: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginVertical: 4,
    maxWidth: '84%',
  },
  linkIcon: {
    fontSize: 24,
    color: '#0000ff',
    backgroundColor: '#0000ff10',
    padding: 8,
    borderRadius: 100,
  },
  description: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 1,
    opacity: 0.5,
    lineHeight: 20,
    maxWidth: '85%',
    maxHeight: 44,
    marginBottom: 18,
  },
  locationContainer: {
    flexDirection: 'row',
    width: '80%',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 16,
    color: '#0000ff',
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 100,
    marginRight: 10,
  },
  chevronIcon: {
    fontSize: 22,
    color: '#000',
  },
  priceContainer: {
    paddingHorizontal: 16,
  },
  price: {
    fontSize: 18,
    fontWeight: '500',
    maxWidth: '85%',
    marginBottom: 4,
  },
  tax: {
    fontSize: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    height: '8%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: '86%',
    height: '90%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  shareIcon: {
    fontSize: 24,
    color: '#0000ff',
    backgroundColor: '#0000ff10',
    padding: 8,
    borderRadius: 100,
  },
  discount: {
    fontSize: 14,
    color: '#00aa00',
    fontWeight: '500',
    marginTop: 4,
  },
});

export default ProductScreen;