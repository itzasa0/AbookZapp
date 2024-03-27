import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';

const Profile = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const database = getDatabase();

  useEffect(() => {
    // Fetch user's name from the users ref in the Firebase Realtime Database
    const fetchUserName = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const userRef = ref(database, `users/${user.uid}`);
          const userSnapshot = await get(userRef);
          const userData = userSnapshot.val();
          if (userData && userData.name) {
            setUserName(userData.name);
          }
        }
      } catch (error) {
        console.error('Error fetching user name:', error.message);
      }
    };

    fetchUserName();
  }, []);

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log('User signed out successfully');
        navigation.navigate("LoginScreen")
        // Redirect to login or perform any necessary action after sign out
      })
      .catch((error) => {
        console.error('Error signing out:', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.blackHeader}>
        <Text style={styles.headingText}>A<Text style={styles.orangeText}>Book</Text>Z</Text>
      </View>
      <View style={styles.mainContent}>
      <Text style={styles.heading}>My Profile</Text>
      <Text style={styles.userName}>{userName}</Text>
      <TouchableOpacity style={styles.button} onPress={() => {navigation.navigate("Sell")}}>
        <Text style={styles.buttonText}>My Selling</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => {navigation.navigate("Basket")}}>
        <Text style={styles.buttonText}>My Basket</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonText}>My Messages</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 35,
    alignItems: 'center'
  },
  mainContent: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  blackHeader: {
    backgroundColor: 'black',
    paddingTop: 20,
    paddingBottom: 15,
    alignItems: 'center',
    width: '100%',
  },
  headingText: {
    color: 'orange',
    fontSize: 24,
  },
  orangeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userName: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: 300,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center'
  },
});

export default Profile;
