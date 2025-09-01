import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

interface Task {
  id: string;
  title: string;
  date: string;
  isCompleted: boolean;
}

export default function TimerScreen() {
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [seconds, setSeconds] = useState(25 * 60); // 25分
  const [isRunning, setIsRunning] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // タスク情報の読み込み
  useEffect(() => {
    loadTask();
  }, [taskId]);

  // タイマーの処理
  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev - 1);
      }, 1000);
    } else if (seconds === 0 && isRunning) {
      handleTimerComplete();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, seconds]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const loadTask = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        const allTasks = JSON.parse(storedTasks);
        const foundTask = allTasks.find((t: Task) => t.id === taskId);
        setTask(foundTask || null);
      }
    } catch (error) {
      console.error('タスクの読み込みエラー:', error);
    }
  };

  const handleTimerComplete = async () => {
    setIsRunning(false);
    await playAlarmSound();
    Alert.alert('完了！', 'ポモドーロタイマーが終了しました！');
  };

  const playAlarmSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/alarm.mp3'),
        { shouldPlay: true }
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.log('アラーム音の再生エラー:', error);
      // アラーム音ファイルがない場合はエラーを無視
    }
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(25 * 60);
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!task) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-500">タスクが見つかりません</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gradient-to-b from-indigo-50 to-white">
      {/* タスクタイトル */}
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-2xl font-bold text-gray-800 mb-8 text-center">
          {task.title}
        </Text>

        {/* タイマー表示 */}
        <View className="bg-white rounded-full w-64 h-64 justify-center items-center shadow-lg mb-12">
          <Text className="text-6xl font-bold text-indigo-600">
            {formatTime(seconds)}
          </Text>
        </View>

        {/* コントロールボタン */}
        <View className="flex-row space-x-4">
          {!isRunning ? (
            <TouchableOpacity
              onPress={handleStart}
              className="bg-green-500 px-8 py-4 rounded-full flex-row items-center"
            >
              <Ionicons name="play" size={24} color="white" />
              <Text className="text-white font-semibold text-lg ml-2">スタート</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleStop}
              className="bg-red-500 px-8 py-4 rounded-full flex-row items-center"
            >
              <Ionicons name="pause" size={24} color="white" />
              <Text className="text-white font-semibold text-lg ml-2">ストップ</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleReset}
            className="bg-gray-500 px-8 py-4 rounded-full flex-row items-center"
          >
            <Ionicons name="refresh" size={24} color="white" />
            <Text className="text-white font-semibold text-lg ml-2">リセット</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}