# タスク管理アプリ

カレンダー、ToDoリスト、ポモドーロタイマーを組み合わせたタスク管理アプリです。

## 機能

- **カレンダー画面**: 日付を選択してその日のタスクを管理
- **ToDoリスト画面**: 選択した日付のタスクを表示・追加・完了管理
- **ポモドーロタイマー**: 25分のタイマーでタスクに集中
- **通知設定**: 毎日指定した時間にタスクのリマインダー通知

## 技術スタック

- **フレームワーク**: Expo SDK 52
- **言語**: TypeScript/JavaScript
- **ルーティング**: expo-router (ファイルベースルーティング)
- **スタイリング**: NativeWind (Tailwind CSS)
- **データ永続化**: AsyncStorage
- **カレンダー**: react-native-calendars
- **通知**: expo-notifications
- **音声**: expo-av

## セットアップ

1. 依存関係のインストール:
```bash
npm install
```

2. アプリの起動:
```bash
npm start
```

3. 開発用アプリで実行:
- iOS: Expo Goアプリでスキャン
- Android: Expo Goアプリでスキャン
- Web: `w`キーを押す

## ファイル構造

```
/app
  - _layout.tsx              # 全体のレイアウト設定
  - index.tsx                # カレンダー画面
  - todolist/[date].tsx      # ToDoリスト画面
  - timer/[taskId].tsx       # タイマー画面
  - settings.tsx             # 設定画面
/components
  - TaskItem.tsx             # タスク項目コンポーネント
  - FloatingButton.tsx       # フローティングボタン
```

## 使い方

1. カレンダー画面で日付をタップ
2. ToDoリスト画面でタスクを追加
3. タスクをタップしてタイマー画面へ
4. 設定画面で通知時間を設定

## 注意事項

- 通知機能を使用するには、アプリに通知の許可を与える必要があります
- タイマーのアラーム音を鳴らすには、`assets/alarm.mp3`に音声ファイルを配置してください