import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Alert } from 'react-native';
import TextInput from '../components/atoms/TextInput';
import { login as firebaseLogin } from '../lib/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function InitializeLogin({ navigation }) {
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePass] = React.useState('');

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>ログイン</Text>
      <TextInput
        onChangeText={(text) => onChangeEmail(text)}
        value={email}
        label="メールアドレス"
        placeholder="Email"
      />
      <TextInput
        onChangeText={(text) => onChangePass(text)}
        value={password}
        label="パスワード"
        placeholder="password"
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => loginUser(navigation, email, password)}
      >
        <Text>Login</Text>
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
    console.log(result);
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
