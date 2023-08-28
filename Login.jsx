import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { CheckBox } from 'react-native-elements';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import Modal from 'react-native-modal';
import { useDatos } from './DatosContext';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [rememberPassword, setRememberPassword] = useState(false);
  const [errorDatos, setErrorDatos] = useState(false);
  const { setDatos } = useDatos();

  useEffect(() => {
    const checkRememberedCredentials = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('email');
        const savedPassword = await AsyncStorage.getItem('password');
        if (savedEmail && savedPassword) {
          setEmail(savedEmail);
          setPassword(savedPassword);
          setRememberPassword(true);
        }
      } catch (error) {
        console.error('Error al obtener datos de sesión:', error);
      }
    };

    checkRememberedCredentials();

    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        setIsConnected(true);
      } else {
        console.log('No hay conexión a internet');
        setIsConnected(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  
  const handleLogin = async () => {
    if (isConnected) {
      try {
        const response = await axios.get(
          `https://cortar.onrender.com/CortAR/login/${email}/${password}`
        );

        if (rememberPassword) {
          try {
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('password', password);
            console.log('Datos de sesión guardados correctamente');
          } catch (error) {
            console.error('Error al guardar datos de sesión:', error);
          }
        }
        
        setDatos(response.data);
        navigation.navigate('HomeTabs');
      } catch (error) {
        console.error(error);
        setErrorDatos(true); // Setting the error state to true
      }
    } else {
      setIsModalVisible(true);
    }
  };
  
  return (
    <ImageBackground source={require('./assets/images/fondo_pantallas.png')} style={styles.imageBackground}>
      <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logo}>Inicia sesión para continuar</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            onChangeText={text => setEmail(text)}
            value={email}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            onChangeText={text => setPassword(text)}
            value={password}
            secureTextEntry
          />
          <CheckBox
              title='Recordar contraseña'
              checked={rememberPassword}
               onPress={() => setRememberPassword(!rememberPassword)}
               containerStyle={styles.checkboxContainer}
               textStyle={styles.checkboxText}
               checkedColor='black'
               uncheckedColor='rgba(128, 128, 128, 0.5)'

           />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordButtonText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signupButton} onPress={()=> navigation.navigate("Register")}>
          <Text style={styles.signupButtonText}>Registrarse</Text>
        </TouchableOpacity>
      </View>
      </View>
      <Modal isVisible={isModalVisible} onBackdropPress={() => setIsModalVisible(false)}>
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>No hay conexión a internet</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
          <Text style={styles.closeButtonText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
    <Modal isVisible={errorDatos} onBackdropPress={() => setErrorDatos(false)}>
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>Usuario o Contraseña Incorrecto</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => setErrorDatos(false)}>
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
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 27,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 30,
    paddingVertical: 50, 
    paddingHorizontal: 70,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    marginTop:-30,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    height: 50,
    width:260,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  loginButton: {
    backgroundColor: 'rgb(0, 105, 108)',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordButton: {
    marginTop: 10,
  },
  forgotPasswordButtonText: {
    color: '#999999',
  },
  signupButton: {
    marginTop: 20,
  },
  signupButtonText: {
    color: 'rgb(0, 105, 108)',
    fontSize: 16,
    fontWeight: 'bold',
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
    backgroundColor: 'rgb(0, 105, 108)',
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
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
    marginLeft: 0,
  },
  checkboxText: {
    color: 'black'
  },
});

export default Login;
