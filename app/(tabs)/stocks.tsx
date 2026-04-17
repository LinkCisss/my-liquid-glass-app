import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, useColorScheme } from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import MeshGradient from '../../components/ui/MeshGradient';
import GlassCard from '../../components/ui/GlassCard';
import { getStocks, addStockRecord, StockReview, Sentiment } from '../../store/storage';

export default function StocksScreen() {
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? { text: '#fff', sub: '#aaa', inputBg: 'rgba(255,255,255,0.1)' } : { text: '#333', sub: '#666', inputBg: 'rgba(255,255,255,0.5)' };

  const [stocks, setStocks] = useState<StockReview[]>([]);
  const [sym, setSym] = useState('');
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [sentiment, setSentiment] = useState<Sentiment>('neutral');

  const loadData = async () => {
    const data = await getStocks();
    setStocks(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleAdd = async () => {
    if (!sym || !content) return;
    await addStockRecord(sym.toUpperCase(), name, { content, sentiment });
    setSym('');
    setName('');
    setContent('');
    setSentiment('neutral');
    loadData();
  };

  return (
    <View style={styles.container}>
      <MeshGradient />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <GlassCard intensity={isDark ? 40 : 80}>
          <Text style={[styles.title, { color: colors.text }]}>New Review</Text>
          <View style={styles.row}>
            <TextInput style={[styles.input, { flex: 1, marginRight: 10, backgroundColor: colors.inputBg, color: colors.text }]} placeholder="Symbol (e.g. AAPL)" placeholderTextColor={colors.sub} value={sym} onChangeText={setSym} />
            <TextInput style={[styles.input, { flex: 2, backgroundColor: colors.inputBg, color: colors.text }]} placeholder="Company Name" placeholderTextColor={colors.sub} value={name} onChangeText={setName} />
          </View>
          <TextInput style={[styles.input, { height: 80, backgroundColor: colors.inputBg, color: colors.text }]} placeholder="Your thoughts..." placeholderTextColor={colors.sub} multiline value={content} onChangeText={setContent} />
          
          <View style={styles.sentimentRow}>
            {(['bullish', 'neutral', 'bearish'] as Sentiment[]).map(s => (
              <TouchableOpacity key={s} onPress={() => setSentiment(s)} style={[styles.sentimentBtn, sentiment === s && styles.sentimentActive]}>
                <Text style={{ color: sentiment === s ? '#fff' : colors.text }}>{s.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity style={styles.submitBtn} onPress={handleAdd}>
            <Text style={styles.submitText}>Save Review</Text>
          </TouchableOpacity>
        </GlassCard>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Tracked Stocks</Text>
        
        {stocks.map((stock) => (
          <TouchableOpacity key={stock.stockCode} onPress={() => router.push(`/stock/${stock.stockCode}`)}>
            <GlassCard intensity={isDark ? 20 : 60}>
              <View style={styles.stockRow}>
                <View>
                  <Text style={[styles.stockSym, { color: colors.text }]}>{stock.stockCode}</Text>
                  <Text style={[styles.stockName, { color: colors.sub }]}>{stock.stockName || 'Unknown'}</Text>
                </View>
                <Text style={{ color: colors.sub }}>{stock.records.length} Reviews</Text>
              </View>
            </GlassCard>
          </TouchableOpacity>
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
  row: { flexDirection: 'row', marginBottom: 10 },
  input: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  sentimentRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  sentimentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: 'rgba(128,128,128,0.2)'
  },
  sentimentActive: { backgroundColor: '#007AFF' },
  submitBtn: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  stockRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stockSym: { fontSize: 18, fontWeight: 'bold' },
  stockName: { fontSize: 14, marginTop: 4 },
});
