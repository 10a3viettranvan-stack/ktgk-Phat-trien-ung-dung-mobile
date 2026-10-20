/**
 * BIT240252_FoodManager
 * Component: DishCard
 * 
 * Hiển thị thẻ món ăn trong danh sách:
 * - Ảnh đại diện (thumbnail)
 * - Tên món, loại món
 * - Giá bán định dạng VND
 * - Nhãn phân loại: "Quick / Nhanh" (≤ 15 phút) hoặc "Regular / Thông thường" (> 15 phút)
 * - Trạng thái bán: "Available / Đang bán" hoặc "Unavailable / Ngừng bán"
 * - Trạng thái đồng bộ offline (nếu có)
 * - Nút: Xem chi tiết, Sửa, Xóa
 */

import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';
import { FIELDS } from '../constants/MSSV';
import { DishModel } from '../models/DishModel';

export const DishCard = ({ dish, onSelect, onEdit, onDelete }) => {
  const { categories, t } = useApp();
  const [imageError, setImageError] = useState(false);

  const id = dish[FIELDS.DISH_ID];
  const name = dish[FIELDS.DISH_NAME];
  const price = dish[FIELDS.DISH_PRICE];
  const prepTime = dish[FIELDS.DISH_PREPARATION_TIME];
  const isAvailable = dish[FIELDS.DISH_IS_AVAILABLE];
  const categoryId = dish[FIELDS.DISH_CATEGORY_ID];
  const syncStatus = dish[FIELDS.SYNC_STATUS];

  // Lấy tên loại món
  const category = categories.find((c) => String(c[FIELDS.CATEGORY_ID]) === String(categoryId));
  const categoryName = category ? category[FIELDS.CATEGORY_NAME] : '---';

  // Lấy URL ảnh đại diện
  const thumbnailUrl = DishModel.getThumbnailUrl(dish);

  // Phân loại Quick / Regular
  const isQuick = DishModel.isQuickDish(dish);

  // Định dạng giá tiền
  const formattedPrice = new Intl.NumberFormat('vi-VN').format(price);

  return (
    <TouchableOpacity
      style={[styles.card, !isAvailable && styles.cardUnavailable]}
      activeOpacity={0.85}
      onPress={() => onSelect(dish)}
    >
      {/* Thumbnail Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              imageError || !thumbnailUrl
                ? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
                : thumbnailUrl,
          }}
          style={styles.thumbnail}
          onError={() => setImageError(true)}
          resizeMode="cover"
        />

        {/* Quick / Regular Badge */}
        <View style={[styles.badgeTopLeft, isQuick ? styles.badgeQuick : styles.badgeRegular]}>
          <Text style={[styles.badgeText, isQuick ? styles.badgeTextQuick : styles.badgeTextRegular]}>
            {isQuick ? `⚡ ${t('quickDish')}` : `⏱️ ${t('regularDish')}`}
          </Text>
        </View>

        {/* Availability Badge */}
        <View style={[styles.badgeTopRight, isAvailable ? styles.badgeAvailable : styles.badgeUnavailable]}>
          <Text style={[styles.badgeText, isAvailable ? styles.badgeTextAvailable : styles.badgeTextUnavailable]}>
            {isAvailable ? t('statusAvailable') : t('statusUnavailable')}
          </Text>
        </View>

        {/* Pending Sync Badge */}
        {syncStatus && syncStatus !== 'synced' && (
          <View style={styles.badgeSyncPending}>
            <Text style={styles.badgeSyncPendingText}>💾 Local</Text>
          </View>
        )}
      </View>

      {/* Card Content */}
      <View style={styles.content}>
        {/* Category & Time */}
        <View style={styles.metaRow}>
          <Text style={styles.categoryBadge}>{categoryName}</Text>
          <Text style={styles.timeText}>⏱️ {prepTime} {t('minutes')}</Text>
        </View>

        {/* Dish Name */}
        <Text style={styles.dishName} numberOfLines={2}>
          {name}
        </Text>

        {/* Price & Action Buttons */}
        <View style={styles.bottomRow}>
          <Text style={styles.priceText}>
            {formattedPrice} <Text style={styles.currency}>{t('currency')}</Text>
          </Text>

          <View style={styles.actionsGroup}>
            <TouchableOpacity
              style={styles.actionBtnEdit}
              onPress={(e) => {
                e.stopPropagation();
                onEdit(dish);
              }}
              accessibilityLabel="Edit Dish"
            >
              <Text style={styles.actionBtnEditText}>✏️ {t('edit')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtnDelete}
              onPress={(e) => {
                e.stopPropagation();
                onDelete(dish);
              }}
              accessibilityLabel="Delete Dish"
            >
              <Text style={styles.actionBtnDeleteText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardUnavailable: {
    opacity: 0.82,
    backgroundColor: '#FAFAFA',
  },
  imageContainer: {
    width: '100%',
    height: 170,
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  badgeTopLeft: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeQuick: {
    backgroundColor: COLORS.badgeQuickBg,
  },
  badgeTextQuick: {
    color: COLORS.badgeQuickText,
  },
  badgeRegular: {
    backgroundColor: COLORS.badgeRegularBg,
  },
  badgeTextRegular: {
    color: COLORS.badgeRegularText,
  },
  badgeTopRight: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeAvailable: {
    backgroundColor: COLORS.badgeAvailableBg,
  },
  badgeTextAvailable: {
    color: COLORS.badgeAvailableText,
  },
  badgeUnavailable: {
    backgroundColor: COLORS.badgeUnavailableBg,
  },
  badgeTextUnavailable: {
    color: COLORS.badgeUnavailableText,
  },
  badgeSyncPending: {
    position: 'absolute',
    bottom: 8,
    right: 10,
    backgroundColor: '#92400E',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeSyncPendingText: {
    color: '#FEF3C7',
    fontSize: 10,
    fontWeight: '700',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  content: {
    padding: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  timeText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  dishName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
    lineHeight: 22,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  priceText: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.primary,
  },
  currency: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtnEdit: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionBtnEditText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  actionBtnDelete: {
    backgroundColor: COLORS.dangerLight,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionBtnDeleteText: {
    fontSize: 12,
  },
});
