import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getDatabase, ref, query, orderByChild, equalTo, get } from 'firebase/database';

const Search = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchResultText, setSearchResultText] = useState('');
  const [bookData, setbookData] = useState('');
  const database = getDatabase();

  const handleViewBookDetail = (bookId) => {
    // Navigate to the BookDetail screen with the bookId parameter
    // console.log("bookid", bookId);
    navigation.navigate('BookDetail', { bookId });
  };

  const handleSearch = async () => {
    setSelectedCategory('');
    setSearchResultText(`Searching for "${searchText}"...`);
    try {
      const booksRef = ref(database, 'books');
      const searchQuery = query(booksRef);
      const snapshot = await get(searchQuery);

      const results = [];
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        // console.log("data: ", data);
        if (data.bookTitle.toLowerCase().includes(searchText.toLowerCase()) || data.authorName.toLowerCase().includes(searchText.toLowerCase())) {
          const id = childSnapshot.key;
          // console.log("data is here", id);
          results.push({ ...data, id });
          setbookData(results);
        }
      });

      // console.log('Search Results:', results);
      setSearchResultText(`Showing results for "${searchText}"`);
    } catch (error) {
      console.error('Error searching for books:', error);
      setSearchResultText(`Error searching for "${searchText}"`);
    }
  };

  const handleFilter = () => {
    setShowFilterModal(true);
  };

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    setSearchText('');
    setSearchResultText(`Searching for books in category "${category}"...`);
    try {
      const booksRef = ref(database, 'books');
      const categoryQuery = query(booksRef);
      const snapshot = await get(categoryQuery);

      const results = [];
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        // console.log("category: ", data.bookTitle);
        if (data.bookCategory== category)
        {
          const id = childSnapshot.key;
          // console.log("data is here", id);
          results.push({ ...data, id });
          setbookData(results);
          // console.log("here is the category: ", data.bookTitle);
        }
        
      });

      // console.log('Category Search Results:', results);
      setSearchResultText(`Showing results for all books with the category "${category}"`);
    } catch (error) {
      console.error('Error searching for books in category:', error);
      setSearchResultText(`Error searching for books in category "${category}"`);
    }
    setShowFilterModal(false);
  };
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleViewBookDetail(item.id)}> 
    <View style={styles.bookItem} key={item.id}>
      <Text style={styles.bookTitle}>{item.bookTitle}</Text>
      <Text style={styles.authorName}>Author: {item.authorName}</Text>
      <Text style={styles.authorName}>Category: {item.bookCategory}</Text>
      <Text style={styles.bookCategory}>Cost: {item.price}</Text>
    </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.blackHeader}>
        <Text style={styles.headingText}>A<Text style={styles.orangeText}>Book</Text>Z</Text>
      </View>
      <View style={styles.mainContent}>
        <Text style={styles.heading}>Filter Books:</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter book title or author name"
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
            <Ionicons name="filter" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
        {selectedCategory ? (
          <Text style={styles.resultText}>Searching for books in category "{selectedCategory}"...</Text>
        ) : (
          <Text style={styles.resultText}>{searchResultText}</Text>
        )}
        <FlatList
          data={bookData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
        <Modal
          visible={showFilterModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowFilterModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeading}>Book Categories</Text>
              <TouchableOpacity style={styles.categoryItem} onPress={() => handleCategorySelect('Adventurous')}>
                <Text>Adventurous</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryItem} onPress={() => handleCategorySelect('Fiction')}>
                <Text>Fiction</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryItem} onPress={() => handleCategorySelect('Non-fiction')}>
                <Text>Non-fiction</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryItem} onPress={() => handleCategorySelect('Sports')}>
                <Text>Sports</Text>
              </TouchableOpacity>
              {/* Add more categories as needed */}
            </View>
          </View>
        </Modal>
      </View>
    </View>
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
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
  },
  searchButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    padding: 10
  },
  filterButton: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
  },
  bookItem: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: 300,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  authorNameauthorName: {
    fontSize: 16,
    color: '#555',
  },
  bookCategory: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
});

export default Search;
