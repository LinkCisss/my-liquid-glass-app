import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, useColorScheme } from 'react-native';
import { useFocusEffect } from 'expo-router';
import MeshGradient from '../../components/ui/MeshGradient';
import GlassCard from '../../components/ui/GlassCard';
import { getNotes, addNote, Note } from '../../store/storage';

export default function NotesScreen() {
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? { text: '#fff', sub: '#aaa', inputBg: 'rgba(255,255,255,0.1)' } : { text: '#333', sub: '#666', inputBg: 'rgba(255,255,255,0.5)' };

  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const loadData = async () => {
    const data = await getNotes();
    setNotes(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleAdd = async () => {
    if (!title || !content) return;
    await addNote(title, content, []);
    setTitle('');
    setContent('');
    loadData();
  };

  return (
    <View style={styles.container}>
      <MeshGradient />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <GlassCard intensity={isDark ? 40 : 80}>
          <Text style={[styles.title, { color: colors.text }]}>New Note</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]} 
            placeholder="Title" 
            placeholderTextColor={colors.sub} 
            value={title} 
            onChangeText={setTitle} 
          />
          <TextInput 
            style={[styles.input, { height: 100, backgroundColor: colors.inputBg, color: colors.text }]} 
            placeholder="What's on your mind?" 
            placeholderTextColor={colors.sub} 
            multiline 
            value={content} 
            onChangeText={setContent} 
          />
          
          <TouchableOpacity style={styles.submitBtn} onPress={handleAdd}>
            <Text style={styles.submitText}>Save Note</Text>
          </TouchableOpacity>
        </GlassCard>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Notes</Text>
        
        {notes.map((note) => (
          <GlassCard key={note.id} intensity={isDark ? 20 : 60}>
            <View style={styles.noteHeader}>
              <Text style={[styles.noteTitle, { color: colors.text }]}>{note.title}</Text>
              <Text style={[styles.noteDate, { color: colors.sub }]}>{new Date(note.date).toLocaleDateString()}</Text>
            </View>
            <Text style={[styles.noteContent, { color: colors.text }]}>{note.content}</Text>
          </GlassCard>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 60, paddingBottom: 120 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  input: { borderRadius: 12, padding: 12, marginBottom: 15, fontSize: 16 },
  submitBtn: { backgroundColor: '#FF9500', padding: 15, borderRadius: 12, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  noteHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  noteTitle: { fontSize: 18, fontWeight: 'bold', flex: 1 },
  noteDate: { fontSize: 12, paddingLeft: 10 },
  noteContent: { fontSize: 16, lineHeight: 24 },
});
