/**
 * BIT240252_FoodManager
 * Component: SyncStatusBanner
 * 
 * Hiển thị thông báo trạng thái ngoại tuyến / đồng bộ tự động
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';

export const SyncStatusBanner = () => {
  const { isOnline, isSyncing, pendingSyncCount, t } = useApp();

  if (isOnline && !isSyncing && pendingSyncCount === 0) {
    return null;
  }

  return (
    <View
      style={[
        styles.banner,
        !isOnline ? styles.bannerOffline : isSyncing ? styles.bannerSyncing : styles.bannerPending,
      ]}
    >
      <Text style={styles.bannerText}>
        {!isOnline
          ? `⚠️ ${t('offlineNotice')}`
          : isSyncing
          ? `🔄 ${t('syncing')}`
          : `⏳ ${pendingSyncCount} ${t('pendingSync')}. Auto-syncing...`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  bannerOffline: {
    backgroundColor: '#FEF3C7',
    borderBottomColor: '#FDE68A',
  },
  bannerSyncing: {
    backgroundColor: '#DBEAFE',
    borderBottomColor: '#BFDBFE',
  },
  bannerPending: {
    backgroundColor: '#FFEDD5',
    borderBottomColor: '#FED7AA',
  },
  bannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
});
