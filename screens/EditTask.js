import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { supabase } from '../lib/supabase';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditTaskScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { task } = route.params;

  const [title, setTitle] = useState(task.title);
  const [dueDate, setDueDate] = useState(new Date(task.due_date));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [teacher, setTeacher] = useState(task.teacher);
  const [room, setRoom] = useState(task.room);
  const [subject, setSubject] = useState(task.subject);

  const subjectColors = {
    'Matemática': '#FAD02C',
    'História': '#A29BFE',
    'Inglês': '#55EFC4',
    'Física': '#FF7675',
    'Português': '#74B9FF',
  };

  const handleEditTask = async () => {
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

    const { error } = await supabase
      .from('activities')
      .update({
        title,
        due_date: dueDate.toISOString().split('T')[0],
        teacher,
        room,
        subject,
        color: subjectColors[subject] || '#F2F2F2',
      })
      .eq('id', task.id);

    if (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao atualizar tarefa!');
    } else {
      Alert.alert('Tarefa atualizada!');
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
    <View style={styles.container}>
      <Text style={styles.title}>Editar Atividade</Text>

      <TextInput
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TouchableOpacity onPress={showPicker} style={styles.input}>
        <Text style={{ fontSize: 16, fontFamily: 'Poppins-Regular', color: '#333' }}>
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

      <Text style={styles.label}>Professor:</Text>
      <Picker
        selectedValue={teacher}
        onValueChange={(itemValue) => setTeacher(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Prof. Ana" value="Prof. Ana" />
        <Picker.Item label="Prof. João" value="Prof. João" />
        <Picker.Item label="Prof. Carla" value="Prof. Carla" />
      </Picker>

      <Text style={styles.label}>Sala:</Text>
      <Picker
        selectedValue={room}
        onValueChange={(itemValue) => setRoom(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="101" value="101" />
        <Picker.Item label="202" value="202" />
        <Picker.Item label="303" value="303" />
      </Picker>

      <Text style={styles.label}>Matéria:</Text>
      <Picker
        selectedValue={subject}
        onValueChange={(itemValue) => setSubject(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Matemática" value="Matemática" />
        <Picker.Item label="História" value="História" />
        <Picker.Item label="Inglês" value="Inglês" />
        <Picker.Item label="Física" value="Física" />
        <Picker.Item label="Português" value="Português" />
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleEditTask}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 20 },
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
