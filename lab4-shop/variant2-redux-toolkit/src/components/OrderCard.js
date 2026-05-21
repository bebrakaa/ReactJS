import { useDispatch } from "react-redux";
import { cancelOrder } from "../redux/slices/ordersSlice";

function OrderCard({ order }) {
  const dispatch = useDispatch();

  const handleCancel = async () => {
    if (window.confirm("Вы уверены, что хотите отменить заказ?")) {
      await dispatch(cancelOrder(order.id));
    }
  };

  const getStatusText = (status) => {
    const statuses = {
      pending: "Ожидает обработки",
      processing: "В обработке",
      shipped: "Отправлен",
      delivered: "Доставлен",
      cancelled: "Отменен",
    };
    return statuses[status] || status;
  };

  const getStatusClass = (status) => {
    return `order-status status-${status}`;
  };

  const canCancel = order.status === "pending" || order.status === "processing";

  const orderDate = new Date(order.createdAt).toLocaleString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="order-card">
      <div className="order-header">
        <div className="order-info">
          <h3 className="order-id">Заказ #{order.id.slice(0, 8)}</h3>
          <p className="order-date">{orderDate}</p>
        </div>
        <span className={getStatusClass(order.status)}>
          {getStatusText(order.status)}
        </span>
      </div>

      <div className="order-items">
        {order.items.map((item, index) => (
          <div key={index} className="order-item">
            <span className="order-item-title">{item.title}</span>
            <span className="order-item-quantity">x{item.quantity}</span>
            <span className="order-item-price">
              {(item.price * item.quantity).toLocaleString("ru-RU")} ₽
            </span>
          </div>
        ))}
      </div>

      <div className="order-footer">
        <div className="order-total">
          <span className="order-total-label">Итого:</span>
          <span className="order-total-value">
            {order.totalAmount.toLocaleString("ru-RU")} ₽
          </span>
        </div>

        {canCancel && (
          <button onClick={handleCancel} className="btn-cancel-order">
            Отменить заказ
          </button>
        )}
      </div>

      <div className="order-details">
        <p>
          <strong>Адрес доставки:</strong> {order.shippingAddress.address},{" "}
          {order.shippingAddress.city}
        </p>
        <p>
          <strong>Способ оплаты:</strong> {order.paymentMethod}
        </p>
      </div>
    </div>
  );
}

export default OrderCard;
