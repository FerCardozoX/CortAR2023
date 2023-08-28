import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import {  Button, Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

const Register = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState({ day: '', month: '', year: '' });
  const [profileImage, setProfileImage] = useState(null);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  const dayInputRef = useRef(null);
  const monthInputRef = useRef(null);
  const yearInputRef = useRef(null);
  const [errorMessages, setErrorMessages] = useState({
    name: '',
    birthDate: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: '',
  });

  const handleSeleccionarImagen = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        // Usar result.assets para acceder a las imágenes seleccionadas
        if (result.assets.length > 0) {
          setProfileImage(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.log('Error al seleccionar la imagen:', error);
    }
  };

  const handleRegister =  async () => {
    const errors = {};

    // Validar campos obligatorios
    if (!name.trim()) {
      errors.name = 'Nombre es obligatorio';
    }

    if (!birthDate.day || !birthDate.month || !birthDate.year) {
      errors.birthDate = 'Fecha de nacimiento es obligatoria';
    }

    if (!email.trim()) {
      errors.email = 'Correo electrónico es obligatorio';
    }

    if (!password.trim()) {
      errors.password = 'Contraseña es obligatoria';
    }

    if (!confirmPassword.trim()) {
      errors.confirmPassword = 'Confirmar contraseña es obligatorio';
    }

    const { day, month, year } = birthDate;
    const validDay = Number(day) >= 1 && Number(day) <= 31;
    const validMonth = Number(month) >= 1 && Number(month) <= 12;
    const validYear = Number(year) < 2023 ;

    if (!validDay || !validMonth || !validYear) {
      errors.birthDate = 'Ingrese una fecha de nacimiento válida';
    }

    setErrorMessages(errors);

    if (Object.keys(errors).length > 0) {
      setIsErrorModalVisible(true);
      return;
    }else {
      try {
        const fechanac = `${birthDate.year}-${birthDate.month}-${birthDate.day}`;
        const formData = new FormData();
        formData.append('nombre', name);
        formData.append('mail', email);
        formData.append('contrasena', password);
        formData.append('fecha', fechanac);
        if (profileImage) {
          const response = await fetch(profileImage);
          const blob = await response.blob();
          const imageFile = new File([blob], 'image.jpg', { type: 'image/jpeg' });
        
          formData.append('imagen', imageFile);
        }
        

        const response =  axios.post(
          'https://cortar.onrender.com/CortAR/crear_usuarioFoto',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (response.status = 201) {
          console.log('El usuario fue creado con éxito.');
          navigation.navigate("Principal")
        } else {
          const errorData = (await response).data;
          console.error('Error al registrar usuario:', errorData);
        }

      } catch (error) {
        console.error('Error al enviar la solicitud:', error);
      }
    }
}

  const handleChangeDate = (value, field) => {
        if (value.length <= 2) {
      setBirthDate({ ...birthDate, [field]: value });
    }

    if (field === 'day' && value.length === 2) {
      monthInputRef.current.focus();
    } else if (field === 'month' && value.length === 2) {
      yearInputRef.current.focus();
    }else if (field === 'year' && value.length >= 4) {
      setBirthDate({ ...birthDate, year: parseInt(value) });
    }
  };

return(
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
  <ImageBackground source={require('./assets/images/fondo_pantallas.png')} style={styles.imageBackground}>
    <View style={styles.container}>
      <View style={styles.card}>
      <View style={styles.profileImageContainer}>
              <TouchableOpacity style={styles.profileImageWrapper} onPress={handleSeleccionarImagen}>
                <View style={styles.profileImage}>
                  {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />

                  ) : (
                    <Icon type="font-awesome" name="camera" size={40} color="rgba(0, 105, 108, 0.8)" />
                  )}
                </View>
              </TouchableOpacity>
            </View>

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          onChangeText={text => setName(text)}
          value={name}
        />
        {errorMessages.name ? <Text style={styles.errorText}>{errorMessages.name}</Text> : null}

        <View style={styles.dateInputContainer}>
          <TextInput
            style={styles.dateInput}
            placeholder="DD"
            maxLength={2}
            keyboardType="numeric"
            onChangeText={value => handleChangeDate(value, 'day')}
            ref={dayInputRef}
          />
          <Text style={styles.dateSeparator}>/</Text>
          <TextInput
            style={styles.dateInput}
            placeholder="MM"
            maxLength={2}
            keyboardType="numeric"
            onChangeText={value => handleChangeDate(value, 'month')}
            ref={monthInputRef}
          />
          <Text style={styles.dateSeparator}>/</Text>
          <TextInput
            style={styles.dateInput}
            placeholder="YYYY"
            minLength={4}
            maxLength={4}
            keyboardType="numeric"
            onChangeText={value => handleChangeDate(value, 'year')}
            ref={yearInputRef}
          />
        </View>
        {errorMessages.birthDate ? <Text style={styles.errorText}>{errorMessages.birthDate}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          onChangeText={text => setEmail(text)}
          value={email}
          keyboardType="email-address"
        />
        {errorMessages.email ? <Text style={styles.errorText}>{errorMessages.email}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          onChangeText={text => setPassword(text)}
          value={password}
          secureTextEntry
        />
        {errorMessages.password ? <Text style={styles.errorText}>{errorMessages.password}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Repetir contraseña"
          onChangeText={text => setConfirmPassword(text)}
          value={confirmPassword}
          secureTextEntry
        />
        {errorMessages.confirmPassword ? (
          <Text style={styles.errorText}>{errorMessages.confirmPassword}</Text>
        ) : null}

        <Button
          title="Crear Cuenta"
          buttonStyle={styles.registerButton}
          titleStyle={styles.registerButtonText}
          onPress={handleRegister}
        />

        <TouchableOpacity style={styles.loginButton} onPress={()=> navigation.navigate("Login")}>
          <Text style={styles.loginButtonText} >¿Ya tienes una cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </View>

    <Modal isVisible={isErrorModalVisible} onBackdropPress={() => setIsErrorModalVisible(false)}>
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>Todos los campos son obligatorios o hay errores en el formulario.</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => setIsErrorModalVisible(false)}>
          <Text style={styles.closeButtonText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  </ImageBackground>
</TouchableWithoutFeedback>
)}

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
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 50,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateInput: {
    width: 40,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    textAlign: 'center',
  },
  dateSeparator: {
    paddingHorizontal: 5,
  },
  registerButton: {
    width: '100%',
    backgroundColor: 'rgb(0, 105, 108)',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 20,
  },
  registerButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingVertical: 12,
    width: '100%',
  },
  loginButtonText: {
    color: 'rgb(0, 105, 108)',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
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
});
  

export default Register;