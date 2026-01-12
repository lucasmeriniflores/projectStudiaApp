import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { ThemeContext } from '../theme/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PrivacySettings() {
  const navigation = useNavigation();
  const { colors } = React.useContext(ThemeContext);
  const [profilePublic, setProfilePublic] = useState(true);
  const [showLastSeen, setShowLastSeen] = useState(false);

  useEffect(() => {
    (async () => {
      const p = await AsyncStorage.getItem('privacy_profilePublic');
      const s = await AsyncStorage.getItem('privacy_showLastSeen');
      if (p !== null) setProfilePublic(p === '1');
      if (s !== null) setShowLastSeen(s === '1');
    })();
  }, []);

  async function toggleProfilePublic(val) {
    setProfilePublic(val);
    await AsyncStorage.setItem('privacy_profilePublic', val ? '1' : '0');
  }
  async function toggleShowLastSeen(val) {
    setShowLastSeen(val);
    await AsyncStorage.setItem('privacy_showLastSeen', val ? '1' : '0');
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Privacidade</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={[styles.row, { borderColor: colors.border }]}> 
        <Text style={[styles.rowText, { color: colors.textPrimary }]}>Perfil público</Text>
        <Switch value={profilePublic} onValueChange={toggleProfilePublic} />
      </View>
      <View style={[styles.row, { borderColor: colors.border }]}> 
        <Text style={[styles.rowText, { color: colors.textPrimary }]}>Mostrar último acesso</Text>
        <Switch value={showLastSeen} onValueChange={toggleShowLastSeen} />
      </View>

      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Terms')}>
        <Text style={[styles.linkText, { color: colors.accent }]}>Ver Termos de Uso</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('PrivacyPolicy')}>
        <Text style={[styles.linkText, { color: colors.accent }]}>Ver Política de Privacidade</Text>
      </TouchableOpacity>
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


