import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, G, Circle, Text as SvgText, LinearGradient, Stop, Defs } from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const RADIUS = 120;
const CENTER = RADIUS;
const STROKE_WIDTH = 40;

interface RiskometerProps {
  value: number;
  label: string;
}

export function Riskometer({ value, label }: RiskometerProps) {
  const rotation = useSharedValue(0);
  
  useEffect(() => {
    let targetAngle = ((value - 1) / 6) * 180;
    rotation.value = withSpring(targetAngle, {
      damping: 15,
      stiffness: 90,
    });
  }, [value]);

  const needleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -4 },
      { rotate: `${rotation.value}deg` },
      { translateX: 4 },
    ],
  }));

  const sections = [
    { color: '#22c55e', start: 0, end: 36, label: 'LOW' },
    { color: '#84cc16', start: 36, end: 72, label: 'LOW to\nMODERATE' },
    { color: '#fbbf24', start: 72, end: 108, label: 'MODERATE' },
    { color: '#fb923c', start: 108, end: 144, label: 'MODERATELY\nHIGH' },
    { color: '#ef4444', start: 144, end: 180, label: 'HIGH' },
  ];

  const createArcPath = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(CENTER, CENTER, RADIUS - STROKE_WIDTH / 2, startAngle);
    const end = polarToCartesian(CENTER, CENTER, RADIUS - STROKE_WIDTH / 2, endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", start.x, start.y,
      "A", RADIUS - STROKE_WIDTH / 2, RADIUS - STROKE_WIDTH / 2, 0, largeArcFlag, 1, end.x, end.y
    ].join(" ");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RISKOMETER</Text>
      <Svg width={RADIUS * 2} height={RADIUS + 60} viewBox={`0 0 ${RADIUS * 2} ${RADIUS + 60}`}>
        <Defs>
          <LinearGradient id="scaleGradient" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#22c55e" />
            <Stop offset="0.5" stopColor="#fbbf24" />
            <Stop offset="1" stopColor="#ef4444" />
          </LinearGradient>
        </Defs>

        {/* Background arc */}
        <Path
          d={createArcPath(0, 180)}
          stroke="#f1f5f9"
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />

        {/* Colored sections */}
        {sections.map((section, index) => (
          <G key={index}>
            <Path
              d={createArcPath(section.start, section.end)}
              stroke={section.color}
              strokeWidth={STROKE_WIDTH}
              fill="none"
            />
            {/* Section labels */}
            {(() => {
              const angle = (section.start + section.end) / 2;
              const radius = RADIUS - STROKE_WIDTH / 2 - 20;
              const pos = polarToCartesian(CENTER, CENTER, radius, angle);
              const lines = section.label.split('\n');
              return lines.map((line, lineIndex) => (
                <SvgText
                  key={`${index}-${lineIndex}`}
                  x={pos.x}
                  y={pos.y + (lineIndex * 12) - (lines.length - 1) * 6}
                  fontSize="10"
                  fontFamily="Inter_600SemiBold"
                  fill="#1e293b"
                  textAnchor="middle"
                  dominantBaseline="middle">
                  {line}
                </SvgText>
              ));
            })()}
          </G>
        ))}

        {/* Needle */}
        <Animated.View style={[styles.needleContainer, needleStyle]}>
          <G>
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={16}
              fill="#fb923c"
              stroke="#fff"
              strokeWidth={2}
            />
            <Path
              d={`M ${CENTER} ${CENTER} L ${CENTER} ${CENTER - (RADIUS - STROKE_WIDTH / 2 - 10)}`}
              stroke="#1e293b"
              strokeWidth={4}
              strokeLinecap="round"
            />
          </G>
        </Animated.View>
      </Svg>

      {/* Bottom scale bar */}
      <View style={styles.scaleBar}>
        <Text style={styles.scaleText}>LOW</Text>
        <View style={styles.scaleGradient} />
        <Text style={styles.scaleText}>VERY HIGH</Text>
      </View>
    </View>
  );
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: '#1e293b',
    marginBottom: 24,
    letterSpacing: 1,
  },
  needleContainer: {
    position: 'absolute',
    width: RADIUS * 2,
    height: RADIUS + 60,
  },
  scaleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    width: '100%',
    gap: 12,
  },
  scaleGradient: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    backgroundImage: 'linear-gradient(to right, #22c55e, #fbbf24, #ef4444)',
  },
  scaleText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#1e293b',
    letterSpacing: 0.5,
  },
});