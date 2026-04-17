import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MeshGradient from '../../components/ui/MeshGradient';
import GlassCard from '../../components/ui/GlassCard';
import { getStocks, StockReview } from '../../store/storage';
import { Ionicons } from '@expo/vector-icons';

export default function StockDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [stock, setStock] = useState<StockReview | null>(null);
  
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? { text: '#fff', sub: '#aaa' } : { text: '#333', sub: '#666' };

  useEffect(() => {
    getStocks().then((stocks) => {
      const found = stocks.find(s => s.stockCode === id);
      setStock(found || null);
    });
  }, [id]);

  const getSentimentColor = (s: string) => {
    switch (s) {
      case 'bullish': return '#FF3B30'; // Red for Red in CN for up, or Green? CN uses Red for UP
      case 'bearish': return '#34C759'; // Green in CN for Down
      default: return '#8E8E93';
    }
  };

  return (
    <View style={styles.container}>
      <MeshGradient />
      <View style={[styles.headerStyle, { backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)' }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{id} Reviews</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {!stock ? (
          <Text style={{ color: colors.text, textAlign: 'center', marginTop: 50 }}>No stock found.</Text>
        ) : (
          <>
            <Text style={[styles.title, { color: colors.text }]}>{stock.stockName}</Text>
            {stock.records.map(record => (
              <GlassCard key={record.id} intensity={isDark ? 30 : 60}>
                <View style={styles.recordHeader}>
                  <Text style={[styles.date, { color: colors.sub }]}>{new Date(record.date).toLocaleDateString()}</Text>
                  <View style={[styles.badge, { backgroundColor: getSentimentColor(record.sentiment) }]}>
                    <Text style={styles.badgeText}>{record.sentiment.toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={[styles.content, { color: colors.text }]}>{record.content}</Text>
              </GlassCard>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerStyle: {
    height: 90,
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  recordHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  date: { fontSize: 14 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  content: { fontSize: 16, lineHeight: 24 },
});
