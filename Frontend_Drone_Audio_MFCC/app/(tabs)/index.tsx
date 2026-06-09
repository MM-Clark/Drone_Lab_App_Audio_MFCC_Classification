import { useAuth } from '@/context/context';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
  
  const {logout} = useAuth();
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.fakeHeader}>
        <View style={styles.buttonContainer}>
          <Pressable onPress={logout} style={styles.logout}>
            <Ionicons name="log-out-outline" size={41} color="#f9b689"/>
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.mainContent}>
        <Image
          style={styles.largeLogo}
          source = {require('../../assets/images/theDroneLab_Logo_TransparentBackground.png')}
        />
        <Text style={styles.title}>Welcome to the Drone MFCC Audio Classifier!</Text>
        <Text style={styles.content}>Use the Upload tab for classification, and view 
            result history with the History tab.</Text>
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(11, 10, 16, 0.92)',
    flex: 1,
    padding: 20,
  },
  mainContent: {
    // backgroundColor: 'rgba(11, 10, 16, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: 20,
  },
  fakeHeader:{
    width: '100%',
    justifyContent:'flex-end',
    alignItems:'flex-end',
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingTop: 10,
    zIndex: 10,
  },
  buttonContainer: {
    borderColor: '#945b34',
    borderWidth: 2,
    borderRadius: 40, 
    backgroundColor: '#311e11',
  },
  logout:{
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  logoutText: {
    color: '#f9b689',
    textAlign: 'center',
    fontSize: 20,
    marginLeft: 5,
    marginRight: 10,
  },
  title: {
    color:'#fff', // #5cb4bd, #f79756
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    // fontFamily: 'San Francisco',
  },
  content: {
    color: '#A9A9A9',
    textAlign: 'center',
    fontSize: 20,
    marginTop: 30,
  },
  largeLogo: {
    width: 230,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  }
})