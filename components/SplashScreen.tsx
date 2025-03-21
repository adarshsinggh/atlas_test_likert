import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  withSpring,
  withDelay,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const AnimatedImage = Animated.createAnimatedComponent(Image);

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const slideOffset = useSharedValue(width);

  useEffect(() => {
    // Initial animations
    scale.value = withSequence(
      withSpring(1.1, { damping: 15 }),
      withTiming(1, { duration: 300 })
    );
    opacity.value = withTiming(1, { duration: 800 });

    // Slide in cards
    slideOffset.value = withDelay(
      400,
      withSpring(0, { damping: 15, stiffness: 100 })
    );

    // Complete splash screen
    const timeout = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 500 }, () => {
        onComplete();
      });
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const cardsStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideOffset.value }],
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <AnimatedImage
        source={{ uri: 'https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?q=80&w=2340&auto=format&fit=crop' }}
        style={[styles.backgroundImage, { opacity: 0.1 }]}
      />
      
      <Animated.View style={[styles.content, logoStyle]}>
        <Text style={styles.title}>Financial Satisfaction</Text>
        <Text style={styles.subtitle}>Survey</Text>
      </Animated.View>

      <Animated.View style={[styles.cards, cardsStyle]}>
        <View style={styles.card}>
          <Text style={styles.cardNumber}>01</Text>
          <Text style={styles.cardText}>Assess Your Financial Health</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardNumber}>02</Text>
          <Text style={styles.cardText}>Get Personalized Insights</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardNumber}>03</Text>
          <Text style={styles.cardText}>Plan Your Financial Future</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  content: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Inter_700Bold',
    color: '#1e293b',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    fontFamily: 'Inter_400Regular',
    color: '#6366f1',
    marginTop: 8,
  },
  cards: {
    position: 'absolute',
    bottom: 80,
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 500,
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardNumber: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#6366f1',
  },
  cardText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#1e293b',
  },
});