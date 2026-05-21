import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../redux/slices/ordersSlice";
import OrderCard from "../components/OrderCard";
import Loader from "../components/Loader";

function OrdersPage() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) {
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
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (items.length === 0) {
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
        {items.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}

export default OrdersPage;
