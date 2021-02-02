import React, { useState, useEffect, useRef } from 'react';
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
  Modal,
} from 'react-native';
import { FontAwesome, FontAwesome5, AntDesign } from '@expo/vector-icons';
import { RFPercentage } from 'react-native-responsive-fontsize';
import firebase from 'firebase';
import {
  getMessageDBRef,
  getMessageRef,
  getUserPositionRef,
  remove,
} from '../lib/firebase';
import { Position } from '../types/message';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
const ITEM_WIDTH = Dimensions.get('window').width;

export default function ChatScreen({ route, navigation }) {
  const { roomId, roomName } = route.params;
  const isFocused = useIsFocused();
  const intervalRef = useRef(null);
  const [stateSeats, setSeats] = useState([]);
  const [myPlace, setMyPlace] = useState([]);
  const [text, setText] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [imageUrl, setImageUrl] = useState();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const userIconUrl = '../assets/images/sample_user_icon.png';
  const [userInfoState, setUserInfoState] = useState();
  const [userChatHistoryState, setUserChatHistoryState] = useState();

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

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    // setUserInfoState();
  };

  const sendMessage = async (value: string, roomId: string) => {
    if (value != '') {
      // positionの方のチャット追加
      const docRef = await getMessageRef(roomId, userId);
      const newMessage = {
        createdAt: Date.now(),
        text: value,
        chatVisible: true,
      };
      await docRef.update(newMessage);

      // chatの方のチャット追加 一時的なDBとして置いておく
      const docRefChat = await getMessageDBRef(roomId, userId);
      const newChatMessage = {
        createdAt: Date.now(),
        text: value,
      };
      await docRefChat.push(newChatMessage);

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
            chatVisible: keys[i].chatVisible,
            icon: keys[i].icon,
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
              seat.chatVisible = param.chatVisible;
              seat.icon = param.icon;
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
    icon: string,
  ) => {
    const ref = await getUserPositionRef(roomId, uid);
    const newPosition = {
      userId: uid,
      icon: icon,
      x: position.x,
      y: position.y,
    } as Position;
    await ref.update(newPosition);
  };

  const handleItemPress = (item: { x: number; y: number; userId: string }) => {
    if (item.userId) {
      // ユーザーがいたら詳細画面へ飛ぶ
      getUserInfo(item.userId);
      getUserChatHistory(item.userId);
      openModal();
    } else {
      // ユーザーがいなかったら席の移動
      sendUserPosition(roomId, item, userId, imageUrl);
      setMyPlace({ x: item.x, y: item.y });
    }
  };

  const handleChatVisible = async (roomId: string) => {
    await firebase
      .database()
      .ref('rooms/' + roomId + '/position/')
      .once('value', (snapshot) => {
        const keys = [];
        snapshot.forEach((item) => {
          const itemVal = item.val();
          keys.push(itemVal);
        });
        for (let i = 0; i < keys.length; i++) {
          if (
            keys[i].createdAt &&
            keys[i].chatVisible &&
            keys[i].createdAt + 5000 <= Date.now()
          ) {
            const updatedData = {
              chatVisible: false,
            };
            firebase
              .database()
              .ref('rooms/' + roomId + '/position/' + keys[i].userId + '/')
              .update(updatedData);
          }
        }
      });
  };

  const signin = async () => {
    const uid = await AsyncStorage.getItem('uid');
    setUserId(uid);
    const imageUrl = await AsyncStorage.getItem('profileImage');
    setImageUrl(imageUrl);
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

  const getUserInfo = async (userId: string) => {
    await firebase
      .database()
      .ref('/users/' + userId + '/')
      .once('value', (snapshot) => {
        setUserInfoState(snapshot.val());
      });
  };

  const getUserChatHistory = async (userId: string) => {
    await firebase
      .database()
      .ref('/rooms/' + roomId + '/chat/' + userId + '/')
      .orderByChild('createdAt')
      .once('value', (snapshot) => {
        const keys = [];
        snapshot.forEach((item) => {
          const itemVal = item.val();
          keys.push(itemVal);
        });
        setUserChatHistoryState(keys);
      });
  };

  const renderChatHistory = ({ item }) => {
    const tempTime = moment(item.createdAt);

    return (
      <View style={{ flexDirection: 'row', height: 40 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 10,
          }}
        >
          <Text
            style={{
              width: 60,
              fontSize: 15,
              color: 'gray',
            }}
          >
            {tempTime.format('hh:mm')}
          </Text>
          <Text style={{ fontSize: 15, width: '75%' }}>{item.text}</Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    signin();
    getMessages(roomId);
    if (isFocused) {
      intervalRef.current = setInterval(() => {
        handleChatVisible(roomId);
      }, 2500);
    } else {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      // 退出するときに自分の情報を部屋から削除
      remove('rooms/' + roomId + '/position/' + userId + '/');
      remove('rooms/' + roomId + '/chat/' + userId + '/');
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1.5 }}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={63}
      >
        <FlatList
          contentContainerStyle={styles.flatListContainerStyle}
          data={stateSeats}
          keyExtractor={(item, index) => index.toString()}
          numColumns={4}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleItemPress(item, userId)}>
              {item.userId ? (
                <React.Fragment>
                  {item.chatVisible && (
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
                    </React.Fragment>
                  )}
                  {item.icon ? (
                    <View style={styles.imageStyle}>
                      <Image
                        style={{
                          width: ITEM_WIDTH / 7 - 2,
                          height: ITEM_WIDTH / 6 - 7,
                          borderRadius: 100,
                        }}
                        source={{ uri: item.icon }}
                      />
                    </View>
                  ) : (
                    <Image
                      style={styles.imageStyle}
                      source={require(userIconUrl)}
                    />
                  )}
                </React.Fragment>
              ) : (
                <Image style={styles.imageStyle} source={null} />
              )}
            </TouchableOpacity>
          )}
        />
        <Modal
          visible={modalVisible}
          animationType={'slide'}
          onRequestClose={() => closeModal()}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => closeModal()}
              style={{
                position: 'absolute',
                top: 40,
                left: 20,
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <AntDesign name="closecircleo" size={40} color={'black'} />
            </TouchableOpacity>
            {userInfoState ? (
              <React.Fragment>
                <View
                  style={{
                    display: 'flex',
                    flex: 4.5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {userInfoState.imageUrl ? (
                    <Image
                      source={{ uri: userInfoState.imageUrl }}
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 100,
                        marginTop: 20,
                      }}
                    />
                  ) : (
                    <Image
                      source={require(userIconUrl)}
                      style={{ width: 60, height: 60, marginTop: 10 }}
                    />
                  )}
                  <Text
                    style={{ fontSize: 35, fontWeight: 'bold', paddingTop: 10 }}
                  >
                    {userInfoState.name}
                  </Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'row',
                    backgroundColor: '#EBF8FF',
                    width: '75%',
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <FontAwesome5 name="school" color={'#2f95dc'} size={20} />
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      paddingHorizontal: 20,
                    }}
                  >
                    <Text style={{ fontSize: 15, fontWeight: '500' }}>
                      {userInfoState.school}
                    </Text>
                    <Text>{userInfoState.belong}</Text>
                  </View>
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    backgroundColor: '#EBF8FF',
                    width: '75%',
                    // padding: 20,
                    borderRadius: 5,
                    marginTop: 10,
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FontAwesome5 name="twitter" color={'#2f95dc'} size={20} />
                  <View
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      paddingHorizontal: 20,
                    }}
                  >
                    <Text style={{ fontSize: 15, fontWeight: '500' }}>
                      @ {userInfoState.snsAccount}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    display: 'flex',
                    flex: 7,
                    width: '95%',
                    backgroundColor: '#EBF8FF',
                    marginTop: 10,
                    marginBottom: 50,
                    borderRadius: 5,
                  }}
                >
                  <FlatList
                    keyExtractor={(item, index) => index}
                    data={userChatHistoryState}
                    renderItem={renderChatHistory}
                  />
                </View>
              </React.Fragment>
            ) : (
              <Text>読み込み中…</Text>
            )}
          </View>
        </Modal>
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
    left: '100%',
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
