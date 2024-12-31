import { useState } from "react";

export const useFormValidation = (initialValues, validateRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });

    // Validar campo específico
    const fieldErrors = validateRules[name]?.map((rule) => rule(value)).filter((error) => error);
    setErrors({ ...errors, [name]: fieldErrors?.[0] || null });
  };

  const validateAllFields = () => {
    const newErrors = {};
    for (const field in validateRules) {
      const fieldErrors = validateRules[field]?.map((rule) => rule(values[field])).filter((error) => error);
      if (fieldErrors.length > 0) {
        newErrors[field] = fieldErrors[0];
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  return { values, errors, handleChange, validateAllFields, setValues };
};
