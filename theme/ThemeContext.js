import React, { createContext, useMemo, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext({
  mode: 'light',
  colors: {
    background: '#FFF',
    textPrimary: '#333',
    textSecondary: '#555',
    accent: '#FA774C',
    card: '#F8F8F8',
    border: '#F0F0F0',
    tabGlass: 'rgba(255,255,255,0.65)'
  },
  radius: { xs: 8, sm: 12, md: 16, lg: 20, xl: 28, pill: 999 },
  spacing: { xs: 6, sm: 10, md: 14, lg: 20, xl: 28 },
  shadow: {
    soft: { elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
    medium: { elevation: 6, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  },
  motion: { duration: { xs: 120, sm: 180, md: 260, lg: 360 }, spring: { damping: 18, stiffness: 160 } },
  textScale: 1,
  reduceMotion: false,
  toggleTheme: () => {},
  setTextScale: (_s) => {},
  setReduceMotion: (_v) => {},
});

export function ThemeProvider({ children }) {
  const systemScheme = Appearance.getColorScheme();
  const [mode, setMode] = useState(systemScheme || 'light');
  const [textScale, setTextScaleState] = useState(1);
  const [reduceMotion, setReduceMotionState] = useState(false);

  // Carregar preferência salva do AsyncStorage
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme_mode');
        if (savedTheme) {
          setMode(savedTheme);
        }
        const savedScale = await AsyncStorage.getItem('a11y_textScale');
        if (savedScale) {
          const n = Number(savedScale);
          if (!Number.isNaN(n) && n > 0) setTextScaleState(n);
        }
        const savedReduce = await AsyncStorage.getItem('a11y_reduceMotion');
        if (savedReduce) setReduceMotionState(savedReduce === '1');
      } catch (error) {
        console.error('Erro ao carregar preferência do tema:', error);
      }
    };
    loadThemePreference();
  }, []);

  useEffect(() => {
    const listener = ({ colorScheme }) => {
      // keep current mode; do not auto-switch when user toggled
    };
    const sub = Appearance.addChangeListener(listener);
    return () => sub.remove();
  }, []);

  const toggleTheme = async () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    
    // Salvar preferência no AsyncStorage
    try {
      await AsyncStorage.setItem('theme_mode', newMode);
    } catch (error) {
      console.error('Erro ao salvar preferência do tema:', error);
    }
  };

  const setTextScale = async (scale) => {
    const clamped = Math.max(0.8, Math.min(scale, 1.6));
    setTextScaleState(clamped);
    try {
      await AsyncStorage.setItem('a11y_textScale', String(clamped));
    } catch (e) {
      // noop
    }
  };

  const setReduceMotion = async (val) => {
    setReduceMotionState(Boolean(val));
    try {
      await AsyncStorage.setItem('a11y_reduceMotion', val ? '1' : '0');
    } catch (e) {
      // noop
    }
  };

  const colors = useMemo(() => {
    if (mode === 'dark') {
      return {
        background: '#0F0F0F',
        textPrimary: '#EFEFEF',
        textSecondary: '#BBBBBB',
        accent: '#FA774C',
        card: '#1A1A1A',
        border: '#262626',
        tabGlass: 'rgba(20,20,20,0.6)'
      };
    }
    return {
      background: '#FFF',
      textPrimary: '#333',
      textSecondary: '#555',
      accent: '#FA774C',
      card: '#F8F8F8',
      border: '#F0F0F0',
      tabGlass: 'rgba(255,255,255,0.65)'
    };
  }, [mode]);

  const radius = { xs: 8, sm: 12, md: 16, lg: 20, xl: 28, pill: 999 };
  const spacing = { xs: 6, sm: 10, md: 14, lg: 20, xl: 28 };
  const shadow = {
    soft: { elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
    medium: { elevation: 6, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  };
  const motion = { duration: { xs: 120, sm: 180, md: 260, lg: 360 }, spring: { damping: 18, stiffness: 160 } };

  const value = useMemo(() => ({ mode, colors, radius, spacing, shadow, motion, toggleTheme, textScale, reduceMotion, setTextScale, setReduceMotion }), [mode, colors, textScale, reduceMotion]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}


