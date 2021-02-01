import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Colors } from '../components/styles/utils';

export default function InitializeStart({ navigation }) {
  return (
    <View style={styles.containerStyle}>
      <View style={styles.topSectionStyle}>
        <View style={styles.topSectionInnerStyle}>
          <View style={styles.topSectionLineStyle}></View>
          <Text style={styles.topSectionSubTextStyle}>
            隣の人に「ねぇねぇ」できる！
          </Text>
          <Text style={styles.topSectionMainTextStyle}>ne-ne-</Text>
        </View>
      </View>

      <View style={styles.buttonSectionStyle}>
        <TouchableOpacity
          style={{
            width: '50%',
            height: 100,
            backgroundColor: 'red',
          }}
          onPress={() => navigation.navigate('InitializeWelcome')}
        >
          <Text style={{ color: 'white' }}>新規登録</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: '50%',
            height: 100,
            backgroundColor: 'gray',
          }}
          onPress={() => navigation.navigate('InitializeLogin')}
        >
          <Text>ログイン</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const constants = {
  TOP_SECTION_HEIGHT: 298,
};

const styles = StyleSheet.create({
  containerStyle: {
    // paddingTop: Layouts.APP_PADDING_TOP,
    width: '100%',
    height: '100%',
    // backgroundColor: Colors.orange,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  topSectionStyle: {
    width: '100%',
    height: constants.TOP_SECTION_HEIGHT,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // backgroundColor: Colors.orange,
  },
  topSectionInnerStyle: {
    // padding: 4,
    height: constants.TOP_SECTION_HEIGHT - 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },

  topSectionLineStyle: {
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    // height: 4,
    top: 112,
    // left: 162,
  },
  topSectionSubTextStyle: {
    position: 'absolute',
    width: '100%',
    top: 66,
    fontSize: 20,
    textAlign: 'center',
    color: Colors.textDarkGray,
    backgroundColor: 'transparent',
  },
  topSectionMainTextStyle: {
    position: 'absolute',
    width: '100%',
    top: 139,
    fontSize: 42,
    textAlign: 'center',
    // color: Colors.orange,
    backgroundColor: 'transparent',
  },
  topSectionLogoStyle: {
    paddingTop: 15,
    height: 200,
    width: 200,
    top: 241,
    borderRadius: 100,
    backgroundColor: Colors.orange,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoStyle: {
    width: 160,
    height: 160,
  },

  buttonSectionStyle: {
    paddingBottom: 119,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonSectionButtonStyle: {
    width: 290,
  },
  buttonStyle: {
    width: 290,
    height: 160,
    backgroundColor: 'red',
  },
});
