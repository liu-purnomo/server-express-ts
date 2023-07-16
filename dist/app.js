"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const PORT = process.env.PORT || 3000;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("./middlewares");
const routers_1 = __importDefault(require("./routers"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/", routers_1.default);
app.use(middlewares_1.errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running on  http://localhost:${PORT}`);
});
//# sourceMappingURL=app.js.map