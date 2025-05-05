import { Router } from "express";
import authController from "../controllers/authController";

const authRoute = Router();
authRoute.post('/register', authController.register);
authRoute.post('/login', authController.login);


export default authRoute;