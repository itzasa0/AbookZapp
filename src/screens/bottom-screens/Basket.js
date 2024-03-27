import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { getDatabase, ref, onValue, child } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const Basket = ({navigation}) => {
  const [basketItems, setBasketItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const handleChatWithSeller = (userId) => {
    console.log("here", userId);
    navigation.navigate("BookChat", { userID: userId });
  };
  
  const getBasketDataForUser = () => {
    const authUser = getAuth().currentUser;

    if (!authUser) {
      console.error('No authenticated user found.');
      return;
    }

    try {
      const database = getDatabase();
      const basketRef = ref(database, 'basket');

      onValue(basketRef, (snapshot) => {
        const basketData = snapshot.val();

        if (!basketData) {
          console.log('No basket items found for the user.');
          return;
        }

        const userBasketItems = Object.values(basketData).filter(item => item.userID === authUser.uid);

        if (userBasketItems.length === 0) {
          console.log('No basket items found for the user');
        } else {
          const items = [];

          userBasketItems.forEach(item => {
            const bookID = item.bookID;

            const bookRef = child(ref(database), `books/${bookID}`);

            onValue(bookRef, (bookSnapshot) => {
              const bookData = bookSnapshot.val();

              if (bookData) {
                items.push({
                  ...item,
                  bookTitle: bookData.bookTitle,
                  authorName: bookData.authorName,
                  bookCondition: bookData.bookCondition,
                  price: bookData.price,
                  id: bookSnapshot.key
                });
              } else {
                console.warn(`Book with ID ${bookID} not found in the database.`);
              }

              // Set the basket items and calculate total price
              setBasketItems(items);
              const totalPrice = items.reduce((acc, curr) => acc + parseFloat(curr.price), 0);
              setTotalPrice(totalPrice);
            });
          });
        }
      });
    } catch (error) {
      console.error('Error fetching basket data:', error);
    }
  };

  useEffect(() => {
    getBasketDataForUser();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View>
        <View style={styles.blackHeader}>
          <Text style={styles.headingText}>A<Text style={styles.orangeText}>Book</Text>Z</Text>
        </View>
        <Text style={styles.headerText}>Basket</Text>

        {basketItems.length === 0 ? (
          <Text style={styles.emptyText}>Your basket is empty.</Text>
        ) : (
          <>
            {basketItems.map((item, index) => (
              <View style={styles.itemContainer} key={index}>
                <View style={styles.itemDetails}>
                  <Text>Title: {item.bookTitle}</Text>
                  <Text>Author: {item.authorName}</Text>
                  <Text>Condition: {item.bookCondition}</Text>
                  <Text>Cost: £{item.price}</Text>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.buyNowButton} onPress={() => Alert.alert('Success', 'Book Buy request sent.', [
        { text: 'OK'}
      ])}>
                    <Text style={styles.buttonText}>Buy Now</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.chatButton} onPress={() => handleChatWithSeller(item.id)}>
                    <Text style={styles.buttonText}>Chat with Seller</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total: £{totalPrice.toFixed(2)}</Text>
            </View>
          </>
        )}
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
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
  },
  itemDetails: {
    paddingVertical: 10,
  },
  totalContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    marginTop: 20,
    paddingTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buyNowButton: {
    backgroundColor: 'orange',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  chatButton: {
    backgroundColor: 'orange',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  
  
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },  
});

export default Basket;
