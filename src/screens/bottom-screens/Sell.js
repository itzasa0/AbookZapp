import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getAuth } from '@firebase/auth';
import { getDatabase, ref, push } from '@firebase/database';

const Sell = ({navigation}) => {
    const [bookCategory, setBookCategory] = useState('');
    const [bookCondition, setBookCondition] = useState('');
    const [bookTitle, setBookTitle] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
  
    const handleSellBook = async () => {
        try{
        const auth = getAuth();
        const userId = auth.currentUser.uid;
        const database = getDatabase();
        const booksRef = ref(database, 'books');
      // Send a request to your backend API to insert the book data
      const bookData = {
        bookCategory,
        bookCondition,
        bookTitle,
        authorName,
        description,
        price,
        userID: userId, // Replace with your authenticated user ID
        currDate: new Date().toISOString(), // Get the current date and time
      };
      await push(booksRef, bookData);
      Alert.alert('Success', 'Book now Listed for Sell.', [
        { text: 'OK', onPress: handleReset }
      ]);
    }
    catch(error)
    {
        console.error('Save Error:', error.message);
        Alert.alert('Error', 'Failed to save session. Please try again later.');
    }

    };

    const handleReset = () => {
        setBookCategory('');
        setBookCondition('');
        setBookTitle('');
        setAuthorName('');
        setDescription('');
        setPrice('');
    };
  
    return (
      <ScrollView style={styles.container}>
        <View>
          <View style={styles.blackHeader}>
            <Text style={styles.headingText}>A<Text style={styles.orangeText}>Book</Text>Z</Text>
          </View>
          <Text style={styles.sectionHeading}>Sell your Book</Text>
          <View style={styles.formContainer}>
            <TextInput style={styles.input} placeholder="Book Title" onChangeText={setBookTitle} />
            <TextInput style={styles.input} placeholder="Author Name" onChangeText={setAuthorName} />
            <Picker
              selectedValue={bookCategory}
              style={styles.input}
              onValueChange={(itemValue) => setBookCategory(itemValue)}>
              <Picker.Item label="Select Book Category" value="" />
              <Picker.Item label="Adventurous" value="Adventurous" />
              <Picker.Item label="Fiction" value="Fiction" />
              <Picker.Item label="Non-fiction" value="Non-fiction" />
              <Picker.Item label="Sports" value="Sports" />
            </Picker>
            <TextInput
              style={styles.input}
              placeholder="Description"
              multiline
              numberOfLines={3}
              onChangeText={setDescription}
            />
            <Picker
              selectedValue={bookCondition}
              style={styles.input}
              onValueChange={(itemValue) => setBookCondition(itemValue)}>
              <Picker.Item label="Select Book Condition" value="" />
              <Picker.Item label="Bad" value="Bad" />
              <Picker.Item label="Okay" value="Okay" />
              <Picker.Item label="Great" value="Great" />
            </Picker>
            <TextInput
              style={styles.input}
              placeholder="£ Pound Price"
              keyboardType="numeric"
              onChangeText={setPrice}
            />
            <TouchableOpacity style={styles.sellButton} onPress={handleSellBook}>
              <Text style={styles.buttonText}>Sell My Book</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    marginTop: 35
  },
  blackHeader: {
    backgroundColor: 'black',
    paddingTop: 20,
    paddingBottom: 15,
    alignItems: 'center',
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
  sectionHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  formContainer: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  sellButton: {
    backgroundColor: 'orange',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Sell;
