/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Button } from 'react-native';
import TextInput from '../components/atoms/TextInput';
import { set as firebaseSet, generateClassRoomId } from '../lib/firebase';

export default function RegistClassScreen({ navigation }) {
    const [schoolName, onChangeSchoolName] = useState('');
    const [className, onChangeClassName] = useState('');
    const [day, onChangeDay] = useState('');
    const [time, onChangeTime] = useState('');

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                RegistClassScreen
            </Text>
            <TextInput
                onChangeText={(text) => onChangeSchoolName(text)}
                value={schoolName}
                label="学校名を入力"
                placeholder="電気通信大学"
            />
            <TextInput
                onChangeText={(text) => onChangeDay(text)}
                value={day}
                label="曜日を入力"
                placeholder="月曜日"
            />
            <TextInput
                onChangeText={(text) => onChangeTime(text)}
                value={time}
                label="時限を入力"
                placeholder="3"
            />
            <TextInput
                onChangeText={(text) => onChangeClassName(text)}
                value={className}
                label="クラス名を入力"
                placeholder="線形代数学第一"
            />
            <Button
                title="OK"
                onPress={() => {
                    registNewClass(
                        navigation,
                        schoolName,
                        day,
                        time,
                        className,
                    );
                }}
            />
        </View>
    );
}

async function registNewClass(navigation, schoolName, day, time, name) {
    // roomIdをここで作成
    // すでに同じ名前の授業がないかも判定した方が良い
    const roomId = generateClassRoomId();
    await firebaseSet(`/classes/${schoolName}/${day}/${time}/${name}`, {
        name,
        roomId,
    });
    navigation.navigate('MainHomeScreen');
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
