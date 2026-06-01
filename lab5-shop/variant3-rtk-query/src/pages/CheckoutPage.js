import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../redux/slices/cartSlice";
import { useCreateOrderMutation } from "../redux/api/ordersApi";
import {
  validateAddress,
  validateCity,
  validateEmail,
  validateName,
  validatePhone,
  validatePostalCode,
  formatPhone,
  formatPostalCode,
} from "../utils/validation";

function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    postalCode: "",
    paymentMethod: "card",
  });

  const stepHeadingRef = useRef(null);

  useEffect(() => {
    document.title = `Оформление заказа - шаг ${step} - TechHub`;
  }, [step]);

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    }
  }, [items.length, navigate]);

  const focusStepHeading = () => {
    setTimeout(() => stepHeadingRef.current?.focus(), 50);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let nextValue = value;

    if (name === "phone") {
      nextValue = formatPhone(value);
    }

    if (name === "postalCode") {
      nextValue = formatPostalCode(value);
    }

    setFormData((previousState) => ({
      ...previousState,
      [name]: nextValue,
    }));

    if (errors[name]) {
      setErrors((previousState) => ({
        ...previousState,
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

  const handleBack = () => {
    setStep((currentStep) => currentStep - 1);
    focusStepHeading();
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

    await createOrder(orderData).unwrap();
    dispatch(clearCart());
    navigate("/orders");
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="container" aria-busy={isLoading}>
      <h1>Оформление заказа</h1>
      <p className="section-intro">
        Процесс состоит из четырех шагов. На последнем шаге вы сможете проверить все данные перед отправкой заказа.
      </p>

      <div className="checkout-progress" role="list" aria-label="Этапы оформления заказа">
        {[
          "Контактные данные",
          "Адрес доставки",
          "Способ оплаты",
          "Подтверждение",
        ].map((label, index) => {
          const stepNumber = index + 1;
          return (
            <div
              key={label}
              className={`progress-step ${step >= stepNumber ? "active" : ""}`}
              role="listitem"
              aria-current={step === stepNumber ? "step" : undefined}
            >
              <span className="step-number" aria-hidden="true">
                {stepNumber}
              </span>
              <span className="step-label">{label}</span>
            </div>
          );
        })}
      </div>

      <p className="page-status" aria-live="polite" role="status">
        Текущий шаг: {step} из 4.
      </p>

      <div className="checkout-content">
        {(step === 1 || step === 2) && Object.keys(errors).length > 0 ? (
          <div className="form-error-summary" role="alert">
            Исправьте ошибки в форме перед переходом к следующему шагу.
          </div>
        ) : null}

        {step === 1 && (
          <section className="checkout-step" aria-labelledby="checkout-step-heading">
            <h2 id="checkout-step-heading" ref={stepHeadingRef} tabIndex={-1}>
              Контактные данные
            </h2>
            <div className="form-group">
              <label htmlFor="checkout-full-name">ФИО *</label>
              <input
                type="text"
                id="checkout-full-name"
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
                type="tel"
                id="checkout-phone"
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
                type="email"
                id="checkout-email"
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
        )}

        {step === 2 && (
          <section className="checkout-step" aria-labelledby="checkout-step-heading">
            <h2 id="checkout-step-heading" ref={stepHeadingRef} tabIndex={-1}>
              Адрес доставки
            </h2>
            <div className="form-group">
              <label htmlFor="checkout-city">Город *</label>
              <input
                type="text"
                id="checkout-city"
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
                type="text"
                id="checkout-address"
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
                type="text"
                id="checkout-postal-code"
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
        )}

        {step === 3 && (
          <section className="checkout-step" aria-labelledby="checkout-step-heading">
            <h2 id="checkout-step-heading" ref={stepHeadingRef} tabIndex={-1}>
              Способ оплаты
            </h2>
            <fieldset className="payment-fieldset">
              <legend>Выберите подходящий способ оплаты</legend>
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
            </fieldset>
          </section>
        )}

        {step === 4 && (
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
                <strong>Оплата:</strong>{" "}
                {formData.paymentMethod === "card"
                  ? "Банковская карта"
                  : formData.paymentMethod === "cash"
                    ? "Наличными при получении"
                    : "Онлайн-оплата"}
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
        )}

        <div className="checkout-actions">
          {step > 1 ? (
            <button type="button" onClick={handleBack} className="btn btn-secondary" disabled={isLoading}>
              Назад
            </button>
          ) : null}
          {step < 4 ? (
            <button type="button" onClick={handleNext} className="btn btn-primary">
              Далее
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} className="btn btn-primary" disabled={isLoading}>
              {isLoading ? "Оформление..." : "Подтвердить заказ"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
