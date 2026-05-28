# Вариант 4: Redux-Saga

Интернет-магазин с использованием **Redux-Saga** для управления побочными эффектами.

## 🎯 Особенности

### Redux-Saga
- **Генераторы** для управления асинхронными операциями
- **Декларативные эффекты** (call, put, takeLatest)
- **Централизованная логика** побочных эффектов
- **Легкое тестирование** благодаря генераторам

### Функция высшего порядка
Создана **sagaSliceFactory** - универсальная функция для генерации saga и slices:

```javascript
const { slice, actions, saga } = createSagaSlice(
  "entityName",
  {
    operation: {
      api: apiFunction,
      onSuccess: successCallback,
      onSuccessReducer: reducerFunction,
    },
  },
  initialState
);
```

### Преимущества подхода
- ✅ Меньше boilerplate кода
- ✅ Единообразная структура для всех сущностей
- ✅ Легко добавлять новые операции
- ✅ Централизованная обработка ошибок

## 📁 Структура проекта

```
src/
├── redux/
│   ├── sagas/
│   │   ├── authSaga.js       # Saga для авторизации
│   │   ├── productsSaga.js   # Saga для товаров
│   │   └── ordersSaga.js     # Saga для заказов
│   ├── slices/
│   │   └── cartSlice.js      # Slice для корзины (локальное состояние)
│   ├── sagaSliceFactory.js   # Функция высшего порядка
│   ├── rootSaga.js           # Корневая saga
│   └── store.js              # Конфигурация store
├── components/               # UI компоненты
├── pages/                    # Страницы приложения
└── App.js                    # Роутинг
```

## 🔧 Используемые сущности

1. **auth** - Авторизация (login, register, checkAuth)
2. **products** - Товары (fetchProducts, fetchCategories)
3. **orders** - Заказы (createOrder, fetchOrders, cancelOrder)
4. **cart** - Корзина (локальное состояние, без saga)

## 🚀 Запуск

### 1. Установка зависимостей

```bash
npm install
```

### 2. Запуск сервера (из корня lab4-shop)

```bash
cd server
npm install
npm start
```

Сервер запустится на http://localhost:5000

### 3. Запуск клиента

```bash
npm start
```

Приложение откроется на http://localhost:3000

## 📚 Как работает sagaSliceFactory

### Создание saga и slice

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

### Использование в компонентах

```javascript
import { authActions } from "../redux/sagas/authSaga";

// Dispatch action
dispatch(authActions.login({ email, password }));
```

### Что происходит под капотом

1. **Action** отправляется: `authActions.login({ email, password })`
2. **Saga** перехватывает action через `takeLatest`
3. **API** вызывается через `call(api, payload)`
4. **Success action** отправляется через `put(successAction)`
5. **Reducer** обновляет состояние
6. **Callback** `onSuccess` выполняется (если есть)

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

// Проверяем каждый шаг
expect(gen.next().value).toEqual(call(api.login, { email, password }));
expect(gen.next(user).value).toEqual(put({ type: "LOGIN_SUCCESS", payload: user }));
```

### 3. Мощные эффекты

- `call` - вызов функций
- `put` - dispatch actions
- `takeLatest` - отмена предыдущих запросов
- `takeEvery` - обработка всех запросов
- `select` - чтение из store
- `fork` - параллельное выполнение

## 📊 Сравнение с другими подходами

| Критерий | Redux-Thunk | Redux Toolkit | RTK Query | Redux-Saga |
|----------|-------------|---------------|-----------|------------|
| Сложность | Низкая | Средняя | Средняя | Высокая |
| Boilerplate | Много | Средне | Минимум | Средне |
| Тестирование | Сложное | Среднее | Среднее | Легкое |
| Мощность | Средняя | Средняя | Высокая | Очень высокая |
| Декларативность | Нет | Частично | Да | Да |

## 🎓 Когда использовать Redux-Saga

✅ **Используйте когда:**
- Сложная асинхронная логика
- Нужна отмена запросов
- Много побочных эффектов
- Важно легкое тестирование
- Нужны продвинутые паттерны (debounce, throttle, retry)

❌ **Не используйте когда:**
- Простое приложение
- Команда не знакома с генераторами
- Нужна быстрая разработка

## 📝 Тестовые данные

**Email:** test@example.com  
**Пароль:** password123

## 🏗️ Архитектура

```
Action → Saga → API → Success/Failure → Reducer → State → Component
```

## 🔍 Дополнительные возможности

### Отмена запросов

```javascript
function* fetchProductsSaga() {
  const task = yield fork(api.fetchProducts);
  yield take("CANCEL_FETCH");
  yield cancel(task);
}
```

### Debounce

```javascript
function* searchSaga() {
  yield debounce(500, "SEARCH", performSearch);
}
```

### Retry

```javascript
function* fetchWithRetry() {
  for (let i = 0; i < 3; i++) {
    try {
      return yield call(api.fetch);
    } catch (error) {
      if (i === 2) throw error;
      yield delay(1000);
    }
  }
}
```

---

**Вариант 4 демонстрирует продвинутое управление состоянием с Redux-Saga!** 🚀
