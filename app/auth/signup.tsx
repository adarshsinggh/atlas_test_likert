import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const signup = useAuthStore((state) => state.signup);

  const handleSignup = () => {
    if (name && email && mobile) {
      signup({
        id: '1',
        name,
        email,
        mobile,
      });
      router.replace('/(tabs)');
    }
  };

  const isValid = name && email && mobile.length >= 10;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Sign up to start your assessment
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          keyboardType="phone-pad"
          value={mobile}
          onChangeText={setMobile}
          maxLength={10}
        />

        <Pressable
          style={[styles.button, !isValid && styles.buttonDisabled]}
          disabled={!isValid}
          onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>

        <Link href="/auth/login" style={styles.link}>
          <Text style={styles.linkText}>
            Already have an account? Sign in
          </Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
  link: {
    marginTop: 16,
  },
  linkText: {
    color: '#6366f1',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
});