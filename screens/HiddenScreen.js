import React from 'react';
import {Button, Text, View} from 'react-native';

function HiddenScreen({navigation}) {
  return (
    <View>
      <Text>frist route 테스트용 숨겨진 스크린!</Text>
      <Button title="뒤로가기" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}

export default HiddenScreen;
