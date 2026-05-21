export const validateEmail = (email) => {
  if (!email) {
    return "Email обязателен для заполнения";
  }
  if (!email.includes("@")) {
    return "Email должен содержать символ @";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Введите корректный email адрес";
  }
  return "";
};

export const validatePassword = (password) => {
  if (!password) {
    return "Пароль обязателен для заполнения";
  }
  if (password.length < 4) {
    return "Пароль должен содержать минимум 4 символа";
  }
  if (password.length > 50) {
    return "Пароль не может быть длиннее 50 символов";
  }
  return "";
};

export const validateName = (name) => {
  if (!name) {
    return "Имя обязательно для заполнения";
  }
  if (name.trim().length < 2) {
    return "Имя должно содержать минимум 2 символа";
  }
  if (name.length > 100) {
    return "Имя не может быть длиннее 100 символов";
  }
  return "";
};

export const validatePhone = (phone) => {
  if (!phone) {
    return "Телефон обязателен для заполнения";
  }

  const digitsOnly = phone.replace(/\D/g, "");
  if (digitsOnly.length < 10) {
    return "Телефон должен содержать минимум 10 цифр";
  }
  if (digitsOnly.length > 11) {
    return "Телефон не может содержать больше 11 цифр";
  }
  return "";
};

export const validateCity = (city) => {
  if (!city) {
    return "Город обязателен для заполнения";
  }
  if (city.trim().length < 2) {
    return "Название города должно содержать минимум 2 символа";
  }
  if (city.length > 100) {
    return "Название города не может быть длиннее 100 символов";
  }
  return "";
};

export const validateAddress = (address) => {
  if (!address) {
    return "Адрес обязателен для заполнения";
  }
  if (address.trim().length < 5) {
    return "Адрес должен содержать минимум 5 символов";
  }
  if (address.length > 200) {
    return "Адрес не может быть длиннее 200 символов";
  }
  return "";
};

export const validatePostalCode = (postalCode) => {
  if (!postalCode) {
    return "Индекс обязателен для заполнения";
  }

  const digitsOnly = postalCode.replace(/\D/g, "");
  if (digitsOnly.length !== 6) {
    return "Индекс должен содержать 6 цифр";
  }
  return "";
};

export const formatPhone = (value) => {
  const digitsOnly = value.replace(/\D/g, "");

  if (digitsOnly.length === 0) {
    return "";
  }

  let formatted = "+7";
  if (digitsOnly.length > 1) {
    formatted += ` (${digitsOnly.substring(1, 4)}`;
  }
  if (digitsOnly.length >= 5) {
    formatted += `) ${digitsOnly.substring(4, 7)}`;
  }
  if (digitsOnly.length >= 8) {
    formatted += `-${digitsOnly.substring(7, 9)}`;
  }
  if (digitsOnly.length >= 10) {
    formatted += `-${digitsOnly.substring(9, 11)}`;
  }

  return formatted;
};

export const formatPostalCode = (value) => value.replace(/\D/g, "").substring(0, 6);
