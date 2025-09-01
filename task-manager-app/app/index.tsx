import React from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 日本語設定
LocaleConfig.locales['jp'] = {
  monthNames: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
  monthNamesShort: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
  dayNames: ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'],
  dayNamesShort: ['日','月','火','水','木','金','土'],
  today: '今日'
};
LocaleConfig.defaultLocale = 'jp';

export default function CalendarScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleDayPress = (day: any) => {
    // 日付をパラメータとしてToDoリスト画面へ遷移
    router.push(`/todolist/${day.dateString}`);
  };

  const handleSettingsPress = () => {
    router.push('/settings');
  };

  return (
    <View className="flex-1 bg-white">
      {/* 設定ボタン */}
      <TouchableOpacity
        onPress={handleSettingsPress}
        className="absolute top-2 right-4 z-10 p-2"
        style={{ top: insets.top + 10 }}
      >
        <Ionicons name="settings-outline" size={24} color="#4F46E5" />
      </TouchableOpacity>

      {/* カレンダー */}
      <View className="flex-1 pt-12">
        <Calendar
          onDayPress={handleDayPress}
          markedDates={{
            [new Date().toISOString().split('T')[0]]: {
              selected: true,
              selectedColor: '#4F46E5'
            }
          }}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#4F46E5',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#4F46E5',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#4F46E5',
            selectedDotColor: '#ffffff',
            arrowColor: '#4F46E5',
            monthTextColor: '#4F46E5',
            indicatorColor: '#4F46E5',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 16
          }}
        />
      </View>
    </View>
  );
}