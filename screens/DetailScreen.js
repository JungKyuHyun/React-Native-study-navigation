import React from 'react';
import {Button, View, Text} from 'react-native';

function DetailScreen({navigation}) {
  return (
    <View>
      <Text>상세 화면</Text>
      <Button title="뒤로가기" onPress={() => navigation.push('Main')} />
    </View>
  );
}

export default DetailScreen;
