import { useAuth } from '@/context/context';
import { PredictionResult } from '@/interfaces/interfaces';
import { supabase } from '@/services/supabase'; // Adjust import path as needed
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_BASE_URL } from '../../constants/config';

declare global {
  interface FormData {
    append(
      name: string,
      value: { uri: string; name: string; type: string } | Blob | File,
      fileName?: string
    ): void;
  }
}

const AudioClassifier = () => {
  const { user } = useAuth();
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [audioName, setAudioName] = useState<string>('');
  const [webFile, setWebFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [predictedDrone, setPredictedDrone] = useState<PredictionResult | null>(null);
  // classInProg tells whether classification is in progress (file is uploaded, before is classified) 
  // to determine whether to show "Browse Files" or "Change File" button text
  const [classInProg, setClassInProg] = useState<boolean>(false);

  const pickAudio = async () => {
    let result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*', 
    });

    if (!result.canceled) {
        setAudioUri(result.assets[0].uri);
        setAudioName(result.assets[0].name);
        
        // NEW: Save the actual web File object if it exists
        if (result.assets[0].file) {
        setWebFile(result.assets[0].file);
        }
        
        setClassInProg(true);
    }
  };

  const handleAnalyze = async () => {
    if (!audioUri) return;
    setIsLoading(true);
    
    const result = await uploadAudio(audioUri, audioName, webFile);
    
    if (result) {
      setPredictedDrone(result);
      const { error } = await supabase.from('classifications').insert([
        { 
          drone_model: result.drone_model, 
          confidence: result.confidence,
          user_id: user?.id, 
          filename: audioName,
          isaudio: true,
        }
      ]);

      if (error) console.error("Failed to save to database:", error);
    } else {
      Alert.alert("Analysis failed", "Make sure your Flask server is running.");
    }
    
    setIsLoading(false);
    setClassInProg(false);
  }

  const uploadAudio = async (uri: string, filename: string, fileObj: File | null): Promise<PredictionResult | null> => {
    try {
        let formData = new FormData();

        // 1. Handle the file payload based on platform
        if (Platform.OS === 'web' && fileObj) {
            // WEB: Append the native File object directly. No fetching needed.
            formData.append('file', fileObj, filename);
        } else {
            // MOBILE: Use the fetch-to-blob workaround
            const localResponse = await fetch(uri);
            const blob = await localResponse.blob();
            formData.append('file', blob, filename);
        }

        // 2. Send to Flask
        // IMPORTANT: If testing on Web, use 'http://127.0.0.1:5000/predict_audio' 
        // If testing on a physical phone, keep your IP address (e.g., 'http://192.168.x.x:5000...')
        let response = await fetch(`${API_BASE_URL}/predict_audio`, {
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
            <Text style={styles.title}>Audio Classifier</Text>
            <View style={styles.box}>
                <Text style={styles.content}>Choose an audio file.</Text>
                <Ionicons 
                    name={'musical-notes-outline'} 
                    size={50} 
                    color={'#0373BB'}      
                />
                <Text style={styles.subtext}>WAV, MP3 accepted.</Text>
                {/* browse files button here **************** */}
                {audioName !== '' && <Text style={styles.fileName}>{audioName}</Text>}

                <Pressable style={styles.button} onPress={pickAudio}>
                    <Text style={styles.buttonText}>{(audioUri && classInProg) ? "Change file" : "Browse files"}</Text>
                </Pressable>

                {audioUri && (
                  <Pressable 
                      style={[styles.button, {backgroundColor: isLoading ? 'grey' : '#F68B43' }]} 
                      onPress={handleAnalyze}
                      disabled={isLoading}
                  >
                      <Text style={styles.buttonText}>
                      {isLoading ? "Analyzing..." : "Upload & Analyze"}
                      </Text>
                  </Pressable>
                )}

                {/* NEW: Actually render the result to the user */}
                {isLoading && <ActivityIndicator size="large" color="#0373BB" style={styles.activityIndicator} />}
                
                {predictedDrone && !isLoading && (
                  <View style={styles.resultContainer}>
                      <Text style={styles.resultText}>Detected: {predictedDrone.drone_model}</Text>
                      <Text style={styles.resultSubtext}>Confidence: {predictedDrone.confidence}</Text>
                  </View>
                )}

                <Text style={styles.description}>The audio classifier converts {"\n"} WAV and 
                    MP3 audio files to MFCC {"\n"} and classifies them using the CRNN model {"\n"}
                    hosted on Flask.
                </Text>
            </View>
        </SafeAreaView>
    </ScrollView>
  )
}

export default AudioClassifier

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(11, 10, 16, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: 20,
  },
  title: {
    color:'#66C8D2',
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    // fontFamily: 'San Francisco',
    marginBottom: 20,
    // marginTop: 50,
  },
  box: {
    color: 'rgba(39, 37, 50, 0.92)',
    // height: 300,
    // width: 300,
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
    margin: 20,
  },
  fileName: {
    color: '#fff',
    fontSize: 15,
  },
  largeLogo: {
    width: 115,
    height: 100,
    marginTop: 20,
    alignSelf: 'center',
  },
  button: {
    borderColor: '#0373BB',
    borderWidth: 2,
    borderRadius: 12, 
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#024570',
    margin: 15,
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