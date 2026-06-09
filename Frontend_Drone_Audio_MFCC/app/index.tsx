import { useAuth } from "@/context/context";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  // We only need login and register. 
  // isAuth and logout are irrelevant on this protected screen.
  const { login, register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isInLoginMode, setIsInLoginMode] = useState(true);

  const handleAuthAction = async () => {
    if (email.trim() === '') {
      Alert.alert('Enter email');
      return;
    }

    if (password.trim() === '') {
      Alert.alert('Enter password');
      return;
    }

    if (isInLoginMode) {
        const success = await login(email.trim(), password.trim());
        if (!success) {
          Alert.alert("Login Failed", "Invalid email or password. Please try again.");
        }
        // If success is true, _layout.tsx instantly redirects. No need to clear state.
    } else {
        const success = await register(email.trim(), password.trim());
        if (success) {
          Alert.alert("Success!", "Account created successfully. You are now logged in.");
        } else {
          Alert.alert("Sign Up Failed", "Could not create account. Email might already be in use.");
        }
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.title}>
          {isInLoginMode ? "Please login." : "Create an Account"}
        </Text>
        <Text style={styles.subtitle}>
          {isInLoginMode ? "Login" : "Sign Up"}
        </Text>
        
        <TextInput 
          style={styles.input}
          placeholder="email"
          placeholderTextColor="#66C8D2"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none" // CRITICAL: Prevents mobile keyboards from capitalizing the first letter of an email
          keyboardType="email-address"
        />
        
        <TextInput 
          style={styles.input}
          placeholder="password"
          placeholderTextColor="#0373BB"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        
        <Pressable
          style={({pressed}) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleAuthAction}
        >
          <Text style={styles.buttonText}>
            {isInLoginMode ? 'Login' : 'Sign Up'}
          </Text>
        </Pressable>

        <Pressable 
          style={styles.toggleButton} 
          onPress={() => setIsInLoginMode(!isInLoginMode)}
        >
          <Text style={styles.toggleText}>
            {isInLoginMode ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(11, 10, 16, 0.92)',
  },
  title:{
    textAlign:'center',
    fontSize:26,
    fontWeight:'bold',
    marginBottom:10,
    color:'#D8DC24',
  },
  subtitle:{
    fontSize:14,
    textAlign:'center',
    marginBottom:20,
    color:'#038F48',
  },
  card:{
    backgroundColor:'rgba(39, 37, 50, 0.92)',
    borderRadius:20,
    padding:20,
    width:'90%',
    marginTop:-100,
  },
  input:{
    borderWidth:1,
    borderColor:'black',
    borderRadius:12,
    paddingVertical:12,
    paddingHorizontal:14,
    fontSize:16,
    marginBottom:16,
    backgroundColor:'white',
    fontWeight:'bold',
  },
  button:{
    backgroundColor:'#F68B43',
    paddingVertical:14,
    borderRadius:12,
    alignItems:'center',
  },
  buttonPressed:{
    backgroundColor:'pink',
  },
  buttonText:{
    color:'white',
    fontSize:16,
    fontWeight:'bold',
  },
  toggleButton: {
    marginTop: 15,
    padding: 10,
    alignItems: 'center',
  },
  toggleText: {
    color: '#66C8D2',
    fontWeight: 'bold',
    fontSize: 14,
  }
});