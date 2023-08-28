import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ImageBackground, TouchableOpacity, Image } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Modal from 'react-native-modal';

const Principal = ({ navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  const comprobarConexion = () => {
    NetInfo.addEventListener(state => {
      if (state.isConnected) {
        navigation.navigate("Login");
      } else {
        console.log('No hay conexión a internet');
        setIsConnected(false);
      }
    });
  };

  return (
    <ImageBackground source={require('./assets/images/fondo_pantallas.png')} style={styles.imageBackground}>
      <View style={styles.container}>
        <View style={styles.card}>
        <Image source={require('./assets/images/iconocortar.jpg')} style={styles.headingImage} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={comprobarConexion}>
              <Text style={styles.buttonText}>Iniciar sesión</Text>
            </TouchableOpacity>
            <View style={styles.buttonSpacing} />
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Register")}>
              <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>
          </View> 
        </View>
      </View>
      <Modal isVisible={!isConnected} onBackdropPress={() => setIsConnected(true)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>No hay conexión a internet</Text>
          <TouchableOpacity style={styles.closeButton} onPress={() => setIsConnected(true)}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 30,
    paddingVertical: 100,
    paddingHorizontal: 45,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    marginTop:-30
  },
  headingText: {
    fontSize: 35,
    marginBottom: 20,
    color: '#000000',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  buttonContainer: {
    marginTop: 20,
    shadowColor: '#000000',
    width: 300,
  },
  button: {
    width: 320,
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: 'rgb(0, 105, 108)',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSpacing: {
    height: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headingImage: {
    marginTop:-60,
    width: 300, 
    height: 220, 
    marginBottom: 20,
  },
});

export default Principal;
