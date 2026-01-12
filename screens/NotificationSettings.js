import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { ThemeContext } from '../theme/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NotificationSettings() {
  const navigation = useNavigation();
  const { colors } = React.useContext(ThemeContext);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      const p = await AsyncStorage.getItem('notif_push');
      const e = await AsyncStorage.getItem('notif_email');
      if (p !== null) setPushEnabled(p === '1');
      if (e !== null) setEmailEnabled(e === '1');
    })();
  }, []);

  async function togglePush(val) {
    setPushEnabled(val);
    await AsyncStorage.setItem('notif_push', val ? '1' : '0');
  }
  async function toggleEmail(val) {
    setEmailEnabled(val);
    await AsyncStorage.setItem('notif_email', val ? '1' : '0');
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Notificações</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={[styles.row, { borderColor: colors.border }]}> 
        <Text style={[styles.rowText, { color: colors.textPrimary }]}>Push</Text>
        <Switch value={pushEnabled} onValueChange={togglePush} />
      </View>
      <View style={[styles.row, { borderColor: colors.border }]}> 
        <Text style={[styles.rowText, { color: colors.textPrimary }]}>Email</Text>
        <Switch value={emailEnabled} onValueChange={toggleEmail} />
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


