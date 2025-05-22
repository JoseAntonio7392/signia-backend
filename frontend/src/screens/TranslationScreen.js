import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Camera } from 'expo-camera';

export default function TranslationScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [prediction, setPrediction] = useState('');
  const cameraRef = useRef(null);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      } catch (error) {
        console.log('Error al solicitar permisos:', error);
        setHasPermission(false);
      }
    })();
  }, []);

  useEffect(() => {
    let interval;
    if (isTranslating && cameraRef.current) {
      interval = setInterval(async () => {
        try {
          if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
            if (photo && photo.uri) {
              fetch('http://192.168.0.25:3000/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: photo.uri }),
              })
                .then(response => response.json())
                .then(data => setPrediction(data.prediction || 'Sin predicción'))
                .catch(error => console.log('Error en fetch:', error));
            }
          }
        } catch (error) {
          console.log('Error al tomar foto:', error);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isTranslating]);

  const toggleTranslation = () => {
    setIsTranslating(prev => !prev);
  };

  if (hasPermission === null) {
    return <Text>Cargando permisos...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No se tiene acceso a la cámara. Habilitar en Configuración.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Traducción en Tiempo Real</Text>
      <View style={styles.cameraContainer}>
        {Camera && (
          <Camera
            style={styles.camera}
            type={Camera.Constants?.Type?.front || 'front'} // Fallback si no está definido
            ref={cameraRef}
          />
        )}
      </View>
      <Button
        title={isTranslating ? 'Detener Traducción' : 'Iniciar Traducción'}
        onPress={toggleTranslation}
        color={isTranslating ? '#FF3B30' : '#007AFF'}
      />
      <Text style={styles.prediction}>
        {prediction || 'Esperando detección...'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  cameraContainer: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  camera: { flex: 1 },
  prediction: { fontSize: 18, textAlign: 'center', marginTop: 20, color: '#007AFF' },
});