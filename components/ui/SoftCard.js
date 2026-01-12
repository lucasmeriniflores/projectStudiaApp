import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';
import { ThemeContext } from '../../theme/ThemeContext';

export default function SoftCard({ children, style }) {
  const { colors, radius, shadow, reduceMotion } = React.useContext(ThemeContext);
  const Wrapper = reduceMotion ? View : Animated.View;
  const entering = reduceMotion ? undefined : FadeIn.duration(220);
  const exiting = reduceMotion ? undefined : FadeOut.duration(180);
  return (
    <Wrapper entering={entering} exiting={exiting} style={[styles.card, { backgroundColor: colors.card, borderRadius: radius.lg }, shadow.soft, style]}>
      {children}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)'
  },
});



