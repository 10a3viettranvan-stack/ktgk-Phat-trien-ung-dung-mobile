/**
 * BIT240252_FoodManager
 * Main Application Component
 * 
 * Mã sinh viên: BIT240252
 * Đề tài: Quản lý món ăn
 * Công nghệ: React Native + AsyncStorage + MockAPI Offline-First Auto Sync
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { AppProvider, useApp } from './src/context/AppContext';
import { Header } from './src/components/Header';
import { SyncStatusBanner } from './src/components/SyncStatusBanner';
import { DishListScreen } from './src/screens/DishListScreen';
import { DishDetailScreen } from './src/screens/DishDetailScreen';
import { DishFormScreen } from './src/screens/DishFormScreen';
import { CategoryManagerScreen } from './src/screens/CategoryManagerScreen';
import { COLORS } from './src/constants/colors';
import { STUDENT_INFO } from './src/constants/MSSV';

const MainNavigator = () => {
  // Navigation stack state: 'list' | 'detail' | 'create' | 'edit' | 'categories'
  const [currentScreen, setCurrentScreen] = useState('list');
  const [selectedDishId, setSelectedDishId] = useState(null);
  const [editingDish, setEditingDish] = useState(null);

  const { isOnline, toggleSimulatedOffline, isSyncing, pendingSyncCount, t } = useApp();

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
    <View style={styles.outerCanvas}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />

      {/* Frame mô phỏng điện thoại di động ở giữa màn hình (như ảnh chụp mẫu) */}
      <View style={styles.mobileShell}>
        {/* Top Mini Bar thể hiện rõ MSSV BIT240252 & nút Offline toggle */}
        <View style={styles.topIdentityBar}>
          <View style={styles.identityLeft}>
            <Text style={styles.identityMssvBadge}>{STUDENT_INFO.MSSV}</Text>
            <Text style={styles.identityTitle}>{STUDENT_INFO.PROJECT_NAME}</Text>
          </View>

          <View style={styles.identityRight}>
            <TouchableOpacity
              style={[
                styles.identityOfflineBtn,
                !isOnline && styles.identityOfflineBtnActive,
              ]}
              onPress={() => toggleSimulatedOffline(isOnline)}
            >
              <Text
                style={[
                  styles.identityOfflineBtnText,
                  !isOnline && styles.identityOfflineBtnTextActive,
                ]}
              >
                {isOnline ? '🟢 Online' : '🔴 Offline'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Header chính: hiển thị ở màn hình List và Categories */}
        {currentScreen !== 'detail' && (
          <Header
            onOpenCategories={currentScreen !== 'categories' ? goToCategories : null}
            onAddNewDish={goToCreate}
          />
        )}

        {/* Banner thông báo trạng thái đồng bộ và mạng */}
        <SyncStatusBanner />

        {/* Nội dung màn hình theo trạng thái điều hướng */}
        <View style={styles.screenContent}>
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
      </View>
    </View>
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
  outerCanvas: {
    flex: 1,
    backgroundColor: '#0B0F19', // Dark canvas background as seen in user's screenshot
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileShell: {
    width: '100%',
    maxWidth: 440, // Standard modern mobile width
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: Platform.OS === 'web' ? 24 : 0,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 25,
    elevation: 10,
    borderWidth: Platform.OS === 'web' ? 1 : 0,
    borderColor: '#1E293B',
  },
  topIdentityBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0B0F19',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  identityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  identityMssvBadge: {
    backgroundColor: '#EA580C',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  identityTitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  identityRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  identityOfflineBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  identityOfflineBtnActive: {
    backgroundColor: '#EF4444',
    borderColor: '#DC2626',
  },
  identityOfflineBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  identityOfflineBtnTextActive: {
    color: '#FFFFFF',
  },
  screenContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
