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

export default function LoginScreen() {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const login = useAuthStore((state) => state.login);

  const handleSendOtp = () => {
    if (mobile.length >= 10) {
      setStep('otp');
    }
  };

  const handleLogin = () => {
    if (otp.length >= 4) {
      login(mobile);
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Sign in to continue to your account
        </Text>

        {step === 'mobile' ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              keyboardType="phone-pad"
              value={mobile}
              onChangeText={setMobile}
              maxLength={10}
            />
            <Pressable
              style={[
                styles.button,
                mobile.length < 10 && styles.buttonDisabled,
              ]}
              disabled={mobile.length < 10}
              onPress={handleSendOtp}>
              <Text style={styles.buttonText}>Send OTP</Text>
            </Pressable>
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              keyboardType="number-pad"
              value={otp}
              onChangeText={setOtp}
              maxLength={4}
            />
            <Pressable
              style={[
                styles.button,
                otp.length < 4 && styles.buttonDisabled,
              ]}
              disabled={otp.length < 4}
              onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </Pressable>
          </>
        )}

        <Link href="/auth/signup" style={styles.link}>
          <Text style={styles.linkText}>
            Don't have an account? Sign up
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