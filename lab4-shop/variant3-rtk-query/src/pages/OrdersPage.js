import { useGetOrdersQuery } from "../redux/api/ordersApi";
import OrderCard from "../components/OrderCard";
import Loader from "../components/Loader";

function OrdersPage() {
  const { data: orders = [], isLoading, error } = useGetOrdersQuery();

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
        <div className="error-message">Ошибка загрузки заказов</div>
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
      <div className="orders-list">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}

export default OrdersPage;
