import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import FloatingButton from '../../components/FloatingButton';
import TaskItem from '../../components/TaskItem';

interface Task {
  id: string;
  title: string;
  date: string;
  isCompleted: boolean;
}

export default function TodoListScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // 日付のフォーマット
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${year}年${parseInt(month)}月${parseInt(day)}日のタスク`;
  };

  // 今日かどうかをチェック
  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  // タスクの読み込み
  useEffect(() => {
    loadTasks();
  }, [date]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        const allTasks = JSON.parse(storedTasks);
        const dateTasks = allTasks.filter((task: Task) => task.date === date);
        setTasks(dateTasks);
      }
    } catch (error) {
      console.error('タスクの読み込みエラー:', error);
    }
  };

  // タスクの保存
  const saveTasks = async (updatedTasks: Task[]) => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      let allTasks = storedTasks ? JSON.parse(storedTasks) : [];
      
      // 現在の日付以外のタスクを保持
      allTasks = allTasks.filter((task: Task) => task.date !== date);
      
      // 更新されたタスクを追加
      allTasks = [...allTasks, ...updatedTasks];
      
      await AsyncStorage.setItem('tasks', JSON.stringify(allTasks));
      setTasks(updatedTasks);
    } catch (error) {
      console.error('タスクの保存エラー:', error);
    }
  };

  // タスクの追加
  const addTask = () => {
    if (newTaskTitle.trim() === '') {
      Alert.alert('エラー', 'タスクのタイトルを入力してください');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      date: date,
      isCompleted: false
    };

    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);
    setNewTaskTitle('');
    setModalVisible(false);
  };

  // タスクの完了状態を切り替え
  const toggleTaskCompletion = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    );
    saveTasks(updatedTasks);
  };

  // タイマー画面への遷移
  const navigateToTimer = (taskId: string) => {
    router.push(`/timer/${taskId}`);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* 日付表示 */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <Text className="text-lg font-bold text-gray-800">
          {formatDate(date)}
        </Text>
      </View>

      {/* タスクリスト */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            showCheckbox={isToday(date)}
            onToggleComplete={() => toggleTaskCompletion(item.id)}
            onPress={() => navigateToTimer(item.id)}
          />
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500 text-base">タスクがありません</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* フローティングボタン */}
      <FloatingButton onPress={() => setModalVisible(true)} />

      {/* タスク追加モーダル */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg p-6 w-11/12 max-w-md">
            <Text className="text-xl font-bold mb-4">新しいタスクを追加</Text>
            
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
              placeholder="タスクのタイトル"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              autoFocus
            />

            <View className="flex-row justify-end space-x-3">
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setNewTaskTitle('');
                }}
                className="px-4 py-2 rounded-lg bg-gray-200"
              >
                <Text className="text-gray-700">キャンセル</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={addTask}
                className="px-4 py-2 rounded-lg bg-indigo-600"
              >
                <Text className="text-white font-semibold">追加</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}