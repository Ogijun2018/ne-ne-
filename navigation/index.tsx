import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList } from '../types';
import Navigator from './Navigator';
import InitializeStart from '../screens/Start';
import InitializeWelcome from '../screens/Welcome';
import InitializeLogin from '../screens/Login';
import LinkingConfiguration from './LinkingConfiguration';

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation() {
  return (
    <NavigationContainer linking={LinkingConfiguration}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => (
  <Stack.Navigator
    initialRouteName="InitializeStart"
    screenOptions={{ headerShown: true }}
  >
    <Stack.Screen
      name="Root"
      component={Navigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="InitializeStart"
      component={InitializeStart}
      options={{ headerShown: false, title: '' }}
    />
    <Stack.Screen
      name="InitializeWelcome"
      component={InitializeWelcome}
      options={{ title: '新規登録' }}
    />
    <Stack.Screen
      name="InitializeLogin"
      component={InitializeLogin}
      options={{ title: 'ログイン' }}
    />
    <Stack.Screen
      name="NotFound"
      component={NotFoundScreen}
      options={{ title: 'Oops!' }}
    />
  </Stack.Navigator>
);
