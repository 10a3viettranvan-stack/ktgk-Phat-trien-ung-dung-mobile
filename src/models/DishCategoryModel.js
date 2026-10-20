/**
 * BIT240252_FoodManager
 * Model: DishCategory
 * 
 * Bắt buộc tiền tố BIT240252_ cho tất cả trường dữ liệu:
 * - BIT240252_Id
 * - BIT240252_Name
 * - BIT240252_Description
 */

import { FIELDS } from '../constants/MSSV';

export class DishCategoryModel {
  /**
   * Khởi tạo đối tượng DishCategory với các trường mang tiền tố BIT240252_
   */
  constructor({
    [FIELDS.CATEGORY_ID]: id = `cat_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    [FIELDS.CATEGORY_NAME]: name = '',
    [FIELDS.CATEGORY_DESCRIPTION]: description = '',
  } = {}) {
    this[FIELDS.CATEGORY_ID] = String(id);
    this[FIELDS.CATEGORY_NAME] = String(name).trim();
    this[FIELDS.CATEGORY_DESCRIPTION] = String(description).trim();
  }

  /**
   * Kiểm tra tính hợp lệ của dữ liệu loại món ăn
   * @param {Object} data 
   * @param {Array} existingCategories 
   * @returns {Object} { isValid: boolean, errors: Object }
   */
  static validate(data, existingCategories = []) {
    const errors = {};
    const name = data[FIELDS.CATEGORY_NAME] || '';
    const id = data[FIELDS.CATEGORY_ID];

    if (!name || name.trim().length === 0) {
      errors[FIELDS.CATEGORY_NAME] = 'valNameRequired';
    } else {
      // Tên loại món không nên trùng nhau
      const isDuplicate = existingCategories.some(
        c => c[FIELDS.CATEGORY_ID] !== id &&
             c[FIELDS.CATEGORY_NAME].toLowerCase().trim() === name.toLowerCase().trim()
      );
      if (isDuplicate) {
        errors[FIELDS.CATEGORY_NAME] = 'valDuplicateName';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Chuyển đổi sang Plain Object lưu trữ
   */
  toJSON() {
    return {
      [FIELDS.CATEGORY_ID]: this[FIELDS.CATEGORY_ID],
      [FIELDS.CATEGORY_NAME]: this[FIELDS.CATEGORY_NAME],
      [FIELDS.CATEGORY_DESCRIPTION]: this[FIELDS.CATEGORY_DESCRIPTION],
    };
  }
}
