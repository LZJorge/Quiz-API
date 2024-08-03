"use strict";
/**
 * Helpers
 *
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
/**
 * Handles express validator erros
 */
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            message: 'Error de validación',
            errors: errors.array()
        });
        return;
    }
    next();
};
exports.default = handleValidationErrors;
