import express from "express";
import { logIn, register , googleLogIn } from "../controllers/userController.js";

const authRouter = express.Router();

authRouter.post("/login", logIn);
authRouter.post("/register", register);
authRouter.get("/google", googleLogIn);

export { authRouter };
