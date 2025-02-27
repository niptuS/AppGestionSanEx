import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import React, {useEffect, useState} from "react";
import {useThemeColor} from "@/hooks/useThemeColor";
import { useSales } from "@/stores/ShoppingCartStore";


const SellList = () => {
    const { sales } = useSales();

    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const cardBackgroundColor = useThemeColor({}, 'backgroundCard');

    useEffect(() => {
    }, []);

    return (
        <View style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.salesTitle, { color: textColor }]}>Ventas</Text>
        <FlatList
        data={sales}
        renderItem={({ item }) => (
            <View style={[styles.saleItem, { backgroundColor: cardBackgroundColor }]}>
                <Text style={[styles.saleText, { color: textColor }]}>ID: {item.id_sale}</Text>
                <Text style={[styles.saleText, { color: textColor }]}>Nombre: {item.name}</Text>
                <Text style={[styles.saleText, { color: textColor }]}>Monto: ${item.total_cost.toLocaleString('es-ES')}</Text>
                <Text style={[styles.saleText, { color: textColor }]}>Fecha: {new Date(item.sale_date).toLocaleDateString('es-ES')}</Text>
            </View>
        )}
        keyExtractor={item => item.id_sale.toString()}
        />
        </View>
        )

}

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

export default SellList;