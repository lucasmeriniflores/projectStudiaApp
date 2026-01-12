import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';

export default function SignupScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  async function handleSignup() {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      Alert.alert('Erro no cadastro', error.message);
      return;
    }

    const userId = data.user?.id;
    if (userId) {
      const { error: insertError } = await supabase.from('users').insert([
        { id: userId, name: name }
      ]);

      if (insertError) {
        Alert.alert('Erro ao salvar nome', insertError.message);
        return;
      }

      Alert.alert('Sucesso', 'Conta criada!');
      navigation.replace('Login');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta no Studia</Text>

      <TextInput
        placeholder="Nome"
        placeholderTextColor="#999"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
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

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF', 
    padding: 20, 
    justifyContent: 'center' 
  },

  title: { 
    fontSize: 26, 
    color: '#FA774C', 
    marginBottom: 20, 
    fontFamily: 'Poppins-Bold', 
    textAlign: 'center' 
  },

  input: { 
    backgroundColor: '#F2F2F2', 
    padding: 15, 
    borderRadius: 30, 
    borderWidth: 1, 
    borderColor: '#FA774C',
    marginBottom: 15, 
    fontSize: 16 
  },

  button: { 
    backgroundColor: '#FA774C', 
    paddingVertical: 15, 
    borderRadius: 30 
  },

  buttonText: { 
    color: '#FFF', 
    fontSize: 18, 
    textAlign: 'center', 
    fontFamily: 'Poppins-Bold' 
  },
});
