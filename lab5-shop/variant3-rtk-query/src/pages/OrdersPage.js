import { useState, useEffect } from "react";
import { useGetOrdersQuery } from "../redux/api/ordersApi";
import OrderCard from "../components/OrderCard";
import Loader from "../components/Loader";

const statusOptions = [
  { value: "all", label: "Все заказы" },
  { value: "pending", label: "Ожидают обработки" },
  { value: "processing", label: "В обработке" },
  { value: "shipped", label: "Отправленные" },
  { value: "delivered", label: "Доставленные" },
  { value: "cancelled", label: "Отмененные" },
];

function OrdersPage() {
  const { data: orders = [], isLoading, error } = useGetOrdersQuery();
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    document.title = "Мои заказы - TechHub";
  }, []);

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  if (isLoading) {
    return (
      <div className="container">
        <h1>Мои заказы</h1>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h1>Мои заказы</h1>
        <div className="error-message" role="alert">Ошибка загрузки заказов</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container">
        <h1>Мои заказы</h1>
        <p className="no-orders">У вас пока нет заказов</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Мои заказы</h1>

      <div className="orders-toolbar" aria-label="Фильтр заказов">
        <label className="orders-filter">
          Статус
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <span className="orders-count">
          Показано: {filteredOrders.length} из {orders.length}
        </span>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="no-orders">Заказов с выбранным статусом нет</p>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order, index) => (
            <OrderCard key={order.id} order={order} initiallyOpen={index === 0} />
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
