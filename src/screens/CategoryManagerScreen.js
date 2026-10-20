/**
 * BIT240252_FoodManager
 * Screen: CategoryManagerScreen (Quản lý loại món ăn)
 * 
 * Đáp ứng nghiệp vụ mục 4.4:
 * "Không cho xóa loại món đang được sử dụng"
 * - Hiển thị số món ăn thuộc từng loại
 * - Thêm loại món mới
 * - Ngăn chặn xóa loại món nếu đang có món sử dụng và hiển thị thông báo lỗi phù hợp
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { COLORS } from '../constants/colors';
import { FIELDS } from '../constants/MSSV';
import { DishCategoryModel } from '../models/DishCategoryModel';

export const CategoryManagerScreen = ({ onBack }) => {
  const { categories, dishes, addCategory, deleteCategory, t } = useApp();

  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Thêm loại món mới
  const handleAddCategory = async () => {
    const trimmedName = newCatName.trim();
    if (!trimmedName) {
      setErrorMsg(t('valNameRequired'));
      return;
    }

    const validation = DishCategoryModel.validate(
      { [FIELDS.CATEGORY_NAME]: trimmedName },
      categories
    );

    if (!validation.isValid) {
      setErrorMsg(t(validation.errors[FIELDS.CATEGORY_NAME]));
      return;
    }

    await addCategory({
      [FIELDS.CATEGORY_NAME]: trimmedName,
      [FIELDS.CATEGORY_DESCRIPTION]: newCatDesc.trim(),
    });

    setNewCatName('');
    setNewCatDesc('');
    setErrorMsg('');
  };

  // Xóa loại món có kiểm tra ràng buộc (Requirement 4.4)
  const handleDeleteAttempt = (cat) => {
    const catId = String(cat[FIELDS.CATEGORY_ID]);
    const linkedDishes = dishes.filter(
      (d) => String(d[FIELDS.DISH_CATEGORY_ID]) === catId
    );

    if (linkedDishes.length > 0) {
      // Ràng buộc nghiệp vụ: Không cho xóa loại món đang được sử dụng
      Alert.alert(
        t('cannotDeleteCategoryTitle'),
        `${t('cannotDeleteCategoryMsg')}\n\n• ${cat[FIELDS.CATEGORY_NAME]} (${linkedDishes.length} ${t('totalDishes')})`
      );
      return;
    }

    setCategoryToDelete(cat);
  };

  const handleConfirmDelete = async () => {
    if (categoryToDelete) {
      await deleteCategory(categoryToDelete[FIELDS.CATEGORY_ID]);
      setCategoryToDelete(null);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>← {t('back')}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('categoryManager')}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Add New Category Box */}
      <View style={styles.addBox}>
        <Text style={styles.sectionTitle}>+ {t('addCategory')}</Text>

        <TextInput
          style={[styles.input, errorMsg ? styles.inputError : null]}
          placeholder={t('categoryNamePlaceholder')}
          placeholderTextColor={COLORS.textMuted}
          value={newCatName}
          onChangeText={(text) => {
            setNewCatName(text);
            if (errorMsg) setErrorMsg('');
          }}
        />
        {errorMsg ? <Text style={styles.errorText}>⚠️ {errorMsg}</Text> : null}

        <TextInput
          style={[styles.input, { marginTop: 8 }]}
          placeholder={t('categoryDescPlaceholder')}
          placeholderTextColor={COLORS.textMuted}
          value={newCatDesc}
          onChangeText={setNewCatDesc}
        />

        <TouchableOpacity
          style={styles.addBtn}
          onPress={handleAddCategory}
        >
          <Text style={styles.addBtnText}>+ {t('addCategory')}</Text>
        </TouchableOpacity>
      </View>

      {/* List of Categories */}
      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>
          📂 {t('categoryListTitle')} ({categories.length})
        </Text>

        <FlatList
          data={categories}
          keyExtractor={(item) => String(item[FIELDS.CATEGORY_ID])}
          renderItem={({ item }) => {
            const catId = String(item[FIELDS.CATEGORY_ID]);
            const dishCount = dishes.filter(
              (d) => String(d[FIELDS.DISH_CATEGORY_ID]) === catId
            ).length;

            return (
              <View style={styles.categoryCard}>
                <View style={styles.catInfo}>
                  <Text style={styles.catName}>{item[FIELDS.CATEGORY_NAME]}</Text>
                  {item[FIELDS.CATEGORY_DESCRIPTION] ? (
                    <Text style={styles.catDesc} numberOfLines={2}>
                      {item[FIELDS.CATEGORY_DESCRIPTION]}
                    </Text>
                  ) : null}
                  <Text style={styles.dishCountBadge}>
                    🏷️ {dishCount} {t('categoryDishCount').toLowerCase()}
                  </Text>
                </View>

                {/* Delete button */}
                <TouchableOpacity
                  style={[
                    styles.deleteCatBtn,
                    dishCount > 0 && styles.deleteCatBtnDisabled,
                  ]}
                  onPress={() => handleDeleteAttempt(item)}
                >
                  <Text style={styles.deleteCatBtnText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            );
          }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Confirm Modal */}
      <ConfirmModal
        visible={categoryToDelete !== null}
        title={t('confirmDeleteTitle')}
        message={`${t('deleteCategoryMsg')} "${categoryToDelete?.[FIELDS.CATEGORY_NAME]}"?`}
        confirmText={t('delete')}
        cancelText={t('cancel')}
        onConfirm={handleConfirmDelete}
        onCancel={() => setCategoryToDelete(null)}
        isDanger={true}
      />
    </View>
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
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  addBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  inputError: {
    borderColor: COLORS.danger,
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  listSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  categoryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  catInfo: {
    flex: 1,
    paddingRight: 10,
  },
  catName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  catDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  dishCountBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  deleteCatBtn: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: COLORS.dangerLight,
  },
  deleteCatBtnDisabled: {
    opacity: 0.4,
  },
  deleteCatBtnText: {
    fontSize: 14,
  },
});
