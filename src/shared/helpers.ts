const onlyNumbers = (value: string) => value.replace(/\D/g, "");

export function formatRG(value: string) {
  let valueFormated = onlyNumbers(value).slice(0, 8);

  if (valueFormated.length > 2) valueFormated = valueFormated.replace(/^(\d{2})(\d)/, "$1.$2");
  if (valueFormated.length > 5) valueFormated = valueFormated.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");

  return valueFormated;
}

export function formatCpfCnpj(value: string) {
  let valueFormated = onlyNumbers(value);

  if (valueFormated.length <= 11) {
    valueFormated = valueFormated.slice(0, 11);
    valueFormated = valueFormated.replace(/(\d{3})(\d)/, "$1.$2");
    valueFormated = valueFormated.replace(/(\d{3})(\d)/, "$1.$2");
    valueFormated = valueFormated.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return valueFormated;
  }

  valueFormated = valueFormated.slice(0, 14);
  valueFormated = valueFormated.replace(/^(\d{2})(\d)/, "$1.$2");
  valueFormated = valueFormated.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  valueFormated = valueFormated.replace(/\.(\d{3})(\d)/, ".$1/$2");
  valueFormated = valueFormated.replace(/(\d{4})(\d)/, "$1-$2");

  return valueFormated;
}

export function formatPhone(value: string) {
  let valueFormated = onlyNumbers(value).slice(0, 11);

  if (valueFormated.length <= 10) {
    valueFormated = valueFormated.replace(/^(\d{2})(\d)/, "($1) $2");
    valueFormated = valueFormated.replace(/(\d{4})(\d)/, "$1-$2");
  } else {
    valueFormated = valueFormated.replace(/^(\d{2})(\d)/, "($1) $2");
    valueFormated = valueFormated.replace(/(\d{5})(\d)/, "$1-$2");
  }

  return valueFormated;
}
