import {useRoute} from '@react-navigation/core';
import React, {useEffect} from 'react';
import {Button, View, Text} from 'react-native';

function IDText() {
  const route = useRoute();
  return <Text>id: {route.params.id}</Text>;
}

function DetailScreen({navigation, route}) {
  useEffect(() => {
    navigation.setOptions({
      title: `상세 정보 -${route.params.id}`,
    });
  }, [navigation, route]);

  return (
    <View>
      <Text>상세 화면</Text>
      <IDText />
      <Button title="뒤로가기" onPress={() => navigation.pop()} />
    </View>
  );
}

export default DetailScreen;
