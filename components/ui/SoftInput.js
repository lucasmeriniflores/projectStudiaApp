import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { ThemeContext } from '../../theme/ThemeContext';

export default function SoftInput(props) {
  const { colors, radius } = React.useContext(ThemeContext);
  return (
    <TextInput
      placeholderTextColor="#999"
      {...props}
      style={[styles.input, { backgroundColor: '#F2F2F2', borderColor: colors.accent, borderRadius: radius.pill }, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 15,
    borderWidth: 1,
    marginBottom: 15,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
});



