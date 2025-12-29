# 🚀 AWS Deployment Guide - Hướng dẫn Deploy Full Stack

Website hướng dẫn chi tiết cách triển khai ứng dụng Full Stack lên AWS với 8 phương pháp khác nhau.

## 📁 Files trong project

```
test/
├── index.html                    # Trang web chính
├── index.css                     # Styling với dark theme
├── script.js                     # Interactive functionality
├── DEPLOYMENT_CHECKLIST.md       # ⭐ Hướng dẫn chi tiết cho người mới
├── step3_multibackend.html       # Template cho multi-framework backend
└── README.md                     # File này
```

## 🎯 Dành cho ai?

### ✅ Bạn NÊN đọc hướng dẫn này nếu:
- Bạn có 1 project Backend (Node.js/C#/Java/Python/Go)
- Bạn có 1 project Frontend (React/Vue/Angular)
- Bạn muốn deploy lên AWS EC2
- Bạn là người mới bắt đầu với AWS

### ❌ Bạn KHÔNG CẦN hướng dẫn này nếu:
- Bạn đã có kinh nghiệm deploy production
- Bạn đang tìm giải pháp serverless (Lambda)
- Bạn muốn dùng Docker/Kubernetes ngay từ đầu

## 🚀 Bắt đầu nhanh

### Cách 1: Đọc hướng dẫn trực quan (Recommended)
1. Mở file `index.html` trong browser
2. Xem architecture diagram và các bước deploy
3. Copy code examples và chạy

### Cách 2: Follow checklist chi tiết
1. Mở file `DEPLOYMENT_CHECKLIST.md`
2. Làm theo từng bước một
3. Check ✅ mỗi item khi hoàn thành

## 📚 Nội dung hướng dẫn

### EC2 Traditional Method (Hoàn chỉnh) ⭐⭐⭐⭐⭐

**Bao gồm:**
- ✅ Architecture diagram với animation
- ✅ Prerequisites checklist
- ✅ 6 bước deploy chi tiết
- ✅ Troubleshooting guide
- ✅ Best practices
- ✅ Cost optimization

**Thời gian:** 30-60 phút (lần đầu)
**Chi phí:** $10-50/tháng
**Độ khó:** Trung bình

### Các methods khác (Coming soon)
- ECS / EKS (Docker & Kubernetes) ⭐⭐⭐⭐
- Elastic Beanstalk ⭐⭐⭐
- Lambda (Serverless) ⭐⭐⭐
- CodeDeploy / Pipeline ⭐⭐
- IaC (CloudFormation / CDK / Terraform) ⭐⭐
- App Runner ⭐
- OpsWorks ⭐

## 🎓 Kiến thức cần có

### Bắt buộc:
- Biết sử dụng Terminal/Command Line cơ bản
- Hiểu Git cơ bản (clone, push, pull)
- Biết cấu trúc project Frontend/Backend

### Nên có:
- Hiểu Linux/Ubuntu cơ bản
- Biết SSH
- Hiểu HTTP/HTTPS

### Không cần:
- ❌ Không cần biết DevOps chuyên sâu
- ❌ Không cần biết Docker
- ❌ Không cần biết Kubernetes

## 📋 Prerequisites

### 1. Tài khoản AWS
- Đăng ký tại: https://aws.amazon.com
- Cần thẻ tín dụng (sẽ không bị charge nếu dùng free tier)
- Xác minh email và số điện thoại

### 2. Code của bạn
**Backend:**
- Đã push lên GitHub
- Có file `package.json` với script `start` (Node.js)
- Hoặc có thể build được (Java/C#/Go)

**Frontend:**
- Đã push lên GitHub
- Có thể build production (`npm run build`)
- Có cấu hình API URL

### 3. Máy tính
- SSH client (Git Bash cho Windows, Terminal cho Mac/Linux)
- Browser (Chrome/Firefox recommended)

## 🔥 Hướng dẫn Deploy nhanh (TL;DR)

```bash
# 1. Tạo EC2 instance (t2.small, Ubuntu 22.04)
# 2. SSH vào server
ssh -i your-key.pem ubuntu@your-ec2-ip

# 3. Cài đặt môi trường
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs nginx git
sudo npm install -g pm2

# 4. Deploy Backend
cd ~/apps
git clone https://github.com/your-username/backend.git
cd backend
npm install
# Tạo file .env
pm2 start npm --name "backend-api" -- start
pm2 save && pm2 startup

# 5. Deploy Frontend
cd ~/apps
git clone https://github.com/your-username/frontend.git
cd frontend
npm install
npm run build
sudo cp -r build/* /var/www/html/

# 6. Cấu hình Nginx
sudo nano /etc/nginx/sites-available/fullstack
# Paste config từ hướng dẫn
sudo ln -s /etc/nginx/sites-available/fullstack /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

# 7. Done! Truy cập http://your-ec2-ip
```

## 🎯 Kịch bản sử dụng

### Scenario 1: Student Project
**Bạn có:** React frontend + Node.js backend + MongoDB
**Chi phí:** $0 (Free tier t2.micro)
**Thời gian:** 45 phút
**Follow:** DEPLOYMENT_CHECKLIST.md

### Scenario 2: Startup MVP
**Bạn có:** Vue frontend + Java Spring backend + PostgreSQL
**Chi phí:** ~$20/tháng (t2.small)
**Thời gian:** 1-2 giờ
**Follow:** index.html → EC2 method → Java tab

### Scenario 3: Side Project
**Bạn có:** Angular frontend + C# .NET backend + SQL Server
**Chi phí:** ~$30/tháng (t2.medium)
**Thời gian:** 1-2 giờ
**Follow:** index.html → EC2 method → C# tab

## ⚠️ Những điều QUAN TRỌNG

### 🔴 ĐỪNG BAO GIỜ:
- ❌ Commit file `.env` vào Git
- ❌ Hardcode API keys trong code
- ❌ Để Security Group mở tất cả ports
- ❌ Dùng password yếu
- ❌ Quên backup database

### 🟢 LUÔN LUÔN:
- ✅ Dùng `.gitignore` cho sensitive files
- ✅ Dùng environment variables
- ✅ Giới hạn SSH access theo IP
- ✅ Enable HTTPS trong production
- ✅ Backup code và database thường xuyên
- ✅ Monitor server resources

## 🐛 Troubleshooting

### Vấn đề thường gặp:

**1. Không SSH được vào server**
```bash
# Kiểm tra quyền file .pem
chmod 400 your-key.pem

# Kiểm tra Security Group có mở port 22
```

**2. Backend không chạy**
```bash
# Xem logs
pm2 logs backend-api

# Restart
pm2 restart backend-api
```

**3. Frontend không hiển thị**
```bash
# Kiểm tra Nginx
sudo systemctl status nginx

# Xem error logs
sudo tail -f /var/log/nginx/error.log
```

**4. 502 Bad Gateway**
```bash
# Backend chưa chạy
pm2 status

# Port sai trong Nginx config
sudo nano /etc/nginx/sites-available/fullstack
```

**Chi tiết hơn:** Xem phần "Xử lý sự cố" trong `DEPLOYMENT_CHECKLIST.md`

## 💰 Chi phí ước tính

| Instance Type | vCPU | RAM | Chi phí/tháng | Phù hợp cho |
|--------------|------|-----|---------------|-------------|
| t2.micro     | 1    | 1GB | $8.50 (Free tier: $0) | Testing, học tập |
| t2.small     | 1    | 2GB | $17 | Startup MVP |
| t2.medium    | 2    | 4GB | $34 | Production nhỏ |
| t3.small     | 2    | 2GB | $15 | Better performance |

**Lưu ý:**
- Free tier: 750 giờ/tháng t2.micro (12 tháng đầu)
- Chi phí trên chưa bao gồm: bandwidth, storage, database
- Dùng Reserved Instances để giảm 30-70% chi phí

## 📊 So sánh các deployment methods

| Method | Độ khó | Chi phí | Scalability | Control | Phù hợp cho |
|--------|--------|---------|-------------|---------|-------------|
| EC2 Traditional | ⭐⭐ | $ | ⭐⭐ | ⭐⭐⭐⭐⭐ | MVP, Learning |
| ECS/EKS | ⭐⭐⭐⭐ | $$ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Microservices |
| Elastic Beanstalk | ⭐ | $$ | ⭐⭐⭐⭐ | ⭐⭐ | Quick deploy |
| Lambda | ⭐⭐⭐ | $ | ⭐⭐⭐⭐⭐ | ⭐⭐ | Serverless |

## 🔗 Resources hữu ích

### AWS Documentation
- [EC2 User Guide](https://docs.aws.amazon.com/ec2/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)

### Tutorials
- [AWS Free Tier](https://aws.amazon.com/free/)
- [How to SSH into EC2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html)

### Communities
- [AWS Reddit](https://www.reddit.com/r/aws/)
- [Stack Overflow - AWS](https://stackoverflow.com/questions/tagged/amazon-web-services)

## 🤝 Contributing

Nếu bạn tìm thấy lỗi hoặc muốn cải thiện hướng dẫn:
1. Tạo issue mô tả vấn đề
2. Hoặc gửi pull request với improvements

## 📝 Changelog

### Version 1.0 (Current)
- ✅ EC2 Traditional method hoàn chỉnh
- ✅ Multi-framework backend support (Node.js, C#, Java, Python, Go)
- ✅ Architecture diagram với animations
- ✅ Deployment checklist chi tiết
- ✅ Troubleshooting guide
- ✅ Best practices & tips

### Coming Soon
- [ ] ECS/EKS deployment guide
- [ ] Elastic Beanstalk guide
- [ ] Lambda serverless guide
- [ ] CI/CD với CodePipeline
- [ ] Infrastructure as Code (Terraform)
- [ ] Video tutorials
- [ ] Interactive cost calculator

## 📄 License

Free to use for educational purposes.

## 💬 Feedback

Hướng dẫn này có hữu ích không? Bạn gặp vấn đề gì?
Hãy cho chúng tôi biết để cải thiện!

---

**Made with ❤️ for AWS Learners**

*Last updated: 2025-12-29*
