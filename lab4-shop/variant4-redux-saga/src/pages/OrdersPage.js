import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ordersActions } from "../redux/sagas/ordersSaga";
import Loader from "../components/Loader";
import OrderCard from "../components/OrderCard";

const statusOptions = [
  { value: "all", label: "Все заказы" },
  { value: "pending", label: "Ожидают обработки" },
  { value: "processing", label: "В обработке" },
  { value: "shipped", label: "Отправленные" },
  { value: "delivered", label: "Доставленные" },
  { value: "cancelled", label: "Отмененные" },
];

function OrdersPage() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.orders);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    document.title = "Мои заказы - TechHub";
    dispatch(ordersActions.fetchOrders());
  }, [dispatch]);

  const filteredOrders =
    statusFilter === "all"
      ? items
      : items.filter((order) => order.status === statusFilter);

  if (loading) {
    return (
      <div className="container">
        <h1>Мои заказы</h1>
        <Loader />
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Мои заказы</h1>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {!error && items.length === 0 && (
        <p className="no-orders">У вас пока нет заказов</p>
      )}

      {!error && items.length > 0 && (
        <>
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
              Показано: {filteredOrders.length} из {items.length}
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
        </>
      )}
    </div>
  );
}

export default OrdersPage;
