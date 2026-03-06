// 移动待办事项应用 - 主逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 初始化变量
    let tasks = JSON.parse(localStorage.getItem('mobile-todo-tasks')) || [];
    let currentCategory = 'all';
    let notes = JSON.parse(localStorage.getItem('mobile-todo-notes')) || [];
    
    // DOM 元素
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const tasksList = document.getElementById('tasks-list');
    const totalTasksEl = document.getElementById('total-tasks');
    const completedTasksEl = document.getElementById('completed-tasks');
    const currentDateEl = document.getElementById('current-date');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const noteModal = document.getElementById('note-modal');
    const noteText = document.getElementById('note-text');
    const saveNoteBtn = document.getElementById('save-note');
    const cancelNoteBtn = document.getElementById('cancel-note');
    const addQuickNoteBtn = document.getElementById('add-quick-note');
    
    // 初始化日期显示
    function updateDate() {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        currentDateEl.textContent = now.toLocaleDateString('zh-CN', options);
    }
    
    // 更新任务统计
    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        totalTasksEl.textContent = total;
        completedTasksEl.textContent = completed;
    }
    
    // 保存任务到本地存储
    function saveTasks() {
        localStorage.setItem('mobile-todo-tasks', JSON.stringify(tasks));
        updateStats();
    }
    
    // 创建任务元素
    function createTaskElement(task) {
        const taskEl = document.createElement('div');
        taskEl.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskEl.dataset.id = task.id;
        
        // 长按删除功能
        let pressTimer;
        taskEl.addEventListener('touchstart', function(e) {
            pressTimer = setTimeout(() => {
                showDeleteConfirmation(task.id);
            }, 1000);
        });
        
        taskEl.addEventListener('touchend', function() {
            clearTimeout(pressTimer);
        });
        
        taskEl.addEventListener('touchmove', function() {
            clearTimeout(pressTimer);
        });
        
        const categoryColors = {
            work: '#4a90e2',
            personal: '#7ed321',
            shopping: '#ffa502',
            default: '#636e72'
        };
        
        taskEl.style.borderLeftColor = categoryColors[task.category] || categoryColors.default;
        
        taskEl.innerHTML = `
            <div class="task-checkbox ${task.completed ? 'checked' : ''}">
                ${task.completed ? '<i class="fas fa-check"></i>' : ''}
            </div>
            <div class="task-content">
                <div class="task-text">${task.text}</div>
                <div class="task-meta">
                    <span class="task-category">${getCategoryName(task.category)}</span>
                    <span class="task-time">
                        <i class="far fa-clock"></i>
                        ${formatTime(task.createdAt)}
                    </span>
                </div>
            </div>
            <div class="task-actions">
                <button class="task-action-btn edit-btn" title="编辑">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="task-action-btn delete-btn" title="删除">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // 添加事件监听器
        const checkbox = taskEl.querySelector('.task-checkbox');
        const editBtn = taskEl.querySelector('.edit-btn');
        const deleteBtn = taskEl.querySelector('.delete-btn');
        
        checkbox.addEventListener('click', () => toggleTask(task.id));
        editBtn.addEventListener('click', () => editTask(task.id));
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        return taskEl;
    }
    
    // 获取分类名称
    function getCategoryName(category) {
        const names = {
            work: '工作',
            personal: '个人',
            shopping: '购物',
            all: '全部'
        };
        return names[category] || category;
    }
    
    // 格式化时间
    function formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const diffHours = Math.floor(diff / (1000 * 60 * 60));
        
        if (diffHours < 1) {
            return '刚刚';
        } else if (diffHours < 24) {
            return `${diffHours}小时前`;
        } else {
            return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
        }
    }
    
    // 渲染任务列表
    function renderTasks() {
        tasksList.innerHTML = '';
        
        let filteredTasks = tasks;
        if (currentCategory !== 'all') {
            filteredTasks = tasks.filter(task => task.category === currentCategory);
        }
        
        if (filteredTasks.length === 0) {
            tasksList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <p>${currentCategory === 'all' ? '还没有任务，添加一个吧！' : '该分类下没有任务'}</p>
                </div>
            `;
            return;
        }
        
        // 按完成状态排序：未完成在前，已完成在后
        filteredTasks.sort((a, b) => {
            if (a.completed && !b.completed) return 1;
            if (!a.completed && b.completed) return -1;
            return b.createdAt - a.createdAt; // 新的在前
        });
        
        filteredTasks.forEach(task => {
            tasksList.appendChild(createTaskElement(task));
        });
    }
    
    // 添加新任务
    function addTask() {
        const text = taskInput.value.trim();
        if (!text) {
            showToast('请输入任务内容');
            taskInput.focus();
            return;
        }
        
        const newTask = {
            id: Date.now().toString(),
            text: text,
            category: currentCategory === 'all' ? 'personal' : currentCategory,
            completed: false,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        
        tasks.unshift(newTask);
        saveTasks();
        renderTasks();
        
        taskInput.value = '';
        taskInput.focus();
        
        showToast('任务添加成功');
        
        // 震动反馈（如果支持）
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }
    
    // 切换任务完成状态
    function toggleTask(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.updatedAt = Date.now();
            saveTasks();
            renderTasks();
            
            // 震动反馈
            if (navigator.vibrate) {
                navigator.vibrate(30);
            }
        }
    }
    
    // 编辑任务
    function editTask(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        
        const newText = prompt('编辑任务:', task.text);
        if (newText !== null && newText.trim() !== '') {
            task.text = newText.trim();
            task.updatedAt = Date.now();
            saveTasks();
            renderTasks();
            showToast('任务已更新');
        }
    }
    
    // 删除任务
    function deleteTask(taskId) {
        if (confirm('确定要删除这个任务吗？')) {
            tasks = tasks.filter(t => t.id !== taskId);
            saveTasks();
            renderTasks();
            showToast('任务已删除');
        }
    }
    
    // 显示删除确认
    function showDeleteConfirmation(taskId) {
        if (confirm('长按检测到删除操作，确定要删除这个任务吗？')) {
            deleteTask(taskId);
        }
    }
    
    // 清除已完成任务
    function clearCompletedTasks() {
        const completedCount = tasks.filter(t => t.completed).length;
        if (completedCount === 0) {
            showToast('没有已完成的任务');
            return;
        }
        
        if (confirm(`确定要清除 ${completedCount} 个已完成的任务吗？`)) {
            tasks = tasks.filter(t => !t.completed);
            saveTasks();
            renderTasks();
            showToast(`已清除 ${completedCount} 个任务`);
        }
    }
    
    // 显示提示消息
    function showToast(message) {
        // 移除现有的提示
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // 添加样式
        toast.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 14px;
            z-index: 1000;
            animation: fadeInOut 3s ease;
        `;
        
        // 添加动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
                15% { opacity: 1; transform: translateX(-50%) translateY(0); }
                85% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            toast.remove();
            style.remove();
        }, 3000);
    }
    
    // 分类切换
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            renderTasks();
        });
    });
    
    // 笔记功能
    function openNoteModal() {
        noteText.value = '';
        noteModal.style.display = 'flex';
        noteText.focus();
    }
    
    function closeNoteModal() {
        noteModal.style.display = 'none';
    }
    
    function saveNote() {
        const text = noteText.value.trim();
        if (!text) {
            showToast('请输入笔记内容');
            return;
        }
        
        const note = {
            id: Date.now().toString(),
            text: text,
            createdAt: Date.now()
        };
        
        notes.unshift(note);
        localStorage.setItem('mobile-todo-notes', JSON.stringify(notes));
        closeNoteModal();
        showToast('笔记保存成功');
    }
    
    // 事件监听器
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    addQuickNoteBtn.addEventListener('click', openNoteModal);
    saveNoteBtn.addEventListener('click', saveNote);
    cancelNoteBtn.addEventListener('click', closeNoteModal);
    
    // 点击模态框外部关闭
    noteModal.addEventListener('click', function(e) {
        if (e.target === noteModal) {
            closeNoteModal();
        }
    });
    
    // 初始化应用
    function init() {
        updateDate();
        updateStats();
        renderTasks();
        
        // 添加一些示例任务（如果没有任何任务）
        if (tasks.length === 0) {
            const exampleTasks = [
                { text: '欢迎使用移动待办事项', category: 'personal', completed: false },
                { text: '点击任务标记完成', category: 'work', completed: true },
                { text: '长按任务可以删除', category: 'personal', completed: false },
                { text: '尝试添加新任务', category: 'shopping', completed: false }
            ];
            
            exampleTasks.forEach((task, index) => {
                tasks.push({
                    id: (Date.now() + index).toString(),
                    text: task.text,
                    category: task.category,
                    completed: task.completed,
                    createdAt: Date.now() - (index * 1000 * 60 * 60), // 不同时间
                    updatedAt: Date.now()
                });
            });
            
            saveTasks();
            renderTasks();
        }
        
        // 检查 PWA 支持
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(console.error);
        }
    }
    
    // 启动应用
    init();
    
    // 添加离线检测
    window.addEventListener('online', () => {
        showToast('网络已恢复');
    });
    
    window.addEventListener('offline', () => {
        showToast('网络已断开，应用仍可离线使用');
    });
});