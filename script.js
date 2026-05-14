// ==================== FIREBASE КОНФИГУРАЦИЯ ====================
// !!! ВСТАВЬТЕ ВАШУ КОНФИГУРАЦИЮ ИЗ FIREBASE КОНСОЛИ !!!
const firebaseConfig = {
    apiKey: "ВАШ_API_KEY",
    authDomain: "ВАШ_AUTH_DOMAIN",
    projectId: "ВАШ_PROJECT_ID",
    storageBucket: "ВАШ_STORAGE_BUCKET",
    messagingSenderId: "ВАШ_MESSAGING_SENDER_ID",
    appId: "ВАШ_APP_ID"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ==================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ====================
let currentUser = null;
let currentTestEngine = null;
let selectedAnswer = null;
let testTimer = null;
let testSeconds = 0;

// ==================== КУРСЫ (8 предметов) ====================
const coursesData = [
    { id: 1, title: 'Основы программирования', description: 'Алгоритмы, переменные, циклы, функции на Python', icon: 'fa-code', color: 'blue', category: 'college',
        questions: { easy: [{ q: 'Что такое переменная?', answers: ['Константа', 'Именованная область памяти', 'Функция', 'Цикл'], correct: 1 }], medium: [], hard: [] } },
    { id: 2, title: 'Базы данных и SQL', description: 'Проектирование БД, запросы SELECT, JOIN', icon: 'fa-database', color: 'indigo', category: 'college',
        questions: { easy: [{ q: 'Что означает SQL?', answers: ['Structured Query Language', 'Simple Query Language', 'Standard Query Logic', 'System Query Language'], correct: 0 }], medium: [], hard: [] } },
    { id: 3, title: 'Веб-разработка', description: 'HTML, CSS, JavaScript, React основы', icon: 'fa-globe', color: 'teal', category: 'college',
        questions: { easy: [{ q: 'Что означает HTML?', answers: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyper Transfer Markup Language'], correct: 0 }], medium: [], hard: [] } },
    { id: 4, title: 'Операционные системы', description: 'Процессы, память, файловые системы', icon: 'fa-windows', color: 'cyan', category: 'college',
        questions: { easy: [{ q: 'Что такое процесс?', answers: ['Файл', 'Программа в выполнении', 'Папка', 'Драйвер'], correct: 1 }], medium: [], hard: [] } },
    { id: 5, title: 'Сетевые технологии', description: 'OSI, TCP/IP, IP-адресация', icon: 'fa-network-wired', color: 'purple', category: 'college',
        questions: { easy: [{ q: 'Что такое IP-адрес?', answers: ['Имя компьютера', 'Уникальный адрес в сети', 'Пароль', 'Протокол'], correct: 1 }], medium: [], hard: [] } },
    { id: 6, title: 'Математика', description: 'Алгебра, геометрия, тригонометрия', icon: 'fa-square-root-variable', color: 'red', category: 'school',
        questions: { easy: [{ q: 'Сколько будет 2 + 2 × 2?', answers: ['6', '8', '4', '5'], correct: 0 }], medium: [], hard: [] } },
    { id: 7, title: 'Физика', description: 'Механика, электричество, оптика', icon: 'fa-atom', color: 'yellow', category: 'school',
        questions: { easy: [{ q: 'Формула скорости?', answers: ['S/t', 'F/m', 'm/V', 'A/t'], correct: 0 }], medium: [], hard: [] } },
    { id: 8, title: 'Русский язык', description: 'Грамматика, орфография, пунктуация', icon: 'fa-book', color: 'pink', category: 'school',
        questions: { easy: [{ q: 'Как пишется "не" с глаголами?', answers: ['Слитно', 'Раздельно', 'Через дефис', 'Всегда слитно'], correct: 1 }], medium: [], hard: [] } }
];

// Дополним вопросы для всех курсов
coursesData.forEach(course => {
    if (course.id === 1) {
        course.questions.medium = [
            { q: 'Что делает функция range(5)?', answers: ['[0,1,2,3,4]', '[1,2,3,4,5]', '[0,1,2,3,4,5]', 'Ошибка'], correct: 0 },
            { q: 'Какой цикл выполняется пока условие истинно?', answers: ['for', 'while', 'do-while', 'foreach'], correct: 1 }
        ];
        course.questions.hard = [
            { q: 'Сложность алгоритма O(n log n) характерна для:', answers: ['Пузырьковая сортировка', 'Быстрая сортировка', 'Линейный поиск', 'Бинарный поиск'], correct: 1 }
        ];
    }
    if (course.id === 2) {
        course.questions.medium = [
            { q: 'Какой JOIN возвращает только совпадающие записи?', answers: ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN'], correct: 2 },
            { q: 'Какой оператор используется для фильтрации групп?', answers: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'], correct: 1 }
        ];
        course.questions.hard = [
            { q: 'Что такое транзакция?', answers: ['Запрос', 'Последовательность операций ACID', 'Индекс', 'Триггер'], correct: 1 }
        ];
    }
    if (course.id === 3) {
        course.questions.medium = [
            { q: 'Что такое Flexbox?', answers: ['База данных', 'Система верстки', 'Язык программирования', 'Фреймворк'], correct: 1 },
            { q: 'Какой метод массива перебирает элементы?', answers: ['map()', 'push()', 'pop()', 'length'], correct: 0 }
        ];
        course.questions.hard = [
            { q: 'Что делает async/await в JS?', answers: ['Цикл', 'Асинхронные операции', 'Математические вычисления', 'Работа с DOM'], correct: 1 }
        ];
    }
    if (course.id === 4) {
        course.questions.medium = [
            { q: 'Что такое тупик (deadlock)?', answers: ['Быстрая работа', 'Блокировка процессов', 'Завершение программы', 'Перезагрузка'], correct: 1 },
            { q: 'Какая команда создает директорию в Linux?', answers: ['mkdir', 'touch', 'cd', 'rm'], correct: 0 }
        ];
        course.questions.hard = [
            { q: 'Что такое S.M.A.R.T. в жестких дисках?', answers: ['Формат', 'Система самодиагностики', 'Протокол', 'Интерфейс'], correct: 1 }
        ];
    }
    if (course.id === 5) {
        course.questions.medium = [
            { q: 'Какой порт используется для HTTPS?', answers: ['80', '443', '8080', '21'], correct: 1 },
            { q: 'Что такое DNS?', answers: ['База данных', 'Система доменных имен', 'Протокол', 'Маршрутизатор'], correct: 1 }
        ];
        course.questions.hard = [
            { q: 'Что такое VLAN?', answers: ['Антивирус', 'Виртуальная локальная сеть', 'Протокол', 'Маршрутизатор'], correct: 1 }
        ];
    }
    if (course.id === 6) {
        course.questions.medium = [
            { q: 'Решите: 3x + 7 = 22', answers: ['x = 3', 'x = 5', 'x = 7', 'x = 9'], correct: 1 },
            { q: 'Чему равна площадь круга?', answers: ['πR²', '2πR', 'πD', 'πR/2'], correct: 0 }
        ];
        course.questions.hard = [
            { q: 'Чему равен sin(90°)?', answers: ['0', '1', '-1', '∞'], correct: 1 },
            { q: 'Производная sin(x) равна:', answers: ['cos(x)', '-cos(x)', 'sin(x)', '-sin(x)'], correct: 0 }
        ];
    }
    if (course.id === 7) {
        course.questions.medium = [
            { q: 'Закон Ома для участка цепи:', answers: ['I = U/R', 'U = I×R', 'R = U/I', 'Все верны'], correct: 3 },
            { q: 'Чему равна сила тяжести?', answers: ['mg', 'GMm/R²', 'ma', 'Все верны'], correct: 3 }
        ];
        course.questions.hard = [
            { q: 'Что такое фотоэффект?', answers: ['Излучение света', 'Выбивание электронов светом', 'Поглощение света', 'Отражение света'], correct: 1 }
        ];
    }
    if (course.id === 8) {
        course.questions.medium = [
            { q: 'Сколько букв в русском алфавите?', answers: ['30', '31', '32', '33'], correct: 3 },
            { q: 'Какая часть речи отвечает на вопрос "какой"?', answers: ['Глагол', 'Прилагательное', 'Существительное', 'Наречие'], correct: 1 }
        ];
        course.questions.hard = [
            { q: 'В каком слове пишется "ъ"?', answers: ['Об_езд', 'С_езд', 'Под_езд', 'Все верны'], correct: 3 }
        ];
    }
});

// ==================== АДАПТИВНЫЙ ТЕСТОВЫЙ ДВИЖОК ====================
class AdaptiveTestEngine {
    constructor(courseId) {
        this.courseId = courseId;
        this.course = coursesData.find(c => c.id === courseId);
        this.currentDifficulty = 'medium';
        this.difficultyLevels = ['easy', 'medium', 'hard'];
        this.difficultyIndex = 1;
        this.correctStreak = 0;
        this.wrongStreak = 0;
        this.usedQuestions = new Set();
        this.currentQuestion = null;
        this.questionNumber = 0;
        this.maxQuestions = 5;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.startTime = Date.now();
        this.responseTimes = [];
        this.questionStartTime = null;
    }

    getNextQuestion() {
        const questions = this.course.questions[this.currentDifficulty];
        const availableQuestions = questions.filter((_, idx) => !this.usedQuestions.has(`${this.currentDifficulty}_${idx}`));
        if (availableQuestions.length === 0) {
            this.usedQuestions.clear();
            return this.getNextQuestion();
        }
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const questionIndex = questions.indexOf(availableQuestions[randomIndex]);
        this.usedQuestions.add(`${this.currentDifficulty}_${questionIndex}`);
        this.currentQuestion = availableQuestions[randomIndex];
        this.questionStartTime = Date.now();
        this.questionNumber++;
        return this.currentQuestion;
    }

    submitAnswer(answerIndex) {
        const responseTime = (Date.now() - this.questionStartTime) / 1000;
        this.responseTimes.push(responseTime);
        const isCorrect = answerIndex === this.currentQuestion.correct;
        if (isCorrect) {
            this.correctAnswers++;
            this.correctStreak++;
            this.wrongStreak = 0;
        } else {
            this.wrongAnswers++;
            this.wrongStreak++;
            this.correctStreak = 0;
        }
        this.adjustDifficulty(isCorrect, responseTime);
        return { isCorrect, correctAnswer: this.currentQuestion.correct };
    }

    adjustDifficulty(isCorrect, responseTime) {
        const fastResponse = responseTime < 5;
        const slowResponse = responseTime > 15;
        if (isCorrect) {
            if (this.correctStreak >= 2 || (this.correctStreak >= 1 && fastResponse)) {
                if (this.difficultyIndex < 2) {
                    this.difficultyIndex++;
                    this.currentDifficulty = this.difficultyLevels[this.difficultyIndex];
                    this.correctStreak = 0;
                }
            }
        } else {
            if (this.wrongStreak >= 2 || (this.wrongStreak >= 1 && slowResponse)) {
                if (this.difficultyIndex > 0) {
                    this.difficultyIndex--;
                    this.currentDifficulty = this.difficultyLevels[this.difficultyIndex];
                    this.wrongStreak = 0;
                }
            }
        }
    }

    isTestComplete() {
        return this.questionNumber >= this.maxQuestions;
    }

    getResults() {
        const totalTime = (Date.now() - this.startTime) / 1000;
        const score = Math.round((this.correctAnswers / this.maxQuestions) * 100);
        return {
            id: Date.now(),
            userId: currentUser ? currentUser.uid : null,
            courseId: this.courseId,
            courseTitle: this.course.title,
            score,
            correctAnswers: this.correctAnswers,
            wrongAnswers: this.wrongAnswers,
            totalQuestions: this.maxQuestions,
            totalTime,
            date: new Date().toISOString()
        };
    }

    generateAIAnalysis(results) {
        const score = results.score;
        if (score >= 90) {
            return { analysis: 'Превосходный результат!', recommendations: ['Переходите к сложным темам', 'Попробуйте тест повышенной сложности'] };
        } else if (score >= 70) {
            return { analysis: 'Хороший результат!', recommendations: ['Повторите ошибки', 'Практикуйтесь регулярно'] };
        } else if (score >= 50) {
            return { analysis: 'Удовлетворительный результат.', recommendations: ['Изучите базовые концепции', 'Начните с легких вопросов'] };
        } else {
            return { analysis: 'ИИ выявил пробелы в знаниях.', recommendations: ['Изучите основы', 'Практикуйтесь ежедневно'] };
        }
    }
}

// ==================== ФУНКЦИИ АУТЕНТИФИКАЦИИ ====================
function updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    if (!authButtons) return;

    if (currentUser) {
        const isAdmin = currentUser.email === 'admin@eduaipro.com';
        authButtons.innerHTML = `
            <div class="relative">
                <button onclick="toggleUserMenu()" class="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                    <i class="fas fa-user-circle text-purple-600 text-xl"></i>
                    <span class="font-medium">${currentUser.displayName || currentUser.email}</span>
                    ${isAdmin ? '<span class="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded-full">Admin</span>' : ''}
                </button>
                <div id="userMenu" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    ${isAdmin ? '<a href="admin.html" class="block px-4 py-2 text-red-600 hover:bg-red-50 transition"><i class="fas fa-shield-alt mr-2"></i>Админ-панель</a>' : ''}
                    <a href="dashboard.html" class="block px-4 py-2 text-gray-700 hover:bg-purple-50 transition">
                        <i class="fas fa-tachometer-alt mr-2"></i>Панель управления
                    </a>
                    <button onclick="logout()" class="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition">
                        <i class="fas fa-sign-out-alt mr-2"></i>Выйти
                    </button>
                </div>
            </div>
        `;
    } else {
        authButtons.innerHTML = `
            <button onclick="showLogin()" class="px-4 py-2 text-purple-600 font-medium hover:text-purple-700 transition">Войти</button>
            <button onclick="showRegister()" class="px-6 py-2 gradient-bg text-white rounded-lg font-medium hover:shadow-lg transition">Регистрация</button>
        `;
    }
}

function toggleUserMenu() {
    const menu = document.getElementById('userMenu');
    if (menu) menu.classList.toggle('hidden');
}

document.addEventListener('click', function(event) {
    const menu = document.getElementById('userMenu');
    const button = event.target.closest('button');
    if (menu && !menu.contains(event.target) && (!button || !button.onclick?.toString().includes('toggleUserMenu'))) {
        menu.classList.add('hidden');
    }
});

function showLogin() { document.getElementById('loginModal').classList.remove('hidden'); }
function showRegister() { document.getElementById('registerModal').classList.remove('hidden'); }
function closeModal(modalId) { document.getElementById(modalId).classList.add('hidden'); }
function switchToRegister() { closeModal('loginModal'); showRegister(); }
function switchToLogin() { closeModal('registerModal'); showLogin(); }

async function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        await userCredential.user.updateProfile({ displayName: name });
        
        // Сохраняем пользователя в Firestore
        await db.collection('users').doc(userCredential.user.uid).set({
            uid: userCredential.user.uid,
            name: name,
            email: email,
            role: 'user',
            createdAt: new Date().toISOString()
        });
        
        currentUser = userCredential.user;
        closeModal('registerModal');
        updateAuthUI();
        window.location.href = 'dashboard.html';
    } catch (error) {
        alert('Ошибка регистрации: ' + error.message);
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        currentUser = userCredential.user;
        closeModal('loginModal');
        updateAuthUI();
        
        // Проверяем, админ ли это
        if (email === 'admin@eduaipro.com') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        alert('Ошибка входа: ' + error.message);
    }
}

async function logout() {
    await auth.signOut();
    currentUser = null;
    updateAuthUI();
    window.location.href = 'index.html';
}

// ==================== СТРАНИЦА КУРСОВ ====================
function loadCourses() {
    const grid = document.getElementById('coursesGrid');
    if (!grid) return;
    
    grid.innerHTML = coursesData.map(course => `
        <div class="card-hover bg-white p-8 rounded-2xl shadow-md">
            <div class="w-16 h-16 bg-gradient-to-br from-${course.color}-500 to-${course.color}-600 rounded-xl flex items-center justify-center mb-6">
                <i class="fas ${course.icon} text-white text-2xl"></i>
            </div>
            <h3 class="text-2xl font-bold mb-3">${course.title}</h3>
            <p class="text-gray-600 mb-6">${course.description}</p>
            <button onclick="startTest(${course.id})" class="w-full py-3 gradient-bg text-white rounded-lg font-medium hover:shadow-lg transition">
                Начать тест <i class="fas fa-arrow-right ml-2"></i>
            </button>
        </div>
    `).join('');
}

function filterCourses(category) {
    const grid = document.getElementById('coursesGrid');
    if (!grid) return;
    const filtered = category === 'all' ? coursesData : coursesData.filter(c => c.category === category);
    grid.innerHTML = filtered.map(course => `
        <div class="card-hover bg-white p-8 rounded-2xl shadow-md">
            <div class="w-16 h-16 bg-gradient-to-br from-${course.color}-500 to-${course.color}-600 rounded-xl flex items-center justify-center mb-6">
                <i class="fas ${course.icon} text-white text-2xl"></i>
            </div>
            <h3 class="text-2xl font-bold mb-3">${course.title}</h3>
            <p class="text-gray-600 mb-6">${course.description}</p>
            <button onclick="startTest(${course.id})" class="w-full py-3 gradient-bg text-white rounded-lg font-medium hover:shadow-lg transition">
                Начать тест <i class="fas fa-arrow-right ml-2"></i>
            </button>
        </div>
    `).join('');
}

// ==================== ПАНЕЛЬ ПОЛЬЗОВАТЕЛЯ ====================
async function loadDashboardData() {
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('dashboardUserName').textContent = currentUser.displayName || currentUser.email;
    
    const resultsSnapshot = await db.collection('results').where('userId', '==', currentUser.uid).get();
    const results = [];
    resultsSnapshot.forEach(doc => results.push(doc.data()));
    
    document.getElementById('completedCourses').textContent = results.length;
    document.getElementById('correctAnswers').textContent = results.reduce((sum, r) => sum + (r.correctAnswers || 0), 0);
    document.getElementById('totalPoints').textContent = results.reduce((sum, r) => sum + (r.score || 0), 0);
    document.getElementById('currentStreak').textContent = calculateStreak(results);

    loadProgressChart(results);
    loadRecentActivity(results);
    loadAvailableTests();
}

function calculateStreak(results) {
    if (results.length === 0) return 0;
    const dates = results.map(r => new Date(r.date).toDateString());
    const uniqueDates = [...new Set(dates)].sort((a, b) => new Date(b) - new Date(a));
    let streak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
        streak = 1;
        for (let i = 1; i < uniqueDates.length; i++) {
            const diff = (new Date(uniqueDates[i-1]) - new Date(uniqueDates[i])) / 86400000;
            if (diff === 1) streak++;
            else break;
        }
    }
    return streak;
}

function loadProgressChart(results) {
    const ctx = document.getElementById('progressChart');
    if (!ctx) return;
    const last5Results = results.slice(-5);
    const labels = last5Results.map((r, i) => r.courseTitle.substring(0, 15) + '...');
    const scores = last5Results.map(r => r.score);
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.length > 0 ? labels : ['Нет данных'],
            datasets: [{
                label: 'Результат (%)',
                data: scores.length > 0 ? scores : [0],
                borderColor: 'rgb(102, 126, 234)',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }
    });
}

function loadRecentActivity(results) {
    const container = document.getElementById('recentActivity');
    const recent = results.slice(-5).reverse();
    if (recent.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">Нет активности</p>';
        return;
    }
    container.innerHTML = recent.map(r => `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><i class="fas fa-check text-purple-600"></i></div>
                <div>
                    <p class="font-medium">${r.courseTitle}</p>
                    <p class="text-sm text-gray-500">${new Date(r.date).toLocaleDateString('ru-RU')}</p>
                </div>
            </div>
            <div class="text-right">
                <p class="font-bold text-purple-600">${r.score}%</p>
                <p class="text-xs text-gray-500">${r.correctAnswers}/${r.totalQuestions}</p>
            </div>
        </div>
    `).join('');
}

function loadAvailableTests() {
    const container = document.getElementById('availableTests');
    if (!container) return;
    container.innerHTML = coursesData.map(course => `
        <div class="p-4 border border-gray-200 rounded-lg hover:border-purple-500 transition cursor-pointer" onclick="startTest(${course.id})">
            <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gradient-to-br from-${course.color}-500 to-${course.color}-600 rounded-lg flex items-center justify-center">
                    <i class="fas ${course.icon} text-white"></i>
                </div>
                <div class="flex-1">
                    <h4 class="font-bold">${course.title}</h4>
                    <p class="text-sm text-gray-600">${course.description.substring(0, 50)}...</p>
                </div>
                <i class="fas fa-chevron-right text-gray-400"></i>
            </div>
        </div>
    `).join('');
}

// ==================== ТЕСТИРОВАНИЕ ====================
function startTest(courseId) {
    if (!currentUser) {
        showLogin();
        return;
    }
    sessionStorage.setItem('testCourseId', courseId);
    window.location.href = 'test.html';
}

function initTest() {
    const courseId = parseInt(sessionStorage.getItem('testCourseId'));
    if (!courseId || !currentUser) {
        window.location.href = 'courses.html';
        return;
    }
    currentTestEngine = new AdaptiveTestEngine(courseId);
    testSeconds = 0;
    document.getElementById('testTitle').textContent = currentTestEngine.course.title;
    startTestTimer();
    loadNextQuestion();
}

function startTestTimer() {
    testTimer = setInterval(() => {
        testSeconds++;
        const minutes = Math.floor(testSeconds / 60);
        const seconds = testSeconds % 60;
        const timerEl = document.getElementById('testTimer');
        if (timerEl) timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

function stopTestTimer() {
    if (testTimer) { clearInterval(testTimer); testTimer = null; }
}

function loadNextQuestion() {
    selectedAnswer = null;
    const nextBtn = document.getElementById('nextQuestionBtn');
    if (nextBtn) nextBtn.disabled = true;
    
    const question = currentTestEngine.getNextQuestion();
    const currentQEl = document.getElementById('currentQuestion');
    const totalQEl = document.getElementById('totalQuestions');
    if (currentQEl) currentQEl.textContent = currentTestEngine.questionNumber;
    if (totalQEl) totalQEl.textContent = currentTestEngine.maxQuestions;
    
    const difficultyMap = { easy: 'Легкая', medium: 'Средняя', hard: 'Сложная' };
    const difficultyEl = document.getElementById('currentDifficulty');
    if (difficultyEl) difficultyEl.textContent = difficultyMap[currentTestEngine.currentDifficulty];
    
    const correctEl = document.getElementById('correctCount');
    const wrongEl = document.getElementById('wrongCount');
    if (correctEl) correctEl.textContent = currentTestEngine.correctAnswers;
    if (wrongEl) wrongEl.textContent = currentTestEngine.wrongAnswers;
    
    const progress = (currentTestEngine.questionNumber / currentTestEngine.maxQuestions) * 100;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) progressBar.style.width = `${progress}%`;
    
    const questionText = document.getElementById('questionText');
    if (questionText) questionText.textContent = question.q;
    
    const answersContainer = document.getElementById('answersContainer');
    if (answersContainer) {
        answersContainer.innerHTML = question.answers.map((answer, idx) => `
            <div class="answer-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition" 
                 onclick="selectAnswer(${idx})" data-index="${idx}">
                <div class="flex items-center space-x-3">
                    <div class="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center answer-radio">
                        <div class="w-3 h-3 bg-purple-600 rounded-full hidden answer-dot"></div>
                    </div>
                    <span>${answer}</span>
                </div>
            </div>
        `).join('');
    }
}

function selectAnswer(index) {
    selectedAnswer = index;
    document.querySelectorAll('.answer-option').forEach((el, idx) => {
        if (idx === index) {
            el.classList.add('border-purple-500', 'bg-purple-50');
            el.classList.remove('border-gray-200');
            const radio = el.querySelector('.answer-radio');
            const dot = el.querySelector('.answer-dot');
            if (radio) radio.classList.add('border-purple-600');
            if (dot) dot.classList.remove('hidden');
        } else {
            el.classList.remove('border-purple-500', 'bg-purple-50');
            el.classList.add('border-gray-200');
            const radio = el.querySelector('.answer-radio');
            const dot = el.querySelector('.answer-dot');
            if (radio) radio.classList.remove('border-purple-600');
            if (dot) dot.classList.add('hidden');
        }
    });
    const nextBtn = document.getElementById('nextQuestionBtn');
    if (nextBtn) nextBtn.disabled = false;
}

async function submitAnswer() {
    if (selectedAnswer === null) return;
    const aiThinking = document.getElementById('aiThinking');
    if (aiThinking) aiThinking.classList.remove('hidden');
    const nextBtn = document.getElementById('nextQuestionBtn');
    if (nextBtn) nextBtn.disabled = true;
    
    setTimeout(async () => {
        const result = currentTestEngine.submitAnswer(selectedAnswer);
        document.querySelectorAll('.answer-option').forEach((el, idx) => {
            if (idx === result.correctAnswer) {
                el.classList.add('correct-answer', 'border-green-500', 'bg-green-50');
            } else if (idx === selectedAnswer && !result.isCorrect) {
                el.classList.add('wrong-answer', 'border-red-500', 'bg-red-50');
            }
            el.style.pointerEvents = 'none';
        });
        if (aiThinking) aiThinking.classList.add('hidden');
        
        setTimeout(() => {
            if (currentTestEngine.isTestComplete()) {
                finishTest();
            } else {
                loadNextQuestion();
            }
        }, 1500);
    }, 1000);
}

async function finishTest() {
    stopTestTimer();
    const results = currentTestEngine.getResults();
    results.userId = currentUser.uid;
    
    // Сохраняем в Firestore
    await db.collection('results').add(results);
    
    const analysis = currentTestEngine.generateAIAnalysis(results);
    showResults(results, analysis);
}

function showResults(results, analysis) {
    const modal = document.getElementById('resultsModal');
    if (modal) modal.classList.remove('hidden');
    
    const scoreEl = document.getElementById('resultScore');
    const correctEl = document.getElementById('resultCorrect');
    const timeEl = document.getElementById('resultTime');
    if (scoreEl) scoreEl.textContent = `${results.score}%`;
    if (correctEl) correctEl.textContent = results.correctAnswers;
    
    const minutes = Math.floor(results.totalTime / 60);
    const seconds = Math.floor(results.totalTime % 60);
    if (timeEl) timeEl.textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;
    
    const iconEl = document.getElementById('resultIcon');
    if (iconEl) {
        if (results.score >= 90) {
            iconEl.className = 'w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-yellow-100';
            iconEl.innerHTML = '<i class="fas fa-trophy text-4xl text-yellow-600"></i>';
        } else if (results.score >= 70) {
            iconEl.className = 'w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-green-100';
            iconEl.innerHTML = '<i class="fas fa-medal text-4xl text-green-600"></i>';
        } else {
            iconEl.className = 'w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-blue-100';
            iconEl.innerHTML = '<i class="fas fa-thumbs-up text-4xl text-blue-600"></i>';
        }
    }
    
    const analysisEl = document.getElementById('aiAnalysis');
    if (analysisEl) analysisEl.textContent = analysis.analysis;
    
    const recommendationsEl = document.getElementById('aiRecommendations');
    if (recommendationsEl) {
        recommendationsEl.innerHTML = analysis.recommendations.map(rec => `
            <div class="flex items-start space-x-2">
                <i class="fas fa-check-circle text-green-500 mt-1"></i>
                <span class="text-sm text-gray-700">${rec}</span>
            </div>
        `).join('');
    }
}

function retryTest() {
    const modal = document.getElementById('resultsModal');
    if (modal) modal.classList.add('hidden');
    const courseId = currentTestEngine.courseId;
    currentTestEngine = new AdaptiveTestEngine(courseId);
    testSeconds = 0;
    startTestTimer();
    loadNextQuestion();
}

function exitTest() {
    if (confirm('Вы уверены, что хотите выйти? Прогресс будет потерян.')) {
        stopTestTimer();
        window.location.href = 'dashboard.html';
    }
}

// ==================== АДМИН-ПАНЕЛЬ ====================
async function loadAdminData() {
    if (!currentUser || currentUser.email !== 'admin@eduaipro.com') {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('adminName').textContent = currentUser.displayName || 'Администратор';
    
    // Получаем всех пользователей из Firestore
    const usersSnapshot = await db.collection('users').get();
    const users = [];
    usersSnapshot.forEach(doc => users.push(doc.data()));
    
    const regularUsers = users.filter(u => u.role !== 'admin');
    const admins = users.filter(u => u.role === 'admin');
    
    // Получаем все результаты
    const resultsSnapshot = await db.collection('results').get();
    const allResults = [];
    resultsSnapshot.forEach(doc => allResults.push(doc.data()));
    
    const avgScore = allResults.length > 0 
        ? Math.round(allResults.reduce((s, r) => s + r.score, 0) / allResults.length)
        : 0;
    
    document.getElementById('totalUsers').textContent = regularUsers.length;
    document.getElementById('totalAdmins').textContent = admins.length;
    document.getElementById('totalTests').textContent = allResults.length;
    document.getElementById('avgScore').textContent = `${avgScore}%`;
    
    loadAdminUsersTable(regularUsers, allResults);
    loadAdminResultsTable(allResults, users);
}

function loadAdminUsersTable(users, allResults) {
    const container = document.getElementById('adminUsersTable');
    if (!container) return;
    
    if (users.length === 0) {
        container.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-gray-500">Нет зарегистрированных пользователей</td></tr>';
        return;
    }
    
    container.innerHTML = users.map(user => {
        const userResults = allResults.filter(r => r.userId === user.uid);
        const totalTests = userResults.length;
        const avgUserScore = totalTests > 0 
            ? Math.round(userResults.reduce((s, r) => s + r.score, 0) / totalTests)
            : 0;
        
        return `
            <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4 font-medium">${escapeHtml(user.name)}</td>
                <td class="py-3 px-4">${escapeHtml(user.email)}</td>
                <td class="py-3 px-4">${new Date(user.createdAt).toLocaleDateString('ru-RU')}</td>
                <td class="py-3 px-4 text-center">
                    <span class="font-bold">${totalTests}</span>
                    <span class="text-xs text-gray-500">(ср. ${avgUserScore}%)</span>
                </td>
                <td class="py-3 px-4">
                    <button onclick="viewUserDetails('${user.uid}')" class="text-blue-600 hover:text-blue-800 mr-3" title="Просмотр">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="deleteUser('${user.uid}')" class="text-red-600 hover:text-red-800" title="Удалить">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

async function viewUserDetails(userId) {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) return;
    const user = userDoc.data();
    
    const resultsSnapshot = await db.collection('results').where('userId', '==', userId).get();
    const userResults = [];
    resultsSnapshot.forEach(doc => userResults.push(doc.data()));
    
    let resultsHtml = '';
    if (userResults.length === 0) {
        resultsHtml = '<p class="text-gray-500">Нет пройденных тестов</p>';
    } else {
        resultsHtml = '<div class="space-y-2 max-h-96 overflow-y-auto">';
        userResults.forEach(r => {
            resultsHtml += `
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                        <p class="font-medium">${r.courseTitle}</p>
                        <p class="text-xs text-gray-500">${new Date(r.date).toLocaleString('ru-RU')}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-bold ${r.score >= 70 ? 'text-green-600' : r.score >= 50 ? 'text-yellow-600' : 'text-red-600'}">${r.score}%</p>
                        <p class="text-xs text-gray-500">${r.correctAnswers}/${r.totalQuestions}</p>
                    </div>
                </div>
            `;
        });
        resultsHtml += '</div>';
    }
    
    const modalHtml = `
        <div id="userDetailModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl max-w-2xl w-full p-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold">${escapeHtml(user.name)}</h2>
                    <button onclick="closeUserDetailModal()" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <div class="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p><strong>Email:</strong> ${escapeHtml(user.email)}</p>
                    <p><strong>Зарегистрирован:</strong> ${new Date(user.createdAt).toLocaleString('ru-RU')}</p>
                    <p><strong>Всего тестов:</strong> ${userResults.length}</p>
                    <p><strong>Средний балл:</strong> ${userResults.length > 0 ? Math.round(userResults.reduce((s, r) => s + r.score, 0) / userResults.length) : 0}%</p>
                </div>
                <h3 class="font-bold mb-3">Результаты тестов:</h3>
                ${resultsHtml}
                <div class="mt-6 flex justify-end">
                    <button onclick="closeUserDetailModal()" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">Закрыть</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeUserDetailModal() {
    const modal = document.getElementById('userDetailModal');
    if (modal) modal.remove();
}

async function loadAdminResultsTable(allResults, users) {
    const container = document.getElementById('adminResultsTable');
    if (!container) return;
    
    const results = [...allResults].reverse().slice(0, 30);
    if (results.length === 0) {
        container.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-gray-500">Нет результатов тестов</td></tr>';
        return;
    }
    
    container.innerHTML = results.map(result => {
        const user = users.find(u => u.uid === result.userId);
        const userName = user ? user.name : 'Неизвестный';
        return `
            <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4 font-medium">${escapeHtml(userName)}</td>
                <td class="py-3 px-4">${result.courseTitle}</td>
                <td class="py-3 px-4">
                    <span class="px-2 py-1 rounded-full text-xs font-bold ${result.score >= 70 ? 'bg-green-100 text-green-700' : result.score >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}">
                        ${result.score}%
                    </span>
                </td>
                <td class="py-3 px-4">${result.correctAnswers}/${result.totalQuestions}</td>
                <td class="py-3 px-4 text-sm">${new Date(result.date).toLocaleString('ru-RU')}</td>
            </tr>
        `;
    }).join('');
}

async function deleteUser(userId) {
    if (confirm('Удалить пользователя? Все его результаты также будут удалены.')) {
        // Удаляем результаты пользователя
        const resultsSnapshot = await db.collection('results').where('userId', '==', userId).get();
        const batch = db.batch();
        resultsSnapshot.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        
        // Удаляем пользователя из коллекции users
        await db.collection('users').doc(userId).delete();
        
        // Обновляем страницу
        location.reload();
    }
}

async function resetAllData() {
    if (confirm('ВНИМАНИЕ! Это удалит ВСЕХ пользователей (кроме админа) и все результаты. Продолжить?')) {
        // Получаем всех пользователей
        const usersSnapshot = await db.collection('users').get();
        const batch = db.batch();
        
        usersSnapshot.forEach(doc => {
            const user = doc.data();
            if (user.email !== 'admin@eduaipro.com') {
                batch.delete(doc.ref);
            }
        });
        
        // Удаляем все результаты
        const resultsSnapshot = await db.collection('results').get();
        resultsSnapshot.forEach(doc => batch.delete(doc.ref));
        
        await batch.commit();
        alert('Все данные сброшены. Админ сохранен.');
        location.reload();
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

async function loadStatsForIndex() {
    const resultsSnapshot = await db.collection('results').get();
    const usersSnapshot = await db.collection('users').get();
    const regularUsers = usersSnapshot.docs.filter(doc => doc.data().role !== 'admin');
    
    const studentsEl = document.getElementById('statsStudents');
    const testsEl = document.getElementById('statsTests');
    if (studentsEl) studentsEl.textContent = regularUsers.length;
    if (testsEl) testsEl.textContent = resultsSnapshot.size;
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
auth.onAuthStateChanged(async (user) => {
    currentUser = user;
    updateAuthUI();
    
    if (document.getElementById('statsStudents')) {
        await loadStatsForIndex();
    }
    
    if (document.getElementById('coursesGrid')) {
        loadCourses();
        const heroSection = document.querySelector('#coursesGrid').previousElementSibling;
        if (heroSection && heroSection.classList && heroSection.classList.contains('text-center')) {
            const filterContainer = document.createElement('div');
            filterContainer.className = 'flex justify-center space-x-4 mb-12 flex-wrap gap-3';
            filterContainer.innerHTML = `
                <button onclick="filterCourses('all')" class="px-5 py-2 rounded-full bg-purple-600 text-white font-medium transition">Все курсы</button>
                <button onclick="filterCourses('college')" class="px-5 py-2 rounded-full bg-gray-200 hover:bg-purple-200 transition font-medium">Колледж (ИСП)</button>
                <button onclick="filterCourses('school')" class="px-5 py-2 rounded-full bg-gray-200 hover:bg-purple-200 transition font-medium">Школьные предметы</button>
            `;
            heroSection.parentNode.insertBefore(filterContainer, document.getElementById('coursesGrid'));
        }
    }
    
    if (document.getElementById('dashboardUserName')) {
        await loadDashboardData();
    }
    
    if (document.getElementById('testTitle')) {
        initTest();
    }
    
    if (document.getElementById('adminStats')) {
        await loadAdminData();
    }
});