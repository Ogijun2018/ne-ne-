import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { upload as firebaseUpload } from '../lib/firebase';

export default function MainSettings() {
  const userIconUrl = '../assets/images/sample_user_icon.png';
  const [state, setState] = useState();

  const [name, onChangeName] = useState('');
  const [school, onChangeSchool] = useState('');
  const [belong, onChangeBelong] = useState('');
  const [snsAccount, onChangeSnsAccount] = useState('');
  const [email, onChangeEmail] = useState('');
  const [password, onChangePass] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    getUserInformation();
  }, []);

  const getUserInformation = async () => {
    const uid = await AsyncStorage.getItem('uid');
    await firebase
      .database()
      .ref('/users/' + uid + '/')
      .on('value', (snapshot) => {
        const list = [];
        list.push(snapshot.val());
        setState(snapshot.val());
      });
  };

  const changeInfo = async (value) => {
    const uid = await AsyncStorage.getItem('uid');
    await firebase
      .database()
      .ref('/users/' + uid + '/')
      .update(value, (error) => {
        if (error) {
          console.log(error);
        }
      });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    let imageDownloadURL = null;
    const uid = await AsyncStorage.getItem('uid');
    const localUri = await fetch(result.uri);
    const localBlob = await localUri.blob();
    const filename = `${uid}/profile.jpeg`;
    const imageUploadResult = await firebaseUpload(
      'images/' + filename,
      localBlob,
    );
    if (imageUploadResult.success) {
      imageDownloadURL = imageUploadResult.downloadURL;
      await AsyncStorage.setItem('profileImage', imageDownloadURL);
    }

    if (!result.cancelled) {
      setImage(imageDownloadURL);
      changeInfo({ imageUrl: imageDownloadURL });
    }
  };

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
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 35,
            paddingLeft: 15,
          }}
        >
          Settings
        </Text>
      </View>
      {state ? (
        <ScrollView
          contentContainerStyle={{
            alignItems: 'center',
          }}
          style={{
            width: '100%',
          }}
        >
          <View style={styles.stateViewStyle}>
            <Text style={styles.stateTextStyle}>{state.name}</Text>
            <TextInput
              onChangeText={(text) => onChangeName(text)}
              autoFocus
              placeholder="ニックネーム"
              placeholderTextColor="#ccc"
              value={name}
              style={styles.textInputStyle}
            />
            <TouchableOpacity
              style={styles.changeButtonStyle}
              onPress={() => {
                changeInfo({ name: name });
                onChangeName('');
              }}
            >
              <Text style={styles.changeButtonTextStyle}>変更</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.stateViewStyle}>
            <Text style={styles.stateTextStyle}>{state.school}</Text>
            <TextInput
              onChangeText={(text) => onChangeSchool(text)}
              value={school}
              placeholder="学校名"
              placeholderTextColor="#ccc"
              style={styles.textInputStyle}
            />
            <TouchableOpacity
              style={styles.changeButtonStyle}
              onPress={() => {
                changeInfo({ school: school });
                onChangeSchool('');
              }}
            >
              <Text style={styles.changeButtonTextStyle}>変更</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.stateViewStyle}>
            <Text style={styles.stateTextStyle}>{state.belong}</Text>
            <TextInput
              onChangeText={(text) => onChangeBelong(text)}
              value={belong}
              placeholder="学部/専攻名"
              placeholderTextColor="#ccc"
              style={styles.textInputStyle}
            />
            <TouchableOpacity
              style={styles.changeButtonStyle}
              onPress={() => {
                changeInfo({ belong: belong });
                onChangeBelong('');
              }}
            >
              <Text style={styles.changeButtonTextStyle}>変更</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.stateViewStyle}>
            <Text style={styles.stateTextStyle}>{state.snsAccount}</Text>
            <TextInput
              onChangeText={(text) => onChangeSnsAccount(text)}
              value={snsAccount}
              placeholder="SNSアカウント"
              placeholderTextColor="#ccc"
              style={styles.textInputStyle}
            />
            <TouchableOpacity
              style={styles.changeButtonStyle}
              onPress={() => {
                changeInfo({ snsAccount: snsAccount });
                onChangeSnsAccount('');
              }}
            >
              <Text style={styles.changeButtonTextStyle}>変更</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.stateViewStyle}>
            <Text style={styles.stateTextStyle}>{state.email}</Text>
            <TextInput
              onChangeText={(text) => onChangeEmail(text)}
              value={email}
              placeholder="メールアドレス（必須）"
              placeholderTextColor="#ccc"
              style={styles.textInputStyle}
            />
            <TouchableOpacity
              style={styles.changeButtonStyle}
              onPress={() => {
                changeInfo({ email: email });
                onChangeEmail('');
              }}
            >
              <Text style={styles.changeButtonTextStyle}>変更</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.stateViewStyle}>
            <Text style={styles.stateTextStyle}>{state.password}</Text>
            <TextInput
              onChangeText={(text) => onChangePass(text)}
              value={password}
              placeholder="パスワード（必須）"
              placeholderTextColor="#ccc"
              style={styles.textInputStyle}
              secureTextEntry={true}
            />
            <TouchableOpacity
              style={styles.changeButtonStyle}
              onPress={() => {
                changeInfo({ password: password });
                onChangePass('');
              }}
            >
              <Text style={styles.changeButtonTextStyle}>変更</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              width: '100%',
              height: 100,
            }}
          >
            <Text style={styles.stateTextStyle}>アイコン</Text>
            <View style={{ width: '40%', alignItems: 'center' }}>
              {state.imageUrl ? (
                <Image
                  source={{ uri: state.imageUrl }}
                  style={{ width: 80, height: 80, borderRadius: 100 }}
                />
              ) : (
                <Image
                  source={require(userIconUrl)}
                  style={{
                    width: 80,
                    height: 80,
                    borderWidth: 1,
                    borderRadius: 100,
                  }}
                />
              )}
            </View>
            <TouchableOpacity
              style={styles.changeButtonStyle}
              onPress={pickImage}
            >
              <Text style={styles.changeButtonTextStyle}>変更</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>
          <Text>読み込み中…</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // width: '100%',
    // backgroundColor: '#fff',
  },
  stateViewStyle: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 50,
  },
  stateTextStyle: {
    fontSize: 15,
    fontWeight: 'bold',
    // width: 80,
    width: '30%',
    // backgroundColor: 'red',
  },
  changeButtonStyle: {
    width: '15%',
    backgroundColor: '#2F95DC',
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeButtonTextStyle: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  textInputStyle: {
    // marginBottom: 20,
    borderWidth: 1,
    width: '40%',
    height: 40,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingLeft: 10,
    // backgroundColor: 'red',
  },
  listItemStyle: {
    height: '10%',
    width: '100%',
    // backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
});
