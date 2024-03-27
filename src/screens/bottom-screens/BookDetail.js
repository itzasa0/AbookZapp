import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { getDatabase, ref, get, push, set } from 'firebase/database';
import { getAuth } from '@firebase/auth';
const BookDetail = ({ route }) => {
  const { bookId } = route.params;
  const [bookDetails, setBookDetails] = useState(null);
  const [sellerDetails, setSellerDetails] = useState(null);

  const addToBasket = async () => {
    try{
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const database = getDatabase();
    const basketRef = ref(database, 'basket');
  // Send a request to your backend API to insert the book data
  const basketData = {
    bookID: bookId,
    userID: userId,
    currDate: new Date().toISOString()
  };
  await push(basketRef, basketData);
  Alert.alert('Success', 'Added to Basket!', [
    { text: 'OK' }
  ]);
}
catch(error)
{
    console.error('Save Error:', error.message);
    Alert.alert('Error', 'Failed to save session. Please try again later.');
}

};
  useEffect(() => {

    // console.log("looged: ",bookId);
    const fetchBookDetails = async () => {
        try {
          const database = getDatabase();
          const bookRef = ref(database, `books/${bookId}`); 
          const bookSnapshot = await get(bookRef);
          const bookData = bookSnapshot.val();
          // console.log(bookData);
          setBookDetails(bookData);
      
          // console.log("user id: ", bookData.userID);
          // Call fetchSellerDetails after setting bookDetails
          fetchSellerDetails(bookData.userID);
        } catch (error) {
          console.error('Error fetching book details:', error);
        }
      };
      
      
  
    const fetchSellerDetails = async (userID) => {
      try {
        const database = getDatabase();
        const userRef = ref(database, `users/${userID}`);
        const userSnapshot = await get(userRef);
        const userData = userSnapshot.val();
        setSellerDetails(userData);
      } catch (error) {
        console.error('Error fetching seller details:', error);
      }
    };
  
    if (bookId) {
      fetchBookDetails();
    }
  }, [bookId]);
  

  return (
    <ScrollView style={styles.container}>
      <View style={styles.blackHeader}>
        <Text style={styles.headingText}>A<Text style={styles.orangeText}>Book</Text>Z</Text>
      </View>
      <View style={styles.mainContent}>
      <View style={[styles.box, styles.orangeBorder]}>
        <Text style={styles.heading}>Book Details</Text>
        {bookDetails ? (
          <>
            <Text>Title: {bookDetails.bookTitle}</Text>
            <Text>Author Name: {bookDetails.authorName}</Text>
            <Text>Category: {bookDetails.bookCategory}</Text>
            <Text>Book Condition: {bookDetails.bookCondition}</Text>
            <Text>Price: {bookDetails.price}</Text>
            <Text>Description: {bookDetails.description}</Text>
          </>
        ) : (
          <Text>Loading book details...</Text>
        )}
      </View>
  
      <View style={[styles.box, styles.orangeBorder]}>
        <Text style={styles.heading}>Seller Details</Text>
        {sellerDetails && (
          <>
            <Text>Seller Name: {sellerDetails.name}</Text>
            <Text>Seller Email: {sellerDetails.email}</Text>
            <Text>Seller Phone: {sellerDetails.phoneNumber}</Text>
          </>
        )}
      </View>
  
      {/* Add To Basket button */}
      <TouchableOpacity style={styles.addToBasketButton} onPress={addToBasket}>
          <Text style={styles.addToBasketButtonText}>Add To Basket</Text>
        </TouchableOpacity>
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
  box: {
    marginBottom: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'orange',
    padding: 10,
    width: 300,
    textAlign: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  orangeBorder: {
    borderColor: 'orange',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addToBasketButton: {
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: 170,
    borderRadius: 5,
    marginBottom: 10,
  },
  addToBasketButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center'
  },
});

export default BookDetail;
