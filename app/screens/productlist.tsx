import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal } from 'react-native';
import { useProducts } from '@/stores/ProductsStore';
import { useThemeColor } from "@/hooks/useThemeColor";
import FilterSidebar from '@/components/FilterSidebar';

const ProductListScreen = () => {
    const { products } = useProducts();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const inputBackgroundColor = useThemeColor({}, 'backgroundCard');
    const cardBackgroundColor = useThemeColor({}, 'backgroundCard');

    useEffect(() => {
    }, []);

    useEffect(() => {
        filterProducts();
    }, [products, searchQuery, minPrice, maxPrice, sortOption]);

    const filterProducts = () => {
        let filtered = products;

        if (searchQuery) {
            filtered = filtered.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        if (minPrice) {
            filtered = filtered.filter(product => product.price >= parseFloat(minPrice));
        }

        if (maxPrice) {
            filtered = filtered.filter(product => product.price <= parseFloat(maxPrice));
        }

        if (sortOption) {
            filtered = filtered.sort((a, b) => {
                if (sortOption === 'name') {
                    return a.name.localeCompare(b.name);
                } else if (sortOption === 'price') {
                    return a.price - b.price;
                }
                return 0;
            });
        }

        setFilteredProducts(filtered);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={[styles.openButton, { backgroundColor: cardBackgroundColor }]} onPress={() => setModalVisible(true)}>
                <Text style={[styles.openButtonText, { color: textColor }]}>Filtrar</Text>
            </TouchableOpacity>
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalView, { backgroundColor: backgroundColor }]}>
                        <FilterSidebar
                            setSearchQuery={setSearchQuery}
                            setMinPrice={setMinPrice}
                            setMaxPrice={setMaxPrice}
                            setSortOption={setSortOption}
                            textColor={textColor}
                            inputBackgroundColor={inputBackgroundColor}
                        />
                        <TouchableOpacity style={[styles.closeButton, { backgroundColor: cardBackgroundColor }]} onPress={() => setModalVisible(false)}>
                            <Text style={[styles.closeButtonText, { color: textColor }]}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <ScrollView style={styles.productList}>
                {filteredProducts.map(product => (
                    <View key={product.id} style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
                        <Image source={{ uri: product.images[0] }} style={styles.image} />
                        <Text style={[styles.name, { color: textColor }]}>{product.name}</Text>
                        <Text style={[styles.price, { color: textColor }]}>{`$${product.price.toLocaleString('es-ES')}`}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 40,
    },
    openButton: {
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: 'center',
    },
    openButtonText: {
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
    },
    productList: {
        flex: 1,
    },
    card: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 10,
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 14,
    },
});

export default ProductListScreen;