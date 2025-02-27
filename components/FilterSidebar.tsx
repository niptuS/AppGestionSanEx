import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const FilterSidebar = ({ setSearchQuery, setSortOption, backgroundColor, textColor, inputBackgroundColor }) => (
    <View style={[styles.sidebarContainer, {backgroundColor: backgroundColor}]}>
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: inputBackgroundColor }]} onPress={() => setSearchQuery('')}>
            <Text style={[styles.filterButtonText, { color: textColor }]}>Clear Filters</Text>
        </TouchableOpacity>
        <Text style={[styles.filterLabel, { color: textColor }]}>Age Range</Text>
        <Text style={[styles.filterLabel, { color: textColor }]}>Sort By</Text>
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: inputBackgroundColor }]} onPress={() => setSortOption('name')}>
            <Text style={[styles.filterButtonText, { color: textColor }]}>Name</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: inputBackgroundColor }]} onPress={() => setSortOption('price')}>
            <Text style={[styles.filterButtonText, { color: textColor }]}>Price</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    sidebarContainer: {
        width: 200,
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    filterButton: {
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    filterButtonText: {
        fontSize: 14,
    },
    filterLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    slider: {
        width: '100%',
        height: 40,
        marginBottom: 20,
    },
});

export default FilterSidebar;