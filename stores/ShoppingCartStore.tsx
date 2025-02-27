import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

const ShoppingCartContext = createContext(null);
export const useSales = () => useContext(ShoppingCartContext);

export const ShoppingCartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [sales, setSales] = useState([]);

    useEffect(() => {
        fetchSales();
    }, []);

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingProduct = prevCart.find(p => p.id === product.id);
            if (existingProduct) {
                return prevCart.map(p => p.id === product.id ? { ...p, quantity: p.quantity + product.quantity } : p);
            }
            return [...prevCart, product];
        });
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(product => product.id !== productId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const totalCost = cart.reduce((total, product) => {
        const productPrice = product.promotion ? product.new_price : product.price;
        return total + productPrice * product.quantity;
    }, 0);

    const saveCart = async () => {
        const { data: saleData, error: saleError } = await supabase
            .from('sales')
            .insert([{ name: customerName, sale_date: new Date(), total_cost: totalCost }])
            .select('id_sale')
            .single();

        if (saleError) {
            console.error('Error saving sale:', saleError);
            return;
        }

        const salesProductsData = cart.map(product => ({
            id_sale: saleData.id_sale,
            id_product: product.id,
            quantity: product.quantity,
        }));

        const { data: salesProducts, error: salesProductsError } = await supabase
            .from('sales_products')
            .insert(salesProductsData);

        if (salesProductsError) {
            console.error('Error saving sales products:', salesProductsError);
        } else {
            console.log('Sales products saved:', salesProducts);
            clearCart();
            fetchSales(); // Fetch sales after saving the cart
        }
    };

    const fetchSales = async () => {
        const { data, error } = await supabase.from('sales').select('*');
        if (!error) {
            console.log('Sales fetched:', data);
            setSales(data);
        }
    };

    return (
        <ShoppingCartContext.Provider value={{ cart, customerName, sales, setCustomerName, addToCart, removeFromCart, clearCart, saveCart, totalCost }}>
            {children}
        </ShoppingCartContext.Provider>
    );
};

export const useShoppingCart = () => {
    return useContext(ShoppingCartContext);
};