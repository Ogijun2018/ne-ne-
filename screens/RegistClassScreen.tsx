import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  TextInput,
} from 'react-native';
import { set as firebaseSet, generateClassRoomId } from '../lib/firebase';
import { Picker } from '@react-native-picker/picker';

export default function RegistClassScreen({ navigation }) {
  const [schoolName, onChangeSchoolName] = useState('電気通信大学');
  const [className, onChangeClassName] = useState('');
  const [day, onChangeDay] = useState(1);
  const [time, onChangeTime] = useState(1);

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={schoolName}
        style={{
          width: '70%',
          height: 150,
          paddingTop: 10,
        }}
        itemStyle={styles.pickerItemStyle}
        onValueChange={(value) => {
          onChangeSchoolName(value);
        }}
      >
        <Picker.Item label="東京都立大学" value="東京都立大学" />
        <Picker.Item label="電気通信大学" value="電気通信大学" />
        <Picker.Item label="東京外国語大学" value="東京外国語大学" />
        <Picker.Item label="東京学芸大学" value="東京学芸大学" />
        <Picker.Item label="東京工業大学" value="東京工業大学" />
        <Picker.Item label="東京農工大学" value="東京農工大学" />
      </Picker>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        <Picker
          selectedValue={day}
          style={styles.smallPickerStyle}
          itemStyle={styles.pickerItemStyle}
          onValueChange={(value) => {
            onChangeDay(value);
          }}
        >
          <Picker.Item label="月曜日" value="1" />
          <Picker.Item label="火曜日" value="2" />
          <Picker.Item label="水曜日" value="3" />
          <Picker.Item label="木曜日" value="4" />
          <Picker.Item label="金曜日" value="5" />
          <Picker.Item label="土曜日" value="6" />
        </Picker>
        <Picker
          selectedValue={time}
          style={styles.smallPickerStyle}
          itemStyle={styles.pickerItemStyle}
          onValueChange={(value) => {
            onChangeTime(value);
          }}
        >
          <Picker.Item label="1" value="1" />
          <Picker.Item label="2" value="2" />
          <Picker.Item label="3" value="3" />
          <Picker.Item label="4" value="4" />
          <Picker.Item label="5" value="5" />
          <Picker.Item label="6" value="6" />
          <Picker.Item label="7" value="7" />
        </Picker>
        <Text style={{ alignSelf: 'center', fontSize: 15 }}>限</Text>
      </View>
      <View style={{ width: '75%', paddingTop: 10 }}>
        <TextInput
          onChangeText={(text) => onChangeClassName(text)}
          value={className}
          placeholder="科目名"
          style={{
            borderWidth: 0.3,
            padding: 15,
            borderColor: '#333',
            borderRadius: 5,
          }}
        />
      </View>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => {
          registNewClass(navigation, schoolName, day, time, className);
        }}
      >
        <Text style={styles.submitButtonText}>OK</Text>
      </TouchableOpacity>
    </View>
  );
}

async function registNewClass(navigation, schoolName, day, time, name) {
  // roomIdをここで作成
  // すでに同じ名前の授業がないかも判定した方が良い
  const roomId = generateClassRoomId();
  await firebaseSet(`/classes/${roomId}/`, {
    schoolName,
    day,
    time,
    name,
    roomId,
  });
  navigation.navigate('MainHomeScreen');
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  smallPickerStyle: {
    width: '25%',
    height: 150,
  },
  pickerItemStyle: {
    height: 150,
    fontSize: 15,
  },
  submitButton: {
    backgroundColor: '#2f95dc',
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  submitButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});
