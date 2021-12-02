import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainScreen from './screens/MainScreen';
import DetailScreen from './screens/DetailScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#fb8c00',
        }}>
        <Stack.Screen
          name="Main"
          component={MainScreen}
          // * 이 설정을 추가하지 않으면 헤더가 두개가 보이는 현상이 나타난다.
          // * 하단 탭 내비게이터를 스택 내비게이터 내부에서 사용하게 될 때 이 설정을 꼭 해주어야 한다.
          options={{headerShown: false}}
        />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
