import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';

import { useDatos } from './DatosContext';

import Home from './Home';
import Ubicacion from './Ubicacion';
import MiPerfil from './MiPerfil';

const Tab = createBottomTabNavigator();

function HomeTabs() {
  const { datos } = useDatos();

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Ubicacion') {
              iconName = 'star';
            } else if (route.name === 'MiPerfil') {
              iconName = 'person';
            }

            // Devuelve el componente Icon con el ícono correspondiente
            return <Icon name={iconName} color={color} size={size} />;
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          initialParams={{ datos }}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Ubicacion"
          component={Ubicacion}
          initialParams={{ datos }}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="MiPerfil"
          component={MiPerfil}
          initialParams={{ datos }}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </View>
  );
}

export default HomeTabs;
