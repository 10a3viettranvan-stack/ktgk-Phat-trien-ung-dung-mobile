/**
 * BIT240252_FoodManager
 * Global Application Context
 * 
 * Quản lý trạng thái toàn cục:
 * - Danh sách món ăn & Danh mục (tiền tố BIT240252_)
 * - Ngôn ngữ hiển thị (Mặc định: 'en', chuyển đổi 'vi' và lưu vào AsyncStorage)
 * - Bộ lọc tìm kiếm, khoảng giá, trạng thái, sắp xếp (duy trì trạng thái khi chuyển màn hình)
 * - Trạng thái mạng & Tự động đồng bộ Offline/Online
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StorageService } from '../services/storageService';
import { SyncService } from '../services/syncService';
import { MockApiService } from '../services/mockApiService';
import { TRANSLATIONS } from '../constants/translations';
import { FIELDS } from '../constants/MSSV';

const AppContext = createContext(null);

export const DEFAULT_FILTERS = {
  searchQuery: '',
  categoryId: 'all',
  status: 'all', // 'all' | 'available' | 'unavailable'
  minPrice: '',
  maxPrice: '',
  sortBy: 'default', // 'default' | 'price_asc' | 'price_desc' | 'preptime_asc'
};

export const AppProvider = ({ children }) => {
  const [language, setLanguageState] = useState('en'); // Mặc định English
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [filters, setFiltersState] = useState(DEFAULT_FILTERS);
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Helper hàm dịch đa ngôn ngữ
  const t = useCallback(
    (key) => {
      const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
      return dict[key] !== undefined ? dict[key] : key;
    },
    [language]
  );

  // Đổi ngôn ngữ và lưu vào AsyncStorage
  const setLanguage = async (newLang) => {
    setLanguageState(newLang);
    await StorageService.saveSettings({ language: newLang });
  };

  // Cập nhật bộ lọc (giữ nguyên trạng thái khi đổi màn hình)
  const setFilters = (updatedFilters) => {
    setFiltersState((prev) => ({ ...prev, ...updatedFilters }));
  };

  const resetFilters = () => {
    setFiltersState(DEFAULT_FILTERS);
  };

  // Tải dữ liệu ban đầu
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      await StorageService.initializeStorage();

      const settings = await StorageService.getSettings();
      if (settings?.language) {
        setLanguageState(settings.language);
      }

      const cats = await StorageService.getCategories();
      const allDishes = await StorageService.getDishes();

      setCategories(cats);
      setDishes(allDishes);

      // Khởi tạo Remote MockAPI với dữ liệu ban đầu
      await MockApiService.initializeRemoteStore(cats, allDishes);

      // Kiểm tra số bản ghi chờ sync
      const pending = allDishes.filter(
        (d) => d[FIELDS.SYNC_STATUS] && d[FIELDS.SYNC_STATUS] !== 'synced'
      ).length;
      setPendingSyncCount(pending);
    } catch (error) {
      console.error('[BIT240252_AppContext] Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Đăng ký lắng nghe sự kiện từ SyncService
  useEffect(() => {
    loadInitialData();

    const unsubscribe = SyncService.addListener((event, data) => {
      if (event === 'network_change') {
        setIsOnline(data.isOnline);
      } else if (event === 'sync_start') {
        setIsSyncing(true);
      } else if (event === 'sync_complete') {
        setIsSyncing(false);
        if (data.dishes) {
          setDishes(data.dishes);
          setPendingSyncCount(0);
        }
      } else if (event === 'sync_error') {
        setIsSyncing(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Thao tác thêm món
  const addDish = async (dishData) => {
    const isOfflineMode = !isOnline;
    const newDish = await StorageService.addDish(dishData, isOfflineMode);

    // Cập nhật state cục bộ ngay lập tức
    setDishes((prev) => [newDish, ...prev]);

    if (isOfflineMode) {
      setPendingSyncCount((prev) => prev + 1);
    } else {
      // Nếu online, đồng bộ lên MockAPI
      try {
        await MockApiService.createDish(newDish);
      } catch (err) {
        console.warn('Could not immediately post to MockAPI, flagged for auto-sync', err);
      }
    }
    return newDish;
  };

  // Thao tác sửa món
  const updateDish = async (id, dishData) => {
    const isOfflineMode = !isOnline;
    const updatedDish = await StorageService.updateDish(id, dishData, isOfflineMode);

    setDishes((prev) =>
      prev.map((d) => (String(d[FIELDS.DISH_ID]) === String(id) ? updatedDish : d))
    );

    if (isOfflineMode) {
      setPendingSyncCount((prev) => prev + 1);
    } else {
      try {
        await MockApiService.updateDish(id, updatedDish);
      } catch (err) {
        console.warn('Could not immediately put to MockAPI, flagged for auto-sync', err);
      }
    }
    return updatedDish;
  };

  // Thao tác xóa món
  const deleteDish = async (id) => {
    const isOfflineMode = !isOnline;
    await StorageService.deleteDish(id, isOfflineMode);

    if (isOfflineMode) {
      // Khi offline, đánh dấu pending_delete
      setDishes((prev) =>
        prev.filter((d) => String(d[FIELDS.DISH_ID]) !== String(id))
      );
      setPendingSyncCount((prev) => prev + 1);
    } else {
      setDishes((prev) => prev.filter((d) => String(d[FIELDS.DISH_ID]) !== String(id)));
      try {
        await MockApiService.deleteDish(id);
      } catch (err) {
        console.warn('Could not immediately delete on MockAPI', err);
      }
    }
    return true;
  };

  // Thao tác thêm loại món
  const addCategory = async (catData) => {
    const newCat = await StorageService.addCategory(catData);
    setCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  // Thao tác xóa loại món (có kiểm tra ràng buộc không được xóa loại đang có món dùng)
  const deleteCategory = async (catId) => {
    const result = await StorageService.deleteCategory(catId);
    if (result.success) {
      setCategories((prev) =>
        prev.filter((c) => String(c[FIELDS.CATEGORY_ID]) !== String(catId))
      );
    }
    return result;
  };

  // Bật/tắt giả lập offline để quay video demo
  const toggleSimulatedOffline = (offlineState) => {
    SyncService.setSimulatedOffline(offlineState);
  };

  // Reset dữ liệu mẫu
  const resetToSampleData = async () => {
    const data = await StorageService.resetToInitial();
    setCategories(data.categories);
    setDishes(data.dishes);
    setPendingSyncCount(0);
    resetFilters();
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        categories,
        dishes,
        filters,
        setFilters,
        resetFilters,
        isOnline,
        isSyncing,
        pendingSyncCount,
        isLoading,
        addDish,
        updateDish,
        deleteDish,
        addCategory,
        deleteCategory,
        toggleSimulatedOffline,
        resetToSampleData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
