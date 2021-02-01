/* eslint-disable */
import { HeaderTitle } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Button } from 'react-native';
import { Classes } from '../types/classes';
import * as firebase from 'firebase';

export default function MainHome({ navigation }: { navigation: any }, ref) {
  const [userId, setUserId] = useState<string | undefined>();

  // const getClasses = async (userId: string) => {
  //     const classes = [] as Classes[];
  //     const query = await firebase.database().ref(ref).orderByKey();
  // };

  // const signin = async () => {
  //     const uid = await getUserId();
  //     setUserId(uid);
  // };

  // useEffect(() => {
  //     signin();
  //     getClasses(userId);
  // }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Main Home Screen</Text>
      <Button
        title="講義室1"
        onPress={() => {
          navigation.navigate('ChatNavigator', {
            screen: 'ChatScreen',
            params: {
              roomId: 'room1',
              roomName: '線形代数第一',
            },
          });
        }}
      />
      <Button
        title="講義室2"
        onPress={() => {
          navigation.navigate('ChatNavigator', {
            screen: 'ChatScreen',
            params: {
              roomId: 'room2',
              roomName: '微分積分学第一',
            },
          });
        }}
      />
      <Button
        title="講義室3"
        onPress={() => {
          navigation.navigate('ChatNavigator', {
            screen: 'ChatScreen',
            params: {
              roomId: 'room3',
              roomName: '物理学概論第一',
            },
          });
        }}
      />
      <Button
        title="講義室4"
        onPress={() => {
          navigation.navigate('ChatNavigator', {
            screen: 'ChatScreen',
            params: {
              roomId: 'room4',
              roomName: 'Academic Spoken English',
            },
          });
        }}
      />
      <Button
        title="新しい講義を追加する"
        onPress={() => {
          navigation.navigate('NewClassNavigator');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
