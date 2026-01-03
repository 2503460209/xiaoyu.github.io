// 图片懒加载
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img.lazy');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('src');
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
});

// 移动端菜单切换
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// 导航栏激活状态切换
const navItems = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.section');

// 点击导航项切换激活状态
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        navItems.forEach(nav => nav.classList.remove('active'));
        e.target.classList.add('active');
        navLinks.classList.remove('active');
        menuToggle.querySelector('i').classList.remove('fa-times');
        menuToggle.querySelector('i').classList.add('fa-bars');
    });
});

// 滚动时切换导航激活状态
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === current) {
            item.classList.add('active');
        }
    });

    // 控制回到顶部按钮显示
    const backToTop = document.getElementById('backToTop');
    if (scrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

// 回到顶部功能
document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// 暗黑模式切换
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// 从本地存储读取主题
if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
    themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
});

// 留言板功能（本地存储）
const messageForm = document.getElementById('messageForm');
const messageList = document.getElementById('messageList');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message');

function getMessages() {
    return JSON.parse(localStorage.getItem('kittyMessages')) || [];
}

function saveMessage(message) {
    const messages = getMessages();
    messages.unshift(message);
    localStorage.setItem('kittyMessages', JSON.stringify(messages));
}

function renderMessages() {
    const messages = getMessages();
    const defaultMessage = messageList.querySelector('.message-item');
    messageList.innerHTML = '';
    if (defaultMessage) messageList.appendChild(defaultMessage);
    
    messages.forEach(msg => {
        const messageItem = document.createElement('div');
        messageItem.className = 'message-item';
        messageItem.innerHTML = `
            <div class="message-header">
                <span class="message-username">${msg.username}</span>
                <span class="message-time">${msg.time}</span>
            </div>
            <div class="message-content">${msg.content}</div>
        `;
        messageList.appendChild(messageItem);
    });
}

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const content = messageInput.value.trim();
    
    if (!username || !content) {
        alert('昵称和留言内容都不能为空哦～');
        return;
    }

    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMessage = {
        username,
        content,
        time: timeStr
    };
    saveMessage(newMessage);
    renderMessages();
    usernameInput.value = '';
    messageInput.value = '';
    alert('留言发送成功！🥰');
});

// 许愿树功能（融合到Kitty主题）
const wishInput = document.getElementById('wishInput');
const addWishBtn = document.getElementById('addWishBtn');
const wishList = document.getElementById('wishList');
const wishCountSpan = document.getElementById('wishCount');
const clearAllWishesBtn = document.getElementById('clearAllWishes');
const wishLengthSpan = document.getElementById('wishLength');

// 初始化愿望列表
let wishes = JSON.parse(localStorage.getItem('kittyWishes')) || [];

// 渲染愿望列表
function renderWishes() {
    wishList.innerHTML = '';
    wishCountSpan.textContent = wishes.length;

    if (wishes.length === 0) {
        wishList.innerHTML = '<li class="empty-wish-tip">暂无愿望，写下你的第一个愿望吧 ✨</li>';
        return;
    }

    wishes.forEach((wish, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="wish-time">${wish.time}</span>
            <div class="wish-content" data-index="${index}">${wish.content}</div>
            <div class="wish-actions">
                <button class="edit-wish-btn" data-index="${index}">编辑</button>
                <button class="delete-wish-btn" data-index="${index}">删除</button>
            </div>
        `;
        wishList.appendChild(li);
    });
}

// 添加愿望
function addWish() {
    const content = wishInput.value.trim();
    if (!content) {
        alert('愿望不能为空哦！😜');
        return;
    }

    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    wishes.unshift({ content, time: timeStr });
    localStorage.setItem('kittyWishes', JSON.stringify(wishes));
    renderWishes();
    wishInput.value = '';
    wishLengthSpan.textContent = '0';
}

// 删除愿望
function deleteWish(index) {
    if (confirm('确定要删除这个愿望吗？🥺')) {
        wishes.splice(index, 1);
        localStorage.setItem('kittyWishes', JSON.stringify(wishes));
        renderWishes();
    }
}

// 编辑愿望
function editWish(index) {
    const wish = wishes[index];
    const newContent = prompt('编辑你的愿望', wish.content);
    if (newContent === null) return;
    if (newContent.trim() === '') {
        alert('愿望不能为空哦！😜');
        return;
    }

    wishes[index].content = newContent.trim();
    localStorage.setItem('kittyWishes', JSON.stringify(wishes));
    renderWishes();
}

// 清空全部愿望
function clearAllWishes() {
    if (wishes.length === 0) {
        alert('暂无愿望可清空！😜');
        return;
    }
    if (confirm('确定要清空所有愿望吗？此操作不可恢复！🥺')) {
        wishes = [];
        localStorage.removeItem('kittyWishes');
        renderWishes();
    }
}

// 绑定许愿树事件
wishInput.addEventListener('input', () => {
    wishLengthSpan.textContent = wishInput.value.length;
});

addWishBtn.addEventListener('click', addWish);

wishInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addWish();
});

wishList.addEventListener('click', (e) => {
    const index = e.target.dataset.index;
    if (e.target.classList.contains('edit-wish-btn')) {
        editWish(index);
    } else if (e.target.classList.contains('delete-wish-btn')) {
        deleteWish(index);
    }
});

clearAllWishesBtn.addEventListener('click', clearAllWishes);

// 页面加载时渲染留言和愿望
window.addEventListener('load', () => {
    renderMessages();
    renderWishes();
});