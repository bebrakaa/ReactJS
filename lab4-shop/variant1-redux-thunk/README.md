# Вариант 1: Redux + Redux-Thunk

Интернет-магазин с использованием классического Redux и Redux-Thunk для асинхронных действий.

## 🚀 Технологии

- **React 18** - библиотека для создания пользовательских интерфейсов
- **Redux** - предсказуемый контейнер состояния
- **Redux-Thunk** - middleware для обработки асинхронных действий
- **React Router v6** - маршрутизация
- **React-Redux** - официальные привязки React для Redux

## 📁 Структура проекта

```
variant1-redux-thunk/
├── public/
│   └── index.html
├── src/
│   ├── components/          # Переиспользуемые компоненты
│   │   ├── Header.js
│   │   ├── ProductCard.js
│   │   ├── CartItem.js
│   │   ├── OrderCard.js
│   │   ├── Loader.js
│   │   └── ProtectedRoute.js
│   ├── pages/               # Страницы приложения
│   │   ├── HomePage.js
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   ├── ProductsPage.js
│   │   ├── CartPage.js
│   │   ├── CheckoutPage.js
│   │   └── OrdersPage.js
│   ├── redux/               # Redux логика
│   │   ├── actions/         # Action creators
│   │   │   ├── authActions.js
│   │   │   ├── productsActions.js
│   │   │   ├── cartActions.js
│   │   │   └── ordersActions.js
│   │   ├── reducers/        # Reducers
│   │   │   ├── authReducer.js
│   │   │   ├── productsReducer.js
│   │   │   ├── cartReducer.js
│   │   │   └── ordersReducer.js
│   │   ├── actionTypes.js   # Константы типов действий
│   │   └── store.js         # Конфигурация store
│   ├── App.js
│   ├── index.js
│   └── styles.css
├── package.json
└── README.md
```

## 🎯 Особенности реализации

### Redux Store

Store создан с использованием `createStore` и `combineReducers`:

```javascript
const rootReducer = combineReducers({
  auth: authReducer,
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer
});

const store = createStore(
  rootReducer,
  preloadedState,
  composeEnhancers(applyMiddleware(thunk))
);
```

### Action Types

Все типы действий вынесены в отдельный файл `actionTypes.js` для предотвращения опечаток:

```javascript
export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
```

### Action Creators с Thunk

Асинхронные действия реализованы через Redux-Thunk:

```javascript
export const login = (email, password) => {
  return async (dispatch) => {
    dispatch({ type: types.LOGIN_REQUEST });
    
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message);
      }
      
      dispatch({
        type: types.LOGIN_SUCCESS,
        payload: data.user,
      });
      
      return { success: true };
    } catch (error) {
      dispatch({
        type: types.LOGIN_FAILURE,
        payload: error.message,
      });
      
      return { success: false, error: error.message };
    }
  };
};
```

### Reducers

Чистые функции, обрабатывающие действия:

```javascript
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    // ... другие cases
    default:
      return state;
  }
};
```

### Подключение к компонентам

Использование хуков `useSelector` и `useDispatch`:

```javascript
function ProductsPage() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);
  
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  
  // ...
}
```

## 📦 Установка и запуск

### 1. Установка зависимостей

```bash
npm install
```

### 2. Запуск сервера (из корневой папки lab3-shop)

```bash
cd ../server
npm install
npm start
```

Сервер запустится на `http://localhost:5000`

### 3. Запуск клиента

```bash
npm start
```

Приложение откроется на `http://localhost:3000`

## 🔑 Тестовые данные

**Email:** user@test.com  
**Пароль:** 123456

## 🎨 Функциональность

### Реализованные страницы:

1. **Главная** (`/`) - информация о магазине
2. **Каталог** (`/products`) - список товаров с фильтрами
3. **Корзина** (`/cart`) - управление товарами в корзине
4. **Оформление заказа** (`/checkout`) - многошаговая форма
5. **Мои заказы** (`/orders`) - история заказов
6. **Вход** (`/login`) - авторизация
7. **Регистрация** (`/register`) - создание аккаунта

### Основные возможности:

- ✅ Авторизация и регистрация пользователей
- ✅ Просмотр каталога товаров
- ✅ Фильтрация товаров по категориям и поиску
- ✅ Добавление товаров в корзину
- ✅ Управление количеством товаров в корзине
- ✅ Многошаговое оформление заказа
- ✅ Просмотр истории заказов
- ✅ Отмена заказов
- ✅ Сохранение корзины в localStorage
- ✅ Защищенные маршруты

## 🔄 Поток данных

```
Component → dispatch(action) → Thunk Middleware → API Call → dispatch(success/failure) → Reducer → Store → Component (re-render)
```

## 📝 Преимущества подхода

✅ **Простота** - классический подход, легко понять  
✅ **Гибкость** - полный контроль над логикой  
✅ **Прозрачность** - явное управление состоянием  
✅ **Отладка** - Redux DevTools для отслеживания действий  

## ⚠️ Недостатки подхода

❌ **Boilerplate** - много повторяющегося кода  
❌ **Многословность** - требуется создавать много файлов  
❌ **Ручная типизация** - нужно следить за типами действий  

## 🔗 API Endpoints

- `POST /api/login` - авторизация
- `POST /api/register` - регистрация
- `GET /api/me` - получение текущего пользователя
- `GET /api/products` - получение товаров
- `GET /api/categories` - получение категорий
- `GET /api/orders` - получение заказов
- `POST /api/orders` - создание заказа
- `PATCH /api/orders/:id/cancel` - отмена заказа

## 📚 Дополнительная информация

Этот вариант демонстрирует классический подход к управлению состоянием с Redux и Redux-Thunk. Для сравнения смотрите другие варианты:

- **Вариант 2** - Redux Toolkit (современный подход)
- **Вариант 3** - RTK Query (с кешированием и автоматическими запросами)
