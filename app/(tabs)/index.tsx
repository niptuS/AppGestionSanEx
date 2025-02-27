import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Input, Text, Divider } from '@ui-kitten/components';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useProducts } from '@/stores/ProductsStore';
import { HeaderTitle } from "@react-navigation/elements";
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import COLOURS from '@/components/Colours';

interface Product {
    id: number;
    name: string;
    price: number;
    images: string[];
    promotion: boolean;
    id_category: number;
}

interface Category {
    id: number;
    name: string;
}

const HomeScreen: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [promotionalProducts, setPromotionalProducts] = useState<Product[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const { products, categories } = useProducts();
    const navigation = useNavigation();
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const cardBackgroundColor = useThemeColor({}, 'backgroundCard');

    useEffect(() => {
        const filteredProducts = products.filter(product => product.promotion);
        setPromotionalProducts(filteredProducts);
    }, [products]);

    const shouldLoadComponent = (index: number): boolean => index === selectedIndex;


const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const offPercentage = Math.round(((product.price - product.new_price)/product.price)*100);
    return (
      <TouchableOpacity
            onPress={() => navigation.navigate('screens/productscreen', { productID: product.id })}
            style={{
                width: 180,
                marginRight: 16,
                marginVertical: 8,
            }}>
        <View
                style={{
                    width: '100%',
                    height: 120,
                    borderRadius: 10,
                    backgroundColor: COLOURS.backgroundLight,
                    position: 'relative',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 8,
                }}>
          {product.promotion ? (
            <View
              style={{
                position: 'absolute',
                width: '20%',
                height: '24%',
                backgroundColor: COLOURS.green,
                top: 0,
                left: 0,
                borderTopLeftRadius: 10,
                borderBottomRightRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 12,
                  color: COLOURS.white,
                  fontWeight: 'bold',
                  letterSpacing: 1,
                }}>
                {offPercentage}%
              </Text>
            </View>
          ) : null}
          <Image
            source={{ uri: product.images[0] }}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'contain',
              }}
            />
        </View>
        <Text
          style={{
            fontSize: 12,
            color: COLOURS.black,
            fontWeight: '600',
            marginBottom: 2,
          }}>
          {product.name}
        </Text>
        {product.stock ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome
                    name="circle"
                    style={{
                        fontSize: 12,
                        marginRight: 6,
                        color: COLOURS.green,
                    }}
                />
                <Text style={{ fontSize: 12, color: COLOURS.green }}>
                    Disponible
                </Text>
            </View>
        ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome
                    name="circle"
                    style={{
                        fontSize: 12,
                        marginRight: 6,
                        color: COLOURS.red,
                    }}
                />
                <Text style={{ fontSize: 12, color: COLOURS.red }}>
                    Sin stock
                </Text>
            </View>
        )}
        <Text style={{ fontSize: 12, color: COLOURS.black }}>
            ${product.promotion ? product.new_price : product.price}
        </Text>
      </TouchableOpacity>
    );
  };

const ProductSections: React.FC = () => {
    const allCategories = [{ id: 0, name: 'Todos' }, ...categories];

    return (
        <>
            {allCategories.map((category) => (
                <View key={category.id} style={styles.sectionContainer}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>
                        {category.name}
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {products
                            .filter(p => category.id === 0 ? true : p.id_category === category.id)
                            .slice(0, 10)
                            .map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        <TouchableOpacity
                            onPress={() => navigation.navigate('screens/categoryproducts', {
                                categoryId: category.id,
                                categoryName: category.name
                            })}
                            style={styles.viewAllCard}>
                            <View style={styles.viewAllContent}>
                                <Text style={[styles.viewAllText, { color: textColor }]}>
                                    Ver más
                                </Text>
                                <View style={styles.arrowContainer}>
                                    <Text style={[styles.arrowText, { color: textColor }]}>→</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                    <Divider />
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <ProductSections />
                    </ScrollView>
                </View>
            ))}
        </>
    );
};
    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Input
                style={[styles.searchInput, { backgroundColor: cardBackgroundColor, color: textColor }]}
                placeholder="Buscar..."
                placeholderTextColor={textColor}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <HeaderTitle onPress={() => navigation.navigate('screens/promotedproducts')}>
                Productos Promocionados
            </HeaderTitle>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promotionalList}>
                {promotionalProducts.slice(0, 8).map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </ScrollView>
            <Divider />
            <ProductSections />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    sectionContainer: {
        marginVertical: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        marginLeft: 4,
    },
    viewAllCard: {
        width: 180,
        height: 180,
        backgroundColor: COLOURS.backgroundLight,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    viewAllContent: {
        alignItems: 'center',
    },
    viewAllText: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
    },
    arrowContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLOURS.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrowText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    searchInput: {
        padding: 10,
        borderRadius: 8,
        marginTop: 40,
        marginBottom: 10,
    },
    promotionalList: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    productCard: {
        marginTop: 20,
        marginRight: 10,
        padding: 10,
        borderRadius: 8,
        width: 180,
        height: 250,
        alignItems: 'center',
    },
    imageContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 180,
        height: 180,
        marginBottom: 20,
        resizeMode: 'cover',
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    productPrice: {
        fontSize: 14,
    },
    productGrid: {
        paddingBottom: 20,
    },
    tabContainer: {
        flex: 1,
        padding: 10,
    },
});

export default HomeScreen;