import React from 'react';
import {Button, Text, View} from 'react-native';

function SettingScreen({navigation}) {
  return (
    <View>
      <Text>Setting</Text>
      <Button title="뒤로가기" onPress={() => navigation.goBack()} />
    </View>
  );
}

export default SettingScreen;
