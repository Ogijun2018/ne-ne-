import * as WebBrowser from 'expo-web-browser';
import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Button } from 'react-native';
import TextInput from '../components/atoms/TextInput';
import { setNewCollection, getClasses } from '../lib/firebase';
import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

export default function AddClassScreen({ navigation }) {
  const [classes, setClasses] = useState('');
  const [classRoomId, setClassRoomId] = useState('');
  const getClasses = async () => {
    // 電気通信大学のところは自分がプロフィールに設定している大学名が入る
    // テスト環境として変更する
    const db = await firebase.database();
    const ref = db.ref('/classes/電気通信大学/');
    // Attach an asynchronous callback to read the data at our posts reference
    ref.once(
      'value',
      function (snapshot) {
        console.log('----------------');
        snapshot.forEach((ObjectPerDay) => {
          ObjectPerDay.forEach((ObjectPerTime) => {
            ObjectPerTime.forEach((ObjectPerClass) => {
              const sample = ObjectPerClass.val();
              console.log(sample.name, sample.roomId);
              setClasses(sample.name);
              setClassRoomId(sample.roomId);
              console.log('=======');
            });
          });
        });
      },
      function (errorObject) {
        console.log('The read failed: ' + errorObject.code);
      },
    );
  };
  useEffect(() => {
    console.log('useEffect');
    getClasses();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>AddClassScreen</Text>
      {/* {classNames.map((data) => {
                return <Text>{data}</Text>;
            })}
            {classRoomIds.map((data) => {
                return <Text>{data}</Text>;
            })} */}
      {/* {classes.name.map((item) => (
                <Text>{item}</Text>
            ))} */}
      <Text>{classes}</Text>
      <Text>{classRoomId}</Text>
      <Button
        title="新しい授業を追加する"
        onPress={() => {
          navigation.navigate('RegistClassScreen');
        }}
      />
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
