import React, { useState, useEffect } from 'react';
import firebase, { database } from 'firebase';
import { Image, StyleSheet, Text, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function UserInfoScreen({ route, navigation }) {
  const { userId, roomId } = route.params;
  const [state, setState] = useState();
  const [chatHistory, setChatHistory] = useState();
  const userIconUrl = '../assets/images/sample_user_icon.png';

  const getChatHistory = async (userId: string) => {
    await firebase
      .database()
      .ref('/rooms/' + roomId + '/chat/' + userId + '/')
      .once('value', (snapshot) => {
        setState(snapshot.val());
      });
  };

  const getUserInformation = async (userId: string) => {
    await firebase
      .database()
      .ref('/users/' + userId + '/')
      .once('value', (snapshot) => {
        setState(snapshot.val());
      });
  };

  useEffect(() => {
    getUserInformation(userId);
  }, []);

  return (
    <View style={styles.container}>
      {state ? (
        <React.Fragment>
          {state.imageUrl ? (
            <Image
              source={{ uri: state.imageUrl }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 100,
                marginTop: 10,
              }}
            />
          ) : (
            <Image
              source={require(userIconUrl)}
              style={{ width: 60, height: 60, marginTop: 10 }}
            />
          )}
          <Text style={{ fontSize: 40, fontWeight: 'bold' }}>{state.name}</Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              backgroundColor: '#EBF8FF',
              width: '75%',
              padding: 20,
              borderRadius: 5,
              marginTop: 10,
            }}
          >
            <FontAwesome5 name="school" color={'#2f95dc'} size={30} />
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingHorizontal: 20,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: '500' }}>
                {state.school}
              </Text>
              <Text>{state.belong}</Text>
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              backgroundColor: '#EBF8FF',
              width: '75%',
              padding: 20,
              borderRadius: 5,
              marginTop: 10,
            }}
          >
            <FontAwesome5 name="twitter" color={'#2f95dc'} size={30} />
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                paddingHorizontal: 20,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: '500' }}>
                @ {state.snsAccount}
              </Text>
            </View>
          </View>
        </React.Fragment>
      ) : (
        <Text>読み込み中…</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: '100%',
    // justifyContent: 'center',
    alignItems: 'center',
    // paddingTop: 100,
  },
});
