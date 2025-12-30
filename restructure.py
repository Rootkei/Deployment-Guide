"""
Script tự động restructure project
"""

import re
import os

print("🚀 Bắt đầu restructuring project...")

# Đọc file index.html hiện tại
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. EXTRACT EC2 CONTENT
print("\n📄 Extracting EC2 content...")

# Tìm EC2 section
ec2_pattern = r'(<section id="ec2" class="deployment-section active">.*?</section>)\s*<!-- Other deployment methods'
ec2_match = re.search(ec2_pattern, content, re.DOTALL)

if ec2_match:
    ec2_content = ec2_match.group(1)
    
    # Tạo file methods/ec2.html
    with open('methods/ec2.html', 'w', encoding='utf-8') as f:
        f.write(ec2_content)
    print("✅ Created methods/ec2.html")
else:
    print("❌ Could not find EC2 section")

# 2. CREATE NEW LIGHTWEIGHT INDEX.HTML
print("\n📄 Creating new index.html...")

new_index = '''<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AWS Deployment Guide - Hướng dẫn triển khai Full Stack</title>
    <meta name="description"
        content="Hướng dẫn chi tiết cách triển khai ứng dụng Full Stack lên AWS với nhiều phương pháp khác nhau từ EC2, ECS/EKS, Lambda đến Terraform">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="assets/css/main.css">
</head>

<body>
    <!-- Hero Section -->
    <header class="hero">
        <div class="hero-background"></div>
        <div class="container">
            <div class="hero-content">
                <h1 class="hero-title">
                    <span class="gradient-text">AWS Deployment</span>
                    <span class="hero-subtitle">Hướng dẫn triển khai Full Stack</span>
                </h1>
                <p class="hero-description">
                    Khám phá 8 phương pháp triển khai ứng dụng Full Stack lên AWS, từ cơ bản đến nâng cao.
                    Mỗi phương pháp đều có hướng dẫn chi tiết, code mẫu và best practices.
                </p>
                <div class="hero-stats">
                    <div class="stat-card">
                        <div class="stat-number">8</div>
                        <div class="stat-label">Phương pháp</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">100+</div>
                        <div class="stat-label">Code Examples</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">∞</div>
                        <div class="stat-label">Possibilities</div>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Navigation Pills -->
    <nav class="nav-pills">
        <div class="container">
            <div class="pills-wrapper">
                <button class="pill active" data-method="ec2">
                    <span class="pill-icon">🖥️</span>
                    <span class="pill-text">EC2 Truyền thống</span>
                    <span class="pill-stars">⭐⭐⭐⭐⭐</span>
                </button>
                <button class="pill" data-method="ecs">
                    <span class="pill-icon">🐳</span>
                    <span class="pill-text">ECS / EKS</span>
                    <span class="pill-stars">⭐⭐⭐⭐</span>
                </button>
                <button class="pill" data-method="beanstalk">
                    <span class="pill-icon">🌱</span>
                    <span class="pill-text">Elastic Beanstalk</span>
                    <span class="pill-stars">⭐⭐⭐</span>
                </button>
                <button class="pill" data-method="lambda">
                    <span class="pill-icon">⚡</span>
                    <span class="pill-text">Lambda</span>
                    <span class="pill-stars">⭐⭐⭐</span>
                </button>
                <button class="pill" data-method="codedeploy">
                    <span class="pill-icon">🚀</span>
                    <span class="pill-text">CodeDeploy</span>
                    <span class="pill-stars">⭐⭐</span>
                </button>
                <button class="pill" data-method="iac">
                    <span class="pill-icon">📜</span>
                    <span class="pill-text">IaC</span>
                    <span class="pill-stars">⭐⭐</span>
                </button>
                <button class="pill" data-method="apprunner">
                    <span class="pill-icon">🏃</span>
                    <span class="pill-text">App Runner</span>
                    <span class="pill-stars">⭐</span>
                </button>
                <button class="pill" data-method="opsworks">
                    <span class="pill-icon">⚙️</span>
                    <span class="pill-text">OpsWorks</span>
                    <span class="pill-stars">⭐</span>
                </button>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
        <div class="container">
            <div id="method-content">
                <!-- Content will be loaded here dynamically -->
                <div class="loading">
                    <div class="loading-spinner"></div>
                    <p>Đang tải...</p>
                </div>
            </div>
        </div>
    </main>

    <!-- Scroll Progress Bar -->
    <div class="scroll-progress"></div>

    <!-- Scripts -->
    <script src="assets/js/main.js"></script>
</body>

</html>'''

with open('index_new.html', 'w', encoding='utf-8') as f:
    f.write(new_index)
print("✅ Created index_new.html")

# 3. CREATE DYNAMIC LOADING SCRIPT
print("\n📄 Creating dynamic loading script...")

loader_script = '''// Dynamic Method Loader
let currentMethod = 'ec2';

// Load method content
async function loadMethod(methodName) {
    const contentDiv = document.getElementById('method-content');
    
    // Show loading
    contentDiv.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Đang tải ${methodName}...</p>
        </div>
    `;
    
    try {
        const response = await fetch(`methods/${methodName}.html`);
        if (!response.ok) {
            throw new Error('Method not found');
        }
        
        const html = await response.text();
        contentDiv.innerHTML = html;
        
        // Re-initialize interactive elements
        initializeInteractiveElements();
        
        // Update URL hash
        window.location.hash = methodName;
        currentMethod = methodName;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    } catch (error) {
        contentDiv.innerHTML = `
            <div class="coming-soon">
                <div class="coming-soon-icon">🚧</div>
                <h3>Đang cập nhật...</h3>
                <p>Nội dung chi tiết cho ${methodName} sẽ được thêm vào sớm</p>
            </div>
        `;
    }
}

// Initialize interactive elements
function initializeInteractiveElements() {
    // Code tabs
    const tabButtons = document.querySelectorAll('.code-tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            const parent = this.closest('.code-tabs');
            
            // Remove active from all
            parent.querySelectorAll('.code-tab-btn').forEach(b => b.classList.remove('active'));
            parent.querySelectorAll('.code-tab-content').forEach(c => c.classList.remove('active'));
            
            // Add active to clicked
            this.classList.add('active');
            parent.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        });
    });
    
    // Accordions
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const item = this.parentElement;
            const content = item.querySelector('.accordion-content');
            const icon = this.querySelector('.accordion-icon');
            
            item.classList.toggle('active');
            
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
                icon.textContent = '−';
            } else {
                content.style.maxHeight = '0';
                icon.textContent = '+';
            }
        });
    });
    
    // Checklist
    const checkboxes = document.querySelectorAll('.checklist-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const key = `checklist_${currentMethod}_${this.parentElement.textContent.trim()}`;
            localStorage.setItem(key, this.checked);
        });
        
        // Load saved state
        const key = `checklist_${currentMethod}_${checkbox.parentElement.textContent.trim()}`;
        const saved = localStorage.getItem(key);
        if (saved === 'true') {
            checkbox.checked = true;
        }
    });
}

// Copy code functionality
function copyCode(button) {
    const codeBlock = button.closest('.code-block').querySelector('code');
    const text = codeBlock.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="copy-icon">✅</span> Copied!';
        button.style.background = 'var(--color-accent-green)';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
        }, 2000);
    });
}

// Setup navigation
function setupNavigation() {
    const pills = document.querySelectorAll('.pill');
    
    pills.forEach(pill => {
        pill.addEventListener('click', function() {
            // Remove active from all
            pills.forEach(p => p.classList.remove('active'));
            
            // Add active to clicked
            this.classList.add('active');
            
            // Load method
            const method = this.dataset.method;
            loadMethod(method);
        });
    });
}

// Scroll progress bar
function updateScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    
    scrollProgress.style.width = progress + '%';
}

window.addEventListener('scroll', updateScrollProgress);

// Initialize on load
document.addEventListener('DOMContentLoaded', async () => {
    // Setup navigation
    setupNavigation();
    
    // Load default method from hash or EC2
    const hash = window.location.hash.slice(1) || 'ec2';
    await loadMethod(hash);
    
    // Update active pill
    const activePill = document.querySelector(`[data-method="${hash}"]`);
    if (activePill) {
        document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        activePill.classList.add('active');
    }
});

// Handle browser back/forward
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1) || 'ec2';
    if (hash !== currentMethod) {
        loadMethod(hash);
        
        // Update active pill
        const activePill = document.querySelector(`[data-method="${hash}"]`);
        if (activePill) {
            document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
            activePill.classList.add('active');
        }
    }
});
'''

with open('assets/js/loader.js', 'w', encoding='utf-8') as f:
    f.write(loader_script)
print("✅ Created assets/js/loader.js")

# 4. CREATE PLACEHOLDER FILES FOR OTHER METHODS
print("\n📄 Creating placeholder files...")

placeholder_methods = ['ecs', 'beanstalk', 'lambda', 'codedeploy', 'iac', 'apprunner', 'opsworks']

for method in placeholder_methods:
    placeholder_content = f'''<section id="{method}" class="deployment-section">
    <div class="coming-soon">
        <div class="coming-soon-icon">🚧</div>
        <h3>Đang cập nhật...</h3>
        <p>Nội dung chi tiết cho {method.upper()} sẽ được thêm vào sớm</p>
        <p style="margin-top: 1rem; color: var(--color-text-secondary);">
            Hãy quay lại sau hoặc theo dõi updates!
        </p>
    </div>
</section>'''
    
    with open(f'methods/{method}.html', 'w', encoding='utf-8') as f:
        f.write(placeholder_content)
    print(f"✅ Created methods/{method}.html")

print("\n🎉 HOÀN THÀNH RESTRUCTURING!")
print("\n📁 Cấu trúc mới:")
print("├── index_new.html (lightweight)")
print("├── assets/")
print("│   ├── css/main.css")
print("│   └── js/")
print("│       ├── main.js")
print("│       └── loader.js")
print("├── methods/")
print("│   ├── ec2.html")
print("│   ├── ecs.html")
print("│   └── ... (7 methods)")
print("\n💡 Next: Update index_new.html script src to loader.js")
print("💡 Then: Rename index_new.html to index.html")
