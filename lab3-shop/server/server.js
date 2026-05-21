const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Путь к базе данных
const dbPath = path.join(__dirname, "db.json");

// Функции для работы с БД
function readDB() {
  const data = fs.readFileSync(dbPath, "utf8");
  return JSON.parse(data);
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Middleware для проверки токена
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const db = readDB();
  const user = db.users.find(u => u.token === token);

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }

  req.user = user;
  next();
}

// ============ AUTH ENDPOINTS ============

// Регистрация
app.post("/api/register", (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ 
      success: false, 
      message: "Все поля обязательны" 
    });
  }

  const db = readDB();

  // Проверка существующего пользователя
  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ 
      success: false, 
      message: "Пользователь с таким email уже существует" 
    });
  }

  // Создание нового пользователя
  const newUser = {
    id: uuidv4(),
    email,
    password, // В реальном приложении нужно хэшировать!
    name,
    token: uuidv4(),
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDB(db);

  res.json({
    success: true,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      token: newUser.token
    }
  });
});

// Авторизация
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "Email и пароль обязательны" 
    });
  }

  const db = readDB();
  const user = db.users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ 
      success: false, 
      message: "Неверный email или пароль" 
    });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      token: user.token
    }
  });
});

// Проверка токена
app.get("/api/me", authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name
    }
  });
});

// ============ PRODUCTS ENDPOINTS ============

// Получение всех товаров
app.get("/api/products", authMiddleware, (req, res) => {
  const db = readDB();
  const { category, search, minPrice, maxPrice } = req.query;
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.max(Number(req.query.limit) || 10, 1);

  let products = db.products;

  // Фильтрация по категории
  if (category && category !== "all") {
    products = products.filter(p => p.category === category);
  }

  // Поиск по названию
  if (search) {
    products = products.filter(p => 
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Фильтрация по цене
  if (minPrice) {
    products = products.filter(p => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    products = products.filter(p => p.price <= Number(maxPrice));
  }

  const total = products.length;
  const startIndex = (page - 1) * limit;
  const paginatedProducts = products.slice(startIndex, startIndex + limit);

  setTimeout(() => {
    res.json({
      success: true,
      products: paginatedProducts,
      page,
      limit,
      total,
      hasMore: startIndex + limit < total
    });
  }, 300); // Имитация задержки сети
});

// Получение одного товара
app.get("/api/products/:id", authMiddleware, (req, res) => {
  const db = readDB();
  const product = db.products.find(p => p.id === req.params.id);

  if (!product) {
    return res.status(404).json({ 
      success: false, 
      message: "Товар не найден" 
    });
  }

  res.json({
    success: true,
    product
  });
});

// Получение категорий
app.get("/api/categories", authMiddleware, (req, res) => {
  const db = readDB();
  const categories = [...new Set(db.products.map(p => p.category))];

  res.json({
    success: true,
    categories
  });
});

// ============ ORDERS ENDPOINTS ============

// Создание заказа
app.post("/api/orders", authMiddleware, (req, res) => {
  const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: "Корзина пуста" 
    });
  }

  if (!shippingAddress || !paymentMethod) {
    return res.status(400).json({ 
      success: false, 
      message: "Не все данные заполнены" 
    });
  }

  const db = readDB();

  // Проверка наличия товаров
  for (const item of items) {
    const product = db.products.find(p => p.id === item.productId);
    if (!product) {
      return res.status(400).json({ 
        success: false, 
        message: `Товар ${item.productId} не найден` 
      });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ 
        success: false, 
        message: `Недостаточно товара ${product.title} на складе` 
      });
    }
  }

  // Создание заказа
  const newOrder = {
    id: uuidv4(),
    userId: req.user.id,
    items: items.map(item => {
      const product = db.products.find(p => p.id === item.productId);
      return {
        productId: item.productId,
        title: product.title,
        price: product.price,
        quantity: item.quantity
      };
    }),
    totalAmount,
    shippingAddress,
    paymentMethod,
    status: "pending", // pending, processing, shipped, delivered, cancelled
    createdAt: new Date().toISOString()
  };

  // Обновление остатков товаров
  items.forEach(item => {
    const product = db.products.find(p => p.id === item.productId);
    product.stock -= item.quantity;
  });

  db.orders.push(newOrder);
  writeDB(db);

  // Имитация обработки платежа
  setTimeout(() => {
    const db = readDB();
    const order = db.orders.find(o => o.id === newOrder.id);
    if (order) {
      order.status = "processing";
      writeDB(db);
    }
  }, 2000);

  res.json({
    success: true,
    order: newOrder
  });
});

// Получение заказов пользователя
app.get("/api/orders", authMiddleware, (req, res) => {
  const db = readDB();
  const userOrders = db.orders
    .filter(o => o.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({
    success: true,
    orders: userOrders
  });
});

// Получение одного заказа
app.get("/api/orders/:id", authMiddleware, (req, res) => {
  const db = readDB();
  const order = db.orders.find(o => o.id === req.params.id && o.userId === req.user.id);

  if (!order) {
    return res.status(404).json({ 
      success: false, 
      message: "Заказ не найден" 
    });
  }

  res.json({
    success: true,
    order
  });
});

// Отмена заказа
app.patch("/api/orders/:id/cancel", authMiddleware, (req, res) => {
  const db = readDB();
  const order = db.orders.find(o => o.id === req.params.id && o.userId === req.user.id);

  if (!order) {
    return res.status(404).json({ 
      success: false, 
      message: "Заказ не найден" 
    });
  }

  if (order.status !== "pending" && order.status !== "processing") {
    return res.status(400).json({ 
      success: false, 
      message: "Заказ нельзя отменить" 
    });
  }

  // Возврат товаров на склад
  order.items.forEach(item => {
    const product = db.products.find(p => p.id === item.productId);
    if (product) {
      product.stock += item.quantity;
    }
  });

  order.status = "cancelled";
  writeDB(db);

  res.json({
    success: true,
    order
  });
});

// ============ STATS ENDPOINT (для отладки) ============

app.get("/api/stats", (req, res) => {
  const db = readDB();
  
  res.json({
    success: true,
    stats: {
      products: db.products.length,
      users: db.users.length,
      orders: db.orders.length
    }
  });
});

// ============ START SERVER ============

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Products: ${readDB().products.length}`);
  console.log(`👥 Users: ${readDB().users.length}`);
  console.log(`📋 Orders: ${readDB().orders.length}`);
});
