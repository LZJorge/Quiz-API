"use strict";
/**
 * Main file
 *
 * @author Jorge L. Landaeta <dev.jorge2003@gmail.com>
 */
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
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router_1 = __importDefault(require("./routes/router"));
const db_1 = __importDefault(require("./config/db"));
const express_session_1 = __importDefault(require("express-session"));
const session_1 = __importDefault(require("./config/session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("./config/passport"));
require("pg");
require("pg-hstore");
(0, dotenv_1.config)();
class App {
    constructor() {
        this.port = process.env.PORT || 8000;
        this.app = (0, express_1.default)();
        this.router = new router_1.default();
        this.setMiddlewares();
        this.setRoutes();
    }
    setMiddlewares() {
        const accessLogStream = fs_1.default.createWriteStream('./access.log', { flags: 'a' });
        this.app.set("trust proxy", 1);
        this.app.use((0, morgan_1.default)('common', { stream: accessLogStream }));
        this.app.use(express_1.default.urlencoded({
            extended: true
        }));
        this.app.use(express_1.default.json());
        this.app.use((0, cookie_parser_1.default)());
        this.app.use(express_1.default.static(path_1.default.join(__dirname + '/public')));
        this.app.use((0, express_session_1.default)(session_1.default));
        this.app.use((0, cors_1.default)({
            origin: [process.env.APP_DOMAIN],
            methods: ["POST", "PUT", "PATCH", "GET", "OPTIONS", "HEAD", "DELETE"],
            credentials: true,
        }));
        this.app.use(passport_1.default.initialize());
        this.app.use(passport_1.default.session());
    }
    setDatabases() {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.default.sync();
        });
    }
    setRoutes() {
        this.app.use('/', this.router.getRoutes());
    }
    startServer() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setDatabases();
            this.server = this.app.listen(this.port);
            console.log(`\n🚀 Server running on http://localhost:${this.port} in ${process.env.NODE_ENV} mode 🚀`);
            console.log(`📅 Started at ${new Date()}`);
            console.log('\n🛑 Press CTRL-C to stop\n');
        });
    }
    stopServer() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.server.close();
        });
    }
    getApp() {
        return this.app;
    }
}
exports.default = App;
