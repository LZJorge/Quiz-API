"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const categoryService_1 = __importDefault(require("../services/categoryService"));
const definitions_1 = require("../definitions");
class CategoryController {
    /**
     * Get all categories
     * @url '/category/get'
     * @method GET
     */
    static getCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield categoryService_1.default.getAllCategories();
                res.status(200).json({
                    code: definitions_1.RESPONSE_CODE.SUCCESS,
                    categories
                });
            }
            catch (error) {
                res.status(500).json({
                    code: definitions_1.RESPONSE_CODE.ERROR,
                    message: 'Ocurrió un error al obtener las categorias'
                });
            }
        });
    }
}
exports.default = CategoryController;
