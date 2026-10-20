/**
 * BIT240252_FoodManager
 * Seed Initial Data
 * 
 * Đảm bảo:
 * - Ít nhất 03 loại món ăn
 * - Ít nhất 05 món ăn
 * - Mỗi món thuộc một loại
 * - Mỗi món có nhiều ảnh
 * - Tối đa 01 ảnh IsThumbnail = true
 * - Đầy đủ tiền tố BIT240252_ cho tất cả bảng và trường dữ liệu
 */

import { FIELDS } from '../constants/MSSV';

export const INITIAL_CATEGORIES = [
  {
    [FIELDS.CATEGORY_ID]: 'cat_appetizers',
    [FIELDS.CATEGORY_NAME]: 'Appetizers & Starters (Khai Vị)',
    [FIELDS.CATEGORY_DESCRIPTION]: 'Light, savory dishes and finger foods served before the main meal.',
  },
  {
    [FIELDS.CATEGORY_ID]: 'cat_main',
    [FIELDS.CATEGORY_NAME]: 'Main Dishes (Món chính)',
    [FIELDS.CATEGORY_DESCRIPTION]: 'Hearty, traditional Vietnamese and Asian noodle, rice, and signature hotpots.',
  },
  {
    [FIELDS.CATEGORY_ID]: 'cat_dessert',
    [FIELDS.CATEGORY_NAME]: 'Desserts (Tráng miệng)',
    [FIELDS.CATEGORY_DESCRIPTION]: 'Sweet pastries, puddings, flan, and refreshing sweet soups.',
  },
  {
    [FIELDS.CATEGORY_ID]: 'cat_beverage',
    [FIELDS.CATEGORY_NAME]: 'Beverages (Đồ uống)',
    [FIELDS.CATEGORY_DESCRIPTION]: 'Refreshing herbal teas, iced fruit coffees, and freshly squeezed juices.',
  },
];

export const INITIAL_DISHES = [
  {
    [FIELDS.DISH_ID]: 'dish_spring_rolls',
    [FIELDS.DISH_NAME]: 'Fresh Spring Rolls (Gỏi Cuốn Tôm Thịt)',
    [FIELDS.DISH_PRICE]: 45000,
    [FIELDS.DISH_PREPARATION_TIME]: 10, // <= 15 => Quick / Nhanh (10 phút)
    [FIELDS.DISH_IS_AVAILABLE]: true,
    [FIELDS.DISH_DESCRIPTION]: 'Fresh Vietnamese spring rolls wrapped in delicate rice paper with succulent poached prawns, tender pork belly slices, crisp fresh lettuce, aromatic mint herbs, and vermicelli noodles, paired with traditional rich peanut hoisin dipping sauce.',
    [FIELDS.DISH_CATEGORY_ID]: 'cat_appetizers',
    [FIELDS.DISH_IMAGE]: [
      {
        [FIELDS.IMAGE_URL]: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        [FIELDS.IS_THUMBNAIL]: true,
      },
      {
        [FIELDS.IMAGE_URL]: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
        [FIELDS.IS_THUMBNAIL]: false,
      },
    ],
    [FIELDS.SYNC_STATUS]: 'synced',
    [FIELDS.UPDATED_AT]: 1729000600000,
  },
  {
    [FIELDS.DISH_ID]: 'dish_pho_bo',
    [FIELDS.DISH_NAME]: 'Traditional Beef Pho (Phở Bò Tái Nạm)',
    [FIELDS.DISH_PRICE]: 65000,
    [FIELDS.DISH_PREPARATION_TIME]: 20, // > 15 => Regular
    [FIELDS.DISH_IS_AVAILABLE]: true,
    [FIELDS.DISH_DESCRIPTION]: 'Rich aromatic beef broth simmered for 12 hours with star anise, cinnamon, tender beef brisket and fresh flat rice noodles.',
    [FIELDS.DISH_CATEGORY_ID]: 'cat_main',
    [FIELDS.DISH_IMAGE]: [
      {
        [FIELDS.IMAGE_URL]: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
        [FIELDS.IS_THUMBNAIL]: true,
      },
      {
        [FIELDS.IMAGE_URL]: 'https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&w=800&q=80',
        [FIELDS.IS_THUMBNAIL]: false,
      },
    ],
    [FIELDS.SYNC_STATUS]: 'synced',
    [FIELDS.UPDATED_AT]: 1729000000000,
  },
  {
    [FIELDS.DISH_ID]: 'dish_com_tam',
    [FIELDS.DISH_NAME]: 'Broken Rice with Grilled Pork (Cơm Tấm Sườn Bì)',
    [FIELDS.DISH_PRICE]: 55000,
    [FIELDS.DISH_PREPARATION_TIME]: 15, // <= 15 => Quick
    [FIELDS.DISH_IS_AVAILABLE]: true,
    [FIELDS.DISH_DESCRIPTION]: 'Saigon-style fragrant broken rice topped with charcoal-grilled marinated pork chop, shredded pork skin, scallion oil, and house pickled daikon.',
    [FIELDS.DISH_CATEGORY_ID]: 'cat_main',
    [FIELDS.DISH_IMAGE]: [
      {
        [FIELDS.IMAGE_URL]: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
        [FIELDS.IS_THUMBNAIL]: true,
      },
      {
        [FIELDS.IMAGE_URL]: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
        [FIELDS.IS_THUMBNAIL]: false,
      },
    ],
    [FIELDS.SYNC_STATUS]: 'synced',
    [FIELDS.UPDATED_AT]: 1729000200000,
  },
  {
    [FIELDS.DISH_ID]: 'dish_flan',
    [FIELDS.DISH_NAME]: 'Caramel Creme Flan (Bánh Flan Caramel Cà Phê)',
    [FIELDS.DISH_PRICE]: 25000,
    [FIELDS.DISH_PREPARATION_TIME]: 5, // <= 15 => Quick
    [FIELDS.DISH_IS_AVAILABLE]: true,
    [FIELDS.DISH_DESCRIPTION]: 'Silky smooth egg pudding bathed in bittersweet amber caramel and a splash of Vietnamese espresso coffee on shaved ice.',
    [FIELDS.DISH_CATEGORY_ID]: 'cat_dessert',
    [FIELDS.DISH_IMAGE]: [
      {
        [FIELDS.IMAGE_URL]: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
        [FIELDS.IS_THUMBNAIL]: true,
      },
      {
        [FIELDS.IMAGE_URL]: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
        [FIELDS.IS_THUMBNAIL]: false,
      },
    ],
    [FIELDS.SYNC_STATUS]: 'synced',
    [FIELDS.UPDATED_AT]: 1729000300000,
  },
  {
    [FIELDS.DISH_ID]: 'dish_peach_tea',
    [FIELDS.DISH_NAME]: 'Peach Lemongrass Tea (Trà Đào Cam Sả)',
    [FIELDS.DISH_PRICE]: 38000,
    [FIELDS.DISH_PREPARATION_TIME]: 8, // <= 15 => Quick
    [FIELDS.DISH_IS_AVAILABLE]: true,
    [FIELDS.DISH_DESCRIPTION]: 'Crisp black tea infused with fragrant lemongrass, fresh orange slices, sweet peach syrup, and succulent yellow peach chunks.',
    [FIELDS.DISH_CATEGORY_ID]: 'cat_beverage',
    [FIELDS.DISH_IMAGE]: [
      {
        [FIELDS.IMAGE_URL]: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
        [FIELDS.IS_THUMBNAIL]: true,
      },
      {
        [FIELDS.IMAGE_URL]: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
        [FIELDS.IS_THUMBNAIL]: false,
      },
    ],
    [FIELDS.SYNC_STATUS]: 'synced',
    [FIELDS.UPDATED_AT]: 1729000400000,
  },
  {
    [FIELDS.DISH_ID]: 'dish_lau_thai',
    [FIELDS.DISH_NAME]: 'Spicy Seafood Hotpot (Lẩu Thái Hải Sản)',
    [FIELDS.DISH_PRICE]: 240000,
    [FIELDS.DISH_PREPARATION_TIME]: 30, // > 15 => Regular
    [FIELDS.DISH_IS_AVAILABLE]: false, // Ngừng bán
    [FIELDS.DISH_DESCRIPTION]: 'Signature Tom Yum seafood broth with jumbo river prawns, squid, clams, seasonal greens, mushrooms, and vermicelli.',
    [FIELDS.DISH_CATEGORY_ID]: 'cat_main',
    [FIELDS.DISH_IMAGE]: [
      {
        [FIELDS.IMAGE_URL]: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
        [FIELDS.IS_THUMBNAIL]: true,
      },
      {
        [FIELDS.IMAGE_URL]: 'https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=800&q=80',
        [FIELDS.IS_THUMBNAIL]: false,
      },
    ],
    [FIELDS.SYNC_STATUS]: 'synced',
    [FIELDS.UPDATED_AT]: 1729000500000,
  },
];
