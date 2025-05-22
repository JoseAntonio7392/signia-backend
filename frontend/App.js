import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRegistry } from 'react-native';  // Importar AppRegistry
import HomeScreen from './src/screens/HomeScreen';
import DictionaryScreen from './src/screens/DictionaryScreen';
import TranslationScreen from './src/screens/TranslationScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Signia' }} />
        <Stack.Screen name="Dictionary" component={DictionaryScreen} options={{ title: 'Diccionario de Señas' }} />
        <Stack.Screen name="Translation" component={TranslationScreen} options={{ title: 'Traducción' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Registrar el componente principal
AppRegistry.registerComponent('main', () => App);

export default App;