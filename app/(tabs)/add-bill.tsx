
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, fonts } from '@/styles/commonStyles';
import { supabase } from '@/app/integrations/supabase/client';

export default function AddBillScreen() {
  const router = useRouter();
  
  const [saving, setSaving] = useState(false);
  const [billName, setBillName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = async () => {
    try {
      if (!billName.trim()) {
        Alert.alert('Validation Error', 'Please enter a bill name');
        return;
      }

      if (!amount.trim() || isNaN(parseFloat(amount))) {
        Alert.alert('Validation Error', 'Please enter a valid amount');
        return;
      }

      setSaving(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw sessionError;
      }

      if (!session) {
        Alert.alert('Error', 'You must be logged in to add bills');
        return;
      }

      console.log('Inserting bill into FixedBills table...');
      const { data, error } = await supabase
        .from('FixedBills')
        .insert({
          bill_name: billName.trim(),
          bill_cost: parseFloat(amount),
          due_date: dueDate ? dueDate.toISOString().split('T')[0] : null,
          user_id: session.user.id,
        })
        .select();

      if (error) {
        console.error('Error inserting bill:', error);
        throw error;
      }

      console.log('Bill inserted successfully:', data);
      
      // Navigate back to Fixed Bills tab and it will auto-refresh via useFocusEffect
      router.replace('/(tabs)/fixedbills');
      
    } catch (error) {
      console.error('Error in handleSave:', error);
      Alert.alert('Error', 'Failed to add bill. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    try {
      console.log('Date picker event:', event.type, 'Selected date:', selectedDate);
      
      // On Android, the picker closes automatically after selection
      if (Platform.OS === 'android') {
        setShowDatePicker(false);
        if (event.type === 'set' && selectedDate) {
          setDueDate(selectedDate);
        }
      } else {
        // On iOS, update the date immediately as user scrolls
        if (selectedDate) {
          setDueDate(selectedDate);
        }
      }
    } catch (error) {
      console.error('Error in handleDateChange:', error);
    }
  };

  const formatDate = (date: Date | null) => {
    try {
      if (!date) return 'Select date';
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Select date';
    }
  };

  const openCalendar = () => {
    try {
      console.log('Opening calendar picker...');
      setShowDatePicker(true);
    } catch (error) {
      console.error('Error opening calendar:', error);
    }
  };

  const closeDatePicker = () => {
    try {
      console.log('Closing date picker...');
      setShowDatePicker(false);
    } catch (error) {
      console.error('Error closing date picker:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity
          onPress={() => {
            try {
              router.back();
            } catch (error) {
              console.error('Error navigating back:', error);
            }
          }}
          style={styles.backButton}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.green} />
        </TouchableOpacity>
        <Text style={styles.navbarTitle}>Add New Bill</Text>
        <TouchableOpacity
          onPress={handleSave}
          style={styles.saveButton}
          disabled={saving}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
        >
          {saving ? (
            <ActivityIndicator size="small" color={colors.background} />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Bill Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Details</Text>

          {/* Bill Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bill Name</Text>
            <TextInput
              style={styles.input}
              value={billName}
              onChangeText={setBillName}
              placeholder="Enter bill name"
              placeholderTextColor="#666666"
              autoCapitalize="words"
            />
          </View>

          {/* Amount */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor="#666666"
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          {/* Due Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Due Date (Optional)</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={openCalendar}
            >
              <Ionicons name="calendar-outline" size={20} color={colors.green} />
              <Text style={[styles.dateButtonText, !dueDate && styles.dateButtonPlaceholder]}>
                {formatDate(dueDate)}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#666666" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Date Picker Modal for iOS */}
      {Platform.OS === 'ios' && showDatePicker && (
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={closeDatePicker}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity 
              style={styles.modalBackdrop} 
              activeOpacity={1} 
              onPress={closeDatePicker}
            />
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  onPress={closeDatePicker}
                  hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Select Due Date</Text>
                <TouchableOpacity
                  onPress={closeDatePicker}
                  hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
                >
                  <Text style={styles.modalDoneText}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={dueDate || new Date()}
                mode="date"
                display="inline"
                onChange={handleDateChange}
                textColor="#FFFFFF"
                themeVariant="dark"
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Date Picker for Android */}
      {Platform.OS === 'android' && showDatePicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="date"
          display="calendar"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 48 : 0,
  },

  // Navbar Styles
  navbar: {
    height: 56,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46, 255, 139, 0.2)',
  },
  backButton: {
    minWidth: 32,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navbarTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: fonts.bold,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  saveButton: {
    minWidth: 60,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.green,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: fonts.medium,
  },

  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 120,
  },

  // Section
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: colors.green,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: fonts.medium,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },

  // Input Group
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: fonts.medium,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(46, 255, 139, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(46, 255, 139, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: fonts.regular,
  },

  // Amount Input
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 255, 139, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(46, 255, 139, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  currencySymbol: {
    color: colors.green,
    fontSize: 18,
    fontWeight: '600',
    fontFamily: fonts.medium,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: fonts.medium,
    padding: 0,
  },

  // Date Button
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(46, 255, 139, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(46, 255, 139, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  dateButtonText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: fonts.regular,
  },
  dateButtonPlaceholder: {
    color: '#666666',
  },

  // Modal Styles (iOS)
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#1A2F1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46, 255, 139, 0.2)',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: fonts.medium,
  },
  modalCancelText: {
    color: '#888888',
    fontSize: 16,
    fontFamily: fonts.regular,
  },
  modalDoneText: {
    color: colors.green,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: fonts.medium,
  },
});
