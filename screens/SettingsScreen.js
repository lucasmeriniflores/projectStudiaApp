import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ScreenContainer from '../components/ui/ScreenContainer';
import SoftCard from '../components/ui/SoftCard';
import { supabase } from '../lib/supabase';
import { useIsFocused, useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { ThemeContext } from '../theme/ThemeContext';

export default function SettingsScreen() {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [searchText, setSearchText] = useState('');
  const { mode, colors, toggleTheme } = React.useContext(ThemeContext);

  const fetchUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();
      if (!error) {
        setUser(data);
      }
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchUser();
    }
  }, [isFocused]);

  useFocusEffect(
    React.useCallback(() => {
      fetchUser();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // noop
    }
  };

  const confirmLogout = () => {
    Alert.alert('Sair da conta', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: handleLogout },
    ]);
  };

  const settingsOptions = [
    { icon: 'user', title: 'Conta', onPress: () => navigation.navigate('AccountSettings') },
    { icon: 'shield', title: 'Privacidade', onPress: () => navigation.navigate('PrivacySettings') },
    { icon: 'bell', title: 'Notificações', onPress: () => navigation.navigate('NotificationSettings') },
    { icon: 'help-circle', title: 'Ajuda', onPress: () => navigation.navigate('HelpScreen') },
    { icon: 'refresh-cw', title: 'Armazenamento e dados', onPress: () => navigation.navigate('StorageSettings') },
    { icon: 'user-check', title: 'Acessibilidade', onPress: () => navigation.navigate('AccessibilitySettings') },
    { icon: 'heart', title: 'Convidar amigos', onPress: () => navigation.navigate('InviteFriends') },
    { icon: mode === 'dark' ? 'sun' : 'moon', title: mode === 'dark' ? 'Modo claro' : 'Modo escuro', onPress: toggleTheme },
  ];

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(240)} style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Configurações</Text>
        </Animated.View>

      {/* Barra de pesquisa */}
      <SoftCard style={styles.searchContainer}>
        <Icon name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Pesquisar"
          placeholderTextColor={colors.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
        />
      </SoftCard>

      {/* Perfil do usuário */}
      <SoftCard style={styles.profileSection}>
        <View style={styles.profileHeader}>
          <Image
            source={user?.avatar_url ? { uri: user.avatar_url } : require('../assets/logo.png')}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <View style={styles.nicknameRow}>
              <Text style={[styles.nickname, { color: colors.accent }]}>{user?.nickname || 'nevasca 👋'}</Text>
              <View style={styles.infoBadge}>
                <Text style={styles.infoBadgeText}>3 INFO</Text>
              </View>
            </View>
            <Text style={[styles.fullName, { color: colors.textPrimary }]}>{user?.name || 'Lucas Merini Flores'}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={[styles.editProfileButton, { borderColor: colors.accent }]} onPress={() => navigation.navigate('EditProfile')}>
          <Icon name="edit-3" size={16} color="#FA774C" />
          <Text style={[styles.editProfileText, { color: colors.accent }]}>Editar Perfil</Text>
          <Icon name="chevron-right" size={16} color="#FA774C" />
        </TouchableOpacity>
      </SoftCard>

      {/* Opções de configuração */}
      <View style={styles.settingsList}>
        {settingsOptions.map((option, index) => (
          <Animated.View entering={FadeInDown.delay(index * 40).duration(220)} key={index}>
          <TouchableOpacity
            key={index}
            style={[styles.settingOption, { borderBottomColor: colors.border }]}
            onPress={option.onPress}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconContainer, { backgroundColor: colors.card }]}>
                <Icon name={option.icon} size={20} color={colors.textPrimary} />
              </View>
              <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>{option.title}</Text>
            </View>
            <Icon name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Espaço extra para os tabs
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: 30,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  profileSection: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  nicknameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  nickname: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#FA774C',
    marginRight: 10,
  },
  infoBadge: {
    backgroundColor: '#FA774C',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  infoBadgeText: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: '#FFF',
  },
  fullName: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FA774C',
  },
  editProfileText: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#FA774C',
    marginHorizontal: 8,
  },
  settingsList: {
    flex: 1,
  },
  settingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF4757',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 22,
    marginTop: 12,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#FFF',
    marginLeft: 8,
  },
});
