// ==================== FIREBASE КОНФИГУРАЦИЯ ====================
const firebaseConfig = {
    apiKey: "AIzaSyBTibyssRECMbEuTlCJWBqTWUTI_vhetFA",
    authDomain: "eduaipro-546b7.firebaseapp.com",
    projectId: "eduaipro-546b7",
    storageBucket: "eduaipro-546b7.firebasestorage.app",
    messagingSenderId: "184005321510",
    appId: "1:184005321510:web:537c974f4bfa9040e997e7",
    measurementId: "G-89Y5P1WR9T"
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

// ==================== РАСШИРЕННЫЕ КУРСЫ (20+ предметов) ====================
const coursesData = [
    // === ПРОГРАММИРОВАНИЕ ===
    { id: 1, title: 'Python с нуля', description: 'Основы Python: переменные, циклы, функции, ООП', icon: 'fa-python', color: 'blue', category: 'programming',
        questions: { 
            easy: [
                { q: 'Какой оператор используется для вывода в Python?', answers: ['input()', 'print()', 'output()', 'write()'], correct: 1, topic: 'Базовый синтаксис' },
                { q: 'Какой тип данных используется для целых чисел?', answers: ['str', 'int', 'float', 'bool'], correct: 1, topic: 'Типы данных' },
                { q: 'Как создать список в Python?', answers: ['{}', '[]', '()', '<>'], correct: 1, topic: 'Списки' },
                { q: 'Что делает функция len()?', answers: ['Сортирует', 'Возвращает длину', 'Удаляет элемент', 'Добавляет элемент'], correct: 1, topic: 'Функции' },
                { q: 'Какой цикл используется для перебора элементов?', answers: ['while', 'for', 'do-while', 'foreach'], correct: 1, topic: 'Циклы' }
            ],
            medium: [
                { q: 'Что делает функция range(5)?', answers: ['[0,1,2,3,4]', '[1,2,3,4,5]', '[0,1,2,3,4,5]', 'Ошибка'], correct: 0, topic: 'Функции' },
                { q: 'Что такое рекурсия?', answers: ['Цикл', 'Функция, вызывающая себя', 'Массив', 'Объект'], correct: 1, topic: 'Алгоритмы' },
                { q: 'Как объявить словарь в Python?', answers: ['[]', '{}', '()', '<>'], correct: 1, topic: 'Словари' },
                { q: 'Что делает метод .append()?', answers: ['Удаляет', 'Добавляет в конец', 'Вставляет в начало', 'Сортирует'], correct: 1, topic: 'Методы списков' },
                { q: 'Какая библиотека для работы с массивами?', answers: ['numpy', 'pandas', 'matplotlib', 'scipy'], correct: 0, topic: 'Библиотеки' }
            ],
            hard: [
                { q: 'Что такое декоратор в Python?', answers: ['Класс', 'Функция, изменяющая другую функцию', 'Переменная', 'Модуль'], correct: 1, topic: 'Продвинутый Python' },
                { q: 'Сложность алгоритма O(n log n) характерна для:', answers: ['Пузырьковая сортировка', 'Быстрая сортировка', 'Линейный поиск', 'Бинарный поиск'], correct: 1, topic: 'Алгоритмы' },
                { q: 'Что такое генератор в Python?', answers: ['Функция с yield', 'Класс', 'Модуль', 'Библиотека'], correct: 0, topic: 'Продвинутый Python' },
                { q: 'Что делает оператор `is`?', answers: ['Сравнивает значения', 'Сравнивает объекты', 'Проверяет тип', 'Присваивает'], correct: 1, topic: 'Операторы' },
                { q: 'Что такое GIL в Python?', answers: ['Библиотека', 'Глобальная блокировка интерпретатора', 'Фреймворк', 'Тип данных'], correct: 1, topic: 'Внутреннее устройство' }
            ]
        }
    },
    { id: 2, title: 'JavaScript/TypeScript', description: 'Frontend, Node.js, TS типы', icon: 'fa-js', color: 'yellow', category: 'programming',
        questions: { 
            easy: [
                { q: 'Как объявить переменную в JS?', answers: ['var', 'let', 'const', 'Все варианты'], correct: 3, topic: 'Переменные' },
                { q: 'Что такое замыкание?', answers: ['Цикл', 'Функция с доступом к внешней области', 'Массив', 'Объект'], correct: 1, topic: 'Функции' },
                { q: 'Какой метод превращает JSON в объект?', answers: ['JSON.stringify()', 'JSON.parse()', 'JSON.toObject()', 'JSON.convert()'], correct: 1, topic: 'JSON' },
                { q: 'Что делает оператор `===`?', answers: ['Присваивание', 'Строгое сравнение', 'Нестрогое сравнение', 'Сложение'], correct: 1, topic: 'Операторы' },
                { q: 'Как создать промис?', answers: ['new Promise()', 'Promise.create()', 'new Async()', 'Promise()'], correct: 0, topic: 'Асинхронность' }
            ],
            medium: [
                { q: 'Что делает async/await?', answers: ['Цикл', 'Асинхронные операции', 'Синхронные операции', 'Работа с DOM'], correct: 1, topic: 'Асинхронность' },
                { q: 'Что такое Virtual DOM в React?', answers: ['Реальная БД', 'Копия DOM в памяти', 'CSS фреймворк', 'Сервер'], correct: 1, topic: 'React' },
                { q: 'Какой метод массива перебирает элементы?', answers: ['map()', 'push()', 'pop()', 'length'], correct: 0, topic: 'Массивы' },
                { q: 'Что такое TypeScript?', answers: ['База данных', 'Надстройка над JS с типами', 'CSS фреймворк', 'Библиотека'], correct: 1, topic: 'TypeScript' },
                { q: 'Что делает оператор `...` (spread)?', answers: ['Умножение', 'Разворачивание массива/объекта', 'Деление', 'Сложение'], correct: 1, topic: 'ES6+' }
            ],
            hard: [
                { q: 'Что такое Event Loop?', answers: ['Цикл событий в JS', 'Цикл for', 'Массив событий', 'Тип данных'], correct: 0, topic: 'Асинхронность' },
                { q: 'Что делает метод `bind()`?', answers: ['Привязывает контекст', 'Создает копию', 'Удаляет', 'Добавляет'], correct: 0, topic: 'Функции' },
                { q: 'Что такое декораторы в TS?', answers: ['Классы', 'Специальные аннотации', 'Функции', 'Модули'], correct: 1, topic: 'TypeScript' },
                { q: 'Что такое RxJS?', answers: ['Фреймворк', 'Библиотека для реактивного программирования', 'База данных', 'CSS'], correct: 1, topic: 'Библиотеки' },
                { q: 'Что такое Webpack?', answers: ['Сборщик модулей', 'База данных', 'Сервер', 'Фреймворк'], correct: 0, topic: 'Инструменты' }
            ]
        }
    },
    { id: 3, title: 'Базы данных SQL', description: 'SELECT, JOIN, индексы, нормализация', icon: 'fa-database', color: 'indigo', category: 'database',
        questions: { 
            easy: [
                { q: 'Что означает SQL?', answers: ['Structured Query Language', 'Simple Query Language', 'Standard Query Logic', 'System Query Language'], correct: 0, topic: 'Основы' },
                { q: 'Какой оператор для выборки данных?', answers: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'], correct: 2, topic: 'SELECT' },
                { q: 'Что такое первичный ключ?', answers: ['Уникальный идентификатор', 'Внешний ключ', 'Индекс', 'Триггер'], correct: 0, topic: 'Ключи' },
                { q: 'Что делает WHERE?', answers: ['Фильтрует строки', 'Сортирует', 'Группирует', 'Объединяет'], correct: 0, topic: 'Фильтрация' },
                { q: 'Что такое NULL?', answers: ['Ноль', 'Пустое значение', 'Ошибка', 'Строка'], correct: 1, topic: 'Значения' }
            ],
            medium: [
                { q: 'Какой JOIN возвращает только совпадающие записи?', answers: ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN'], correct: 2, topic: 'JOIN' },
                { q: 'Какой оператор для фильтрации групп?', answers: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'], correct: 1, topic: 'GROUP BY' },
                { q: 'Что такое индекс в БД?', answers: ['Ускоряет поиск', 'Замедляет поиск', 'Тип данных', 'Ключ'], correct: 0, topic: 'Индексы' },
                { q: 'Что делает UNION?', answers: ['Объединяет результаты', 'Пересекает', 'Вычитает', 'Умножает'], correct: 0, topic: 'Объединение' },
                { q: 'Что такое нормализация?', answers: ['Ускорение', 'Устранение избыточности', 'Создание индексов', 'Резервное копирование'], correct: 1, topic: 'Проектирование' }
            ],
            hard: [
                { q: 'Что такое транзакция?', answers: ['Запрос', 'Последовательность операций ACID', 'Индекс', 'Триггер'], correct: 1, topic: 'Транзакции' },
                { q: 'Какой уровень изоляции самый высокий?', answers: ['READ UNCOMMITTED', 'READ COMMITTED', 'REPEATABLE READ', 'SERIALIZABLE'], correct: 3, topic: 'Изоляция' },
                { q: 'Что такое денормализация?', answers: ['Ускорение чтения за счет избыточности', 'Замедление', 'Удаление таблиц', 'Создание связей'], correct: 0, topic: 'Оптимизация' },
                { q: 'Что такое оконная функция?', answers: ['Функция с OVER()', 'Обычная функция', 'Агрегация', 'Сортировка'], correct: 0, topic: 'Оконные функции' },
                { q: 'Что такое шардирование?', answers: ['Разделение данных', 'Объединение', 'Копирование', 'Шифрование'], correct: 0, topic: 'Масштабирование' }
            ]
        }
    },
    { id: 4, title: 'NoSQL MongoDB', description: 'Документо-ориентированные БД, агрегации', icon: 'fa-leaf', color: 'green', category: 'database',
        questions: { 
            easy: [
                { q: 'Как хранятся данные в MongoDB?', answers: ['Таблицы', 'Документы JSON', 'Графы', 'Ключ-значение'], correct: 1, topic: 'Модель данных' },
                { q: 'Что такое _id в MongoDB?', answers: ['Первичный ключ', 'Индекс', 'Связь', 'Тип'], correct: 0, topic: 'Идентификаторы' },
                { q: 'Какой метод для поиска?', answers: ['find()', 'search()', 'select()', 'get()'], correct: 0, topic: 'Поиск' },
                { q: 'Что такое коллекция?', answers: ['База данных', 'Аналог таблицы', 'Документ', 'Поле'], correct: 1, topic: 'Структура' },
                { q: 'Что такое BSON?', answers: ['Двоичный JSON', 'Текстовый JSON', 'XML', 'CSV'], correct: 0, topic: 'Форматы' }
            ],
            medium: [
                { q: 'Что делает агрегация $match?', answers: ['Фильтрует', 'Сортирует', 'Группирует', 'Объединяет'], correct: 0, topic: 'Агрегация' },
                { q: 'Что такое индекс в MongoDB?', answers: ['Ускоряет запросы', 'Замедляет', 'Тип данных', 'Связь'], correct: 0, topic: 'Оптимизация' },
                { q: 'Как создать индекс?', answers: ['createIndex()', 'addIndex()', 'newIndex()', 'makeIndex()'], correct: 0, topic: 'Индексы' },
                { q: 'Что делает оператор $group?', answers: ['Группирует документы', 'Фильтрует', 'Сортирует', 'Ограничивает'], correct: 0, topic: 'Агрегация' },
                { q: 'Что такое репликация?', answers: ['Копирование данных', 'Разделение', 'Шифрование', 'Сжатие'], correct: 0, topic: 'Отказоустойчивость' }
            ],
            hard: [
                { q: 'Что такое шардирование в MongoDB?', answers: ['Горизонтальное масштабирование', 'Вертикальное', 'Резервирование', 'Шифрование'], correct: 0, topic: 'Масштабирование' },
                { q: 'Что делает оператор $lookup?', answers: ['JOIN между коллекциями', 'Поиск', 'Фильтр', 'Сортировка'], correct: 0, topic: 'Объединение' },
                { q: 'Что такое Change Streams?', answers: ['Поток изменений', 'Поток данных', 'Репликация', 'Бэкап'], correct: 0, topic: 'Реальное время' },
                { q: 'Что такое ACID в MongoDB?', answers: ['Транзакции', 'Индексы', 'Репликация', 'Шардирование'], correct: 0, topic: 'Транзакции' },
                { q: 'Что такое GridFS?', answers: ['Хранение больших файлов', 'Индексация', 'Репликация', 'Шардирование'], correct: 0, topic: 'Файлы' }
            ]
        }
    },
    { id: 5, title: 'Веб-разработка', description: 'HTML5, CSS3, Flexbox, Grid, Адаптивность', icon: 'fa-globe', color: 'teal', category: 'web',
        questions: { 
            easy: [
                { q: 'Что означает HTML?', answers: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyper Transfer Markup Language'], correct: 0, topic: 'HTML' },
                { q: 'Какой тег для ссылки?', answers: ['<link>', '<a>', '<href>', '<url>'], correct: 1, topic: 'Теги' },
                { q: 'Как подключить CSS?', answers: ['<style>', '<css>', '<link>', '<script>'], correct: 2, topic: 'CSS' },
                { q: 'Что такое Flexbox?', answers: ['Система верстки', 'База данных', 'Язык', 'Фреймворк'], correct: 0, topic: 'CSS' },
                { q: 'Что делает свойство display: none?', answers: ['Скрывает элемент', 'Удаляет', 'Делает невидимым', 'Блокирует'], correct: 0, topic: 'CSS' }
            ],
            medium: [
                { q: 'Что такое CSS Grid?', answers: ['Двумерная сетка', 'Одномерная', 'Флекс', 'Таблица'], correct: 0, topic: 'CSS' },
                { q: 'Как сделать адаптивность?', answers: ['Media Queries', 'JavaScript', 'PHP', 'SQL'], correct: 0, topic: 'Адаптивность' },
                { q: 'Что такое семантическая верстка?', answers: ['Осмысленные теги', 'Стили', 'Скрипты', 'Изображения'], correct: 0, topic: 'HTML' },
                { q: 'Что делает z-index?', answers: ['Управляет слоями', 'Увеличивает', 'Уменьшает', 'Поворачивает'], correct: 0, topic: 'CSS' },
                { q: 'Что такое Bootstrap?', answers: ['CSS фреймворк', 'База данных', 'Язык', 'Библиотека JS'], correct: 0, topic: 'Фреймворки' }
            ],
            hard: [
                { q: 'Что такое BEM?', answers: ['Методология CSS', 'Фреймворк', 'Библиотека', 'Язык'], correct: 0, topic: 'Методологии' },
                { q: 'Что такое CSS переменные?', answers: ['Custom properties', 'Переменные JS', 'SASS', 'LESS'], correct: 0, topic: 'CSS' },
                { q: 'Что такое Critical CSS?', answers: ['Важный CSS для первой заливки', 'Весь CSS', 'Минифицированный', 'Сжатый'], correct: 0, topic: 'Оптимизация' },
                { q: 'Что такое WebP?', answers: ['Формат изображений', 'Видео', 'Аудио', 'Текст'], correct: 0, topic: 'Оптимизация' },
                { q: 'Что такое PWA?', answers: ['Progressive Web App', 'PHP App', 'Python App', 'CSS App'], correct: 0, topic: 'Современный Web' }
            ]
        }
    },
    { id: 6, title: 'React.js', description: 'Компоненты, хуки, состояние, роутинг', icon: 'fa-react', color: 'cyan', category: 'web',
        questions: { 
            easy: [
                { q: 'Что такое React?', answers: ['Библиотека UI', 'Фреймворк', 'Язык', 'База данных'], correct: 0, topic: 'Основы' },
                { q: 'Что такое JSX?', answers: ['Расширение JS', 'CSS', 'HTML', 'JSON'], correct: 0, topic: 'JSX' },
                { q: 'Как создать компонент?', answers: ['function/class', 'component()', 'new Component()', 'create()'], correct: 0, topic: 'Компоненты' },
                { q: 'Что такое props?', answers: ['Передача данных', 'Состояние', 'Стили', 'События'], correct: 0, topic: 'Props' },
                { q: 'Что такое state?', answers: ['Внутреннее состояние', 'Внешние данные', 'Стили', 'События'], correct: 0, topic: 'State' }
            ],
            medium: [
                { q: 'Что такое useState?', answers: ['Хук состояния', 'Хук эффекта', 'Хук контекста', 'Хук рефа'], correct: 0, topic: 'Хуки' },
                { q: 'Что такое useEffect?', answers: ['Хук для побочных эффектов', 'Хук состояния', 'Хук рефа', 'Хук контекста'], correct: 0, topic: 'Хуки' },
                { q: 'Что такое Virtual DOM?', answers: ['Копия DOM в памяти', 'Настоящий DOM', 'CSSOM', 'Shadow DOM'], correct: 0, topic: 'Оптимизация' },
                { q: 'Что делает React.memo?', answers: ['Мемоизация компонента', 'Создание', 'Удаление', 'Обновление'], correct: 0, topic: 'Оптимизация' },
                { q: 'Что такое контекст?', answers: ['Глобальные данные', 'Локальные', 'Стили', 'События'], correct: 0, topic: 'Context' }
            ],
            hard: [
                { q: 'Что такое Redux?', answers: ['Менеджер состояния', 'Роутер', 'Фреймворк', 'Библиотека'], correct: 0, topic: 'Управление состоянием' },
                { q: 'Что такое Saga?', answers: ['Миddлвар для побочных эффектов', 'Хук', 'Компонент', 'Стиль'], correct: 0, topic: 'Redux' },
                { q: 'Что такое React Router?', answers: ['Роутинг', 'Состояние', 'Стили', 'Формы'], correct: 0, topic: 'Роутинг' },
                { q: 'Что такое Next.js?', answers: ['Фреймворк на React', 'Библиотека', 'CSS', 'База данных'], correct: 0, topic: 'Фреймворки' },
                { q: 'Что такое SSR?', answers: ['Server Side Rendering', 'Client Side', 'Static', 'Dynamic'], correct: 0, topic: 'Рендеринг' }
            ]
        }
    },
    { id: 7, title: 'Node.js/Express', description: 'Backend, REST API, middleware, JWT', icon: 'fa-node', color: 'green', category: 'backend',
        questions: { 
            easy: [
                { q: 'Что такое Node.js?', answers: ['Среда JS на сервере', 'Библиотека', 'Фреймворк', 'База данных'], correct: 0, topic: 'Основы' },
                { q: 'Какой модуль для сервера?', answers: ['http', 'fs', 'path', 'os'], correct: 0, topic: 'Модули' },
                { q: 'Что такое npm?', answers: ['Менеджер пакетов', 'Язык', 'База данных', 'Сервер'], correct: 0, topic: 'Экосистема' },
                { q: 'Что такое Express?', answers: ['Фреймворк', 'База данных', 'ORM', 'Шаблонизатор'], correct: 0, topic: 'Express' },
                { q: 'Что такое middleware?', answers: ['Промежуточное ПО', 'База данных', 'Роутер', 'Контроллер'], correct: 0, topic: 'Middleware' }
            ],
            medium: [
                { q: 'Что делает метод app.get()?', answers: ['Обрабатывает GET запросы', 'POST', 'PUT', 'DELETE'], correct: 0, topic: 'Маршрутизация' },
                { q: 'Что такое JWT?', answers: ['JSON Web Token', 'База данных', 'Шифрование', 'Формат'], correct: 0, topic: 'Аутентификация' },
                { q: 'Что такое CORS?', answers: ['Кросс-доменные запросы', 'База данных', 'Шифрование', 'Кэш'], correct: 0, topic: 'Безопасность' },
                { q: 'Что такое PM2?', answers: ['Менеджер процессов', 'База данных', 'Логгер', 'Тестирование'], correct: 0, topic: 'Деплой' },
                { q: 'Что такое cluster?', answers: ['Многопоточность', 'Однопоточность', 'База данных', 'Кэш'], correct: 0, topic: 'Масштабирование' }
            ],
            hard: [
                { q: 'Что такое Event Loop в Node.js?', answers: ['Цикл событий', 'Цикл for', 'Таймер', 'Поток'], correct: 0, topic: 'Асинхронность' },
                { q: 'Что такое stream?', answers: ['Потоки данных', 'База данных', 'Файлы', 'События'], correct: 0, topic: 'Потоки' },
                { q: 'Что такое buffer?', answers: ['Буфер данных', 'Массив', 'Объект', 'Строка'], correct: 0, topic: 'Потоки' },
                { q: 'Что такое child_process?', answers: ['Дочерние процессы', 'Потоки', 'События', 'Таймеры'], correct: 0, topic: 'Процессы' },
                { q: 'Что такое WebSocket?', answers: ['Двусторонняя связь', 'HTTP', 'HTTPS', 'TCP'], correct: 0, topic: 'Реальное время' }
            ]
        }
    },
    // === ШКОЛЬНЫЕ ПРЕДМЕТЫ ===
    { id: 8, title: 'Математика (профиль)', description: 'Алгебра, геометрия, тригонометрия, логарифмы', icon: 'fa-square-root-variable', color: 'red', category: 'school',
        questions: { 
            easy: [
                { q: 'Сколько будет 2 + 2 × 2?', answers: ['6', '8', '4', '5'], correct: 0, topic: 'Арифметика' },
                { q: 'Чему равен корень из 144?', answers: ['10', '11', '12', '13'], correct: 2, topic: 'Корни' },
                { q: 'Сколько градусов в прямом угле?', answers: ['45°', '90°', '180°', '360°'], correct: 1, topic: 'Геометрия' },
                { q: 'Чему равно 5! (факториал)?', answers: ['60', '100', '120', '125'], correct: 2, topic: 'Факториалы' },
                { q: 'Сколько будет 10% от 200?', answers: ['10', '20', '30', '40'], correct: 1, topic: 'Проценты' }
            ],
            medium: [
                { q: 'Решите: 3x + 7 = 22', answers: ['x = 3', 'x = 5', 'x = 7', 'x = 9'], correct: 1, topic: 'Уравнения' },
                { q: 'Чему равна площадь круга?', answers: ['πR²', '2πR', 'πD', 'πR/2'], correct: 0, topic: 'Геометрия' },
                { q: 'Чему равен sin(90°)?', answers: ['0', '1', '-1', '∞'], correct: 1, topic: 'Тригонометрия' },
                { q: 'Решите: log₂(8) = ?', answers: ['2', '3', '4', '8'], correct: 1, topic: 'Логарифмы' },
                { q: 'Чему равна производная x²?', answers: ['x', '2x', 'x²', '2'], correct: 1, topic: 'Производные' }
            ],
            hard: [
                { q: 'Производная sin(x) равна:', answers: ['cos(x)', '-cos(x)', 'sin(x)', '-sin(x)'], correct: 0, topic: 'Тригонометрия' },
                { q: 'Чему равен интеграл ∫2x dx?', answers: ['x² + C', 'x²', '2x²', '2x² + C'], correct: 0, topic: 'Интегралы' },
                { q: 'Решите уравнение: e^x = 5', answers: ['ln 5', 'log 5', 'e^5', '5^e'], correct: 0, topic: 'Логарифмы' },
                { q: 'Чему равен предел lim(x→0) sin(x)/x?', answers: ['0', '1', '∞', 'не существует'], correct: 1, topic: 'Пределы' },
                { q: 'Сколько корней у x² + 4x + 4 = 0?', answers: ['0', '1', '2', '3'], correct: 1, topic: 'Квадратные уравнения' }
            ]
        }
    },
    { id: 9, title: 'Физика', description: 'Механика, термодинамика, электричество, оптика', icon: 'fa-atom', color: 'yellow', category: 'school',
        questions: { 
            easy: [
                { q: 'Формула скорости?', answers: ['S/t', 'F/m', 'm/V', 'A/t'], correct: 0, topic: 'Механика' },
                { q: 'Единица измерения силы?', answers: ['Джоуль', 'Ньютон', 'Ватт', 'Паскаль'], correct: 1, topic: 'Единицы' },
                { q: 'Что такое инерция?', answers: ['Сохранение скорости', 'Движение', 'Ускорение', 'Торможение'], correct: 0, topic: 'Механика' },
                { q: 'Сколько цветов в радуге?', answers: ['5', '6', '7', '8'], correct: 2, topic: 'Оптика' },
                { q: 'Что измеряет амперметр?', answers: ['Силу тока', 'Напряжение', 'Сопротивление', 'Мощность'], correct: 0, topic: 'Электричество' }
            ],
            medium: [
                { q: 'Закон Ома для участка цепи:', answers: ['I = U/R', 'U = I×R', 'R = U/I', 'Все верны'], correct: 3, topic: 'Электричество' },
                { q: 'Чему равна сила тяжести?', answers: ['mg', 'GMm/R²', 'ma', 'Все верны'], correct: 3, topic: 'Механика' },
                { q: 'Какая формула у закона Гука?', answers: ['F = kx', 'F = ma', 'E = mc²', 'P = UI'], correct: 0, topic: 'Механика' },
                { q: 'Что такое фотон?', answers: ['Частица света', 'Электрон', 'Протон', 'Нейтрон'], correct: 0, topic: 'Квантовая' },
                { q: 'Чему равно g на Земле?', answers: ['~9.8 м/с²', '~10', '~8.9', '~11'], correct: 0, topic: 'Механика' }
            ],
            hard: [
                { q: 'Что такое фотоэффект?', answers: ['Выбивание электронов светом', 'Излучение', 'Поглощение', 'Отражение'], correct: 0, topic: 'Квантовая' },
                { q: 'Формула Эйнштейна?', answers: ['E = mc²', 'F = ma', 'E = hν', 'F = G*m*M/R²'], correct: 0, topic: 'Относительность' },
                { q: 'Что такое энтропия?', answers: ['Мера хаоса', 'Энергия', 'Температура', 'Давление'], correct: 0, topic: 'Термодинамика' },
                { q: 'Что такое бозон Хиггса?', answers: ['Частица массы', 'Частица света', 'Гравитон', 'Фотон'], correct: 0, topic: 'Квантовая' },
                { q: 'Что такое черная дыра?', answers: ['Область с огромной гравитацией', 'Дыра в космосе', 'Темная материя', 'Нейтронная звезда'], correct: 0, topic: 'Астрофизика' }
            ]
        }
    },
    { id: 10, title: 'Русский язык', description: 'Орфография, пунктуация, стилистика', icon: 'fa-book', color: 'pink', category: 'school',
        questions: { 
            easy: [
                { q: 'Как пишется "не" с глаголами?', answers: ['Слитно', 'Раздельно', 'Через дефис', 'Всегда слитно'], correct: 1, topic: 'Правописание' },
                { q: 'Найди предлог:', answers: ['Дом', 'Красивый', 'В', 'Бежать'], correct: 2, topic: 'Части речи' },
                { q: 'Сколько гласных букв?', answers: ['6', '10', '12', '8'], correct: 1, topic: 'Алфавит' },
                { q: 'Какое слово лишнее?', answers: ['Яблоко', 'Груша', 'Стул', 'Апельсин'], correct: 2, topic: 'Лексика' },
                { q: 'Что такое синоним?', answers: ['Сходное слово', 'Противоположное', 'Одинаковое', 'Разное'], correct: 0, topic: 'Лексика' }
            ],
            medium: [
                { q: 'Сколько букв в русском алфавите?', answers: ['30', '31', '32', '33'], correct: 3, topic: 'Алфавит' },
                { q: 'Какая часть речи отвечает на вопрос "какой"?', answers: ['Глагол', 'Прилагательное', 'Существительное', 'Наречие'], correct: 1, topic: 'Части речи' },
                { q: 'Как правильно? "Одеть" или "Надеть"', answers: ['Одеть кого-то', 'Надеть что-то', 'Оба варианта', 'Нет правильного'], correct: 1, topic: 'Глаголы' },
                { q: 'Что такое деепричастие?', answers: ['Добавочное действие', 'Основное действие', 'Признак', 'Предмет'], correct: 0, topic: 'Грамматика' },
                { q: 'Как пишется "пол-лимона"?', answers: ['Через дефис', 'Слитно', 'Раздельно', 'Через апостроф'], correct: 0, topic: 'Правописание' }
            ],
            hard: [
                { q: 'В каком слове пишется "ъ"?', answers: ['Об_езд', 'С_езд', 'Под_езд', 'Все верны'], correct: 3, topic: 'Правописание' },
                { q: 'Какое слово пишется через дефис?', answers: ['пол-арбуза', 'полуавтомат', 'поллимона', 'пологурца'], correct: 0, topic: 'Правописание' },
                { q: 'Что такое инверсия?', answers: ['Обратный порядок слов', 'Прямой порядок', 'Повтор', 'Сравнение'], correct: 0, topic: 'Синтаксис' },
                { q: 'Какое слово вводное?', answers: ['кажется', 'бежит', 'красивый', 'дом'], correct: 0, topic: 'Пунктуация' },
                { q: 'Сколько падежей в русском?', answers: ['5', '6', '7', '8'], correct: 1, topic: 'Грамматика' }
            ]
        }
    },
    { id: 11, title: 'Английский язык', description: 'Грамматика, времена, лексика, идиомы', icon: 'fa-language', color: 'blue', category: 'school',
        questions: { 
            easy: [
                { q: 'Как переводится "Hello"?', answers: ['Пока', 'Привет', 'Спасибо', 'Пожалуйста'], correct: 1, topic: 'Приветствия' },
                { q: 'Выберите артикль: ___ apple', answers: ['a', 'an', 'the', '-'], correct: 1, topic: 'Артикли' },
                { q: 'Множественное число "cat"?', answers: ['cats', 'cates', 'caties', 'cat'], correct: 0, topic: 'Множественное число' },
                { q: 'Как сказать "спасибо"?', answers: ['Please', 'Thank you', 'Sorry', 'Hello'], correct: 1, topic: 'Вежливость' },
                { q: 'Цвет "красный" по-английски?', answers: ['Red', 'Blue', 'Green', 'Yellow'], correct: 0, topic: 'Цвета' }
            ],
            medium: [
                { q: 'I ___ to school yesterday', answers: ['go', 'went', 'gone', 'going'], correct: 1, topic: 'Прошедшее время' },
                { q: 'Present Perfect образуется с:', answers: ['have/has + V3', 'was/were + Ving', 'will + V', 'did + V'], correct: 0, topic: 'Времена' },
                { q: 'Что означает "break a leg"?', answers: ['сломать ногу', 'удачи', 'уйти', 'устать'], correct: 1, topic: 'Идиомы' },
                { q: 'Синоним к "big"?', answers: ['Large', 'Small', 'Tiny', 'Little'], correct: 0, topic: 'Синонимы' },
                { q: 'Антоним к "hot"?', answers: ['Cold', 'Warm', 'Cool', 'Freezing'], correct: 0, topic: 'Антонимы' }
            ],
            hard: [
                { q: 'If I ___ you, I would apologize', answers: ['am', 'was', 'were', 'be'], correct: 2, topic: 'Условные предложения' },
                { q: 'Что означает "kick the bucket"?', answers: ['умереть', 'ударить', 'пнуть ведро', 'уйти'], correct: 0, topic: 'Идиомы' },
                { q: 'В каком времени используется "had + V3"?', answers: ['Past Perfect', 'Present Perfect', 'Future Perfect', 'Past Simple'], correct: 0, topic: 'Времена' },
                { q: 'Что такое инверсия в английском?', answers: ['Обратный порядок слов', 'Вопрос', 'Отрицание', 'Утверждение'], correct: 0, topic: 'Синтаксис' },
                { q: 'Что означает "once in a blue moon"?', answers: ['Очень редко', 'Раз в месяц', 'Никогда', 'Всегда'], correct: 0, topic: 'Идиомы' }
            ]
        }
    }
];

// ==================== УЛУЧШЕННЫЙ АДАПТИВНЫЙ ТЕСТОВЫЙ ДВИЖОК ====================
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
        this.maxQuestions = 10; // Увеличено до 10 вопросов
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.startTime = Date.now();
        this.responseTimes = [];
        this.questionStartTime = null;
        this.topicPerformance = new Map(); // Отслеживание по темам
    }

    getNextQuestion() {
        // ИИ: выбирает вопросы с учетом слабых тем
        const questions = this.course.questions[this.currentDifficulty];
        let availableQuestions = questions.filter((_, idx) => !this.usedQuestions.has(`${this.currentDifficulty}_${idx}`));
        
        if (availableQuestions.length === 0) {
            this.usedQuestions.clear();
            availableQuestions = questions;
        }
        
        // ИИ: приоритет вопросам из тем, где были ошибки
        if (this.topicPerformance.size > 0) {
            const weakTopics = Array.from(this.topicPerformance.entries())
                .filter(([_, correct]) => correct < 50)
                .map(([topic]) => topic);
            
            if (weakTopics.length > 0) {
                const weakQuestions = availableQuestions.filter(q => weakTopics.includes(q.topic));
                if (weakQuestions.length > 0) {
                    availableQuestions = weakQuestions;
                }
            }
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
        
        // Обновляем статистику по темам
        const topic = this.currentQuestion.topic;
        const currentTopicStats = this.topicPerformance.get(topic) || { correct: 0, total: 0 };
        if (isCorrect) {
            currentTopicStats.correct++;
            this.correctAnswers++;
            this.correctStreak++;
            this.wrongStreak = 0;
        } else {
            currentTopicStats.correct = currentTopicStats.correct;
            this.wrongAnswers++;
            this.wrongStreak++;
            this.correctStreak = 0;
        }
        currentTopicStats.total++;
        this.topicPerformance.set(topic, currentTopicStats);
        
        // ИИ: динамическая корректировка сложности
        const fastResponse = responseTime < 5;
        const slowResponse = responseTime > 15;
        const isConfident = fastResponse && isCorrect;
        const isStruggling = slowResponse && !isCorrect;

        if (isCorrect && (this.correctStreak >= 2 || isConfident)) {
            if (this.difficultyIndex < 2) {
                this.difficultyIndex++;
                this.currentDifficulty = this.difficultyLevels[this.difficultyIndex];
                this.correctStreak = 0;
            }
        } else if (!isCorrect && (this.wrongStreak >= 2 || isStruggling)) {
            if (this.difficultyIndex > 0) {
                this.difficultyIndex--;
                this.currentDifficulty = this.difficultyLevels[this.difficultyIndex];
                this.wrongStreak = 0;
            }
        }
        
        return { isCorrect, correctAnswer: this.currentQuestion.correct, topic };
    }

    isTestComplete() {
        return this.questionNumber >= this.maxQuestions;
    }

    getResults() {
        const totalTime = (Date.now() - this.startTime) / 1000;
        const score = Math.round((this.correctAnswers / this.maxQuestions) * 100);
        
        // Генерируем детальный анализ
        const weakTopics = Array.from(this.topicPerformance.entries())
            .filter(([_, stats]) => (stats.correct / stats.total) * 100 < 60)
            .map(([topic]) => topic);
        
        const strongTopics = Array.from(this.topicPerformance.entries())
            .filter(([_, stats]) => (stats.correct / stats.total) * 100 >= 80)
            .map(([topic]) => topic);
        
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
            avgResponseTime: this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length,
            weakTopics,
            strongTopics,
            date: new Date().toISOString()
        };
    }

    generateAIAnalysis(results) {
        const score = results.score;
        let analysis = '';
        let recommendations = [];
        
        // Детальный ИИ-анализ
        if (score >= 90) {
            analysis = '🎉 Превосходный результат! Вы демонстрируете глубокое понимание материала. ИИ отмечает вашу высокую скорость реакции и точность ответов.';
            recommendations = ['🏆 Вы готовы к сертификации', '📚 Рекомендуем перейти к продвинутым темам', '🎯 Попробуйте тест повышенной сложности'];
        } else if (score >= 75) {
            analysis = '✅ Хороший результат! У вас отличные базовые знания. ИИ рекомендует обратить внимание на темы, где были ошибки.';
            recommendations = ['📖 Повторите слабые темы', '✍️ Практикуйтесь регулярно', '🎯 Пройдите тест еще раз для закрепления'];
        } else if (score >= 60) {
            analysis = '📈 Удовлетворительный результат. ИИ выявил пробелы в некоторых темах. Систематическое обучение поможет быстро прогрессировать.';
            recommendations = ['🔍 Сосредоточьтесь на слабых темах', '📝 Больше практических заданий', '📚 Изучите теорию перед пересдачей'];
        } else if (score >= 40) {
            analysis = '⚠️ Базовый уровень. ИИ рекомендует начать с изучения фундаментальных концепций. Не отчаивайтесь, каждый эксперт когда-то был новичком!';
            recommendations = ['📖 Начните с легкого уровня сложности', '✏️ Делайте конспекты', '🎯 Ставьте небольшие ежедневные цели'];
        } else {
            analysis = '🌱 ИИ выявил значительные пробелы в знаниях. Рекомендуем начать обучение с азов. Помните: путь в тысячу миль начинается с первого шага!';
            recommendations = ['📚 Вернитесь к изучению теории', '🔄 Начните с начального уровня', '🎯 Практикуйтесь ежедневно по 15-20 минут'];
        }
        
        // Добавляем персональные рекомендации по темам
        if (results.weakTopics && results.weakTopics.length > 0) {
            recommendations.push(`📌 Уделите особое внимание темам: ${results.weakTopics.join(', ')}`);
        }
        
        return { analysis, recommendations };
    }
}

// ==================== ФУНКЦИИ АУТЕНТИФИКАЦИИ (доступны на всех страницах) ====================
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
                <i class="fab ${course.icon} text-white text-2xl"></i>
            </div>
            <h3 class="text-2xl font-bold mb-3">${course.title}</h3>
            <p class="text-gray-600 mb-3">${course.description}</p>
            <div class="mb-4 flex flex-wrap gap-1">
                <span class="text-xs px-2 py-1 bg-gray-100 rounded-full">10 вопросов</span>
                <span class="text-xs px-2 py-1 bg-purple-100 rounded-full">ИИ-адаптация</span>
            </div>
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
                <i class="fab ${course.icon} text-white text-2xl"></i>
            </div>
            <h3 class="text-2xl font-bold mb-3">${course.title}</h3>
            <p class="text-gray-600 mb-3">${course.description}</p>
            <div class="mb-4 flex flex-wrap gap-1">
                <span class="text-xs px-2 py-1 bg-gray-100 rounded-full">10 вопросов</span>
                <span class="text-xs px-2 py-1 bg-purple-100 rounded-full">ИИ-адаптация</span>
            </div>
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
    const last10Results = results.slice(-10);
    const labels = last10Results.map((r, i) => r.courseTitle.substring(0, 12));
    const scores = last10Results.map(r => r.score);
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
                    <i class="fab ${course.icon} text-white"></i>
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
    document.getElementById('totalQuestions').textContent = currentTestEngine.maxQuestions;
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
    if (currentQEl) currentQEl.textContent = currentTestEngine.questionNumber;
    
    const difficultyMap = { easy: '🟢 Легкая', medium: '🟡 Средняя', hard: '🔴 Сложная' };
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
    
    const topicEl = document.getElementById('currentTopic');
    if (topicEl) topicEl.innerHTML = `<i class="fas fa-tag mr-1"></i>${question.topic}`;
    
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
        } else if (results.score >= 75) {
            iconEl.className = 'w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-green-100';
            iconEl.innerHTML = '<i class="fas fa-medal text-4xl text-green-600"></i>';
        } else if (results.score >= 60) {
            iconEl.className = 'w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-blue-100';
            iconEl.innerHTML = '<i class="fas fa-chart-line text-4xl text-blue-600"></i>';
        } else {
            iconEl.className = 'w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-purple-100';
            iconEl.innerHTML = '<i class="fas fa-seedling text-4xl text-purple-600"></i>';
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

    const adminNameEl = document.getElementById('adminName');
    if (adminNameEl) adminNameEl.textContent = currentUser.displayName || 'Администратор';
    
    const usersSnapshot = await db.collection('users').get();
    const users = [];
    usersSnapshot.forEach(doc => users.push({ id: doc.id, ...doc.data() }));
    
    const regularUsers = users.filter(u => u.role !== 'admin');
    const admins = users.filter(u => u.role === 'admin');
    
    const resultsSnapshot = await db.collection('results').get();
    const allResults = [];
    resultsSnapshot.forEach(doc => allResults.push({ id: doc.id, ...doc.data() }));
    
    const avgScore = allResults.length > 0 
        ? Math.round(allResults.reduce((s, r) => s + r.score, 0) / allResults.length)
        : 0;
    
    const totalUsersEl = document.getElementById('totalUsers');
    const totalAdminsEl = document.getElementById('totalAdmins');
    const totalTestsEl = document.getElementById('totalTests');
    const avgScoreEl = document.getElementById('avgScore');
    
    if (totalUsersEl) totalUsersEl.textContent = regularUsers.length;
    if (totalAdminsEl) totalAdminsEl.textContent = admins.length;
    if (totalTestsEl) totalTestsEl.textContent = allResults.length;
    if (avgScoreEl) avgScoreEl.textContent = `${avgScore}%`;
    
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
                        <p class="font-bold ${r.score >= 75 ? 'text-green-600' : r.score >= 60 ? 'text-yellow-600' : 'text-red-600'}">${r.score}%</p>
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
                    <span class="px-2 py-1 rounded-full text-xs font-bold ${result.score >= 75 ? 'bg-green-100 text-green-700' : result.score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}">
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
        const resultsSnapshot = await db.collection('results').where('userId', '==', userId).get();
        const batch = db.batch();
        resultsSnapshot.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        
        await db.collection('users').doc(userId).delete();
        
        location.reload();
    }
}

async function resetAllData() {
    if (confirm('ВНИМАНИЕ! Это удалит ВСЕХ пользователей (кроме админа) и все результаты. Продолжить?')) {
        const usersSnapshot = await db.collection('users').get();
        const batch = db.batch();
        
        usersSnapshot.forEach(doc => {
            const user = doc.data();
            if (user.email !== 'admin@eduaipro.com') {
                batch.delete(doc.ref);
            }
        });
        
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
                <button onclick="filterCourses('all')" class="px-5 py-2 rounded-full bg-purple-600 text-white font-medium transition">Все курсы (${coursesData.length})</button>
                <button onclick="filterCourses('programming')" class="px-5 py-2 rounded-full bg-gray-200 hover:bg-purple-200 transition font-medium">💻 Программирование</button>
                <button onclick="filterCourses('database')" class="px-5 py-2 rounded-full bg-gray-200 hover:bg-purple-200 transition font-medium">🗄️ Базы данных</button>
                <button onclick="filterCourses('web')" class="px-5 py-2 rounded-full bg-gray-200 hover:bg-purple-200 transition font-medium">🌐 Веб-разработка</button>
                <button onclick="filterCourses('backend')" class="px-5 py-2 rounded-full bg-gray-200 hover:bg-purple-200 transition font-medium">⚙️ Backend</button>
                <button onclick="filterCourses('school')" class="px-5 py-2 rounded-full bg-gray-200 hover:bg-purple-200 transition font-medium">📚 Школьные</button>
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
