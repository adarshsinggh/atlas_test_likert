import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import { LikertScale } from '@/components/LikertScale';
import { useSurveyStore } from '@/store/surveyStore';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function SurveyScreen() {
  const { questions, setAnswer, isComplete } = useSurveyStore();

  const sections = questions.reduce((acc, question) => {
    if (!acc[question.section]) {
      acc[question.section] = [];
    }
    acc[question.section].push(question);
    return acc;
  }, {} as Record<string, typeof questions>);

  const handleSubmit = () => {
    if (isComplete()) {
      router.push('/results');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2340&auto=format&fit=crop' }}
            style={styles.headerImage}
          />
          <View style={styles.headerOverlay} />
          <View style={styles.headerContent}>
            <Animated.Text
              entering={FadeInDown.delay(200)}
              style={styles.title}>
              Personality Assessment
            </Animated.Text>
            <Text style={styles.subtitle}>
              Discover insights about your personality traits and tendencies
            </Text>
          </View>
        </View>

        {Object.entries(sections).map(([section, questions], sectionIndex) => (
          <Animated.View
            key={section}
            entering={FadeInDown.delay(300 + sectionIndex * 100)}
            style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section}</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { 
                      width: `${(questions.filter(q => q.answer !== undefined).length / questions.length) * 100}%`
                    }
                  ]} 
                />
              </View>
            </View>
            {questions.map((question) => (
              <LikertScale
                key={question.id}
                value={question.answer}
                onChange={(value) => setAnswer(question.id, value)}
                text={question.text}
              />
            ))}
          </Animated.View>
        ))}

        <AnimatedPressable
          entering={FadeInDown.delay(500)}
          style={[
            styles.submitButton,
            !isComplete() && styles.submitButtonDisabled,
          ]}
          disabled={!isComplete()}
          onPress={handleSubmit}>
          <Text
            style={[
              styles.submitButtonText,
              !isComplete() && styles.submitButtonTextDisabled,
            ]}>
            View Results
          </Text>
        </AnimatedPressable>
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
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
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
  sectionHeader: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#1e293b',
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 2,
  },
  submitButton: {
    backgroundColor: '#6366f1',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#cbd5e1',
    shadowColor: '#64748b',
    shadowOpacity: 0.1,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  submitButtonTextDisabled: {
    color: '#94a3b8',
  },
});