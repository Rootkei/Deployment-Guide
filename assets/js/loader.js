// Dynamic Method Loader
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
        btn.addEventListener('click', function () {
            const tab = this.dataset.tab;
            const parent = this.closest('.code-tabs');

            // Remove active from all
            parent.querySelectorAll('.code-tab-btn').forEach(b => b.classList.remove('active'));
            parent.querySelectorAll('.code-tab-content').forEach(c => c.classList.remove('active'));

            // Add active to clicked
            this.classList.add('active');
            parent.querySelector(`.code-tab-content[data-tab="${tab}"]`).classList.add('active');
        });
    });

    // Accordions
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function () {
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
        checkbox.addEventListener('change', function () {
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
        pill.addEventListener('click', function () {
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
