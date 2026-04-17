import React, { useEffect } from 'react';
import { StyleSheet, useColorScheme, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { GlassView } from 'expo-glass-effect';

export default function MeshGradient() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { width, height } = useWindowDimensions();

  // Color palettes
  const baseColors = isDark 
    ? ['#0B0C10', '#1F2833', '#000000'] 
    : ['#FFF0F5', '#FFE4E1', '#ffffff'];

  const blob1Color = isDark ? 'rgba(69, 162, 158, 0.5)' : 'rgba(255, 182, 193, 0.6)';
  const blob2Color = isDark ? 'rgba(74, 91, 191, 0.4)' : 'rgba(173, 216, 230, 0.6)';
  const blob3Color = isDark ? 'rgba(102, 51, 153, 0.4)' : 'rgba(255, 239, 213, 0.7)';

  // Animations
  const blob1Tx = useSharedValue(0);
  const blob1Ty = useSharedValue(0);
  
  const blob2Tx = useSharedValue(width * 0.5);
  const blob2Ty = useSharedValue(height * 0.2);

  const blob3Tx = useSharedValue(-width * 0.2);
  const blob3Ty = useSharedValue(height * 0.5);

  useEffect(() => {
    const config = { duration: 10000, easing: Easing.inOut(Easing.ease) };
    
    blob1Tx.value = withRepeat(
      withSequence(withTiming(width * 0.4, config), withTiming(-width * 0.1, config)), -1, true
    );
    blob1Ty.value = withRepeat(
      withSequence(withTiming(height * 0.3, config), withTiming(-height * 0.1, config)), -1, true
    );

    blob2Tx.value = withRepeat(
      withSequence(withTiming(-width * 0.3, config), withTiming(width * 0.6, config)), -1, true
    );
    blob2Ty.value = withRepeat(
      withSequence(withTiming(height * 0.6, config), withTiming(-height * 0.2, config)), -1, true
    );

    blob3Tx.value = withRepeat(
      withSequence(withTiming(width * 0.5, config), withTiming(-width * 0.4, config)), -1, true
    );
    blob3Ty.value = withRepeat(
      withSequence(withTiming(-height * 0.2, config), withTiming(height * 0.4, config)), -1, true
    );
  }, []);

  const b1Style = useAnimatedStyle(() => ({
    transform: [{ translateX: blob1Tx.value }, { translateY: blob1Ty.value }]
  }));
  const b2Style = useAnimatedStyle(() => ({
    transform: [{ translateX: blob2Tx.value }, { translateY: blob2Ty.value }]
  }));
  const b3Style = useAnimatedStyle(() => ({
    transform: [{ translateX: blob3Tx.value }, { translateY: blob3Ty.value }]
  }));

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <LinearGradient colors={baseColors} style={StyleSheet.absoluteFillObject} />
      
      <Animated.View style={[styles.blob, { backgroundColor: blob1Color, top: -100, left: -100 }, b1Style]} />
      <Animated.View style={[styles.blob, { backgroundColor: blob2Color, top: 100, right: -150 }, b2Style]} />
      <Animated.View style={[styles.blob, { backgroundColor: blob3Color, bottom: -100, left: 50 }, b3Style]} />

      {/* Extreme Blur Layer to create standard fluid Mesh Gradient look */}
      {!isDark && <GlassView style={StyleSheet.absoluteFillObject} intensity={80} tint="light" />}
      {isDark && <GlassView style={StyleSheet.absoluteFillObject} intensity={80} tint="dark" />}
    </View>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
  }
});
