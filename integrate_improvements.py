"""
Script tự động tích hợp improvements vào index.html
"""

import re

# Đọc file gốc
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Đọc các snippet files
with open('step0_preparation.html', 'r', encoding='utf-8') as f:
    step0_content = f.read()

with open('step3_multibackend.html', 'r', encoding='utf-8') as f:
    step3_content = f.read()

print("🚀 Bắt đầu tích hợp improvements...")

# 1. THÊM STEP 0 - Sau Prerequisites, trước Step by Step Guide
step_guide_marker = '<!-- Step by Step Guide -->'
if step_guide_marker in content:
    content = content.replace(
        step_guide_marker,
        step0_content + '\n\n                ' + step_guide_marker
    )
    print("✅ Đã thêm Step 0 - Chuẩn bị")
else:
    print("❌ Không tìm thấy marker cho Step 0")

# 2. THAY THẾ STEP 3 - Backend deployment với multi-framework
# Tìm và thay thế Step 3
step3_pattern = r'(<!-- Step 3 -->.*?)(<!-- Step 4 -->)'
match = re.search(step3_pattern, content, re.DOTALL)
if match:
    content = content.replace(match.group(1), step3_content + '\n\n                    ')
    print("✅ Đã cập nhật Step 3 - Multi-framework Backend")
else:
    print("❌ Không tìm thấy Step 3")

# 3. THÊM IMPROVEMENTS CHO STEP 1
step1_improvements = '''
                            <div class="info-box important" style="margin-top: 1.5rem;">
                                <div class="info-icon">📥</div>
                                <div class="info-content">
                                    <strong>LƯU FILE KEY PAIR!</strong><br>
                                    Khi tạo key pair, file <code>.pem</code> sẽ tự động download.<br>
                                    <strong>LƯU FILE NÀY CẨN THẬN</strong> - bạn sẽ cần nó để SSH!<br>
                                    Đề xuất: Di chuyển vào thư mục <code>~/.ssh/</code>
                                </div>
                            </div>

                            <h5 style="margin-top: 2rem; font-size: 1.1rem; color: var(--color-text-primary);">Sau khi Launch Instance:</h5>
                            
                            <div style="background: var(--color-bg-tertiary); border-left: 3px solid var(--color-accent-purple); padding: 1.5rem; border-radius: var(--radius-md); margin-top: 1rem;">
                                <div style="margin-bottom: 1.5rem;">
                                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                                        <span style="background: var(--gradient-primary); color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700;">1</span>
                                        <strong style="color: var(--color-text-primary);">Đợi instance khởi động</strong>
                                    </div>
                                    <p style="margin-left: 3rem; color: var(--color-text-secondary);">
                                        Vào EC2 Dashboard → Instances<br>
                                        Đợi đến khi <strong>Instance State = Running</strong> (màu xanh)<br>
                                        Thời gian: 1-2 phút
                                    </p>
                                </div>

                                <div>
                                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                                        <span style="background: var(--gradient-primary); color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700;">2</span>
                                        <strong style="color: var(--color-text-primary);">Lấy Public IP</strong>
                                    </div>
                                    <p style="margin-left: 3rem; color: var(--color-text-secondary);">
                                        Click vào instance → Copy <strong>Public IPv4 address</strong><br>
                                        Ví dụ: <code>54.123.45.67</code><br>
                                        <strong style="color: var(--color-accent-yellow);">⭐ LƯU IP NÀY</strong> - bạn sẽ dùng nhiều lần!
                                    </p>
                                </div>
                            </div>
'''

# Tìm vị trí sau Pro tip của Step 1
step1_tip_marker = '<strong>Pro tip:</strong> Nên chọn t2.small thay vì t2.micro'
if step1_tip_marker in content:
    # Tìm vị trí </div> sau Pro tip
    tip_pos = content.find(step1_tip_marker)
    next_closing_div = content.find('</div>\n                        </div>\n                    </div>', tip_pos)
    if next_closing_div != -1:
        insert_pos = next_closing_div
        content = content[:insert_pos] + step1_improvements + '\n                        ' + content[insert_pos:]
        print("✅ Đã thêm improvements cho Step 1")
    else:
        print("❌ Không tìm thấy vị trí insert cho Step 1")
else:
    print("❌ Không tìm thấy marker cho Step 1")

# Lưu file mới
with open('index_improved.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n🎉 HOÀN THÀNH!")
print("📁 File mới: index_improved.html")
print("📁 File gốc: index.html (đã backup thành index_backup.html)")
print("\n✅ Đã tích hợp:")
print("   - Step 0: Chuẩn bị code")
print("   - Step 1: Improvements (lưu .pem, lấy IP)")
print("   - Step 3: Multi-framework backend")
print("\n⏳ Cần làm thêm:")
print("   - Step 2: SSH improvements (cần manual)")
print("   - Step 4, 5, 6: Verification steps")
print("\n💡 Mở index_improved.html trong browser để test!")
