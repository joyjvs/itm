// Validadores auxiliares
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isStrongPassword = (password: string): boolean => {
  // Mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return strongRegex.test(password);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isEmptyString = (str: string): boolean => {
  return !str || str.trim().length === 0;
};

export const isValidProjectName = (name: string): boolean => {
  return name.length >= 3 && name.length <= 100;
};

export const isValidTaskName = (name: string): boolean => {
  return name.length >= 3 && name.length <= 200;
};
