"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
};
exports.default = sessionConfig;
