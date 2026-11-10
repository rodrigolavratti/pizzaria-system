export const formatPhone = (value: string): string => {
  const cleanValue = value.replace(/\D/g, "");

  if (cleanValue.length > 11) {
    return cleanValue.slice(0, 11);
  }

  if (cleanValue.length > 10) {
    return cleanValue.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
  } else if (cleanValue.length > 6) {
    return cleanValue.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  } else if (cleanValue.length > 2) {
    return cleanValue.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
  } else if (cleanValue.length > 0) {
    return cleanValue.replace(/^(\d*)/, "($1");
  }

  return "";
};
