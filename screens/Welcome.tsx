import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
  View,
  TextInput,
} from 'react-native';
// import TextInput from '../components/atoms/TextInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signup as firebaseSignup, set as firebaseSet } from '../lib/firebase';

export default function InitializeWelcome({ navigation }) {
  const [name, onChangeName] = React.useState('');
  const [school, onChangeSchool] = React.useState('');
  const [belong, onChangeBelong] = React.useState('');
  const [snsAccount, onChangeSnsAccount] = React.useState('');
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePass] = React.useState('');

  return (
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
        value={name}
        style={styles.textInputStyle}
      />
      <TextInput
        onChangeText={(text) => onChangeSchool(text)}
        value={school}
        placeholder="学校名"
        style={styles.textInputStyle}
      />
      <TextInput
        onChangeText={(text) => onChangeBelong(text)}
        value={belong}
        placeholder="学部/専攻名"
        style={styles.textInputStyle}
      />
      <TextInput
        onChangeText={(text) => onChangeSnsAccount(text)}
        value={snsAccount}
        placeholder="SNSアカウント"
        style={styles.textInputStyle}
      />
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
          registUser(
            navigation,
            name,
            school,
            belong,
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
  );
}

async function registUser(
  navigation,
  name,
  school,
  belong,
  snsAccount,
  email,
  password,
) {
  const result = await firebaseSignup(email, password);
  if (result.success) {
    await firebaseSet(`/users/${result.user.uid}`, {
      name,
      school,
      belong,
      snsAccount,
      email,
      password,
    });
    await AsyncStorage.setItem('uid', result.user.uid);
    navigation.navigate('Root');
  } else {
    Alert.alert('登録時エラー');
  }
}

const styles = StyleSheet.create({
  container: {
    height: '110%',
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
