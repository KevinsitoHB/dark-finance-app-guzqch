
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { colors } from '@/styles/commonStyles';

interface Payment {
  amount: number;
  isPaid: boolean;
  accountName: string;
  accountType: string;
  currentBalance: number;
  minimumPayment: number;
}

interface Paycheck {
  amount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly';
}

interface DayData {
  payment?: Payment;
  paycheck?: Paycheck;
}

interface CalendarData {
  [key: string]: DayData; // key format: "YYYY-MM-DD"
}

// Sample data - replace with actual data from your app
const sampleCalendarData: CalendarData = {
  '2025-01-01': { payment: { amount: 365, isPaid: false, accountName: 'Credit Card', accountType: 'Credit', currentBalance: 1500, minimumPayment: 365 } },
  '2025-01-04': { payment: { amount: 107, isPaid: false, accountName: 'Utilities', accountType: 'Bill', currentBalance: 107, minimumPayment: 107 } },
  '2025-01-07': { paycheck: { amount: 2500, frequency: 'biweekly' } },
  '2025-01-08': { payment: { amount: 101, isPaid: false, accountName: 'Internet', accountType: 'Bill', currentBalance: 101, minimumPayment: 101 } },
  '2025-01-14': { paycheck: { amount: 2500, frequency: 'biweekly' } },
  '2025-01-17': { payment: { amount: 6777, isPaid: false, accountName: 'Mortgage', accountType: 'Loan', currentBalance: 250000, minimumPayment: 6777 } },
  '2025-01-20': { payment: { amount: 0, isPaid: true, accountName: 'Phone', accountType: 'Bill', currentBalance: 0, minimumPayment: 0 } },
  '2025-01-21': { payment: { amount: 170, isPaid: false, accountName: 'Car Insurance', accountType: 'Insurance', currentBalance: 170, minimumPayment: 170 } },
  '2025-01-27': { payment: { amount: 1, isPaid: false, accountName: 'Subscription', accountType: 'Bill', currentBalance: 1, minimumPayment: 1 } },
  '2025-01-28': { paycheck: { amount: 2500, frequency: 'biweekly' } },
  '2025-02-01': { payment: { amount: 365, isPaid: false, accountName: 'Credit Card', accountType: 'Credit', currentBalance: 1500, minimumPayment: 365 } },
  '2025-02-04': { payment: { amount: 107, isPaid: false, accountName: 'Utilities', accountType: 'Bill', currentBalance: 107, minimumPayment: 107 } },
  '2025-02-05': { paycheck: { amount: 2500, frequency: 'biweekly' } },
  '2025-02-08': { payment: { amount: 101, isPaid: false, accountName: 'Internet', accountType: 'Bill', currentBalance: 101, minimumPayment: 101 } },
  '2025-02-12': { paycheck: { amount: 2500, frequency: 'biweekly' } },
};

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const formatAmount = (amount: number): string => {
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}k`;
  }
  return `$${amount}`;
};

const MonthlyCalendar: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<{ date: string; data: DayData } | null>(null);
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const renderMonth = (monthOffset: number) => {
    const date = new Date(currentYear, currentMonth + monthOffset, 1);
    const month = date.getMonth();
    const year = date.getFullYear();
    const monthName = date.toLocaleString('default', { month: 'long' });
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const isCurrentMonth = monthOffset === 0;
    const isNextMonth = monthOffset === 1;
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayData = sampleCalendarData[dateStr];
      const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      
      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            isToday && styles.todayCell,
            dayData?.payment && !dayData.payment.isPaid && styles.unpaidPaymentCell,
            dayData?.payment && dayData.payment.isPaid && styles.paidPaymentCell,
            dayData?.paycheck && styles.paycheckCell,
          ]}
          onPress={() => dayData && setSelectedDay({ date: dateStr, data: dayData })}
          disabled={!dayData}
        >
          <Text style={[styles.dayText, isToday && styles.todayText]}>{day}</Text>
          {dayData?.payment && (
            <Text style={styles.amountText}>{formatAmount(dayData.payment.amount)}</Text>
          )}
        </TouchableOpacity>
      );
    }
    
    return (
      <View style={styles.monthCard}>
        <View style={styles.monthHeader}>
          <Text style={styles.monthTitle}>{monthName} {year}</Text>
          {isCurrentMonth && (
            <View style={[styles.badge, styles.currentBadge]}>
              <Text style={styles.badgeText}>CURRENT</Text>
            </View>
          )}
          {isNextMonth && (
            <View style={[styles.badge, styles.nextBadge]}>
              <Text style={styles.badgeText}>NEXT</Text>
            </View>
          )}
        </View>
        
        <View style={styles.weekdaysRow}>
          {WEEKDAYS.map((day, index) => (
            <Text key={index} style={styles.weekdayText}>{day}</Text>
          ))}
        </View>
        
        <View style={styles.daysGrid}>
          {days}
        </View>
      </View>
    );
  };

  const renderModal = () => {
    if (!selectedDay) return null;
    
    const { data } = selectedDay;
    const hasPayment = !!data.payment;
    const hasPaycheck = !!data.paycheck;
    
    return (
      <Modal
        visible={!!selectedDay}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedDay(null)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedDay(null)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity activeOpacity={1}>
              {hasPayment && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalTitle}>Payment Details</Text>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Account:</Text>
                    <Text style={styles.modalValue}>{data.payment!.accountName}</Text>
                  </View>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Type:</Text>
                    <Text style={styles.modalValue}>{data.payment!.accountType}</Text>
                  </View>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Current Balance:</Text>
                    <Text style={styles.modalValue}>${data.payment!.currentBalance.toLocaleString()}</Text>
                  </View>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Minimum Payment:</Text>
                    <Text style={styles.modalValue}>${data.payment!.minimumPayment.toLocaleString()}</Text>
                  </View>
                  
                  <View style={styles.modalButtons}>
                    <TouchableOpacity style={styles.modalButton}>
                      <Text style={styles.modalButtonText}>EDIT ACCOUNT</Text>
                    </TouchableOpacity>
                    {!data.payment!.isPaid && (
                      <TouchableOpacity style={[styles.modalButton, styles.modalButtonPrimary]}>
                        <Text style={styles.modalButtonText}>MARK AS PAID</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
              
              {hasPaycheck && (
                <View style={[styles.modalSection, hasPayment && styles.modalSectionBorder]}>
                  <Text style={styles.modalTitle}>Paycheck Details</Text>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Expected Amount:</Text>
                    <Text style={[styles.modalValue, { color: colors.green }]}>
                      ${data.paycheck!.amount.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Frequency:</Text>
                    <Text style={styles.modalValue}>
                      {data.paycheck!.frequency.charAt(0).toUpperCase() + data.paycheck!.frequency.slice(1)}
                    </Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Monthly Accounts Calendar</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Paycheck Day</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        pagingEnabled
      >
        {renderMonth(0)}
        {renderMonth(1)}
      </ScrollView>
      
      {renderModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 24,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: 'rgba(42, 42, 42, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.3)',
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  monthCard: {
    backgroundColor: 'rgba(42, 42, 42, 0.4)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.1)',
    padding: 16,
    marginRight: 16,
    width: 360,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentBadge: {
    backgroundColor: '#4A90E2',
  },
  nextBadge: {
    backgroundColor: '#00FF88',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekdayText: {
    fontSize: 12,
    color: '#888',
    width: '14.28%',
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
    borderRadius: 8,
  },
  todayCell: {
    backgroundColor: '#1976D2',
  },
  unpaidPaymentCell: {
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  paidPaymentCell: {
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  paycheckCell: {
    borderWidth: 1,
    borderColor: '#00FF88',
    backgroundColor: 'rgba(0, 255, 136, 0.05)',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  todayText: {
    fontWeight: 'bold',
  },
  amountText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1A2332',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.2)',
  },
  modalSection: {
    marginBottom: 16,
  },
  modalSectionBorder: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalLabel: {
    fontSize: 14,
    color: colors.subtextGray,
  },
  modalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.3)',
  },
  modalButtonPrimary: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  modalButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
});

export default MonthlyCalendar;
