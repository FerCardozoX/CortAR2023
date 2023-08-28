import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Picker } from 'react-native';
import { Card, Button } from 'react-native-elements';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

const Publicar = ({ navigation, route }) => {
  const info = route.params;
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [sugerencia, setSugerencia] = useState('');
  const [imagen, setImagen] = useState(null);
  const [zonas, setZonas] = useState([]);
  const [zonaSeleccionada, setZonaSeleccionada] = useState('');

  const usuario = {
    mail: info.datos.datos.mail,
    key: info.datos.datos.keyValidate,
    nombreUsuario: info.datos.datos.nombre,
    fotoPerfil: info.datos.datos.fotoPerfil,
  };

  useEffect(() => {
    axios.get('https://apis.datos.gob.ar/georef/api/municipios?provincia=06&campos=nombre&max=135')
      .then(response => {
        const municipios = response.data.municipios;
        const zonasOrdenadas = municipios.sort((a, b) => a.nombre.localeCompare(b.nombre));
        setZonas(zonasOrdenadas);
      })
      .catch(error => {
        console.log('Error al obtener las zonas:', error);
      });
  }, []);
  

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
          setImagen(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.log('Error al seleccionar la imagen:', error);
    }
  };
  const handlePublicar = async () => {
    try {
      const formData = new FormData();
      formData.append('mail', usuario.mail);
      formData.append('key', usuario.key);
      formData.append('texto', contenido);
      formData.append('titulo', titulo);
      formData.append('zona', zonaSeleccionada);
      formData.append('sugerencia', sugerencia);

      
      // Agregar la imagen al formData si está presente
      if (imagen) {
        const responses = await fetch(imagen);
        const blob = await responses.blob();
        formData.append('imagen', blob, 'image.jpg');
      
      
      const response = await axios.post(
        'https://cortar.onrender.com/CortAR/crear_publicacionFoto',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      if (response.status = 201) {
        console.log('La publicación fue realizada con éxito.');
        navigation.navigate("Home")
      } else {
        const errorData = (await response).data;
        console.error('Error al crear publicación:', errorData);
      }
    }else{
        const response = await axios.post(
        'https://cortar.onrender.com/CortAR/crear_publicacion',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      if (response.status = 201) {
        console.log('La publicación fue realizada con éxito.');
        navigation.navigate("Home")
      } else {
        const errorData = (await response).data;
        console.error('Error al crear publicación:', errorData);
      }

      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: 'rgb(0, 105, 108)' }]}>
      <Card containerStyle={styles.card}>
        <View style={styles.encabezado}>
          <Image source={{ uri: usuario.fotoPerfil }} style={styles.fotoPerfil} />
          <Text style={styles.nombreUsuario}>{usuario.nombreUsuario}</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="¿Qué sucedió?"
          value={titulo}
          onChangeText={setTitulo}
        />
        <Picker
            selectedValue={zonaSeleccionada}
            onValueChange={(itemValue) => setZonaSeleccionada(itemValue)}
            style={styles.input}
         >
             <Picker.Item label="¿Dónde sucedió?" value="" />
              {zonas.map((zona) => (
           <Picker.Item key={zona.id} label={zona.nombre} value={zona.nombre} />
            ))}
        </Picker>

        <TextInput
          style={[styles.input, styles.contenidoInput]}
          placeholder="Cuéntanos la situación"
          value={contenido}
          onChangeText={setContenido}
          multiline
        />
        <TextInput
          style={[styles.input, styles.contenidoInput]}
          placeholder="¿Qué nos sugieres hacer?"
          value={sugerencia}
          onChangeText={setSugerencia}
          multiline
        />

        {imagen && <Image source={{ uri: imagen }} style={styles.imagenPreview} />}
        <TouchableOpacity style={styles.botonSeleccionarImagen} onPress={handleSeleccionarImagen}>
          <Text style={styles.botonText}>Seleccionar Imagen</Text>
        </TouchableOpacity>
        <Button
          title="Publicar"
          buttonStyle={styles.botonPublicar}
          titleStyle={styles.botonText}
          onPress={handlePublicar}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  fotoPerfil: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  nombreUsuario: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#000000',
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
    marginTop: -30,
  },
  input: {
    height: 50,
    width: 260,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  contenidoInput: {
    height: 100, // Ajusta la altura del campo de contenido según tus necesidades
  },
  imagenPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 10,
  },
  botonSeleccionarImagen: {
    backgroundColor: 'rgb(0, 105, 108)',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  botonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botonPublicar: {
    backgroundColor: 'rgb(0, 105, 108)',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default Publicar;

