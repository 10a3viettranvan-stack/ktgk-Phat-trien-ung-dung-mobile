/**
 * BIT240252_FoodManager
 * Component: FilterBar
 * 
 * Đáp ứng đầy đủ mục 4.2:
 * - Tìm theo một phần tên món
 * - Lọc theo loại món ăn
 * - Lọc theo trạng thái đang bán (All / Available / Unavailable)
 * - Lọc theo khoảng giá (Min - Max) có kiểm tra tính hợp lệ
 * - Phối hợp đồng thời TẤT CẢ các điều kiện
 * - Sắp xếp theo giá tăng/giảm, thời gian chế biến tăng
 * - Giữ trạng thái khi quay về màn hình danh sách (lưu trong Context)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';
import { FIELDS } from '../constants/MSSV';

export const FilterBar = ({ totalCount, filteredCount }) => {
  const { filters, setFilters, resetFilters, categories, t } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);

  // Kiểm tra tính hợp lệ khoảng giá
  const minPriceNum = parseFloat(filters.minPrice);
  const maxPriceNum = parseFloat(filters.maxPrice);
  const isPriceRangeInvalid =
    !isNaN(minPriceNum) && !isNaN(maxPriceNum) && minPriceNum > maxPriceNum;

  // Đếm số lượng bộ lọc đang hoạt động
  const activeFiltersCount =
    (filters.searchQuery ? 1 : 0) +
    (filters.categoryId !== 'all' ? 1 : 0) +
    (filters.status !== 'all' ? 1 : 0) +
    (filters.minPrice || filters.maxPrice ? 1 : 0) +
    (filters.sortBy !== 'default' ? 1 : 0);

  return (
    <View style={styles.container}>
      {/* Search Input Bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={t('searchPlaceholder')}
            placeholderTextColor={COLORS.textMuted}
            value={filters.searchQuery}
            onChangeText={(text) => setFilters({ searchQuery: text })}
            clearButtonMode="while-editing"
          />
          {filters.searchQuery ? (
            <TouchableOpacity onPress={() => setFilters({ searchQuery: '' })}>
              <Text style={styles.clearSearchIcon}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter Expand / Collapse Button */}
        <TouchableOpacity
          style={[styles.filterToggleBtn, activeFiltersCount > 0 && styles.filterToggleBtnActive]}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <Text style={[styles.filterToggleText, activeFiltersCount > 0 && styles.filterToggleTextActive]}>
            ⚙️ {t('filters')} {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Quick Category Chips Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryChipsScroll}
      >
        <TouchableOpacity
          style={[
            styles.chip,
            filters.categoryId === 'all' && styles.chipActive,
          ]}
          onPress={() => setFilters({ categoryId: 'all' })}
        >
          <Text
            style={[
              styles.chipText,
              filters.categoryId === 'all' && styles.chipTextActive,
            ]}
          >
            {t('allCategories')}
          </Text>
        </TouchableOpacity>

        {categories.map((cat) => {
          const catId = String(cat[FIELDS.CATEGORY_ID]);
          const isSelected = filters.categoryId === catId;
          return (
            <TouchableOpacity
              key={catId}
              style={[styles.chip, isSelected && styles.chipActive]}
              onPress={() => setFilters({ categoryId: catId })}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                {cat[FIELDS.CATEGORY_NAME]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Expanded Filter Panel */}
      {isExpanded && (
        <View style={styles.expandedPanel}>
          {/* Status Filter */}
          <Text style={styles.sectionLabel}>{t('filterByStatus')}</Text>
          <View style={styles.statusChipsRow}>
            {[
              { id: 'all', labelKey: 'statusAll' },
              { id: 'available', labelKey: 'statusAvailableOnly' },
              { id: 'unavailable', labelKey: 'statusUnavailableOnly' },
            ].map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.statusChip,
                  filters.status === item.id && styles.statusChipActive,
                ]}
                onPress={() => setFilters({ status: item.id })}
              >
                <Text
                  style={[
                    styles.statusChipText,
                    filters.status === item.id && styles.statusChipTextActive,
                  ]}
                >
                  {t(item.labelKey)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Price Range Filter */}
          <Text style={styles.sectionLabel}>{t('priceRange')} ({t('currency')})</Text>
          <View style={styles.priceRow}>
            <TextInput
              style={[styles.priceInput, isPriceRangeInvalid && styles.inputError]}
              placeholder={t('minPrice')}
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              value={filters.minPrice}
              onChangeText={(text) => setFilters({ minPrice: text })}
            />
            <Text style={styles.priceSeparator}>—</Text>
            <TextInput
              style={[styles.priceInput, isPriceRangeInvalid && styles.inputError]}
              placeholder={t('maxPrice')}
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              value={filters.maxPrice}
              onChangeText={(text) => setFilters({ maxPrice: text })}
            />
          </View>
          {isPriceRangeInvalid && (
            <Text style={styles.errorText}>⚠️ {t('valMinMaxPriceInvalid')}</Text>
          )}

          {/* Sort By Options */}
          <Text style={styles.sectionLabel}>{t('sortBy')}</Text>
          <View style={styles.sortChipsRow}>
            {[
              { id: 'default', labelKey: 'sortDefault' },
              { id: 'price_asc', labelKey: 'sortPriceAsc' },
              { id: 'price_desc', labelKey: 'sortPriceDesc' },
              { id: 'preptime_asc', labelKey: 'sortPrepTimeAsc' },
            ].map((sortOption) => (
              <TouchableOpacity
                key={sortOption.id}
                style={[
                  styles.sortChip,
                  filters.sortBy === sortOption.id && styles.sortChipActive,
                ]}
                onPress={() => setFilters({ sortBy: sortOption.id })}
              >
                <Text
                  style={[
                    styles.sortChipText,
                    filters.sortBy === sortOption.id && styles.sortChipTextActive,
                  ]}
                >
                  {t(sortOption.labelKey)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Reset Filters Button */}
          <View style={styles.panelFooter}>
            <TouchableOpacity style={styles.resetBtn} onPress={resetFilters}>
              <Text style={styles.resetBtnText}>🔄 {t('resetFilter')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.collapseBtn}
              onPress={() => setIsExpanded(false)}
            >
              <Text style={styles.collapseBtnText}>{t('applyFilter')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Result Count Status Bar */}
      <View style={styles.counterRow}>
        <Text style={styles.counterText}>
          {t('totalDishes')}: <Text style={{ fontWeight: '700' }}>{filteredCount}</Text>
          {filteredCount !== totalCount ? ` / ${totalCount}` : ''}
        </Text>
        {activeFiltersCount > 0 && !isExpanded && (
          <TouchableOpacity onPress={resetFilters}>
            <Text style={styles.quickResetText}>✕ {t('resetFilter')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
    paddingBottom: 6,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 6,
    fontSize: 14,
  },
  clearSearchIcon: {
    padding: 4,
    color: COLORS.textMuted,
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    outlineStyle: 'none',
  },
  filterToggleBtn: {
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterToggleBtnActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  filterToggleText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  filterToggleTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  categoryChipsScroll: {
    paddingVertical: 10,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  expandedPanel: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 6,
  },
  statusChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  statusChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  statusChipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  statusChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 36,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  inputError: {
    borderColor: COLORS.danger,
    backgroundColor: '#FEF2F2',
  },
  priceSeparator: {
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  sortChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sortChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  sortChipActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  sortChipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  sortChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  panelFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  resetBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  resetBtnText: {
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: '700',
  },
  collapseBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  collapseBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 2,
  },
  counterText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  quickResetText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
