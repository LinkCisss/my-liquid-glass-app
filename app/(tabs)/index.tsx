import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { useFocusEffect } from 'expo-router';
import MeshGradient from '../../components/ui/MeshGradient';
import GlassCard from '../../components/ui/GlassCard';
import { getStocks, StockReview } from '../../store/storage';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const [stocks, setStocks] = useState<StockReview[]>([]);
  const isDark = useColorScheme() === 'dark';

  useFocusEffect(
    useCallback(() => {
      getStocks().then(setStocks);
    }, [])
  );

  const colors = isDark ? { text: '#fff', sub: '#aaa' } : { text: '#333', sub: '#666' };

  return (
    <View style={styles.container}>
      <MeshGradient />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.header, { color: colors.text }]}>Dashboard</Text>

        <GlassCard intensity={isDark ? 30 : 60}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Welcome Back</Text>
          <Text style={[styles.cardSub, { color: colors.sub }]}>
            You are currently tracking {stocks.length} stocks.
          </Text>
        </GlassCard>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
        
        {stocks.length === 0 ? (
          <GlassCard style={{ padding: 20 }}>
            <Text style={{ textAlign: 'center', color: colors.sub }}>No reviews yet. Head to Stocks to add one.</Text>
          </GlassCard>
        ) : (
          stocks.map((stock) => (
            <GlassCard key={stock.stockCode} intensity={isDark ? 20 : 70}>
              <View style={styles.stockRow}>
                <View>
                  <Text style={[styles.stockSym, { color: colors.text }]}>{stock.stockCode}</Text>
                  <Text style={[styles.stockName, { color: colors.sub }]}>{stock.stockName}</Text>
                </View>
                <View style={styles.recordBadge}>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>{stock.records.length} Logs</Text>
                </View>
              </View>
            </GlassCard>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 120, // space for tab bar
  },
  header: {
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardSub: {
    fontSize: 16,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 30,
    marginBottom: 10,
  },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockSym: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  stockName: {
    fontSize: 14,
    marginTop: 4,
  },
  recordBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  }
});
