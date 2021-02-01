import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Alert,
  TextInput,
} from 'react-native';
import { login as firebaseLogin } from '../lib/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function InitializeLogin({ navigation }) {
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePass] = React.useState('');

  return (
    <View style={styles.container}>
      <View style={{ paddingBottom: 50 }}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 35,
            alignSelf: 'center',
            padding: 30,
          }}
        >
          Log in!
        </Text>
      </View>
      <TextInput
        onChangeText={(text) => onChangeEmail(text)}
        value={email}
        placeholder="メールアドレス（必須）"
        style={styles.textInputStyle}
      />
      <TextInput
        onChangeText={(text) => onChangePass(text)}
        value={password}
        placeholder="パスワード（必須）"
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
          loginUser(navigation, email, password);
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
          Log in
        </Text>
      </TouchableOpacity>
    </View>
  );
}

async function loginUser(navigation, email, password) {
  const result = await firebaseLogin(email, password);
  if (result.success) {
    console.log('login!', result.user.uid);
    await AsyncStorage.setItem('uid', result.user.uid);
    navigation.navigate('Root');
  } else {
    Alert.alert(
      'ログインに失敗しました。 \n メールアドレスとパスワードを確認してください。',
    );

    return;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 100,
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
