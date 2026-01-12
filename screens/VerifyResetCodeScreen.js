import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { ThemeContext } from '../theme/ThemeContext';

export default function VerifyResetCodeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = React.useContext(ThemeContext);
  const initialEmail = (route.params && route.params.email) || '';

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    if (!email || !code) {
      Alert.alert('Campos obrigatórios', 'Informe email e código.');
      return;
    }
    if (!newPassword || !confirmPassword) {
      Alert.alert('Campos obrigatórios', 'Informe a nova senha e a confirmação.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Senha curta', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Senhas não coincidem', 'Verifique a confirmação.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('confirm-password-reset', {
        body: { email, code, newPassword },
      });
      if (error) {
        Alert.alert('Erro', error.message || 'Código inválido/expirado.');
        return;
      }
      if (!data?.ok) {
        Alert.alert('Erro', data?.error || 'Código inválido/expirado.');
        return;
      }
      Alert.alert('Senha alterada', 'Sua senha foi redefinida com sucesso!', [
        { text: 'OK', onPress: () => navigation.replace('Login') },
      ]);
    } catch (e) {
      Alert.alert('Erro', e.message || 'Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verificar código</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
        placeholderTextColor="#999"
        style={styles.input}
      />
      <TextInput
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        placeholder="Código (6 dígitos)"
        placeholderTextColor="#999"
        style={styles.input}
      />
      <TextInput
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        placeholder="Nova senha"
        placeholderTextColor="#999"
        style={styles.input}
      />
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholder="Confirmar nova senha"
        placeholderTextColor="#999"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleConfirm} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Confirmar</Text>}
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


