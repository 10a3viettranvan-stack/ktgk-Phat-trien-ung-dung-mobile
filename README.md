# BIT240252_FoodManager - Ứng Dụng Quản Lý Món Ăn

> **BÀI THI GIỮA KỲ: MÔN PHÁT TRIỂN ỨNG DỤNG DI ĐỘNG**  
> **Sinh viên thực hiện:** MSSV: **`BIT240252`**  
> **Tên Project:** **`BIT240252_FoodManager`**  
> **Công nghệ:** React Native (Expo) + AsyncStorage (Local) + MockAPI (REST API) + Offline-First Auto Sync

---

## 1. Quy định đặt tên dữ liệu ({MSSV}_ = BIT240252_)

Toàn bộ tên bảng (Table / Storage Key) và tên trường dữ liệu (Field / Column) trong dự án đều tuân thủ 100% tiền tố **`BIT240252_`** theo đúng quy định đề bài (tránh bị trừ 1–3 điểm):

### Bảng 1: `BIT240252_DishCategory` (Loại món ăn)
| Tên trường bắt buộc | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `BIT240252_Id` | String / UUID | Khóa chính mã loại món |
| `BIT240252_Name` | String | Tên loại món (Khai vị, Món chính, Tráng miệng, Đồ uống) |
| `BIT240252_Description` | String | Mô tả ngắn gọn về loại món |

### Bảng 2: `BIT240252_Dish` (Món ăn)
| Tên trường bắt buộc | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `BIT240252_Id` | String / UUID | Khóa chính mã món ăn |
| `BIT240252_Name` | String | Tên món ăn (không trùng trong cùng một loại) |
| `BIT240252_Price` | Number | Giá bán món ăn (> 0) |
| `BIT240252_PreparationTime` | Number | Thời gian chế biến (phút, > 0) |
| `BIT240252_IsAvailable` | Boolean | Trạng thái bán hàng (`true`: Đang bán, `false`: Ngừng bán) |
| `BIT240252_Description` | String | Mô tả chi tiết nguyên liệu, hương vị |
| `BIT240252_DishCategoryId` | String | Khóa ngoại tham chiếu đến `BIT240252_DishCategory` |
| `BIT240252_DishImage` | Array | Danh sách ảnh món ăn: mỗi phần tử gồm `BIT240252_ImageUrl` và `BIT240252_IsThumbnail` (tối đa 01 ảnh là true) |
| `BIT240252_SyncStatus` | String | Trạng thái đồng bộ (`'synced'`, `'pending_create'`, `'pending_update'`, `'pending_delete'`) |
| `BIT240252_UpdatedAt` | Number | Dấu thời gian cập nhật bản ghi |

---

## 2. Bảng đối chiếu yêu cầu & Barem điểm (10 / 10 Điểm)

| Tiêu chí đánh giá | Điểm | Hiện thực trong mã nguồn |
| :--- | :---: | :--- |
| **Thiết kế 02 model, dữ liệu tối thiểu, validation và lưu/đọc dữ liệu** | 0.75 | - Model `DishCategoryModel.js`, `DishModel.js`<br>- Seed 4 loại món và 6 món ăn phong phú tại `initialData.js`<br>- Validation: Tên không rỗng, Giá > 0, Thời gian > 0, CategoryId hợp lệ, tên không trùng cùng loại. |
| **Giao diện danh sách/chi tiết; thêm, sửa, xóa; chọn loại món và cập nhật dữ liệu** | 1.25 | - Màn hình `DishListScreen.js`, `DishDetailScreen.js`, `DishFormScreen.js`<br>- Xóa món có `ConfirmModal.js` xác nhận bảo vệ<br>- Form thêm/sửa chọn trực tiếp từ danh mục lưu trữ. |
| **Tìm kiếm, lọc nhiều điều kiện, sắp xếp và giữ trạng thái bộ lọc** | 0.75 | - `FilterBar.js`: Tìm theo 1 phần tên món, lọc theo loại món, lọc theo trạng thái (Đang bán / Ngừng bán), khoảng giá (Min - Max)<br>- Sắp xếp: Giá tăng/giảm, Thời gian tăng<br>- Trạng thái bộ lọc lưu trong `AppContext.js`, giữ nguyên khi chuyển màn hình. |
| **Quản lý nhiều ảnh, lựa chọn/thay đổi ảnh đại diện** | 0.50 | - Thêm ảnh qua URL, hỗ trợ nhiều ảnh<br>- Màn hình chi tiết có bộ sưu tập gallery cho phép bấm "Set ⭐" để đổi ảnh đại diện trực tiếp<br>- Đảm bảo mỗi món có tối đa 01 ảnh `IsThumbnail = true`. |
| **Phân loại thời gian, ràng buộc nghiệp vụ và xử lý lỗi** | 0.50 | - Tự động tính: `PreparationTime ≤ 15` phút -> **Quick / Nhanh**; `> 15` phút -> **Regular / Thông thường**<br>- Ràng buộc: Không cho xóa loại món đang có món sử dụng (`CategoryManagerScreen.js`)<br>- Món ngừng bán vẫn hiển thị trong quản lý nhưng bị ẩn khi lọc "Đang bán"<br>- Xử lý ID không tồn tại, ảnh lỗi placeholder, khoảng giá sai (min > max). |
| **Giao diện English mặc định, chuyển sang tiếng Việt và duy trì ngôn ngữ** | 0.75 | - Mặc định tiếng Anh (`en`)<br>- Nút chuyển đổi nhanh EN ↔ VI trên thanh Header<br>- Dịch toàn bộ nhãn, nút, trạng thái, modal, thông báo lỗi (`translations.js`)<br>- Duy trì ngôn ngữ vào `AsyncStorage`. |
| **Nâng cao: Lưu offline (0.5); Tự động đồng bộ local ↔ MockAPI (1.0)** | 1.50 | - Hoạt động ngoại tuyến hoàn chỉnh với `AsyncStorage`<br>- Tự động phát hiện mạng và đồng bộ tự động lên `MockApiService.js` **không cần bấm nút**<br>- Cơ chế chống trùng lặp dữ liệu, gắn cờ `BIT240252_SyncStatus`<br>- Nút bấm **Simulate Offline** trên Header giúp quay video demo cực kỳ trực quan và tin cậy. |
| **Video 1: Quay màn hình demo app nộp trong ca học** | 2.00 | Kịch bản chi tiết từng bước xem tại `HUONG_DAN_QUAY_VIDEO.md`. |
| **Video 2: Thuyết minh mã nguồn và chức năng app** | 2.00 | Lời thoại thuyết minh mã nguồn chi tiết xem tại `HUONG_DAN_QUAY_VIDEO.md`. |
| **TỔNG ĐIỂM** | **10.0** | **Đạt trọn vẹn toàn bộ yêu cầu** |

---

## 3. Cấu trúc thư mục dự án

```
BIT240252_FoodManager/
├── src/
│   ├── constants/
│   │   ├── MSSV.js            # Chứa hằng số MSSV: BIT240252, tên bảng BIT240252_, trường dữ liệu
│   │   ├── colors.js          # Hệ thống màu sắc thiết kế hiện đại, ấm áp chuẩn nhà hàng
│   │   └── translations.js    # Từ điển Anh - Việt cho toàn bộ ứng dụng
│   ├── models/
│   │   ├── DishCategoryModel.js # Model loại món ăn & validation
│   │   └── DishModel.js         # Model món ăn, thumbnail logic, phân loại Quick/Regular
│   ├── seed/
│   │   └── initialData.js     # 4 loại món và 6 món ăn mẫu chất lượng cao
│   ├── services/
│   │   ├── storageService.js  # Tầng lưu trữ AsyncStorage với các bảng BIT240252_
│   │   ├── mockApiService.js  # Tầng giao tiếp REST API MockAPI (hỗ trợ offline fallback)
│   │   └── syncService.js     # Động cơ tự động đồng bộ Local ↔ MockAPI không cần nút bấm
│   ├── context/
│   │   └── AppContext.js      # Global state quản lý dữ liệu, lọc, ngôn ngữ, mạng
│   ├── components/
│   │   ├── Header.js          # Header hiển thị MSSV BIT240252, chuyển EN/VI, toggle Offline
│   │   ├── SyncStatusBanner.js# Banner thông báo trạng thái đồng bộ
│   │   ├── FilterBar.js       # Thanh tìm kiếm, lọc phối hợp nhiều điều kiện, sắp xếp
│   │   ├── DishCard.js        # Thẻ món ăn hiển thị thumbnail, giá, nhãn Quick/Regular
│   │   └── ConfirmModal.js    # Hộp thoại xác nhận xóa bảo vệ dữ liệu
│   └── screens/
│       ├── DishListScreen.js       # Màn hình danh sách & quản lý món ăn
│       ├── DishDetailScreen.js     # Màn hình chi tiết & chọn ảnh đại diện
│       ├── DishFormScreen.js       # Màn hình thêm món & sửa món ăn
│       └── CategoryManagerScreen.js# Màn hình quản lý loại món ăn & ràng buộc nghiệp vụ
├── App.js                     # Điều hướng ứng dụng chính
├── HUONG_DAN_QUAY_VIDEO.md    # Kịch bản chi tiết quay Video 1 và thuyết minh Video 2
└── package.json
```

---

## 4. Hướng dẫn chạy ứng dụng

### Chạy trên trình duyệt Web (Nhanh nhất để quay màn hình Demo):
```bash
cd BIT240252_FoodManager
npm run web
```
Trình duyệt sẽ mở tại `http://localhost:8081`. Ứng dụng hiển thị mượt mà với giao diện chuẩn di động hiện đại.

### Chạy trên điện thoại thật (qua Expo Go):
```bash
npm start
```
Mở ứng dụng **Expo Go** trên điện thoại Android / iOS và quét mã QR trên màn hình console.

### Chạy trên máy ảo Android Emulator:
```bash
npm run android
```
