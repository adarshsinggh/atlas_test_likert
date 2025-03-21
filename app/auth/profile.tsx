import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function ProfileScreen() {
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const [formData, setFormData] = useState({
    email: '',
    age: '',
    qualification: '',
    target: '',
  });

  const handleSubmit = () => {
    if (formData.email && formData.age && formData.qualification && formData.target) {
      updateProfile({
        email: formData.email,
        age: parseInt(formData.age),
        qualification: formData.qualification,
        target: formData.target,
      });
      router.replace('/(tabs)');
    }
  };

  const isValid = formData.email && formData.age && formData.qualification && formData.target;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>
          Please provide additional information to continue
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(text) => setFormData((prev) => ({ ...prev, email: text }))}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Age"
          keyboardType="numeric"
          value={formData.age}
          onChangeText={(text) => setFormData((prev) => ({ ...prev, age: text }))}
          maxLength={2}
        />

        <TextInput
          style={styles.input}
          placeholder="Qualification"
          value={formData.qualification}
          onChangeText={(text) => setFormData((prev) => ({ ...prev, qualification: text }))}
        />

        <TextInput
          style={styles.input}
          placeholder="Target/Goal"
          value={formData.target}
          onChangeText={(text) => setFormData((prev) => ({ ...prev, target: text }))}
        />

        <Pressable
          style={[styles.button, !isValid && styles.buttonDisabled]}
          disabled={!isValid}
          onPress={handleSubmit}>
          <Text style={styles.buttonText}>Continue to Survey</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#64748b',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  button: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#cbd5e1',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});