import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemeContext } from '../theme/ThemeContext';

export default function AddTaskScreen() {
  const navigation = useNavigation();
  const { colors } = useContext(ThemeContext);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [teacher, setTeacher] = useState('Prof. Ana');
  const [room, setRoom] = useState('101');
  const [subject, setSubject] = useState('Matemática');

  const subjectColors = {
    'Matemática': '#FAD02C',
    'História': '#A29BFE',
    'Inglês': '#55EFC4',
    'Física': '#FF7675',
    'Português': '#74B9FF',
  };

  const handleAddTask = async () => {
    // Validar título
    if (!title.trim()) {
      Alert.alert('Erro', 'O título da tarefa não pode estar vazio!');
      return;
    }

    // Validar data futura (sem horas)
    const today = new Date();
    today.setHours(0,0,0,0);
    const chosen = new Date(dueDate);
    chosen.setHours(0,0,0,0);
    if (chosen < today) {
      Alert.alert('Erro', 'Escolha uma data que ainda não passou.');
      return;
    }

    const { data: userData } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('activities')
      .insert([
        {
          user_id: userData.user.id,
          title,
          due_date: dueDate.toISOString().split('T')[0], 
          teacher,
          room,
          subject,
          color: subjectColors[subject] || '#F2F2F2',
        },
      ]);

    if (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao adicionar tarefa!');
    } else {
      Alert.alert('Tarefa adicionada!');
      navigation.goBack();
    }
  };

  const showPicker = () => {
    setShowDatePicker(true);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(Platform.OS === 'ios');
    setDueDate(currentDate);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={[styles.title, { color: colors.accent }]}>Nova Atividade</Text>

          <TextInput
            placeholder="Título"
            placeholderTextColor={colors.textSecondary}
            value={title}
            onChangeText={setTitle}
            style={[styles.input, { backgroundColor: colors.card, color: colors.textPrimary, borderColor: colors.accent }]}
          />

          <TouchableOpacity onPress={showPicker} style={[styles.input, { backgroundColor: colors.card, borderColor: colors.accent }]}>
            <Text style={{ fontSize: 16, fontFamily: 'Poppins-Regular', color: colors.textPrimary }}>
              {dueDate.toISOString().split('T')[0]}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={onChangeDate}
            />
          )}

          <Text style={[styles.label, { color: colors.textPrimary }]}>Professor:</Text>
          <Picker
            selectedValue={teacher}
            onValueChange={(itemValue) => setTeacher(itemValue)}
            style={[styles.input, { backgroundColor: colors.card, color: colors.textPrimary }]}
          >
            <Picker.Item label="Prof. Ana" value="Prof. Ana" />
            <Picker.Item label="Prof. João" value="Prof. João" />
            <Picker.Item label="Prof. Carla" value="Prof. Carla" />
          </Picker>

          <Text style={[styles.label, { color: colors.textPrimary }]}>Sala:</Text>
          <Picker
            selectedValue={room}
            onValueChange={(itemValue) => setRoom(itemValue)}
            style={[styles.input, { backgroundColor: colors.card, color: colors.textPrimary }]}
          >
            <Picker.Item label="101" value="101" />
            <Picker.Item label="202" value="202" />
            <Picker.Item label="303" value="303" />
          </Picker>

          <Text style={[styles.label, { color: colors.textPrimary }]}>Matéria:</Text>
          <Picker
            selectedValue={subject}
            onValueChange={(itemValue) => setSubject(itemValue)}
            style={[styles.input, { backgroundColor: colors.card, color: colors.textPrimary }]}
          >
            <Picker.Item label="Matemática" value="Matemática" />
            <Picker.Item label="História" value="História" />
            <Picker.Item label="Inglês" value="Inglês" />
            <Picker.Item label="Física" value="Física" />
            <Picker.Item label="Português" value="Português" />
          </Picker>

          <TouchableOpacity style={styles.button} onPress={handleAddTask}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  scrollContent: { paddingBottom: 120 }, // Mais espaço para os tabs
  title: { fontSize: 24, color: '#FA774C', fontFamily: 'Poppins-Bold', marginBottom: 20 },
  label: { fontSize: 16, fontFamily: 'Poppins-Regular', color: '#333', marginTop: 10 },
  input: {
    backgroundColor: '#F2F2F2',
    padding: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#FA774C',
    marginBottom: 10,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  button: { backgroundColor: '#FA774C', paddingVertical: 15, borderRadius: 30, marginTop: 10 },
  buttonText: { color: '#FFF', fontSize: 18, textAlign: 'center', fontFamily: 'Poppins-Bold' },
});
