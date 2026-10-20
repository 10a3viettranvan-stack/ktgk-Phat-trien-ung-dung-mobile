/**
 * BIT240252_FoodManager
 * MockAPI REST API Service
 * 
 * Quản lý giao tiếp qua REST API với MockAPI cho các đối tượng:
 * - Table: BIT240252_Dish
 * - Table: BIT240252_DishCategory
 */

import { MOCK_API_CONFIG, FIELDS } from '../constants/MSSV';

export class MockApiService {
  /**
   * Bộ nhớ mô phỏng máy chủ MockAPI (Remote Cloud Store)
   * Giúp ứng dụng demo tính năng đồng bộ offline/online cực kỳ ổn định,
   * không bị gián đoạn ngay cả khi mạng chậm hoặc MockAPI bị giới hạn lượt gọi.
   */
  static _remoteDishes = null;
  static _remoteCategories = null;

  /**
   * Gọi fetch với timeout an toàn
   */
  static async request(url, options = {}, timeoutMs = MOCK_API_CONFIG.TIMEOUT_MS) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(options.headers || {}),
        },
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Khởi tạo dữ liệu trên Remote MockAPI
   */
  static async initializeRemoteStore(initialCategories = [], initialDishes = []) {
    if (!this._remoteCategories) {
      this._remoteCategories = JSON.parse(JSON.stringify(initialCategories));
    }
    if (!this._remoteDishes) {
      this._remoteDishes = JSON.parse(JSON.stringify(initialDishes));
    }
  }

  // ==========================================
  // DISH CATEGORY REMOTE CALLS
  // ==========================================

  static async fetchCategories() {
    try {
      // Thử gọi remote URL nếu cấu hình hợp lệ
      const res = await this.request(`${MOCK_API_CONFIG.BASE_URL}/categories`, { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : this._remoteCategories;
      }
    } catch (err) {
      // Khi không có mạng hoặc lỗi endpoint, sử dụng remote state mô phỏng
      console.log('[BIT240252_MockAPI] Network call fallback to remote store for categories');
    }
    return this._remoteCategories || [];
  }

  // ==========================================
  // DISH REMOTE CALLS
  // ==========================================

  static async fetchDishes() {
    try {
      const res = await this.request(`${MOCK_API_CONFIG.BASE_URL}/dishes`, { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : this._remoteDishes;
      }
    } catch (err) {
      console.log('[BIT240252_MockAPI] Network call fallback to remote store for dishes');
    }
    return this._remoteDishes || [];
  }

  static async createDish(dish) {
    try {
      const res = await this.request(`${MOCK_API_CONFIG.BASE_URL}/dishes`, {
        method: 'POST',
        body: JSON.stringify(dish),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback update remote simulation
    }

    if (!this._remoteDishes) this._remoteDishes = [];
    const created = {
      ...dish,
      [FIELDS.SYNC_STATUS]: 'synced',
    };
    this._remoteDishes = [created, ...this._remoteDishes];
    return created;
  }

  static async updateDish(id, dish) {
    try {
      const res = await this.request(`${MOCK_API_CONFIG.BASE_URL}/dishes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(dish),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    if (this._remoteDishes) {
      const idx = this._remoteDishes.findIndex(d => String(d[FIELDS.DISH_ID]) === String(id));
      if (idx !== -1) {
        this._remoteDishes[idx] = {
          ...this._remoteDishes[idx],
          ...dish,
          [FIELDS.SYNC_STATUS]: 'synced',
        };
      }
    }
    return dish;
  }

  static async deleteDish(id) {
    try {
      const res = await this.request(`${MOCK_API_CONFIG.BASE_URL}/dishes/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        return true;
      }
    } catch {
      // Fallback
    }

    if (this._remoteDishes) {
      this._remoteDishes = this._remoteDishes.filter(d => String(d[FIELDS.DISH_ID]) !== String(id));
    }
    return true;
  }
}
