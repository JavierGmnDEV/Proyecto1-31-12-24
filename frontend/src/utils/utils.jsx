// utils/validationUtils.js

// Valida que la fecha sea igual o posterior a la actual
export function isValidFutureDate(dateString) {
    const inputDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate >= today;
  }
  
  // Valida si un número está dentro de un rango
  export function isValidNumberInRange(value, min, max) {
    const number = parseFloat(value);
    return !isNaN(number) && number >= min && number <= max;
  }
  