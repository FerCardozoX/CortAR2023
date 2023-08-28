

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Ubicacion = ({ navigation, route }) => {
  const datos = route.params;
  const [location, setLocation] = useState(null);
  const [locality, setLocality] = useState('');
  const [adminArea, setAdminArea] = useState('');
  const [Publicaciones, setPublicaciones] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [likes, setLikes] = useState({});

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setLocation({ latitude, longitude });

          fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAFYNbb08pVBKACc711HF1fmpbjNaYKiR4`)
            .then(response => response.json())
            .then(data => {
              if (data.results.length > 0) {
                const results = data.results[0].address_components;
                const localityResult = results.find(component => component.types.includes('locality'));
                const adminAreaResult = results.find(component => component.types.includes('administrative_area_level_2'));

                if (localityResult) {
                  setLocality(localityResult.short_name);
                }

                if (adminAreaResult) {
                  setAdminArea(adminAreaResult.long_name);
                }
              }
            })
            .catch(error => {
              console.error(error);
            });
        },
        (error) => {
          console.error(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://cortar.onrender.com/CortAR/getPublicacionesPorZona/${adminArea}/${datos.datos.mail}/${datos.datos.keyValidate}`);
        setPublicaciones(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (adminArea) {
      fetchData();
    }
  }, [adminArea]);


  return (
    <div>
      <h1>Usted está aquí:</h1>
      {locality && adminArea && (
        <p>
          {locality}, {adminArea}
        </p>
      )}
      <div>
        <h2>Publicaciones</h2>
        {Publicaciones.map(item => (
          <div key={item.idPublicacion} style={styles.publicacionContainer}>
            <div style={styles.usuarioInfo}>
              <img src={item.usuarioFoto} alt="Usuario" style={styles.fotoUsuario} />
              <div style={styles.usuariofecha}>
                <p style={styles.nombreUsuario}>{item.usuario}</p>
                <p style={styles.zone}>{item.fecha}</p>
              </div>
            </div>
            <div style={styles.location}>
              <div style={styles.icon}>
                Ubicación icono aquí
              </div>
              <p style={styles.zone}>{item.zona}</p>
            </div>
            <p style={styles.titulo}> {item.titulo}</p>
            <p style={styles.contenido}>{item.texto}</p>
            {item.foto && <img src={item.foto} alt="Publicación" style={styles.fotoPublicacion} />}
            <p style={styles.contenido}>{item.sugerencia}</p>
            <div style={styles.botonesContainer}>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = ({
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


export default Ubicacion;
