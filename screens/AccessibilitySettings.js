import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { ThemeContext } from '../theme/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AccessibilitySettings() {
  const navigation = useNavigation();
  const { colors, textScale, setTextScale, reduceMotion, setReduceMotion } = React.useContext(ThemeContext);
  const [largeText, setLargeText] = useState(false);

  useEffect(() => {
    (async () => {
      const r = await AsyncStorage.getItem('a11y_reduceMotion');
      const l = await AsyncStorage.getItem('a11y_largeText');
      if (r !== null) setReduceMotion(r === '1');
      if (l !== null) setLargeText(l === '1');
    })();
  }, []);

  async function toggleReduce(val) {
    setReduceMotion(val);
    await AsyncStorage.setItem('a11y_reduceMotion', val ? '1' : '0');
  }
  async function toggleLarge(val) {
    setLargeText(val);
    await AsyncStorage.setItem('a11y_largeText', val ? '1' : '0');
    setTextScale(val ? 1.2 : 1);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Acessibilidade</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={[styles.row, { borderColor: colors.border }]}> 
        <Text style={[styles.rowText, { color: colors.textPrimary }]}>Reduzir animações</Text>
        <Switch value={reduceMotion} onValueChange={toggleReduce} />
      </View>
      <View style={[styles.row, { borderColor: colors.border }]}> 
        <Text style={[styles.rowText, { color: colors.textPrimary }]}>Texto grande</Text>
        <Switch value={largeText} onValueChange={toggleLarge} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backButton: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontFamily: 'Poppins-Bold' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1 },
  rowText: { fontSize: 16, fontFamily: 'Poppins-Regular' },
});


