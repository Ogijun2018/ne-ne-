import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Button,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { setNewCollection, set as firebaseSet } from '../lib/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
import { KeyboardAwareSectionList } from 'react-native-keyboard-aware-scroll-view';
import { useIsFocused } from '@react-navigation/native';

export default function AddClassScreen({ navigation }) {
  const days = ['日曜', '月曜', '火曜', '水曜', '木曜', '金曜', '土曜'];
  const [classes, setClasses] = useState();
  const isFocused = useIsFocused();
  const getClasses = async () => {
    // 電気通信大学のところは自分がプロフィールに設定している大学名が入る
    // テスト環境として変更する
    const db = await firebase.database();
    const ref = db.ref('/classes/');
    ref.once('value', (snapshot) => {
      const list = [];
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

  const addClass = async (item) => {
    const uid = await AsyncStorage.getItem('uid');
    const ref = `/users/${uid}/classes/${item.roomId}/`;
    const result = await firebaseSet(ref, item);
    if (!result.success) {
      Alert.alert('科目の登録に失敗しました。');
    } else {
      navigation.navigate('NewClassNavigator');
    }
  };

  useEffect(() => {
    getClasses();
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 35,
          alignSelf: 'flex-start',
          padding: 25,
        }}
      >
        Add Classes
      </Text>
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
                addClass(item);
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
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('RegistClassScreen');
        }}
        style={{
          position: 'absolute',
          right: 30,
          bottom: 20,
          width: 150,
          height: 60,
        }}
      >
        <View
          style={{
            borderRadius: 100,
            width: 150,
            height: 60,
            backgroundColor: '#89D9F9',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>
            新規追加
          </Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
