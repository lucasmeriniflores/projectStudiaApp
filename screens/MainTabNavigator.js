import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import HomeScreen from './HomeScreen';
import CalendarScreen from './CalendarScreen';
import SettingsScreen from './SettingsScreen';
import { View, Platform } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const { colors } = useContext(ThemeContext);
  return (
    <Tab.Navigator
      initialRouteName="Atividades"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Atividades') {
            iconName = 'list';
          } else if (route.name === 'Calendário') {
            iconName = 'calendar';
          } else if (route.name === 'Configurações') {
            iconName = 'settings';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: [
          {
            position: 'absolute',
            backgroundColor: colors.card,
            borderTopWidth: 0,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            paddingBottom: 10,
            paddingTop: 10,
            height: 80,
            marginHorizontal: 20,
            marginBottom: 20,
            borderRadius: 25,
            borderWidth: 1,
            borderColor: colors.border,
          },
        ],
        tabBarLabelStyle: {
          fontFamily: 'Poppins-Regular',
          fontSize: 12,
          marginTop: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Calendário" 
        component={CalendarScreen}
        options={{
          tabBarLabel: 'Calendário',
        }}
      />
      <Tab.Screen 
        name="Atividades" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Atividades',
        }}
      />
      <Tab.Screen 
        name="Configurações" 
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Configurações',
        }}
      />
    </Tab.Navigator>
  );
}
