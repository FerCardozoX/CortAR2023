import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import axios from 'axios';
import {  Icon } from 'react-native-elements';
import { BackHandler } from 'react-native'; // Importa BackHandler

const Home = ({ navigation, route }) => {
  const datos = route.params
  const [likes, setLikes] = useState({});
  const [Publicaciones, setPublicaciones] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
  
    axios.get('https://cortar.onrender.com/CortAR/getPublicaciones/'+datos.datos.mail+'/'+datos.datos.keyValidate+'')
      .then(response => {
        const reversedPublicaciones = response.data.reverse();
        setPublicaciones(reversedPublicaciones);
        setRefreshing(false);
      })
      .catch(error => {
        console.error('Error al obtener las publicaciones:', error);
        setRefreshing(false);
      });
  };
  
  useEffect(() => {
    handleRefresh()
    fetchPublicaciones();
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      backHandler.remove();
    };
  }, []);

  const fetchPublicaciones = () => {
    axios.get('https://cortar.onrender.com/CortAR/getPublicaciones/'+datos.datos.mail+'/'+datos.datos.keyValidate+'')
      .then(response => {
        const reversedPublicaciones = response.data.reverse();
        setPublicaciones(reversedPublicaciones);
        const likesInfo = {};
      reversedPublicaciones.forEach(publicacion => {
        likesInfo[publicacion.idPublicacion] = publicacion.likeo;
      });
      setLikes(likesInfo);
      })
      .catch(error => {
        console.error('Error al obtener las publicaciones:', error);
      });
  };

  const handleBackPress = () => {

    BackHandler.exitApp(); 
    return true; 
  };
  

  const handleLike = (idPublicacion) => {
    axios.post('https://cortar.onrender.com/CortAR/actualizarLikesPublicacion', 
    {
      id: idPublicacion,
      likes: isLiked(idPublicacion) ? -1 : 1, // Usa isLiked para determinar si ya le diste "like"
      mail: datos.datos.mail,
      key: datos.datos.keyValidate
    })
      .then(response => {
        setLikes(prevLikes => ({
          ...prevLikes,
          [idPublicacion]: !isLiked(idPublicacion) // Invierte el valor
        }));
      })
      .catch(error => {
        console.error('Error al obtener las publicaciones:', error);
      });
  };
  

  const isLiked = (idPublicacion) => {
    return likes[idPublicacion] === true; // Compara el valor
  };
  

  const handleNuevaPublicacion = () => {
    navigation.navigate('Publicar', { datos: datos });
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.publicacionContainer}>
      <View style={styles.usuarioInfo}>
      <Image source={{ uri: item.usuarioFoto }} style={styles.fotoUsuario} />
      <View style={styles.usuariofecha}>
        <Text style={styles.nombreUsuario}>{item.usuario}</Text>
        <Text style={styles.zone}>{item.fecha}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.location}>
        <View style={styles.icon}>
        <Icon
            name="location-sharp" // Nombre del icono de ubicación
            type="ionicon" // Tipo de ícono
            size={20} // Tamaño del ícono
            color="black" // Color del ícono
          />
          </View>
          <Text style={styles.zone}>{item.zona}</Text>
      </TouchableOpacity>
            <Text style={styles.titulo}> {item.titulo}</Text>
      <Text style={styles.contenido}>{item.texto}</Text>
      {item.foto && <Image source={{ uri: item.foto }} style={styles.fotoPublicacion} />}
      <Text style={styles.contenido}>{item.sugerencia}</Text>
      <View style={styles.botonesContainer}>
      <TouchableOpacity onPress={() => handleLike(item.idPublicacion)} style={[styles.boton, styles.likeButton]}>
             <Icon
                  name={likes[item.idPublicacion] ? 'thumbs-up' : 'thumbs-o-up'}
                  type='font-awesome'
                    color={likes[item.idPublicacion] ? 'rgb(0, 105, 108)' : 'black'}
                      size={20}
                     />
              <Text style={styles.likesText}>{item.like}</Text>
       </TouchableOpacity>

        <TouchableOpacity style={[styles.boton, styles.commentButton]} onPress={() => navigation.navigate("Comentarios", {datos:datos.datos, info: item.comentarios, infopub: item.idPublicacion})}>
          <Text style={styles.botonText}>Comentar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.boton, styles.shareButton]}>
          <Text style={styles.botonText}>Compartir</Text>
        </TouchableOpacity>
      </View>
    </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: 'rgb(0, 105, 108)' }]}>
      <FlatList
        data={Publicaciones}
        keyExtractor={item => item.idPublicacion}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      />
      <TouchableOpacity style={styles.floatingButton} onPress={handleNuevaPublicacion}>
        <Icon
          name="plus"
          type="font-awesome"
          color="#ffffff"
          size={30}
        />
      </TouchableOpacity>
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
  fotoPublicacion: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 8,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },zone: {
    fontSize: 18,
    marginBottom: 8,
  },
  contenido: {
    fontSize: 16,
  },
  botonesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  likeButton: {
    backgroundColor: '#f5f5f5',
  },
  commentButton: {
    backgroundColor: '#f5f5f5',
  },
  shareButton: {
    backgroundColor: '#f5f5f5',
  },
  botonText: {
    fontSize: 16,
    color: 'black',
    marginLeft: 8,
  },
  likesText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
    color: 'rgb(0, 105, 108)',
  },floatingButton: {
    position: 'absolute', 
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: 'rgb(0, 105, 108)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    zIndex: 1, 
  },location:{
      flexDirection: 'row',
      alignItems: 'center',
  },
  icon: {
    marginRight: 5,
    marginTop:-5
  },
  usuariofecha: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Alinea elementos a los extremos
    alignItems: 'center', // Centra verticalmente los elementos
    flex: 1,
  },
});

export default Home;
