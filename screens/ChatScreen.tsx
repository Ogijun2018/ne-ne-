import React, { useState, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  View,
  Alert,
  Image,
  FlatList,
  Platform,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { RFPercentage } from 'react-native-responsive-fontsize';
import firebase from 'firebase';
import { getMessageRef, getUserId, getUserPositionRef } from '../lib/firebase';
import { Position } from '../types/message';
const ITEM_WIDTH = Dimensions.get('window').width;

export default function ChatScreen({ route, navigation }) {
  const { roomId, roomName } = route.params;
  const [stateSeats, setSeats] = useState([]);
  const [myPlace, setMyPlace] = useState([]);
  const [text, setText] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const userIconUrl = '../assets/images/sample_user_icon.png';

  const seats = [
    { x: 0, y: 0, id: 1 },
    { x: 1, y: 0, id: 2 },
    { x: 2, y: 0, id: 3 },
    { x: 3, y: 0, id: 4 },
    { x: 0, y: 1, id: 5 },
    { x: 1, y: 1, id: 6 },
    { x: 2, y: 1, id: 7 },
    { x: 3, y: 1, id: 8 },
    { x: 0, y: 2, id: 9 },
    { x: 1, y: 2, id: 10 },
    { x: 2, y: 2, id: 11 },
    { x: 3, y: 2, id: 12 },
    { x: 0, y: 3, id: 13 },
    { x: 1, y: 3, id: 14 },
    { x: 2, y: 3, id: 15 },
    { x: 3, y: 3, id: 16 },
    { x: 0, y: 4, id: 17 },
    { x: 1, y: 4, id: 18 },
    { x: 2, y: 4, id: 19 },
    { x: 3, y: 4, id: 20 },
    { x: 0, y: 5, id: 21 },
    { x: 1, y: 5, id: 22 },
    { x: 2, y: 5, id: 23 },
    { x: 3, y: 5, id: 24 },
  ];

  let copySeats = [];

  const sendMessage = async (value: string, roomId: string) => {
    if (value != '') {
      const docRef = await getMessageRef(roomId, userId);
      const newMessage = {
        createdAt: Date.now(),
        text: value,
      };
      await docRef.update(newMessage);
      setText('');
    } else {
      Alert.alert('エラー', 'メッセージを入力してください');
    }
  };

  const getMessages = async (roomId: string) => {
    await firebase
      .database()
      .ref('rooms/' + roomId + '/position/')
      .on('value', (snapshot) => {
        const messages = [];
        const keys = [];
        snapshot.forEach((item) => {
          const itemVal = item.val();
          keys.push(itemVal);
        });
        for (let i = 0; i < keys.length; i++) {
          messages.push({
            text: keys[i].text,
            userId: keys[i].userId,
            x: keys[i].x,
            y: keys[i].y,
            createdAt: keys[i].createdAt,
          });
        }
        // Deep copy
        copySeats = JSON.parse(JSON.stringify(seats));
        copySeats.forEach((seat) => {
          messages.forEach((param) => {
            if (seat.x === param.x && seat.y === param.y) {
              // 一致したところでseatsにparamを追加する
              seat.text = param.text;
              seat.userId = param.userId;
              seat.createdAt = param.createdAt;
            }
          });
        });
        setSeats(copySeats);
      });
  };

  const sendUserPosition = async (
    roomId: string,
    position: { x: number; y: number },
    uid: string,
  ) => {
    const ref = await getUserPositionRef(roomId, uid);
    const newPosition = {
      userId: uid,
      x: position.x,
      y: position.y,
    } as Position;
    await ref.update(newPosition);
  };

  const handleItemPress = (item: { x: number; y: number; userId: string }) => {
    if (item.userId) {
      // ユーザーがいたら詳細画面へ飛ぶ
      navigation.navigate('UserInfoScreen');
    } else {
      // ユーザーがいなかったら席の移動
      sendUserPosition(roomId, item, userId);
      setMyPlace({ x: item.x, y: item.y });
    }
  };

  const signin = async () => {
    const uid = await getUserId();
    setUserId(uid);
    sendUserPosition(roomId, { x: 2, y: 2 }, userId);
  };

  const levelingChatText = (text) => {
    if (text) {
      let leveledMemo = text;
      const maxWordCount = 25;
      if (leveledMemo.match(/\n/)) {
        // 改行→空白に変換
        leveledMemo = leveledMemo.replace(/\r?\n/g, '　');
      }
      if (leveledMemo.length >= maxWordCount) {
        leveledMemo = leveledMemo.slice(0, maxWordCount - 1);
        leveledMemo += '…';
      }

      return leveledMemo;
    } else {
      return null;
    }
  };

  useEffect(() => {
    signin();
    getMessages(roomId);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1.5 }}
        behavior="padding"
        keyboardVerticalOffset={63}
      >
        <FlatList
          contentContainerStyle={styles.flatListContainerStyle}
          data={stateSeats}
          keyExtractor={(item, index) => index.toString()}
          numColumns={4}
          renderItem={({ item }) => (
            <React.Fragment>
              <TouchableOpacity onPress={() => handleItemPress(item, userId)}>
                {item.userId ? (
                  <React.Fragment>
                    <View
                      style={[
                        styles.triangle,
                        { transform: [{ translateX: -50 }] },
                      ]}
                    />
                    <View style={styles.chatTextView}>
                      {Math.abs(item.x - myPlace.x) <= 1 &&
                      Math.abs(item.y - myPlace.y) <= 1 ? (
                        <Text
                          style={{
                            fontSize: RFPercentage(1.5),
                          }}
                        >
                          {levelingChatText(item.text)}
                        </Text>
                      ) : (
                        <Text
                          style={{
                            fontSize: RFPercentage(1.5),
                          }}
                        >
                          •••
                        </Text>
                      )}
                    </View>
                    <Image
                      style={styles.imageStyle}
                      source={require(userIconUrl)}
                    />
                  </React.Fragment>
                ) : (
                  <Image style={styles.imageStyle} source={null} />
                )}
              </TouchableOpacity>
            </React.Fragment>
          )}
        />
        <View style={styles.inputTextContainer}>
          <TextInput
            style={styles.inputText}
            onChangeText={(value) => {
              setText(value);
            }}
            value={text}
            placeholder="メッセージを入力"
            placeholderTextColor="#777"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
          />
          <TouchableOpacity
            onPress={() => {
              sendMessage(text, roomId);
            }}
            style={{
              height: 50,
              width: '20%',
              backgroundColor: '#2f95dc',
              borderRadius: 10,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 10,
            }}
          >
            <FontAwesome name="send" color={'white'} size={25} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#333',
    justifyContent: 'center',
    alignContent: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  flatListContainerStyle: {
    paddingTop: 50,
    paddingBottom: 20,
    alignSelf: 'center',
  },
  inputTextContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
  },
  inputText: {
    color: 'black',
    borderWidth: 2,
    borderColor: '#999',
    height: 30,
    flex: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  chatTextView: {
    position: 'absolute',
    bottom: 65,
    backgroundColor: 'white',
    maxWidth: 100,
    borderRadius: 5,
    padding: 10,
    zIndex: 100,
    alignSelf: 'center',
  },
  imageStyle: {
    width: ITEM_WIDTH / 7,
    height: ITEM_WIDTH / 6 - 5,
    margin: 15,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
  },
  triangle: {
    position: 'absolute',
    top: '20%',
    left: '97%',
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderTopColor: 'white',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    zIndex: 100,
  },
});
