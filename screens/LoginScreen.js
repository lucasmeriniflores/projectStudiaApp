import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase'; // ajuste seu caminho

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      Alert.alert('Erro no login', error.message);
    } else {
      navigation.replace('Main'); // navega para tela principal e remove a tela de login da pilha
    }
  }

  function handleResetPassword() {
    navigation.navigate('ForgotPassword');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar no Studia</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Senha"
        placeholderTextColor="#999"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleResetPassword}>
        <Text style={styles.forgotText}>Esqueci minha senha</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    color: '#FA774C',
    marginBottom: 20,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F2F2F2',
    padding: 15,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#FA774C',
    marginBottom: 15,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  button: {
    backgroundColor: '#FA774C',
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  forgotText: {
    color: '#FA774C',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});
