import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ChatScreen from '../screens/ChatScreen';
import AddClassScreen from '../screens/AddClassScreen';
import RegistClassScreen from '../screens/RegistClassScreen';
import UserInfoScreen from '../screens/UserInfoScreen';
import MainHome from '../screens/MainHome';
import MainSettings from '../screens/MainSettings';
import { BottomTabParamList, MainHomeParamList, ChatParamList } from '../types';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function Navigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="MainHome"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
    >
      <BottomTab.Screen
        name="MainHome"
        component={MainHomeNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="home-sharp" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="MainSettings"
        component={MainSettings}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="settings-sharp" color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
const TabBarIcon = (props: { name: string; color: string }) => (
  <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />
);

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab

const MainHomeStack = createStackNavigator<MainHomeParamList>();

const MainHomeNavigator = () => (
  <MainHomeStack.Navigator initialRouteName="MainHomeScreen" headerMode="none">
    <MainHomeStack.Screen
      name="MainHomeScreen"
      component={MainHome}
      options={{ headerTitle: 'Home' }}
    />
    <MainHomeStack.Screen
      name="NewClassNavigator"
      component={NewClassNavigator}
      options={{ headerTitle: '新規授業登録' }}
    />
    <MainHomeStack.Screen name="ChatNavigator" component={ChatNavigator} />
  </MainHomeStack.Navigator>
);

const ChatStack = createStackNavigator<ChatParamList>();

const ChatNavigator = () => (
  <ChatStack.Navigator initialRouteName="ChatScreen">
    <ChatStack.Screen
      name="ChatScreen"
      component={ChatScreen}
      options={({ route }) => ({ title: route.params.roomName })}
    />
    <ChatStack.Screen
      name="UserInfoScreen"
      component={UserInfoScreen}
      options={{ headerTitle: 'ユーザー詳細画面' }}
    />
  </ChatStack.Navigator>
);

const NewClassStack = createStackNavigator();

const NewClassNavigator = () => (
  <NewClassStack.Navigator initialRouteName="AddClassScreen">
    <NewClassStack.Screen
      name="AddClassScreen"
      component={AddClassScreen}
      options={{ headerTitle: '既存のクラス選択画面' }}
    />
    <NewClassStack.Screen
      name="RegistClassScreen"
      component={RegistClassScreen}
      options={{ headerTitle: '新しいコレクションを作成する画面' }}
    />
  </NewClassStack.Navigator>
);
