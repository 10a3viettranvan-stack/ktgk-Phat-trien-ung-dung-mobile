/**
 * BIT240252_FoodManager
 * Screen: DishDetailScreen (Màn hình chi tiết món ăn)
 * 
 * Đáp ứng:
 * 4.1. Xem chi tiết món ăn, liên kết sửa, xóa với xác nhận
 * 4.3. Hiển thị nhiều ảnh ở màn hình chi tiết, cho phép thay đổi ảnh đại diện (thumbnail);
 *      mỗi món có tối đa 01 ảnh IsThumbnail = true.
 *      Hiển thị nhãn Quick/Nhanh (<= 15p) hoặc Regular/Thông thường (> 15p)
 * 4.4. Xử lý hợp lý khi Id không tồn tại, ảnh rỗng
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { COLORS } from '../constants/colors';
import { FIELDS } from '../constants/MSSV';
import { DishModel } from '../models/DishModel';

export const DishDetailScreen = ({ dishId, onBack, onEdit }) => {
  const { dishes, categories, updateDish, deleteDish, t } = useApp();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeImageError, setActiveImageError] = useState(false);

  // Tìm món ăn theo dishId
  const currentDish = dishes.find((d) => String(d[FIELDS.DISH_ID]) === String(dishId));

  // Xử lý trường hợp Id không tồn tại (yêu cầu 4.4)
  if (!currentDish) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundIcon}>⚠️</Text>
        <Text style={styles.notFoundTitle}>{t('dishNotFound')}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>← {t('back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const name = currentDish[FIELDS.DISH_NAME];
  const price = currentDish[FIELDS.DISH_PRICE];
  const prepTime = currentDish[FIELDS.DISH_PREPARATION_TIME];
  const isAvailable = currentDish[FIELDS.DISH_IS_AVAILABLE];
  const description = currentDish[FIELDS.DISH_DESCRIPTION];
  const categoryId = currentDish[FIELDS.DISH_CATEGORY_ID];
  const images = currentDish[FIELDS.DISH_IMAGE] || [];
  const syncStatus = currentDish[FIELDS.SYNC_STATUS];

  const category = categories.find((c) => String(c[FIELDS.CATEGORY_ID]) === String(categoryId));
  const categoryName = category ? category[FIELDS.CATEGORY_NAME] : '---';

  const isQuick = DishModel.isQuickDish(currentDish);
  const formattedPrice = new Intl.NumberFormat('vi-VN').format(price);

  // URL ảnh đang chọn để xem lớn
  const currentSelectedImage = images[selectedImageIndex] || images[0] || null;
  const currentSelectedImageUrl =
    currentSelectedImage?.[FIELDS.IMAGE_URL] ||
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

  // Thao tác: Thay đổi ảnh đại diện (mỗi món tối đa 01 ảnh IsThumbnail = true)
  const handleSetThumbnail = async (targetIndex) => {
    const updatedImages = images.map((img, idx) => ({
      ...img,
      [FIELDS.IS_THUMBNAIL]: idx === targetIndex,
    }));

    await updateDish(dishId, {
      [FIELDS.DISH_IMAGE]: updatedImages,
    });
  };

  const handleDelete = async () => {
    await deleteDish(dishId);
    setShowDeleteModal(false);
    onBack();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Navigation Bar */}
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← {t('back')}</Text>
        </TouchableOpacity>

        <View style={styles.navActions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => onEdit(currentDish)}
          >
            <Text style={styles.editBtnText}>✏️ {t('edit')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => setShowDeleteModal(true)}
          >
            <Text style={styles.deleteBtnText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Image Banner */}
      <View style={styles.mainImageWrapper}>
        <Image
          source={{
            uri: activeImageError
              ? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
              : currentSelectedImageUrl,
          }}
          style={styles.mainImage}
          onError={() => setActiveImageError(true)}
          resizeMode="cover"
        />

        {/* Quick / Regular Badge */}
        <View style={[styles.badgeTopLeft, isQuick ? styles.badgeQuick : styles.badgeRegular]}>
          <Text style={[styles.badgeText, isQuick ? styles.badgeTextQuick : styles.badgeTextRegular]}>
            {isQuick ? `⚡ ${t('quickDish')} (≤ 15 ${t('minUnit')})` : `⏱️ ${t('regularDish')} (> 15 ${t('minUnit')})`}
          </Text>
        </View>

        {/* Availability Badge */}
        <View style={[styles.badgeTopRight, isAvailable ? styles.badgeAvailable : styles.badgeUnavailable]}>
          <Text style={[styles.badgeText, isAvailable ? styles.badgeTextAvailable : styles.badgeTextUnavailable]}>
            {isAvailable ? `🟢 ${t('statusAvailable')}` : `🔴 ${t('statusUnavailable')}`}
          </Text>
        </View>
      </View>

      {/* Multi-Image Gallery & Thumbnail Selector (Yêu cầu 4.3) */}
      <View style={styles.gallerySection}>
        <View style={styles.galleryHeader}>
          <Text style={styles.galleryTitle}>
            📸 {t('imageSection')} ({images.length})
          </Text>
          <Text style={styles.gallerySubtitle}>
            {t('makeThumbnail')}
          </Text>
        </View>

        {images.length === 0 ? (
          <Text style={styles.noImagesText}>{t('noImagesYet')}</Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.galleryScroll}
          >
            {images.map((img, idx) => {
              const isThumb = Boolean(img[FIELDS.IS_THUMBNAIL]);
              const isViewing = idx === selectedImageIndex;

              return (
                <View key={idx} style={styles.thumbnailItem}>
                  <TouchableOpacity
                    style={[
                      styles.galleryThumbWrapper,
                      isViewing && styles.galleryThumbViewing,
                      isThumb && styles.galleryThumbIsThumbnail,
                    ]}
                    onPress={() => {
                      setSelectedImageIndex(idx);
                      setActiveImageError(false);
                    }}
                  >
                    <Image
                      source={{ uri: img[FIELDS.IMAGE_URL] }}
                      style={styles.galleryThumbImg}
                      resizeMode="cover"
                    />
                    {isThumb && (
                      <View style={styles.thumbLabelBadge}>
                        <Text style={styles.thumbLabelText}>⭐ {t('isThumbnailBadge')}</Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Button to set as thumbnail if not already */}
                  {!isThumb && (
                    <TouchableOpacity
                      style={styles.setThumbBtn}
                      onPress={() => handleSetThumbnail(idx)}
                    >
                      <Text style={styles.setThumbBtnText}>Set ⭐</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* Dish Details Card */}
      <View style={styles.detailCard}>
        <View style={styles.categoryRow}>
          <Text style={styles.categoryBadge}>{categoryName}</Text>
          {syncStatus && syncStatus !== 'synced' && (
            <Text style={styles.syncStatusTag}>💾 Local Storage</Text>
          )}
        </View>

        <Text style={styles.dishName}>{name}</Text>

        <View style={styles.pricePrepRow}>
          <View>
            <Text style={styles.infoLabel}>{t('price')}</Text>
            <Text style={styles.priceValue}>
              {formattedPrice} <Text style={styles.currency}>{t('currency')}</Text>
            </Text>
          </View>

          <View style={styles.prepTimeBox}>
            <Text style={styles.infoLabel}>{t('prepTime')}</Text>
            <Text style={styles.prepTimeValue}>
              ⏱️ {prepTime} {t('minutes')}
            </Text>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.divider} />
        <Text style={styles.descriptionHeader}>{t('description')}</Text>
        <Text style={styles.descriptionContent}>
          {description || '(No description provided)'}
        </Text>
      </View>

      <View style={{ height: 40 }} />

      {/* Modal Xác nhận Xóa món */}
      <ConfirmModal
        visible={showDeleteModal}
        title={t('confirmDeleteTitle')}
        message={`${t('confirmDeleteDishMsg')}\n\n• ${name}`}
        confirmText={t('delete')}
        cancelText={t('cancel')}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        isDanger={true}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editBtn: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  deleteBtn: {
    backgroundColor: COLORS.dangerLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteBtnText: {
    fontSize: 14,
  },
  mainImageWrapper: {
    width: '100%',
    height: 260,
    position: 'relative',
    backgroundColor: '#CBD5E1',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  badgeTopLeft: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeQuick: {
    backgroundColor: COLORS.badgeQuickBg,
  },
  badgeTextQuick: {
    color: COLORS.badgeQuickText,
    fontWeight: '700',
    fontSize: 12,
  },
  badgeRegular: {
    backgroundColor: COLORS.badgeRegularBg,
  },
  badgeTextRegular: {
    color: COLORS.badgeRegularText,
    fontWeight: '700',
    fontSize: 12,
  },
  badgeTopRight: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeAvailable: {
    backgroundColor: COLORS.badgeAvailableBg,
  },
  badgeTextAvailable: {
    color: COLORS.badgeAvailableText,
    fontWeight: '700',
    fontSize: 12,
  },
  badgeUnavailable: {
    backgroundColor: COLORS.badgeUnavailableBg,
  },
  badgeTextUnavailable: {
    color: COLORS.badgeUnavailableText,
    fontWeight: '700',
    fontSize: 12,
  },
  gallerySection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  galleryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  gallerySubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  galleryScroll: {
    gap: 12,
    paddingVertical: 4,
  },
  thumbnailItem: {
    alignItems: 'center',
    gap: 4,
  },
  galleryThumbWrapper: {
    width: 76,
    height: 76,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    position: 'relative',
  },
  galleryThumbViewing: {
    borderColor: COLORS.primary,
  },
  galleryThumbIsThumbnail: {
    borderColor: '#F59E0B',
    borderWidth: 2.5,
  },
  galleryThumbImg: {
    width: '100%',
    height: '100%',
  },
  thumbLabelBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(245, 158, 11, 0.92)',
    paddingVertical: 2,
    alignItems: 'center',
  },
  thumbLabelText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  setThumbBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
  },
  setThumbBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },
  noImagesText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
  syncStatusTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400E',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  dishName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 28,
    marginBottom: 16,
  },
  pricePrepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },
  currency: {
    fontSize: 13,
    fontWeight: '600',
  },
  prepTimeBox: {
    alignItems: 'flex-end',
  },
  prepTimeValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 16,
  },
  descriptionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  descriptionContent: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textSecondary,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  notFoundIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  notFoundTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
