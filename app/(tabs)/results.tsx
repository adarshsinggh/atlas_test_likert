import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useSurveyStore } from '@/store/surveyStore';
import { FileDown } from 'lucide-react-native';
import Svg, { Circle, Path, Text as SvgText, G } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const RADIUS = 120;
const STROKE_WIDTH = 20;
const CIRCLE_LENGTH = 2 * Math.PI * RADIUS;

const CircularGauge = ({ value, maxValue, label, color, delay = 0 }) => {
  const progress = useSharedValue(0);
  const scale = useSharedValue(0.8);

  React.useEffect(() => {
    progress.value = withDelay(
      delay,
      withSpring(value / maxValue, { damping: 15 })
    );
    scale.value = withDelay(
      delay,
      withSequence(
        withSpring(1.1),
        withTiming(1, { duration: 200 })
      )
    );
  }, [value]);

  const animatedProps = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const strokeDashoffset = useAnimatedStyle(() => ({
    strokeDashoffset: withSpring(
      CIRCLE_LENGTH * (1 - progress.value),
      { damping: 15 }
    ),
  }));

  const percentage = (value / maxValue) * 100;

  return (
    <Animated.View style={[styles.gaugeContainer, animatedProps]}>
      <Svg width={RADIUS * 2 + STROKE_WIDTH} height={RADIUS * 2 + STROKE_WIDTH}>
        <G transform={`translate(${STROKE_WIDTH / 2 + RADIUS}, ${STROKE_WIDTH / 2 + RADIUS})`}>
          {/* Background circle */}
          <Circle
            r={RADIUS}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={STROKE_WIDTH}
          />
          
          {/* Progress circle */}
          <AnimatedCircle
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={CIRCLE_LENGTH}
            strokeLinecap="round"
            style={strokeDashoffset}
            transform="rotate(-90)"
          />

          {/* Center text */}
          <SvgText
            x="0"
            y="0"
            fontSize="36"
            fontWeight="bold"
            fill="#1e293b"
            textAnchor="middle"
            alignmentBaseline="middle">
            {percentage.toFixed(0)}%
          </SvgText>

          {/* Label */}
          <SvgText
            x="0"
            y="30"
            fontSize="14"
            fill="#64748b"
            textAnchor="middle"
            alignmentBaseline="middle">
            {label}
          </SvgText>
        </G>
      </Svg>
    </Animated.View>
  );
};

export default function ResultsScreen() {
  const { questions } = useSurveyStore();

  const sections = questions.reduce((acc, question) => {
    if (!acc[question.section]) {
      acc[question.section] = [];
    }
    acc[question.section].push(question);
    return acc;
  }, {} as Record<string, typeof questions>);

  const calculateSectionAverage = (sectionQuestions: typeof questions) => {
    const answered = sectionQuestions.filter((q) => q.answer !== undefined);
    if (answered.length === 0) return 0;
    const sum = answered.reduce((acc, q) => acc + (q.answer || 0), 0);
    return sum / answered.length;
  };

  const sectionColors = {
    'Cognitive & Thought Process': '#6366f1',
    'Emotional & Decision-Making Style': '#ec4899',
    'Organization & Lifestyle': '#14b8a6',
    'Social & Energy Levels': '#f59e0b',
  };

  const handleDownloadPDF = async () => {
    const html = `
      <html>
        <head>
          <style>
            body { font-family: system-ui; padding: 20px; }
            h1 { color: #1e293b; }
            .section { margin: 20px 0; }
            .section-title { color: #334155; }
            .average { color: #6366f1; font-weight: bold; }
            .question { margin: 10px 0; color: #475569; }
            .answer { color: #6366f1; }
          </style>
        </head>
        <body>
          <h1>Personality Assessment Results</h1>
          ${Object.entries(sections)
            .map(
              ([section, sectionQuestions]) => `
                <div class="section">
                  <h2 class="section-title">${section}</h2>
                  <p>Section Average: <span class="average">${calculateSectionAverage(
                    sectionQuestions
                  ).toFixed(1)}</span></p>
                  ${sectionQuestions
                    .map(
                      (q) => `
                        <div class="question">
                          <p>${q.text}</p>
                          <p class="answer">Response: ${
                            q.answer || 'Not answered'
                          }</p>
                        </div>
                      `
                    )
                    .join('')}
                </div>
              `
            )
            .join('')}
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2340&auto=format&fit=crop' }}
            style={styles.headerImage}
          />
          <View style={styles.headerOverlay} />
          <View style={styles.headerContent}>
            <Animated.Text
              entering={FadeInDown.delay(200)}
              style={styles.title}>
              Your Results
            </Animated.Text>
            <Text style={styles.subtitle}>
              Here's what we learned about your financial goals
            </Text>
          </View>
        </View>

        <View style={styles.gaugesContainer}>
          {Object.entries(sections).map(([section, sectionQuestions], index) => (
            <View key={section} style={styles.gaugeSection}>
              <CircularGauge
                value={calculateSectionAverage(sectionQuestions)}
                maxValue={7}
                label={section}
                color={sectionColors[section]}
                delay={index * 300}
              />
              
              <View style={styles.questionsContainer}>
                {sectionQuestions.map((question) => (
                  <View key={question.id} style={styles.questionItem}>
                    <Text style={styles.questionText}>{question.text}</Text>
                    <Text style={[styles.answerText, { color: sectionColors[section] }]}>
                      {question.answer || 'Not answered'}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        <Pressable style={styles.downloadButton} onPress={handleDownloadPDF}>
          <FileDown color="#fff" size={20} />
          <Text style={styles.downloadButtonText}>Download Report</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    height: 240,
    position: 'relative',
    marginBottom: 24,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
  },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#e2e8f0',
    lineHeight: 24,
  },
  gaugesContainer: {
    padding: 16,
  },
  gaugeSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  gaugeContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  questionsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 16,
  },
  questionItem: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  questionText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#475569',
    marginBottom: 4,
  },
  answerText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  downloadButton: {
    backgroundColor: '#6366f1',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});