CREATE DATABASE IF NOT EXISTS db_printerest;
USE db_printerest;

-- 1. Bảng Người dùng
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar VARCHAR(255),
    age INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Bảng Hình ảnh (Các Pin được đăng)
CREATE TABLE images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    url VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Bảng Bình luận
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    user_id INT NOT NULL,
    image_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE
);

-- 4. Bảng Lưu ảnh (Quan hệ n-n giữa Users và Images)
CREATE TABLE saved_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    image_id INT NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE
);
USE db_printerest;

-- ========================================================
-- 1. CHÈN DỮ LIỆU MẪU CHO BẢNG USERS (Để làm khóa ngoại)
-- ========================================================
INSERT IGNORE INTO users (id, email, password, full_name, avatar, age) VALUES
(1, 'anhtai@gmail.com', '$2b$10$X7z8r9Yx...', 'Phan Xuân Anh Tài', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde', 22),
(2, 'nguyenvana@gmail.com', '$2b$10$X7z8r9Yx...', 'Nguyễn Văn A', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', 25),
(3, 'lethib@gmail.com', '$2b$10$X7z8r9Yx...', 'Lê Thị B', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61', 23);

-- ========================================================
-- 2. CHÈN 10 DÒNG DỮ LIỆU MẪU CHO BẢNG IMAGES
-- ========================================================
INSERT INTO images (title, description, url, user_id) VALUES
-- Ảnh 1: Chủ đề Công nghệ / Setup làm việc
('Minimalist Workspace Setup', 'Một góc làm việc gọn gàng, tối giản mang phong cách Scandinavian với tông màu trắng chủ đạo giúp tăng tối đa hiệu suất làm việc.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', 1),

-- Ảnh 2: Chủ đề Du lịch / Thiên nhiên
('Đỉnh Đèo Hải Vân Flycam', 'Góc nhìn hùng vĩ từ trên cao chụp lại cung đường đèo Hải Vân uốn lượn giữa một bên là vách núi, một bên là biển xanh.', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', 1),

-- Ảnh 3: Chủ đề Ẩm thực
('Bánh Mì Thịt Nướng Sài Gòn', 'Món ăn đường phố đặc trưng của Việt Nam với lớp vỏ giòn rụm, nhân thịt nướng thơm phức kết hợp đồ chua và nước sốt đậm đà.', 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78', 2),

-- Ảnh 4: Chủ đề Kiến trúc / Nhà cửa
('Modern Living Room Design', 'Ý tưởng thiết kế phòng khách không gian mở hiện đại, tận dụng ánh sáng tự nhiên từ hệ thống kính lớn sát trần.', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace', 2),

-- Ảnh 5: Chủ đề Thú cưng
('Cute British Shorthair Cat', 'Chú mèo Anh lông ngắn màu xám tro siêu đáng yêu đang nằm lười sưởi nắng bên bậu cửa sổ vào buổi sáng.', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba', 3),

-- Ảnh 6: Chủ đề Cà phê / Chill
('Góc Cà Phê Chiều Sài Gòn', 'Một buổi chiều tĩnh lặng ngồi thưởng thức ly cà phê phin truyền thống trong không gian quán mang phong cách hoài cổ retro.', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb', 1),

-- Ảnh 7: Chủ đề Thời trang
('Vintage OOTD Autumn Style', 'Gợi ý phối đồ mùa thu với áo măng tô dáng dài kết hợp quần tây ống suông và giày loafer cổ điển thanh lịch.', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f', 3),

-- Ảnh 8: Chủ đề Giao diện UI/UX
('Dashboard UI/UX Concept', 'Bản thiết kế giao diện quản trị (Admin Dashboard) hiện đại với hệ thống Dark mode, biểu đồ dữ liệu hiển thị trực quan.', 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e', 2),

-- Ảnh 9: Chủ đề Sức khỏe / Healthy Food
('Healthy Breakfast Bowl', 'Bữa sáng dinh dưỡng tràn đầy năng lượng bao gồm sữa chua kết hợp cùng hạt ngũ cốc granola, dâu tây và quả việt quất tươi.', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061', 3),

-- Ảnh 10: Chủ đề Nhiếp ảnh đường phố
('Đèn Lồng Phố Cổ Hội An', 'Bức ảnh lung linh sắc màu chụp lại khoảnh khắc những chiếc đèn lồng giấy được thắp sáng dọc theo bờ sông Hoài thơ mộng.', 'https://images.unsplash.com/photo-1528127269322-539801943592', 1);

USE db_printerest;

-- ========================================================
-- 3. CHÈN 10 DÒNG DỮ LIỆU MẪU CHO BẢNG SAVED_IMAGES
-- ========================================================
INSERT INTO saved_images (user_id, image_id) VALUES
-- Người dùng 1 (Phan Xuân Anh Tài) lưu các ảnh của người khác
(1, 3),  -- Lưu ảnh 'Bánh Mì Thịt Nướng Sài Gòn' (của user 2)
(1, 4),  -- Lưu ảnh 'Modern Living Room Design' (của user 2)
(1, 5),  -- Lưu ảnh 'Cute British Shorthair Cat' (của user 3)
(1, 9),  -- Lưu ảnh 'Healthy Breakfast Bowl' (của user 3)

-- Người dùng 2 (Nguyễn Văn A) lưu các ảnh của người khác
(2, 1),  -- Lưu ảnh 'Minimalist Workspace Setup' (của user 1)
(2, 2),  -- Lưu ảnh 'Đỉnh Đèo Hải Vân Flycam' (của user 1)
(2, 10), -- Lưu ảnh 'Đèn Lồng Phố Cổ Hội An' (của user 1)

-- Người dùng 3 (Lê Thị B) lưu các ảnh hệ thống
(3, 1),  -- Lưu ảnh 'Minimalist Workspace Setup' (của user 1)
(3, 6),  -- Lưu ảnh 'Góc Cà Phê Chiều Sài Gòn' (của user 1)
(3, 8), -- Lưu ảnh 'Dashboard UI/UX Concept' (của user 2)
(4, 3);  