import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { getDatabase, ref, orderByChild, query, get } from 'firebase/database';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const HomePage = () => {
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [latestArrivals, setLatestArrivals] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const fetchAllBooks = async () => {
        try {
          const database = getDatabase();
          const booksRef = ref(database, 'books');
      
          const booksSnapshot = await get(booksRef);
          const booksData = [];
          booksSnapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            const id = childSnapshot.key;
            booksData.push({ id, ...data });
          });
          setRecommendedBooks(booksData);
  
        } catch (error) {
          console.error('Error fetching books:', error);
          throw error;
        }
      };
      
      const fetchLatestArrivals = async () => {
        try {
          const database = getDatabase();
          const booksRef = ref(database, 'books');
      
          const booksSnapshot = await get(booksRef);
          const booksData = [];
          booksSnapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            const id = childSnapshot.key;
            booksData.push({ id, ...data });
          });
      
          // Sort booksData by currDate in descending order
          const sortedBooks = booksData.sort((a, b) => new Date(b.currDate) - new Date(a.currDate));
      
          setLatestArrivals(sortedBooks);
        } catch (error) {
          console.error('Error fetching latest arrivals:', error);
        }
      };
  
      fetchAllBooks();
      fetchLatestArrivals();
    }, [])
  );
  
  
const handleViewBookDetail = (bookId) => {
    // Navigate to the BookDetail screen with the bookId parameter
    // console.log("bookid", bookId);
    navigation.navigate('BookDetail', { bookId });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.blackHeader}>
        <Text style={styles.headingText}>A<Text style={styles.orangeText}>Book</Text>Z</Text>
      </View>
      <View style={styles.whiteContent}>
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Recommended Books</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardContainer}>
            {/* Render recommended books cards */}
            {recommendedBooks.map((book, index) => (
              <View style={styles.card} key={index}>
                <Text style={styles.text}>{book.bookTitle}</Text>
                <Text style={styles.text}>Genre: {book.bookCategory}</Text>
                <Text style={styles.text}>State: {book.bookCondition}</Text>
                <Text style={styles.text}>Cost: £{book.price}</Text>
                <TouchableOpacity
                style={styles.card}
                key={index}
                onPress={() => handleViewBookDetail(book.id)}
              >
                <Text style={styles.viewButton}>View</Text>
              </TouchableOpacity>  
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Latest Arrivals</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardContainer}>
            {/* Render latest arrivals */}
            {latestArrivals.map((book, index) => (
              <View style={styles.card} key={index}>
                <Text style={styles.text}>{book.bookTitle}</Text>
                <Text style={styles.text}>Genre: {book.bookCategory}</Text>
                <Text style={styles.text}>State: {book.bookCondition}</Text>
                <Text style={styles.text}>Cost: £{book.price}</Text>
                <TouchableOpacity
                style={styles.card}
                key={index}
                onPress={() => handleViewBookDetail(book.id)}
              >
                <Text style={styles.viewButton}>View</Text>
              </TouchableOpacity> 
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    fontSize: 24
  },
  orangeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24
  },
  whiteContent: {
    backgroundColor: 'white',
    flexGrow: 1,
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  section: {
    marginTop: 15,
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subSectionHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardContainer: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    minWidth: 150,
  },
  text:{
    fontWeight: 'bold',
    fontSize: 15
  },
  viewButton: {
    marginTop: 5,
    color: 'orange',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default HomePage;
