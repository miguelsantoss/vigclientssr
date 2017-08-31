import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

const validateInput = (data) => {
  const errors = {};

  if (Validator.isEmpty(data.identifier)) {
    errors.identifier = 'This field is Required!';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'This field is Required!';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export default validateInput;
