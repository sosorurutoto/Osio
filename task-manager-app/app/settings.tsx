import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Platform, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

// 通知ハンドラーの設定
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function SettingsScreen() {
  const [notificationTime, setNotificationTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    loadSettings();
    checkNotificationPermissions();
  }, []);

  const loadSettings = async () => {
    try {
      const savedTime = await AsyncStorage.getItem('notificationTime');
      const savedEnabled = await AsyncStorage.getItem('notificationsEnabled');
      
      if (savedTime) {
        setNotificationTime(new Date(savedTime));
      } else {
        // デフォルトは朝9時
        const defaultTime = new Date();
        defaultTime.setHours(9, 0, 0, 0);
        setNotificationTime(defaultTime);
      }
      
      if (savedEnabled) {
        setNotificationsEnabled(savedEnabled === 'true');
      }
    } catch (error) {
      console.error('設定の読み込みエラー:', error);
    }
  };

  const checkNotificationPermissions = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      Alert.alert('通知の許可', '通知を有効にするには、設定から許可してください。');
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('notificationTime', notificationTime.toISOString());
      await AsyncStorage.setItem('notificationsEnabled', notificationsEnabled.toString());
      
      if (notificationsEnabled) {
        await scheduleNotification();
        Alert.alert('設定を保存しました', `毎日${formatTime(notificationTime)}に通知します。`);
      } else {
        await Notifications.cancelAllScheduledNotificationsAsync();
        Alert.alert('設定を保存しました', '通知を無効にしました。');
      }
    } catch (error) {
      console.error('設定の保存エラー:', error);
      Alert.alert('エラー', '設定の保存に失敗しました。');
    }
  };

  const scheduleNotification = async () => {
    // すべての既存の通知をキャンセル
    await Notifications.cancelAllScheduledNotificationsAsync();

    // 新しい通知をスケジュール
    const trigger = {
      hour: notificationTime.getHours(),
      minute: notificationTime.getMinutes(),
      repeats: true,
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '今日のタスク',
        body: '今日のタスクがあります！確認してください。',
        sound: true,
      },
      trigger,
    });
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setNotificationTime(selectedDate);
    }
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white m-4 rounded-lg shadow-sm">
        {/* 通知設定セクション */}
        <View className="p-4 border-b border-gray-200">
          <Text className="text-lg font-bold text-gray-800 mb-4">通知設定</Text>
          
          {/* 通知の有効/無効切り替え */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-base text-gray-700">毎日の通知</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#767577', true: '#4F46E5' }}
              thumbColor={notificationsEnabled ? '#ffffff' : '#f4f3f4'}
            />
          </View>

          {/* 通知時間設定 */}
          {notificationsEnabled && (
            <View>
              <Text className="text-sm text-gray-600 mb-2">通知時間</Text>
              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                className="bg-gray-100 p-3 rounded-lg flex-row justify-between items-center"
              >
                <Text className="text-base text-gray-800">
                  {formatTime(notificationTime)}
                </Text>
                <Ionicons name="time-outline" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 保存ボタン */}
        <TouchableOpacity
          onPress={saveSettings}
          className="bg-indigo-600 m-4 p-3 rounded-lg"
        >
          <Text className="text-white text-center font-semibold text-base">
            設定を保存
          </Text>
        </TouchableOpacity>
      </View>

      {/* タイムピッカー */}
      {showTimePicker && (
        <DateTimePicker
          value={notificationTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {/* アプリ情報 */}
      <View className="bg-white m-4 mt-0 rounded-lg shadow-sm p-4">
        <Text className="text-lg font-bold text-gray-800 mb-2">アプリ情報</Text>
        <Text className="text-sm text-gray-600">バージョン: 1.0.0</Text>
        <Text className="text-sm text-gray-600 mt-1">
          カレンダー、ToDoリスト、ポモドーロタイマーを組み合わせたタスク管理アプリ
        </Text>
      </View>
    </View>
  );
}