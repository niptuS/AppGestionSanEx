import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Image, ScrollView, Modal, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { Picker } from '@react-native-picker/picker';
import { useProducts } from '@/stores/ProductsStore';
import { useThemeColor } from '@/hooks/useThemeColor';
import { supabase } from '@/stores/supabase';
import NumericInput from "@/components/NumericInput";

interface ImageAsset {
    uri: string;
}

export default function AddProduct() {
    const [name, setName] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [stock, setStock] = useState<string>('');
    const [promotion, setPromotion] = useState<boolean>(false);
    const [newPrice, setNewPrice] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [images, setImages] = useState<ImageAsset[]>([]);
    const [category, setCategory] = useState<string>('');
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [newCategory, setNewCategory] = useState<string>('');

    const { categories, addProductStore, addCategoryStore } = useProducts();

    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const inputBackgroundColor = useThemeColor({}, 'backgroundCard');
    const cardBackgroundColor = useThemeColor({}, 'backgroundCard');

    useEffect(() => {
    }, []);

    const pickImages = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            base64: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImages(result.assets.map(asset => ({ uri: asset.uri, base64: asset.base64 })));
        }
    };

    const uploadImages = async () => {
        const imageUrls = await Promise.all(
            images.map(async (image) => {
                const fileName = `product-${Date.now()}-${image.uri.split('/').pop()}`;
                // @ts-ignore
                const fileData = decode(image.base64);

                const { data, error } = await supabase.storage
                    .from('images')
                    .upload(fileName, fileData, {
                        contentType: 'image/jpeg',
                    });

                if (error) {
                    console.error('Error uploading image:', error);
                    return null;
                }

                const { data: publicUrlData } = supabase.storage
                    .from('images')
                    .getPublicUrl(fileName);

                return publicUrlData.publicUrl;
            })
        );

        return imageUrls.filter((url) => url !== null);
    };

    const removeImage = (uri: string) => {
        setImages(images.filter(image => image.uri !== uri));
    };

    const handleAddProduct = async () => {
        let imageUrls = [];
        if (images.length > 0) {
            imageUrls = await uploadImages();
            if (imageUrls.length === 0) {
                console.error('Fallo al subir la imagen');
                return;
            }
        }

        await addProductStore(name, parseInt(price), parseInt(stock), promotion, Number(newPrice), description, imageUrls, Number(category));
        alert('Producto agregado');
        setName('');
        setPrice('');
        setStock('');
        setPromotion(false);
        setNewPrice('');
        setDescription('');
        setImages([]);
        setCategory('');
    };

    const handleAddCategory = () => {
        addCategoryStore(newCategory);
        alert('Categoría creada con éxito');
        setNewCategory('');
        setModalVisible(false);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={[styles.title, { color: textColor }]}>Agregar Producto</Text>
            <TextInput placeholder="Nombre del Producto" value={name} onChangeText={setName} style={[styles.input, { backgroundColor: inputBackgroundColor, color: textColor }]} placeholderTextColor={textColor} />
            <NumericInput placeholder="Precio" value={price} onChangeText={setPrice}/>
            <NumericInput placeholder="Stock" value={stock} onChangeText={setStock}/>
            <Picker
                selectedValue={category}
                onValueChange={(itemValue) => itemValue === 'addCategory' ? setModalVisible(true) : setCategory(itemValue)}
                style={[styles.picker, { backgroundColor: cardBackgroundColor, color: textColor }]}
            >
                {categories.map((cat) => <Picker.Item key={cat.id} label={cat.name} value={cat.id} />)}
                <Picker.Item label="Añadir categoría" value="addCategory" />
            </Picker>
            <TouchableOpacity style={[styles.button, { backgroundColor: cardBackgroundColor }]} onPress={pickImages}>
                <Text style={[styles.buttonText, { color: textColor }]}>Seleccionar Imágenes</Text>
            </TouchableOpacity>
            <View style={styles.imageContainer}>
                {images.map((image, index) => (
                    <View key={index} style={styles.imageWrapper}>
                        <Image source={{ uri: image.uri }} style={styles.image} />
                        <TouchableOpacity onPress={() => removeImage(image.uri)} style={styles.deleteButton}>
                            <Text style={styles.deleteButtonText}>X</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            <View style={styles.switchContainer}>
                <Text style={{ color: textColor }}>Promoción</Text>
                <Switch value={promotion} onValueChange={setPromotion} />
            </View>
            {promotion && <TextInput placeholder="Nuevo Precio" value={newPrice} onChangeText={setNewPrice} keyboardType="numeric" style={[styles.input, { backgroundColor: inputBackgroundColor, color: textColor }]} placeholderTextColor={textColor} />}
            <TextInput placeholder="Descripción" value={description} onChangeText={setDescription} style={[styles.input, { backgroundColor: inputBackgroundColor, color: textColor }]} placeholderTextColor={textColor} />
            <TouchableOpacity style={[styles.button, { backgroundColor: cardBackgroundColor }]} onPress={handleAddProduct}>
                <Text style={[styles.buttonText, { color: textColor }]}>Guardar</Text>
            </TouchableOpacity>
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalView, { backgroundColor: backgroundColor }]}>
                        <Text style={[styles.modalTitle, { color: textColor }]}>Añadir Categoría</Text>
                        <TextInput placeholder="Nombre de la nueva categoría" value={newCategory} onChangeText={setNewCategory} style={[styles.modalTextInput, {color: textColor}]} placeholderTextColor={textColor} />
                        <TouchableOpacity style={[styles.modalButton, { backgroundColor: cardBackgroundColor }]} onPress={handleAddCategory}>
                            <Text style={[styles.modalButtonText, { color: textColor }]}>Añadir</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton, { backgroundColor: cardBackgroundColor }]} onPress={() => setModalVisible(false)}>
                            <Text style={[styles.modalButtonText, { color: textColor }]}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: { width: '100%', padding: 10, marginVertical: 10, borderColor: 'gray', borderWidth: 1, borderRadius: 5 },
    picker: { width: '100%', height: 50, marginVertical: 10 },
    button: { backgroundColor: '#007bff', padding: 15, borderRadius: 5, alignItems: 'center', marginVertical: 10, width: '100%' },
    buttonText: { color: 'white', fontSize: 16 },
    imageContainer: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 },
    imageWrapper: { position: 'relative', margin: 5 },
    image: { width: 100, height: 100 },
    deleteButton: { position: 'absolute', top: -10, right: -5, backgroundColor: 'red', borderRadius: 100, padding: 6 },
    deleteButtonText: { color: 'white', fontSize: 12 },
    switchContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalView: { width: 300, backgroundColor: 'white', borderRadius: 20, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    modalTextInput: { width: '100%', padding: 10, marginBottom: 20, borderColor: 'gray', borderWidth: 1, borderRadius: 5 },
    modalButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, alignItems: 'center', marginVertical: 5, width: '100%' },
    modalButtonText: { color: 'white', fontSize: 16 },
});