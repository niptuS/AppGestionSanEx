import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useShoppingCart } from '@/stores/ShoppingCartStore';
import { useThemeColor } from "@/hooks/useThemeColor";

const ShoppingCart = () => {
    const { cart, totalCost, saveCart, customerName, setCustomerName } = useShoppingCart();
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const cardBackgroundColor = useThemeColor({}, 'backgroundCard');


    const renderItem = ({ item }) => {
        const itemPrice = item.promotion ? item.new_price : item.price;
        return (
            <View style={[styles.itemContainer, { backgroundColor: cardBackgroundColor }]}>
                <Text style={[styles.itemText, { color: textColor }]}>{item.name}</Text>
                <Text style={[styles.itemText, { color: textColor }]}>Cantidad: {item.quantity}</Text>
                <Text style={[styles.itemText, { color: textColor }]}>Precio: ${itemPrice.toLocaleString('es-ES')}</Text>
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <TextInput
                style={[styles.input, { color: textColor, borderColor: textColor }]}
                placeholder="Nombre del cliente"
                placeholderTextColor="gray"
                value={customerName}
                onChangeText={setCustomerName}
            />
            <FlatList
                data={cart}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                ListFooterComponent={
                    <View style={styles.footer}>
                        <Text style={[styles.totalText, { color: textColor }]}>Total: ${totalCost.toLocaleString('es-ES')}</Text>
                        <TouchableOpacity
                            style={[styles.saleButton, { backgroundColor: cardBackgroundColor }]}
                            onPress={saveCart}
                        >
                            <Text style={[styles.saleText, { color: textColor }]}>Añadir venta</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 40
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
    },
    itemContainer: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    itemText: {
        fontSize: 16,
    },
    footer: {
        marginTop: 20,
        alignItems: 'center',
    },
    totalText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    saleButton: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    saleText: {
        fontSize: 16,
    },
    salesTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    saleItem: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
});

export default ShoppingCart;