import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, ImageBackground, Dimensions, Animated, ScrollView, TouchableWithoutFeedback, StatusBar, TouchableOpacity } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5  from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import data from './data.json'; // Import your static JSON data
import TabContent from './TabContent'; // Import your enhanced TabContent component

const TabScreen = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState(data.tabs.map(tab => ({ key: tab.key, title: tab.title })));
  const sheetRef = useRef(null);

  const handleBackgroundTap = () => {
    console.log('Background tapped');
    // Move to the next slide
    setIndex((prevIndex) => (prevIndex + 1) % routes.length);
  };

  const renderScene = SceneMap(
    data.tabs.reduce((acc, tab) => {
      acc[tab.key] = () => null;
      return acc;
    }, {})
  );

  const renderTabBar = () => {
    return (
      <View style={styles.tabBar}>
        {routes.map((route, i) => (
          <TouchableOpacity
            key={route.key}
            style={styles.tabBarItem}
            onPress={() => setIndex(i)}
          >
            <View style={[styles.dot, i === index && styles.activeDot]} />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const TabContent = ({ tab, index, onPressNext }) => {
    const translateX = useRef(new Animated.Value(0)).current;

    const handleTap = () => {
      console.log('Tab content tapped');

      // Calculate translation based on index
      const translation = index * -100;

      // Animate translation
      Animated.timing(translateX, {
        toValue: translation,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Call parent function to navigate to next tab
      onPressNext();
    };

    return (
      <ScrollView contentContainerStyle={styles.tabContent}>
        <TouchableWithoutFeedback onPress={handleTap}>
          <Animated.View style={[styles.tabContainer, { transform: [{ translateX }] }]}>
            <Text style={styles.tabText}>{tab.content}</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${(index + 1) * (100 / data.tabs.length)}%` }]} />
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </ScrollView>
    );
  };

  const renderContent = () => (
    <View style={[styles.bottomSheetContent, { paddingBottom: 190 }]}>
      <Text style={styles.bottomSheetTitle}>{data.tabs[index].title}</Text>
      <TabContent tab={data.tabs[index]} index={index} onPressNext={() => setIndex((prevIndex) => (prevIndex + 1) % routes.length)} />
    </View>
  );


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" />
        <TouchableOpacity style={styles.backgroundTapArea} onPress={handleBackgroundTap}>
          <ImageBackground source={{ uri: data.tabs[index].image }} style={styles.backgroundImage}>
            <View style={styles.overlay}>
              <View style={styles.header}>
                <View style={styles.searchContainer}>
                  <Ionicons name="search" size={22} color="white" style={styles.searchIcon} />
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search"
                      placeholderTextColor="white"
                    // Add onChangeText and other TextInput props as needed
                    />
                  </View>
                </View>

                <MaterialIcons name="notifications" size={22} color="white" style={styles.iconButton} />
                <Ionicons name="menu" size={22} color="white" style={styles.iconButton} />

              </View>
              <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: Dimensions.get('window').width }}
                renderTabBar={renderTabBar}
              />
              <View style={styles.iconContainer}>
                <AntDesign name="playcircleo" size={24} color="white" style={[styles.actionButton, styles.iconMargin]} />
                <FontAwesome name="heart" size={22} color="white" style={[styles.actionButton, styles.iconMargin]} />
                <Ionicons name="chatbubble-outline" size={22} color="white" style={[styles.actionButton, styles.iconMargin]} />
                <MaterialCommunityIcons name="share-outline" size={32} color="white" />
              </View>

            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>
      <BottomSheet
        ref={sheetRef}
        snapPoints={['10%', '50%', '90%']}
        borderRadius={10}
        initialSnapIndex={0}
        backgroundComponent={({ style }) => (
          <View style={[style, { backgroundColor: '#222', borderTopLeftRadius: 10, borderTopRightRadius: 10 }]}>
            <FontAwesome5 name="chevron-circle-up" size={24} color="white" style={{ alignSelf: 'center', marginTop: -10 }} />
          </View>
        )}
        handleIndicatorStyle={{ backgroundColor: 'transparent' }} // Add this line to hide the default handle
      >
        {renderContent()}
      </BottomSheet>


      
    </GestureHandlerRootView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundTapArea: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: StatusBar.currentHeight + 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 37,
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  searchInput: {
    color: 'white',
    height: 40,
    paddingHorizontal: 10,
  },
  iconButton: {
    paddingHorizontal: 12,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  tabBarItem: {
    paddingHorizontal: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeDot: {
    // backgroundColor: 'white',
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
    bottom: 60,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  actionButton: {
    marginHorizontal: 10,
  },
  iconMargin: {
    marginVertical: 10, // Vertical margin for each icon
  },
  actionButton: {
    marginHorizontal: 10,
    color: '#fff'
  },
  bottomSheetContent: {
    backgroundColor: '#222',
    padding: 16,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff'
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    color: "#fff",
    padding: 20,
  },
  tabContainer: {
    alignItems: 'center',
    color: '#fff',
    shadowColor: '#fff',
  },
  tabText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    alignContent: 'center',
    alignSelf: 'center'
  },
  progressBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#ccc',
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'green',
    borderRadius: 5,
  },
});

export default TabScreen;
