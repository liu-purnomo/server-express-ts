"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../../controllers");
const middlewares_1 = require("../../middlewares");
const router = express_1.default.Router();
//list user
router.get("/", controllers_1.UserController.index);
router.post("/register", controllers_1.UserController.register);
router.post("/verify", controllers_1.UserController.verify);
router.post("/resend-email", controllers_1.UserController.resend);
router.post("/login", controllers_1.UserController.login);
router.patch("/change-password", middlewares_1.isLoggedIn, controllers_1.UserController.changePassword);
router.patch("/forgot-password", controllers_1.UserController.forgotPassword);
router.post("/reset-password", controllers_1.UserController.resetPassword);
//detail user access by logged in user
router.get("/profile", middlewares_1.isLoggedIn, controllers_1.UserController.profile);
//detail user access by public
router.get("/detail/:id", controllers_1.UserController.detail);
//update user detail
router.put("/update", middlewares_1.isLoggedIn, controllers_1.UserController.update);
exports.default = router;
//# sourceMappingURL=index.js.map