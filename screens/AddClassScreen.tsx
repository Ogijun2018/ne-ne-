import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Button,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import { setNewCollection, getClasses } from '../lib/firebase';
import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
import { KeyboardAwareSectionList } from 'react-native-keyboard-aware-scroll-view';

export default function AddClassScreen({ navigation }) {
  const days = [
    '日曜日',
    '月曜日',
    '火曜日',
    '水曜日',
    '木曜日',
    '金曜日',
    '土曜日',
  ];
  const [classes, setClasses] = useState();
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
  useEffect(() => {
    getClasses();
  }, []);

  return (
    <View style={styles.container}>
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
                console.log('aaa');
              }}
            >
              <Text
                style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}
              >
                {item.schoolName} {days[item.day]} {item.time}限 {item.name}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 100,
  },
});
