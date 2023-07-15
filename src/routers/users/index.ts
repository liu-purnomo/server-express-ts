import express, { Router } from "express";
import { UserController } from "../../controllers";
import { isLoggedIn } from "../../middlewares";
const router: Router = express.Router();

//list user
router.get("/", UserController.index);

router.post("/register", UserController.register);
router.post("/verify", UserController.verify);
router.post("/resend-email", UserController.resend);
router.post("/login", UserController.login);
router.patch("/change-password", isLoggedIn, UserController.changePassword);
router.patch("/forgot-password", UserController.forgotPassword);
router.post("/reset-password", UserController.resetPassword);

//detail user access by logged in user
router.get("/profile", isLoggedIn, UserController.profile);

//detail user access by public
router.get("/detail/:id", UserController.detail);

//update user detail
router.put("/update", isLoggedIn, UserController.update);

export default router;
