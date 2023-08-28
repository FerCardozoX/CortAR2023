import React, { useState,useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import axios from 'axios'

const Comentarios = ({ route }) => {
  const { datos, info, infopub } = route.params;
  const [infoUsuario] = useState(datos);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");

  useEffect(() => {
    console.log(datos)
        setComentarios(info)
  }, []);

  const handleNuevoComentario = async () => {
    try {
      const formData = new FormData();
      formData.append('mail', infoUsuario.mail);
      formData.append('key', infoUsuario.keyValidate);
      formData.append('texto', nuevoComentario);
      formData.append('idPublicacion', infopub);

      const response = await axios.post(
        'https://cortar.onrender.com/CortAR/crear_comentario',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  

      if (response.status === 201) {
        // Actualizar la lista de comentarios con el nuevo comentario
        const nuevoComentarioObj = {
          idComentario: comentarios.length + 1,
          usuarioFoto: infoUsuario.usuarioFoto,
          usuario: infoUsuario.nombre,
          fecha: new Date().toISOString(),
          texto: nuevoComentario,
        };
        setComentarios([...comentarios, nuevoComentarioObj]);

        // Limpiar el campo de entrada de texto
        setNuevoComentario("");
      } else {
        
        console.error('Error al agregar el comentario:', response.data.error);
      }
    } catch (error) {
      console.error('Error al enviar la petición:', error);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity>
      <View style={styles.comentarioContainer} key={item.idComentario}>
        <Image source={{ uri: item.usuarioFoto }} style={styles.fotoUsuario} />
        <View style={styles.usuarioFechaContainer}>
          <View style={styles.usuariofecha}>
            <Text style={styles.nombreUsuario}>{item.usuario}</Text>
            <Text style={styles.zone}>{item.fecha}</Text>
          </View>
          <Text style={styles.contenido}>{item.texto}</Text>
        </View>
      </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={comentarios}
        keyExtractor={(item) => item.idComentario.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <View style={styles.agregarComentarioContainer}>
        <TextInput
          style={styles.comentarioInput}
          placeholder="Escribe un comentario..."
          value={nuevoComentario}
          onChangeText={(text) => setNuevoComentario(text)}
        />
        <TouchableOpacity style={styles.enviarButton} onPress={handleNuevoComentario}>
          <Text style={styles.enviarButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  publicacionContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  usuarioInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fotoUsuario: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  nombreUsuario: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  comentarioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
  },
  comentarioInput: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  enviarButton: {
    marginLeft: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgb(0, 105, 108)',
  },
  enviarButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgb(0, 105, 108)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    zIndex: 1,
  },
  usuariofecha: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Alinea elementos a los extremos
    alignItems: 'center', // Centra verticalmente los elementos
    flex: 1,
  },
  nombreUsuario: {
    fontSize: 23,
    fontWeight: 'bold',
    marginTop:6,
  },zone: {
    fontSize: 18,
    marginBottom: 8,
  },
  contenido: {
    marginTop:4,
    fontSize: 18,
  },

  comentarioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  usuarioFechaContainer: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
});

export default Comentarios;