import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { ThemeContext } from '../theme/ThemeContext';

export default function HelpScreen() {
  const navigation = useNavigation();
  const { colors } = React.useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Ajuda</Text>
        <View style={{ width: 24 }} />
      </View>

      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Terms')}>
        <Text style={[styles.linkText, { color: colors.accent }]}>Termos de Uso</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('PrivacyPolicy')}>
        <Text style={[styles.linkText, { color: colors.accent }]}>Política de Privacidade</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={() => Linking.openURL('mailto:suporte@studia.app') }>
        <Text style={[styles.linkText, { color: colors.accent }]}>Falar com suporte</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backButton: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontFamily: 'Poppins-Bold' },
  link: { paddingVertical: 12 },
  linkText: { fontSize: 16, fontFamily: 'Poppins-Bold' },
});


