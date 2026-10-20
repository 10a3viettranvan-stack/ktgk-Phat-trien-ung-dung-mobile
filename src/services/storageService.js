/**
 * BIT240252_FoodManager
 * Storage Service - Quản lý lưu trữ Local bằng AsyncStorage
 * 
 * BẮT BUỘC: Mọi bảng lưu trữ và trường đều có tiền tố BIT240252_
 * - Bảng danh mục: BIT240252_DishCategory
 * - Bảng món ăn: BIT240252_Dish
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_TABLES, FIELDS } from '../constants/MSSV';
import { INITIAL_CATEGORIES, INITIAL_DISHES } from '../seed/initialData';
import { DishModel } from '../models/DishModel';
import { DishCategoryModel } from '../models/DishCategoryModel';

export class StorageService {
  /**
   * Khởi tạo dữ liệu mẫu nếu chưa có trong AsyncStorage
   */
  static async initializeStorage() {
    try {
      const existingCategories = await AsyncStorage.getItem(STORAGE_TABLES.DISH_CATEGORY);
      if (!existingCategories) {
        await AsyncStorage.setItem(
          STORAGE_TABLES.DISH_CATEGORY,
          JSON.stringify(INITIAL_CATEGORIES)
        );
      }

      const existingDishes = await AsyncStorage.getItem(STORAGE_TABLES.DISH);
      if (!existingDishes) {
        await AsyncStorage.setItem(
          STORAGE_TABLES.DISH,
          JSON.stringify(INITIAL_DISHES)
        );
      }

      const existingSettings = await AsyncStorage.getItem(STORAGE_TABLES.SETTINGS);
      if (!existingSettings) {
        await AsyncStorage.setItem(
          STORAGE_TABLES.SETTINGS,
          JSON.stringify({ language: 'en' }) // Mặc định tiếng Anh
        );
      }
    } catch (error) {
      console.error('[BIT240252_Storage] Error initializing storage:', error);
    }
  }

  // ==========================================
  // DISH CATEGORY OPERATIONS (BIT240252_DishCategory)
  // ==========================================

  static async getCategories() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_TABLES.DISH_CATEGORY);
      if (!data) {
        await this.initializeStorage();
        return INITIAL_CATEGORIES;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('[BIT240252_Storage] Error getting categories:', error);
      return INITIAL_CATEGORIES;
    }
  }

  static async saveCategories(categories) {
    try {
      await AsyncStorage.setItem(
        STORAGE_TABLES.DISH_CATEGORY,
        JSON.stringify(categories)
      );
      return true;
    } catch (error) {
      console.error('[BIT240252_Storage] Error saving categories:', error);
      return false;
    }
  }

  static async addCategory(categoryData) {
    const categories = await this.getCategories();
    const newCategory = new DishCategoryModel(categoryData).toJSON();
    const updated = [...categories, newCategory];
    await this.saveCategories(updated);
    return newCategory;
  }

  /**
   * Ràng buộc nghiệp vụ: Không cho xóa loại món đang được sử dụng
   */
  static async deleteCategory(categoryId) {
    const dishes = await this.getDishes();
    const isCategoryInUse = dishes.some(
      dish => String(dish[FIELDS.DISH_CATEGORY_ID]) === String(categoryId)
    );

    if (isCategoryInUse) {
      return {
        success: false,
        reason: 'CATEGORY_IN_USE',
        message: 'Không thể xóa loại món đang có món ăn sử dụng.',
      };
    }

    const categories = await this.getCategories();
    const filtered = categories.filter(
      c => String(c[FIELDS.CATEGORY_ID]) !== String(categoryId)
    );
    await this.saveCategories(filtered);
    return { success: true };
  }

  // ==========================================
  // DISH OPERATIONS (BIT240252_Dish)
  // ==========================================

  static async getDishes() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_TABLES.DISH);
      if (!data) {
        await this.initializeStorage();
        return INITIAL_DISHES;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('[BIT240252_Storage] Error getting dishes:', error);
      return INITIAL_DISHES;
    }
  }

  static async saveDishes(dishes) {
    try {
      await AsyncStorage.setItem(
        STORAGE_TABLES.DISH,
        JSON.stringify(dishes)
      );
      return true;
    } catch (error) {
      console.error('[BIT240252_Storage] Error saving dishes:', error);
      return false;
    }
  }

  static async getDishById(id) {
    const dishes = await this.getDishes();
    return dishes.find(d => String(d[FIELDS.DISH_ID]) === String(id)) || null;
  }

  static async addDish(dishData, isOffline = false) {
    const dishes = await this.getDishes();
    const syncStatus = isOffline ? 'pending_create' : 'synced';
    const newDish = new DishModel({
      ...dishData,
      [FIELDS.SYNC_STATUS]: syncStatus,
      [FIELDS.UPDATED_AT]: Date.now(),
    }).toJSON();

    const updated = [newDish, ...dishes];
    await this.saveDishes(updated);
    return newDish;
  }

  static async updateDish(id, dishData, isOffline = false) {
    const dishes = await this.getDishes();
    const index = dishes.findIndex(d => String(d[FIELDS.DISH_ID]) === String(id));
    if (index === -1) {
      throw new Error(`Dish with ID ${id} not found.`);
    }

    const currentDish = dishes[index];
    const prevSyncStatus = currentDish[FIELDS.SYNC_STATUS];
    // Nếu món trước đó đang chờ tạo (pending_create) khi offline thì vẫn giữ pending_create
    let syncStatus = 'synced';
    if (isOffline) {
      syncStatus = prevSyncStatus === 'pending_create' ? 'pending_create' : 'pending_update';
    }

    const updatedDish = new DishModel({
      ...currentDish,
      ...dishData,
      [FIELDS.DISH_ID]: id,
      [FIELDS.SYNC_STATUS]: syncStatus,
      [FIELDS.UPDATED_AT]: Date.now(),
    }).toJSON();

    dishes[index] = updatedDish;
    await this.saveDishes(dishes);
    return updatedDish;
  }

  static async deleteDish(id, isOffline = false) {
    const dishes = await this.getDishes();
    const index = dishes.findIndex(d => String(d[FIELDS.DISH_ID]) === String(id));
    if (index === -1) {
      return false;
    }

    if (isOffline) {
      const target = dishes[index];
      // Nếu món được tạo offline và chưa sync lên server, xóa hẳn khỏi local
      if (target[FIELDS.SYNC_STATUS] === 'pending_create') {
        dishes.splice(index, 1);
      } else {
        // Đánh dấu pending_delete để khi online sẽ xóa trên remote
        target[FIELDS.SYNC_STATUS] = 'pending_delete';
        target[FIELDS.UPDATED_AT] = Date.now();
      }
    } else {
      dishes.splice(index, 1);
    }

    await this.saveDishes(dishes);
    return true;
  }

  // ==========================================
  // SETTINGS (Language, Offline Simulation)
  // ==========================================

  static async getSettings() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_TABLES.SETTINGS);
      return data ? JSON.parse(data) : { language: 'en' };
    } catch {
      return { language: 'en' };
    }
  }

  static async saveSettings(settings) {
    try {
      const current = await this.getSettings();
      const updated = { ...current, ...settings };
      await AsyncStorage.setItem(STORAGE_TABLES.SETTINGS, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('[BIT240252_Storage] Error saving settings:', error);
      return null;
    }
  }

  /**
   * Khôi phục dữ liệu mẫu ban đầu (phục vụ test)
   */
  static async resetToInitial() {
    await AsyncStorage.setItem(STORAGE_TABLES.DISH_CATEGORY, JSON.stringify(INITIAL_CATEGORIES));
    await AsyncStorage.setItem(STORAGE_TABLES.DISH, JSON.stringify(INITIAL_DISHES));
    return { categories: INITIAL_CATEGORIES, dishes: INITIAL_DISHES };
  }
}
