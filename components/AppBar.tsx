import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { User, LogOut, CircleHelp as HelpCircle, Settings } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useSurveyStore } from '@/store/surveyStore';
import { router } from 'expo-router';

export function AppBar() {
  const [showProfile, setShowProfile] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const { user, logout } = useAuthStore();
  const { resetSurvey } = useSurveyStore();

  const handleLogout = () => {
    logout();
    resetSurvey();
    router.replace('/auth/login');
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Financial Satisfaction Survey</Text>
        <View style={styles.actions}>
          <Pressable
            style={styles.iconButton}
            onPress={() => setShowHelp(true)}>
            <HelpCircle size={22} color="#1e293b" />
          </Pressable>
          <Pressable
            style={styles.profileButton}
            onPress={() => setShowProfile(true)}>
            <User size={24} color="#1e293b" />
          </Pressable>
        </View>
      </View>

      {/* Profile Modal */}
      <Modal
        visible={showProfile}
        transparent
        animationType="fade"
        onRequestClose={() => setShowProfile(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowProfile(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Profile Details</Text>
            <View style={styles.profileInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{user?.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Age:</Text>
                <Text style={styles.value}>{user?.age}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Mobile:</Text>
                <Text style={styles.value}>{user?.mobile}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Qualification:</Text>
                <Text style={styles.value}>{user?.qualification}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Target:</Text>
                <Text style={styles.value}>{user?.target}</Text>
              </View>
            </View>
            <Pressable
              style={styles.logoutButton}
              onPress={handleLogout}>
              <LogOut size={20} color="#fff" />
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Help Modal */}
      <Modal
        visible={showHelp}
        transparent
        animationType="fade"
        onRequestClose={() => setShowHelp(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowHelp(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How to Take the Survey</Text>
            <View style={styles.helpContent}>
              <View style={styles.helpItem}>
                <Text style={styles.helpNumber}>1</Text>
                <Text style={styles.helpText}>
                  Read each statement carefully and consider how well it describes you
                </Text>
              </View>
              <View style={styles.helpItem}>
                <Text style={styles.helpNumber}>2</Text>
                <Text style={styles.helpText}>
                  Select a rating from 1 (Strongly Agree) to 7 (Strongly Disagree)
                </Text>
              </View>
              <View style={styles.helpItem}>
                <Text style={styles.helpNumber}>3</Text>
                <Text style={styles.helpText}>
                  Be honest - there are no right or wrong answers
                </Text>
              </View>
              <View style={styles.helpItem}>
                <Text style={styles.helpNumber}>4</Text>
                <Text style={styles.helpText}>
                  Complete all questions to view your personality insights
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#1e293b',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#1e293b',
    marginBottom: 24,
    textAlign: 'center',
  },
  profileInfo: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#64748b',
  },
  value: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#1e293b',
  },
  logoutButton: {
    marginTop: 24,
    backgroundColor: '#ef4444',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  helpContent: {
    gap: 16,
  },
  helpItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  helpNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6366f1',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  helpText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#1e293b',
    lineHeight: 24,
  },
});