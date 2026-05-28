# Вариант 3: RTK Query

Интернет-магазин с использованием RTK Query для автоматического управления запросами и кешированием.

## 🚀 Технологии

- **React 18** - библиотека для создания пользовательских интерфейсов
- **Redux Toolkit** - современный подход к Redux
- **RTK Query** - мощный инструмент для работы с API
- **React Router v6** - маршрутизация
- **React-Redux** - официальные привязки React для Redux

## 📁 Структура проекта

```
variant3-rtk-query/
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
│   ├── redux/               # Redux Toolkit + RTK Query
│   │   ├── api/             # API endpoints
│   │   │   ├── apiSlice.js      # Базовая конфигурация API
│   │   │   ├── authApi.js       # Auth endpoints
│   │   │   ├── productsApi.js   # Products endpoints
│   │   │   └── ordersApi.js     # Orders endpoints
│   │   ├── slices/          # Локальное состояние
│   │   │   ├── authSlice.js
│   │   │   ├── cartSlice.js
│   │   │   └── filtersSlice.js
│   │   └── store.js         # Конфигурация store
│   ├── App.js
│   ├── index.js
│   └── styles.css
├── package.json
└── README.md
```

## 🎯 Особенности реализации

### RTK Query API Slice

Базовая конфигурация API с автоматическим добавлением токена:

```javascript
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Products", "Orders", "User"],
  endpoints: () => ({}),
});
```

**Преимущества:**
- ✅ Автоматическое добавление заголовков
- ✅ Централизованная конфигурация
- ✅ Типизация тегов для кеширования

### Inject Endpoints Pattern

Endpoints добавляются через `injectEndpoints`:

```javascript
export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (filters) => `/products?${params}`,
      transformResponse: (response) => response.products,
      providesTags: ["Products"],
    }),
  }),
});

export const { useGetProductsQuery } = productsApi;
```

**Преимущества:**
- ✅ Разделение endpoints по файлам
- ✅ Автоматическая генерация хуков
- ✅ Code splitting

### Автоматическое кеширование

RTK Query автоматически кеширует данные:

```javascript
function ProductsPage() {
  // Данные кешируются автоматически!
  const { data: products, isLoading, error } = useGetProductsQuery(filters);
  
  // При повторном вызове данные берутся из кеша
  // Автоматический рефетчинг при изменении фокуса окна
}
```

**Преимущества:**
- ✅ Нет дублирующих запросов
- ✅ Мгновенное отображение кешированных данных
- ✅ Автоматическая инвалидация кеша

### Mutations с автоматической инвалидацией

Мутации автоматически обновляют связанные запросы:

```javascript
export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/orders",
        method: "POST",
        body: orderData,
      }),
      // Автоматически обновит список заказов!
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),
  }),
});
```

**Преимущества:**
- ✅ Автоматическое обновление UI
- ✅ Нет ручного рефетчинга
- ✅ Оптимистичные обновления

### Использование в компонентах

Минимум кода благодаря автоматически сгенерированным хукам:

```javascript
function OrdersPage() {
  // Один хук для всего!
  const { data: orders = [], isLoading, error } = useGetOrdersQuery();
  
  if (isLoading) return <Loader />;
  if (error) return <div>Ошибка</div>;
  
  return orders.map(order => <OrderCard key={order.id} order={order} />);
}
```

**Преимущества:**
- ✅ Минимум кода
- ✅ Автоматическое управление состоянием
- ✅ Встроенная обработка ошибок

### Optimistic Updates

RTK Query поддерживает оптимистичные обновления:

```javascript
const [cancelOrder] = useCancelOrderMutation();

const handleCancel = async () => {
  try {
    await cancelOrder(orderId).unwrap();
    // UI обновится автоматически!
  } catch (err) {
    // Откат при ошибке
  }
};
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

Приложение откроется на `http://localhost:3002`

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
- ✅ **Автоматическое кеширование всех запросов**
- ✅ **Автоматическое обновление UI при мутациях**

## 🔄 Поток данных

```
Component → useQuery/useMutation → RTK Query → Cache Check → API Call (if needed) → Cache Update → Component (re-render)
```

## 📝 Преимущества RTK Query

✅ **Минимум кода** - на 60-70% меньше чем Redux + Thunk  
✅ **Автоматическое кеширование** - нет дублирующих запросов  
✅ **Автоматический рефетчинг** - данные всегда актуальны  
✅ **Оптимистичные обновления** - мгновенный UI  
✅ **Автоматическая инвалидация** - связанные запросы обновляются  
✅ **Встроенная обработка ошибок** - loading, error из коробки  
✅ **DevTools** - отслеживание всех запросов  
✅ **TypeScript** - полная типизация из коробки  

## ⚖️ Сравнение с другими вариантами

| Аспект | Redux + Thunk | Redux Toolkit | RTK Query |
|--------|---------------|---------------|-----------|
| **Boilerplate** | Много | Средне | Минимум |
| **Кеширование** | Вручную | Вручную | Автоматически |
| **Рефетчинг** | Вручную | Вручную | Автоматически |
| **Инвалидация** | Вручную | Вручную | Автоматически |
| **Loading states** | Вручную | Вручную | Автоматически |
| **Error handling** | Вручную | Вручную | Автоматически |
| **Оптимизация** | Вручную | Вручную | Автоматически |

## 🔗 API Endpoints

RTK Query автоматически управляет всеми endpoints:

### Auth API
- `POST /api/login` - авторизация
- `POST /api/register` - регистрация
- `GET /api/me` - получение текущего пользователя

### Products API
- `GET /api/products` - получение товаров (с кешированием)
- `GET /api/categories` - получение категорий (с кешированием)

### Orders API
- `GET /api/orders` - получение заказов (с кешированием)
- `POST /api/orders` - создание заказа (с автоинвалидацией)
- `PATCH /api/orders/:id/cancel` - отмена заказа (с автоинвалидацией)

## 💡 Ключевые отличия от Вариантов 1 и 2

### 1. Нет ручных action creators

**Варианты 1-2:**
```javascript
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (filters) => {
    const response = await fetch(`${API_URL}/products`);
    return response.json();
  }
);
```

**Вариант 3:**
```javascript
getProducts: builder.query({
  query: (filters) => `/products`,
  // RTK Query делает всё автоматически!
}),
```

### 2. Автоматическое управление состоянием

**Варианты 1-2:**
```javascript
const { items, loading, error } = useSelector(state => state.products);

useEffect(() => {
  dispatch(fetchProducts());
}, []);
```

**Вариант 3:**
```javascript
// Всё в одном хуке!
const { data: items, isLoading, error } = useGetProductsQuery();
```

### 3. Автоматическая инвалидация кеша

**Варианты 1-2:**
```javascript
await dispatch(createOrder(data));
// Нужно вручную обновить список
dispatch(fetchOrders());
```

**Вариант 3:**
```javascript
await createOrder(data);
// Список обновится автоматически благодаря invalidatesTags!
```

## 🎓 Когда использовать RTK Query

✅ **Используйте RTK Query когда:**
- Приложение работает с REST API
- Нужно кеширование запросов
- Важна производительность
- Хотите минимум кода
- Нужны автоматические обновления

❌ **Не используйте RTK Query когда:**
- Нет работы с API (только локальное состояние)
- Нужен полный контроль над запросами
- Используется GraphQL (лучше Apollo Client)
- Очень специфичная логика кеширования

## 📚 Дополнительная информация

Этот вариант демонстрирует самый современный подход к управлению состоянием с RTK Query. Для сравнения смотрите другие варианты:

- **Вариант 1** - Redux + Redux-Thunk (классический подход)
- **Вариант 2** - Redux Toolkit (современный подход)

## 🔗 Полезные ссылки

- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [createApi API](https://redux-toolkit.js.org/rtk-query/api/createApi)
- [Queries](https://redux-toolkit.js.org/rtk-query/usage/queries)
- [Mutations](https://redux-toolkit.js.org/rtk-query/usage/mutations)
- [Cache Behavior](https://redux-toolkit.js.org/rtk-query/usage/cache-behavior)
