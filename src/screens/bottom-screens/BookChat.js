import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, push, get } from 'firebase/database';

const BookChat = ({ route }) => {
  const { userID } = route.params;
  console.log("efefE    ",route.params);
  const [userName, setUserName] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const database = getDatabase();
      const messageRef = ref(database, 'messages');
console.log("fata : ", userID);
      const messageData = {
        fullName: fullName,
        phoneNumber: phoneNumber,
        email: email,
        message: message,
        sUserID: user.uid,
        rUserID: userID,
        currDate: new Date().toISOString()
      };

      await push(messageRef, messageData);
      console.log('Message Data:', messageData);

      setFullName('');
      setPhoneNumber('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Error submitting message:', error.message);
    }
  };

  useEffect(() => {
    console.log("data for userID", userID);
    const fetchUserName = async () => {
      try {
        if (userID) {
          const database = getDatabase();
          const userRef = ref(database, `users/${userID}`);
          const userSnapshot = await get(userRef);
          const userData = userSnapshot.val();
          console.log("here the data: ", userID); // Log userData instead of userID
          if (userData && userData.name) {
            console.log("hello: ",userData.name);
            setUserName(userData.name); // Set the user's name in the state
          }
        }
      } catch (error) {
        console.error('Error fetching user name:', error.message);
      }
    };
  
    fetchUserName();
  });
  

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sending message to {userName}</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={[styles.input, styles.messageInput]}
        placeholder="Message"
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    width: '100%',
  },
  messageInput: {
    height: 100,
  },
  submitButton: {
    backgroundColor: 'orange',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default BookChat;
