import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signia</Text>
      <Text style={styles.subtitle}>Aprende y traduce lenguaje de señas</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Diccionario de Señas"
          onPress={() => navigation.navigate('Dictionary')}
          color="#007AFF"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Traducción"
          onPress={() => navigation.navigate('Translation')}
          color="#007AFF"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    marginVertical: 10,
    width: '80%',
  },
});