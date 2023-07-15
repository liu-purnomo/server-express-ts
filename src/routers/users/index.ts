import express, { Router } from "express";
import { UserController } from "../../controllers";
import { isLoggedIn } from "../../middlewares";
const router: Router = express.Router();

router.post("/register", UserController.register);
router.post("/verify", UserController.verify);
router.post("/resend-email", UserController.resend);
router.post("/login", UserController.login);
router.patch("/change-password", isLoggedIn, UserController.changePassword);
router.patch("/forgot-password", UserController.forgotPassword);
router.post("/reset-password", UserController.resetPassword);

export default router;
