import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import TextInput from '../components/atoms/TextInput';
import { signup as firebaseSignup } from '../lib/firebase';

export default function UserInfoScreen({ navigation }) {
    const [name, onChangeName] = React.useState('');
    const [school, onChangeSchool] = React.useState('');
    const [belong, onChangeBelong] = React.useState('');
    const [snsAccount, onChangeSnsAccount] = React.useState('');
    const [email, onChangeEmail] = React.useState('');
    const [password, onChangePass] = React.useState('');

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                ユーザーの詳細を表示する画面
            </Text>
        </View>
    );
}

async function registUser(navigation, email, password) {
    await firebaseSignup(email, password);
    navigation.navigate('Root');
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
