import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { ThemeContext } from '../theme/ThemeContext';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const { colors } = React.useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSendCode() {
    if (!email) {
      Alert.alert('Informe o email', 'Digite seu email.');
      return;
    }
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('request-password-reset', {
        body: { email },
      });
      if (error) {
        Alert.alert('Erro', error.message || 'Não foi possível enviar o código.');
        return;
      }
      if (!data?.ok) {
        Alert.alert('Erro', data?.error || 'Não foi possível enviar o código.');
        return;
      }
      Alert.alert('Código enviado', 'Verifique seu email e digite o código a seguir.');
      navigation.navigate('VerifyResetCode', { email });
    } catch (e) {
      Alert.alert('Erro', e.message || 'Tente novamente.');
    } finally {
      setSending(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar senha</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
        placeholderTextColor="#999"
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleSendCode} disabled={sending}>
        {sending ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Enviar código</Text>}
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
    marginTop: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
});


