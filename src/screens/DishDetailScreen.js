/**
 * BIT240252_FoodManager
 * Screen: DishDetailScreen (Chi tiết món ăn)
 * 
 * Thiết kế giao diện chính xác theo ảnh mẫu:
 * - Top bar: < Quay lại (cam), Tiêu đề "Chi tiết món ăn", Pill chuyển đổi EN/VI
 * - Hero Image: Ảnh đại diện lớn của món ăn
 * - Bộ sưu tập hình ảnh:
 *   + Tiêu đề "Bộ sưu tập hình ảnh (X)" và nút "+ Thêm URL ảnh"
 *   + Mỗi ảnh có: huy hiệu sao cam ⭐, nhãn "Ảnh đại diện" hoặc nút "Đặt làm ảnh đại diện", nút đỏ "✕" xóa ảnh
 * - Card thông tin chi tiết:
 *   + Tên loại món chữ hoa màu cam
 *   + Tên món ăn chữ đậm lớn
 *   + 2 box: Đơn giá (giá tiền cam) và Thời gian chế biến (card xanh pastel Quick/Regular)
 *   + Mô tả chi tiết
 * - Bottom Bar: Nút "🗑 Xóa" (nền hồng nhạt chữ đỏ) và "✏️ Chỉnh sửa" (nền cam chữ trắng)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { COLORS } from '../constants/colors';
import { FIELDS } from '../constants/MSSV';
import { DishModel } from '../models/DishModel';

const SAMPLE_FOOD_IMAGES = [
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
];

export const DishDetailScreen = ({ dishId, onBack, onEdit }) => {
  const { dishes, categories, updateDish, deleteDish, language, setLanguage, t } = useApp();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddImageModal, setShowAddImageModal] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [activeImageError, setActiveImageError] = useState(false);

  // Tìm món ăn theo dishId
  const currentDish = dishes.find((d) => String(d[FIELDS.DISH_ID]) === String(dishId));

  if (!currentDish) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundIcon}>⚠️</Text>
        <Text style={styles.notFoundTitle}>{t('dishNotFound')}</Text>
        <TouchableOpacity style={styles.backBtnFallback} onPress={onBack}>
          <Text style={styles.backBtnFallbackText}>{t('back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const name = currentDish[FIELDS.DISH_NAME];
  const price = currentDish[FIELDS.DISH_PRICE];
  const prepTime = currentDish[FIELDS.DISH_PREPARATION_TIME];
  const description = currentDish[FIELDS.DISH_DESCRIPTION];
  const categoryId = currentDish[FIELDS.DISH_CATEGORY_ID];
  const images = currentDish[FIELDS.DISH_IMAGE] || [];

  const category = categories.find((c) => String(c[FIELDS.CATEGORY_ID]) === String(categoryId));
  const categoryName = category ? category[FIELDS.CATEGORY_NAME] : '';

  const isQuick = DishModel.isQuickDish(currentDish);
  const formattedPrice = new Intl.NumberFormat('vi-VN').format(price);

  // Ảnh được chọn để hiển thị hero
  const activeImage = images[selectedImageIndex] || images[0] || null;
  const activeImageUrl =
    activeImage?.[FIELDS.IMAGE_URL] ||
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

  // Đặt ảnh làm thumbnail (Ảnh đại diện)
  const handleSetThumbnail = async (targetIndex) => {
    const updatedImages = images.map((img, idx) => ({
      ...img,
      [FIELDS.IS_THUMBNAIL]: idx === targetIndex,
    }));

    await updateDish(dishId, {
      [FIELDS.DISH_IMAGE]: updatedImages,
    });
  };

  // Xóa ảnh khỏi bộ sưu tập
  const handleRemoveImage = async (targetIndex) => {
    if (images.length <= 1) {
      Alert.alert('Notice', 'Món ăn cần giữ lại ít nhất 01 hình ảnh.');
      return;
    }

    const wasThumbnail = images[targetIndex]?.[FIELDS.IS_THUMBNAIL];
    const filtered = images.filter((_, idx) => idx !== targetIndex);

    // Nếu vừa xóa thumbnail, chuyển thumbnail sang ảnh đầu tiên còn lại
    if (wasThumbnail && filtered.length > 0) {
      filtered[0][FIELDS.IS_THUMBNAIL] = true;
    }

    if (selectedImageIndex >= filtered.length) {
      setSelectedImageIndex(0);
    }

    await updateDish(dishId, {
      [FIELDS.DISH_IMAGE]: filtered,
    });
  };

  // Thêm ảnh mới qua URL
  const handleAddImageSubmit = async () => {
    const url = newImageUrl.trim();
    if (!url) return;

    const newImageItem = {
      [FIELDS.IMAGE_URL]: url,
      [FIELDS.IS_THUMBNAIL]: images.length === 0,
    };

    const updated = [...images, newImageItem];
    await updateDish(dishId, {
      [FIELDS.DISH_IMAGE]: updated,
    });

    setNewImageUrl('');
    setShowAddImageModal(false);
    setSelectedImageIndex(updated.length - 1);
  };

  const handleDelete = async () => {
    await deleteDish(dishId);
    setShowDeleteModal(false);
    onBack();
  };

  return (
    <View style={styles.screenWrapper}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* 1. TOP NAVIGATION BAR */}
        <View style={styles.topNav}>
          <TouchableOpacity style={styles.navBackBtn} onPress={onBack}>
            <Text style={styles.navBackText}>{t('back')}</Text>
          </TouchableOpacity>

          <Text style={styles.navTitle}>{t('dishDetail')}</Text>

          {/* Language Toggle Pill: EN | VI */}
          <View style={styles.langPill}>
            <TouchableOpacity
              style={[styles.langChoice, language === 'en' && styles.langChoiceActive]}
              onPress={() => setLanguage('en')}
            >
              <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>
                EN
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.langChoice, language === 'vi' && styles.langChoiceActive]}
              onPress={() => setLanguage('vi')}
            >
              <Text style={[styles.langText, language === 'vi' && styles.langTextActive]}>
                VI
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. HERO FOOD IMAGE */}
        <View style={styles.heroImageWrapper}>
          <Image
            source={{
              uri: activeImageError
                ? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
                : activeImageUrl,
            }}
            style={styles.heroImage}
            onError={() => setActiveImageError(true)}
            resizeMode="cover"
          />
        </View>

        {/* 3. BỘ SƯU TẬP HÌNH ẢNH */}
        <View style={styles.galleryContainer}>
          <View style={styles.galleryHeaderRow}>
            <Text style={styles.galleryHeaderTitle}>
              {t('galleryTitle')} ({images.length})
            </Text>

            <TouchableOpacity
              style={styles.addUrlBtn}
              onPress={() => setShowAddImageModal(true)}
            >
              <Text style={styles.addUrlBtnText}>{t('addPhotoUrl')}</Text>
            </TouchableOpacity>
          </View>

          {/* Thumbnails Row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.galleryScroll}
          >
            {images.map((img, idx) => {
              const isThumb = Boolean(img[FIELDS.IS_THUMBNAIL]);
              const isSelected = idx === selectedImageIndex;

              return (
                <View key={idx} style={styles.thumbCard}>
                  {/* Thumbnail Picture with Star badge */}
                  <TouchableOpacity
                    style={[
                      styles.thumbImgWrapper,
                      isSelected && styles.thumbImgWrapperSelected,
                    ]}
                    onPress={() => {
                      setSelectedImageIndex(idx);
                      setActiveImageError(false);
                    }}
                  >
                    <Image
                      source={{ uri: img[FIELDS.IMAGE_URL] }}
                      style={styles.thumbImg}
                      resizeMode="cover"
                    />
                    {/* Star badge on top-right */}
                    {isThumb && (
                      <View style={styles.starBadge}>
                        <Text style={styles.starBadgeText}>★</Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Label: "Ảnh đại diện" (peach) OR Button: "Đặt làm ảnh đại diện" (gray) */}
                  {isThumb ? (
                    <View style={styles.thumbActivePill}>
                      <Text style={styles.thumbActivePillText}>{t('thumbnailBadge')}</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.setThumbPill}
                      onPress={() => handleSetThumbnail(idx)}
                    >
                      <Text style={styles.setThumbPillText}>{t('setThumbnailBtn')}</Text>
                    </TouchableOpacity>
                  )}

                  {/* Red Remove "✕" button */}
                  <TouchableOpacity
                    style={styles.removeIconBtn}
                    onPress={() => handleRemoveImage(idx)}
                  >
                    <Text style={styles.removeIconText}>✕</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* 4. DETAILS CARD CONTAINER */}
        <View style={styles.detailsCard}>
          {/* Category in Uppercase Warm Orange */}
          <Text style={styles.categoryTag}>
            {categoryName.toUpperCase()}
          </Text>

          {/* Big Bold Dish Title */}
          <Text style={styles.dishTitle}>
            {name}
          </Text>

          {/* Two Metric Cards Side-by-Side */}
          <View style={styles.metricsRow}>
            {/* Left: Unit Price */}
            <View style={styles.priceBox}>
              <Text style={styles.metricLabel}>{t('unitPrice')}</Text>
              <Text style={styles.priceValue}>
                {formattedPrice} {t('currency')}
              </Text>
            </View>

            {/* Right: Preparation Time (Soft Mint/Cyan) */}
            <View style={styles.prepTimeBox}>
              <Text style={styles.metricLabel}>{t('prepTimeLabel')}</Text>
              <Text style={styles.prepTimeValue}>
                ⏱ {isQuick ? 'Quick / Nhanh' : 'Regular / Thông thường'} ({prepTime} {t('minUnit')})
              </Text>
            </View>
          </View>

          {/* Detailed Description */}
          <Text style={styles.descriptionHeader}>{t('detailedDescription')}</Text>
          <Text style={styles.descriptionBody}>
            {description || '(No description provided)'}
          </Text>
        </View>

        {/* 5. BOTTOM ACTION BUTTONS */}
        <View style={styles.bottomActionsRow}>
          {/* Delete Button (Soft pink/red background, red text) */}
          <TouchableOpacity
            style={styles.actionDeleteBtn}
            onPress={() => setShowDeleteModal(true)}
          >
            <Text style={styles.actionDeleteText}>🗑 {t('delete')}</Text>
          </TouchableOpacity>

          {/* Edit Button (Solid vibrant orange, white text) */}
          <TouchableOpacity
            style={styles.actionEditBtn}
            onPress={() => onEdit(currentDish)}
          >
            <Text style={styles.actionEditText}>✏️ {t('edit')}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Modal: Thêm URL ảnh */}
      <Modal
        visible={showAddImageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddImageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalDialog}>
            <Text style={styles.modalTitle}>+ {t('addPhotoUrl')}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="https://images.unsplash.com/..."
              placeholderTextColor="#94A3B8"
              value={newImageUrl}
              onChangeText={setNewImageUrl}
              autoCapitalize="none"
            />

            {/* Quick sample pickers */}
            <Text style={styles.sampleHeader}>Gợi ý ảnh mẫu nhanh:</Text>
            <View style={styles.sampleGrid}>
              {SAMPLE_FOOD_IMAGES.map((url, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.sampleItem}
                  onPress={() => setNewImageUrl(url)}
                >
                  <Image source={{ uri: url }} style={styles.sampleImg} />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowAddImageModal(false)}
              >
                <Text style={styles.modalCancelText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleAddImageSubmit}
              >
                <Text style={styles.modalSaveText}>{t('save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal: Xác nhận xóa món ăn */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // TOP NAV
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  navBackBtn: {
    paddingVertical: 4,
    paddingRight: 8,
  },
  navBackText: {
    color: '#EA580C', // Vibrant warm orange
    fontSize: 15,
    fontWeight: '700',
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  langPill: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  langChoice: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 14,
  },
  langChoiceActive: {
    backgroundColor: '#EA580C',
  },
  langText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  langTextActive: {
    color: '#FFFFFF',
  },
  // HERO IMAGE
  heroImageWrapper: {
    width: '100%',
    height: 200,
    backgroundColor: '#0F172A',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  // BỘ SƯU TẬP HÌNH ẢNH
  galleryContainer: {
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  galleryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  galleryHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  addUrlBtn: {
    backgroundColor: '#FFF0E6',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  addUrlBtnText: {
    color: '#EA580C',
    fontSize: 12,
    fontWeight: '700',
  },
  galleryScroll: {
    gap: 14,
    paddingVertical: 4,
  },
  thumbCard: {
    alignItems: 'center',
    width: 84,
  },
  thumbImgWrapper: {
    width: 76,
    height: 76,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  thumbImgWrapperSelected: {
    borderColor: '#EA580C',
    borderWidth: 2,
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  starBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EA580C',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  starBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    lineHeight: 12,
  },
  thumbActivePill: {
    backgroundColor: '#FFF0E6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 6,
  },
  thumbActivePillText: {
    color: '#EA580C',
    fontSize: 10,
    fontWeight: '700',
  },
  setThumbPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 6,
  },
  setThumbPillText: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
  },
  removeIconBtn: {
    marginTop: 4,
    padding: 2,
  },
  removeIconText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
  },
  // DETAILS CARD CONTAINER
  detailsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 6,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  categoryTag: {
    color: '#EA580C',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  dishTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 26,
    marginBottom: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  priceBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#EA580C',
  },
  prepTimeBox: {
    flex: 1.25,
    backgroundColor: '#E6F7F5', // Soft Mint/Cyan as in screenshot
    borderRadius: 10,
    padding: 10,
  },
  prepTimeValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D9488', // Dark teal/cyan
    lineHeight: 16,
  },
  descriptionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  descriptionBody: {
    fontSize: 13,
    lineHeight: 20,
    color: '#475569',
  },
  // BOTTOM ACTIONS ROW
  bottomActionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 18,
    gap: 10,
  },
  actionDeleteBtn: {
    backgroundColor: '#FFF1F2', // Soft pink/red
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionDeleteText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '700',
  },
  actionEditBtn: {
    flex: 1,
    backgroundColor: '#EA580C', // Solid vibrant orange
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  actionEditText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  // MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalDialog: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
    fontSize: 13,
    color: '#0F172A',
  },
  sampleHeader: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 12,
    marginBottom: 6,
  },
  sampleGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  sampleItem: {
    width: 60,
    height: 45,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sampleImg: {
    width: '100%',
    height: '100%',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalCancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  modalCancelText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 13,
  },
  modalSaveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#EA580C',
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  // FALLBACK
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#FFFFFF',
  },
  notFoundIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  notFoundTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  backBtnFallback: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backBtnFallbackText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
