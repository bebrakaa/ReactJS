import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createOrder } from "../redux/actions/ordersActions";
import { clearCart } from "../redux/actions/cartActions";
import {
  validateName,
  validatePhone,
  validateEmail,
  validateCity,
  validateAddress,
  validatePostalCode,
  formatPhone,
  formatPostalCode,
} from "../utils/validation";

function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { loading } = useSelector((state) => state.orders);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Шаг 1: Контактные данные
    fullName: "",
    phone: "",
    email: "",
    // Шаг 2: Адрес доставки
    city: "",
    address: "",
    postalCode: "",
    // Шаг 3: Способ оплаты
    paymentMethod: "card",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    }
  }, [items.length, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    // Форматирование телефона
    if (name === "phone") {
      formattedValue = formatPhone(value);
    }
    
    // Форматирование индекса
    if (name === "postalCode") {
      formattedValue = formatPostalCode(value);
    }
    
    setFormData({
      ...formData,
      [name]: formattedValue,
    });
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    const nameError = validateName(formData.fullName);
    if (nameError) newErrors.fullName = nameError;
    
    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    const cityError = validateCity(formData.city);
    if (cityError) newErrors.city = cityError;
    
    const addressError = validateAddress(formData.address);
    if (addressError) newErrors.address = addressError;
    
    const postalCodeError = validatePostalCode(formData.postalCode);
    if (postalCodeError) newErrors.postalCode = postalCodeError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    const orderData = {
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
    };

    const result = await dispatch(createOrder(orderData));

    if (result.success) {
      dispatch(clearCart());
      navigate("/orders");
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="container">
      <h1>Оформление заказа</h1>

      <div className="checkout-progress">
        <div className={`progress-step ${step >= 1 ? "active" : ""}`}>
          <span className="step-number">1</span>
          <span className="step-label">Контактные данные</span>
        </div>
        <div className={`progress-step ${step >= 2 ? "active" : ""}`}>
          <span className="step-number">2</span>
          <span className="step-label">Адрес доставки</span>
        </div>
        <div className={`progress-step ${step >= 3 ? "active" : ""}`}>
          <span className="step-number">3</span>
          <span className="step-label">Способ оплаты</span>
        </div>
        <div className={`progress-step ${step >= 4 ? "active" : ""}`}>
          <span className="step-number">4</span>
          <span className="step-label">Подтверждение</span>
        </div>
      </div>

      <div className="checkout-content">
        {step === 1 && (
          <div className="checkout-step">
            <h2>Контактные данные</h2>
            <div className="form-group">
              <label>ФИО *</label>
              <input
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
              <label>Телефон *</label>
              <input
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
              <label>Email *</label>
              <input
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
              <label>Город *</label>
              <input
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
              <label>Адрес *</label>
              <input
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
              <label>Индекс *</label>
              <input
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
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === "card"}
                  onChange={handleInputChange}
                />
                <span>Банковская карта</span>
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={formData.paymentMethod === "cash"}
                  onChange={handleInputChange}
                />
                <span>Наличными при получении</span>
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={formData.paymentMethod === "online"}
                  onChange={handleInputChange}
                />
                <span>Онлайн-оплата</span>
              </label>
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
              <p><strong>Адрес:</strong> {formData.city}, {formData.address}, {formData.postalCode}</p>
              <p><strong>Оплата:</strong> {formData.paymentMethod === "card" ? "Банковская карта" : formData.paymentMethod === "cash" ? "Наличными" : "Онлайн"}</p>
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
            <button onClick={handleBack} className="btn btn-secondary" disabled={loading}>
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
