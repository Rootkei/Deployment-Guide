# ✅ Checklist Deploy Full Stack lên EC2 - Cho người mới bắt đầu

## 📋 Những gì bạn CẦN CÓ trước khi bắt đầu

### 1. Tài khoản AWS
- [ ] Đã đăng ký tài khoản AWS (cần thẻ tín dụng)
- [ ] Đã xác minh email
- [ ] Đã đăng nhập được vào AWS Console

### 2. Code của bạn
- [ ] **Backend project** đã push lên GitHub (public hoặc private với SSH key)
- [ ] **Frontend project** đã push lên GitHub
- [ ] Backend có file `package.json` với script `"start"` (cho Node.js)
- [ ] Frontend có thể build được (`npm run build` chạy thành công local)

### 3. Máy tính của bạn
- [ ] Đã cài đặt SSH client (Windows: Git Bash hoặc PowerShell, Mac/Linux: có sẵn)
- [ ] Có thể mở Terminal/Command Prompt

---

## 🚀 HƯỚNG DẪN CHI TIẾT TỪNG BƯỚC

## BƯỚC 0: Chuẩn bị Backend và Frontend

### Backend Requirements (Node.js example)

**File `package.json` phải có:**
```json
{
  "name": "your-backend",
  "scripts": {
    "start": "node server.js"  // ← QUAN TRỌNG: Phải có script này
  },
  "dependencies": {
    "express": "^4.18.0",
    // ... các dependencies khác
  }
}
```

**File `.gitignore` phải có:**
```
node_modules/
.env
.DS_Store
```

**Đừng commit `.env` vào Git!**

### Frontend Requirements (React example)

**File `package.json` phải có:**
```json
{
  "scripts": {
    "build": "react-scripts build"  // ← Phải có script này
  }
}
```

**Cấu hình API URL:**
- Tạo file `.env.example` (commit vào Git):
```
REACT_APP_API_URL=http://your-server-ip:3000
```
- File `.env` thật sẽ tạo trên server

---

## BƯỚC 1: Tạo EC2 Instance

### 1.1 Vào AWS Console
1. Đăng nhập vào https://console.aws.amazon.com
2. Tìm "EC2" trong thanh search
3. Click "Launch Instance"

### 1.2 Cấu hình Instance

**Name:** `my-fullstack-app`

**AMI (Operating System):**
- Chọn: **Ubuntu Server 22.04 LTS**
- Kiểu: 64-bit (x86)

**Instance type:**
- Chọn: **t2.small** (khuyến nghị) hoặc t2.micro (free tier nhưng ít RAM)

**Key pair (QUAN TRỌNG!):**
1. Click "Create new key pair"
2. Name: `my-app-key`
3. Type: RSA
4. Format: `.pem` (cho Mac/Linux) hoặc `.ppk` (cho PuTTY Windows)
5. Click "Create key pair"
6. **LƯU FILE NÀY CẨN THẬN!** Bạn sẽ cần nó để SSH vào server

**Network settings:**
1. Click "Edit"
2. **Auto-assign public IP:** Enable
3. **Firewall (Security Group):** Create new
4. **Security group name:** `fullstack-sg`
5. **Add rules:**
   - ✅ SSH (port 22) - Source: My IP (an toàn hơn) hoặc Anywhere (0.0.0.0/0)
   - ✅ HTTP (port 80) - Source: Anywhere (0.0.0.0/0)
   - ✅ HTTPS (port 443) - Source: Anywhere (0.0.0.0/0)
   - ✅ Custom TCP (port 3000) - Source: Anywhere (0.0.0.0/0) ← Cho backend API

**Storage:**
- Size: **20 GB**
- Type: gp3

6. Click "Launch Instance"
7. Đợi 1-2 phút để instance khởi động

### 1.3 Lấy Public IP
1. Vào EC2 Dashboard → Instances
2. Click vào instance vừa tạo
3. Copy **Public IPv4 address** (ví dụ: `54.123.45.67`)
4. **LƯU IP NÀY** - bạn sẽ dùng nhiều lần!

---

## BƯỚC 2: Kết nối SSH vào Server

### 2.1 Chuẩn bị SSH Key (Windows)

**Nếu dùng Git Bash hoặc PowerShell:**
```bash
# Di chuyển file .pem vào thư mục an toàn
mkdir ~/.ssh
mv ~/Downloads/my-app-key.pem ~/.ssh/

# Đặt quyền cho file (QUAN TRỌNG!)
chmod 400 ~/.ssh/my-app-key.pem
```

### 2.2 Kết nối SSH

```bash
ssh -i ~/.ssh/my-app-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

**Thay `YOUR_EC2_PUBLIC_IP` bằng IP thật của bạn!**

Ví dụ:
```bash
ssh -i ~/.ssh/my-app-key.pem ubuntu@54.123.45.67
```

**Lần đầu sẽ hỏi:** `Are you sure you want to continue connecting?`
- Gõ: `yes` và Enter

**Nếu thành công**, bạn sẽ thấy:
```
ubuntu@ip-172-31-xx-xx:~$
```

---

## BƯỚC 3: Cài đặt môi trường trên Server

### 3.1 Update hệ thống

```bash
sudo apt update && sudo apt upgrade -y
```
(Đợi 2-5 phút)

### 3.2 Cài đặt Node.js và npm

```bash
# Cài Node.js 18 (LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Kiểm tra
node --version  # Phải ra v18.x.x
npm --version   # Phải ra 9.x.x hoặc 10.x.x
```

### 3.3 Cài đặt PM2 (Process Manager cho Backend)

```bash
sudo npm install -g pm2

# Kiểm tra
pm2 --version
```

### 3.4 Cài đặt Nginx (Web Server cho Frontend)

```bash
sudo apt install -y nginx

# Kiểm tra
nginx -v

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 3.5 Cài đặt Git

```bash
sudo apt install -y git

# Kiểm tra
git --version
```

**Test Nginx:** Mở browser và vào `http://YOUR_EC2_PUBLIC_IP`
- Nếu thấy trang "Welcome to nginx!" = Thành công! ✅

---

## BƯỚC 4: Deploy Backend

### 4.1 Clone Backend Code

```bash
# Tạo thư mục
mkdir -p ~/apps
cd ~/apps

# Clone code (thay YOUR_USERNAME và YOUR_REPO)
git clone https://github.com/YOUR_USERNAME/YOUR_BACKEND_REPO.git backend
cd backend
```

**Nếu repo private:**
```bash
# Cần setup SSH key hoặc dùng Personal Access Token
git clone https://YOUR_TOKEN@github.com/YOUR_USERNAME/YOUR_BACKEND_REPO.git backend
```

### 4.2 Cài đặt Dependencies

```bash
npm install
```

**Nếu gặp lỗi:** Kiểm tra `package.json` có đúng không

### 4.3 Tạo file .env

```bash
nano .env
```

**Paste nội dung sau** (chỉnh sửa theo project của bạn):
```
PORT=3000
NODE_ENV=production
DATABASE_URL=mongodb://localhost:27017/mydb
JWT_SECRET=your-super-secret-key-change-this
```

**Lưu file:**
- Nhấn `Ctrl + X`
- Nhấn `Y`
- Nhấn `Enter`

### 4.4 Test Backend Local

```bash
npm start
```

**Nếu thành công**, bạn sẽ thấy:
```
Server running on port 3000
```

**Test từ browser:** `http://YOUR_EC2_PUBLIC_IP:3000`

**Dừng server:** Nhấn `Ctrl + C`

### 4.5 Chạy Backend với PM2

```bash
# Start với PM2
pm2 start npm --name "backend-api" -- start

# Lưu config
pm2 save

# Auto-start khi server reboot
pm2 startup
# Copy lệnh nó hiển thị và chạy lệnh đó (bắt đầu bằng sudo)

# Kiểm tra status
pm2 status
pm2 logs backend-api
```

**Nếu thấy status "online"** = Thành công! ✅

---

## BƯỚC 5: Deploy Frontend

### 5.1 Clone Frontend Code

```bash
cd ~/apps
git clone https://github.com/YOUR_USERNAME/YOUR_FRONTEND_REPO.git frontend
cd frontend
```

### 5.2 Tạo file .env

```bash
nano .env
```

**Paste (thay YOUR_EC2_PUBLIC_IP):**
```
REACT_APP_API_URL=http://YOUR_EC2_PUBLIC_IP:3000
```

**Lưu:** `Ctrl + X` → `Y` → `Enter`

### 5.3 Build Frontend

```bash
npm install
npm run build
```

**Đợi 2-5 phút.** Nếu thành công, sẽ có thư mục `build/`

### 5.4 Copy build files vào Nginx

```bash
# Xóa file mặc định của Nginx
sudo rm -rf /var/www/html/*

# Copy build files
sudo cp -r build/* /var/www/html/

# Set permissions
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
```

**Test:** Mở `http://YOUR_EC2_PUBLIC_IP` trong browser
- Phải thấy frontend của bạn! ✅

---

## BƯỚC 6: Cấu hình Nginx (Reverse Proxy)

### 6.1 Tạo file cấu hình

```bash
sudo nano /etc/nginx/sites-available/fullstack
```

### 6.2 Paste nội dung sau:

```nginx
server {
    listen 80;
    server_name _;  # Chấp nhận mọi domain/IP

    # Frontend - serve static files
    location / {
        root /var/www/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API - reverse proxy
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

**Lưu:** `Ctrl + X` → `Y` → `Enter`

### 6.3 Enable site

```bash
# Tạo symbolic link
sudo ln -s /etc/nginx/sites-available/fullstack /etc/nginx/sites-enabled/

# Xóa config mặc định
sudo rm /etc/nginx/sites-enabled/default

# Test config
sudo nginx -t
```

**Phải thấy:** `syntax is ok` và `test is successful`

### 6.4 Restart Nginx

```bash
sudo systemctl restart nginx
sudo systemctl status nginx
```

**Phải thấy:** `active (running)` màu xanh

---

## BƯỚC 7: Kiểm tra toàn bộ hệ thống

### 7.1 Kiểm tra Backend

```bash
# Kiểm tra PM2
pm2 status

# Kiểm tra logs
pm2 logs backend-api --lines 50

# Test API trực tiếp
curl http://localhost:3000
```

### 7.2 Kiểm tra Frontend

**Mở browser:**
- Frontend: `http://YOUR_EC2_PUBLIC_IP`
- Backend API (nếu có endpoint test): `http://YOUR_EC2_PUBLIC_IP:3000`

### 7.3 Kiểm tra kết nối Frontend ↔ Backend

1. Mở browser Developer Tools (F12)
2. Vào tab Network
3. Thử gọi API từ frontend
4. Xem request có thành công không

---

## 🔧 XỬ LÝ SỰ CỐ THƯỜNG GẶP

### ❌ Không SSH được vào server

**Nguyên nhân:**
1. Security Group chưa mở port 22
2. File .pem không có quyền đúng
3. IP sai

**Giải pháp:**
```bash
# Kiểm tra quyền file
ls -la ~/.ssh/my-app-key.pem
# Phải là: -r-------- (400)

# Nếu sai, sửa lại:
chmod 400 ~/.ssh/my-app-key.pem

# Kiểm tra IP
# Vào EC2 Console → Instances → Copy Public IPv4 address
```

### ❌ Backend không chạy

**Kiểm tra:**
```bash
# Xem logs
pm2 logs backend-api

# Restart
pm2 restart backend-api

# Kiểm tra port có bị chiếm không
sudo lsof -i :3000
```

**Nguyên nhân thường gặp:**
- File `.env` sai hoặc thiếu
- Dependencies chưa cài (`npm install`)
- Port 3000 bị chiếm
- Code có lỗi

### ❌ Frontend không hiển thị

**Kiểm tra:**
```bash
# Kiểm tra Nginx
sudo systemctl status nginx

# Xem logs
sudo tail -f /var/log/nginx/error.log

# Kiểm tra files
ls -la /var/www/html/
```

**Nguyên nhân:**
- Build chưa thành công
- Files chưa copy đúng
- Nginx chưa restart

### ❌ Frontend không gọi được Backend

**Kiểm tra:**
1. File `.env` trong frontend có đúng IP không?
2. Backend có đang chạy không? (`pm2 status`)
3. CORS có được config trong backend không?

**Backend cần có CORS:**
```javascript
// Trong server.js hoặc app.js
const cors = require('cors');
app.use(cors());
```

### ❌ 502 Bad Gateway

**Nguyên nhân:**
- Backend không chạy
- Port trong Nginx config sai

**Giải pháp:**
```bash
# Kiểm tra backend
pm2 status
pm2 logs backend-api

# Restart backend
pm2 restart backend-api

# Restart Nginx
sudo systemctl restart nginx
```

---

## 📝 CHECKLIST CUỐI CÙNG

Sau khi deploy xong, kiểm tra:

- [ ] Frontend hiển thị đúng tại `http://YOUR_EC2_PUBLIC_IP`
- [ ] Backend API response tại `http://YOUR_EC2_PUBLIC_IP:3000`
- [ ] Frontend gọi được Backend API
- [ ] PM2 status = "online"
- [ ] Nginx status = "active (running)"
- [ ] Restart server, app vẫn tự động chạy lại

---

## 🎯 BƯỚC TIẾP THEO (Optional)

### 1. Setup Domain Name
- Mua domain từ Namecheap, GoDaddy, etc.
- Point domain về EC2 Public IP
- Update Nginx config với domain

### 2. Setup SSL (HTTPS)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### 3. Setup Database
- Cài MongoDB local hoặc dùng MongoDB Atlas
- Cài PostgreSQL: `sudo apt install postgresql`

### 4. Setup Monitoring
```bash
# PM2 monitoring
pm2 monit

# CloudWatch (AWS)
# Setup trong AWS Console
```

---

## 📞 CẦN GIÚP ĐỠ?

**Các lệnh hữu ích:**

```bash
# Kiểm tra tất cả services
pm2 status
sudo systemctl status nginx

# Xem logs
pm2 logs backend-api
sudo tail -f /var/log/nginx/error.log

# Restart services
pm2 restart backend-api
sudo systemctl restart nginx

# Kiểm tra ports
sudo lsof -i :3000
sudo lsof -i :80

# Kiểm tra disk space
df -h

# Kiểm tra memory
free -h
```

**Nếu vẫn gặp vấn đề:**
1. Copy error message
2. Google: "error message + EC2 + nginx/pm2"
3. Kiểm tra Stack Overflow
4. Hỏi trên Discord/Slack community

---

## ✅ HOÀN THÀNH!

Chúc mừng! Bạn đã deploy thành công ứng dụng Full Stack lên AWS EC2! 🎉

**Lưu ý quan trọng:**
- Backup code thường xuyên
- Monitor server resources (CPU, RAM, Disk)
- Update dependencies định kỳ
- Đừng để `.env` file trong Git!
