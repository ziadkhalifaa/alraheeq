import { body, validationResult } from 'express-validator';

export const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      await validation.run(req);
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      status: 'error',
      errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
    });
  };
};

export const productValidationRules = [
  body('name.ar').notEmpty().withMessage('Arabic name is required'),
  body('name.en').notEmpty().withMessage('English name is required'),
  body('description.ar').notEmpty().withMessage('Arabic description is required'),
  body('description.en').notEmpty().withMessage('English description is required'),
  body('slug').notEmpty().withMessage('Slug is required').isSlug().withMessage('Invalid slug format'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('image_url').notEmpty().withMessage('Image URL is required'),
  body('category_id').notEmpty().withMessage('Category ID is required'),
];

export const loginValidationRules = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
];
