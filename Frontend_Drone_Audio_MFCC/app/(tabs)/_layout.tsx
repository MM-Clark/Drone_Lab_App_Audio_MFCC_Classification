import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useAuth } from '../../context/context';

// ----- tabs _layout ---------------------

export default function TabLayout() {
    const{logout}=useAuth();

  return (
    <Tabs
      screenOptions={{
        headerStyle:{
          backgroundColor: '#272532EB',
          height: 120,
        },
        headerTintColor: '#E5E4E2',
        tabBarActiveTintColor: '#D8DC24',
        tabBarInactiveTintColor: '#E5E4E2',
        tabBarStyle:{
          backgroundColor:'#272532EB',
        },
        
      }}
      >
      <Tabs.Screen
        name="index"
        options={{
          title:'HOME',
          headerShown:true,
          tabBarIcon: ({focused, color}) => ( 
              // use npm install @react-native-vector-icons/ionicons to download package in terminal
              <Ionicons 
                  name={focused ? 'home' : 'home-outline'} 
                  size={24} 
                  color={color}      
              />
          ), 
          headerLeft: () => (
            <Image
              source={require('../../assets/images/theDroneLab_Logo_TransparentBackground.png')}
              style={styles.logo}
            />
          ),
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <View style={styles.buttonContainer}>
                <Pressable onPress={logout} style={styles.logout}>
                  <Ionicons name="log-out-outline" size={30} color="#fef5ee"/>
                  {/* <Text style={styles.logoutText}>Logout</Text> */}
                </Pressable>
              </View>
              <Image
                source={require('../../assets/images/CofC_Transparent_Logo.png')}
                style={styles.logo}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="AudioClassifier"
        options={{
          title: 'AUDIO',
          headerShown: true,
          tabBarIcon: ({focused, color}) => ( 
            <Ionicons 
              name={focused ? 'musical-notes' : 'musical-notes-outline'} 
              size={24} 
              color={color}      
            />
          ), 
          headerLeft: () => (
            <Image
              source={require('../../assets/images/theDroneLab_Logo_TransparentBackground.png')}
              style={styles.logo}
            />
          ),
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <View style={styles.buttonContainer}>
                <Pressable onPress={logout} style={styles.logout}>
                  <Ionicons name="log-out-outline" size={30} color="#fef5ee"/>
                  {/* <Text style={styles.logoutText}>Logout</Text> */}
                </Pressable>
              </View>
              <Image
                source={require('../../assets/images/CofC_Transparent_Logo.png')}
                style={styles.logo}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="MfccClassifier"
        options={{
          title: 'MFCC',
          headerShown: true,
          tabBarIcon: ({focused, color}) => ( 
            <Ionicons 
              name={focused ? 'image' : 'image-outline'} 
              size={24} 
              color={color}      
            />
          ), 
          headerLeft: () => (
            <Image
              source={require('../../assets/images/theDroneLab_Logo_TransparentBackground.png')}
              style={styles.logo}
            />
          ),
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <View style={styles.buttonContainer}>
                <Pressable onPress={logout} style={styles.logout}>
                  <Ionicons name="log-out-outline" size={30} color="#fef5ee"/>
                  {/* <Text style={styles.logoutText}>Logout</Text> */}
                </Pressable>
              </View>
              <Image
                source={require('../../assets/images/CofC_Transparent_Logo.png')}
                style={styles.logo}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="History"
        options={{
          title: 'HISTORY',
          headerShown: true,
          tabBarIcon: ({focused, color}) => ( 
            <Ionicons 
              name={focused ? 'list' : 'list-outline'} 
              size={24} 
              color={color}      
            />
          ),
          headerLeft: () => (
            <Image
              source={require('../../assets/images/theDroneLab_Logo_TransparentBackground.png')}
              style={styles.logo}
            />
          ), 
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <View style={styles.buttonContainer}>
                <Pressable onPress={logout} style={styles.logout}>
                  <Ionicons name="log-out-outline" size={30} color="#fef5ee"/>
                  {/* <Text style={styles.logoutText}>Logout</Text> */}
                </Pressable>
              </View>
              <Image
                source={require('../../assets/images/CofC_Transparent_Logo.png')}
                style={styles.logo}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 60, 
    height: 47, 
    marginTop: 35, 
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 35,
    resizeMode: 'contain',
    // alignContent: 'center',
  },
  headerRightContainer: {
    flexDirection: 'row',
  },
  buttonContainer: {
    borderColor: '#945b34',
    borderWidth: 2,
    borderRadius: 30, 
    backgroundColor: '#311e11',
    marginTop: 30,
    marginBottom: 30,
    height: 60,
  },
  logout:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  logoutText: {
    color: '#fef5ee',
    // textAlign: 'center',
    fontSize: 17,
    marginLeft: 5,
    marginRight: 5,
  },
})
