const { body } = require('express-validator');

const validateProduct = [
    body('title')
        .isString()
        .trim()
        .withMessage('Title is required and must be a string'),
    body('description')
        .isString()
        .isLength({ min: 1 })
        .withMessage('Description is required and must be a string'),
    body('currency')
        .isIn(['USD', 'INR'])
        .withMessage('Currency must be USD or INR')
];

module.exports = { validateProduct };