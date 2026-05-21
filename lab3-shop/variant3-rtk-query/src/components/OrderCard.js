import { useState } from "react";
import { useCancelOrderMutation } from "../redux/api/ordersApi";

const statusLabels = {
  pending: "Ожидает обработки",
  processing: "В обработке",
  shipped: "Отправлен",
  delivered: "Доставлен",
  cancelled: "Отменён",
};

function OrderCard({ order, initiallyOpen = false }) {
  const [cancelOrder, { isLoading }] = useCancelOrderMutation();
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const canCancel = order.status === "pending" || order.status === "processing";
  const orderDate = new Date(order.createdAt).toLocaleString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleCancel = async () => {
    if (window.confirm("Вы уверены, что хотите отменить заказ?")) {
      await cancelOrder(order.id).unwrap();
    }
  };

  return (
    <div className={`order-card ${isOpen ? "expanded" : "collapsed"}`}>
      <div className="order-header">
        <div className="order-info">
          <h3 className="order-id">Заказ #{order.id.slice(0, 8)}</h3>
          <p className="order-date">{orderDate}</p>
        </div>
        <div className="order-header-actions">
          <span className={`order-status status-${order.status}`}>
            {statusLabels[order.status] || order.status}
          </span>
          <button className="order-toggle" onClick={() => setIsOpen((value) => !value)}>
            {isOpen ? "Скрыть" : "Подробнее"}
          </button>
        </div>
      </div>

      {isOpen && (
        <>
          <div className="order-items">
            {order.items.map((item, index) => (
              <div key={`${item.productId}-${index}`} className="order-item">
                <span className="order-item-title">{item.title}</span>
                <span className="order-item-quantity">x{item.quantity}</span>
                <span className="order-item-price">
                  {(item.price * item.quantity).toLocaleString("ru-RU")} ₽
                </span>
              </div>
            ))}
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
        </>
      )}

      <div className="order-footer">
        <div className="order-total">
          <span className="order-total-label">Итого:</span>
          <span className="order-total-value">
            {order.totalAmount.toLocaleString("ru-RU")} ₽
          </span>
        </div>

        {canCancel && (
          <button
            onClick={handleCancel}
            className="btn-cancel-order"
            disabled={isLoading}
          >
            {isLoading ? "Отмена..." : "Отменить заказ"}
          </button>
        )}
      </div>
    </div>
  );
}

export default OrderCard;
