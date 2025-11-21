
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/styles/commonStyles';

interface CalendarDay {
  day: number;
  isToday: boolean;
  hasPayment?: boolean;
  paymentAmount?: string;
  isPaid?: boolean;
  hasPaycheck?: boolean;
}

export default function MonthlyCalendar() {
  const [currentMonth] = useState(new Date());
  const [nextMonth] = useState(new Date(new Date().setMonth(new Date().getMonth() + 1)));

  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

    const days: CalendarDay[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push({ day: 0, isToday: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isToday: isCurrentMonth && day === today.getDate(),
      });
    }

    return days;
  };

  const renderMonth = (date: Date, isCurrent: boolean) => {
    const days = getDaysInMonth(date);
    const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
      <View style={styles.monthCard}>
        <View style={styles.monthHeader}>
          <Text style={styles.monthTitle}>{monthName}</Text>
          <View style={[styles.badge, isCurrent ? styles.currentBadge : styles.nextBadge]}>
            <Text style={styles.badgeText}>{isCurrent ? 'CURRENT' : 'NEXT'}</Text>
          </View>
        </View>

        <View style={styles.weekDaysRow}>
          {weekDays.map((day, index) => (
            <Text key={index} style={styles.weekDay}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.daysGrid}>
          {days.map((dayData, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                dayData.isToday && styles.todayCell,
              ]}
              disabled={dayData.day === 0}
            >
              {dayData.day > 0 && (
                <Text style={[styles.dayText, dayData.isToday && styles.todayText]}>
                  {dayData.day}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Payment Calendar</Text>
      {renderMonth(currentMonth, true)}
      {renderMonth(nextMonth, false)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  monthCard: {
    width: '100%',
    backgroundColor: 'rgba(42, 42, 42, 0.4)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.1)',
    padding: 16,
    marginBottom: 16,
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
    backgroundColor: colors.green,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
    textTransform: 'uppercase',
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  weekDay: {
    width: 40,
    textAlign: 'center',
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  todayCell: {
    backgroundColor: '#1976D2',
    borderRadius: 8,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  todayText: {
    fontWeight: '700',
  },
});
