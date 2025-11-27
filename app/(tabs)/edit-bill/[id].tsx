
import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '@/styles/commonStyles';
import { supabase } from '@/app/integrations/supabase/client';

interface FixedBill {
  id: number;
  bill_name: string;
  bill_cost: number;
  due_date: string | null;
  created_at: string;
  user_id: string;
}

export default function EditBillScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [billName, setBillName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [originalBill, setOriginalBill] = useState<FixedBill | null>(null);

  useEffect(() => {
    fetchBillDetails();
  }, [id]);

  const fetchBillDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('FixedBills')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setOriginalBill(data);
        setBillName(data.bill_name || '');
        setAmount(data.bill_cost?.toString() || '');
        if (data.due_date) {
          setDueDate(new Date(data.due_date));
        }
      }
    } catch (error) {
      console.error('Error fetching bill details:', error);
      Alert.alert('Error', 'Failed to load bill details');
      router.back();
    } finally {
      setLoading(false);
    }
  };

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
      const { error } = await supabase
        .from('FixedBills')
        .update({
          bill_name: billName.trim(),
          bill_cost: parseFloat(amount),
          due_date: dueDate ? dueDate.toISOString().split('T')[0] : null,
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Navigate back to Fixed Bills tab and it will auto-refresh via useFocusEffect
      router.replace('/(tabs)/fixedbills');
      
    } catch (error) {
      console.error('Error saving bill:', error);
      Alert.alert('Error', 'Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    try {
      Alert.alert(
        'Delete Bill',
        'Are you sure you want to delete this bill? This action cannot be undone.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: confirmDelete,
          },
        ]
      );
    } catch (error) {
      console.error('Error in handleDelete:', error);
      Alert.alert('Error', 'Failed to delete bill');
    }
  };

  const confirmDelete = async () => {
    try {
      const { error } = await supabase
        .from('FixedBills')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Navigate back to Fixed Bills tab and it will auto-refresh via useFocusEffect
      router.replace('/(tabs)/fixedbills');
      
    } catch (error) {
      console.error('Error deleting bill:', error);
      Alert.alert('Error', 'Failed to delete bill. Please try again.');
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    try {
      setShowDatePicker(Platform.OS === 'ios');
      if (selectedDate) {
        setDueDate(selectedDate);
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

  if (loading) {
    return (
      <View style={styles.container}>
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
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.navbarTitle}>Edit Bill</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.green} />
          <Text style={styles.loadingText}>Loading bill details...</Text>
        </View>
      </View>
    );
  }

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
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.navbarTitle}>{billName || 'Edit Bill'}</Text>
        <TouchableOpacity
          onPress={handleSave}
          style={styles.saveButton}
          disabled={saving}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
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
              onPress={() => {
                try {
                  setShowDatePicker(true);
                } catch (error) {
                  console.error('Error showing date picker:', error);
                }
              }}
            >
              <Text style={[styles.dateButtonText, !dueDate && styles.dateButtonPlaceholder]}>
                {formatDate(dueDate)}
              </Text>
              <Ionicons name="calendar-outline" size={20} color={colors.green} />
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={dueDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              textColor="#FFFFFF"
              themeVariant="dark"
            />
          )}
        </View>

        {/* Delete Button */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
          <Text style={styles.deleteButtonText}>Delete Bill</Text>
        </TouchableOpacity>
      </ScrollView>
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
    borderBottomColor: 'rgba(46, 255, 139, 0.1)',
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
  },
  placeholder: {
    width: 60,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#888888',
    fontSize: 16,
    marginTop: 16,
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
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(46, 255, 139, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(46, 255, 139, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 16,
  },

  // Amount Input
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 255, 139, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(46, 255, 139, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  currencySymbol: {
    color: colors.green,
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    padding: 0,
  },

  // Date Button
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(46, 255, 139, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(46, 255, 139, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  dateButtonPlaceholder: {
    color: '#666666',
  },

  // Delete Button
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.red,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 24,
    gap: 8,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
