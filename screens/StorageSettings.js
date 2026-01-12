import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { ThemeContext } from '../theme/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StorageSettings() {
  const navigation = useNavigation();
  const { colors } = React.useContext(ThemeContext);
  const [cacheSize] = useState('12 MB');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Armazenamento e dados</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}> 
        <Text style={[styles.label, { color: colors.textSecondary }]}>Cache</Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>{cacheSize}</Text>
        <TouchableOpacity style={styles.button} onPress={async () => {
          try {
            await AsyncStorage.multiRemove([
              'privacy_profilePublic','privacy_showLastSeen',
              'notif_push','notif_email',
              'a11y_reduceMotion','a11y_largeText','a11y_textScale',
              'theme_mode'
            ]);
            Alert.alert('Pronto', 'Cache de preferências limpo.');
          } catch (e) {
            Alert.alert('Erro', 'Não foi possível limpar o cache.');
          }
        }}>
          <Text style={styles.buttonText}>Limpar cache</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backButton: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontFamily: 'Poppins-Bold' },
  card: { padding: 16, borderRadius: 12 },
  label: { fontSize: 12, fontFamily: 'Poppins-Regular', marginBottom: 6 },
  value: { fontSize: 16, fontFamily: 'Poppins-Bold', marginBottom: 12 },
  button: { backgroundColor: '#FA774C', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#FFF', fontFamily: 'Poppins-Bold' },
});


