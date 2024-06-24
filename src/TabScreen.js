// TabScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import axios from 'axios';

const TabScreen = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'tab1', title: 'Tab 1' },
    { key: 'tab2', title: 'Tab 2' },
    { key: 'tab3', title: 'Tab 3' },
    { key: 'tab4', title: 'Tab 4' },
    { key: 'tab5', title: 'Tab 5' }
  ]);
  const [tabData, setTabData] = useState([]);

  useEffect(() => {
    // Fetch data from JSON file (replace with your server URL or local import)
    axios.get('path_to_your_json/data.json')
      .then(response => {
        setTabData(response.data.tabs);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const renderScene = SceneMap(
    routes.reduce((acc, route) => {
      acc[route.key] = () => <TabContent title={route.title} />;
      return acc;
    }, {})
  );

  const TabContent = ({ title }) => {
    const tab = tabData.find(tab => tab.title === title);

    if (!tab) return null;

    return (
      <ScrollView contentContainerStyle={styles.tabContent}>
        <Image source={{ uri: tab.image }} style={styles.tabImage} />
        <Text style={styles.tabText}>{tab.content}</Text>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={styles.indicator}
            style={styles.tabBar}
            scrollEnabled
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  tabImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.7, // Adjust as needed
    resizeMode: 'cover',
  },
  tabText: {
    padding: 20,
    fontSize: 16,
  },
  tabBar: {
    backgroundColor: 'transparent',
  },
  indicator: {
    backgroundColor: 'white',
  },
});

export default TabScreen;
