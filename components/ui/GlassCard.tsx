import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, useColorScheme } from 'react-native';
import { GlassView } from 'expo-glass-effect';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
}

export default function GlassCard({ children, style, intensity = 40 }: GlassCardProps) {
  const isDark = useColorScheme() === 'dark';

  return (
    <View style={[styles.shadowContainer, style]}>
      <GlassView 
        style={styles.glass} 
        tint={isDark ? "dark" : "light"} 
        intensity={intensity} 
        blurRadius={20}
      >
        <View style={[styles.reflectionStyle, isDark ? styles.reflectionDark : styles.reflectionLight]}>
          {children}
        </View>
      </GlassView>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowContainer: {
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    marginVertical: 10,
    backgroundColor: 'transparent',
  },
  glass: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  reflectionStyle: {
    flex: 1,
    padding: 20,
    borderRadius: 24,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
  },
  reflectionLight: {
    borderColor: 'rgba(255,255,255,0.6)',
    borderBottomColor: 'rgba(255,255,255,0.2)',
    borderRightColor: 'rgba(255,255,255,0.2)',
  },
  reflectionDark: {
    borderColor: 'rgba(255,255,255,0.15)',
    borderBottomColor: 'rgba(255,255,255,0.05)',
    borderRightColor: 'rgba(255,255,255,0.05)',
  }
});
