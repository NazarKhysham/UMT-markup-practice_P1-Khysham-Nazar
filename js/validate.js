function setFieldValidity(field, isValid) {
  field.classList.toggle('is-invalid', !isValid);
}

function validateField(input) {
  const field = input.closest('.order-form__field');
  if (!field) return true;

  const isValid = input.checkValidity();
  setFieldValidity(field, isValid);
  return isValid;
}

export function initOrderFormValidation(form) {
  const inputs = form.querySelectorAll('.order-form__input[required], .order-form__input[pattern]');
  const checkbox = form.querySelector('.checkbox__input');

  inputs.forEach((input) => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.closest('.order-form__field').classList.contains('is-invalid')) {
        validateField(input);
      }
    });
  });

  if (checkbox) {
    checkbox.addEventListener('change', () => {
      if (checkbox.closest('.order-form__field').classList.contains('is-invalid')) {
        validateField(checkbox);
      }
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let isFormValid = true;
    inputs.forEach((input) => {
      if (!validateField(input)) isFormValid = false;
    });

    if (checkbox && !validateField(checkbox)) {
      isFormValid = false;
    }

    if (!isFormValid) return;

    form.dispatchEvent(new CustomEvent('order:submit', { detail: new FormData(form) }));
  });
}
