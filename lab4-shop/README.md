# Лабораторная работа №4: Redux-Saga

Интернет-магазин с использованием **Redux-Saga** для управления побочными эффектами.

## 🎯 Цель работы

Изучить и применить **Redux-Saga** для управления асинхронными операциями в React-приложении.

## 📋 Требования

1. ✅ Добавить redux-saga в проект
2. ✅ Redux-saga у минимум 3-х сущностей (реализовано 4: auth, products, orders, cart)
3. ✅ Создать функцию высшего порядка для генерации saga и slices
4. ✅ Организовать код удобно для поддержки и расширения

## 🚀 Реализация

### Вариант 4: Redux-Saga

Создан новый вариант приложения с использованием Redux-Saga.

**Ключевые особенности:**
- 📦 **sagaSliceFactory** - функция высшего порядка для генерации saga и slices
- 🔄 **4 сущности с saga:** auth, products, orders (+ cart без saga)
- 🎯 **Декларативные эффекты:** call, put, takeLatest
- ✅ **Легкое тестирование** благодаря генераторам

## 📁 Структура проекта

```
lab4-shop/
├── server/                    # Backend сервер (общий для всех вариантов)
│   ├── db.json               # База данных
│   ├── server.js             # Express сервер
│   └── package.json
│
├── variant1-redux-thunk/     # Вариант 1 (из lab3)
├── variant2-redux-toolkit/   # Вариант 2 (из lab3)
├── variant3-rtk-query/       # Вариант 3 (из lab3)
│
└── variant4-redux-saga/      # ⭐ Новый вариант для lab4
    ├── src/
    │   ├── redux/
    │   │   ├── sagas/        # Sagas для каждой сущности
    │   │   ├── slices/       # Slices (для локального состояния)
    │   │   ├── sagaSliceFactory.js  # Функция высшего порядка
    │   │   ├── rootSaga.js   # Корневая saga
    │   │   └── store.js      # Store с saga middleware
    │   ├── components/       # UI компоненты
    │   ├── pages/            # Страницы
    │   └── App.js
    └── README.md
```

## 🔧 Функция высшего порядка

### sagaSliceFactory

Универсальная функция для создания saga и slice:

```javascript
export function createSagaSlice(name, config, initialState, extraReducers) {
  // Генерирует:
  // 1. Action types (request, success, failure)
  // 2. Sagas для каждой операции
  // 3. Reducers для обработки состояния
  // 4. Action creators
  // 5. Root saga
  
  return {
    slice,      // Redux Toolkit slice
    actions,    // Action creators
    saga,       // Root saga для этой сущности
    actionTypes // Типы действий
  };
}
```

### Пример использования

```javascript
const { slice, actions, saga } = createSagaSlice(
  "auth",
  {
    login: {
      api: authApi.login,
      onSuccess: (user) => {
        localStorage.setItem("token", user.token);
      },
      onSuccessReducer: (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      },
    },
  },
  { user: null, isAuthenticated: false }
);
```

## 📊 Реализованные сущности

### 1. Auth (Авторизация)
- `login` - вход в систему
- `register` - регистрация
- `checkAuth` - проверка токена

### 2. Products (Товары)
- `fetchProducts` - загрузка товаров с фильтрами
- `fetchCategories` - загрузка категорий

### 3. Orders (Заказы)
- `createOrder` - создание заказа
- `fetchOrders` - получение списка заказов
- `cancelOrder` - отмена заказа

### 4. Cart (Корзина)
- Локальное состояние (без saga)
- Синхронные операции

## 🚀 Запуск проекта

### 1. Запуск сервера

```bash
cd server
npm install
npm start
```

Сервер запустится на http://localhost:5000

### 2. Запуск клиента (Вариант 4)

```bash
cd variant4-redux-saga
npm install
npm start
```

Приложение откроется на http://localhost:3000

## 🎨 Преимущества Redux-Saga

### 1. Декларативность
```javascript
function* loginSaga(action) {
  try {
    const user = yield call(api.login, action.payload);
    yield put({ type: "LOGIN_SUCCESS", payload: user });
  } catch (error) {
    yield put({ type: "LOGIN_FAILURE", payload: error.message });
  }
}
```

### 2. Легкое тестирование
```javascript
const gen = loginSaga({ payload: { email, password } });
expect(gen.next().value).toEqual(call(api.login, { email, password }));
```

### 3. Мощные эффекты
- `call` - вызов функций
- `put` - dispatch actions
- `takeLatest` - отмена предыдущих запросов
- `select` - чтение из store
- `fork` - параллельное выполнение

## 📈 Сравнение подходов

| Подход | Сложность | Boilerplate | Тестирование | Мощность |
|--------|-----------|-------------|--------------|----------|
| Redux-Thunk | Низкая | Много | Сложное | Средняя |
| Redux Toolkit | Средняя | Средне | Среднее | Средняя |
| RTK Query | Средняя | Минимум | Среднее | Высокая |
| **Redux-Saga** | **Высокая** | **Средне** | **Легкое** | **Очень высокая** |

## 🎓 Когда использовать Redux-Saga

✅ **Используйте:**
- Сложная асинхронная логика
- Нужна отмена запросов
- Много побочных эффектов
- Важно легкое тестирование
- Нужны продвинутые паттерны

❌ **Не используйте:**
- Простое приложение
- Команда не знакома с генераторами
- Нужна быстрая разработка

## 📝 Тестовые данные

**Email:** test@example.com  
**Пароль:** password123

## 🏗️ Архитектура

```
Component
    ↓
dispatch(action)
    ↓
Saga (takeLatest)
    ↓
call(API)
    ↓
put(success/failure)
    ↓
Reducer
    ↓
State
    ↓
Component (re-render)
```

## 📚 Дополнительные материалы

- [Redux-Saga документация](https://redux-saga.js.org/)
- [Генераторы в JavaScript](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/function*)
- [Redux Toolkit](https://redux-toolkit.js.org/)

## ✅ Выполнение требований

- [x] Redux-saga добавлен в проект
- [x] Redux-saga у 4-х сущностей (auth, products, orders, cart)
- [x] Создана функция высшего порядка `sagaSliceFactory`
- [x] Код организован удобно для поддержки и расширения

---

**Лабораторная работа №4 выполнена!** 🎉
