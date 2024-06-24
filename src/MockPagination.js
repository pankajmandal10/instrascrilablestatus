import React, { useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';

const MockPagination = () => {
  const [page, setPage] = useState(1);
  const data = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);

  const renderItem = ({ item }) => <Text>{item}</Text>;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={data.slice((page - 1) * 10, page * 10)}
        renderItem={renderItem}
        keyExtractor={(item) => item}
      />
      <Button
        title="Next Page"
        onPress={() => setPage((prevPage) => prevPage + 1)}
      />
    </View>
  );
};

export default MockPagination;
