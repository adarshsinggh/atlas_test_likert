import React from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface LikertScaleProps {
  value?: number;
  onChange: (value: number) => void;
  text: string;
}

export function LikertScale({ value, onChange, text }: LikertScaleProps) {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 500;

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{text}</Text>
      <View style={styles.scaleContainer}>
        <View style={[styles.scale, isSmallScreen && styles.scaleSmall]}>
          {[1, 2, 3, 4, 5, 6, 7].map((optionValue) => (
            <Option
              key={optionValue}
              value={optionValue}
              isSelected={value === optionValue}
              onSelect={() => onChange(optionValue)}
              isSmallScreen={isSmallScreen}
            />
          ))}
        </View>
      </View>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, styles.labelLeft]}>AGREE</Text>
        <Text style={[styles.label, styles.labelRight]}>DISAGREE</Text>
      </View>
      <View style={styles.separator} />
    </View>
  );
}

function Option({
  value,
  isSelected,
  onSelect,
  isSmallScreen,
}: {
  value: number;
  isSelected: boolean;
  onSelect: () => void;
  isSmallScreen: boolean;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    if (isSelected) {
      return {
        transform: [
          {
            scale: withSequence(
              withSpring(1.1),
              withTiming(1, { duration: 150 })
            ),
          },
        ],
        backgroundColor: withTiming('#6366f1'),
      };
    }
    return {
      transform: [{ scale: withSpring(1) }],
      backgroundColor: withTiming('#fff'),
    };
  });

  return (
    <AnimatedPressable
      onPress={onSelect}
      style={[
        styles.option,
        isSmallScreen && styles.optionSmall,
        {
          borderColor: '#e2e8f0',
          borderWidth: isSelected ? 0 : 1,
        },
        animatedStyle,
      ]}>
      {isSelected && (
        <Check
          size={isSmallScreen ? 16 : 20}
          color="#fff"
          strokeWidth={2.5}
        />
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  question: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#1e293b',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 24,
  },
  scaleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  scale: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
    paddingHorizontal: 8,
  },
  scaleSmall: {
    gap: 12,
  },
  option: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  optionSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    marginTop: 16,
  },
  label: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1,
    color: '#64748b',
  },
  labelLeft: {
    textAlign: 'left',
  },
  labelRight: {
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginTop: 32,
    marginHorizontal: 24,
  },
});