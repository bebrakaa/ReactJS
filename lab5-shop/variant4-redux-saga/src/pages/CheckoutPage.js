import { useEffect, useRef, useState } from "react";
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
  const stepHeadingRef = useRef(null);

  useEffect(() => {
    document.title = `Оформление заказа - шаг ${step} - TechHub`;
  }, [step]);

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

  const focusStepHeading = () => {
    setTimeout(() => stepHeadingRef.current?.focus(), 50);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const nextValue =
      name === "phone"
        ? formatPhone(value)
        : name === "postalCode"
          ? formatPostalCode(value)
          : value;

    setFormData((previousData) => ({
      ...previousData,
      [name]: nextValue,
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

    nextErrors.fullName = validateName(formData.fullName) || "";
    nextErrors.phone = validatePhone(formData.phone) || "";
    nextErrors.email = validateEmail(formData.email) || "";

    const filteredErrors = Object.fromEntries(
      Object.entries(nextErrors).filter(([, value]) => value)
    );
    setErrors(filteredErrors);

    return Object.keys(filteredErrors).length === 0;
  };

  const validateStep2 = () => {
    const nextErrors = {};

    nextErrors.city = validateCity(formData.city) || "";
    nextErrors.address = validateAddress(formData.address) || "";
    nextErrors.postalCode = validatePostalCode(formData.postalCode) || "";

    const filteredErrors = Object.fromEntries(
      Object.entries(nextErrors).filter(([, value]) => value)
    );
    setErrors(filteredErrors);

    return Object.keys(filteredErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) {
      return;
    }

    if (step === 2 && !validateStep2()) {
      return;
    }

    setStep((currentStep) => currentStep + 1);
    focusStepHeading();
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
    <div className="container" aria-busy={loading}>
      <h1>Оформление заказа</h1>
      <p className="section-intro">
        Процесс состоит из четырех шагов. На последнем шаге вы сможете проверить все данные перед отправкой заказа.
      </p>

      <ul className="checkout-progress" aria-label="Этапы оформления заказа">
        {[
          "Контактные данные",
          "Адрес доставки",
          "Способ оплаты",
          "Подтверждение",
        ].map((label, index) => (
          <li
            key={label}
            className={`progress-step ${step >= index + 1 ? "active" : ""}`}
            aria-current={step === index + 1 ? "step" : undefined}
          >
            <span className="step-number" aria-hidden="true">
              {index + 1}
            </span>
            <span className="step-label">{label}</span>
          </li>
        ))}
      </ul>

      <p className="page-status" aria-live="polite" role="status">
        Текущий шаг: {step} из 4.
      </p>

      {error ? <div className="error-message" role="alert">{error}</div> : null}

      <div className="checkout-content">
        {(step === 1 || step === 2) && Object.keys(errors).length > 0 ? (
          <div className="form-error-summary" role="alert">
            Исправьте ошибки в форме перед переходом к следующему шагу.
          </div>
        ) : null}

        {step === 1 ? (
          <section className="checkout-step" aria-labelledby="checkout-step-heading">
            <h2 id="checkout-step-heading" ref={stepHeadingRef} tabIndex={-1}>
              Контактные данные
            </h2>
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
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? "fullName-error" : undefined}
                autoComplete="name"
                maxLength={100}
              />
              {errors.fullName ? (
                <span id="fullName-error" className="error-text" role="alert">
                  {errors.fullName}
                </span>
              ) : null}
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
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "phone-error" : "phone-hint"}
                autoComplete="tel"
              />
              <span id="phone-hint" className="field-hint">
                Укажите номер телефона для связи по заказу.
              </span>
              {errors.phone ? (
                <span id="phone-error" className="error-text" role="alert">
                  {errors.phone}
                </span>
              ) : null}
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
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                autoComplete="email"
              />
              {errors.email ? (
                <span id="email-error" className="error-text" role="alert">
                  {errors.email}
                </span>
              ) : null}
            </div>
          </section>
        ) : null}

        {step === 2 ? (
          <section className="checkout-step" aria-labelledby="checkout-step-heading">
            <h2 id="checkout-step-heading" ref={stepHeadingRef} tabIndex={-1}>
              Адрес доставки
            </h2>
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
                aria-invalid={Boolean(errors.city)}
                aria-describedby={errors.city ? "city-error" : undefined}
                autoComplete="address-level2"
                maxLength={100}
              />
              {errors.city ? (
                <span id="city-error" className="error-text" role="alert">
                  {errors.city}
                </span>
              ) : null}
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
                aria-invalid={Boolean(errors.address)}
                aria-describedby={errors.address ? "address-error" : undefined}
                autoComplete="street-address"
                maxLength={200}
              />
              {errors.address ? (
                <span id="address-error" className="error-text" role="alert">
                  {errors.address}
                </span>
              ) : null}
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
                aria-invalid={Boolean(errors.postalCode)}
                aria-describedby={errors.postalCode ? "postalCode-error" : undefined}
                autoComplete="postal-code"
                inputMode="numeric"
                maxLength={6}
              />
              {errors.postalCode ? (
                <span id="postalCode-error" className="error-text" role="alert">
                  {errors.postalCode}
                </span>
              ) : null}
            </div>
          </section>
        ) : null}

        {step === 3 ? (
          <section className="checkout-step" aria-labelledby="checkout-step-heading">
            <h2 id="checkout-step-heading" ref={stepHeadingRef} tabIndex={-1}>
              Способ оплаты
            </h2>
            <fieldset className="payment-fieldset">
              <legend>Выберите подходящий способ оплаты</legend>
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
            </fieldset>
          </section>
        ) : null}

        {step === 4 ? (
          <section className="checkout-step" aria-labelledby="checkout-step-heading">
            <h2 id="checkout-step-heading" ref={stepHeadingRef} tabIndex={-1}>
              Подтверждение заказа
            </h2>
            <div className="order-summary-section">
              <h3>Проверьте контактные данные и адрес</h3>
              <p>
                <strong>ФИО:</strong> {formData.fullName}
              </p>
              <p>
                <strong>Телефон:</strong> {formData.phone}
              </p>
              <p>
                <strong>Email:</strong> {formData.email}
              </p>
              <p>
                <strong>Адрес:</strong> {formData.city}, {formData.address}, {formData.postalCode}
              </p>
              <p>
                <strong>Оплата:</strong> {paymentLabels[formData.paymentMethod]}
              </p>
            </div>
            <div className="order-items-summary">
              <h3>Товары в заказе</h3>
              {items.map((item) => (
                <div key={item.id} className="summary-item">
                  <span>
                    {item.title} x{item.quantity}
                  </span>
                  <span>{(item.price * item.quantity).toLocaleString("ru-RU")} ₽</span>
                </div>
              ))}
              <div className="summary-total">
                <strong>Итого:</strong>
                <strong>{totalAmount.toLocaleString("ru-RU")} ₽</strong>
              </div>
            </div>
          </section>
        ) : null}

        <div className="checkout-actions">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => {
                setStep((currentStep) => currentStep - 1);
                focusStepHeading();
              }}
              className="btn btn-secondary"
              disabled={loading}
            >
              Назад
            </button>
          ) : null}
          {step < 4 ? (
            <button type="button" onClick={handleNext} className="btn btn-primary">
              Далее
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} className="btn btn-primary" disabled={loading}>
              {loading ? "Оформление..." : "Подтвердить заказ"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
