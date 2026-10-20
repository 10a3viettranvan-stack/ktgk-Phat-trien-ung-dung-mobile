/**
 * BIT240252_FoodManager
 * SyncService - Cơ chế tự động đồng bộ dữ liệu Offline ↔ MockAPI
 * 
 * BẮT BUỘC (Phần nâng cao 1.5 điểm):
 * - Offline: lưu trữ thay đổi vào local AsyncStorage
 * - Online: tự động đồng bộ giữa Local và MockAPI, KHÔNG cần bấm nút "Đồng bộ"
 * - Không trùng lặp bản ghi, dữ liệu nhất quán
 */

import { StorageService } from './storageService';
import { MockApiService } from './mockApiService';
import { FIELDS } from '../constants/MSSV';

export class SyncService {
  static isSyncing = false;
  static isSimulatedOffline = false;
  static listeners = new Set();

  /**
   * Đăng ký lắng nghe sự kiện đồng bộ
   */
  static addListener(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  static notifyListeners(event, data) {
    this.listeners.forEach((listener) => {
      try {
        listener(event, data);
      } catch (err) {
        console.error('[BIT240252_SyncService] Listener error:', err);
      }
    });
  }

  /**
   * Bật/tắt chế độ giả lập offline để phục vụ quay video demo
   */
  static setSimulatedOffline(isOffline) {
    this.isSimulatedOffline = Boolean(isOffline);
    this.notifyListeners('network_change', { isOnline: !this.isSimulatedOffline });

    // Nếu vừa bật lại online, tự động kích hoạt đồng bộ ngay lập tức!
    if (!this.isSimulatedOffline) {
      console.log('[BIT240252_Sync] Network restored! Triggering auto-sync...');
      setTimeout(() => {
        this.performAutoSync();
      }, 500);
    }
  }

  static isOnline() {
    return !this.isSimulatedOffline;
  }

  /**
   * TỰ ĐỘNG ĐỒNG BỘ (Auto-sync) giữa AsyncStorage (Local) và MockAPI
   * Được gọi tự động khi phát hiện có mạng trở lại, không cần người dùng thao tác.
   */
  static async performAutoSync() {
    if (this.isSyncing || this.isSimulatedOffline) {
      return { success: false, reason: 'BUSY_OR_OFFLINE' };
    }

    this.isSyncing = true;
    this.notifyListeners('sync_start', {});

    try {
      const localDishes = await StorageService.getDishes();
      let hasChanges = false;
      const updatedLocalDishes = [];

      // 1. Đồng bộ các bản ghi Local có thay đổi lên MockAPI
      for (const dish of localDishes) {
        const syncStatus = dish[FIELDS.SYNC_STATUS];
        const id = dish[FIELDS.DISH_ID];

        if (syncStatus === 'pending_create') {
          // Gửi món mới tạo khi offline lên MockAPI
          await MockApiService.createDish(dish);
          updatedLocalDishes.push({
            ...dish,
            [FIELDS.SYNC_STATUS]: 'synced',
          });
          hasChanges = true;
        } else if (syncStatus === 'pending_update') {
          // Gửi cập nhật khi offline lên MockAPI
          await MockApiService.updateDish(id, dish);
          updatedLocalDishes.push({
            ...dish,
            [FIELDS.SYNC_STATUS]: 'synced',
          });
          hasChanges = true;
        } else if (syncStatus === 'pending_delete') {
          // Gửi lệnh xóa khi offline lên MockAPI
          await MockApiService.deleteDish(id);
          // Xóa vĩnh viễn khỏi local (không đưa vào updatedLocalDishes)
          hasChanges = true;
        } else {
          // Món đã đồng bộ trước đó
          updatedLocalDishes.push(dish);
        }
      }

      // 2. Lấy dữ liệu mới nhất từ MockAPI để hợp nhất (tránh trùng lặp)
      const remoteDishes = await MockApiService.fetchDishes();
      const existingIds = new Set(updatedLocalDishes.map(d => String(d[FIELDS.DISH_ID])));

      for (const remoteDish of remoteDishes) {
        if (!existingIds.has(String(remoteDish[FIELDS.DISH_ID]))) {
          updatedLocalDishes.push({
            ...remoteDish,
            [FIELDS.SYNC_STATUS]: 'synced',
          });
          hasChanges = true;
        }
      }

      // Lưu lại danh sách đã đồng bộ vào Local Storage
      if (hasChanges) {
        await StorageService.saveDishes(updatedLocalDishes);
      }

      this.isSyncing = false;
      this.notifyListeners('sync_complete', {
        dishes: updatedLocalDishes,
        timestamp: Date.now(),
      });

      return {
        success: true,
        dishes: updatedLocalDishes,
      };
    } catch (error) {
      this.isSyncing = false;
      console.error('[BIT240252_SyncService] Error during auto-sync:', error);
      this.notifyListeners('sync_error', { error });
      return { success: false, error };
    }
  }

  /**
   * Đếm số lượng thay đổi đang chờ đồng bộ
   */
  static async countPendingChanges() {
    const dishes = await StorageService.getDishes();
    return dishes.filter(d => d[FIELDS.SYNC_STATUS] && d[FIELDS.SYNC_STATUS] !== 'synced').length;
  }
}
