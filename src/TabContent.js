import React from 'react';
import { View, Text, ScrollView, TouchableWithoutFeedback, Animated } from 'react-native';
import { styles } from './styles'; // Ensure you import your styles correctly

const TabContent = ({ tab, index, onPressNext, style }) => {
  // Animated value for progress bar
  const progress = new Animated.Value(0);

  // Function to handle tap on content
  const handleTap = () => {
    console.log('Tab content tapped');
    // Animate progress bar to next step
    Animated.timing(progress, {
      toValue: (index + 1) * (100 / data.tabs.length),
      duration: 500, // Adjust duration as needed
      useNativeDriver: false, // Ensure useNativeDriver is false for Animated API
    }).start();
    // Call parent function to navigate to next tab
    onPressNext();
  };

  return (
    <ScrollView contentContainerStyle={[styles.tabContent, style]}>
      <TouchableWithoutFeedback onPress={handleTap}>
        <View style={{ flex: 1 }}>
          <Text style={styles.tabText}>{tab.content}</Text>
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: `${progress}%`,
                },
              ]}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default TabContent;
