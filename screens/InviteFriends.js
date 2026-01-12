import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { ThemeContext } from '../theme/ThemeContext';

export default function InviteFriends() {
  const navigation = useNavigation();
  const { colors } = React.useContext(ThemeContext);

  async function handleShare() {
    try {
      await Share.share({ message: 'Vem pro Studia comigo! https://example.com' });
    } catch {}
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Convidar amigos</Text>
        <View style={{ width: 24 }} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleShare}>
        <Text style={styles.buttonText}>Compartilhar convite</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backButton: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontFamily: 'Poppins-Bold' },
  button: { backgroundColor: '#FA774C', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#FFF', fontFamily: 'Poppins-Bold' },
});


