import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import { initializeApp } from '@firebase/app';
import { initializeAuth, getAuth, signInWithEmailAndPassword, getReactNativePersistence} from '@firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyBXJxCxWWJb7nChDY_BGXHiHKcvPwk2MnI",
    authDomain: "books-app-67be5.firebaseapp.com",
    databaseURL: "https://books-app-67be5-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "books-app-67be5",
    storageBucket: "books-app-67be5.appspot.com",
    messagingSenderId: "540568436482",
    appId: "1:540568436482:web:cbf887d61e688ea77acc1b"
  };
  

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const auth = getAuth();
    if (!auth) {
      initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
      });
    }
  }, []);

  const handleLogin = async () => {
    try {
        const auth = getAuth(app);
        // Sign in with email and password
        await signInWithEmailAndPassword(auth, email, password);
        Alert.alert('Login', 'You have successfully logged in.');
        navigation.navigate("HomeTabs");
    }
    catch (error) {
        console.error('Login Error:', error.message);
        Alert.alert('Login Failed', error.message);
      }
  };

  return (
    <ImageBackground source={require('../../assets/background.jpeg')} style={styles.backgroundImage}>
      <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.headingText}>A<Text style={styles.orangeText}>Book</Text>Z</Text>
      </View>
        <View style={styles.wizard}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Login to your account</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
            <Text style={styles.signup}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
    headingContainer: {
        marginBottom: 20,
      },
  headingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  orangeText: {
    color: 'orange',
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  wizard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 20,
    borderRadius: 10,
    textAlign: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  loginButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  forgotPassword: {
    marginTop: 10,
    color: 'blue',
    textAlign: 'center',
  },
  signup: {
    marginTop: 10,
    color: 'grey',
    textAlign: 'center',
  },
});

export default LoginScreen;
