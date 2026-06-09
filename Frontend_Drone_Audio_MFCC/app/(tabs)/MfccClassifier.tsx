import { PredictionResult } from '@/interfaces/interfaces';
import { supabase } from '@/services/supabase';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_BASE_URL } from '../../constants/config';
import { useAuth } from '@/context/context';

declare global {
  interface FormData {
    append(
      name: string,
      value: { uri: string; name: string; type: string },
      fileName?: string
    ): void;
  }
}

const MfccClassifier = () => {
  const { user } = useAuth();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [predictedDrone, setPredictedDrone] = useState<PredictionResult | null>(null);
  const [classInProg, setClassInProg] = useState<boolean>(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setImageUri(asset.uri);

      // Extract filename and store it
      const extractedName = asset.fileName || asset.uri.split('/').pop() || 'image.jpg';
      setFileName(extractedName);
    }

    setClassInProg(true);
  };

  const handleAnalyze = async (uri: string) => {
    setIsLoading(true);
    
    const result = await uploadMFCC(uri);
    
    if (result) {
      setPredictedDrone(result);

      const { error } = await supabase.from('classifications').insert([
        { 
          drone_model: result.drone_model, 
          confidence: result.confidence,
          user_id: user?.id, 
          filename: fileName,
          isaudio: false,
        }
      ]);

      if (error) console.error("Failed to save to database:", error);
    } else {
      alert("Analysis failed. Make sure your Flask server is running.");
    }
    
    setIsLoading(false);
    setClassInProg(false);
  }

  const uploadMFCC = async (imageUri: string): Promise<PredictionResult | null> => {
    try {
      let formData = new FormData();

      const localResponse = await fetch(imageUri);
      const blob = await localResponse.blob();

      formData.append('file', blob, fileName || 'mfcc.jpg');

      let response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server returned ${response.status}: ${errorText}`);
      }

      let json = await response.json();

      return {
        drone_model: json.drone_model,
        confidence: json.confidence
      };
      
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    }
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>MFCC Classifier</Text>
        <View style={styles.box}>
          <Text style={styles.content}>Choose an MFCC file.</Text>
          <Ionicons 
              name={'image-outline'} 
              size={50} 
              color={'#0373BB'}      
          />
          <Text style={styles.subtext}>PNG, JPG, JPEG accepted.</Text>
          
          {/* Render the extracted filename safely */}
          {fileName !== '' && <Text style={styles.fileName}>{fileName}</Text>}
          
          <Pressable style={styles.button} onPress={pickImage}>
              <Text style={styles.buttonText}>{(imageUri && classInProg) ? "Change file" : "Browse files"}</Text>
          </Pressable>
          
          {/* Check against imageUri to safely render the button without string evaluation crashes */}
          {imageUri !== null && (
            <Pressable 
              style={[styles.button, {backgroundColor: isLoading ? 'grey' : '#F68B43' }]} 
              onPress={() => handleAnalyze(imageUri)} 
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Analyzing..." : "Upload & Analyze"}
              </Text>
            </Pressable>
          )}

          {isLoading && <ActivityIndicator size="large" color="#0373BB" style={styles.activityIndicator} />}
          
          {predictedDrone && !isLoading && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>Detected: {predictedDrone.drone_model}</Text>
              <Text style={styles.resultSubtext}>Confidence: {predictedDrone.confidence}</Text>
            </View>
          )}

          <Text style={styles.description}>The MFCC Classifier classifies the {"\n"} MFCC images using the CRNN hosted {"\n"} in Flask.</Text>
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}

export default MfccClassifier

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(11, 10, 16, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: 20,
  },
  title: {
    color:'#4fb17f',
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 50,
  },
  box: {
    color: 'rgba(39, 37, 50, 0.92)',
    borderColor: '#024570',
    borderWidth: 2,
    borderRadius: 12, 
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 20,
  },
  description:{
    color: '#A9A9A9',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  subtext: {
    color: '#A9A9A9',
    fontSize: 15,
    textAlign: 'center',
    margin: 30,
  },
  fileName: {
    color: '#fff',
    fontSize: 15,
  },
  button: {
    borderColor: '#0373BB',
    borderWidth: 2,
    borderRadius: 12, 
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#024570',
    margin: 20,
    width: 300,
  },
  activityIndicator: {
    margin: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    margin: 30,
    fontSize: 25,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#1c1a26',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  resultText: {
    color: '#4fb17f',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resultSubtext: {
    color: '#fff',
    fontSize: 16,
  }
})