import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ThemeContext } from '../../theme/ThemeContext';

export default function ScreenContainer({ children, style }) {
  const { colors, reduceMotion } = React.useContext(ThemeContext);
  const Wrapper = reduceMotion ? View : Animated.View;
  const entering = reduceMotion ? undefined : FadeIn.duration(240);
  const exiting = reduceMotion ? undefined : FadeOut.duration(180);
  return (
    <Wrapper entering={entering} exiting={exiting} style={[styles.container, { backgroundColor: colors.background }, style]}>
      {children}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});



