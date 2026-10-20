/**
 * BIT240252_FoodManager
 * Screen: DishFormScreen (Thêm mới & Chỉnh sửa món ăn)
 * 
 * Đáp ứng:
 * 3. Kiểm tra dữ liệu:
 *    - Name không rỗng
 *    - Price > 0
 *    - PreparationTime > 0
 *    - DishCategoryId hợp lệ (chọn từ danh mục lưu trữ)
 *    - Tên món không trùng trong cùng một loại
 * 4.1. Thêm (Create) và Sửa (Edit), chọn loại món từ dữ liệu lưu trữ
 * 4.3. Thêm ảnh bằng ImageUrl, quản lý nhiều ảnh, tối đa 01 ảnh IsThumbnail = true
 *      Hiển thị xem trước Quick / Regular theo thời gian nhập
 * 4.5. Dịch nhãn, nút, trạng thái và thông báo validation/lỗi
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';
import { FIELDS, PREP_TIME_THRESHOLD_QUICK } from '../constants/MSSV';
import { DishModel } from '../models/DishModel';

// Danh sách ảnh mẫu thực phẩm chất lượng cao phục vụ thêm nhanh
const SAMPLE_IMAGE_URLS = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
];

export const DishFormScreen = ({ initialDish = null, onCancel, onSuccess }) => {
  const { categories, dishes, addDish, updateDish, t } = useApp();
  const isEditing = Boolean(initialDish && initialDish[FIELDS.DISH_ID]);

  // Form State
  const [name, setName] = useState(initialDish ? initialDish[FIELDS.DISH_NAME] : '');
  const [categoryId, setCategoryId] = useState(
    initialDish ? initialDish[FIELDS.DISH_CATEGORY_ID] : (categories[0]?.[FIELDS.CATEGORY_ID] || '')
  );
  const [price, setPrice] = useState(
    initialDish ? String(initialDish[FIELDS.DISH_PRICE]) : ''
  );
  const [prepTime, setPrepTime] = useState(
    initialDish ? String(initialDish[FIELDS.DISH_PREPARATION_TIME]) : '15'
  );
  const [isAvailable, setIsAvailable] = useState(
    initialDish ? Boolean(initialDish[FIELDS.DISH_IS_AVAILABLE]) : true
  );
  const [description, setDescription] = useState(
    initialDish ? initialDish[FIELDS.DISH_DESCRIPTION] : ''
  );

  // Danh sách ảnh: mảng các đối tượng { BIT240252_ImageUrl, BIT240252_IsThumbnail }
  const [images, setImages] = useState(
    initialDish && initialDish[FIELDS.DISH_IMAGE]
      ? JSON.parse(JSON.stringify(initialDish[FIELDS.DISH_IMAGE]))
      : [
          {
            [FIELDS.IMAGE_URL]: SAMPLE_IMAGE_URLS[0],
            [FIELDS.IS_THUMBNAIL]: true,
          },
        ]
  );

  const [newImageUrl, setNewImageUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Thêm ảnh vào danh sách
  const handleAddImage = (urlToAdd) => {
    const url = (urlToAdd || newImageUrl).trim();
    if (!url) {
      setErrors((prev) => ({ ...prev, imageUrl: 'valImageUrlRequired' }));
      return;
    }

    // Kiểm tra trùng URL
    if (images.some((img) => img[FIELDS.IMAGE_URL] === url)) {
      setErrors((prev) => ({ ...prev, imageUrl: 'valImageDuplicate' }));
      return;
    }

    const isFirstImage = images.length === 0;
    const newImageItem = {
      [FIELDS.IMAGE_URL]: url,
      [FIELDS.IS_THUMBNAIL]: isFirstImage, // Nếu là ảnh đầu tiên thì đặt làm thumbnail
    };

    setImages([...images, newImageItem]);
    setNewImageUrl('');
    setErrors((prev) => ({ ...prev, imageUrl: null }));
  };

  // Đặt ảnh làm thumbnail (mỗi món tối đa 01 ảnh IsThumbnail = true)
  const handleSetThumbnail = (index) => {
    setImages(
      images.map((img, idx) => ({
        ...img,
        [FIELDS.IS_THUMBNAIL]: idx === index,
      }))
    );
  };

  // Xóa ảnh khỏi danh sách
  const handleRemoveImage = (index) => {
    const target = images[index];
    const filtered = images.filter((_, idx) => idx !== index);

    // Nếu vừa xóa thumbnail và vẫn còn ảnh khác, đặt ảnh đầu tiên làm thumbnail
    if (target[FIELDS.IS_THUMBNAIL] && filtered.length > 0) {
      filtered[0][FIELDS.IS_THUMBNAIL] = true;
    }

    setImages(filtered);
  };

  // Live preview Quick / Regular
  const prepTimeNum = parseInt(prepTime, 10);
  const isQuickPreview = !isNaN(prepTimeNum) && prepTimeNum <= PREP_TIME_THRESHOLD_QUICK;

  // Xử lý gửi Form
  const handleSubmit = async () => {
    const dishData = {
      [FIELDS.DISH_ID]: isEditing ? initialDish[FIELDS.DISH_ID] : undefined,
      [FIELDS.DISH_NAME]: name,
      [FIELDS.DISH_PRICE]: parseFloat(price),
      [FIELDS.DISH_PREPARATION_TIME]: parseInt(prepTime, 10),
      [FIELDS.DISH_IS_AVAILABLE]: isAvailable,
      [FIELDS.DISH_DESCRIPTION]: description,
      [FIELDS.DISH_CATEGORY_ID]: categoryId,
      [FIELDS.DISH_IMAGE]: images,
    };

    // Kiểm tra validation nghiệp vụ
    const validation = DishModel.validate(dishData, dishes, categories);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setIsSubmitting(true);
      if (isEditing) {
        await updateDish(initialDish[FIELDS.DISH_ID], dishData);
      } else {
        await addDish(dishData);
      }
      setIsSubmitting(false);
      onSuccess();
    } catch (err) {
      setIsSubmitting(false);
      Alert.alert('Error', err.message || t('errorOccurred'));
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Form */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onCancel}>
          <Text style={styles.backBtnText}>✕ {t('cancel')}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? t('editDish') : t('createDish')}
        </Text>
        <TouchableOpacity
          style={[styles.saveHeaderBtn, isSubmitting && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.saveHeaderBtnText}>
            {isSubmitting ? t('saving') : t('save')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContent}>
        {/* 1. Dish Name */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {t('dishName')} <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors[FIELDS.DISH_NAME] && styles.inputError]}
            placeholder={t('dishNamePlaceholder')}
            placeholderTextColor={COLORS.textMuted}
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors[FIELDS.DISH_NAME]) setErrors((prev) => ({ ...prev, [FIELDS.DISH_NAME]: null }));
            }}
          />
          {errors[FIELDS.DISH_NAME] && (
            <Text style={styles.errorText}>⚠️ {t(errors[FIELDS.DISH_NAME])}</Text>
          )}
        </View>

        {/* 2. Category Picker (chọn từ dữ liệu lưu trữ) */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {t('category')} <Text style={styles.required}>*</Text>
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((cat) => {
              const catId = String(cat[FIELDS.CATEGORY_ID]);
              const isSelected = categoryId === catId;
              return (
                <TouchableOpacity
                  key={catId}
                  style={[styles.categoryChoice, isSelected && styles.categoryChoiceActive]}
                  onPress={() => {
                    setCategoryId(catId);
                    if (errors[FIELDS.DISH_CATEGORY_ID]) {
                      setErrors((prev) => ({ ...prev, [FIELDS.DISH_CATEGORY_ID]: null }));
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.categoryChoiceText,
                      isSelected && styles.categoryChoiceTextActive,
                    ]}
                  >
                    {cat[FIELDS.CATEGORY_NAME]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          {errors[FIELDS.DISH_CATEGORY_ID] && (
            <Text style={styles.errorText}>⚠️ {t(errors[FIELDS.DISH_CATEGORY_ID])}</Text>
          )}
        </View>

        {/* 3. Price & Preparation Time */}
        <View style={styles.twoColumnRow}>
          {/* Price */}
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>
              {t('price')} <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors[FIELDS.DISH_PRICE] && styles.inputError]}
              placeholder={t('pricePlaceholder')}
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              value={price}
              onChangeText={(text) => {
                setPrice(text);
                if (errors[FIELDS.DISH_PRICE]) setErrors((prev) => ({ ...prev, [FIELDS.DISH_PRICE]: null }));
              }}
            />
            {errors[FIELDS.DISH_PRICE] && (
              <Text style={styles.errorText}>⚠️ {t(errors[FIELDS.DISH_PRICE])}</Text>
            )}
          </View>

          {/* Prep Time with Quick/Regular Preview */}
          <View style={[styles.formGroup, { flex: 1 }]}>
            <View style={styles.prepTimeHeader}>
              <Text style={styles.label}>
                {t('prepTime')} <Text style={styles.required}>*</Text>
              </Text>
              {prepTime ? (
                <Text
                  style={[
                    styles.prepPreviewTag,
                    isQuickPreview ? styles.tagQuick : styles.tagRegular,
                  ]}
                >
                  {isQuickPreview ? `⚡ ${t('quickDish')}` : `⏱️ ${t('regularDish')}`}
                </Text>
              ) : null}
            </View>
            <TextInput
              style={[
                styles.input,
                errors[FIELDS.DISH_PREPARATION_TIME] && styles.inputError,
              ]}
              placeholder={t('prepTimePlaceholder')}
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              value={prepTime}
              onChangeText={(text) => {
                setPrepTime(text);
                if (errors[FIELDS.DISH_PREPARATION_TIME]) {
                  setErrors((prev) => ({ ...prev, [FIELDS.DISH_PREPARATION_TIME]: null }));
                }
              }}
            />
            {errors[FIELDS.DISH_PREPARATION_TIME] && (
              <Text style={styles.errorText}>⚠️ {t(errors[FIELDS.DISH_PREPARATION_TIME])}</Text>
            )}
          </View>
        </View>

        {/* 4. Availability Status Switch */}
        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{t('availability')}</Text>
            <Text style={styles.switchHelpText}>
              {isAvailable ? `🟢 ${t('statusAvailable')}` : `🔴 ${t('statusUnavailable')}`}
            </Text>
          </View>
          <Switch
            value={isAvailable}
            onValueChange={setIsAvailable}
            trackColor={{ false: '#CBD5E1', true: COLORS.accentLight }}
            thumbColor={isAvailable ? COLORS.accent : '#94A3B8'}
          />
        </View>

        {/* 5. Description */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t('description')}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t('descriptionPlaceholder')}
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={3}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* 6. Multi-image Management Section (Yêu cầu 4.3) */}
        <View style={styles.formGroup}>
          <View style={styles.imageSectionHeader}>
            <Text style={styles.label}>
              📸 {t('imageSection')} ({images.length})
            </Text>
            <TouchableOpacity
              onPress={() => handleAddImage(SAMPLE_IMAGE_URLS[(images.length + 1) % SAMPLE_IMAGE_URLS.length])}
            >
              <Text style={styles.sampleImgLink}>+ {t('quickFillSample')}</Text>
            </TouchableOpacity>
          </View>

          {/* Add Image via URL input */}
          <View style={styles.addImageInputRow}>
            <TextInput
              style={[styles.input, { flex: 1 }, errors.imageUrl && styles.inputError]}
              placeholder={t('imageUrlPlaceholder')}
              placeholderTextColor={COLORS.textMuted}
              value={newImageUrl}
              onChangeText={setNewImageUrl}
            />
            <TouchableOpacity
              style={styles.addImageBtn}
              onPress={() => handleAddImage()}
            >
              <Text style={styles.addImageBtnText}>+ {t('addImageBtn')}</Text>
            </TouchableOpacity>
          </View>
          {errors.imageUrl && (
            <Text style={styles.errorText}>⚠️ {t(errors.imageUrl)}</Text>
          )}

          {/* Images Grid / List */}
          <View style={styles.imagesGrid}>
            {images.map((img, idx) => {
              const isThumb = Boolean(img[FIELDS.IS_THUMBNAIL]);
              return (
                <View key={idx} style={styles.imageCard}>
                  <Image
                    source={{ uri: img[FIELDS.IMAGE_URL] }}
                    style={styles.imageCardPreview}
                    resizeMode="cover"
                  />
                  <View style={styles.imageCardActions}>
                    {isThumb ? (
                      <View style={styles.thumbnailActiveBadge}>
                        <Text style={styles.thumbnailActiveText}>⭐ {t('isThumbnailBadge')}</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.setThumbFormBtn}
                        onPress={() => handleSetThumbnail(idx)}
                      >
                        <Text style={styles.setThumbFormBtnText}>Set ⭐</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={styles.removeImageBtn}
                      onPress={() => handleRemoveImage(idx)}
                    >
                      <Text style={styles.removeImageBtnText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitBtnText}>
            {isSubmitting
              ? t('saving')
              : isEditing
              ? `💾 ${t('update')}`
              : `＋ ${t('save')}`}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  saveHeaderBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  saveHeaderBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  formContent: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  required: {
    color: COLORS.danger,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  inputError: {
    borderColor: COLORS.danger,
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  categoryScroll: {
    flexDirection: 'row',
    paddingVertical: 4,
    gap: 8,
  },
  categoryChoice: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  categoryChoiceActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChoiceText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  categoryChoiceTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  prepTimeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  prepPreviewTag: {
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagQuick: {
    backgroundColor: COLORS.badgeQuickBg,
    color: COLORS.badgeQuickText,
  },
  tagRegular: {
    backgroundColor: COLORS.badgeRegularBg,
    color: COLORS.badgeRegularText,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginBottom: 16,
  },
  switchHelpText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  imageSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sampleImgLink: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '700',
  },
  addImageInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  addImageBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderRadius: 8,
  },
  addImageBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 6,
  },
  imageCard: {
    width: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    overflow: 'hidden',
  },
  imageCardPreview: {
    width: '100%',
    height: 70,
  },
  imageCardActions: {
    padding: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  thumbnailActiveBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  thumbnailActiveText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#B45309',
  },
  setThumbFormBtn: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  setThumbFormBtnText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.primary,
  },
  removeImageBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  removeImageBtnText: {
    fontSize: 11,
    color: COLORS.danger,
    fontWeight: '800',
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
