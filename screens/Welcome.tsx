import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
  View,
  TextInput,
  Platform,
  Button,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
// import TextInput from '../components/atoms/TextInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signup as firebaseSignup, set as firebaseSet } from '../lib/firebase';
import * as ImagePicker from 'expo-image-picker';
import { upload as firebaseUpload } from '../lib/firebase';

export default function InitializeWelcome({ navigation }) {
  const [name, onChangeName] = useState('');
  const [school, onChangeSchool] = useState('');
  const [belong, onChangeBelong] = useState('');
  const [snsAccount, onChangeSnsAccount] = useState('');
  const [email, onChangeEmail] = useState('');
  const [password, onChangePass] = useState('');
  const [image, setImage] = useState(null);
  const userIconUrl = '../assets/images/sample_user_icon.png';

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={63}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ paddingBottom: 50 }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 35,
              alignSelf: 'center',
              padding: 30,
            }}
          >
            Sign Up!
          </Text>
          <Text style={{ fontSize: 15 }}>
            あなたのプロフィールを教えてください
          </Text>
        </View>
        <TextInput
          onChangeText={(text) => onChangeName(text)}
          autoFocus
          placeholder="ニックネーム"
          placeholderTextColor="#ccc"
          value={name}
          style={styles.textInputStyle}
        />
        <TextInput
          onChangeText={(text) => onChangeSchool(text)}
          value={school}
          placeholder="学校名"
          placeholderTextColor="#ccc"
          style={styles.textInputStyle}
        />
        <TextInput
          onChangeText={(text) => onChangeBelong(text)}
          value={belong}
          placeholder="学部/専攻名"
          placeholderTextColor="#ccc"
          style={styles.textInputStyle}
        />
        <TextInput
          onChangeText={(text) => onChangeSnsAccount(text)}
          value={snsAccount}
          placeholder="SNSアカウント"
          placeholderTextColor="#ccc"
          style={styles.textInputStyle}
        />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginBottom: 20,
            justifyContent: 'space-evenly',
            alignItems: 'center',
            // backgroundColor: 'blue',
            width: '75%',
          }}
        >
          {image ? (
            <Image
              source={{ uri: image }}
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
          <TouchableOpacity
            onPress={pickImage}
            style={{
              backgroundColor: '#2f95dc',
              width: '45%',
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
            }}
          >
            <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>
              アイコンを選択
            </Text>
          </TouchableOpacity>
        </View>
        <TextInput
          onChangeText={(text) => onChangeEmail(text)}
          value={email}
          placeholder="メールアドレス（必須）"
          placeholderTextColor="#ccc"
          style={styles.textInputStyle}
        />
        <TextInput
          onChangeText={(text) => onChangePass(text)}
          value={password}
          placeholder="パスワード（必須）"
          placeholderTextColor="#ccc"
          style={styles.textInputStyle}
          secureTextEntry={true}
        />

        <TouchableOpacity
          style={{
            width: '75%',
            height: 60,
            backgroundColor: '#2f95dc',
            justifyContent: 'center',
            borderRadius: 50,
            margin: 10,
          }}
          onPress={() => {
            if (email === '' || password === '') {
              Alert.alert('メールアドレスとパスワードを確認してください');

              return;
            }
            registUser(
              navigation,
              name,
              school,
              belong,
              image,
              snsAccount,
              email,
              password,
            );
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              color: 'white',
              alignSelf: 'center',
              fontSize: 20,
            }}
          >
            OK!
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

async function registUser(
  navigation,
  name,
  school,
  belong,
  image,
  snsAccount,
  email,
  password,
) {
  const result = await firebaseSignup(email, password);
  let imageDownloadURL = null;
  if (result.success) {
    if (image) {
      const localUri = await fetch(image);
      const localBlob = await localUri.blob();
      const filename = `${result.user.uid}/profile.jpeg`;
      const imageUploadResult = await firebaseUpload(
        'images/' + filename,
        localBlob,
      );
      if (imageUploadResult.success) {
        imageDownloadURL = imageUploadResult.downloadURL;
        await AsyncStorage.setItem('profileImage', imageDownloadURL);
      }
    }
    await firebaseSet(`/users/${result.user.uid}`, {
      name,
      school,
      belong,
      snsAccount,
      email,
      password,
      imageUrl: imageDownloadURL,
    });
    await AsyncStorage.setItem('uid', result.user.uid);
    navigation.navigate('Root');
  } else {
    Alert.alert('登録時エラー');
  }
}

const styles = StyleSheet.create({
  container: {
    // height: '110%',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  textInputStyle: {
    marginBottom: 20,
    borderWidth: 1,
    width: '75%',
    height: 40,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingLeft: 10,
    // backgroundColor: 'red',
  },
  developmentModeText: {
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
  submitButton: {
    width: 200,
    height: 100,
    backgroundColor: 'gray',
  },
});
