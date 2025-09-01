import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    date: string;
    isCompleted: boolean;
  };
  showCheckbox: boolean;
  onToggleComplete: () => void;
  onPress: () => void;
}

export default function TaskItem({ task, showCheckbox, onToggleComplete, onPress }: TaskItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white mx-4 my-2 p-4 rounded-lg shadow-sm flex-row items-center"
      activeOpacity={0.7}
    >
      {/* チェックボックス（今日のタスクのみ表示） */}
      {showCheckbox && (
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onToggleComplete();
          }}
          className="mr-3"
        >
          <View className={`w-6 h-6 rounded border-2 ${
            task.isCompleted 
              ? 'bg-indigo-600 border-indigo-600' 
              : 'bg-white border-gray-300'
          } justify-center items-center`}>
            {task.isCompleted && (
              <Ionicons name="checkmark" size={16} color="white" />
            )}
          </View>
        </TouchableOpacity>
      )}

      {/* タスクタイトル */}
      <View className="flex-1">
        <Text className={`text-base ${
          task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'
        }`}>
          {task.title}
        </Text>
      </View>

      {/* 右矢印アイコン */}
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
}