# HƯỚNG DẪN QUAY VIDEO DEMO VÀ THUYẾT MINH MÃ NGUỒN
### DÀNH CHO SINH VIÊN: MSSV `BIT240252` - PROJECT `BIT240252_FoodManager`

Đề thi yêu cầu nộp **02 Video** bắt buộc (Tổng chiếm 4.0 / 10.0 điểm). Dưới đây là kịch bản chi tiết, từng bước thao tác và lời thoại chuẩn bị sẵn để bạn chỉ việc đọc theo và quay màn hình.

---

# PHẦN 1: KỊCH BẢN VIDEO 1 – DEMO CHỨNG MINH TÍNH NĂNG (2.0 ĐIỂM)
> **Thời lượng khuyến nghị:** 3 – 5 phút  
> **Thời hạn nộp:** Nộp ngay trong ca học kiểm tra trên LMS kèm link Git.  
> **Cách quay:** Dùng OBS Studio, Bandicam, Windows Game Bar (`Win + G`) hoặc QuickTime quay toàn màn hình hoặc cửa sổ app.

### BƯỚC 1: Mở đầu & Giới thiệu định danh (15 giây)
- Mở ứng dụng chạy trên web (`http://localhost:8081`) hoặc máy ảo / điện thoại thật.
- Chỉ con trỏ chuột vào góc trên bên trái Header:
  - **Badge MSSV:** `BIT240252`
  - **Tên project:** `BIT240252_FoodManager`
- **Lời nói:** *"Em xin chào Thầy/Cô. Em là sinh viên có MSSV là BIT240252. Sau đây em xin phép quay video demo ứng dụng Quản lý món ăn cho bài kiểm tra giữa kỳ với tên project là BIT240252_FoodManager."*

### BƯỚC 2: Demo Đa ngôn ngữ English ↔ Tiếng Việt (30 giây)
- Mặc định ứng dụng đang là **English** (EN).
- Bấm vào nút **VI** trên thanh Header:
  - Quan sát toàn bộ tiêu đề, nhãn tìm kiếm, nút lọc, thẻ món ăn, trạng thái "Đang bán / Ngừng bán", "Nhanh / Thông thường", đơn vị "đ" lập tức chuyển sang tiếng Việt.
- Bấm lại nút **EN** để chứng minh chuyển đổi mượt mà. Đề bài yêu cầu mặc định là English nên bạn có thể để English hoặc Tiếng Việt để demo tiếp.
- **Lời nói:** *"Giao diện mặc định là tiếng Anh. Ứng dụng hỗ trợ chuyển đổi linh hoạt sang tiếng Việt và lưu ngôn ngữ đã chọn vào AsyncStorage."*

### BƯỚC 3: Demo Danh sách, Phân loại thời gian & Chi tiết món (45 giây)
- Lướt xem danh sách các món ăn đã được tạo sẵn (Phở Bò, Chả Giò, Cơm Tấm, Bánh Flan, Trà Đào, Lẩu Thái).
- Chỉ rõ nhãn thời gian chế biến:
  - Món nào `<= 15 phút` (như Chả giò 12p, Bánh flan 5p, Cơm tấm 15p) hiển thị huy hiệu xanh: **⚡ Quick / Nhanh**.
  - Món nào `> 15 phút` (như Phở bò 20p, Lẩu thái 30p) hiển thị huy hiệu tím: **⏱️ Regular / Thông thường**.
- Bấm vào một món ăn (ví dụ **Traditional Beef Pho**) để mở **Màn hình chi tiết (Dish Detail)**:
  - Xem danh sách nhiều ảnh trong bộ sưu tập (Gallery).
  - Bấm chọn từng ảnh thumbnail nhỏ để phóng to ảnh chính.
  - **Thao tác đổi ảnh đại diện (Thumbnail):** Bấm nút **"Set ⭐"** ở ảnh thứ 2 -> Quan sát huy hiệu `⭐ Thumbnail` chuyển sang ảnh thứ 2.
  - Bấm nút **"Back / Quay lại"** -> Món Phở Bò ngoài danh sách đã tự động cập nhật ảnh đại diện mới.

### BƯỚC 4: Demo Tìm kiếm, Lọc nhiều điều kiện đồng thời & Sắp xếp (60 giây)
- **Tìm kiếm theo một phần tên:** Gõ chữ `pho` vào ô tìm kiếm -> Chỉ còn món Phở Bò. Xóa tìm kiếm.
- **Lọc theo loại món:** Bấm chip `Appetizers (Món khai vị)` -> Chỉ hiển thị món Chả Giò. Bấm lại `All Categories`.
- **Phối hợp đồng thời nhiều điều kiện:**
  - Bấm nút `⚙️ Filters`:
  - Chọn trạng thái: `Available Only (Đang bán)` -> Món Lẩu Thái (đang ngừng bán) biến mất.
  - Nhập khoảng giá: Giá từ `40000` đến `70000`.
  - Chọn sắp xếp: `Price: Low to High` (Giá tăng dần).
  - Bấm `Apply` -> Kết quả lọc ra các món thỏa mãn đồng thời tất cả các tiêu chí trên!
  - Bấm vào chi tiết một món, rồi bấm quay lại -> **Trạng thái bộ lọc vẫn được giữ nguyên** (đáp ứng đúng tiêu chí barem chấm).
  - Bấm `Reset Filters` để trả về mặc định.

### BƯỚC 5: Demo Thêm mới (Create) & Chỉnh sửa (Edit) có Validation (45 giây)
- Bấm nút **"＋ Add Dish"** ở góc dưới phải.
- **Thử nghiệm Validation:**
  - Để trống tên món ăn, nhập giá = 0, thời gian = 0 -> Bấm Save -> Hệ thống báo lỗi đỏ:
    - *"Dish name cannot be empty"*
    - *"Price must be greater than 0"*
    - *"Preparation time must be greater than 0 minutes"*
  - Thử nhập tên trùng với món đã có trong cùng một loại -> Báo lỗi: *"A dish with this name already exists in this category"*.
- **Nhập dữ liệu hợp lệ:**
  - Tên món: `Bún Chả Hà Nội`
  - Chọn loại: `Main Dishes (Món chính)`
  - Giá: `60000`
  - Thời gian: `12` phút (quan sát live preview hiển thị nhãn `Quick`)
  - Bấm nút `+ Fill Sample Images` để tự động điền URL ảnh chất lượng cao.
  - Bấm `Save Dish` -> Món mới xuất hiện ngay lập tức ở đầu danh sách!
- **Thử sửa món (Edit):** Bấm nút `✏️ Edit` trên thẻ món vừa tạo -> Sửa giá thành `65000` -> Lưu -> Dữ liệu cập nhật ngay.

### BƯỚC 6: Demo Ràng buộc xóa loại món (30 giây)
- Bấm vào nút `🏷️ Categories` trên Header.
- Danh sách hiển thị các loại món kèm số lượng món ăn đang trực thuộc.
- Thử bấm nút 🗑️ xóa loại món `Main Dishes` (đang có 3 món trực thuộc) -> **Hệ thống từ chối xóa** và hiện cảnh báo: *"Cannot Delete Category: This category is currently assigned to one or more dishes..."*.
- Thêm một loại món mới thử nghiệm `Món Ăn Vặt`, loại này chưa có món nào -> Xóa thành công.

### BƯỚC 7: DEMO NÂNG CAO – HOẠT ĐỘNG OFFLINE & TỰ ĐỘNG ĐỒNG BỘ (60 giây)
- Đây là tính năng lấy trọn 1.5 điểm nâng cao:
1. **Chuyển sang Offline:** Bấm nút **"⚡ Simulate Offline"** trên Header -> Dấu chấm chuyển sang màu đỏ, hiện thông báo: *Network: Offline, Offline Mode active*.
2. **Thao tác khi offline:**
   - Bấm `+ Add Dish` thêm một món mới: `Mì Quảng Đà Nẵng`, giá `50000`, thời gian `10` phút.
   - Bấm `Save Dish` -> Món ăn vẫn được lưu thành công vào Local Storage (AsyncStorage) và trên thẻ món xuất hiện huy hiệu **`💾 Local`**. Thanh Header báo **`1 unsynced change(s)`**.
3. **Bật mạng trở lại:**
   - Bấm nút **"🌐 Go Online"** trên Header.
   - **Quan sát kết quả tự động:**
     - Ứng dụng lập tức tự động kích hoạt tiến trình đồng bộ (hiện badge `🔄 Syncing...`).
     - **Hoàn toàn KHÔNG cần người dùng bấm bất kỳ nút "Đồng bộ" nào!**
     - Sau 1 giây, trạng thái chuyển thành `All changes synced`, huy hiệu `💾 Local` biến mất, dữ liệu đã được đẩy lên MockAPI an toàn và nhất quán!
- **Kết thúc Video 1:** Bấm xóa món test `Bún Chả Hà Nội` -> Hiện hộp thoại xác nhận `Confirm Delete` -> Bấm Confirm -> Món biến mất. Chào kết thúc video.

---

# PHẦN 2: KỊCH BẢN VIDEO 2 – THUYẾT MINH MÃ NGUỒN (2.0 ĐIỂM)
> **Thời lượng khuyến nghị:** 5 – 8 phút  
> **Thời hạn nộp:** Trước 23/10/2026 trên LMS.  
> **Cách quay:** Mở VS Code / Antigravity IDE, quay màn hình và dùng micro thuyết minh theo các file mã nguồn.

### ĐOẠN 1: Giới thiệu kiến trúc tổng thể (1 phút)
**Lời thoại:**  
*"Kính chào Thầy/Cô. Em là sinh viên thực hiện bài thi với MSSV là BIT240252. Sau đây em xin thuyết minh cấu trúc mã nguồn dự án BIT240252_FoodManager.*  
*Dự án được xây dựng bằng React Native trên nền tảng Expo, kết hợp lưu trữ local bằng AsyncStorage và kết nối dịch vụ MockAPI qua REST API theo kiến trúc Offline-First tự động đồng bộ hai chiều.*  
*Cấu trúc thư mục được phân tách rõ ràng thành các tầng: constants, models, seed, services, context, components và screens."*

### ĐOẠN 2: Chỉ rõ quy định MSSV BIT240252 trong Table và Field (CỰC KỲ QUAN TRỌNG) (2 phút)
- **Mở file:** `src/constants/MSSV.js`
- **Lời thoại:**  
*"Theo quy định của đề bài, toàn bộ tên bảng và tên trường dữ liệu khi lưu trữ bắt buộc phải có tiền tố MSSV ở đầu. Vì MSSV của em là BIT240252, em đã định nghĩa rõ ràng trong file MSSV.js:*  
*1. Tên bảng lưu trữ:*
- `STORAGE_TABLES.DISH_CATEGORY` = `'BIT240252_DishCategory'`
- `STORAGE_TABLES.DISH` = `'BIT240252_Dish'`

*2. Tên các trường dữ liệu của Category đều có tiền tố BIT240252_:*
- `BIT240252_Id`, `BIT240252_Name`, `BIT240252_Description`

*3. Tên các trường dữ liệu của Dish:*
- `BIT240252_Id`, `BIT240252_Name`, `BIT240252_Price`, `BIT240252_PreparationTime`, `BIT240252_IsAvailable`, `BIT240252_Description`, `BIT240252_DishCategoryId`
- Danh sách hình ảnh `BIT240252_DishImage` gồm các đối tượng có thuộc tính `BIT240252_ImageUrl` và `BIT240252_IsThumbnail`."*

### ĐOẠN 3: Thuyết minh Model, Validation và Xử lý ảnh (1.5 phút)
- **Mở file:** `src/models/DishModel.js`
- **Lời thoại:**  
*"Trong file DishModel.js:*  
- *Hàm `normalizeImages()` đảm bảo mỗi món ăn chỉ có tối đa 01 ảnh có `IsThumbnail = true`. Nếu chưa có ảnh nào thì mặc định ảnh đầu tiên làm thumbnail.*  
- *Hàm `isQuickDish()` thực hiện phân loại thời gian chế biến: nếu thời gian <= 15 phút trả về Quick, ngược lại là Regular mà không cần lưu thêm trường dư thừa vào cơ sở dữ liệu.*  
- *Hàm `validate()` kiểm tra đầy đủ 5 tiêu chí: Name không rỗng, Price > 0, PreparationTime > 0, CategoryId hợp lệ, và đặc biệt là kiểm tra tên món không trùng trong cùng một loại danh mục, có loại trừ chính ID món đó khi thực hiện chức năng Edit."*

### ĐOẠN 4: Thuyết minh Tầng Lưu Trữ & Ràng buộc nghiệp vụ (1.5 phút)
- **Mở file:** `src/services/storageService.js`
- **Lời thoại:**  
*"Tầng StorageService chịu trách nhiệm giao tiếp với AsyncStorage:*  
- *Hàm `initializeStorage()` tự động nạp dữ liệu khởi tạo gồm 4 loại món và 6 món ăn mẫu phong phú nếu thiết bị chưa có dữ liệu.*  
- *Hàm `deleteCategory()` cài đặt ràng buộc nghiệp vụ: kiểm tra xem có món ăn nào đang tham chiếu tới loại món này hay không (`isCategoryInUse`). Nếu có, hàm trả về lỗi và chặn thao tác xóa, đảm bảo toàn vẹn dữ liệu quan hệ trên AsyncStorage."*

### ĐOẠN 5: Thuyết minh Cơ chế Hoạt động Offline & Tự động đồng bộ với MockAPI (2 phút)
- **Mở file:** `src/services/syncService.js` và `src/services/mockApiService.js`
- **Lời thoại:**  
*"Để đạt điểm tối đa ở phần Nâng cao, em xây dựng SyncService hoạt động như sau:*  
1. *Khi thiết bị mất kết nối (hoặc bật Simulate Offline): mọi thao tác thêm, sửa, xóa đều được thực hiện trơn tru trên AsyncStorage và gán cờ `BIT240252_SyncStatus` tương ứng là `pending_create`, `pending_update` hoặc `pending_delete`.*  
2. *Khi có mạng trở lại: `SyncService` phát hiện trạng thái mạng phục hồi và tự động gọi hàm `performAutoSync()`. Người dùng không cần bấm bất kỳ nút nào.*  
3. *Hàm `performAutoSync()` duyệt qua các bản ghi pending để gọi API tương ứng (`POST`, `PUT`, `DELETE`) lên MockAPI qua `MockApiService`. Sau khi thành công, trạng thái cục bộ được cập nhật thành `'synced'`.*  
4. *Thuật toán hợp nhất dữ liệu sử dụng `Set(existingIds)` dựa trên `BIT240252_Id` giúp ngăn chặn triệt để việc phát sinh bản ghi trùng lặp.*  
5. *Giao diện ứng dụng đăng ký lắng nghe sự kiện qua pattern Listener/Observer, nên khi đồng bộ xong, UI sẽ tự động làm mới ngay lập tức mà không cần tải lại trang."*

### ĐOẠN 6: Thuyết minh Đa ngôn ngữ và Kết luận (30 giây)
- **Mở file:** `src/constants/translations.js` và `src/context/AppContext.js`
- **Lời thoại:**  
*"Hệ thống đa ngôn ngữ được cấu hình tập trung tại translations.js với ngôn ngữ mặc định là English (en) và Tiếng Việt (vi). Ngôn ngữ và toàn bộ trạng thái bộ lọc được quản lý tập trung trong AppContext, giúp giữ nguyên bộ lọc khi chuyển đổi giữa các màn hình.*  
*Em xin cảm ơn Thầy/Cô đã theo dõi phần thuyết minh của em!"*
