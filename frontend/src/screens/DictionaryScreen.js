import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function DictionaryScreen() {
  const [signs, setSigns] = useState([]);

  useEffect(() => {
    fetch('http://192.168.0.25:3000/api/signs')
      .then(response => response.json())
      .then(data => setSigns(data.signs))
      .catch(error => console.error('Error al cargar gestos:', error));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Diccionario de Señas</Text>
      {signs.length > 0 ? (
        <FlatList
          data={signs}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.signItem}>
              <Text style={styles.signText}>{item}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.loadingText}>Cargando señas...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  signItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  signText: {
    fontSize: 16,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});