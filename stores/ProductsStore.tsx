import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';

const ProductsContext = createContext(null);
export const useProducts = () => useContext(ProductsContext);

const ProductsStore = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const addProductStore = async (name, price, stock, promotion, new_price, description, images, id_category) => {
        try {
            const { data, error } = await supabase.from('products').insert([
                { name, price, stock, promotion, new_price, description, images, id_category },
            ]);

            if (error) {
                console.error('Error adding product:', error);
            } else {
                console.log('Product added successfully:', data);
                fetchProducts(); // Fetch products after adding a new product
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        }
    };

    const fetchProducts = async () => {
        const { data, error } = await supabase.from('products').select('*');
        if (!error) setProducts(data);
    };

    const addCategoryStore = async (name) => {
        const { data, error } = await supabase.from('categories').insert([{ name }]);
        if (error) {
            console.error('Error creating category:', error);
        } else {
            console.log('Category created:', data);
            fetchCategories(); // Fetch categories after adding a new category
        }
    };

    const fetchCategories = async () => {
        const { data, error } = await supabase.from('categories').select('*');
        if (error) {
            console.error('Error fetching categories:', error);
        } else {
            setCategories(data);
        }
    };

    return (
        <ProductsContext.Provider value={{ products, categories, addProductStore, addCategoryStore }}>
            {children}
        </ProductsContext.Provider>
    );
};

export default ProductsStore;