import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { Colors } from '../components/styles/utils';

export default function InitializeStart({ navigation }) {
  return (
    <View style={styles.containerStyle}>
      <View style={styles.topSectionStyle}>
        <Text style={styles.topSectionSubTextStyle}>
          「ねぇねぇ」から始まるコミュニケーション
        </Text>
        <Text style={styles.topSectionMainTextStyle}>ne-ne-</Text>
      </View>

      <View style={styles.buttonSectionStyle}>
        <TouchableOpacity
          style={[styles.buttonContainerStyle, { backgroundColor: '#2f95dc' }]}
          onPress={() => navigation.navigate('InitializeWelcome')}
        >
          <Text style={styles.buttonStyle}>新規登録</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonContainerStyle, { backgroundColor: '#a9a9a9' }]}
          onPress={() => navigation.navigate('InitializeLogin')}
        >
          <Text style={styles.buttonStyle}>ログイン</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  buttonContainerStyle: {
    width: '75%',
    height: 60,
    justifyContent: 'center',
    borderRadius: 50,
    margin: 10,
  },
  topSectionStyle: {
    width: '100%',
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topSectionSubTextStyle: {
    width: '100%',
    fontSize: 20,
    textAlign: 'center',
    color: Colors.textDarkGray,
  },
  topSectionMainTextStyle: {
    width: '100%',
    fontSize: 50,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonSectionStyle: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSectionButtonStyle: {
    width: 290,
  },
  buttonStyle: {
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
    fontSize: 20,
  },
});
