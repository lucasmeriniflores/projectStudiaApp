import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ThemeContext } from '../../theme/ThemeContext';

export default function PrimaryButton({ title, onPress, loading, style, textStyle }) {
  const { colors, radius } = React.useContext(ThemeContext);
  return (
    <TouchableOpacity style={[styles.btn, { backgroundColor: colors.accent, borderRadius: radius.pill }, style]} onPress={onPress} disabled={loading}>
      {loading ? (
        <ActivityIndicator color="#FFF" />
      ) : (
        <Text style={[styles.txt, textStyle]}> {title} </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { paddingVertical: 14, alignItems: 'center' },
  txt: { color: '#FFF', fontFamily: 'Poppins-Bold', fontSize: 16 },
});



