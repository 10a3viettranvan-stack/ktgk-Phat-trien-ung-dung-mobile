/**
 * BIT240252_FoodManager
 * Model: Dish
 * 
 * Bắt buộc tiền tố BIT240252_ cho tất cả trường dữ liệu:
 * - BIT240252_Id
 * - BIT240252_Name
 * - BIT240252_Price
 * - BIT240252_PreparationTime
 * - BIT240252_IsAvailable
 * - BIT240252_Description
 * - BIT240252_DishCategoryId
 * - BIT240252_DishImage: [ { BIT240252_ImageUrl, BIT240252_IsThumbnail } ]
 */

import { FIELDS, PREP_TIME_THRESHOLD_QUICK } from '../constants/MSSV';

export class DishModel {
  constructor({
    [FIELDS.DISH_ID]: id = `dish_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    [FIELDS.DISH_NAME]: name = '',
    [FIELDS.DISH_PRICE]: price = 0,
    [FIELDS.DISH_PREPARATION_TIME]: prepTime = 15,
    [FIELDS.DISH_IS_AVAILABLE]: isAvailable = true,
    [FIELDS.DISH_DESCRIPTION]: description = '',
    [FIELDS.DISH_CATEGORY_ID]: categoryId = '',
    [FIELDS.DISH_IMAGE]: dishImages = [],
    [FIELDS.SYNC_STATUS]: syncStatus = 'synced',
    [FIELDS.UPDATED_AT]: updatedAt = Date.now(),
  } = {}) {
    this[FIELDS.DISH_ID] = String(id);
    this[FIELDS.DISH_NAME] = String(name).trim();
    this[FIELDS.DISH_PRICE] = Number(price) || 0;
    this[FIELDS.DISH_PREPARATION_TIME] = Number(prepTime) || 0;
    this[FIELDS.DISH_IS_AVAILABLE] = Boolean(isAvailable);
    this[FIELDS.DISH_DESCRIPTION] = String(description).trim();
    this[FIELDS.DISH_CATEGORY_ID] = String(categoryId).trim();

    // Chuẩn hóa danh sách ảnh: mỗi món có tối đa 01 ảnh IsThumbnail = true
    this[FIELDS.DISH_IMAGE] = DishModel.normalizeImages(dishImages);

    // Đồng bộ offline
    this[FIELDS.SYNC_STATUS] = syncStatus;
    this[FIELDS.UPDATED_AT] = Number(updatedAt) || Date.now();
  }

  /**
   * Chuẩn hóa danh sách ảnh: đảm bảo có duy nhất tối đa 1 thumbnail
   */
  static normalizeImages(images = []) {
    if (!Array.isArray(images) || images.length === 0) {
      return [];
    }

    let hasThumbnail = false;
    const normalized = images.map((img) => {
      const url = typeof img === 'string' ? img : (img[FIELDS.IMAGE_URL] || img.url || '');
      let isThumb = typeof img === 'object' ? Boolean(img[FIELDS.IS_THUMBNAIL] || img.isThumbnail) : false;

      if (isThumb && !hasThumbnail) {
        hasThumbnail = true;
      } else if (isThumb && hasThumbnail) {
        // Chỉ cho phép tối đa 01 ảnh là thumbnail
        isThumb = false;
      }

      return {
        [FIELDS.IMAGE_URL]: url.trim(),
        [FIELDS.IS_THUMBNAIL]: isThumb,
      };
    });

    // Nếu có ít nhất 1 ảnh mà chưa có thumbnail nào, đặt ảnh đầu tiên làm thumbnail
    if (normalized.length > 0 && !hasThumbnail) {
      normalized[0][FIELDS.IS_THUMBNAIL] = true;
    }

    return normalized;
  }

  /**
   * Lấy URL ảnh đại diện (thumbnail)
   */
  static getThumbnailUrl(dish) {
    if (!dish) return null;
    const images = dish[FIELDS.DISH_IMAGE] || [];
    const thumb = images.find(img => img[FIELDS.IS_THUMBNAIL]);
    if (thumb && thumb[FIELDS.IMAGE_URL]) {
      return thumb[FIELDS.IMAGE_URL];
    }
    if (images.length > 0 && images[0][FIELDS.IMAGE_URL]) {
      return images[0][FIELDS.IMAGE_URL];
    }
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
  }

  /**
   * Phân loại thời gian chế biến:
   * PreparationTime <= 15 phút -> 'Quick' / 'Nhanh'
   * PreparationTime > 15 phút -> 'Regular' / 'Thông thường'
   */
  static isQuickDish(dish) {
    const time = Number(dish?.[FIELDS.DISH_PREPARATION_TIME]) || 0;
    return time <= PREP_TIME_THRESHOLD_QUICK;
  }

  /**
   * Kiểm tra tính hợp lệ dữ liệu món ăn theo barem:
   * 1. Name không rỗng
   * 2. Price > 0
   * 3. PreparationTime > 0
   * 4. DishCategoryId hợp lệ
   * 5. Tên món không trùng trong cùng một loại
   */
  static validate(data, existingDishes = [], existingCategories = []) {
    const errors = {};
    const name = (data[FIELDS.DISH_NAME] || '').trim();
    const price = Number(data[FIELDS.DISH_PRICE]);
    const prepTime = Number(data[FIELDS.DISH_PREPARATION_TIME]);
    const categoryId = String(data[FIELDS.DISH_CATEGORY_ID] || '').trim();
    const id = data[FIELDS.DISH_ID];

    // 1. Name không rỗng
    if (!name) {
      errors[FIELDS.DISH_NAME] = 'valNameRequired';
    }

    // 2. Price > 0
    if (isNaN(price) || price <= 0) {
      errors[FIELDS.DISH_PRICE] = 'valPriceInvalid';
    }

    // 3. PreparationTime > 0
    if (isNaN(prepTime) || prepTime <= 0) {
      errors[FIELDS.DISH_PREPARATION_TIME] = 'valPrepTimeInvalid';
    }

    // 4. DishCategoryId hợp lệ
    const categoryExists = existingCategories.some(
      cat => String(cat[FIELDS.CATEGORY_ID]) === categoryId
    );
    if (!categoryId || !categoryExists) {
      errors[FIELDS.DISH_CATEGORY_ID] = 'valCategoryRequired';
    }

    // 5. Tên món không trùng trong cùng một loại (ngoại trừ chính món đó khi sửa)
    if (name && categoryId) {
      const isDuplicate = existingDishes.some(dish => {
        const isDifferentDish = dish[FIELDS.DISH_ID] !== id;
        const isSameCategory = String(dish[FIELDS.DISH_CATEGORY_ID]) === categoryId;
        const isSameName = (dish[FIELDS.DISH_NAME] || '').toLowerCase().trim() === name.toLowerCase();
        return isDifferentDish && isSameCategory && isSameName;
      });

      if (isDuplicate) {
        errors[FIELDS.DISH_NAME] = 'valDuplicateName';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Xuất plain JSON cho lưu trữ
   */
  toJSON() {
    return {
      [FIELDS.DISH_ID]: this[FIELDS.DISH_ID],
      [FIELDS.DISH_NAME]: this[FIELDS.DISH_NAME],
      [FIELDS.DISH_PRICE]: this[FIELDS.DISH_PRICE],
      [FIELDS.DISH_PREPARATION_TIME]: this[FIELDS.DISH_PREPARATION_TIME],
      [FIELDS.DISH_IS_AVAILABLE]: this[FIELDS.DISH_IS_AVAILABLE],
      [FIELDS.DISH_DESCRIPTION]: this[FIELDS.DISH_DESCRIPTION],
      [FIELDS.DISH_CATEGORY_ID]: this[FIELDS.DISH_CATEGORY_ID],
      [FIELDS.DISH_IMAGE]: this[FIELDS.DISH_IMAGE],
      [FIELDS.SYNC_STATUS]: this[FIELDS.SYNC_STATUS],
      [FIELDS.UPDATED_AT]: this[FIELDS.UPDATED_AT],
    };
  }
}
