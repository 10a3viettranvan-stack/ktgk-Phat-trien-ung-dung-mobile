/**
 * BIT240252_FoodManager
 * Screen: DishListScreen (Màn hình danh sách món ăn)
 * 
 * Đáp ứng:
 * 4.1. Danh sách món ăn, chi tiết món ăn, thêm món, sửa món, xóa có xác nhận.
 * 4.2. Tìm theo một phần tên món; lọc theo loại, trạng thái đang bán, khoảng giá;
 *      phối hợp đồng thời các điều kiện; sắp xếp theo giá tăng/giảm, thời gian chế biến tăng;
 *      giữ các điều kiện đã chọn khi quay về màn hình.
 * 4.4. Món ngừng bán vẫn xuất hiện trong danh sách quản lý nhưng không xuất hiện khi lọc trạng thái đang bán.
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { FilterBar } from '../components/FilterBar';
import { DishCard } from '../components/DishCard';
import { ConfirmModal } from '../components/ConfirmModal';
import { COLORS } from '../constants/colors';
import { FIELDS } from '../constants/MSSV';

export const DishListScreen = ({ onSelectDish, onAddDish, onEditDish }) => {
  const { dishes, filters, deleteDish, isLoading, t } = useApp();
  const [dishToDelete, setDishToDelete] = useState(null);

  // Áp dụng phối hợp ĐỒNG THỜI các điều kiện tìm kiếm, lọc và sắp xếp
  const filteredDishes = useMemo(() => {
    return dishes
      .filter((dish) => {
        // 1. Tìm theo một phần tên món (không phân biệt hoa thường)
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase().trim();
          const name = (dish[FIELDS.DISH_NAME] || '').toLowerCase();
          if (!name.includes(query)) {
            return false;
          }
        }

        // 2. Lọc theo loại món ăn
        if (filters.categoryId !== 'all') {
          if (String(dish[FIELDS.DISH_CATEGORY_ID]) !== String(filters.categoryId)) {
            return false;
          }
        }

        // 3. Lọc theo trạng thái đang bán
        // "món ngừng bán vẫn xuất hiện trong danh sách quản lý, nhưng không xuất hiện khi lọc trạng thái đang bán"
        if (filters.status === 'available') {
          if (!dish[FIELDS.DISH_IS_AVAILABLE]) return false;
        } else if (filters.status === 'unavailable') {
          if (dish[FIELDS.DISH_IS_AVAILABLE]) return false;
        }

        // 4. Lọc theo khoảng giá (Min - Max)
        const price = Number(dish[FIELDS.DISH_PRICE]) || 0;
        const minPrice = parseFloat(filters.minPrice);
        const maxPrice = parseFloat(filters.maxPrice);

        if (!isNaN(minPrice) && price < minPrice) {
          return false;
        }
        if (!isNaN(maxPrice) && price > maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Sắp xếp
        if (filters.sortBy === 'price_asc') {
          return (Number(a[FIELDS.DISH_PRICE]) || 0) - (Number(b[FIELDS.DISH_PRICE]) || 0);
        }
        if (filters.sortBy === 'price_desc') {
          return (Number(b[FIELDS.DISH_PRICE]) || 0) - (Number(a[FIELDS.DISH_PRICE]) || 0);
        }
        if (filters.sortBy === 'preptime_asc') {
          return (
            (Number(a[FIELDS.DISH_PREPARATION_TIME]) || 0) -
            (Number(b[FIELDS.DISH_PREPARATION_TIME]) || 0)
          );
        }
        // Default: mới nhất lên đầu
        return (Number(b[FIELDS.UPDATED_AT]) || 0) - (Number(a[FIELDS.UPDATED_AT]) || 0);
      });
  }, [dishes, filters]);

  const handleDeleteConfirm = async () => {
    if (dishToDelete) {
      await deleteDish(dishToDelete[FIELDS.DISH_ID]);
      setDishToDelete(null);
    }
  };

  return (
    <View style={styles.container}>
      {/* Bộ lọc và Tìm kiếm phối hợp */}
      <FilterBar
        totalCount={dishes.length}
        filteredCount={filteredDishes.length}
      />

      {/* Danh sách món ăn */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading dishes...</Text>
        </View>
      ) : filteredDishes.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyIcon}>🍽️</Text>
          <Text style={styles.emptyTitle}>{t('noDishesFound')}</Text>
          <Text style={styles.emptySubtitle}>{t('emptyListHint')}</Text>

          <TouchableOpacity style={styles.addNewEmptyBtn} onPress={onAddDish}>
            <Text style={styles.addNewEmptyBtnText}>+ {t('createDish')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredDishes}
          keyExtractor={(item) => String(item[FIELDS.DISH_ID])}
          renderItem={({ item }) => (
            <DishCard
              dish={item}
              onSelect={onSelectDish}
              onEdit={onEditDish}
              onDelete={(dish) => setDishToDelete(dish)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Floating Action Button (FAB) Thêm món */}
      <TouchableOpacity
        style={styles.fab}
        onPress={onAddDish}
        activeOpacity={0.8}
        accessibilityLabel="Add New Dish"
      >
        <Text style={styles.fabIcon}>＋</Text>
        <Text style={styles.fabText}>{t('addNewDish')}</Text>
      </TouchableOpacity>

      {/* Modal Xác nhận xóa món ăn */}
      <ConfirmModal
        visible={dishToDelete !== null}
        title={t('confirmDeleteTitle')}
        message={`${t('confirmDeleteDishMsg')}\n\n• ${dishToDelete?.[FIELDS.DISH_NAME] || ''}`}
        confirmText={t('delete')}
        cancelText={t('cancel')}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDishToDelete(null)}
        isDanger={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    position: 'relative',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 90, // Chừa khoảng trống cho FAB
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  addNewEmptyBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addNewEmptyBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    gap: 6,
  },
  fabIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
