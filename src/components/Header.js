/**
 * BIT240252_FoodManager
 * Component: Header
 * 
 * Hiển thị rõ ràng MSSV: BIT240252, tên dự án, nút chuyển đổi ngôn ngữ EN/VI,
 * và thanh chuyển đổi chế độ Trực tuyến/Ngoại tuyến (Demo Offline Sync).
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';
import { STUDENT_INFO } from '../constants/MSSV';

export const Header = ({ onOpenCategories, onAddNewDish }) => {
  const { language, setLanguage, t, isOnline, toggleSimulatedOffline, isSyncing, pendingSyncCount } = useApp();

  return (
    <View style={styles.container}>
      {/* Top Bar: MSSV & Project Title */}
      <View style={styles.topRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.mssvBadge}>{STUDENT_INFO.MSSV}</Text>
          <View>
            <Text style={styles.projectTitle}>{STUDENT_INFO.PROJECT_NAME}</Text>
            <Text style={styles.subTitle}>{t('appName')}</Text>
          </View>
        </View>

        {/* Right side controls: Language switcher & Category Manager */}
        <View style={styles.controlsRow}>
          {/* Category Management Button */}
          {onOpenCategories && (
            <TouchableOpacity
              style={styles.categoryBtn}
              onPress={onOpenCategories}
              accessibilityLabel="Manage Categories"
            >
              <Text style={styles.categoryBtnText}>🏷️ {t('categoryManager')}</Text>
            </TouchableOpacity>
          )}

          {/* Language Switcher */}
          <View style={styles.langSwitchContainer}>
            <TouchableOpacity
              style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
              onPress={() => setLanguage('en')}
            >
              <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>EN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.langBtn, language === 'vi' && styles.langBtnActive]}
              onPress={() => setLanguage('vi')}
            >
              <Text style={[styles.langText, language === 'vi' && styles.langTextActive]}>VI</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Network & Offline Simulation Bar */}
      <View style={styles.statusBar}>
        <View style={styles.networkStatusContainer}>
          <View
            style={[
              styles.networkDot,
              { backgroundColor: isOnline ? COLORS.accent : COLORS.danger },
            ]}
          />
          <Text style={styles.networkText}>
            {t('networkStatus')}:{' '}
            <Text style={{ fontWeight: 'bold', color: isOnline ? COLORS.accent : COLORS.danger }}>
              {isOnline ? t('online') : t('offline')}
            </Text>
          </Text>

          {pendingSyncCount > 0 && (
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>
                {pendingSyncCount} {t('pendingSync')}
              </Text>
            </View>
          )}

          {isSyncing && (
            <View style={styles.syncingBadge}>
              <Text style={styles.syncingBadgeText}>🔄 {t('syncing')}</Text>
            </View>
          )}
        </View>

        {/* Toggle Simulated Offline for Demo */}
        <TouchableOpacity
          style={[
            styles.offlineToggleBtn,
            !isOnline && styles.offlineToggleBtnActive,
          ]}
          onPress={() => toggleSimulatedOffline(isOnline)}
        >
          <Text
            style={[
              styles.offlineToggleText,
              !isOnline && styles.offlineToggleTextActive,
            ]}
          >
            {isOnline ? `⚡ ${t('simulateOffline')}` : `🌐 Go Online`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondaryLight,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
    gap: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mssvBadge: {
    backgroundColor: COLORS.primary,
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
    letterSpacing: 0.5,
  },
  projectTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  subTitle: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBtn: {
    backgroundColor: COLORS.secondaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryBtnText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
  langSwitchContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 6,
    padding: 2,
    borderWidth: 1,
    borderColor: '#334155',
  },
  langBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  langBtnActive: {
    backgroundColor: COLORS.primary,
  },
  langText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
  langTextActive: {
    color: '#FFFFFF',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 4,
  },
  networkStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  networkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  networkText: {
    color: '#CBD5E1',
    fontSize: 12,
  },
  pendingBadge: {
    backgroundColor: '#78350F',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pendingBadgeText: {
    color: '#FDE68A',
    fontSize: 11,
    fontWeight: '600',
  },
  syncingBadge: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  syncingBadgeText: {
    color: '#93C5FD',
    fontSize: 11,
    fontWeight: '600',
  },
  offlineToggleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#475569',
    backgroundColor: '#334155',
  },
  offlineToggleBtnActive: {
    backgroundColor: COLORS.danger,
    borderColor: COLORS.danger,
  },
  offlineToggleText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
  },
  offlineToggleTextActive: {
    color: '#FFFFFF',
  },
});
