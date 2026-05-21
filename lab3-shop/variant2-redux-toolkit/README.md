# Вариант 2: Redux Toolkit

Интернет-магазин с использованием современного Redux Toolkit для упрощенного управления состоянием.

## 🚀 Технологии

- **React 18** - библиотека для создания пользовательских интерфейсов
- **Redux Toolkit** - официальный рекомендуемый подход для Redux
- **React Router v6** - маршрутизация
- **React-Redux** - официальные привязки React для Redux

## 📁 Структура проекта

```
variant2-redux-toolkit/
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
│   ├── redux/               # Redux Toolkit логика
│   │   ├── slices/          # Slices (actions + reducers)
│   │   │   ├── authSlice.js
│   │   │   ├── productsSlice.js
│   │   │   ├── cartSlice.js
│   │   │   └── ordersSlice.js
│   │   └── store.js         # Конфигурация store
│   ├── App.js
│   ├── index.js
│   └── styles.css
├── package.json
└── README.md
```

## 🎯 Особенности реализации

### Redux Toolkit Store

Store создан с использованием `configureStore`:

```javascript
const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    orders: ordersReducer,
  },
  preloadedState,
  devTools: process.env.NODE_ENV !== "production",
});
```

**Преимущества `configureStore`:**
- ✅ Автоматическая настройка Redux DevTools
- ✅ Встроенный redux-thunk middleware
- ✅ Проверка на мутации в development
- ✅ Сериализация состояния

### Slices вместо Actions + Reducers

Вся логика объединена в slices с использованием `createSlice`:

```javascript
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    // Синхронные действия
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    // Асинхронные действия
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      });
  },
});
```

**Преимущества `createSlice`:**
- ✅ Автоматическое создание action creators
- ✅ Автоматическая генерация action types
- ✅ Использование Immer для иммутабельных обновлений
- ✅ Меньше boilerplate кода

### createAsyncThunk для асинхронных действий

Асинхронные действия реализованы через `createAsyncThunk`:

```javascript
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message);
      }

      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

**Преимущества `createAsyncThunk`:**
- ✅ Автоматическое создание pending/fulfilled/rejected actions
- ✅ Встроенная обработка ошибок
- ✅ Поддержка отмены запросов
- ✅ Типизация из коробки

### Иммутабельные обновления с Immer

Redux Toolkit использует Immer, позволяя писать "мутирующий" код:

```javascript
reducers: {
  addToCart: (state, action) => {
    const { product, quantity } = action.payload;
    const existingItem = state.items.find((item) => item.id === product.id);

    if (existingItem) {
      // Выглядит как мутация, но Immer делает это иммутабельно
      existingItem.quantity += quantity;
    } else {
      state.items.push({
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: quantity,
      });
    }
  },
}
```

### Подключение к компонентам

Использование хуков остается прежним:

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

Приложение откроется на `http://localhost:3001`

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
Component → dispatch(asyncThunk) → API Call → pending/fulfilled/rejected → Slice Reducer → Store → Component (re-render)
```

## 📝 Преимущества Redux Toolkit

✅ **Меньше кода** - на 40-50% меньше boilerplate  
✅ **Проще понять** - вся логика в одном месте (slice)  
✅ **Безопаснее** - встроенные проверки на мутации  
✅ **Современнее** - официальный рекомендуемый подход  
✅ **Быстрее разработка** - автоматическая генерация actions  
✅ **Лучше типизация** - TypeScript из коробки  

## ⚖️ Сравнение с Redux + Thunk

| Аспект | Redux + Thunk | Redux Toolkit |
|--------|---------------|---------------|
| **Boilerplate** | Много | Минимум |
| **Action Types** | Вручную | Автоматически |
| **Action Creators** | Вручную | Автоматически |
| **Иммутабельность** | Вручную | Immer (автоматически) |
| **Async Actions** | Thunk вручную | createAsyncThunk |
| **DevTools** | Настройка вручную | Из коробки |
| **Middleware** | Настройка вручную | Из коробки |

## 🔗 API Endpoints

- `POST /api/login` - авторизация
- `POST /api/register` - регистрация
- `GET /api/me` - получение текущего пользователя
- `GET /api/products` - получение товаров
- `GET /api/categories` - получение категорий
- `GET /api/orders` - получение заказов
- `POST /api/orders` - создание заказа
- `PATCH /api/orders/:id/cancel` - отмена заказа

## 💡 Ключевые отличия от Варианта 1

### 1. Структура файлов

**Вариант 1:**
```
redux/
├── actions/
│   ├── authActions.js
│   ├── productsActions.js
│   └── ...
├── reducers/
│   ├── authReducer.js
│   ├── productsReducer.js
│   └── ...
├── actionTypes.js
└── store.js
```

**Вариант 2:**
```
redux/
├── slices/
│   ├── authSlice.js      # actions + reducer вместе
│   ├── productsSlice.js
│   └── ...
└── store.js
```

### 2. Создание действий

**Вариант 1:**
```javascript
// actionTypes.js
export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

// authActions.js
export const login = (email, password) => {
  return async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });
    // ...
  };
};
```

**Вариант 2:**
```javascript
// authSlice.js
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }) => {
    // ...
  }
);
// Автоматически создаются: login.pending, login.fulfilled, login.rejected
```

### 3. Reducers

**Вариант 1:**
```javascript
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    default:
      return state;
  }
};
```

**Вариант 2:**
```javascript
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null; // Immer делает это иммутабельно
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    });
  },
});
```

## 📚 Дополнительная информация

Этот вариант демонстрирует современный подход к управлению состоянием с Redux Toolkit. Для сравнения смотрите другие варианты:

- **Вариант 1** - Redux + Redux-Thunk (классический подход)
- **Вариант 3** - RTK Query (с кешированием и автоматическими запросами)

## 🔗 Полезные ссылки

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [createSlice API](https://redux-toolkit.js.org/api/createSlice)
- [createAsyncThunk API](https://redux-toolkit.js.org/api/createAsyncThunk)
- [configureStore API](https://redux-toolkit.js.org/api/configureStore)
