type ValidationRulesKeys = 'required';

export const ValidationRules: Record<ValidationRulesKeys, any> = {
  required: { value: true, message: 'Поле не может быть пустым' },
};
