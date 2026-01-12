import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { supabase } from '../lib/supabase';
import { ThemeContext } from '../theme/ThemeContext';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfile() {
  const navigation = useNavigation();
  const { colors } = React.useContext(ThemeContext);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState(null);

  // profile fields (public.users)
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [localAvatarUri, setLocalAvatarUri] = useState('');

  // auth fields
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    (async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const authUser = userRes?.user;
      if (!authUser) {
        setLoading(false);
        return;
      }
      setUserId(authUser.id);
      setEmail(authUser.email || '');

      const { data: profile, error } = await supabase
        .from('users')
        .select('name, nickname, avatar_url')
        .eq('id', authUser.id)
        .single();

      if (!error && profile) {
        setName(profile.name || '');
        setNickname(profile.nickname || '');
        setAvatarUrl(profile.avatar_url || '');
      }

      setLoading(false);
    })();
  }, []);

  async function handleSave() {
    if (!userId) return;
    try {
      setSaving(true);

      // If a new local avatar is selected, upload first and get public URL
      let uploadedAvatarUrl = avatarUrl;
      if (localAvatarUri) {
        try {
          const resp = await fetch(localAvatarUri);
          const ab = await resp.arrayBuffer();
          const bytes = new Uint8Array(ab);
          const fileExt = (localAvatarUri.split('.').pop() || 'jpg').toLowerCase();
          const filePath = `${userId}/${Date.now()}.${fileExt}`;
          const { error: uploadErr } = await supabase.storage.from('avatars').upload(filePath, bytes, {
            upsert: true,
            contentType: `image/${fileExt}`,
          });
          if (uploadErr) throw uploadErr;
          const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
          uploadedAvatarUrl = publicUrlData.publicUrl;
        } catch (uploadError) {
          // Falhou upload: segue salvando demais campos
          Alert.alert('Falha no upload da foto', 'Vou salvar o restante das alterações.');
        }
      }

      // 1) Upsert public profile (garante criar se não existir)
      const updates = { id: userId, name: name || null, nickname: nickname || null, avatar_url: uploadedAvatarUrl || null };
      const { error: profileErr } = await supabase
        .from('users')
        .upsert(updates, { onConflict: 'id' });
      if (profileErr) throw profileErr;

      // 2) Update email in auth (optional if changed)
      const { data: currentUserRes } = await supabase.auth.getUser();
      const currentEmail = currentUserRes?.user?.email || '';
      if (email && email !== currentEmail) {
        const { error: emailErr } = await supabase.auth.updateUser({ email });
        if (emailErr) {
          // Não interrompe o resto (ex: requer confirmação por email)
          Alert.alert('Email não atualizado', emailErr.message || 'Tente novamente.');
        }
      }

      // 3) Update password (if provided and matches)
      if (newPassword || confirmPassword) {
        if (newPassword.length < 6) {
          Alert.alert('Senha curta', 'A senha deve ter pelo menos 6 caracteres.');
          setSaving(false);
          return;
        }
        if (newPassword !== confirmPassword) {
          Alert.alert('Senhas não coincidem', 'Verifique a confirmação de senha.');
          setSaving(false);
          return;
        }
        const { error: passErr } = await supabase.auth.updateUser({ password: newPassword });
        if (passErr) {
          Alert.alert('Senha não atualizada', passErr.message || 'Tente novamente.');
        }
      }

      Alert.alert('Pronto', 'Perfil atualizado!');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro ao salvar', e.message || 'Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  async function handlePickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de acesso às suas fotos para continuar.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      const uri = result.assets?.[0]?.uri;
      if (uri) setLocalAvatarUri(uri);
    }
  }

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: '#FFF' }]}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Editar perfil</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}> 
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Foto de perfil</Text>
        <View style={styles.avatarRow}>
          <Image
            source={localAvatarUri ? { uri: localAvatarUri } : (avatarUrl ? { uri: avatarUrl } : require('../assets/logo.png'))}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.avatarButton} onPress={handlePickImage}>
            <Icon name="image" size={16} color="#FA774C" />
            <Text style={styles.avatarButtonText}>Escolher foto</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}> 
        <Text style={[styles.label, { color: colors.textSecondary }]}>Nome</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Seu nome"
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { color: colors.textPrimary }]}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>Apelido (único)</Text>
        <TextInput
          value={nickname}
          onChangeText={setNickname}
          autoCapitalize="none"
          placeholder="ex: nevasca"
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { color: colors.textPrimary }]}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="seu@email.com"
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { color: colors.textPrimary }]}
        />
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}> 
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Alterar senha</Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Nova senha</Text>
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { color: colors.textPrimary }]}
        />
        <Text style={[styles.label, { color: colors.textSecondary }]}>Confirmar nova senha</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { color: colors.textPrimary }]}
        />
      </View>

      <TouchableOpacity style={[styles.saveButton]} onPress={handleSave} disabled={saving}>
        {saving ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.saveText}>Salvar alterações</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  label: {
    fontSize: 12,
    marginBottom: 6,
    fontFamily: 'Poppins-Regular',
  },
  input: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    fontFamily: 'Poppins-Regular',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 12,
    backgroundColor: '#EEE',
  },
  avatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#FA774C',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFF',
  },
  avatarButtonText: {
    color: '#FA774C',
    fontFamily: 'Poppins-Bold',
  },
  saveButton: {
    backgroundColor: '#FA774C',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


