import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { ThemeContext } from '../theme/ThemeContext';

export default function ResetPasswordScreen() {
  const navigation = useNavigation();
  const { colors } = React.useContext(ThemeContext);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSetPassword() {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Campos obrigatórios', 'Preencha a nova senha e a confirmação.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Senha curta', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Senhas não coincidem', 'Verifique a confirmação de senha.');
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        Alert.alert('Erro', error.message || 'Não foi possível atualizar a senha.');
        return;
      }
      Alert.alert('Sucesso', 'Senha atualizada com sucesso!', [
        { text: 'OK', onPress: () => navigation.replace('Login') },
      ]);
    } catch (e) {
      Alert.alert('Erro', e.message || 'Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Definir nova senha</Text>
      <Text style={[styles.label, { color: colors.textSecondary }]}>Nova senha</Text>
      <TextInput
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        placeholder="••••••••"
        placeholderTextColor={colors.textSecondary}
        style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
      />
      <Text style={[styles.label, { color: colors.textSecondary }]}>Confirmar nova senha</Text>
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholder="••••••••"
        placeholderTextColor={colors.textSecondary}
        style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
      />
      <TouchableOpacity style={[styles.button]} onPress={handleSetPassword} disabled={saving}>
        {saving ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Salvar nova senha</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    marginTop: 12,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  button: {
    marginTop: 24,
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});



