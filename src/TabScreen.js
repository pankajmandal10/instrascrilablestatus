import React, { useState, useRef } from 'react';
import {
  View, Text, FlatList, ImageBackground, Dimensions, Animated, TouchableOpacity, StyleSheet, StatusBar, PanResponder,
  Button,
  TextInput
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import data from './data.json'; // Import your static JSON data
import TabContent from './TabContent'; // Import your enhanced TabContent component
import RBSheet from 'react-native-raw-bottom-sheet';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const INITIAL_CARD_COUNT = 3; // Number of cards to load initially
const BATCH_SIZE = 3; // Number of cards to load in each batch
const DEFAULT_IMAGE = 'https://via.placeholder.com/150'; // Default image URL

const TabScreen = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState(data.tabs.map(tab => ({ key: tab.key, title: tab.title })));
  const sheetRef = useRef(null);
  const position = useRef(new Animated.ValueXY()).current;
  const refRBSheet = useRef();

  const [loadedCards, setLoadedCards] = useState(data.tabs.slice(0, INITIAL_CARD_COUNT));

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-30deg', '0deg', '30deg'],
    extrapolate: 'clamp'
  });

  const rotateAndTranslate = {
    transform: [{
      rotate
    }, ...position.getTranslateTransform()]
  };

  const likeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp'
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0, 0],
    extrapolate: 'clamp'
  });

  const nextCardOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0, 1],
    extrapolate: 'clamp'
  });

  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.8, 1],
    extrapolate: 'clamp'
  });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      position.setValue({ x: gestureState.dx, y: gestureState.dy });
    },
    onPanResponderRelease: (event, gestureState) => {
      if (gestureState.dx > 120) {
        Animated.spring(position, {
          toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy },
          useNativeDriver: false
        }).start(() => {
          handleSwipeComplete();
        });
      } else if (gestureState.dx < -120) {
        Animated.spring(position, {
          toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy },
          useNativeDriver: false
        }).start(() => {
          handleSwipeComplete();
        });
      } else {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false
        }).start();
      }
    }
  });

  const handleSwipeComplete = () => {
    setIndex((prevIndex) => (prevIndex + 1) % routes.length);
    position.setValue({ x: 0, y: 0 });

    // Load more cards if reached the end of loadedCards
    if (index === loadedCards.length - 1 && loadedCards.length < data.tabs.length) {
      const newLoadedCards = data.tabs.slice(0, loadedCards.length + BATCH_SIZE);
      setLoadedCards(newLoadedCards);
    }
  };

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {routes.map((route, i) => (
        <TouchableOpacity
          key={route.key}
          style={styles.tabBarItem}
          onPress={() => setIndex(i)}
        >
          <View style={[styles.tabLine, i === index && styles.activeTabLine]} />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderContent = () => (
    <View style={styles.bottomSheetContent}>
      <Text style={styles.bottomSheetTitle}>{data.tabs[index].title}</Text>
      <TabContent tab={data.tabs[index]} />
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.commentContainer}>
      <Text>{item.text}</Text>
    </View>
  );
  const getCurrentCard = (cardIndex) => loadedCards[cardIndex] || {};
  const currentCardImage = getCurrentCard(index).image || DEFAULT_IMAGE;
  const nextCardImage = getCurrentCard((index + 1) % loadedCards.length).image || DEFAULT_IMAGE;

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      <View style={styles.swipeContainer}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[rotateAndTranslate, styles.animatedCard]}
        >

          <View style={styles.overlay}>
            <View style={styles.header}>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={22} color="white" style={styles.searchIcon} />
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    placeholderTextColor="white"
                  />
                </View>
              </View>

              <MaterialIcons name="notifications" size={22} color="white" style={styles.iconButton} />
              <Ionicons name="menu" size={22} color="white" style={styles.iconButton} />

            </View>
          </View>
          {renderTabBar()}
          <ImageBackground
            style={styles.cardImage}
            source={{ uri: currentCardImage }}
          >
         
            <View style={styles.topBar}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                placeholderTextColor="#ccc"
              />
              <Ionicons name="notifications-outline" size={24} color="white" />
            </View>
            <View style={styles.iconContainer}>
              <AntDesign name="playcircleo" size={24} color="white" style={styles.actionButton} />
              <FontAwesome name="heart" size={22} color="white" style={styles.actionButton} />
              <Ionicons onPress={() => refRBSheet.current.open(data.tabs[index].comments)} name="chatbubble-outline" size={22} color="white" style={styles.actionButton} />
              <MaterialCommunityIcons name="share-outline" size={32} color="white" style={styles.actionButton} />
            </View>
          </ImageBackground>

        </Animated.View>
        <Animated.View style={[styles.nextCard, { opacity: nextCardOpacity, transform: [{ scale: nextCardScale }] }]}>
          {renderTabBar()}
          <ImageBackground
            style={styles.cardImage}
            source={{ uri: nextCardImage }}
          >
            <View style={styles.iconContainer}>
              <AntDesign name="playcircleo" size={24} color="white" style={styles.actionButton} />
              <FontAwesome name="heart" size={22} color="white" style={styles.actionButton} />
              <Ionicons onPress={() => refRBSheet.current.open()} name="chatbubble-outline" size={22} color="white" style={styles.actionButton} />
              <MaterialCommunityIcons name="share-outline" size={32} color="white" style={styles.actionButton} />
            </View>
          </ImageBackground>
        </Animated.View>

      </View>

      <RBSheet
        ref={refRBSheet}
        height={300} // Set a fixed height for the bottom sheet
        openDuration={250} // Duration for the open animation
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          draggableIcon: {
            backgroundColor: '#222',
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: 20,
            paddingVertical: 10,
          },
        }}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.contentText}>Comments</Text>
          <FlatList
            data={data.tabs[index].comments}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
          />

        </View>
      </RBSheet>

      <BottomSheet
        ref={sheetRef}
        snapPoints={['10%', '50%', '90%']}
        borderRadius={10}
        initialSnapIndex={0}
        backgroundComponent={({ style }) => (
          <View style={[style, { backgroundColor: '#222', borderTopLeftRadius: 10, borderTopRightRadius: 10 }]}>
            <FontAwesome name="chevron-circle-up" size={24} color="white" style={{ alignSelf: 'center', marginTop: -10 }} />
          </View>
        )}
        handleIndicatorStyle={{ backgroundColor: 'transparent' }} // Add this line to hide the default handle
      >
        {renderContent()}
      </BottomSheet>

    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    paddingHorizontal: 10,
    position: 'absolute'
  },
  tabLine: {
    height: 3,
    backgroundColor: 'gray',
    width: '80%',
    borderRadius: 2,
  },
  activeTabLine: {
    backgroundColor: 'white',
  },
  swipeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedCard: {
    width: SCREEN_WIDTH - 10,
    height: SCREEN_HEIGHT - 50,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'absolute',
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    // padding: 20,
  },
  likeTextContainer: {
    position: 'absolute',
    top: 50,
    left: 40,
    zIndex: 1000,
    transform: [{ rotate: '-30deg' }],
  },
  likeText: {
    borderWidth: 1,
    borderColor: 'green',
    color: 'green',
    fontSize: 32,
    fontWeight: '800',
    padding: 10,
  },
  nopeTextContainer: {
    position: 'absolute',
    top: 50,
    right: 40,
    zIndex: 1000,
    transform: [{ rotate: '30deg' }],
  },
  nopeText: {
    borderWidth: 1,
    borderColor: 'red',
    color: 'red',
    fontSize: 32,
    fontWeight: '800',
    padding: 10,
  },
  nextCard: {
    width: SCREEN_WIDTH - 10,
    height: SCREEN_HEIGHT - 50,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'absolute',
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
    elevation: 5,
  },
  iconContainer: {
    flexDirection: "column",
    justifyContent: 'space-between',
    alignSelf: 'flex-end',
    position: 'absolute',
    paddingVertical: 70,
    paddingHorizontal: 10,
    height: 270
  },
  inputContainer: {
    flex: 1,
  },
  actionButton: {
    alignSelf: 'center',
  },
  iconMargin: {
    marginHorizontal: 10,
  },
  bottomSheetContent: {
    flex: 1,
    padding: 20,
    backgroundColor: "#222"
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  contentContainer: {
    padding: 20,
  },
  contentText: {
    marginBottom: 20,
    fontSize: 18,
    textAlign:'center',
    fontWeight:'bold'
  },
  commentContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default TabScreen;
