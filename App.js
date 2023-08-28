import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CustomHeader } from './barraNavegacion';
import { DatosProvider } from './DatosContext';

import Principal from './Principal';
import Login from './Login';
import Register from './Register';
import HomeTabs from './HomeTabs';
import Publicar from './Publicar';
import Comentarios from './Comentarios';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <DatosProvider>
        <Stack.Navigator initialRouteName="Principal">
          <Stack.Screen name="Principal" component={Principal} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
          <Stack.Screen name="Publicar" component={Publicar} options={{ headerShown: true }} />
          <Stack.Screen name="Comentarios" component={Comentarios} options={{ headerShown: true }} />
          <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ header: CustomHeader }} />
        </Stack.Navigator>
      </DatosProvider>
    </NavigationContainer>
  );
}
