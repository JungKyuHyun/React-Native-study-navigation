# React-Native

앞써 공부한 내용([설치 및 할일목록 만들기](https://github.com/JungKyuHyun/React-Native-study))를 토대로, 내비게이션(`navigation`)을 공부한다.

## 참고

- IOS 애뮬레이터 리로딩: `커맨드` + `R`
- Android 애뮬레이터 리로딩: `R` 두번

(키보드 입력이 한글인 상태에서는 해당 커맨드가 안먹는다.)

- https://reactnavigation.org/docs/getting-started

## 설치

`react-navigation` 라이브러리를 이용한다. `RN` 커뮤니티에서 관리하며 사용률이 가장 높은 라이브러리다. 참고로 `Wix`에서 관리하는 `react-native-navigation` 라이브러리도 있다. 차이점은 `react-native-navigation`의 경우 네이티브로 구현되어 있기 때문에 더욱 네이티브스러운 사용 경험을 제공하지만, 자바스크립트로 구현된 `react-navigation`가 사용법도 더 쉽고 별도 `API`가 아닌 리액트 컴포넌트를 사용해 화면을 설정할 수 있다는 장점도 있다.

```bash
$ yarn add @react-navigation/native
# 아래 라이브러리도 의존하고 있는 라이브러리이기 때문에 필수로 같이 설치해 주자.
$ yarn add react-native-screens react-native-safe-area-context
```

다했다면 이젠 익숙한 Pod를 설치해 준다. (아래부턴 특별한 경우 빼곤 해당 내용 생략)

```bash
$ cd ios
$ pod install
```

## 적용

`NavigationContainer` 컴포넌트로 앱 전체를 감싸 주면 된다.

```javascript
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';

function App() {
  return <NavigationContainer>{/* 내비게이션 설정 */}</NavigationContainer>;
}

export default App;
```

## Native Stack Navigator

`react-navigation` 라이브러리에는 다른 상황에서 사용할 수 있는 다양한 네비게이터가 있지만, `RN` 앱에서는 화면 전환할 때 브라우저의 `History`와 비슷한 사용성을 제공하기 위해 네이티브 스택 내비게이터를 사용한다.

`Native Stack Navigator`의 경우 가장 많이 사용되며, 안드로이드에서는 `Fragment`, `IOS`에서는 `UINavigationController`를 사용해 일반 네이티브 앱과 정확히 동일한 방식으로 화면을 관리한다.

```bash
$ yarn add @react-navigation/native-stack
```

## 기본 사용법

화면 컴포넌트를 `screens`라는 폴더를 생성하고 그 안에 `HomeScreen`과 `DetailScreen`을 생성해 보자.

```javascript
// screens/HomeScreen.js
import React from 'react';
import {Button, View} from 'react-native';

function HomeScreen() {
  return (
    <View>
      <Button title="Detail 열기" />
    </View>
  );
}

export default HomeScreen;


// screens/HomeScreen.js
import React from 'react';
import {Text, View} from 'react-native';

function DetailScreen() {
  return (
    <View>
      <Text>Detail</Text>
    </View>
  );
}

export default DetailScreen;

```

![image](https://user-images.githubusercontent.com/42884032/144087431-667555a4-71d6-40fe-8187-4e895bfe696c.png)

그 다음 App.js를 수정하자.

```javascript
const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
```

여기서 `name`은 화면의 이름을 설정하는 `props`로 다른 화면으로 이동하거나 현재 화면이 어떤 화면인지 조회할때 쓰인다. 반드시 대문자로 작성하지 않아도 되지만, 공식 문서에서 대문자로 시작하는 것을 권장하고 있다.

## 스크린 이동하기

**스크린으로 사용된 컴포넌트는 `navigation`이라는 객체를 `Props`로 받아올 수 있다.** 그리고 이 객체를 아래와 같이 이용하여 화면을 이동할 수 있다.

```javascript
function HomeScreen({navigation}) {
  return (
    <View>
      <Button
        title="Detail 열기"
        onPress={() => navigation.navigate('Detail')}
        // navigate 함수가 아닌 push를 이용하여 이동도 가능하다.
        // onPress={() => navigation.push('Detail')}
      />
    </View>
  );
}

export default HomeScreen;
```

실제로 테스트 해보면 우리가 자주 접하던 스크린 효과를 통해 화면이 이동하는걸 볼 수 있다. 참고로 UI와 스크린 전환 효과는 모두 커스터마이징할 수 있으니 일단 넘어가자.

![2021-12-01_01-44-20 (1)](https://user-images.githubusercontent.com/42884032/144090173-eeaa7730-0288-4457-b3b4-0e49245af817.gif)

## 라우트 파라미터

새로운 화면을 보여줄 때 의존해야 하는 어떤 값이 있다면 **객체 타입**으로 라우트 파라미터를 설정한다.

```javascript
// example
navigation.navigate('Detail', {id: 1});
// or
navigation.push('Detail', {id: 1});
```

**스크린으로 사용된 컴포넌트는 `route`라는 `Props`도 받아온다.** 그리고 내가 넘겨준 라우트 파라미터를 `route`라는 객체 안에 `params`에 저장되어 확인할 수 있게 된다. 아래 코드를 통해 확인해 보자.

```javascript
// HomeScreen.js
function HomeScreen({navigation}) {
  return (
    <View>
      <Button
        title="Detail 1 열기"
        onPress={() => navigation.push('Detail', {id: 1})}
      />
      <Button
        title="Detail 2 열기"
        onPress={() => navigation.push('Detail', {id: 2})}
      />
      <Button
        title="Detail 3 열기"
        onPress={() => navigation.push('Detail', {id: 3})}
      />
    </View>
  );
}

// DetailScreen.js
function DetailScreen({route}) {
  return (
    <View style={styles.block}>
      <Text style={styles.text}>id: {route.params.id}</Text>
    </View>
  );
}
```

![2021-12-01_02-01-00 (1)](https://user-images.githubusercontent.com/42884032/144092995-0a64fb21-f930-472f-88f0-1f00d29fe5f1.gif)

### 참고

스크린으로 사용되면 어떤 값들을 `Props`로 가져오는 걸까? 궁금해서 확인해 봤다.

```json
{
  "navigation": {
    "addListener": ["Function addListener"],
    "canGoBack": ["Function canGoBack"],
    "dispatch": ["Function dispatch"],
    "getParent": ["Function getParent"],
    "getState": ["Function anonymous"],
    "goBack": ["Function anonymous"],
    "isFocused": ["Function isFocused"],
    "navigate": ["Function anonymous"], // 익숙!
    "pop": ["Function anonymous"],
    "popToTop": ["Function anonymous"],
    "push": ["Function anonymous"], // 익숙!
    "removeListener": ["Function removeListener"],
    "replace": ["Function anonymous"],
    "reset": ["Function anonymous"],
    "setOptions": ["Function setOptions"],
    "setParams": ["Function anonymous"]
  },
  "route": {
    "key": "Detail-2b1gG14xTSuAmKqedHcYm", // 화면 고유의 ID로 새로운 화면이 나타날 때 자동으로 생성된다.
    "name": "Detail", // 내가 스택 내비게이터를 설정할 때 지정한 name이다.
    "params": {
      // 라우트 파라미터이다.
      "id": 1
    }
  }
}
```

## navigation.navigate() vs navigation.push()

위에서 화면 전환할 때 사용한 두 함수이다.

- `navigate()`의 경우 새로 이동할 화면이 현재 화면과 같으면 새로운 화면을 쌓지 않고 파라미터만 변경한다. 따라서 화면 전환효과도 없고 뒤로 가기를 눌렀을 때 스택으로 안쌓고 있기 때문에 처음 진입 화면으로 돌아갈 것이다.
- `push()`는 `navigate()`와 반대이다. 아래 그림으로 보는게 훨씬 이해가 빠르다.

```javascript
// DetailScreen.js
// 아래와 같은 방식으로 다음버튼을 구현하며, push 함수만 변경하면서 테스트 하면 된다.
<Button
  title="다음 (push방식)"
  onPress={() => navigation.push('Detail', {id: route.params.id + 1})}
/>
```

### push 방식

![2021-12-01_02-22-49 (1)](https://user-images.githubusercontent.com/42884032/144096850-70327712-150f-4fea-a0b1-97ea35fe00fa.gif)

### navigate 방식

![2021-12-01_02-27-26 (1)](https://user-images.githubusercontent.com/42884032/144097275-c782c607-8779-4c40-a395-49206b4df2ee.gif)

## 뒤로 가기 구현

뒤로 가기 기능의 경우 `navigation` 객체의 `pop`함수와 `popToTop`함수를 통해 구현이 가능하다.

- `pop()`: 뒤로 가기(이전 화면으로 이동)
- `popToTop()`: 뒤로 가기(가장 첫 번째 화면으로 이동)

```javascript
<Button
  title="다음"
  onPress={() => navigation.push('Detail', {id: route.params.id + 1})}
/>
<Button title="뒤로가기" onPress={() => navigation.pop()} />
<Button title="처음으로" onPress={() => navigation.popToTop()} />
```

# 헤더 커스터마이징

`react-navigation`에서는 타이틀 영역을 헤더(Header)라고 부른다.

## 타이틀 변경하기

`Home`이라고 표시된 텍스트를 변경해보자.

![image](https://user-images.githubusercontent.com/42884032/144098830-008aef54-b10a-40b6-9858-dbab2c634597.png)

헤더를 커스터마이징하는 방법은 두 가지가 있다.

- 첫 번째 방법은 `Stack.Screen`의 `Props`로 설정하는 것이다.
- 두 번째 방법은 화면 컴포넌트에서 `navigation.setOptions` 함수를 사용하는 것이다.

### 첫 번째 방법으로 Home 텍스트 변경하기

`Stack.Screen`의 `Props`로 설정하는 것이다.

```javascript
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: '홈'}} // <--
        />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

![image](https://user-images.githubusercontent.com/42884032/144099485-39273a25-5844-4540-ae55-0a6ee5b3d43a.png)

### 두 번째 방법으로 Home 텍스트 변경하기

화면 컴포넌트에서 `navigation.setOptions` 함수를 사용하는 것이다.

```javascript
function HomeScreen({navigation}) {

  useEffect(() => {
    navigation.setOptions({title: '홈 화면'});
  // cf) navigation 객체가 바뀔 일은 없지만, ESLint 규칙상 내부에서 사용하는 값을 넣어야 하기 때문에 추가
  }, [navigation]);

  return (...)
```

참고로 `useEffect`를 통해서 설정한 내비게이션 `option`은 `App` 컴포넌트에서 `Props`를 통해 설정한 `option`을 덮어쓰게 된다.

![image](https://user-images.githubusercontent.com/42884032/144100871-275cf20a-dcdd-4018-b23b-e25206500411.png)

<hr />

### 첫 번째 방법으로 Detail 텍스트 변경하기

`Stack.Screen`의 `Props`로 설정하는 것이다.

```javascript
<Stack.Screen
  name="Detail"
  component={DetailScreen}
  options={({route}) => ({
    title: `상세 정보 - ${route.params.id}`,
  })}
/>
```

![image](https://user-images.githubusercontent.com/42884032/144101616-3e005463-ea09-4e77-bc5c-f7f5362f51db.png)

### 두 번째 방법으로 Detail 텍스트 변경하기

화면 컴포넌트에서 `navigation.setOptions` 함수를 사용하는 것이다.

![image](https://user-images.githubusercontent.com/42884032/144101967-14b75a1d-9c6c-46df-9aee-0d97620ace06.png)

## 헤더 스타일 변경하기

아래 예시 코드는 홈화면의 헤드 스타일을 수정하는 코드이다. 예시코드보다 훨씬 많은 커스터마이징 요소를 제공하니 나중에 문서를 참고하자.

```javascript
<Stack.Screen
  name="Home"
  component={HomeScreen}
  options={{
    title: '홈',
    // Header 블록에 대한 스타일
    headerStyle: {
      backgroundColor: '#29b6f6',
    },
    // Header의 텍스트, 버튼들 색상
    headerTintColor: '#fff',
    // 타이틀 텍스트 스타일
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 20,
    },
  }}
/>
```

![image](https://user-images.githubusercontent.com/42884032/144103123-8e54319a-ca97-41e7-975a-78a2951847cf.png)

## 헤더의 좌측, 타이틀, 우측 영역에 다른 컴포넌트 보여주기

예시 코드의 상세 화면을 변경해 보았다.

```javascript
// App.js
const headerLeft = ({onPress}) => (
  <TouchableOpacity onPress={onPress}>
    <Text>Left</Text>
  </TouchableOpacity>
);

const headerTitle = ({children}) => (
  <View>
    <Text>{children}</Text>
  </View>
);

const headerRight = () => (
  <View>
    <Text>Right</Text>
  </View>
);

// ...

<Stack.Screen
  name="Detail"
  component={DetailScreen}
  options={({route}) => ({
    title: `상세 정보 - ${route.params.id}`,
    headerLeft,
    headerTitle,
    headerRight,
  })}
/>;
```

![image](https://user-images.githubusercontent.com/42884032/144104668-3b4a2306-c316-407f-bfc4-0a777fe89326.png)

ios와 다르게 안드로이드에서는 `<-` 좌측 화살표 표시가 나타나고 있다. 이를 없애고 싶다면 `headerBackVisible` 옵션을 `false`로 지정하자.

```javascript
<Stack.Screen
  name="Detail"
  component={DetailScreen}
  options={({route}) => ({
    title: `상세 정보 - ${route.params.id}`,
    headerBackVisible: false,
    headerLeft,
    headerTitle,
    headerRight,
  })}
/>
```

![image](https://user-images.githubusercontent.com/42884032/144105115-1f27f305-18dc-4835-9a65-a9f8247eca1e.png)

## 헤더 숨기기

헤더가 없는 화면이 필요할 때 사용한다. 실제로 이전 회사에서 특정화면에서 헤더를 없애달라는 요구사항이 있어 그때는 네이티브 개발자와 `URL Scheme`을 사용하여 해결한 경험이 있긴하다. RN에서 직접 없애보자.

먼저 헤더가 없는 스크린 컴포넌트를 추가한다.

```javascript
// screens/HeaderlessScreen.js
function HeaderlessScreen({navigation}) {
  return (
    <View>
      <Text>Header 없는 화면</Text>
      <Button onPress={() => navigation.pop()} title="뒤로가기" />
    </View>
  );
}

export default HeaderlessScreen;
```

스택 네비게이션의 헤더리스 스크린을 등록하고, 홈화면에서 이동 버튼을 생성후 이동해 보면, 안드로이드에서는 화면이 잘 나오지만, ios에서는 `StatusBar` 영역을 침범해서 화면에 보여진다.

![image](https://user-images.githubusercontent.com/42884032/144106619-7ce480f5-80c4-4c77-89d3-87aa7fea2b91.png)

이럴때는 이전에서 배웠던 `SafeAreaView` 컴포넌트를 이용해 해결하면 된다. 참고로 `react-navigation`에 `react-native-safe-area-context`가 내장되어 있기 때문에 `react-native`가 아닌 `react-native-safe-area-context`에서 불러와도 상관없다.

```javascript
import React from 'react';
import {Button, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

function HeaderlessScreen({navigation}) {
  return (
    <SafeAreaView>
      <View>
        <Text>Header 없는 화면</Text>
        <Button onPress={() => navigation.pop()} title="뒤로가기" />
      </View>
    </SafeAreaView>
  );
}

export default HeaderlessScreen;
```

![image](https://user-images.githubusercontent.com/42884032/144107803-85b49fbf-15ea-4077-b31b-d9ffce7d3cf8.png)

### 만약 전체 화면에서 헤더를 없애고 싶다면?

`Stack.Navigator`의 `screenOptions`에 `headerShown: false`을 지정해 주면 된다.

```javascript
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{headerShown: false}}>
        // ...
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

<hr />

# 드로어 내비게이터

사이드바를 모바일 앱에서는 드로어라고 부르며, 드로어 내비게이터(`Drawer Navigator`)는 좌측 또는 우측에 사이드바를 만들고 싶을 때 사용하는 내비게이터이다.

## 설치

3가지 라이브러리를 설치해 주자.

```bash
$ yarn add @react-navigation/drawer react-native-gesture-handler react-native-reanimated
```

- `react-native-gesture-handler`는 드로어 내비게이터에서 사용자 제스처를 인식하기 위해 내부적으로 사용하는 라이브러리
- `react-native-reanimated`는 내장된 애니메이션 효과보다 더 개선된 성능으로 애니메이션 효과를 구현해 주는 라이브러리

이 글 위에서 만들었던 내비게이터 기능의 상당 부분이 드로어 내비게이터에서는 동작하지 않으므로 다시 코드를 작성해 보자.

## 기본 사용법

스택 내비게이터와 유사한 사용 방식을 가진다. 드로어 내비게이터를 설정한 방향에서 반대 방향으로 스와이프 해도 드로어 내비게이터가 나온다.

```javascript
const Drawer = createDrawerNavigator();

function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        // 2021년 12월 2일 기준 최신 버전 6.1.8 기준
        screenOptions={{drawerPosition: 'right'}} // default value: 'left'
        backBehavior="history">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Setting" component={SettingScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
```

드로어 내비게이터의 위치를 과거 버전(정확한 것은 자신이 사용하는 버전을 확인하자. 나의 경우 `6.1.8`이다.)에서는 아래와 같이 변경해야 한다. 내가 설치한 버전의 경우 위와 같이 적용해 주면 된다. (최신 버전으로 넘어오면서 `drawerPosition` `Props`가 `deprecated` 되었다.)

```javascript
<NavigationContainer>
  <Drawer.Navigator
    initialRouteName="Home"
    // 과거 버전에서는...
    drawerPosition="right" // default value: 'left'
    backBehavior="history">
    // ...
  </Drawer.Navigator>
</NavigationContainer>
```

참고로 `drawerPosition`을 변경해준 경우 앱을 다시 실행시켜야 제대로 반영된다.

`backBehavior`의 경우 아래와 같은 값을 지정할 수 있다.

- initialRoute: 가장 첫 번째 화면을 보여준다.
- order: Drawer.Screen 컴포넌트를 사용한 순서에 따라 현재 화면의 이전 화면을 보여준다.
- history: 현재 화면을 열기 직전에 봤던 화면을 보여준다.
- none: 뒤로가기 기능을 막는다.
- firstRoute: 제일 먼저 사용된 Drawer.Screen 컴포넌트를 보여준다.

## 드로어 커스터마이징

- `Screen` 컴포넌트에 `options` Props를 통해 수정한다.
- `Drawer.Navigator` 컴포넌트에 `screenOptions` Props를 설정한다.

```javascript
// App.js 간단한 수정 예
function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        backBehavior="history"
        screenOptions={{
          drawerActiveBackgroundColor: '#fb8c00',
          drawerActiveTintColor: '#fff',
        }}>
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{title: '홈'}}
        />
        <Drawer.Screen
          name="Setting"
          component={SettingScreen}
          options={{title: '설정'}}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
```

![image](https://user-images.githubusercontent.com/42884032/144281474-703a6744-8a7e-492a-94eb-2f2a0f4c0751.png)

## drawerContent

`drawerContent`의 경우 드로어 영역에 아예 다른 컴포넌트를 보여주고 싶을 때 사용할 수 있으며, 함수 컴포넌트를 넣어주면 된다.

만약 ios도 지원하는 앱이라면 `drawerContent`를 지정할 때 `SafeAreaView`도 꼭 사용해야 `StatusBar`영역과 상단 영역이 겹치는 현상을 방지할 수 있다.

```javascript
function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        // ...
        drawerContent={({navigation}) => (
          <SafeAreaView>
            <Text>커스텀 드로어 content</Text>
            <Button title="닫기" onPress={() => navigation.closeDrawer()} />
          </SafeAreaView>
        )}>
        // ...
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
```

![image](https://user-images.githubusercontent.com/42884032/144282608-7e14f625-e94b-42b2-bec9-d69c375d2d35.png)

<hr />

# 하단 탭 내비게이터

페이스북의 하단 내비게이터 같은 앱 하단에 나오는 내비게이터를 말한다.

## 설치

아이콘도 추가할 예정이기 때문에 같이 설치해 준다.

```bash
$ yarn add @react-navigation/bottom-tabs react-native-vector-icons
```

## 기본 사용법

위에 내비게이터와 익숙한 방식으로 설정하면 된다. 화면만 등록해 줘도 아래와 같은 화면이 바로 생기는걸 볼 수 있다.

```javascript
const Tab = createBottomTabNavigator();

function HomeScreen() {
  return <Text>Home</Text>;
}

function SearchScreen() {
  return <Text>Search</Text>;
}

function NotificationScreen() {
  return <Text>Notification</Text>;
}

function MessageScreen() {
  return <Text>Message</Text>;
}

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home">
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Notification" component={NotificationScreen} />
        <Tab.Screen name="Message" component={MessageScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

![image](https://user-images.githubusercontent.com/42884032/144414813-c65797ed-a89e-4b35-9dcc-ed1261e43ecb.png)

### icon을 사용하기 위한 설정

처음에 해봤듯이 아이콘을 사용하기 위해서는 ios와 android에 각각의 설정이 필요하다.

#### ios

설정 후 앱 다시 실행

```javascript
// ios/LearnReactNavigation/Info.plist
// ...
// <key>UIViewControllerBasedStatusBarAppearance</key>
//   <false/>
// 맨 아래에 추가
	<key>UIAppFonts</key>
	<array>
		<string>MaterialIcons.ttf</string>
	</array>
// </dict>
// </plist>
```

#### android

설정 후 앱 다시 실행

```javascript
// android/app/build.gradle
// ...
// apply from: file("../../node_modules/@react-native-community/cli-platform-android/native_modules.gradle");
// applyNativeModulesAppBuildGradle(project)
// 맨 아래에 추가
project.ext.vectoricons = [
    iconFontNames: ['MaterialIcons.ttf']
]

apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

설정이 끝났다면 아래와 같이 아이콘을 추가해 주자.

```javascript
<Tab.Screen
  name="Home"
  component={HomeScreen}
  options={{
    title: '홈',
    tabBarIcon: ({color, size}) => (
      <Icon name="home" color={color} size={size} />
    ),
  }}
/>
<Tab.Screen
  name="Search"
  component={SearchScreen}
  options={{
    title: '검색',
    tabBarIcon: ({color, size}) => (
      <Icon name="search" color={color} size={size} />
    ),
  }}
/>
<Tab.Screen
  name="Notification"
  component={NotificationScreen}
  options={{
    title: '알림',
    tabBarIcon: ({color, size}) => (
      <Icon name="notifications" color={color} size={size} />
    ),
  }}
/>
<Tab.Screen
  name="Message"
  component={MessageScreen}
  options={{
    title: '메시지',
    tabBarIcon: ({color, size}) => (
      <Icon name="message" color={color} size={size} />
    ),
  }}
/>
```

`tabBarIcon`에는 함수 컴포넌트를 받는데 `size`, `color`, `focused`를 Props로 받는다. 사용을 안할거라면 생략해도 되며, 생략해 보면서 어떤게 변하는지 테스트 해봐도 좋다.

![image](https://user-images.githubusercontent.com/42884032/144417407-6ddb6fac-c7a4-4089-b4e1-3cc14cc997c1.png)

## 하단 탭 커스텀마이징

- 다른 내비게이터와 동일하게 `screenOptions`를 통해 커스텀 마이징할 수 있다. [[공식문서](https://reactnavigation.org/docs/tab-based-navigation)]
- 참고로 예전 버전에서는 탭에 관한 설정은 `tapBarOptions`를 통해 한다. 버전에 따라 제공되는 속성의 이름도 다를 수 있으니 이점을 꼭 확인하자.

```javascript
<NavigationContainer>
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={{
      tabBarShowLabel: false,
      tabBarActiveTintColor: '#fb8c00',
    }}></Tab.Navigator>
</NavigationContainer>
```

![image](https://user-images.githubusercontent.com/42884032/144419214-a8eade48-1bff-451b-aff5-d546c5cf7595.png)

<hr />

# 스택 내비게이터와 하단 탭 내비게이터 같이 사용하기

commit log: bf6850534717a3be4e3013d52fd8a25248f54d9b

## 기본 사용법

```javascript
// App.js
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
          component={MainScreen} // <-- MainScreen.js 참고
          // * 이 설정을 추가하지 않으면 헤더가 두개가 보이는 현상이 나타난다.
          // * 하단 탭 내비게이터를 스택 내비게이터 내부에서 사용하게 될 때 이 설정을 꼭 해주어야 한다.
          options={{headerShown: false}}
        />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

<hr />

# 머티리얼 내비게이터

머티리얼 상단 탭과 하단 탭 내비게이터에 대해 알아보자. 머티리얼 탭의 특징은 구글 머티리얼 디자인 특유의 리플(ripple) 효과가 나타나며, 스와이프를 통한 이동을 지원한다. [[공식 문서](https://reactnavigation.org/docs/material-top-tab-navigator/)]

물론 안드로이드에서만 리플 효과가 나타나며, 안드로이드 5.0 이상에서만 나타난다.

## 머티리얼 상단 내비게이터 설치

설치 후 앱 재실행

```bash
$ yarn add @react-navigation/material-top-tabs react-native-tab-view react-native-pager-view
```

## 머티리얼 상단 내비게이터 기본 사용법

기존 코드의 `MainScreen.js`에서 `Tab`을 생성하는 함수와 `size`만 변경해 줬다(머티리얼 상단 탭 내비게이터의 경우 아이콘 사이즈를 직접 지정해줘야 한다.).

```javascript
const Tab = createMaterialTopTabNavigator();
// ...
<Tab.Screen
  name="Home"
  component={HomeScreen}
  options={{
    title: '홈',
    tabBarIcon: ({color}) => <Icon name="home" color={color} size={24} />,
  }}
/>;
// ...
```

그리고 기존에 다뤘던 내비게이터와 달리 상단 헤더를 보여주지 않기 때문에 `App.js`에서 `options={{headerShown: false}}`로 설정했던 부분을 지워주자.

```javascript
// ...
<Stack.Screen name="Main" component={MainScreen} />
// ...
```

![image](https://user-images.githubusercontent.com/42884032/144423878-dcf6132d-5216-4cd5-8b22-7daad41a3f45.png)

## 머티리얼 상단 내비게이터 커스터마이징

커스터마이징 또한 다른 탭들과 동일한 방식으로 지원된다. 다만 머티리얼 탭에서만 추가된 속성들도 있으니 [[공식 문서](https://reactnavigation.org/docs/material-top-tab-navigator/)]를 참고하자.

![image](https://user-images.githubusercontent.com/42884032/144425796-39a4f496-40d2-443f-8ee4-c4519ddd6aa8.png)

<hr />

## 머티리얼 하단 내비게이터 설치

설치 후 앱 재실행

```bash
$ yarn add @react-navigation/material-bottom-tabs react-native-paper
```
