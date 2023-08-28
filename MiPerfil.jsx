import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

const MiPerfil = ({ navigation, route }) => {
  const datos = route.params;
  const [profileImageUri, setProfileImageUri] = useState(null);


  useEffect(() => {
    console.log(datos.datos)
    setProfileImageUri(datos.datos.fotoPerfil)
  }, []);
  const handleCambiarFoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        // Usar result.assets para acceder a las imágenes seleccionadas
        if (result.assets.length > 0) {
          setProfileImageUri(result.assets[0].uri);
        }
      

        axios.post('https://cortar.onrender.com/CortAR/editarFotoPerfil', {
          mail: datos.datos.mail,
          key: datos.datos.keyValidate,
          imagen: profileImageUri,
        })
        .then(response => {
          console.log('Foto de perfil actualizada:', response.data);
        })
        .catch(error => {
          console.error('Error al actualizar foto de perfil:', error);
        });
      }
    } catch (error) {
      console.log('Error al seleccionar la imagen:', error);
    }
  };

  const handleChangePassword = () => {
    navigation.navigate('CambioContraseña');
  };

  const handleCerrarSesion = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
       <View style={styles.header}>
      <Text style={styles.headerText}>Hola {datos.datos.nombre}!</Text>
    </View>
      <View style={styles.profileSection}>
        <TouchableOpacity style={styles.profileImageWrapper} onPress={handleCambiarFoto}>
          <View style={styles.profileImage}>
            <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
          </View>
        </TouchableOpacity>
        <Icon type="font-awesome" name="camera" size={30} color="rgba(0, 105, 108, 0.8)" />
      </View>

      <TouchableOpacity onPress={handleChangePassword} style={styles.boton}>
        <Text style={styles.botonTexto}>Cambiar Contraseña</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleCerrarSesion} style={styles.boton}>
        <Icon type="font-awesome" name="sign-out" size={20} color="white" />
        <Text style={styles.botonTexto}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImageWrapper: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: 'hidden',
    marginBottom: 15,
    borderColor: 'rgba(0, 105, 108, 0.8)',
    borderWidth: 3,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 80,
    overflow: 'hidden',
  },
  boton: {
    backgroundColor: 'rgb(0, 105, 108)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 6,
    marginBottom: 15,
  },
  botonTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

export default MiPerfil;
