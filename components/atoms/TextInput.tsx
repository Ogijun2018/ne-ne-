import React from 'react';
import { StyleSheet, View, Text, TextInput as RnTextInput } from 'react-native';
import { Colors } from '../styles/utils';

const TextInput = ({
  value,
  label,
  onChangeText,
  autoFocus,
  placeholder,
  style,
}) => {
  const { inputStyle, labelStyle } = styles;

  return (
    <View>
      {label && <Text style={labelStyle}>{label}</Text>}
      <RnTextInput
        value={value}
        autoFocus={autoFocus}
        onChangeText={onChangeText}
        style={[inputStyle, style]}
        placeholder={placeholder}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    paddingLeft: 15,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.borderWhite,
    borderRadius: 3,
    backgroundColor: Colors.white,

    width: 328,
    height: 48,
  },
  labelStyle: {
    fontSize: 14,
    color: Colors.textLightGray,
    marginBottom: 20,
  },
});

export default TextInput;
