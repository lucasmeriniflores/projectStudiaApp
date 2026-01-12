import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { ThemeContext } from '../theme/ThemeContext';
import * as FileSystem from 'expo-file-system';
import { Share } from 'react-native';
import { supabase } from '../lib/supabase';

export default function AccountSettings() {
  const navigation = useNavigation();
  const { colors } = React.useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Conta</Text>
        <View style={{ width: 24 }} />
      </View>

      <TouchableOpacity style={[styles.item, { borderColor: colors.border }]} onPress={() => navigation.navigate('EditProfile')}>
        <Text style={[styles.itemText, { color: colors.textPrimary }]}>Editar perfil</Text>
        <Icon name="chevron-right" size={18} color={colors.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.item, { borderColor: colors.border }]} onPress={async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
          const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single();
          const exportObj = { auth: { id: user.id, email: user.email }, profile };
          const json = JSON.stringify(exportObj, null, 2);
          const path = FileSystem.cacheDirectory + 'studia-export.json';
          await FileSystem.writeAsStringAsync(path, json, { encoding: FileSystem.EncodingType.UTF8 });
          // Tenta usar expo-sharing dinamicamente; se não existir, usa Share do RN
          try {
            const Sharing = await import('expo-sharing');
            const canShare = await Sharing.isAvailableAsync();
            if (canShare) {
              await Sharing.shareAsync(path, { mimeType: 'application/json', dialogTitle: 'Exportar dados do Studia' });
              return;
            }
          } catch {}
          await Share.share({ url: path, message: 'Exportação Studia', title: 'studia-export.json' });
        } catch (e) {
          Alert.alert('Erro', 'Não foi possível exportar seus dados.');
        }
      }}>
        <Text style={[styles.itemText, { color: colors.textPrimary }]}>Exportar meus dados</Text>
        <Icon name="share-2" size={18} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
});


