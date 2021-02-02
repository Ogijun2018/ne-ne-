import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  SafeAreaView,
  Image,
} from 'react-native';
import { Classes } from '../types/classes';
import * as firebase from 'firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';

export default function MainHome({ navigation }: { navigation: any }, ref) {
  const [classes, setClasses] = useState();
  const [imageUrl, setImageUrl] = useState();
  const isFocused = useIsFocused();
  const userIconUrl = '../assets/images/sample_user_icon.png';
  const days = ['日曜', '月曜', '火曜', '水曜', '木曜', '金曜', '土曜'];
  const getClasses = async () => {
    const uid = await AsyncStorage.getItem('uid');
    const ref = `/users/${uid}/classes/`;
    const list = [];
    await firebase
      .database()
      .ref(ref)
      .once('value', (snapshot) => {
        snapshot.forEach((child) => {
          list.push({
            key: child.key,
            name: child.val().name,
            roomId: child.val().roomId,
            schoolName: child.val().schoolName,
            day: child.val().day,
            time: child.val().time,
          });
        });
        setClasses(list);
      });
  };

  const getIcon = async () => {
    const imageUrl = await AsyncStorage.getItem('profileImage');
    setImageUrl(imageUrl);
  };

  useEffect(() => {
    getClasses();
    getIcon();
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          padding: 25,
        }}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: 40, height: 40, borderRadius: 100 }}
          />
        ) : (
          <Image
            source={require(userIconUrl)}
            style={{ width: 40, height: 40, borderRadius: 100 }}
          />
        )}
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 35,
            paddingLeft: 15,
          }}
        >
          Home
        </Text>
      </View>
      {classes && classes.length !== 0 ? (
        <FlatList
          style={{ width: '100%' }}
          data={classes}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderRadius: 5,
                  borderColor: '#33A3F2',
                  backgroundColor: '#2f95dc',
                  height: 50,
                  justifyContent: 'center',
                  paddingLeft: 10,
                  marginVertical: 5,
                  marginHorizontal: 20,
                }}
                onPress={() => {
                  navigation.navigate('ChatNavigator', {
                    screen: 'ChatScreen',
                    params: {
                      roomId: item.roomId,
                      roomName: item.name,
                    },
                  });
                }}
              >
                <Text
                  style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}
                >
                  {item.schoolName} {days[item.day]}
                  {item.time}限 {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <View
          style={{
            flex: 1,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 20, color: '#ccc', marginBottom: 50 }}>
            授業を登録しましょう！
          </Text>
        </View>
      )}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('NewClassNavigator');
        }}
        style={{
          position: 'absolute',
          right: 30,
          bottom: 20,
          width: 60,
          height: 60,
        }}
      >
        <View
          style={{
            borderRadius: 100,
            width: 60,
            height: 60,
            backgroundColor: '#89D9F9',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 30 }}>
            ＋
          </Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
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
});
