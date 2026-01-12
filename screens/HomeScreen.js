import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import Animated, { FadeInDown, FadeIn, Layout, SlideInLeft, SlideOutLeft, SlideInRight } from 'react-native-reanimated';
import { Swipeable } from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native';
import { supabase } from '../lib/supabase';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { ThemeContext } from '../theme/ThemeContext';
import ScreenContainer from '../components/ui/ScreenContainer';
import SoftCard from '../components/ui/SoftCard';

export default function HomeScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { colors, mode } = useContext(ThemeContext);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const fetchUserName = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserEmail(user.email || '');
      const { data, error } = await supabase
        .from('users')
        .select('name')
        .eq('id', user.id)
        .single();
      if (!error) setUserName(data.name);
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', (await supabase.auth.getUser()).data.user.id)
      .eq('done', false)
      .order('due_date', { ascending: true });

    if (error) {
      console.error(error);
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserName();
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchTasks();
    }
  }, [isFocused]);

  const handleDeleteTask = async (id) => {
    Alert.alert(
      'Confirmar exclusão',
      'Deseja realmente excluir essa tarefa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await supabase.from('activities').delete().eq('id', id);
            setOpenMenuId(null);
            fetchTasks();
          },
        },
      ]
    );
  };

  const handleCompleteTask = async (id) => {
    await supabase.from('activities').update({ done: true }).eq('id', id);
    setOpenMenuId(null);
    fetchTasks();
  };

  const handleEditTask = (task) => {
    setOpenMenuId(null);
    navigation.navigate('EditTask', { task });
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsMainMenuOpen(false);
      navigation.replace('Welcome');
    } catch (e) {
      // noop
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <LottieView
          source={require('../assets/loading.json')}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
        <Text style={[styles.loadingText, { color: colors.accent }]}>Carregando suas tarefas...</Text>
      </View>
    );
  }

  const renderHeader = () => (
    <>
    <Animated.View entering={FadeInDown.duration(260)} style={styles.header}>
        <TouchableOpacity
          style={[styles.headerMenuButton, { backgroundColor: colors.card }]}
          onPress={() => setIsMainMenuOpen(true)}
        >
          <Icon name="menu" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        
        <TouchableOpacity 
          style={styles.addTaskButton}
          onPress={() => navigation.navigate('AddTask')}
        >
          <Icon name="plus" size={24} color="#FFF" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.Text entering={FadeInDown.delay(100).duration(260)} style={[styles.greeting, { color: colors.accent }]}>Olá, {userName}</Animated.Text>
    </>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <LottieView
        source={require('../assets/empty.json')}
        autoPlay
        loop
        style={{ width: 150, height: 150 }}
      />
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Nenhuma tarefa encontrada!</Text>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Text style={styles.addButtonText}>Adicionar nova tarefa</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenContainer>
      {isMainMenuOpen && (
        <>
          <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setIsMainMenuOpen(false)} />
          <Animated.View entering={SlideInRight.duration(0)} style={{ display: 'none' }} />
          <Animated.View entering={SlideInLeft.duration(240)} exiting={SlideOutLeft.duration(200)} style={[styles.sideMenu, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sideMenuHeader}>
              <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
                <Text style={styles.avatarText}>{(userName || 'S').slice(0,1).toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.sideName, { color: colors.textPrimary }]} numberOfLines={1}>{userName || 'Usuário'}</Text>
                <Text style={[styles.sideEmail, { color: colors.textSecondary }]} numberOfLines={1}>{userEmail}</Text>
              </View>
              <TouchableOpacity onPress={() => setIsMainMenuOpen(false)} style={styles.closeButton}>
                <Icon name="x" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.sideSection}>
              <TouchableOpacity style={styles.sideItem} onPress={() => { setIsMainMenuOpen(false); navigation.navigate('AccountSettings'); }}>
                <Icon name="user" size={18} color={colors.textPrimary} />
                <Text style={[styles.sideItemText, { color: colors.textPrimary }]}>Minha conta</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sideItem} onPress={() => { setIsMainMenuOpen(false); navigation.navigate('NotificationSettings'); }}>
                <Icon name="bell" size={18} color={colors.textPrimary} />
                <Text style={[styles.sideItemText, { color: colors.textPrimary }]}>Notificações</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sideItem} onPress={() => { setIsMainMenuOpen(false); navigation.navigate('StorageSettings'); }}>
                <Icon name="database" size={18} color={colors.textPrimary} />
                <Text style={[styles.sideItemText, { color: colors.textPrimary }]}>Armazenamento</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sideSection}>
              <TouchableOpacity style={styles.sideItem} onPress={() => { setIsMainMenuOpen(false); navigation.navigate('HelpScreen'); }}>
                <Icon name="help-circle" size={18} color={colors.textPrimary} />
                <Text style={[styles.sideItemText, { color: colors.textPrimary }]}>Ajuda</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sideItem} onPress={() => { setIsMainMenuOpen(false); navigation.navigate('Terms'); }}>
                <Icon name="file-text" size={18} color={colors.textPrimary} />
                <Text style={[styles.sideItemText, { color: colors.textPrimary }]}>Termos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sideItem} onPress={() => { setIsMainMenuOpen(false); navigation.navigate('PrivacyPolicy'); }}>
                <Icon name="shield" size={18} color={colors.textPrimary} />
                <Text style={[styles.sideItemText, { color: colors.textPrimary }]}>Privacidade</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sideFooter}>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Icon name="log-out" size={18} color="#FFF" />
                <Text style={styles.logoutText}>Sair</Text>
              </TouchableOpacity>
              <Text style={styles.versionText}>Studia v1.0.0</Text>
            </View>
          </Animated.View>
        </>
      )}
      {tasks.length === 0 ? (
        <>
          {renderHeader()}
          {renderEmpty()}
        </>
      ) : (
        <Animated.FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Swipeable
              renderRightActions={() => (
                <View style={styles.swipeCompleteContainer}>
                  <LottieView
                    source={require('../assets/loading.json')}
                    autoPlay
                    loop
                    style={{ width: 60, height: 60 }}
                  />
                  <Text style={styles.swipeCompleteText}>Concluir</Text>
                </View>
              )}
              onSwipeableOpen={() => handleCompleteTask(item.id)}
            >
            <Animated.View
              entering={FadeInDown.delay(index * 40).duration(260)}
              style={[
                styles.activityCard,
                mode === 'dark'
                  ? { backgroundColor: colors.card, borderLeftWidth: 6, borderLeftColor: item.color || '#F2F2F2' }
                  : { backgroundColor: item.color || colors.card }
              ]}
            > 
              <View style={styles.cardHeader}>
                <Text style={[styles.activityText, { color: colors.textPrimary }]}>{item.title}</Text>

                <TouchableOpacity
                  onPress={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                  style={[styles.menuButton, { backgroundColor: colors.card }]}
                >
                  <Icon name="more-vertical" size={20} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.subjectText, { color: colors.textPrimary }]}>{item.subject}</Text>
              <Text style={[styles.subText, { color: colors.textSecondary }]}>Professor: {item.teacher}</Text>

              <View style={styles.cardFooterRow}>
                <Text style={[styles.subText, { color: colors.textSecondary }]}>Entrega: {item.due_date}</Text>
                <Text style={[styles.roomText, { color: colors.textSecondary }]}>Sala {item.room}</Text>
              </View>
              
              {openMenuId === item.id && (
                <Animated.View entering={FadeIn.duration(160)} style={[styles.floatingMenu, { backgroundColor: colors.card }]}>
                  <TouchableOpacity onPress={() => handleEditTask(item)} style={styles.menuOption}>
                    <Text style={[styles.menuOptionText, { color: colors.textPrimary }]}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteTask(item.id)} style={styles.menuOption}>
                    <Text style={[styles.menuOptionText, { color: 'red' }]}>Excluir</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </Animated.View>
            </Swipeable>
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 999,
  },
  sideMenu: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 280,
    borderRightWidth: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 120,
    zIndex: 1000,
  },
  sideMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFF', fontFamily: 'Poppins-Bold' },
  closeButton: { padding: 6, marginLeft: 8 },
  sideName: { fontFamily: 'Poppins-Bold', fontSize: 16 },
  sideEmail: { fontFamily: 'Poppins-Regular', fontSize: 12 },
  sideSection: { marginTop: 8, borderTopWidth: 1, borderColor: '#eee', paddingTop: 8 },
  sideItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 8 },
  sideItemText: { fontFamily: 'Poppins-Regular', fontSize: 14 },
  sideFooter: { marginTop: 'auto', marginBottom: 120 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FA774C', paddingVertical: 12, borderRadius: 30, justifyContent: 'center' },
  logoutText: { color: '#FFF', fontFamily: 'Poppins-Bold', marginLeft: 6 },
  versionText: { marginTop: 10, textAlign: 'center', color: '#999', fontFamily: 'Poppins-Regular', fontSize: 12 },
  flatListContent: { 
    paddingBottom: 100 // Espaço extra para os tabs
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20,
    position: 'relative',
    paddingTop: 20,
    height: 50
  },
  logo: { 
    width: 60, 
    height: 60, 
    resizeMode: 'contain',
    position: 'absolute',
    left: '50%',
    marginLeft: -30
  },
  greeting: { fontSize: 22, color: '#FA774C', fontFamily: 'Poppins-Bold', marginBottom: 20 },

  activityCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    position: 'relative',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  activityText: { fontSize: 18, fontFamily: 'Poppins-Bold', color: '#333' },
  subjectText: { fontSize: 14, fontFamily: 'Poppins-Bold', color: '#333', marginBottom: 5 },
  subText: { fontSize: 14, fontFamily: 'Poppins-Regular', color: '#555' },
  cardFooterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  roomText: { fontSize: 14, fontFamily: 'Poppins-Regular', color: '#555' },

  checkButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 3,
    padding: 6,
  },
  headerMenuButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 3,
    padding: 10,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 3,
    padding: 10,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTaskButton: {
    backgroundColor: '#FA774C',
    borderRadius: 20,
    elevation: 3,
    padding: 10,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingMenu: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 5,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  menuOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  menuOptionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#333',
  },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  loadingText: { fontSize: 16, fontFamily: 'Poppins-Regular', marginTop: 10, color: '#FA774C' },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, fontFamily: 'Poppins-Regular', color: '#999', marginTop: 10, marginBottom: 20 },

  addButton: {
    backgroundColor: '#FA774C',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
});
