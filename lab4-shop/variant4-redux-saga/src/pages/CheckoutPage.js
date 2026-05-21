import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ordersActions } from "../redux/sagas/ordersSaga";
import { clearCart } from "../redux/slices/cartSlice";
import {
  formatPhone,
  formatPostalCode,
  validateAddress,
  validateCity,
  validateEmail,
  validateName,
  validatePhone,
  validatePostalCode,
} from "../utils/validation";

const paymentLabels = {
  card: "Банковская карта",
  cash: "Наличными при получении",
  online: "Онлайн-оплата",
};

function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { loading, error, lastCreatedOrder } = useSelector((state) => state.orders);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    postalCode: "",
    paymentMethod: "card",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (items.length === 0 && !lastCreatedOrder) {
      navigate("/cart");
    }
  }, [items.length, lastCreatedOrder, navigate]);

  useEffect(() => {
    if (lastCreatedOrder) {
      dispatch(clearCart());
      dispatch(ordersActions.clearLastCreatedOrder());
      navigate("/orders");
    }
  }, [dispatch, lastCreatedOrder, navigate]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const formattedValue =
      name === "phone"
        ? formatPhone(value)
        : name === "postalCode"
          ? formatPostalCode(value)
          : value;

    setFormData((previousData) => ({
      ...previousData,
      [name]: formattedValue,
    }));

    if (errors[name]) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        [name]: "",
      }));
    }
  };

  const validateStep1 = () => {
    const nextErrors = {};
    const nameError = validateName(formData.fullName);
    const phoneError = validatePhone(formData.phone);
    const emailError = validateEmail(formData.email);

    if (nameError) nextErrors.fullName = nameError;
    if (phoneError) nextErrors.phone = phoneError;
    if (emailError) nextErrors.email = emailError;

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateStep2 = () => {
    const nextErrors = {};
    const cityError = validateCity(formData.city);
    const addressError = validateAddress(formData.address);
    const postalCodeError = validatePostalCode(formData.postalCode);

    if (cityError) nextErrors.city = cityError;
    if (addressError) nextErrors.address = addressError;
    if (postalCodeError) nextErrors.postalCode = postalCodeError;

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((currentStep) => currentStep + 1);
  };

  const handleSubmit = () => {
    dispatch(
      ordersActions.createOrder({
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        totalAmount,
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          city: formData.city,
          address: formData.address,
          postalCode: formData.postalCode,
        },
        paymentMethod: formData.paymentMethod,
      })
    );
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="container">
      <h1>Оформление заказа</h1>

      <div className="checkout-progress">
        {["Контактные данные", "Адрес доставки", "Способ оплаты", "Подтверждение"].map(
          (label, index) => (
            <div
              key={label}
              className={`progress-step ${step >= index + 1 ? "active" : ""}`}
            >
              <span className="step-number">{index + 1}</span>
              <span className="step-label">{label}</span>
            </div>
          )
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="checkout-content">
        {step === 1 && (
          <div className="checkout-step">
            <h2>Контактные данные</h2>
            <div className="form-group">
              <label htmlFor="checkout-full-name">ФИО *</label>
              <input
                id="checkout-full-name"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Иванов Иван Иванович"
                className={errors.fullName ? "error" : ""}
                maxLength={100}
              />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="checkout-phone">Телефон *</label>
              <input
                id="checkout-phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+7 (999) 123-45-67"
                className={errors.phone ? "error" : ""}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="checkout-email">Email *</label>
              <input
                id="checkout-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@mail.com"
                className={errors.email ? "error" : ""}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="checkout-step">
            <h2>Адрес доставки</h2>
            <div className="form-group">
              <label htmlFor="checkout-city">Город *</label>
              <input
                id="checkout-city"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Москва"
                className={errors.city ? "error" : ""}
                maxLength={100}
              />
              {errors.city && <span className="error-text">{errors.city}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="checkout-address">Адрес *</label>
              <input
                id="checkout-address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Улица, дом, квартира"
                className={errors.address ? "error" : ""}
                maxLength={200}
              />
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="checkout-postal-code">Индекс *</label>
              <input
                id="checkout-postal-code"
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="123456"
                className={errors.postalCode ? "error" : ""}
                maxLength={6}
              />
              {errors.postalCode && <span className="error-text">{errors.postalCode}</span>}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="checkout-step">
            <h2>Способ оплаты</h2>
            <div className="payment-methods">
              {Object.entries(paymentLabels).map(([value, label]) => (
                <label key={value} className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={value}
                    checked={formData.paymentMethod === value}
                    onChange={handleInputChange}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="checkout-step">
            <h2>Подтверждение заказа</h2>
            <div className="order-summary-section">
              <h3>Ваши данные:</h3>
              <p><strong>ФИО:</strong> {formData.fullName}</p>
              <p><strong>Телефон:</strong> {formData.phone}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p>
                <strong>Адрес:</strong> {formData.city}, {formData.address},{" "}
                {formData.postalCode}
              </p>
              <p><strong>Оплата:</strong> {paymentLabels[formData.paymentMethod]}</p>
            </div>
            <div className="order-items-summary">
              <h3>Товары в заказе:</h3>
              {items.map((item) => (
                <div key={item.id} className="summary-item">
                  <span>{item.title} x{item.quantity}</span>
                  <span>{(item.price * item.quantity).toLocaleString("ru-RU")} ₽</span>
                </div>
              ))}
              <div className="summary-total">
                <strong>Итого:</strong>
                <strong>{totalAmount.toLocaleString("ru-RU")} ₽</strong>
              </div>
            </div>
          </div>
        )}

        <div className="checkout-actions">
          {step > 1 && (
            <button
              onClick={() => setStep((currentStep) => currentStep - 1)}
              className="btn btn-secondary"
              disabled={loading}
            >
              Назад
            </button>
          )}
          {step < 4 ? (
            <button onClick={handleNext} className="btn btn-primary">
              Далее
            </button>
          ) : (
            <button onClick={handleSubmit} className="btn btn-primary" disabled={loading}>
              {loading ? "Оформление..." : "Подтвердить заказ"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
