<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>我的待辦事項</title>

    <link rel="stylesheet" href="style.css">
</head>

<body>

<div class="app">

    <!-- Sidebar -->
    <aside class="sidebar">

        <div class="brand">
            <div class="brand-icon">✓</div>
            <div>
                <h1>TaskFlow</h1>
                <span>我的待辦事項</span>
            </div>
        </div>

        <nav class="navigation">

            <button class="nav-item active" data-filter="all">
                <span>📋</span>
                <span>全部任務</span>
                <strong id="allCount">0</strong>
            </button>

            <button class="nav-item" data-filter="active">
                <span>⏳</span>
                <span>進行中</span>
                <strong id="activeCount">0</strong>
            </button>

            <button class="nav-item" data-filter="completed">
                <span>✅</span>
                <span>已完成</span>
                <strong id="completedCount">0</strong>
            </button>

        </nav>

        <div class="sidebar-section">

            <div class="section-title">
                <span>分類</span>
            </div>

            <button class="category-item" data-category="工作">
                <span class="category-dot blue"></span>
                工作
            </button>

            <button class="category-item" data-category="個人">
                <span class="category-dot purple"></span>
                個人
            </button>

            <button class="category-item" data-category="購物">
                <span class="category-dot orange"></span>
                購物
            </button>

            <button class="category-item" data-category="其他">
                <span class="category-dot green"></span>
                其他
            </button>

        </div>

        <div class="sidebar-bottom">

            <button id="themeToggle" class="side-button">
                🌙
                <span>深色模式</span>
            </button>

            <button id="clearCompleted" class="side-button danger">
                🗑️
                <span>清除已完成</span>
            </button>

        </div>

    </aside>


    <!-- Main -->
    <main class="main">

        <header class="topbar">

            <div>
                <p class="date" id="currentDate"></p>
                <h2>今天要完成什麼？</h2>
            </div>

            <button id="addTaskBtn" class="add-button">
                <span>＋</span>
                新增任務
            </button>

        </header>


        <!-- Statistics -->
        <section class="stats">

            <div class="stat-card">
                <div class="stat-icon blue-icon">📋</div>
                <div>
                    <span>全部任務</span>
                    <strong id="statAll">0</strong>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon orange-icon">⏳</div>
                <div>
                    <span>進行中</span>
                    <strong id="statActive">0</strong>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon green-icon">✓</div>
                <div>
                    <span>已完成</span>
                    <strong id="statCompleted">0</strong>
                </div>
            </div>

            <div class="stat-card progress-card">
                <div class="progress-info">
                    <span>完成進度</span>
                    <strong id="progressText">0%</strong>
                </div>

                <div class="progress-bar">
                    <div id="progressBar"></div>
                </div>
            </div>

        </section>


        <!-- Search / Filter -->
        <section class="toolbar">

            <div class="search-box">

                <span>🔍</span>

                <input
                    type="text"
                    id="searchInput"
                    placeholder="搜尋任務..."
                >

            </div>

            <select id="sortSelect">

                <option value="created">最新建立</option>
                <option value="priority">優先級</option>
                <option value="date">截止日期</option>

            </select>

        </section>


        <!-- Tasks -->
        <section class="task-section">

            <div class="task-header">

                <div>
                    <h3 id="taskTitle">全部任務</h3>
                    <span id="taskSubtitle">管理你的待辦事項</span>
                </div>

                <button id="todayBtn" class="today-button">
                    今天
                </button>

            </div>


            <div id="taskList" class="task-list"></div>


            <div id="emptyState" class="empty-state">

                <div class="empty-icon">🎉</div>

                <h3>目前沒有任務</h3>

                <p>
                    新增一個任務，開始管理你的今天吧！
                </p>

                <button id="emptyAddBtn">
                    ＋ 新增第一個任務
                </button>

            </div>

        </section>

    </main>

</div>


<!-- Modal -->

<div id="taskModal" class="modal">

    <div class="modal-overlay"></div>

    <div class="modal-content">

        <div class="modal-header">

            <div>
                <h2 id="modalTitle">新增任務</h2>
                <p>建立一個新的待辦事項</p>
            </div>

            <button id="closeModal" class="close-button">
                ×
            </button>

        </div>


        <form id="taskForm">

            <input type="hidden" id="taskId">


            <div class="form-group">

                <label for="taskName">
                    任務名稱
                </label>

                <input
                    type="text"
                    id="taskName"
                    placeholder="例如：完成專案報告"
                    required
                >

            </div>


            <div class="form-group">

                <label for="taskDescription">
                    描述
                </label>

                <textarea
                    id="taskDescription"
                    placeholder="輸入任務詳細內容..."
                    rows="3"
                ></textarea>

            </div>


            <div class="form-row">

                <div class="form-group">

                    <label for="taskDate">
                        截止日期
                    </label>

                    <input
                        type="date"
                        id="taskDate"
                    >

                </div>


                <div class="form-group">

                    <label for="taskPriority">
                        優先級
                    </label>

                    <select id="taskPriority">

                        <option value="low">
                            低
                        </option>

                        <option value="medium" selected>
                            中
                        </option>

                        <option value="high">
                            高
                        </option>

                    </select>

                </div>

            </div>


            <div class="form-group">

                <label for="taskCategory">
                    分類
                </label>

                <select id="taskCategory">

                    <option value="工作">工作</option>
                    <option value="個人">個人</option>
                    <option value="購物">購物</option>
                    <option value="其他">其他</option>

                </select>

            </div>


            <div class="modal-actions">

                <button
                    type="button"
                    id="cancelBtn"
                    class="cancel-button"
                >
                    取消
                </button>

                <button
                    type="submit"
                    class="save-button"
                >
                    儲存任務
                </button>

            </div>

        </form>

    </div>

</div>


<!-- Toast -->

<div id="toast" class="toast">
    <span id="toastIcon">✓</span>
    <span id="toastMessage">操作成功</span>
</div>


<script src="script.js"></script>

</body>
</html>
