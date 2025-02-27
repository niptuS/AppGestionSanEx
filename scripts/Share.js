import Share from 'react-native-share';
import { Platform } from 'react-native';

export const shareProduct = async (product) => {
    try {
        const shareOptions = {
            title: 'Compartir Producto',
            message: `Check out ${product.name} - $${product.price.toLocaleString('es-ES')}`,
            url: product.url,
            failOnCancel: false,
        };

        if (Platform.OS === 'android') {
            await Share.open(shareOptions);
        } else {
            await Share.shareSingle({
                ...shareOptions,
                social: Share.Social.FACEBOOK
            });
        }
    } catch (error) {
        console.error('Error sharing product:', error);
    }
};