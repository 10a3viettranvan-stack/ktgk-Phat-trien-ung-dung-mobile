/**
 * BIT240252_FoodManager
 * Main Application Component
 * 
 * Mã sinh viên: BIT240252
 * Đề tài: Quản lý món ăn
 * Công nghệ: React Native + AsyncStorage + MockAPI Offline-First Auto Sync
 */

import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { AppProvider } from './src/context/AppContext';
import { Header } from './src/components/Header';
import { SyncStatusBanner } from './src/components/SyncStatusBanner';
import { DishListScreen } from './src/screens/DishListScreen';
import { DishDetailScreen } from './src/screens/DishDetailScreen';
import { DishFormScreen } from './src/screens/DishFormScreen';
import { CategoryManagerScreen } from './src/screens/CategoryManagerScreen';
import { COLORS } from './src/constants/colors';

const MainNavigator = () => {
  // Navigation stack state: 'list' | 'detail' | 'create' | 'edit' | 'categories'
  const [currentScreen, setCurrentScreen] = useState('list');
  const [selectedDishId, setSelectedDishId] = useState(null);
  const [editingDish, setEditingDish] = useState(null);

  // Chuyển màn hình
  const goToList = () => {
    setCurrentScreen('list');
    setEditingDish(null);
  };

  const goToDetail = (dish) => {
    setSelectedDishId(dish.BIT240252_Id);
    setCurrentScreen('detail');
  };

  const goToCreate = () => {
    setEditingDish(null);
    setCurrentScreen('create');
  };

  const goToEdit = (dish) => {
    setEditingDish(dish);
    setCurrentScreen('edit');
  };

  const goToCategories = () => {
    setCurrentScreen('categories');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />

      {/* Header cố định chứa MSSV BIT240252, chuyển ngôn ngữ, nút giả lập Offline */}
      <Header
        onOpenCategories={currentScreen !== 'categories' ? goToCategories : null}
        onAddNewDish={goToCreate}
      />

      {/* Banner thông báo trạng thái đồng bộ và mạng */}
      <SyncStatusBanner />

      {/* Màn hình hiển thị theo trạng thái điều hướng */}
      <View style={styles.content}>
        {currentScreen === 'list' && (
          <DishListScreen
            onSelectDish={goToDetail}
            onAddDish={goToCreate}
            onEditDish={goToEdit}
          />
        )}

        {currentScreen === 'detail' && (
          <DishDetailScreen
            dishId={selectedDishId}
            onBack={goToList}
            onEdit={goToEdit}
          />
        )}

        {currentScreen === 'create' && (
          <DishFormScreen
            initialDish={null}
            onCancel={goToList}
            onSuccess={goToList}
          />
        )}

        {currentScreen === 'edit' && (
          <DishFormScreen
            initialDish={editingDish}
            onCancel={() => {
              if (selectedDishId) {
                setCurrentScreen('detail');
              } else {
                goToList();
              }
            }}
            onSuccess={() => {
              if (selectedDishId) {
                setCurrentScreen('detail');
              } else {
                goToList();
              }
            }}
          />
        )}

        {currentScreen === 'categories' && (
          <CategoryManagerScreen onBack={goToList} />
        )}
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainNavigator />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
