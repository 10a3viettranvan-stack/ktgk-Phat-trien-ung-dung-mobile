/**
 * BIT240252_FoodManager
 * Student Information & Storage Configuration Constants
 * MSSV: BIT240252
 * 
 * BẮT BUỘC: Mọi tên Bảng (Table) và tên trường dữ liệu (Field/Column) khi lưu trữ
 * đều phải có tiền tố BIT240252_ theo đúng yêu cầu đề bài.
 */

export const STUDENT_INFO = {
  MSSV: 'BIT240252',
  PROJECT_NAME: 'BIT240252_FoodManager',
  APP_TITLE: 'Food Manager BIT240252',
  SUBJECT: 'Phát triển ứng dụng di động',
  EXAM: 'Đề kiểm tra giữa kỳ - Quản lý món ăn',
};

// Tên bảng (Table / Storage Keys)
export const STORAGE_TABLES = {
  DISH_CATEGORY: 'BIT240252_DishCategory',
  DISH: 'BIT240252_Dish',
  SYNC_QUEUE: 'BIT240252_SyncQueue',
  SETTINGS: 'BIT240252_Settings',
};

// Tên các trường dữ liệu (Field / Column Names)
export const FIELDS = {
  // Category Fields
  CATEGORY_ID: 'BIT240252_Id',
  CATEGORY_NAME: 'BIT240252_Name',
  CATEGORY_DESCRIPTION: 'BIT240252_Description',

  // Dish Fields
  DISH_ID: 'BIT240252_Id',
  DISH_NAME: 'BIT240252_Name',
  DISH_PRICE: 'BIT240252_Price',
  DISH_PREPARATION_TIME: 'BIT240252_PreparationTime',
  DISH_IS_AVAILABLE: 'BIT240252_IsAvailable',
  DISH_DESCRIPTION: 'BIT240252_Description',
  DISH_CATEGORY_ID: 'BIT240252_DishCategoryId',
  DISH_IMAGE: 'BIT240252_DishImage',

  // Dish Image Sub-fields
  IMAGE_URL: 'BIT240252_ImageUrl',
  IS_THUMBNAIL: 'BIT240252_IsThumbnail',

  // Metadata / Offline Sync Fields
  SYNC_STATUS: 'BIT240252_SyncStatus', // 'synced' | 'pending_create' | 'pending_update' | 'pending_delete'
  UPDATED_AT: 'BIT240252_UpdatedAt',
};

// Preparation time threshold (minutes)
export const PREP_TIME_THRESHOLD_QUICK = 15;

// MockAPI default endpoint (can be customized by user or uses cloud mock endpoint)
export const MOCK_API_CONFIG = {
  // MockAPI base URL - configured for dishes and categories
  BASE_URL: 'https://660233269d7276a75552b9ae.mockapi.io/api/v1',
  TIMEOUT_MS: 5000,
};
